# CS-Score reviewer notes

## Architecture

This is a Vite + React 18 + strict TypeScript widget gallery. `src/App.tsx` discovers widget components dynamically from category directories (`components`, `editors`, `dialogs`, `charts`, `filters`, `stats`, and `views`), sorts them, and renders them lazily with pagination, filtering, and per-widget error boundaries. `src/ui` contains reusable controlled form and display primitives, while `src/charts` contains standalone chart widgets with deterministic demo data.

## Conventions

- The project uses ES modules, React’s automatic JSX runtime, and strict type-checking; changes must satisfy `npm run build` (`package.json`, `tsconfig.json`).
- Gallery widgets must live in one of the globbed directories in `src/App.tsx`, export a **default React component**, and generally use the filename as the gallery display name. The loader explicitly throws when a default export is absent.
- Widget modules may also expose named types, data generators, or components. For example, `src/charts/AccountChart.tsx` exports `AccountPoint`, `AccountChartMode`, `AccountChartProps`, `generateAccountSeries`, and both named and default `AccountChart`.
- Chart APIs follow a repeated pattern: optional `title`, `data`, `width`, and `height` props; `{label, value}` point types; `"bar" | "line"` mode types; and deterministic `generate<Name>Series()` helpers (`src/charts/*.tsx`).
- State belongs in consuming widgets for controlled shared UI components. Use the primitives from `src/ui` via relative imports, and preserve native attributes and explicit `type="submit"` behavior (`src/ui/README.md`).
- Accessibility patterns are deliberate: labels are linked with `htmlFor`, loading/error states use live or alert regions, buttons use `type="button"`, and chart SVGs use `role="img"` plus `aria-label` (`src/App.tsx`, `src/charts/AccountChart.tsx`).
- App-level layout currently uses inline styles rather than a stylesheet (`src/App.tsx`); shared UI requires no additional packages or stylesheets (`src/ui/README.md`).

## Intentional non-standard choices

- The chart files are highly repetitive rather than abstracted into one generic chart component. Each chart has its own point type, seed, default mode, CSS class, and series length, so preserve per-widget independence unless intentionally refactoring all chart variants together.
- Gallery discovery intentionally excludes `src/ui`; shared components are reusable imports, not standalone demos (`src/ui/README.md`).
- Chart demo data is pseudo-random but deterministic, using a local seeded recurrence rather than `Math.random()` (`src/charts/*.tsx`).

## Watch out for

- Adding a gallery widget without a default export, or placing it outside the glob patterns, makes it invisible or causes the loader error (`src/App.tsx`).
- Do not use unstable or non-unique list keys. Chart points currently use `p.label`; generated labels must remain unique (`src/charts/*.tsx`). Shared `DefinitionList` items and select options likewise require unique values/IDs (`src/ui/README.md`).
- Preserve page reset behavior when changing filtering: `App` resets to page 1 on `query` changes and clamps the current page to the available page count (`src/App.tsx`).
- Chart interactions are mouse-hover based and SVG marks have no keyboard interaction or per-point accessible text. Flag regressions in accessibility, especially if adding interactive chart controls or replacing the existing `aria-label`.
- Guard chart changes against invalid dimensions or empty/custom data; calculations rely on `width`, `height`, and `series` assumptions (`src/charts/*.tsx`).