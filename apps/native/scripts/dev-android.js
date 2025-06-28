#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// First detect IP
console.log('🔍 Detecting network IP...');
import('./detect-ip.js').then(async (module) => {
  const localIP = module.localIP;
  
  // Check if backend is already running
  const checkBackend = () => {
    return new Promise((resolve) => {
      const options = {
        host: localIP,
        port: 3000,
        path: '/api/text-analysis',
        method: 'OPTIONS',
        timeout: 1000
      };
      
      const req = http.request(options, (res) => {
        resolve(true);
      });
      
      req.on('error', () => {
        resolve(false);
      });
      
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      
      req.end();
    });
  };

  async function startDevelopment() {
    const isBackendRunning = await checkBackend();
    
    let backendProcess;
    
    if (!isBackendRunning) {
      console.log('🚀 Starting backend server...');
      
      // Start the web backend with network access
      backendProcess = spawn('pnpm', ['--filter', 'web', 'dev:network'], {
        cwd: path.join(__dirname, '../../..'),
        stdio: 'pipe',
        shell: true
      });
      
      backendProcess.stdout.on('data', (data) => {
        process.stdout.write(`[Backend] ${data}`);
      });
      
      backendProcess.stderr.on('data', (data) => {
        process.stderr.write(`[Backend] ${data}`);
      });
      
      // Wait for backend to be ready
      console.log('⏳ Waiting for backend to start...');
      let retries = 0;
      while (retries < 30) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (await checkBackend()) {
          console.log('✅ Backend is ready!');
          break;
        }
        retries++;
      }
      
      if (retries >= 30) {
        console.error('❌ Backend failed to start in time');
        if (backendProcess) backendProcess.kill();
        process.exit(1);
      }
    } else {
      console.log('✅ Backend already running');
    }
    
    console.log(`🤖 Starting Android development with API host: ${localIP}`);
    
    // Start Tauri Android development
    const tauriProcess = spawn('pnpm', ['tauri', 'android', 'dev'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        VITE_API_HOST: localIP
      }
    });
    
    // Handle process termination
    const cleanup = () => {
      console.log('\n🛑 Shutting down...');
      if (backendProcess) {
        backendProcess.kill();
      }
      tauriProcess.kill();
      process.exit(0);
    };
    
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    
    tauriProcess.on('exit', (code) => {
      if (backendProcess) {
        backendProcess.kill();
      }
      process.exit(code || 0);
    });
  }

  startDevelopment().catch(console.error);
});