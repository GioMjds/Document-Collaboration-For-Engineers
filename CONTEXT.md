# CONTEXT.md — Engineering Document Control & NOC Tracker

> Orientation file for humans and AI agents. Read this first. Keep it updated as decisions change.

## 1. What this project is

A web-based **document control and authority-NOC tracking system** for a Dubai engineering consultancy. It replaces:

- **SharePoint folders** (one per project, open to everyone, no per-user permissions, folders have gone missing)
- **An Excel masterlog** (manual tracking of projects, submissions and NOCs)

Client contact: Jaylene Barias (communication over Messenger).

**Core idea:** one system where documents are submitted, reviewed, approved and audited, and where each project's authority NOC progress is tracked, with access controlled per role and per assigned project.

## 2. Current state

- **MVP demo built and deployed** (docu-collab-three.vercel.app). It covers the document workflow only:
  - Schema: `profiles`, `documents`, `reviews`
  - Row-level security (RLS) per role
  - Direct-to-storage upload, then a server action inserts metadata
  - Review queue, with a required comment on rejection
  - Users page for role changes
  - Archive/restore for the DC
- **Now:** expanding the MVP using the client's _Data Workflow_ PDF (Projects List, NOC Matrix, NOC Tracker, Project Status, Dashboard).
- **Client discovery:** 7 of 24 questions answered (see §6). Phase-1 scope and pricing not yet drafted.

## 3. Tech stack & decisions

| Decision       | Choice                                                                | Reason                                                     |
| -------------- | --------------------------------------------------------------------- | ---------------------------------------------------------- |
| App type       | PWA (not React Native)                                                | Internet is reliable; no offline need; simpler to ship     |
| Framework      | Next.js + Tailwind/shadcn                                             | Fast to build, Vercel deploy                               |
| Backend        | Supabase (Postgres, Auth, Storage)                                    | RLS fits role/project permissions; storage for large files |
| Permissions    | Role-based **and** project-assignment-based                           | Not device-based                                           |
| Framing        | Document control system (submit → review → approve, with audit trail) | Matches client's actual problem                            |
| Scope strategy | Narrow MVP first, quote afterwards                                    | Avoid over-committing before discovery finishes            |

## 4. Roles & access

| Role                                                     | Access                                                                               |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Authority / MEP / Architect / Structure / Civil Engineer | Edit and upload, **assigned projects only**                                          |
| Resident Engineer (RE)                                   | Edit, upload, **approve**; can see client-consultant contract amount                 |
| Area Manager (AM)                                        | Edit, upload, **approve**; sees Projects List and Dashboard                          |
| CEO                                                      | Read-only (delegates to DC/admin); sees Projects List and Dashboard                  |
| Document Controller (DC)                                 | Edit, upload, **delete**; assigned projects only                                     |
| Admin                                                    | Full access; adds employees; **only role that assigns engineers and DC to projects** |

Key rules:

- Engineers and DC see only projects they are assigned to (Authority Tracker, NOC Tracker, Dashboard).
- **Projects List is confidential (money):** Admin, CEO, Area Manager only.
- Client-consultant contract amount: CEO, Admin, RE only. Not engineers, not DC.
- Discipline status fields are editable only by that discipline's engineer + Admin (Architecture, Structure, MEP).

Example assignments from the PDF: Project 23015 and 23016 each have one Authority Engineer, Architect, MEP, Structure, Civil, one RE, one AM, and one DC. Some people (e.g. the Authority Engineer, DC) span multiple projects.

## 5. Modules (from the Data Workflow PDF)

1. **Authority Tracker Documents** — project-scoped document upload/edit with role permissions (§4).
2. **Projects List** — master record per project:
   - Identity: ID, Project Code (5 digits, `YY` + 3-digit sequence, e.g. `23016`, unique), Owner, Client, Description, Location
   - Dates: TCP Submitted, Agreement Signed
   - Classification: Master Authority (Nakheel & Trakhees / Dubai Municipality / DDA), Project Type (Residential / Commercial / Mixed-use), Contract Type, Contract Status (Billable / Not Active / On Hold), Contract Conditions (Signed / For Client Approval / No Contract), Current Stage (Planning / Design / Construction / Handover / Completed), 3D Design, Remarks
   - **Conditional fields by Contract Type:**
     - _Design:_ Engineers in charge (multi), commencement date, planned completion, building permit date, contract amount
     - _Supervision:_ Engineers in charge (multi), 1 DC, commencement, duration (months), completion date, amount, Extension of Time (date / till completion / on hold), project status (Terminated / Completed / Not Active / Active), actual/expected completion
   - Other contract types (Third Party Inspection, PT Project Manager, Limited Service, Snagging, MEP Review, Permitting, Fit-out, Design & Supervision) exist in the enum; their conditional fields are **not defined yet**.
