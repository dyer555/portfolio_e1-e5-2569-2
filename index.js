const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const CONFIG_PATH = path.join(__dirname, 'wifi-config.json');

app.use(express.json({ limit: '1mb' }));

<<<<<<< HEAD
app.get('/', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#080b12">
  <title>ESP32 // COMMAND CENTER</title>
  <style>
    :root { color-scheme: dark; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    * { box-sizing: border-box; }
    body { min-height: 100vh; margin: 0; color: #e6edf7; background: radial-gradient(ellipse at 50% -20%, #153b43 0, #0b121a 46%, #080b12 78%); }
    main { width: min(920px, calc(100% - 36px)); margin: 0 auto; padding: 72px 0 48px; }
    .eyebrow, .label { color: #7d9ba4; font-size: 11px; letter-spacing: .18em; text-transform: uppercase; }
    header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 42px; }
    h1 { margin: 10px 0 0; font-size: clamp(26px, 6vw, 46px); letter-spacing: -.06em; }
    h1 span { color: #43e0bd; }
    .live { display: flex; align-items: center; gap: 9px; padding: 10px 12px; border: 1px solid #183d3b; border-radius: 999px; color: #81f3d9; font-size: 11px; white-space: nowrap; }
    .dot { width: 7px; height: 7px; border-radius: 50%; background: #43e0bd; box-shadow: 0 0 14px #43e0bd; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
    .card { min-height: 158px; padding: 22px; border: 1px solid #1d2b37; border-radius: 14px; background: linear-gradient(145deg, #111a23dd, #0b1119dd); box-shadow: 0 18px 55px #0002; }
    .value { display: block; margin-top: 20px; overflow-wrap: anywhere; color: #f2f7fb; font-size: clamp(19px, 4vw, 27px); }
    .value.accent { color: #43e0bd; }
    .wide { grid-column: 1 / -1; min-height: auto; }
    .row { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
    .row .value { margin-top: 9px; font-size: 15px; }
    .api-link { color: #43e0bd; text-decoration: none; }
    .api-link:hover { text-decoration: underline; }
    footer { display: flex; justify-content: space-between; gap: 12px; margin-top: 24px; color: #60737e; font-size: 11px; }
    @media (max-width: 580px) { main { padding-top: 42px; } header { margin-bottom: 28px; } .grid { grid-template-columns: 1fr; } .wide { grid-column: auto; } footer { flex-direction: column; } }
  </style>
</head>
<body>
  <main>
    <header>
      <div><div class="eyebrow">IoT device monitor / v1.0</div><h1>ESP32 <span>//</span> CONTROL</h1></div>
      <div class="live"><i class="dot"></i><span id="api-status">CONNECTING</span></div>
    </header>
    <section class="grid" aria-label="Device status">
      <article class="card"><div class="label">Network / SSID</div><strong class="value" id="ssid">—</strong></article>
      <article class="card"><div class="label">Wi-Fi state</div><strong class="value accent" id="wifi-status">LOADING</strong></article>
      <article class="card wide">
        <div class="row"><div><div class="label">Last configuration update</div><strong class="value" id="updated">—</strong></div><a class="api-link" href="/health">VIEW API ↗</a></div>
      </article>
    </section>
    <footer><span>SECURE VIEW · CREDENTIALS ARE NEVER DISPLAYED</span><span id="refreshed">Waiting for first sync…</span></footer>
  </main>
  <script>
    const setText = (id, value) => { document.getElementById(id).textContent = value; };
    async function refresh() {
      try {
        const response = await fetch('/api/esp32/wifi', { cache: 'no-store' });
        if (!response.ok) throw new Error('API unavailable');
        const result = await response.json();
        const data = result.data || {};
        setText('api-status', 'SYSTEM ONLINE');
        setText('ssid', data.ssid || 'NO NETWORK');
        setText('wifi-status', (data.status || 'not_configured').replaceAll('_', ' ').toUpperCase());
        setText('updated', data.updatedAt ? new Date(data.updatedAt).toLocaleString() : 'NOT CONFIGURED');
        setText('refreshed', 'Last sync ' + new Date().toLocaleTimeString());
      } catch {
        setText('api-status', 'CONNECTION LOST');
        setText('wifi-status', 'OFFLINE');
        setText('refreshed', 'Retrying automatically…');
      }
    }
    refresh();
    setInterval(refresh, 5000);
  </script>
</body>
</html>`);
});

=======
>>>>>>> 79bfc0b776a61356f049db3bbcbeaf5f53e2778d
function readConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    return {};
  }
}

function writeConfig(data) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2));
}

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API ready',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/esp32/wifi', (req, res) => {
  const config = readConfig();

  res.json({
    success: true,
    data: {
      ssid: config.ssid || null,
      status: config.status || 'not_configured',
      updatedAt: config.updatedAt || null,
    },
  });
});

app.post('/api/esp32/connect', (req, res) => {
  const { ssid, password, deviceName } = req.body || {};

  if (!ssid || !password) {
    return res.status(400).json({
      success: false,
      message: 'ssid and password are required',
    });
  }

  const config = {
    ssid,
    password,
    deviceName: deviceName || 'esp32-device',
    status: 'configured',
    updatedAt: new Date().toISOString(),
  };

  writeConfig(config);

  return res.status(200).json({
    success: true,
    message: 'WiFi configuration saved for ESP32',
    data: {
      ssid: config.ssid,
      deviceName: config.deviceName,
      status: config.status,
      updatedAt: config.updatedAt,
    },
  });
});

app.post('/api/esp32/wifi', (req, res) => {
  const { ssid, password, deviceName } = req.body || {};

  if (!ssid || !password) {
    return res.status(400).json({
      success: false,
      message: 'ssid and password are required',
    });
  }

  const config = {
    ssid,
    password,
    deviceName: deviceName || 'esp32-device',
    status: 'configured',
    updatedAt: new Date().toISOString(),
  };

  writeConfig(config);

  return res.status(200).json({
    success: true,
    message: 'WiFi configuration saved for ESP32',
    data: {
      ssid: config.ssid,
      deviceName: config.deviceName,
      status: config.status,
      updatedAt: config.updatedAt,
    },
  });
});

app.delete('/api/esp32/wifi', (req, res) => {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      fs.unlinkSync(CONFIG_PATH);
    }

    res.json({
      success: true,
      message: 'WiFi configuration cleared',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear WiFi configuration',
      error: error.message,
    });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`ESP32 WiFi API running on http://localhost:${PORT}`);
  });
}

module.exports = app;
