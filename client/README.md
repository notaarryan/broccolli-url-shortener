# Broccolli Frontend

## Run
- `npm install`
- `npm run dev`

## Build
- `npm run build`
- `npm run preview`

## API Contract
Frontend expects `POST /shorten`:

```json
{
  "original_url": "https://example.com",
  "custom_slug": "optional-slug"
}
```

Compatibility fallback is built in for legacy `POST /url` payloads.

Environment options:
- `VITE_SHORTENER_API_URL` (default: `/shorten`)
- `VITE_SHORTENER_LEGACY_URL` (default: `/url`)

## Performance Checks
Run Lighthouse against the production preview:
- `npm run build`
- `npm run preview`
- Audit `http://localhost:4173` in Chrome Lighthouse (mobile + desktop)

Current implementation reserves result-region height to minimize CLS and disables non-essential animation under reduced-motion.
