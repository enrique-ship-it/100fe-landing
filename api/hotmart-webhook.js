const crypto = require('node:crypto');

const HOTMART_APPROVED_STATUS = 'approved';

const toLowerSafe = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

const sha256 = (value) => {
    if (!value) return undefined;
    return crypto.createHash('sha256').update(toLowerSafe(value)).digest('hex');
};

const parsePayload = (body) => {
    if (!body) return {};
    if (typeof body === 'object') return body;

    if (typeof body === 'string') {
        try {
            return JSON.parse(body);
        } catch (error) {
            const params = new URLSearchParams(body);
            return Object.fromEntries(params.entries());
        }
    }

    return {};
};

const getNested = (payload, paths = [], fallback) => {
    for (const path of paths) {
        const value = path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), payload);
        if (value !== undefined && value !== null && value !== '') {
            return value;
        }
    }
    return fallback;
};

const sendMetaPurchase = async ({ payload, transactionId, value, currency }) => {
    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;
    const landingUrl = process.env.LANDING_URL || 'https://100fe-landing.vercel.app';

    if (!pixelId || !accessToken) {
        return { skipped: true, reason: 'META env vars not configured' };
    }

    const email = getNested(payload, ['buyer.email', 'email'], '');
    const phone = getNested(payload, ['buyer.checkout_phone', 'phone'], '');

    const eventBody = {
        data: [
            {
                event_name: 'Purchase',
                event_time: Math.floor(Date.now() / 1000),
                event_id: transactionId,
                action_source: 'website',
                event_source_url: landingUrl,
                user_data: {
                    em: sha256(email),
                    ph: sha256(phone)
                },
                custom_data: {
                    value,
                    currency,
                    content_name: '100 Ensenanzas Biblicas para Emprender',
                    content_type: 'product'
                }
            }
        ]
    };

    const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventBody)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Meta CAPI error: ${response.status} ${errorBody}`);
    }

    return { skipped: false };
};

const sendGa4Purchase = async ({ transactionId, value, currency }) => {
    const measurementId = process.env.GA4_MEASUREMENT_ID;
    const apiSecret = process.env.GA4_API_SECRET;

    if (!measurementId || !apiSecret) {
        return { skipped: true, reason: 'GA4 env vars not configured' };
    }

    const body = {
        client_id: transactionId,
        events: [
            {
                name: 'purchase',
                params: {
                    transaction_id: transactionId,
                    currency,
                    value,
                    items: [
                        {
                            item_id: 'E101603962K',
                            item_name: '100 Ensenanzas Biblicas para Emprender',
                            item_category: 'ebook',
                            quantity: 1,
                            price: value
                        }
                    ]
                }
            }
        ]
    };

    const response = await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`GA4 MP error: ${response.status} ${errorBody}`);
    }

    return { skipped: false };
};

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    try {
        const payload = parsePayload(req.body);
        // Hotmart v1 sends hottok in body; v2.0 sends it as query param or not at all
        const receivedToken =
            getNested(payload, ['hottok', 'token'], '') ||
            (req.query && req.query.hottok) ||
            '';
        const expectedToken = process.env.HOTMART_WEBHOOK_TOKEN;

        // Only reject if we have a token configured AND Hotmart sent one that doesn't match
        // If Hotmart v2.0 sends no token at all, we allow it through
        if (expectedToken && receivedToken && receivedToken !== expectedToken) {
            return res.status(401).json({ ok: false, error: 'Invalid webhook token' });
        }

        const status = toLowerSafe(getNested(payload, ['data.purchase.status', 'purchase.status', 'status'], ''));
        if (status && status !== HOTMART_APPROVED_STATUS) {
            return res.status(200).json({ ok: true, ignored: true, reason: `Status ${status} not approved` });
        }

        const transactionId = String(getNested(payload, ['data.purchase.transaction', 'purchase.transaction', 'transaction'], Date.now()));
        const currency = String(getNested(payload, ['data.purchase.currency', 'purchase.currency', 'currency'], 'MXN')).toUpperCase();
        const valueRaw = getNested(payload, ['data.purchase.price.value', 'purchase.price.value', 'purchase.price', 'price.value', 'price'], '149.64');
        const value = Number(valueRaw);

        const [metaResult, gaResult] = await Promise.all([
            sendMetaPurchase({ payload, transactionId, value, currency }),
            sendGa4Purchase({ transactionId, value, currency })
        ]);

        return res.status(200).json({
            ok: true,
            tracked: 'purchase',
            transactionId,
            meta: metaResult,
            ga4: gaResult
        });
    } catch (error) {
        return res.status(500).json({ ok: false, error: error.message });
    }
};
