# TrackFlow public website — Milestone 1

A bilingual business inquiry website for e-commerce companies seeking warehouse management, last-mile delivery, and reverse logistics in the United States and Spain. HTML, compiled Tailwind CSS, and vanilla JavaScript. No backend or actual inquiry delivery.

## Run from the monorepo root

```sh
npx http-server uis/website -p 3000 -a 0.0.0.0
```

Open `http://localhost:3000`. In Codespaces, open the forwarded port 3000. The compiled `styles.css` is included, so previewing the website needs no build step.

To rebuild styles, run tests, or repeat the mobile audit:

```sh
cd uis/website
npm ci
npm run build
npm test
npm run audit
```

Tests use an installed Google Chrome (`channel: 'chrome'`). In a Codespace without Chrome, install the supported Playwright browser (`npx playwright install --with-deps chromium`) and run `PLAYWRIGHT_CHANNEL=chromium npm test` in that environment. Lighthouse requires Chrome/Chromium; `CHROME_PATH` can specify its executable. The root launch command and `npm start` both bind port 3000 on `0.0.0.0`.

## How the pieces fit together

- `index.html`: homepage, semantic sections, supplied company copy, contact links, and Organization JSON-LD.
- `application.html`: the exact 12 business inquiry fields, accessible groups and errors, demo privacy explanation, and simulated success.
- `i18n.js`: complete EN/ES text, options, titles, descriptions, and language preference. Values stay canonical English even when labels are Spanish. Translation uses `textContent`, never HTML injection.
- `validation.js`: blur/submit validation, correction feedback, first-error focus, comments counter, reset, and low-volume confirmation.
- `styles.input.css` / `styles.css`: Tailwind source and compiled output. No CDN dependency, remote fonts, or page images.
- `CONTEXT.md` and `CONTEXT.es.md`: unchanged official milestone briefings; the monorepo's general company context remains unchanged.

The base language is English. EN/ES selection persists in `localStorage`; entered personal/company details do not. Changing language keeps all current form values and updates errors and success text. Leaving/reloading resets the form. The full contact name is one field as the context requires; services allow multiple choices, and current 3PL allows one.

## Validation and scope decisions

Company names need at least two trimmed characters; contact names need at least two words. Email requires a valid format. Phone must begin with `+`, a nonzero country prefix, and a plausible length; this is format checking, not phone ownership verification. Optional websites must be HTTP/HTTPS URLs with a hostname. All required selects must use their specified values, at least one service must be selected, and privacy consent is mandatory. Comments may be at most 500 characters; pasted over-limit text is shown with a specific error rather than silently truncated.

The briefing says to show the warning for `0-100` shipments and a relevant product type. Here, any valid product selection is relevant. The warning appears immediately, and successful simulation requires explicit confirmation; changing product or shipment volume revokes that confirmation. This does not reject small businesses outright.

The supplied success copy is shown with an explicit simulation notice. A visible demo notice and privacy explanation clarify that no inquiry is sent or stored. A production privacy policy and backend are outside the milestone. Copyright stays **2025**, matching the context's required copy.

## Verification evidence — October 2, 2026

- **20/20 Playwright tests passed**: validation, option/consent requirements, 500/501 character boundary, low-volume confirmation, language preservation, reset, keyboard controls, no submission requests, console errors, and both pages at 375/768/1440px in both languages.
- Local mobile Lighthouse 13.5.0: **100 performance / 100 accessibility / 100 best practices / 100 SEO** on both pages. Scores are point-in-time local measurements, not public Codespaces measurements or instructor approval. Automated accessibility checks are supplemented by keyboard and in-app browser inspection.
- Reports: [homepage](./docs/lighthouse.report.html), [form](./docs/lighthouse-form.report.html), [score screenshot](./docs/lighthouse-score.png).
- Review checkpoints: [desktop homepage](./docs/home-desktop.png), [desktop form](./docs/form-desktop.png), [Spanish mobile homepage](./docs/home-mobile-es.png).
- [Design review](./docs/design-review.md) documents comparison with the generated reference and the necessary context corrections.

## Codespaces and submission handoff

The existing devcontainer forwards port 3000. After review and authorization to publish:

1. Push branch `codex/trackflow-public-website` to the existing company repository and create a PR using `docs/PR-DESCRIPTION.md`.
2. Open that branch in Codespaces, run the root launch command, and set forwarded port 3000 visibility to **Public**.
3. Copy the actual public preview URL into the PR description and verify that it loads in a signed-out browser. No URL is invented in the draft.
4. Run PageSpeed Insights against that URL. If unreachable, use Lighthouse on the same Codespaces preview; attach the score screenshot. The checked-in local Lighthouse report is useful review evidence but does not establish public reachability.
5. Review the final PR and performance evidence with the user before course submission. Submit the existing repository URL only after approval.

Current GitHub CLI credentials cannot list Codespaces because they lack the `codespace` scope. No credential scope was changed. No remote push, PR creation, public port change, or course submission was performed during local implementation.
