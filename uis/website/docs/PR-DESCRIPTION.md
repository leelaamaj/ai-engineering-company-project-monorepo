# Add TrackFlow's bilingual public website and business inquiry form

TrackFlow's commercial team needs a clear presentation of its US/Spain services and structured inquiries from potential e-commerce clients. This adds the required landing page and 12-field information request form, with full English/Spanish text, accessible validation, low-volume confirmation, and simulated submission.

Plain HTML, compiled Tailwind, and vanilla JavaScript live in `uis/website`. The root company context is preserved; unchanged milestone-specific context copies accompany the website. Run from the repository root:

```sh
npx http-server uis/website -p 3000 -a 0.0.0.0
```

Validation: 20 browser tests passed across both languages and 375/768/1440px layouts. Local mobile Lighthouse scored 100 in performance, accessibility, best practices, and SEO on both pages. The form sends no data; only language preference persists.

![Local Lighthouse evidence](https://raw.githubusercontent.com/leelaamaj/ai-engineering-company-project-monorepo/codex/trackflow-public-website/uis/website/docs/lighthouse-score.png)

Evidence is in `uis/website/docs/`: `lighthouse-score.png`, both Lighthouse HTML/JSON reports, and desktop/mobile screenshots. The image link above will resolve after the branch is pushed.

**Public Codespaces preview: pending publication approval and Codespaces access.** Add the actual URL and publicly verified audit evidence here before evaluation. The local audit does not prove public preview reachability. No course submission has been made.
