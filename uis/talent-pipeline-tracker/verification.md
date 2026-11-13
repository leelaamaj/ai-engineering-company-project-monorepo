# 4Geeks rubric verification

The 22 implementation tasks and 14 evaluation tasks below follow the portal order. Interactive checks used an isolated fixture with synthetic candidates. The course API is shared.

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | Candidate list and GET /records | Opened the list and moved from page 1 to page 2 of the 24-record fixture. |
| 2 | Dynamic detail and GET /records/:id | Opened Jordan’s profile and reloaded Avery’s direct detail route. |
| 3 | Next.js list/detail navigation | Opened a profile with Enter and returned using the Next.js link. |
| 4 | Name, position, status, stage | All four columns rendered in the results table. |
| 5 | Status and stage query parameters | Combined In progress and Under review. Both values appeared in the URL and the result narrowed to Jordan. |
| 6 | Search by name or email | Searched for Jordan by name and by email. The URL and results changed while the input stayed active. |
| 7 | List loading and error | Observed initial loading, a fixture 503, a successful retry, and an empty result. |
| 8 | All required detail fields | Profile displays name, email, phone, position, LinkedIn and CV links, experience, application date, and pipeline fields. Verified synthetic links and zero experience. |
| 9 | PATCH status | Changed Avery to In progress and verified persistence after reload. |
| 10 | PATCH stage | Changed Avery to Personal interview and verified persistence after reload. |
| 11 | GET notes | Notes loaded on the profile and showed an empty state before creation. |
| 12 | POST note | Added a synthetic interview note and saw it in the refreshed list. |
| 13 | DELETE note | Canceled deletion once, then confirmed and saw the empty state return. |
| 14 | POST candidate | Registered Avery with the validated form and saw the list count rise to 25. |
| 15 | PUT candidate | Edited Avery’s phone, saw the new value, then verified it after reload. |
| 16 | Required fields | Blank full name blocked registration. Blank phone blocked the edit. Unit tests cover blank values and URL, email, and experience validation. |
| 17 | Submission feedback | Registration displayed a fixture 422 error while keeping the entered values, then displayed success. The edit displayed validation and success feedback. |
| 18 | Async/await | [API module](src/lib/api.ts) and [resource hook](src/hooks/use-resource.ts). |
| 19 | Loading, success, and error for reads | [List](src/components/candidate-list.tsx), [profile](src/components/candidate-detail.tsx), and [notes](src/components/candidate-notes.tsx) each render these states. |
| 20 | In-place updates after writes | Count, contact details, pipeline controls, and notes reflected writes before reload. |
| 21 | Folder structure | Routes, components, hooks, API types, and data access are separate under `src/`. |
| 22 | Typed API data | [Tracker types](src/types/tracker.ts) and typed responses in the API module. |
| 23 | Correct fetched list | Verified candidate rows and pagination against fixture data. |
| 24 | Query filters with client-side navigation | Selected both filters on the list and confirmed that Back to candidates restored the query. |
| 25 | Search by both fields | Verified a name match and an email match in the browser. |
| 26 | Correct detail fields and ID | Checked profile data for two IDs, reload persistence, and the missing-ID state. |
| 27 | Both PATCH controls | Verified status and stage separately, including their persistence after PUT. |
| 28 | List, add, and delete notes | Verified all three operations and the confirmation dialog. |
| 29 | Register candidate | Verified invalid input, server rejection, successful registration, and a link to the new profile. |
| 30 | Edit candidate | Verified invalid input, a successful edit, and persistence. |
| 31 | Async feedback | Read states render through the resource hook. Forms, pipeline controls, and note actions provide pending and result feedback. |
| 32 | TypeScript API types | Types cover candidate records, paginated results, notes, mutation bodies, and validation errors. |
| 33 | Separation of concerns | [Components](src/components), [types](src/types), and [API module](src/lib/api.ts). |
| 34 | App Router | [Home route](src/app/page.tsx), [dynamic route](src/app/candidates/%5Bid%5D/page.tsx), and Next.js links. |
| 35 | Scoped state | The list owns registration and search, the profile owns editing and pipeline changes, and notes manage their own requests and form. |
| 36 | TrackFlow scenario | People & Talent branding, Executive Assistant recruitment in Zaragoza, briefing labels, and notes confined to candidate details. |

Browser layout checks covered desktop at 1440 pixels and mobile at 375 pixels. Candidate navigation was exercised by keyboard. The live API checks used read-only requests.
