import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { formatMoney } from '../lib/shopify';
import { User, Package, MapPin, LogOut, ChevronRight, Loader2 } from 'lucide-react';

const ProfilePage = () => {
    const { customer, isAuthenticated, loading, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [loading, isAuthenticated, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-16 site-shell flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!customer) {
        return null;
    }

    const orders = customer.orders?.nodes ?? [];
    const address = customer.defaultAddress;

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'fulfilled':
                return 'bg-green-100 text-green-800';
            case 'unfulfilled':
                return 'bg-yellow-100 text-yellow-800';
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-16 bg-gray-50">
            <div className="site-shell">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold mb-2">My Account</h1>
                    <p className="text-gray-600">Welcome back, {customer.firstName}!</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            {/* Profile Info */}
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-gray-400" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-lg">{customer.firstName} {customer.lastName}</h2>
                                    <p className="text-sm text-gray-500">{customer.email}</p>
                                </div>
                            </div>

                            {/* Address */}
                            {address && (
                                <div className="mb-6">
                                    <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500 mb-3 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Default Address
                                    </h3>
                                    <p className="text-sm text-gray-700">
                                        {address.address1}
                                        {address.address2 && <>, {address.address2}</>}
                                        <br />
                                        {address.city}, {address.province} {address.zip}
                                        <br />
                                        {address.country}
                                    </p>
                                </div>
                            )}

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Orders */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Order History
                            </h2>

                            {orders.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                                    <Link
                                        to="/products"
                                        className="inline-block bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                                    >
                                        Start Shopping
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <span className="font-bold">Order #{order.orderNumber}</span>
                                                    <span className="text-sm text-gray-500 ml-3">
                                                        {new Date(order.processedAt).toLocaleDateString('en-IN', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs font-bold px-2 py-1 rounded ${getStatusColor(order.fulfillmentStatus)}`}>
                                                        {order.fulfillmentStatus || 'Processing'}
                                                    </span>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded ${getStatusColor(order.financialStatus)}`}>
                                                        {order.financialStatus || 'Pending'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Line Items */}
                                            <div className="space-y-2 mb-3">
                                                {order.lineItems?.nodes?.slice(0, 3).map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 text-sm">
                                                        {item.variant?.image?.url && (
                                                            <img
                                                                src={item.variant.image.url}
                                                                alt={item.title}
                                                                className="w-10 h-10 object-cover rounded"
                                                            />
                                                        )}
                                                        <span className="flex-1 truncate">{item.title}</span>
                                                        <span className="text-gray-500">x{item.quantity}</span>
                                                    </div>
                                                ))}
                                                {order.lineItems?.nodes?.length > 3 && (
                                                    <p className="text-xs text-gray-500">
                                                        +{order.lineItems.nodes.length - 3} more items
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                <span className="font-bold">
                                                    {formatMoney(order.totalPrice?.amount, order.totalPrice?.currencyCode)}
                                                </span>
                                                <button className="text-sm font-bold flex items-center gap-1 hover:underline">
                                                    View Details <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
