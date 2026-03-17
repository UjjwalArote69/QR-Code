import { Op, fn, col } from 'sequelize';
import { sequelize } from '../config/db.js';
import ScanEvent from '../models/scanEvent.model.js';
import QRCode from '../models/qrcode.model.js';
import logger from '../config/logger.js';

function getDateRange(period) {
  const now = new Date();
  const start = new Date(now);
  switch (period) {
    case '24h': start.setHours(start.getHours() - 24); break;
    case '7d':  start.setDate(start.getDate() - 7); break;
    case '30d': start.setDate(start.getDate() - 30); break;
    case '90d': start.setDate(start.getDate() - 90); break;
    default:    start.setDate(start.getDate() - 7); break;
  }
  return { start, end: now };
}

export const getOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '7d' } = req.query;
    const { start, end } = getDateRange(period);

    const userQRs = await QRCode.findAll({
      where: { userId },
      attributes: ['id'],
      raw: true,
    });
    const qrIds = userQRs.map(q => q.id);

    if (qrIds.length === 0) {
      return res.json({
        success: true,
        data: { totalScans: 0, uniqueVisitors: 0, activeCampaigns: 0 },
      });
    }

    const where = { qrCodeId: { [Op.in]: qrIds }, scannedAt: { [Op.between]: [start, end] } };

    const [totalScans, uniqueVisitors, activeCampaigns] = await Promise.all([
      ScanEvent.count({ where }),
      ScanEvent.count({ where, distinct: true, col: 'ip' }),
      QRCode.count({ where: { userId, isActive: true } }),
    ]);

    const prevStart = new Date(start);
    const diff = end - start;
    prevStart.setTime(prevStart.getTime() - diff);
    const prevWhere = { qrCodeId: { [Op.in]: qrIds }, scannedAt: { [Op.between]: [prevStart, start] } };

    const [prevScans, prevUnique] = await Promise.all([
      ScanEvent.count({ where: prevWhere }),
      ScanEvent.count({ where: prevWhere, distinct: true, col: 'ip' }),
    ]);

    const scansTrend = prevScans === 0 ? (totalScans > 0 ? 100 : 0) : (((totalScans - prevScans) / prevScans) * 100);
    const uniqueTrend = prevUnique === 0 ? (uniqueVisitors > 0 ? 100 : 0) : (((uniqueVisitors - prevUnique) / prevUnique) * 100);

    res.json({
      success: true,
      data: {
        totalScans,
        uniqueVisitors,
        activeCampaigns,
        scansTrend: Math.round(scansTrend * 10) / 10,
        uniqueTrend: Math.round(uniqueTrend * 10) / 10,
      },
    });
  } catch (error) {
    logger.error('Analytics overview failed', { userId: req.user?.id, period: req.query?.period, error: error.message });
    res.status(500).json({ success: false, message: 'Failed to fetch analytics overview.' });
  }
};

