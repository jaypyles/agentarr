# Agentarr

Agentarr is an AI-powered media management application that integrates with popular media automation tools like Sonarr, Radarr, Prowlarr, and Jellyfin. It provides an intelligent interface for managing your media library with AI agents that can automatically add series, movies, and organize files.

![Agentarr Dashboard](docs/docs-main.png)

## Features

- 🤖 **AI-Powered Agents**: Automatically add series and movies using natural language queries
- 📺 **Series Management**: Integrate with Sonarr for TV series tracking and management
- 🎬 **Movie Management**: Integrate with Radarr for movie collection management
- 🔍 **Indexer Integration**: Connect with Prowlarr for search index management
- 🎥 **Media Server**: Integrate with Jellyfin for media library access
- 📁 **File Organization**: AI agents can automatically move and organize media files
- 🎨 **Modern UI**: Built with SvelteKit and Tailwind CSS for a beautiful, responsive interface

## Architecture

This is a monorepo built with:
- **Frontend**: SvelteKit application (`apps/site`)
- **Backend**: Fastify API server (`apps/api`)
- **Shared Packages**: Reusable components and utilities in `packages/`

The project uses:
- [Turbo](https://turbo.build/) for monorepo management
- [pnpm](https://pnpm.io/) for package management
- [Docker](https://www.docker.com/) for containerization

## Prerequisites

- Node.js >= 18
- pnpm 9.0.0
- Docker (optional, for containerized deployment)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cockpit
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:

```env
# Sonarr Configuration
SONARR_URL=http://localhost:8989
SONARR_API_KEY=your_sonarr_api_key

# Radarr Configuration
RADARR_URL=http://localhost:7878
RADARR_API_KEY=your_radarr_api_key

# Prowlarr Configuration
PROWLARR_URL=http://localhost:9696
PROWLARR_API_KEY=your_prowlarr_api_key

# Jellyfin Configuration
JELLYFIN_URL=http://localhost:8096

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
MODEL=gpt-4
```

## Development

Start the development servers:

```bash
pnpm dev
```

This will start both the frontend and backend in development mode.

### Individual Services

You can also run services individually:

```bash
# Frontend only
pnpm --filter site dev

# Backend only
pnpm --filter api dev
```

## Building

Build all applications:

```bash
pnpm build
```

## Production

### Using Docker

Build and run with Docker Compose:

```bash
docker-compose up --build
```

The application will be available at `http://localhost:5173`.

### Development

1. Build the applications:
```bash
pnpm build
```

2. Start the production servers:
```bash
pnpm start
```

## Available Scripts

- `pnpm dev` - Start development servers
- `pnpm build` - Build all applications
- `pnpm start` - Start production servers
- `pnpm lint` - Lint all packages
- `pnpm format` - Format code with Prettier
- `pnpm check-types` - Type check all packages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your license here]
