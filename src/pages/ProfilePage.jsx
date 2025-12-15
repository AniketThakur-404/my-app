import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { formatMoney } from '../lib/shopify';
import {
    User,
    Package,
    MapPin,
    LogOut,
    Loader2,
    Mail,
    Phone,
    CreditCard,
    Truck,
    RotateCcw,
    BadgeCheck,
    AlertCircle,
    ArrowUpRight,
} from 'lucide-react';

const toneClasses = {
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    muted: 'bg-gray-100 text-gray-700 border border-gray-200',
};

const StatusPill = ({ label, tone = 'muted', Icon = null }) => (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${toneClasses[tone] || toneClasses.muted}`}>
        {Icon ? <Icon className="w-4 h-4" /> : null}
        <span>{label}</span>
    </span>
);

const formatStatusLabel = (status, fallback = 'Processing') => {
    if (!status) return fallback;
    return status
        .toString()
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

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
    const currencyHint = orders[0]?.totalPriceV2?.currencyCode || orders[0]?.totalPrice?.currencyCode;

    const refundTotal = orders.reduce(
        (sum, order) => sum + Number(order?.totalRefundedV2?.amount ?? order?.totalRefunded?.amount ?? 0),
        0
    );

    const refundOrders = orders.filter((order) => {
        const amount = Number(order?.totalRefundedV2?.amount ?? order?.totalRefunded?.amount ?? 0);
        const status = (order.financialStatus || '').toLowerCase();
        return amount > 0 || status.includes('refunded');
    }).length;

    const inTransit = orders.filter((order) => {
        const status = (order.fulfillmentStatus || '').toLowerCase();
        return ['in_progress', 'open', 'pending', 'scheduled', 'partially_fulfilled', 'unfulfilled'].includes(status);
    }).length;

    const delivered = orders.filter((order) => (order.fulfillmentStatus || '').toLowerCase() === 'fulfilled').length;

    const stats = [
        { label: 'Total orders', value: orders.length },
        { label: 'In transit', value: inTransit },
        { label: 'Delivered', value: delivered },
        { label: 'Refunds', value: formatMoney(refundTotal, currencyHint), helper: `${refundOrders} order${refundOrders === 1 ? '' : 's'}` },
    ];

    const getFulfillmentBadge = (status) => {
        const normalized = (status || '').toLowerCase();
        if (normalized === 'fulfilled') return { label: 'Delivered', tone: 'success', Icon: BadgeCheck };
        if (['in_progress', 'open', 'partially_fulfilled', 'pending', 'scheduled'].includes(normalized)) {
            return { label: 'In transit', tone: 'info', Icon: Truck };
        }
        if (normalized === 'unfulfilled') return { label: 'Awaiting dispatch', tone: 'warning', Icon: Truck };
        if (normalized === 'cancelled' || normalized === 'canceled') return { label: 'Cancelled', tone: 'danger', Icon: AlertCircle };
        if (normalized === 'on_hold') return { label: 'On hold', tone: 'warning', Icon: AlertCircle };
        return { label: formatStatusLabel(status, 'Processing'), tone: 'muted', Icon: Truck };
    };

    const getPaymentBadge = (status) => {
        const normalized = (status || '').toLowerCase();
        if (normalized === 'paid' || normalized === 'partially_paid') {
            return { label: 'Paid', tone: 'success', Icon: CreditCard };
        }
        if (normalized.includes('refunded')) {
            return { label: formatStatusLabel(status, 'Refunded'), tone: 'info', Icon: RotateCcw };
        }
        if (normalized === 'pending' || normalized === 'authorized') {
            return { label: 'Payment pending', tone: 'warning', Icon: CreditCard };
        }
        return { label: formatStatusLabel(status, 'Payment'), tone: 'muted', Icon: CreditCard };
    };

    const getRefundBadge = (order) => {
        const amount = Number(order?.totalRefundedV2?.amount ?? order?.totalRefunded?.amount ?? 0);
        const currency = order?.totalRefundedV2?.currencyCode ?? order?.totalRefunded?.currencyCode ?? currencyHint;
        const financial = (order.financialStatus || '').toLowerCase();

        if (amount > 0) {
            return { label: `Refunded ${formatMoney(amount, currency)}`, tone: 'success', Icon: RotateCcw };
        }
        if (financial.includes('refunded')) {
            return { label: 'Refund in progress', tone: 'warning', Icon: RotateCcw };
        }
        return { label: 'No refund issued', tone: 'muted', Icon: RotateCcw };
    };

    const formatDate = (date) => {
        if (!date) return '';
        const parsed = new Date(date);
        if (Number.isNaN(parsed.getTime())) return '';
        return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const renderOrderCard = (order) => {
        const items = order.lineItems?.nodes ?? [];
        const itemCount = items.reduce((sum, item) => sum + Number(item?.quantity ?? 0), 0);
        const fulfillment = getFulfillmentBadge(order.fulfillmentStatus);
        const payment = getPaymentBadge(order.financialStatus);
        const refund = getRefundBadge(order);
        const orderTotal = formatMoney(
            order?.totalPriceV2?.amount ?? order?.totalPrice?.amount ?? 0,
            order?.totalPriceV2?.currencyCode ?? order?.totalPrice?.currencyCode
        );
        const processedDate = formatDate(order.processedAt);
        const trackingInfo = order?.successfulFulfillments?.[0]?.trackingInfo?.[0];
        const trackHref = trackingInfo?.url || order.statusUrl || null;

        return (
            <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-gray-100">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Order #{order.orderNumber}</p>
                        <div className="flex items-center gap-2">
                            <p className="text-xl font-extrabold text-gray-900">{orderTotal}</p>
                            {processedDate ? <span className="text-sm text-gray-500">• {processedDate}</span> : null}
                        </div>
                        <p className="text-sm text-gray-500">{itemCount} item{itemCount === 1 ? '' : 's'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <StatusPill {...fulfillment} />
                        <StatusPill {...payment} />
                        <StatusPill {...refund} />
                    </div>
                </div>

                <div className="py-4 space-y-3">
                    {items.slice(0, 3).map((item, idx) => (
                        <div key={`${order.id}-item-${idx}`} className="flex items-center gap-3">
                            {item.variant?.image?.url ? (
                                <img
                                    src={item.variant.image.url}
                                    alt={item.title}
                                    className="w-12 h-12 rounded-md object-cover border border-gray-100"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-semibold">
                                    {item.title?.slice(0, 2)?.toUpperCase() || '•'}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                                <p className="text-xs text-gray-500">
                                    {item.variant?.title ? `${item.variant.title} • ` : ''}Qty x{item.quantity}
                                </p>
                            </div>
                        </div>
                    ))}
                    {items.length > 3 ? (
                        <p className="text-xs text-gray-500">+{items.length - 3} more item{items.length - 3 === 1 ? '' : 's'}</p>
                    ) : null}
                </div>

                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <RotateCcw className="w-4 h-4 text-gray-500" />
                        <span>{refund.label}</span>
                    </div>
                    <div className="flex gap-2">
                        {trackHref ? (
                            <a
                                href={trackHref}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-black text-white hover:bg-gray-900 transition-colors"
                            >
                                Track / Manage
                                <ArrowUpRight className="w-4 h-4" />
                            </a>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="site-shell pt-24 pb-14 space-y-8">
                <div className="relative overflow-hidden rounded-2xl border border-pink-100 bg-gradient-to-r from-pink-50 via-orange-50 to-amber-50 p-6 shadow-sm">
                    <div className="absolute inset-0 bg-white/40 pointer-events-none" aria-hidden="true"></div>
                    <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/80 border border-pink-100 flex items-center justify-center text-pink-600 shadow-sm">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-pink-700">Welcome back</p>
                                <h1 className="text-3xl font-extrabold text-gray-900">
                                    {customer.displayName || `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Guest'}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700 mt-1">
                                    <span className="inline-flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-pink-600" /> {customer.email}
                                    </span>
                                    {customer.phone ? (
                                        <span className="inline-flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-pink-600" /> {customer.phone}
                                        </span>
                                    ) : null}
                                </div>
                                {address ? (
                                    <div className="mt-2 text-sm text-gray-600 inline-flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-pink-600 mt-0.5" />
                                        <span>
                                            {address.address1}
                                            {address.address2 ? `, ${address.address2}` : ''}
                                            <br />
                                            {[address.city, address.province, address.zip].filter(Boolean).join(', ')}
                                            <br />
                                            {address.country}
                                        </span>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                to="/checkout/address"
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white/80 border border-pink-200 text-pink-700 hover:bg-white transition-colors"
                            >
                                <MapPin className="w-4 h-4" />
                                Manage addresses
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-black text-white hover:bg-gray-900 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign out
                            </button>
                        </div>
                    </div>

                    <div className="relative mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-xl bg-white/80 border border-white/70 px-4 py-3 shadow-sm backdrop-blur-sm"
                            >
                                <p className="text-xs uppercase tracking-wide text-gray-500">{stat.label}</p>
                                <p className="text-xl font-extrabold text-gray-900">{stat.value}</p>
                                {stat.helper ? <p className="text-xs text-gray-500">{stat.helper}</p> : null}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <User className="w-4 h-4 text-pink-600" />
                                <p className="text-sm font-semibold text-gray-900">Profile & contact</p>
                            </div>
                            <div className="space-y-3 text-sm text-gray-700">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-4 h-4 text-gray-500 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Email</p>
                                        <p>{customer.email}</p>
                                    </div>
                                </div>
                                {customer.phone ? (
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-gray-900">Phone</p>
                                            <p>{customer.phone}</p>
                                        </div>
                                    </div>
                                ) : null}
                                {address ? (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-gray-900">Default address</p>
                                            <p className="text-gray-700">
                                                {address.address1}
                                                {address.address2 ? `, ${address.address2}` : ''}
                                                <br />
                                                {[address.city, address.province, address.zip].filter(Boolean).join(', ')}
                                                <br />
                                                {address.country}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-600 bg-gray-50 border border-dashed border-gray-200 rounded-lg p-3">
                                        Add an address to speed up checkout and delivery updates.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                            <p className="text-sm font-semibold text-gray-900 mb-2">Need help?</p>
                            <p className="text-sm text-gray-600 mb-4">
                                Track deliveries, raise returns, or chat with support directly from your order detail page.
                            </p>
                            <div className="flex gap-2">
                                <Link
                                    to="/contact"
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gray-900 text-white hover:bg-black transition-colors"
                                >
                                    Contact support
                                </Link>
                                <Link
                                    to="/legal/return-policy"
                                    className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-semibold border border-gray-200 text-gray-800 hover:bg-gray-50 transition-colors"
                                >
                                    Return policy
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-pink-600" />
                                <div>
                                    <p className="text-lg font-extrabold text-gray-900">Orders & returns</p>
                                    <p className="text-sm text-gray-600">Live status for deliveries, returns, and refunds.</p>
                                </div>
                            </div>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-gray-200 text-gray-800 hover:bg-gray-50 transition-colors"
                            >
                                Continue shopping
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {orders.length === 0 ? (
                            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
                                <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center">
                                    <Package className="w-6 h-6" />
                                </div>
                                <p className="text-lg font-semibold text-gray-900">No orders yet</p>
                                <p className="text-sm text-gray-600 mb-6">When you shop, your orders, returns, and refunds will show up here.</p>
                                <Link
                                    to="/products"
                                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold bg-black text-white hover:bg-gray-900 transition-colors"
                                >
                                    Start shopping
                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => renderOrderCard(order))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
