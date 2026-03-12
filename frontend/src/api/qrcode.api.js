import {apiClient} from './axios';

export const generateQRCode = async (qrData) => {
    try {
        const response = await apiClient.post('/qrcodes/create', qrData);
        return response.data;
    } catch (error) {
        console.error("Error generating QR code:", error);
        throw error.response?.data || error.message;
    }
};

export const createQRWithFile = async (formData) => {
    try {
        const response = await apiClient.post('/qrcodes/create-with-file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error generating QR code with file:", error);
        throw error.response?.data || error.message;
    }
};

export const fetchMyQRCodes = async () => {
    try {
        const response = await apiClient.get('/qrcodes/my-qrs');
        return response.data;
    } catch (error) {
        console.error("Error fetching QR codes:", error);
        throw error.response?.data || error.message;
    }
};

export const updateQRCode = async (id, updateData) => {
    try {
        const response = await apiClient.put(`/qrcodes/${id}`, updateData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// NEW: Delete QR Code
export const deleteQRCode = async (id) => {
    try {
        const response = await apiClient.delete(`/qrcodes/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};