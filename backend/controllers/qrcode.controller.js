import crypto from "crypto";
import QRCode from "../models/qrcode.model.js";

export const createQRCode = async (
  req,
  res,
) => {
  try {
    const { title, qrType, targetUrl } =
      req.body;

    // NOTE: Make sure your auth middleware attaches the logged-in user to req.user
    const userId = req.user.id;

    // Generate a random 8-character string for the short URL
    const shortId = crypto
      .randomBytes(4)
      .toString("hex");

    const newQR = await QRCode.create({
      userId,
      title: title || "Untitled QR",
      qrType,
      shortId,
      targetUrl,
    });

    // Generate the tracking link (Falls back to localhost for dev)
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
    res
      .status(500)
      .json({
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
    res
      .status(500)
      .json({
        success: false,
        message:
          "Failed to fetch QR codes.",
      });
  }
};

// Update an existing QR Code
export const updateQRCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, targetUrl, isActive } = req.body;
    const userId = req.user.id; // Ensure user owns this QR

    const qrCode = await QRCode.findOne({ where: { id, userId } });

    if (!qrCode) {
      return res.status(404).json({ success: false, message: "QR Code not found or unauthorized." });
    }

    // Update fields if they are provided
    if (title) qrCode.title = title;
    if (targetUrl) qrCode.targetUrl = targetUrl;
    if (isActive !== undefined) qrCode.isActive = isActive;

    await qrCode.save();

    res.status(200).json({
      success: true,
      message: "QR Code updated successfully",
      data: qrCode
    });
  } catch (error) {
    console.error("Error updating QR code:", error);
    res.status(500).json({ success: false, message: "Failed to update QR code." });
  }
};

// Delete a QR Code
export const deleteQRCode = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const qrCode = await QRCode.findOne({ where: { id, userId } });

    if (!qrCode) {
      return res.status(404).json({ success: false, message: "QR Code not found or unauthorized." });
    }

    await qrCode.destroy();

    res.status(200).json({
      success: true,
      message: "QR Code deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting QR code:", error);
    res.status(500).json({ success: false, message: "Failed to delete QR code." });
  }
};