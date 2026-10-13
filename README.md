# portfolio-v2

Hero base: a faithful rebuild of the mijobello.com home hero (loader, header, menu, hero grid),
on the same stack: Next.js (App Router), Tailwind v4, Motion and Lenis.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Swapping in your own content

Everything personal is in `src/content/site.ts`. Values marked `PLACEHOLDER` point at files in
`public/placeholders/`: the wordmark, the logo (one per theme), the hero image or video, the
portrait, the sketch in the bottom-right cell, the menu media and the social links.

## Where things live

- `src/components/intro.tsx`: home loader (3D grid room, 000→100 counter, media handoff, 12-column wipe)
- `src/components/header.tsx`: header bar, world clocks marquee, theme toggle
- `src/components/menu.tsx`: burger button and slide-in menu
- `src/components/hero.tsx`: hero grid and its reveal
- `src/components/theme.tsx`: light/dark inversion with the skewed sweep
- `src/lib/tokens.ts` and `src/app/globals.css`: grid, type, colour and easing tokens
