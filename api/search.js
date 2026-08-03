export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { query, start = 1 } = req.query;
  if (!query) return res.status(400).json({ error: 'query is required' });

  const url = `https://naverapihub.apigw.ntruss.com/search/v1/shop.json?query=${encodeURIComponent(query)}&display=100&start=${start}&sort=sim`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': process.env.NCP_API_KEY_ID,
        'X-NCP-APIGW-API-KEY': process.env.NCP_API_KEY_SECRET,
      }
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
