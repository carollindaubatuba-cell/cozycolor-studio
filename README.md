# CozyColor Studio

*A little color, a little calm.* — an interactive digital coloring book for adults, by **Belalumi Studio**.

Cozy kawaii illustrations (cute animals, little cafés, reading nooks, plants, cottages and creative hobbies) that you color by tapping shapes. Progress saves automatically in the browser. No accounts, no backend, no paid services.

## Requirements

- Node.js 18 or newer (tested on Node 22)
- npm 9+

## Setup & run

```bash
npm install        # install dependencies
npm run dev        # start the dev server → http://localhost:5173
npm run typecheck  # TypeScript check only
npm run check:art  # validate every coloring page (ids, labels, geometry)
npm run build      # typecheck + artwork check + production build into dist/
npm run preview    # serve the production build → http://localhost:4173
```

The built `dist/` folder is fully static and uses relative paths plus hash routing (`#/library`, `#/color/teacup-kitty`), so it works on Netlify, Vercel, GitHub Pages or any plain static host without rewrite rules.

## Tech stack

React 18 · TypeScript (strict) · Vite 5 · organized global CSS with design tokens · inline SVG artwork · LocalStorage persistence.

## Project structure

```
src/
  App.tsx                  App shell, routing, focus management, lazy workspace
  main.tsx                 Entry point
  types.ts                 Shared types (Artwork, Region, SavedProgress, Route…)
  components/
    ArtworkSvg.tsx         Renders artwork line art + fills; interactive mode for coloring
    ArtworkCard.tsx        Gallery card (thumbnail, meta, progress)
    CategoryCard.tsx       Browse-by-category card
    Header.tsx / Logo.tsx  Top navigation with saved-artwork count
    Footer.tsx             Belalumi Studio footer
    ProgressBar.tsx        Accessible progress bar
    SectionHeading.tsx     Section titles
    StateViews.tsx         Loading, empty and error states
    ErrorBoundary.tsx      Catches render errors per route
  pages/
    HomePage.tsx           Hero, featured page, categories, continue coloring, gallery
    LibraryPage.tsx        Full library with category filter
    SavedPage.tsx          "My Artwork" — saved progress, continue / clear
    WorkspacePage.tsx      Coloring workspace (lazy-loaded chunk)
    NotFoundPage.tsx
  data/
    artworks/              35 original SVG illustrations, one file per category
      shapes.ts            Drawing toolkit: leaf, heart, star, cloud, flower, face, steam…
      index.ts             ARTWORKS list + home-page GALLERY_PICKS
    categories.ts          Category definitions
    palette.ts             Curated 20-color palette
  hooks/
    ProgressContext.tsx    Saved-progress state shared across the app
    useHashRoute.ts        Hash-router hook
  lib/
    storage.ts             Safe LocalStorage read/write with validation
    router.ts              Route parsing + link helpers
    completion.ts          Progress % and "saved x ago" helpers
  styles/
    tokens.css             Colors, type, radii, shadows
    base.css / layout.css / components.css / pages.css
```

## How coloring works

Each artwork is a list of **regions** (closed SVG shapes drawn back to front) plus **decorations** (non-colorable details like eyes and whiskers). Filling stores `regionId → hex` in a `FillMap`. Saved data lives under the LocalStorage key `cozycolor-studio:progress:v1`.

### Adding a new illustration

1. Open the category file in `src/data/artworks/` (e.g. `cafes.ts`) and add an `Artwork` with a unique `id` and `regions` in draw order (background first). The helpers in `shapes.ts` make common shapes one-liners.
2. Give every region a unique `id` and a readable `label` (used by screen readers).
3. Put non-colorable line work in `decorations`.
4. Add it to that file's exported array. It appears in the library and its category automatically.
5. Run `npm run check:art`. The build refuses to ship a page with duplicate ids, missing labels or broken geometry.

Never rename a region `id` on a published page: saved progress is stored by region id.

## Accessibility

- Visible focus rings on all interactive elements, a skip link, and focus moved to new content on navigation.
- Every colorable shape is keyboard reachable (Tab, then Enter/Space) with a descriptive label.
- Color changes are announced to screen readers; touch targets are at least 44px.
- Respects `prefers-reduced-motion`.

## Implemented in this foundation

- Responsive layout (mobile-first), navigation, home sections, library filter, My Artwork page, footer
- Coloring workspace: palette, tap-to-fill, eraser, undo (button + Ctrl/Cmd+Z), start over, progress %, debounced autosave with save status
- Loading, empty and error states (including damaged or blocked storage, unknown artwork, unknown category, render errors)

## Command Code 02 — workspace upgrades

- **Zoom & pan:** pinch on touch, Ctrl/⌘ + scroll or trackpad pinch on desktop, on-screen − / + / Fit controls, and `+` `−` `0` keys. When zoomed, drag (or scroll) to move around; a tap still fills a shape, a drag never does. Tabbing to an off-screen shape pans it into view. Range 100%–500%.
- **Redo:** button plus Ctrl/⌘+Shift+Z or Ctrl+Y (history of 50 steps).
- **Custom color picker** (native color input) and a **recent colors** row (last 8 used, remembered in this browser under `cozycolor-studio:recent-colors:v1`).
- **Completion moment:** reaching 100% shows a confetti burst and a "You finished…" card; finished pages get a **Completed** badge in the workspace, gallery and My Artwork.

## Command Code 03 — save, share & print

- **Download image:** a square 2048 × 2048 PNG of the page on a white paper card with a small "CozyColor Studio by Belalumi Studio" caption (`cozycolor-<page>.png`). Rendered in the browser from the SVG, so no server is needed.
- **Share:** on phones/tablets that support sharing files, a Share button opens the system share sheet (Instagram, Messages…). It only appears where it works; if sharing is refused it falls back to a download.
- **Print:** `#/print/<page>` shows a printer-friendly sheet: **Blank line art** or **With my colors**. Print styles hide the header, footer and controls and fit the art to one page.
- **Where:** a "Save & share" section in the workspace, a download/share button on the "You finished" card, and Download / Print on each My Artwork item.
- **My Artwork filter:** All / In progress / Finished, with counts and empty states for each.

## Command Code 04 — content

- **35 pages, 675 colorable shapes:** 5 per category across Cute Animals, Little Cafés, Books & Nooks, Plants & Greenery, Cozy Homes, Creative Hobbies and the new **Autumn & Holidays** set.
- Knitting Bunny redrawn (cleaner scarf, needles and yarn); its region ids were kept so existing saves still work.
- Home page: the seasonal set gets a wide "New for the season" card, and the gallery shows 9 hand-picked pages with a "See all 35 pages" link.
- `npm run check:art` validates every page and runs as part of `npm run build`.

## Not yet implemented (roadmap)

- Saved palettes
- Gradients, textures, brush/pen drawing modes
- Favorites, search, sorting
- Dark mode, PWA/offline install, automated tests

## Notes

Fonts (Fredoka + Nunito) load from Google Fonts; if they're unavailable the app falls back to system rounded/sans fonts.

© 2026 Belalumi Studio
