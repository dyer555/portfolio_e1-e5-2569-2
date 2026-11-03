const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const CONFIG_PATH = path.join(__dirname, 'wifi-config.json');

app.use(express.json({ limit: '1mb' }));

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
