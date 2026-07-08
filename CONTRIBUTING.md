# Contributing to Ticket-Check-Bro

Thanks for taking the time to contribute! All contributions — bug reports, feature requests, PRs, translations — are welcome.

## Getting Started

1. Fork the repo
2. Clone: `git clone https://github.com/your-username/Ticket-Check-Bro.git`
3. Install: `npm install`
4. Dev: `npm run dev`
5. Build: `npm run build`

## Pull Requests

- Keep changes focused. One feature/fix per PR.
- Run `npm run build` before submitting — must pass with 0 errors.
- Update README if introducing a user-facing feature.
- Add tests if adding new parsers or extraction logic.

## Adding a New Document Parser

1. Create `src/core/parser/YourParser.js` extending `InvoiceParser`
2. Implement `typeId`, `label`, `confidence(text)`, `parse(text)`
3. Register it in `src/core/parser/index.js` (add to `_parsers` array)
4. Add schema in `src/data/schemas.js` (`DOCUMENT_TYPES` + `getFieldSchema`)
5. Add i18n keys in `src/locales/{zh,en}.json`
6. Add option in `src/components/DetailPanel.jsx` (`TYPE_OPTIONS`)

## i18n

Translations live in `src/locales/`. To add a new language:

1. Copy `en.json` → `your-lang.json`
2. Translate all values
3. Add `your-lang.json` import + language option in `src/i18n.js`

## Code Style

- ESLint + Prettier (configs in repo root)
- React functional components with hooks
- Zustand for state management
- CSS variables for theming (dark mode auto-support)

## Reporting Issues

Use the GitHub issue templates — include browser version, steps to reproduce, and expected vs actual behavior.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