3. **Authority NOC Matrix** (reference/config data) — per Master Authority: Reviewing Authority, Stage (Construction / Information / Design / Handover NOC), description, sequence number, **blocking sequence**, validity/expiry, submitted-by (Consultant / Client / Contractor / Specialists), and **interconnected requirements** (a NOC's requirements depend on other NOCs being obtained).
4. **Project NOC Tracker** — instance of the Matrix per project (linked to Projects List + Matrix):
   - Stage, Reviewing Authority, Description, Submitted by, Authority reference number
   - Status: Approved / Rejected / Not Started / Pending for Payment / Not Needed / Expired
   - Payment fee, Plan date, Apply date, NOC issuance date, Expiry date, Requirements
5. **Current Status of Projects** — Architecture, Structure, MEP status (discipline-owned); Authorities status for Design / Construction / Revision stages; Third-Party Specialists (multi-select, ideally with file upload): Vertical Transportation, Traffic Impact Study, Green Building, Topographical, Geotechnical.
6. **Dashboard** — latest status per discipline and authority stage, **pending submittals with days of delay**, and **expirations**. Visible to CEO, Admin, AM; Engineers/DC see assigned projects only.

## 6. Business rules

**Confirmed by client:**

- Drawings need approval from **both RE and AM** before submission to authorities.
- CEO is read-only.
- Two contract amounts exist (client↔consultant, client↔contractor); the client↔consultant one is confidential (§4).
- Files are PDF and CAD, fairly large, so real object storage is required.
- Revisions are labelled `R00`, `R01`, …
- Deleted files are archived for **at least 1 year**; only DC and Admin can delete.

**From the PDF (automation):**

- Email alert **7 days before** NOC expiry.
- NOC status flips to **Expired automatically** on the expiry date.
- **Rejected** NOC → must resubmit. **Expired** NOC → must resubmit for revalidation.
- Project Code is unique; the ID column doubles as a project count.

## 7. Suggested data model (proposal, not final)

- `profiles` (role), `projects`, `project_members` (user ↔ project ↔ discipline role; this drives RLS)
- `project_contract_terms` (confidential amounts, split out so RLS can hide it from most roles)
- `documents`, `document_revisions` (R00/R01…), `reviews` (RE and AM approvals), `audit_log`
- `noc_matrix` (+ `noc_requirements` as a dependency graph), `project_nocs`
- `project_status` (per discipline/stage), `third_party_specialists` (+ files)
- Scheduled job (Supabase cron / Edge Function) for expiry status changes and 7-day email reminders

Design leans: put money fields in a separate table with stricter RLS rather than column-level hiding; model NOC requirements as edges between NOC rows; copy Matrix rows into `project_nocs` when a project is created (snapshot) so later Matrix edits don't rewrite history.

## 8. Open questions / ambiguities to resolve

- 17 of 24 client discovery questions still unanswered.
- **Blocking sequence** semantics: does an unfinished NOC hard-block starting later ones, or just warn?
- Requirements "interconnected": all-of, any-of, or per-stage? Who marks them satisfied?
- "Pending submittals, days of delay": delay against which date (Plan date? Apply date?), and which items count as submittals?
- Conditional fields for the non-Design/Supervision contract types.
- Approval flow: are RE and AM approvals sequential or parallel, and can either reject?
- Reviewing Authority list has duplicates in the PDF (DM appears twice) and mixes authority and specialist names; needs a clean list.
- Do Authority Engineers sit outside the six disciplines for status editing purposes?
- Email provider and sender domain for reminders; per-user notification preferences.
- Storage sizing and pricing for CAD files (client asked for a cloud database suggestion with pricing).
- Data migration: import from the existing Excel masterlog and SharePoint folders?

## 9. Risks

- **Scope creep:** the PDF is much larger than the demo. Fix a phase-1 boundary before quoting.
- **Permission bugs:** dual-axis access (role × assignment) is the highest-risk area; test RLS explicitly per role.
- **Confidential data leaking** through joins, exports, or the dashboard.
- **Large file handling:** upload limits, timeouts, CAD preview (likely download-only).
- **Cron reliability:** silent failure means missed expiries, which has real compliance impact for the client.
- **Timezone:** expiry logic should be defined in Gulf Standard Time (UTC+4).

## 10. Suggested phasing (proposal)

1. **Phase 1:** document workflow (done in demo) + projects, project assignments, RE+AM approval, audit trail, archive rules.
2. **Phase 2:** Projects List with confidential contract data + Project NOC Tracker + NOC Matrix + expiry automation and email reminders.
3. **Phase 3:** Current Status of Projects + Dashboard + third-party specialist uploads + Excel import.

## 11. Glossary

- **NOC** — No Objection Certificate issued by an authority.
- **DC** — Document Controller. **RE** — Resident Engineer. **AM** — Area Manager.
- **TCP** — Term appears in the Projects List (TCP Submitted Date); meaning to be confirmed with client.
- **Master Authority** — Top-level jurisdiction (Nakheel & Trakhees, Dubai Municipality, or DDA).
- **Reviewing Authority** — Specific body reviewing a NOC (e.g. DEWA, RTA, Empower, Etisalat, DCD).
- **RLS** — Postgres Row-Level Security.