export const getTimeseries = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '7d' } = req.query;
    const { start, end } = getDateRange(period);

    const userQRs = await QRCode.findAll({
      where: { userId },
      attributes: ['id'],
      raw: true,
    });
    const qrIds = userQRs.map(q => q.id);

    if (qrIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const results = await ScanEvent.findAll({
      where: { qrCodeId: { [Op.in]: qrIds }, scannedAt: { [Op.between]: [start, end] } },
      attributes: [
        [fn('DATE', col('scannedAt')), 'date'],
        [fn('COUNT', col('id')), 'scans'],
      ],
      group: [fn('DATE', col('scannedAt'))],
      order: [[fn('DATE', col('scannedAt')), 'ASC']],
      raw: true,
    });

    const dateMap = {};
    results.forEach(r => { dateMap[r.date] = parseInt(r.scans, 10); });

    const filled = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      const key = cursor.toISOString().split('T')[0];
      filled.push({ date: key, scans: dateMap[key] || 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    res.json({ success: true, data: filled });
  } catch (error) {
    logger.error('Analytics timeseries failed', { userId: req.user?.id, error: error.message });
    res.status(500).json({ success: false, message: 'Failed to fetch timeseries data.' });
  }
};

export const getDeviceBreakdown = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '7d' } = req.query;
    const { start, end } = getDateRange(period);

    const userQRs = await QRCode.findAll({
      where: { userId },
      attributes: ['id'],
      raw: true,
    });
    const qrIds = userQRs.map(q => q.id);

    if (qrIds.length === 0) {
      return res.json({ success: true, data: { os: [], deviceType: [] } });
    }

    const where = { qrCodeId: { [Op.in]: qrIds }, scannedAt: { [Op.between]: [start, end] } };

    const [osCounts, deviceCounts] = await Promise.all([
      ScanEvent.findAll({
        where,
        attributes: ['os', [fn('COUNT', col('id')), 'count']],
        group: ['os'],
        order: [[fn('COUNT', col('id')), 'DESC']],
        limit: 10,
        raw: true,
      }),
      ScanEvent.findAll({
        where,
        attributes: ['deviceType', [fn('COUNT', col('id')), 'count']],
        group: ['deviceType'],
        order: [[fn('COUNT', col('id')), 'DESC']],
        raw: true,
      }),
    ]);

    res.json({
      success: true,
      data: {
        os: osCounts.map(r => ({ name: r.os || 'Unknown', count: parseInt(r.count, 10) })),
        deviceType: deviceCounts.map(r => ({ name: r.deviceType || 'Unknown', count: parseInt(r.count, 10) })),
      },
    });
  } catch (error) {
    logger.error('Analytics devices failed', { userId: req.user?.id, error: error.message });
    res.status(500).json({ success: false, message: 'Failed to fetch device data.' });
  }
};

export const getGeoBreakdown = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '7d' } = req.query;
    const { start, end } = getDateRange(period);

    const userQRs = await QRCode.findAll({
      where: { userId },
      attributes: ['id'],
      raw: true,
    });
    const qrIds = userQRs.map(q => q.id);

    if (qrIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const where = { qrCodeId: { [Op.in]: qrIds }, scannedAt: { [Op.between]: [start, end] } };

    const results = await ScanEvent.findAll({
      where,
      attributes: [
        'country',
        'city',
        [fn('COUNT', col('id')), 'scans'],
      ],
      group: ['country', 'city'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      limit: 10,
      raw: true,
    });

    res.json({
      success: true,
      data: results.map(r => ({
        country: r.country || 'Unknown',
        city: r.city || 'Unknown',
        scans: parseInt(r.scans, 10),
      })),
    });
  } catch (error) {
    logger.error('Analytics geo failed', { userId: req.user?.id, error: error.message });
    res.status(500).json({ success: false, message: 'Failed to fetch geo data.' });
  }
};

export const getTopCampaigns = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '7d' } = req.query;
    const { start, end } = getDateRange(period);

    const userQRs = await QRCode.findAll({
      where: { userId },
      attributes: ['id'],
      raw: true,
    });
    const qrIds = userQRs.map(q => q.id);

    if (qrIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const results = await ScanEvent.findAll({
      where: { qrCodeId: { [Op.in]: qrIds }, scannedAt: { [Op.between]: [start, end] } },
      attributes: [
        'qrCodeId',
        [fn('COUNT', col('ScanEvent.id')), 'scans'],
      ],
      include: [{
        model: QRCode,
        as: 'qrCode',
        attributes: ['title', 'shortId', 'qrType'],
      }],
      group: ['qrCodeId', 'qrCode.id'],
      order: [[fn('COUNT', col('ScanEvent.id')), 'DESC']],
      limit: 5,
      raw: false,
    });

    res.json({
      success: true,
      data: results.map(r => ({
        title: r.qrCode?.title,
        shortId: r.qrCode?.shortId,
        qrType: r.qrCode?.qrType,
        scans: parseInt(r.dataValues.scans, 10),
      })),
    });
  } catch (error) {
    logger.error('Analytics top campaigns failed', { userId: req.user?.id, error: error.message });
    res.status(500).json({ success: false, message: 'Failed to fetch top campaigns.' });
  }
};
