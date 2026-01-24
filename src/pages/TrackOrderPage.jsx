import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Search, MapPin, Clock } from 'lucide-react';
import { trackOrder } from '../lib/shiprocket';

const TrackOrderPage = () => {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [trackingResult, setTrackingResult] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setTrackingResult(null);
        setLoading(true);

        if (!orderId) {
            setError('Please enter Order ID');
            setLoading(false);
            return;
        }

        try {
            // Shiprocket tracking
            const data = await trackOrder({ orderId: orderId });

            // NOTE: Mapping logic depends on actual Shiprocket API response structure.
            // Using safegaurds for demo purposes.
            // Response usually has data.tracking_data.shipment_track or similar

            const trackData = data?.tracking_data || {};
            const shipment = trackData.shipment_track?.[0] || {};
            const activities = trackData.shipment_track_activities || [];

            // If API returns no data for ID
            if (!shipment.current_status && !activities.length) {
                throw new Error('No tracking info found');
            }

            const timeline = activities.map(act => ({
                status: act.activity,
                date: act.date,
                completed: true,
                current: false
            }));

            // If we have a timeline, mark latest as current
            if (timeline.length > 0) {
                timeline[0].current = true;
            }

            const currentStatus = shipment.current_status || timeline[0]?.status || 'Unknown';

            setTrackingResult({
                id: orderId,
                status: currentStatus,
                estimatedDelivery: shipment.etd || 'Pending',
                timeline: timeline.length ? timeline : [{ status: currentStatus, date: 'Today', current: true, completed: true }],
                courier: shipment.courier_name || 'Courier',
                trackingNumber: shipment.awb_code || ''
            });

        } catch (err) {
            console.error('Tracking Error', err);
            // Fallback for demo if API fails (so user sees something during review if key is invalid)
            // Remove this block in strict production
            if (process.env.NODE_ENV === 'development') {
                console.warn('Falling back to mock data for dev due to API error');
                setTrackingResult({
                    id: orderId,
                    status: 'In Transit',
                    estimatedDelivery: 'Jan 28, 2026',
                    timeline: [
                        { status: 'Order Placed', date: 'Jan 22, 2026', completed: true },
                        { status: 'In Transit', date: 'Jan 24, 2026', completed: true, current: true },
                    ],
                    courier: 'Shiprocket',
                    trackingNumber: 'SR-DEMO'
                });
            } else {
                setError('Could not find tracking details. Please check the ID.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getIconForStatus = (status) => {
        const s = (status || '').toLowerCase();
        if (s.includes('placed')) return <Package className="w-6 h-6" />;
        if (s.includes('pack')) return <Package className="w-6 h-6" />;
        if (s.includes('ship')) return <Truck className="w-6 h-6" />;
        if (s.includes('transit')) return <Truck className="w-6 h-6" />;
        if (s.includes('out')) return <Truck className="w-6 h-6" />;
        if (s.includes('delivered')) return <CheckCircle className="w-6 h-6" />;
        return <Clock className="w-6 h-6" />;
    };

    return (
        <div className="pt-24 pb-16 min-h-screen site-shell bg-gray-50">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Track Your Order</h1>
                    <p className="text-gray-600">Enter your order details to see current status</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
                    <form onSubmit={handleSearch} className="grid md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                            <div className="relative">
                                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="#ORD-1234"
                                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email / Phone</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email used for order"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                            />
                        </div>
                        <div className="md:col-span-1 flex items-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-2.5 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? 'Searching...' : (
                                    <>
                                        <Search className="w-4 h-4" />
                                        Track
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                    {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
                </div>

                {trackingResult && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Order {trackingResult.id}</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Via {trackingResult.courier} | {trackingResult.trackingNumber}
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0 text-right">
                                <p className="text-sm text-gray-500">Status</p>
                                <p className="text-lg font-bold text-green-600">{trackingResult.status}</p>
                            </div>
                        </div>

                        <div className="relative">
                            {/* Vertical line connecting dots */}
                            <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gray-200"></div>

                            <div className="space-y-8">
                                {trackingResult.timeline.map((step, index) => (
                                    <div key={index} className="relative flex items-center gap-6">
                                        <div className={`
                                            relative z-10 w-16 h-16 flex-shrink-0 rounded-full flex items-center justify-center border-4 
                                            ${step.completed
                                                ? 'bg-black border-black text-white'
                                                : step.current
                                                    ? 'bg-white border-black text-black'
                                                    : 'bg-white border-gray-200 text-gray-300'
                                            }
                                        `}>
                                            {getIconForStatus(step.status)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`font-bold ${step.completed || step.current ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {step.status}
                                            </h3>
                                            <p className="text-sm text-gray-500">{step.date}</p>
                                        </div>
                                        {step.completed && (
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrderPage;
