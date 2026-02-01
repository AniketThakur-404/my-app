const readRequestBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  return JSON.parse(raw);
};

const sendJson = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
};

const normalizeEmail = (value) => String(value ?? '').trim().toLowerCase();
const normalizePhone = (value) =>
  String(value ?? '').trim().replace(/[^\d+]/g, '');

const buildOrderQuery = ({ orderId, email, phone }) => {
  if (orderId) {
    const normalized = orderId.startsWith('#')
      ? orderId
      : /^[0-9]+$/.test(orderId)
        ? `#${orderId}`
        : orderId;
    return `name:${normalized}`;
  }
  if (email) {
    return `email:${email}`;
  }
  if (phone) {
    return `phone:${phone}`;
  }
  return null;
};

const normalizeTracking = (order) => {
  const fulfillments = Array.isArray(order?.fulfillments)
    ? order.fulfillments
    : [];
  const trackingNumbers = [];
  const trackingUrls = [];
  const trackingCompanies = [];

  for (const fulfillment of fulfillments) {
    const info = fulfillment?.trackingInfo || [];
    for (const entry of info) {
      if (entry?.number) trackingNumbers.push(entry.number);
      if (entry?.url) trackingUrls.push(entry.url);
      if (entry?.company) trackingCompanies.push(entry.company);
    }
  }

  return {
    trackingNumbers,
    trackingUrls,
    trackingCompanies,
  };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  let body;
  try {
    body = await readRequestBody(req);
  } catch {
    return sendJson(res, 400, { error: 'Invalid JSON body.' });
  }

  const orderId = String(body?.orderId || '').trim();
  const email = normalizeEmail(body?.email);
  const phone = normalizePhone(body?.phone);

  if (!orderId || (!email && !phone)) {
    return sendJson(res, 400, { error: 'Order ID and email or phone are required.' });
  }

  const domain = process.env.SHOPIFY_DOMAIN || process.env.VITE_SHOPIFY_DOMAIN;
  const token =
    process.env.SHOPIFY_ADMIN_API_TOKEN ||
    process.env.VITE_SHOPIFY_ADMIN_API_TOKEN;
  const apiVersion =
    process.env.SHOPIFY_ADMIN_API_VERSION ||
    process.env.VITE_SHOPIFY_API_VERSION ||
    '2024-07';
  const shiprocketToken =
    process.env.SHIPROCKET_TOKEN || process.env.VITE_SHIPROCKET_TOKEN;

  if (!domain || !token) {
    return sendJson(res, 500, {
      error: 'Server not configured for Shopify Admin API.',
    });
  }

  const query = buildOrderQuery({ orderId, email, phone });
  if (!query) {
    return sendJson(res, 400, { error: 'Invalid search query.' });
  }

  try {
    const graphUrl = `https://${domain}/admin/api/${apiVersion}/graphql.json`;
    const graphRes = await fetch(graphUrl, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query OrderLookup($query: String!) {
            orders(first: 1, query: $query) {
              edges {
                node {
                  id
                  name
                  email
                  phone
                  displayFulfillmentStatus
                  processedAt
                  fulfillments(first: 10) {
                    trackingInfo {
                      number
                      url
                      company
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { query },
      }),
    });

    const graphData = await graphRes.json();
    const orderNode = graphData?.data?.orders?.edges?.[0]?.node;
    if (!orderNode) {
      return sendJson(res, 404, { error: 'No order found for those details.' });
    }

    const orderEmail = normalizeEmail(orderNode?.email);
    const orderPhone = normalizePhone(orderNode?.phone);
    const emailMatches = !email || (orderEmail && email === orderEmail);
    const phoneMatches = !phone || (orderPhone && phone === orderPhone);

    if (email && phone) {
      if (!emailMatches && !phoneMatches) {
        return sendJson(res, 404, { error: 'No order found for those details.' });
      }
    } else if (email && !emailMatches) {
      return sendJson(res, 404, { error: 'No order found for those details.' });
    } else if (phone && !phoneMatches) {
      return sendJson(res, 404, { error: 'No order found for those details.' });
    }

    const tracking = normalizeTracking(orderNode);
    const awb = tracking.trackingNumbers?.[0];

    if (awb && shiprocketToken) {
      const shipRes = await fetch(
        `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${encodeURIComponent(
          awb,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${shiprocketToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const shipText = await shipRes.text();
      const shipData = shipText ? JSON.parse(shipText) : {};

      if (shipRes.ok) {
        return sendJson(res, 200, {
          source: 'shiprocket',
          order: {
            id: orderNode.id,
            name: orderNode.name,
            email: orderNode.email,
            phone: orderNode.phone,
            status: orderNode.displayFulfillmentStatus,
            processedAt: orderNode.processedAt,
          },
          tracking: shipData,
          shopifyTracking: tracking,
        });
      }
    }

    return sendJson(res, 200, {
      source: 'shopify',
      order: {
        id: orderNode.id,
        name: orderNode.name,
        email: orderNode.email,
        phone: orderNode.phone,
        status: orderNode.displayFulfillmentStatus,
        processedAt: orderNode.processedAt,
      },
      shopifyTracking: tracking,
      tracking: null,
    });
  } catch (error) {
    console.error('Track order error:', error);
    return sendJson(res, 500, { error: 'Unable to fetch tracking details.' });
  }
}
