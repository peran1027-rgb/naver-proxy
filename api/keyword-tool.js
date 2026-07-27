import crypto from 'crypto';

function makeSignature(secretKey, method, path, timestamp) {
  const message = `${timestamp}.${method}.${path}`;
  return crypto.createHmac('sha256', secretKey).update(message).digest('base64');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { keywords } = req.body;
  if (!keywords || !Array.isArray(keywords)) {
    return res.status(400).json({ error: 'keywords array required' });
  }

  const BASE_URL = 'https://api.naver.com';
  const PATH = '/keywordstool';
  const timestamp = Date.now().toString();
  const signature = makeSignature(
    process.env.NAVER_AD_SECRET_KEY,
    'GET',
    PATH,
    timestamp
  );

  const params = new URLSearchParams();
  keywords.forEach(kw => params.append('hintKeywords', kw));
  params.append('showDetail', '1');

  try {
    const response = await fetch(`${BASE_URL}${PATH}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'X-Timestamp': timestamp,
        'X-API-KEY': process.env.NAVER_AD_ACCESS_LICENSE,
        'X-Customer': process.env.NAVER_AD_CUSTOMER_ID,
        'X-Signature': signature,
      }
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
