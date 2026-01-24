// Shiprocket API Integration

// NOTE: in a production environment, you should proxy these requests through your own backend
// to avoid exposing your API credentials and to handle CORS issues.
// Shiprocket API does not typically support direct calls from the browser due to CORS.

const SHIPROCKET_API_BASE = '/api/shiprocket';
const SHIPROCKET_TOKEN = 'pxfJ28oeG@G%!DhwjhentXz26^UfvquV';

/**
 * Check serviceability for a pincode
 * @param {string} pickupPostcode - Your warehouse pincode (defaulting to a common one or you need to configure this)
 * @param {string} deliveryPostcode - Customer's pincode
 * @param {number} weight - Weight in kg (default 0.5)
 * @param {number} cod - 1 for COD, 0 for Prepaid (default 1)
 */
export const checkServiceability = async (deliveryPostcode, pickupPostcode = '700001', weight = 0.5, cod = 1) => {
    try {
        const url = `${SHIPROCKET_API_BASE}/courier/serviceability/?pickup_postcode=${pickupPostcode}&delivery_postcode=${deliveryPostcode}&weight=${weight}&cod=${cod}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SHIPROCKET_TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error('Serviceability API failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Shiprocket Serviceability Error:', error);
        throw error;
    }
};

/**
 * Track an order by AWB or Order ID
 * @param {string} awbCode 
 * @param {string} orderId
 */
export const trackOrder = async ({ awbCode, orderId }) => {
    try {
        let url = '';
        if (awbCode) {
            url = `${SHIPROCKET_API_BASE}/courier/track/awb/${awbCode}`;
        } else if (orderId) {
            // Note: Tracking by Order ID typically requires looking up the AWB first via another endpoint
            // or using the specific channel order tracking endpoint.
            // For simplicity, we'll try the generic tracking endpoint if available or assume AWB is passed.
            // Shiprocket tracking by Order ID: /courier/track/order/{order_id}
            url = `${SHIPROCKET_API_BASE}/courier/track/order/${orderId}`;
        } else {
            throw new Error('AWB Code or Order ID required');
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SHIPROCKET_TOKEN}`
            }
        });

        if (!response.ok) {
            throw new Error('Tracking API failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Shiprocket Tracking Error:', error);
        throw error;
    }
};

/**
 * Format Shiprocket response for frontend use
 */
export const formatServiceabilityResponse = (data) => {
    // Shiprocket returns structure like data.data.available_courier_companies
    const companies = data?.data?.available_courier_companies || [];
    if (companies.length === 0) {
        return { serviceable: false };
    }

    // Find best courier (e.g., fastest or cheapest)
    // For now, take the first one or logic to pick likely one
    const courier = companies[0];

    return {
        serviceable: true,
        city: data?.data?.city || '',
        state: data?.data?.state || '',
        days: courier.etd || '3-5', // ETD is usually in hours or days, need to check specific response
        cod: courier.cod === 1,
        courierName: courier.courier_name,
        returnAvailable: true // Assuming policy
    };
};
