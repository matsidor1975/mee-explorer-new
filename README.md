# Biconomy Explorer

A comprehensive React-based blockchain explorer for Biconomy Network, providing advanced real-time transaction insights with enhanced data retrieval and user experience.

## Features

- **Transaction Search**: Search and view detailed blockchain transaction information
- **Network Status**: Real-time monitoring of network health and module status
- **Token Information**: Dynamic token name resolution and blockchain data
- **Search History**: Local storage of recent searches with timestamps
- **Multi-Chain Support**: Integration with multiple blockchain networks

## Tech Stack

- **Frontend**: React.js + TypeScript + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Build Tools**: Vite + ESBuild
- **Data Fetching**: Viem for blockchain data + Axios for API calls
- **UI Components**: Radix UI + shadcn/ui

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## Deployment

### Building for Production

**Important**: Use the custom build script for deployment to ensure correct file organization:

```bash
node build.js
```

This script:
1. Builds the frontend with Vite
2. Builds the backend with ESBuild  
3. Moves files from `dist/public/` to `dist/` for proper deployment structure
4. Organizes all files correctly for deployment platforms

### Alternative Build (Development Only)

```bash
npm run build
```

**Note**: The standard npm build leaves files in `dist/public/` which may cause deployment issues. Always use `node build.js` for production deployment.

### Starting Production Server

```bash
npm start
```

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string (optional)
- `BICONOMY_API_KEY`: API key for Biconomy Network access
- `NODE_ENV`: Environment specification (development/production)

## Project Structure

```
.
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utilities and configurations
├── server/              # Backend Express application
├── shared/              # Shared schemas and types
├── build.js             # Custom deployment build script
└── dist/                # Production build output
```

## Deployment Platforms

This application is optimized for deployment on:

- **Replit**: Use the provided workflows
- **Vercel**: Deploy with `node build.js` build command
- **Netlify**: Use `node build.js` as build command
- **Traditional VPS**: Build with `node build.js` then run `npm start`

## API Integration

The explorer integrates with:

- **Biconomy Network API**: Primary data source for blockchain information
- **Multiple Chain RPCs**: Via Viem for token information and native currency data
- **Block Explorers**: For transaction and token links

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `npm run dev`
5. Build with `node build.js` to verify deployment readiness
6. Submit a pull request

## License

MIT License - see LICENSE file for details