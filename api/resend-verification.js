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

  const email = String(body?.email || '').trim().toLowerCase();
  if (!email) {
    return sendJson(res, 400, { error: 'Email is required.' });
  }

  const domain = process.env.SHOPIFY_DOMAIN || process.env.VITE_SHOPIFY_DOMAIN;
  const token =
    process.env.SHOPIFY_ADMIN_API_TOKEN ||
    process.env.VITE_SHOPIFY_ADMIN_API_TOKEN;
  const apiVersion =
    process.env.SHOPIFY_ADMIN_API_VERSION ||
    process.env.VITE_SHOPIFY_API_VERSION ||
    '2024-07';

  if (!domain || !token) {
    return sendJson(res, 500, {
      error: 'Server not configured for Shopify Admin API.',
    });
  }

  try {
    const baseUrl = `https://${domain}/admin/api/${apiVersion}`;
    const searchUrl = `${baseUrl}/customers/search.json?query=${encodeURIComponent(
      `email:${email}`,
    )}`;
    const searchRes = await fetch(searchUrl, {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json',
      },
    });

    if (!searchRes.ok) {
      return sendJson(res, 502, { error: 'Failed to find customer.' });
    }

    const searchData = await searchRes.json();
    const customer = searchData?.customers?.[0];

    if (!customer) {
      return sendJson(res, 404, { error: 'No customer found for that email.' });
    }

    if (customer.state === 'enabled') {
      return sendJson(res, 200, { message: 'Account already active. Please sign in.' });
    }

    const inviteRes = await fetch(
      `${baseUrl}/customers/${customer.id}/send_invite.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customer_invite: {} }),
      },
    );

    const inviteText = await inviteRes.text();
    let inviteData = null;
    try {
      inviteData = inviteText ? JSON.parse(inviteText) : null;
    } catch {
      inviteData = null;
    }

    if (!inviteRes.ok || inviteData?.errors) {
      return sendJson(res, 502, { error: 'Unable to send verification email.' });
    }

    return sendJson(res, 200, {
      message: 'Verification email sent. Please check your inbox.',
    });
  } catch (error) {
    console.error('Verification email error:', error);
    return sendJson(res, 500, { error: 'Unable to send verification email.' });
  }
}
