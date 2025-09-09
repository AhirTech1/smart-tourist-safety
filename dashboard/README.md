# Smart Tourist Safety Dashboard

A React dashboard for monitoring tourist safety and high-risk zones.

## Features

- Real-time tourist tracking
- High-risk zone visualization
- Alert management
- Statistics and reports
- Interactive maps with Leaflet

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Leaflet** - Interactive maps
- **Lucide React** - Icons

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

1. Copy the environment example file:
```bash
cp .env.example .env.local
```

2. Update the environment variables in `.env.local` as needed.

### Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Deployment

### Vercel Deployment

This project is optimized for Vercel deployment:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your backend API URL
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Upload the `dist` folder to your hosting provider

## Project Structure

```
src/
├── components/          # Reusable UI components
├── views/              # Page components
├── services/           # API service layer
├── styles/             # CSS files
└── App.jsx             # Main app component
```

## API Configuration

The dashboard connects to a backend API. Configure the API URL in your environment variables:

- **Development**: `http://localhost:3000/api`
- **Production**: Your deployed backend URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the ISC License.
