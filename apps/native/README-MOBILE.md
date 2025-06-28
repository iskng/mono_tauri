# Mobile Development Guide

This guide explains how to run the native app on iOS and Android devices.

## Prerequisites

- **iOS**: Xcode installed (macOS only)
- **Android**: Android Studio installed
- **Backend**: The web app must be accessible from your mobile device

## Quick Start

### iOS Development

```bash
# Automatically detect IP, start backend, and launch iOS
pnpm dev:ios
```

### Android Development

```bash
# Automatically detect IP, start backend, and launch Android
pnpm dev:android
```

## What These Commands Do

1. **Detect Network IP**: Automatically finds your machine's IP address
2. **Start Backend**: Launches the web backend with network access (if not already running)
3. **Configure App**: Sets the API host to your network IP
4. **Launch Mobile**: Opens Xcode (iOS) or Android Studio with the configured app

## Manual Setup (if needed)

### 1. Find Your IP Address

- **macOS**: System Preferences > Network > Your connection
- **Windows**: Run `ipconfig` in Command Prompt
- **Linux**: Run `ip addr` or `ifconfig`

### 2. Start the Backend

```bash
# In the mono repo root
pnpm --filter web dev:network
```

### 3. Set the API Host

Create a `.env` file in the native app directory:

```bash
VITE_API_HOST=192.168.1.100  # Replace with your IP
```

Or run with the environment variable:

```bash
VITE_API_HOST=192.168.1.100 pnpm tauri ios dev
```

## Troubleshooting

### Connection Refused

1. Ensure the backend is running with `dev:network` (not just `dev`)
2. Check firewall settings - port 3000 must be accessible
3. Verify you're on the same network as your mobile device

### Wrong IP Address

The script tries to detect the primary network interface. If it picks the wrong one:

1. Run `pnpm detect-ip` to see what IP was detected
2. Manually set the correct IP in `.env` file
3. Re-run the dev command

### Backend Already Running

The scripts check if the backend is already running. If you have issues:

1. Stop all running processes
2. Run the dev command again
3. Or manually start backend and native app separately

## Features

- **Automatic IP Detection**: No need to manually find and set IP addresses
- **Backend Management**: Automatically starts the backend if needed
- **Hot Reload**: Changes to the app are reflected immediately
- **Unified Commands**: Single command to start everything