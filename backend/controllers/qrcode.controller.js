import crypto from "crypto";
import QRCode from "../models/qrcode.model.js";
import ScanEvent from "../models/scanEvent.model.js";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";

export const createQRCode = async (
  req,
  res,
) => {
  try {
    const {
      title,
      qrType,
      targetUrl,
      content,
    } = req.body;
    const userId = req.user.id;

    const shortId = crypto
      .randomBytes(4)
      .toString("hex");

    const newQR = await QRCode.create({
      userId,
      title: title || "Untitled QR",
      qrType,
      shortId,
      targetUrl,
      // NEW: Force the object into a text string
      content: content
        ? JSON.stringify(content)
        : null,
    });

    const baseUrl =
      process.env.BASE_URL ||
      "http://localhost:5000";
    const qrLink = `${baseUrl}/q/${shortId}`;

    res.status(201).json({
      success: true,
      data: newQR,
      qrLink,
    });
  } catch (error) {
    console.error(
      "Error creating QR code:",
      error,
    );
    res.status(500).json({
      success: false,
      message:
        "Failed to generate QR code.",
    });
  }
};

// This handles what happens when someone SCANS the code
export const redirectQR = async (
  req,
  res,
) => {
  try {
    const { shortId } = req.params;

    const qrCode = await QRCode.findOne(
      {
        where: {
          shortId,
          isActive: true,
        },
      },
    );

    if (!qrCode) {
      return res
        .status(404)
        .send(
          "<h2>QR Code not found or inactive.</h2>",
        );
    }

    // Increment scan analytics tracking
    await qrCode.increment("scanCount");

    // --- Capture detailed scan metadata ---
    const rawIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.socket?.remoteAddress;
    const ip = rawIp === '::1' || rawIp === '127.0.0.1' ? null : rawIp;
    const geo = ip ? geoip.lookup(ip) : null;
    const ua = new UAParser(req.headers['user-agent']);
    const device = ua.getDevice();

    ScanEvent.create({
      qrCodeId: qrCode.id,
      country: geo?.country || null,
      region: geo?.region || null,
      city: geo?.city || null,
      latitude: geo?.ll?.[0] || null,
      longitude: geo?.ll?.[1] || null,
      browser: ua.getBrowser().name || null,
      os: ua.getOS().name || null,
      deviceType: device.type || 'desktop',
      referrer: req.headers['referer'] || null,
      ip,
      scannedAt: new Date(),
    }).catch(err => console.error('Failed to log scan event:', err));

    const frontendUrl =
      process.env.FRONTEND_URL ||
      "http://localhost:5173";

    // NEW: If it's a vCard, redirect to the frontend profile page
    if (
      qrCode.qrType === "vCard Plus"
    ) {
      return res.redirect(
        `${frontendUrl}/vcard/${shortId}`,
      );
    }

    // 2. NEW: Redirect for List of Links
    if (
      qrCode.qrType === "List of links"
    ) {
      return res.redirect(
        `${frontendUrl}/links/${shortId}`,
      );
    }

    // 3. Social Media links
    if (qrCode.qrType === 'Social Media' || qrCode.qrType === 'Social') {
      return res.redirect(`${frontendUrl}/social/${shortId}`);
    }

    //4. Business Links
    if (qrCode.qrType === 'Business') {
      return res.redirect(`${frontendUrl}/business/${shortId}`);
    }

    // NEW: Redirect for Coupon
    if (qrCode.qrType === 'Coupon') {
      return res.redirect(`${frontendUrl}/coupon/${shortId}`);
    }

    if (qrCode.qrType === 'App Store' || qrCode.qrType === 'App') {
      return res.redirect(`${frontendUrl}/app/${shortId}`);
    }

    if (qrCode.qrType === 'Landing page' || qrCode.qrType === 'Landing Page') {
      return res.redirect(`${frontendUrl}/landing/${shortId}`);
    }
    // Redirect user to their actual destination
    res.redirect(qrCode.targetUrl);
  } catch (error) {
    console.error(
      "Error redirecting QR:",
      error,
    );
    res
      .status(500)
      .send("<h2>Server Error</h2>");
  }
};

