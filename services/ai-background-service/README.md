# AI Background Service

This service runs automated background jobs for the Auto Articles platform, generating AI-powered articles and images to keep your content sites fresh and SEO-optimized. It works alongside the API and web app to enable scalable, automated content creation.

See the [root README](../../README.md) for a high-level overview of the monorepo and its architecture.

---

## Features

- Automated cron jobs for article and image generation
- AI-powered content creation for SEO and monetization
- Integrates with the API and database
- TypeScript, modular code, and SOLID principles

---

## Main Jobs

- **Article Generation:** Runs every 12 hours to enqueue new AI-generated articles
- **Image Generation:** Runs every minute to generate images for articles/scenes

---

## Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```
2. **Set environment variables:**
   - Configure required environment variables as needed
3. **Run the background service:**
   ```bash
   pnpm dev
   ```

---

## License

This service is licensed for commercial use. See the root README for more details.
