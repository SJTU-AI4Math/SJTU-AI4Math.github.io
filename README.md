# SJTU AI4Math

Official website for the SJTU AI for Mathematics group, published at [sjtu-ai4math.github.io](https://sjtu-ai4math.github.io/).

## Stack

- React + TypeScript + Vite
- TanStack Router with nested, type-safe routes
- i18next with Chinese and English locales
- Persistent light/dark themes with system-preference initialization
- [`@sjtu-ai4math/snl-basics`](https://www.npmjs.com/package/@sjtu-ai4math/snl-basics) and KaTeX styles
- GitHub Actions deployment to GitHub Pages

## Development

```bash
npm ci
npm run dev
```

Quality gates:

```bash
npm test
npm run lint
npm run build
npm audit
```

The production build creates both `dist/index.html` and `dist/404.html`, allowing GitHub Pages to serve client-side routes directly.

## Brand assets

The light and dark logo variants in `public/brand/` come from [`SJTU-AI4Math/SNL-Doc-Extension`](https://github.com/SJTU-AI4Math/SNL-Doc-Extension).
