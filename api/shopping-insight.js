export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const response = await fetch(
      'https://naveropenapi.apigw.ntruss.com/datalab/v1/shopping/categories/keywords',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-ncp-apigw-api-key-id': process.env.NCP_API_KEY_ID,
          'x-ncp-apigw-api-key': process.env.NCP_API_KEY_SECRET,
        },
        body: JSON.stringify(req.body)
      }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
