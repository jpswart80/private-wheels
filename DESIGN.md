# Private Wheels — Design System

An Airbnb-inspired visual system ("Style 1"): a white canvas, charcoal ink, a
single warm accent, hairline structure, and soft low-contrast elevation. Chrome
gets out of the way; photography and listings carry the page.

## Colour

All colour flows through CSS custom properties in
[`src/app/globals.css`](src/app/globals.css). Use the Tailwind token classes
(`bg-background`, `text-foreground`, `text-muted-foreground`, `border`,
`bg-muted`, `bg-primary`, …) — never hardcode hex in components.

| Token | Value | Role |
| --- | --- | --- |
| `--background` / `--card` | `#ffffff` | page & surface |
| `--foreground` | `#222222` | primary text, dark buttons |
| `--muted-foreground` | `#6a6a6a` | secondary text, meta |
| `--muted` / `--secondary` / `--accent` | `#f7f7f7` | subtle fills, footer, CTA bands |
| `--border` / `--input` | `#ebebeb` | hairlines, dividers, field borders |
| `--primary` | `#ff385c` | accent — search button, price highlights, active pills. Hover `#e00b41`. |
| `--ring` | `#222222` | focus ring |
| `--navy` (legacy name) | `#222222` | retained token that now resolves to charcoal — the few deliberately dark bits (wizard step indicator) |
| `--destructive` | red | form errors only |

There is no mounted `ThemeProvider`; the `.dark` block exists for parity but is
dormant. Design for light.

## Typography

Geist (`font-sans`), already the app default.

- **Headings:** `font-semibold` (or `font-medium` for the 22px section titles),
  always with tight tracking — `tracking-tight` or `tracking-[-0.02em]`. Never
  `font-extrabold`. Section titles ~`text-[22px]`; page titles
  `text-2xl sm:text-3xl`.
- **Body:** `text-sm` at `leading-[1.43]` for supporting copy;
  `text-muted-foreground` for anything secondary.
- **No uppercase eyebrow labels.** Drop the `text-xs tracking-widest uppercase`
  kickers from the old system.

## Shape & elevation

- **Pills:** search capsule, all buttons, filter chips, nav actions →
  `rounded-full`.
- **Cards / panels:** `rounded-xl` (media) to `rounded-2xl` (containers).
- **Structure is hairlines, not shadows or heavy borders.** Prefer `border-b` /
  `divide-*` on `--border`. Reach for shadow only where an element floats:
  - `.shadow-capsule` — the hero search + elevated panels (buy-box, auth card)
  - `.shadow-pill` — small floating controls (scroll-row arrows, card chips)

## Components

Shared building blocks live in `src/components/`:

- `site-header` / `site-footer` — white sticky nav (`h-20`, wordmark + `Car`
  icon), light `#f7f7f7` footer.
- `site-container` — the one content grid; header, page content and footer all
  wrap in it so edges line up (`max-w-[1400px]`, `px-5 sm:px-8 lg:px-12`).
- `hero-search-bar` — the rounded search capsule: a combined `make-model-picker`
  (pick a make → its model list with multi-select; "Add more" stacks the pick as
  a dismissable chip so several makes/models can be searched at once) +
  `location-picker`, both built on the shared `picker-field` panel shell.
  Stacked picks serialize to the `mm` URL param (`src/lib/make-model.ts`).
- `scroll-row` — horizontal snap row with desktop arrows and an optional
  "see more" action; the home page's primary listing surface.
- `vehicle-card` — compact tile for the home page and PDP "similar" rail:
  4:3 image (real photo or `vehicle-placeholder`) with condition / `Price drop`
  badges and a town chip over it, then year → title → icon spec row → labelled
  price (pre-drop price struck through, live price in brand red). Never narrower
  than `MIN_TILE_WIDTH` (260px); parents place it at `w-[260px] shrink-0` in a
  scroll row or `repeat(auto-fill, minmax(260px, 1fr))` in a grid.
- `vehicle-list-card` — wide one-per-row card for the PLP: main image + details
  side by side, full-width thumbnail strip along the bottom, optional
  `Great price` / `Fair price` pill from `getPriceRating` (`src/lib/filter.ts`).
- `body-style-icon` — bespoke filled side-profile silhouettes for the "Shop by
  style" tiles (placeholder set; swap for licensed renders in production).
- `budget-matcher` — home-page affordability widget: monthly budget + deposit +
  term → a price ceiling and a live count of matching listings (`maxVehiclePrice`
  in `src/lib/finance.ts`).
- `vehicle-placeholder` — light grey gradient + faint car glyph, shown when a
  listing has no photo; pass `compact` to enlarge the glyph on small thumbnails.

## Layout

The home page and the shared header/footer align to `site-container`
(`max-w-[1400px]`, `px-5 sm:px-8 lg:px-12`); the other pages still use their own
`max-w-7xl` / `max-w-[1100px]` wrappers (migrate them to `site-container` when
touched). Sections are separated by `border-b` / `border-y` or a `bg-muted`
band, not gaps alone.
