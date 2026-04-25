const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
  'apikey': SUPABASE_SERVICE_KEY,
  'Prefer': 'return=representation',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET /api/storage?key=xxx        → get one value
  // GET /api/storage?prefix=xxx     → get all keys starting with prefix
  if (req.method === 'GET') {
    const { key, prefix } = req.query;

    if (prefix) {
      const url = `${SUPABASE_URL}/rest/v1/storage?key=like.${encodeURIComponent(prefix + '%')}&select=key,value`;
      const response = await fetch(url, { headers });
      const rows = await response.json();
      if (!response.ok) return res.status(500).json({ error: rows });
      // Return as object: { key: value, key: value }
      const result = {};
      for (const row of rows) result[row.key] = row.value;
      return res.status(200).json(result);
    }

    if (key) {
      const url = `${SUPABASE_URL}/rest/v1/storage?key=eq.${encodeURIComponent(key)}&select=value`;
      const response = await fetch(url, { headers });
      const rows = await response.json();
      if (!response.ok) return res.status(500).json({ error: rows });
      if (rows.length === 0) return res.status(200).json(null);
      return res.status(200).json(rows[0].value);
    }

    return res.status(400).json({ error: 'Provide key or prefix' });
  }

  // POST /api/storage { key, value } → save (create or update)
  if (req.method === 'POST') {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ error: 'key is required' });

    const url = `${SUPABASE_URL}/rest/v1/storage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Prefer': 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify({ key, value, updated_at: new Date().toISOString() }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data });
    return res.status(200).json(data[0] ?? data);
  }

  // DELETE /api/storage?key=xxx → delete one entry
  if (req.method === 'DELETE') {
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: 'key is required' });

    const url = `${SUPABASE_URL}/rest/v1/storage?key=eq.${encodeURIComponent(key)}`;
    const response = await fetch(url, { method: 'DELETE', headers });
    if (!response.ok) {
      const data = await response.json();
      return res.status(500).json({ error: data });
    }
    return res.status(200).json({ deleted: key });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
