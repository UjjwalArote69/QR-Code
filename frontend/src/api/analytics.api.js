import { apiClient } from './axios';

export const fetchOverview = async (period = '7d') => {
  const response = await apiClient.get('/analytics/overview', { params: { period } });
  return response.data;
};

export const fetchTimeseries = async (period = '7d') => {
  const response = await apiClient.get('/analytics/timeseries', { params: { period } });
  return response.data;
};

export const fetchDevices = async (period = '7d') => {
  const response = await apiClient.get('/analytics/devices', { params: { period } });
  return response.data;
};

export const fetchGeo = async (period = '7d') => {
  const response = await apiClient.get('/analytics/geo', { params: { period } });
  return response.data;
};

export const fetchTopCampaigns = async (period = '7d') => {
  const response = await apiClient.get('/analytics/top-campaigns', { params: { period } });
  return response.data;
};
