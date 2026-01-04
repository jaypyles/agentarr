<div align="center">
  <img src="docs/docs-main.png" alt="Agentarr Dashboard" />
</div>

Agentarr is an AI-powered media management application that integrates with popular media automation tools like Sonarr, Radarr, Prowlarr, and Jellyfin. It provides an intelligent interface for managing your media library with AI agents that can automatically add series, movies, and organize files.

<div align="center">
  <img src="docs/workflow.png" alt="Agentarr Workflow" />
</div>

## Features

- 🤖 **AI-Powered Agents**: Automatically add series and movies using natural language queries
- 📺 **Series Management**: Integrate with Sonarr for TV series tracking and management
- 🎬 **Movie Management**: Integrate with Radarr for movie collection management
- 🔍 **Indexer Integration**: Connect with Prowlarr for search index management
- 🎥 **Media Server**: Integrate with Jellyfin for media library access
- 📁 **File Organization**: AI agents can automatically move and organize media files
- 🎨 **Modern UI**: Built with SvelteKit and Tailwind CSS for a beautiful, responsive interface

## Support

This application currently supports:

1. Media Management:
   - Sonarr
   - Radarr
   - Prowlarr

2. Streaming:
   - Jellyfin

3. Download Clients:
   - Qbittorrent

## Startup Guide

1. Copy the `.env.example` to `.env` and fill in the environment variables:

   ```bash
   cp .env.example .env
   ```

2. Start the Docker container:

   ```bash
   docker compose up -d
   ```

3. The app will be available at http://localhost:5173

### Display vs Internal

When deploying in containerized environments like Kubernetes, you may need different URLs for:
- **Internal communication**: Server-to-server connections (e.g., Kubernetes service names)
- **Display URLs**: URLs shown to users in the browser (e.g., external ingress URLs)

The application supports this through environment variable patterns:

#### Internal Variables

For server-to-server communication (these are optional), use `INTERNAL_*_URL` variables. These are used when the API server connects to other services:

- `INTERNAL_SONARR_URL` - Internal URL for Sonarr (e.g., `http://sonarr-service:8989`)
- `INTERNAL_RADARR_URL` - Internal URL for Radarr (e.g., `http://radarr-service:7878`)
- `INTERNAL_PROWLARR_URL` - Internal URL for Prowlarr (e.g., `http://prowlarr-service:9696`)
- `INTERNAL_JELLYFIN_URL` - Internal URL for Jellyfin (e.g., `http://jellyfin-service:8096`)
- `INTERNAL_QB_URL` - Internal URL for qBittorrent (e.g., `http://qbittorrent-service:8080`)

#### Display Variables

For URLs displayed to users in the browser, use the standard `*_URL` variables:

- `SONARR_URL` - Public URL for Sonarr (e.g., `https://sonarr.example.com`)
- `RADARR_URL` - Public URL for Radarr (e.g., `https://radarr.example.com`)
- `PROWLARR_URL` - Public URL for Prowlarr (e.g., `https://prowlarr.example.com`)
- `JELLYFIN_URL` - Public URL for Jellyfin (e.g., `https://jellyfin.example.com`)
- `QB_URL` - Public URL for qBittorrent (e.g., `https://qbittorrent.example.com`)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
