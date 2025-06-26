# Mobile Development Setup

This guide explains how to set up the native app for mobile development where the frontend (native app) needs to connect to the backend API running on your development machine.

## Quick Start (Automated)

The easiest way to start mobile development is using the automated scripts:

```bash
# For iOS
pnpm dev:ios

# For Android
pnpm dev:android
```

These commands will:
1. Automatically detect your network IP address
2. Update the .env file with the correct IP
3. Generate an API configuration file for the UI package
4. Check if the backend is accessible
5. Start the backend automatically if it's not running
6. Start the Tauri mobile development server

Note: The backend will be automatically stopped when you stop the mobile dev server (Ctrl+C).

## Manual Setup

1. **Find your computer's network IP address:**
   - macOS: System Settings > Network > Wi-Fi > Details > IP address
   - Windows: Run `ipconfig`, look for IPv4 Address
   - Linux: Run `ip addr`, look for inet address

2. **Configure the environment:**
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # Edit .env and set your IP address
   # VITE_API_HOST=192.168.1.100  # Replace with your IP
   ```

3. **Start the backend (in the web app directory):**
   ```bash
   cd ../web
   # Use dev:network to bind to all interfaces (required for mobile access)
   pnpm dev:network
   ```
   This will start the backend on http://0.0.0.0:3000, making it accessible from your network

4. **Start the native app with the API host:**
   ```bash
   # For iOS development
   VITE_API_HOST=192.168.1.100 pnpm tauri ios dev
   
   # For Android development  
   VITE_API_HOST=192.168.1.100 pnpm tauri android dev
   
   # For desktop development (uses localhost automatically)
   pnpm tauri dev
   ```

## Additional Commands

### Auto-detect Network IP Only
If you just want to detect and set the network IP without starting development:
```bash
pnpm detect-ip
```

This will update your .env file with the detected IP address.

## Troubleshooting

### Connection Refused
- Ensure both your development machine and mobile device are on the same network
- Check firewall settings - port 3000 needs to be accessible
- Verify the backend is running and accessible by visiting http://YOUR_IP:3000 in a browser

### API Calls Failing
- Check the network tab in developer tools for the actual URL being called
- Ensure CORS is properly configured in the backend (already set up in Next.js config)
- Verify the environment variable is being read (check console for network address display)

## Using Custom API URL in Code

The AnalyzeTextView component accepts an optional `apiBaseUrl` prop:

```tsx
import { AnalyzeTextView } from "@repo/ui/views/analyzeTextView";

// Use custom URL
<AnalyzeTextView apiBaseUrl="http://192.168.1.100:3000" />

// Or let it auto-detect from environment
<AnalyzeTextView />
```

## Advanced Configuration

For more complex setups, you can use the network configuration utilities:

```tsx
import { useApiConfig, getApiBaseUrl } from "@repo/ui/lib/network-config";

// In a component
const { apiBaseUrl, isLocal, networkAddress } = useApiConfig();

// Or get URL directly
const url = getApiBaseUrl("http://custom-backend.com");
```