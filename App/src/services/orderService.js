import axios from 'axios';
import BASE_URL from '../config';

const API_URL = `${BASE_URL}/api/v1/orders`;

// Helper function to get auth header
const getAuthHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
});

export const createOrder = async (orderData) => {
    try {
        const response = await axios.post(API_URL, orderData, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Create order error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create order'
        };
    }
};

export const getOrderById = async (orderId) => {
    try {
        const response = await axios.get(`${API_URL}/${orderId}`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Get order error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to retrieve order'
        };
    }
};

export const getUserOrders = async () => {
    try {
        const response = await axios.get(API_URL, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Get user orders error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to retrieve orders'
        };
    }
};

export const updateOrderStatus = async (orderId, updateData) => {
    try {
        const response = await axios.patch(`${API_URL}/${orderId}`, updateData, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Update order error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update order'
        };
    }
};
