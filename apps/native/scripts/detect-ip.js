#!/usr/bin/env node

import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  // Priority order for interface names
  const interfacePriority = ['en0', 'eth0', 'wlan0', 'Wi-Fi'];
  
  // First try priority interfaces
  for (const iface of interfacePriority) {
    if (interfaces[iface]) {
      const ipv4 = interfaces[iface].find(
        (details) => details.family === 'IPv4' && !details.internal
      );
      if (ipv4) {
        return ipv4.address;
      }
    }
  }
  
  // If priority interfaces not found, try all interfaces
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (localhost) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  return 'localhost';
}

export const localIP = getLocalIP();
console.log(`Detected IP: ${localIP}`);

// Write to .env file for the native app
const envPath = path.join(__dirname, '..', '.env');
const envContent = `VITE_API_HOST=${localIP}\n`;

fs.writeFileSync(envPath, envContent);
console.log(`Written to .env: VITE_API_HOST=${localIP}`);