export const getUserQRCodes = async (
  req,
  res,
) => {
  try {
    const userId = req.user.id; // Get the ID from the protect middleware

    // Fetch all QR codes belonging to this user, ordered by newest first
    const qrCodes =
      await QRCode.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });

    res.status(200).json({
      success: true,
      data: qrCodes,
    });
  } catch (error) {
    console.error(
      "Error fetching QR codes:",
      error,
    );
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch QR codes.",
    });
  }
};

// Update an existing QR Code
export const updateQRCode = async (
  req,
  res,
) => {
  try {
    const { id } = req.params;
    const {
      title,
      targetUrl,
      isActive,
    } = req.body;
    const userId = req.user.id; // Ensure user owns this QR

    const qrCode = await QRCode.findOne(
      { where: { id, userId } },
    );

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message:
          "QR Code not found or unauthorized.",
      });
    }

    // Update fields if they are provided
    if (title) qrCode.title = title;
    if (targetUrl)
      qrCode.targetUrl = targetUrl;
    if (isActive !== undefined)
      qrCode.isActive = isActive;

    await qrCode.save();

    res.status(200).json({
      success: true,
      message:
        "QR Code updated successfully",
      data: qrCode,
    });
  } catch (error) {
    console.error(
      "Error updating QR code:",
      error,
    );
    res.status(500).json({
      success: false,
      message:
        "Failed to update QR code.",
    });
  }
};

// Delete a QR Code
export const deleteQRCode = async (
  req,
  res,
) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const qrCode = await QRCode.findOne(
      { where: { id, userId } },
    );

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message:
          "QR Code not found or unauthorized.",
      });
    }

    await qrCode.destroy();

    res.status(200).json({
      success: true,
      message:
        "QR Code deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting QR code:",
      error,
    );
    res.status(500).json({
      success: false,
      message:
        "Failed to delete QR code.",
    });
  }
};

export const createQRWithFile = async (
  req,
  res,
) => {
  try {
    const { title, qrType } = req.body;
    const userId = req.user.id;

    // The Cloudinary URL is attached to req.file.path by the upload middleware
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message:
          "No file uploaded or file upload failed.",
      });
    }

    const targetUrl = req.file.path; // The secure Cloudinary URL

    // Generate short URL
    const shortId = crypto
      .randomBytes(4)
      .toString("hex");

    const newQR = await QRCode.create({
      userId,
      title:
        title || "Untitled Document QR",
      qrType,
      shortId,
      targetUrl,
    });

    const baseUrl =
      process.env.BASE_URL ||
      "http://localhost:5000";
    const qrLink = `${baseUrl}/q/${shortId}`;

    res.status(201).json({
      success: true,
      data: newQR,
      qrLink,
    });
  } catch (error) {
    console.error(
      "Error creating QR code with file:",
      error,
    );
    res.status(500).json({
      success: false,
      message:
        "Failed to generate file QR code.",
    });
  }
};

export const getPublicQR = async (
  req,
  res,
) => {
  try {
    const { shortId } = req.params;

    const qrCode = await QRCode.findOne(
      {
        where: {
          shortId,
          isActive: true,
        },
        attributes: [
          "title",
          "qrType",
          "content",
        ],
      },
    );

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: "QR Code not found",
      });
    }

    // NEW: Parse the text string back into a usable object
    let parsedContent = null;
    if (qrCode.content) {
      parsedContent =
        typeof qrCode.content ===
        "string"
          ? JSON.parse(qrCode.content)
          : qrCode.content;
    }

    res.status(200).json({
      success: true,
      data: {
        ...qrCode.toJSON(),
        content: parsedContent, // Send the parsed object to the frontend
      },
    });
  } catch (error) {
    console.error(
      "Error fetching public QR:",
      error,
    );
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
