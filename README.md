# Frame by Frame

A cinematic photography website built with actual Next.js App Router, React, TypeScript, Motion, and Lucide. Responsive editorial design with a scroll-driven couple → photographer → framed memory → opening album sequence.

## Run

```sh
npm ci
npm run dev
```

Open http://localhost:3000. `npm run build` generates the static production site in `out/`. This is a Next.js static export suitable for a CDN, Sites, Netlify, or similar static hosting. For a Node deployment, remove `output: 'export'` from `next.config.ts` before using `npm start`.

## Structure

- `components/photography-site.tsx`: interactive site, scroll story, gallery, native dialogs, email inquiry builder.
- `lib/content.ts`: replaceable story and project content.
- `app/globals.css`: responsive design system and accessible reduced-motion styles.
- `public/images` and `public/videos`: locally served stock media.
- `app/credits/page.tsx`: stock media credits and demo disclosure.

## Features

- Four scroll chapters, camera flash, framed image transformation, perspective album opening and two album spreads.
- Portfolio category filtering and keyboard-operable image lightbox.
- Three local HD background films with generated poster fallbacks, selectable hero moods, playback controls, offscreen/tab-hidden pause, and on-demand loading.
- Scroll-driven photographic ribbon, film collection, FAQ, and video-backed contact section.
- Native dialog focus management and Escape handling, keyboard controls, visible focus, reduced-motion support, mobile navigation.
- Responsive layouts, Open Graph metadata, custom favicon, semantic headings.
- No backend dependency; the inquiry form validates input, prepares an email to sharmaarjit813@gmail.com, and offers a downloadable copy. The visitor reviews and sends in their email app. No false delivery confirmation or server-side storage.

## Before a real client launch

Replace stock imagery, demo studio identity, sample names/locations and demo film. For automatic submission without a mail app, connect the inquiry flow to a server endpoint with server-side validation, spam protection, and an email provider or CRM. Configure client domain and social metadata, enable indexing in `app/layout.tsx`, and add the client's privacy/legal content as appropriate. Fonts are self-hosted with their open font licenses in `public/fonts/`. No fake testimonials or unverified awards are included.

## Verification

`npm run typecheck` and `npm run build`. Browser checks should cover desktop/mobile layouts, all four scroll states, filter and lightbox behavior, video, album controls, email handoff/download and keyboard navigation.
