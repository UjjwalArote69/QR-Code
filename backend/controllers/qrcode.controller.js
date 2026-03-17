import crypto from "crypto";
import QRCode from "../models/qrcode.model.js";
import ScanEvent from "../models/scanEvent.model.js";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import logger from "../config/logger.js";

export const createQRCode = async (req, res) => {
  try {
    const { title, qrType, targetUrl, content } = req.body;
    const userId = req.user.id;

    const shortId = crypto.randomBytes(4).toString("hex");

    const newQR = await QRCode.create({
      userId,
      title: title || "Untitled QR",
      qrType,
      shortId,
      targetUrl,
      content: content ? JSON.stringify(content) : null,
    });

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const qrLink = `${baseUrl}/q/${shortId}`;

    logger.info('QR code created', { userId, qrId: newQR.id, qrType, shortId });

    res.status(201).json({ success: true, data: newQR, qrLink });
  } catch (error) {
    logger.error("QR code creation failed", { userId: req.user?.id, error: error.message });
    res.status(500).json({ success: false, message: "Failed to generate QR code." });
  }
};

export const redirectQR = async (req, res) => {
  try {
    const { shortId } = req.params;

    const qrCode = await QRCode.findOne({ where: { shortId, isActive: true } });

    if (!qrCode) {
      return res.status(404).send("<h2>QR Code not found or inactive.</h2>");
    }

    await qrCode.increment("scanCount");

    // Capture detailed scan metadata
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
    }).catch(err => logger.error('Failed to log scan event', { shortId, error: err.message }));

    logger.debug('QR scan', { shortId, ip: ip || 'localhost', os: ua.getOS().name, country: geo?.country });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    if (qrCode.qrType === "vCard Plus") return res.redirect(`${frontendUrl}/vcard/${shortId}`);
    if (qrCode.qrType === "List of links") return res.redirect(`${frontendUrl}/links/${shortId}`);
    if (qrCode.qrType === 'Social Media' || qrCode.qrType === 'Social') return res.redirect(`${frontendUrl}/social/${shortId}`);
    if (qrCode.qrType === 'Business') return res.redirect(`${frontendUrl}/business/${shortId}`);
    if (qrCode.qrType === 'Coupon') return res.redirect(`${frontendUrl}/coupon/${shortId}`);
    if (qrCode.qrType === 'App Store' || qrCode.qrType === 'App') return res.redirect(`${frontendUrl}/app/${shortId}`);
    if (qrCode.qrType === 'Landing page' || qrCode.qrType === 'Landing Page') return res.redirect(`${frontendUrl}/landing/${shortId}`);

    res.redirect(qrCode.targetUrl);
  } catch (error) {
    logger.error("QR redirect failed", { shortId: req.params?.shortId, error: error.message });
    res.status(500).send("<h2>Server Error</h2>");
  }
};

export const getUserQRCodes = async (req, res) => {
  try {
    const userId = req.user.id;
    const qrCodes = await QRCode.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: qrCodes });
  } catch (error) {
    logger.error("Fetch QR codes failed", { userId: req.user?.id, error: error.message });
    res.status(500).json({ success: false, message: "Failed to fetch QR codes." });
  }
};

export const updateQRCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, targetUrl, isActive } = req.body;
    const userId = req.user.id;

    const qrCode = await QRCode.findOne({ where: { id, userId } });

    if (!qrCode) {
      return res.status(404).json({ success: false, message: "QR Code not found or unauthorized." });
    }

    if (title) qrCode.title = title;
    if (targetUrl) qrCode.targetUrl = targetUrl;
    if (isActive !== undefined) qrCode.isActive = isActive;

    await qrCode.save();
    logger.info('QR code updated', { userId, qrId: id });

    res.status(200).json({ success: true, message: "QR Code updated successfully", data: qrCode });
  } catch (error) {
    logger.error("QR code update failed", { userId: req.user?.id, qrId: req.params?.id, error: error.message });
    res.status(500).json({ success: false, message: "Failed to update QR code." });
  }
};

export const deleteQRCode = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const qrCode = await QRCode.findOne({ where: { id, userId } });

    if (!qrCode) {
      return res.status(404).json({ success: false, message: "QR Code not found or unauthorized." });
    }

    await qrCode.destroy();
    logger.info('QR code deleted', { userId, qrId: id });

    res.status(200).json({ success: true, message: "QR Code deleted successfully" });
  } catch (error) {
    logger.error("QR code deletion failed", { userId: req.user?.id, qrId: req.params?.id, error: error.message });
    res.status(500).json({ success: false, message: "Failed to delete QR code." });
  }
};

export const createQRWithFile = async (req, res) => {
  try {
    const { title, qrType } = req.body;
    const userId = req.user.id;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ success: false, message: "No file uploaded or file upload failed." });
    }

    const targetUrl = req.file.path;
    const shortId = crypto.randomBytes(4).toString("hex");

    const newQR = await QRCode.create({
      userId,
      title: title || "Untitled Document QR",
      qrType,
      shortId,
      targetUrl,
    });

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const qrLink = `${baseUrl}/q/${shortId}`;

    logger.info('QR code with file created', { userId, qrId: newQR.id, qrType, shortId });

    res.status(201).json({ success: true, data: newQR, qrLink });
  } catch (error) {
    logger.error("QR code with file creation failed", { userId: req.user?.id, error: error.message });
    res.status(500).json({ success: false, message: "Failed to generate file QR code." });
  }
};

export const getPublicQR = async (req, res) => {
  try {
    const { shortId } = req.params;

    const qrCode = await QRCode.findOne({
      where: { shortId, isActive: true },
      attributes: ["title", "qrType", "content"],
    });

    if (!qrCode) {
      return res.status(404).json({ success: false, message: "QR Code not found" });
    }

    let parsedContent = null;
    if (qrCode.content) {
      parsedContent = typeof qrCode.content === "string" ? JSON.parse(qrCode.content) : qrCode.content;
    }

    res.status(200).json({
      success: true,
      data: { ...qrCode.toJSON(), content: parsedContent },
    });
  } catch (error) {
    logger.error("Fetch public QR failed", { shortId: req.params?.shortId, error: error.message });
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
