# Scope: Authority NOC Tracker and Document Control

Sep 30, 2026 · @Gio Majadas

## Background

The client's team keeps project documents in SharePoint folders and tracks them in an Excel masterlog, and this project replaces both with one controlled system.

In her words, everyone can open every project folder, there are no permissions per individual, and some folders have gone missing. She asked for three things: engineers can view and download, managers approve or reject submissions, and the Document Controller (DC) has full access to the database.

Her Excel masterlogs and data workflow add a second need: tracking every authority NOC per project, and that is the first thing she wants to see.

## Success criteria

The system succeeds if every complaint the client raised has a working answer in it.

| Her complaint or request                                 | Answer                                                                             |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Everyone can open every folder                           | Individual accounts, and access limited to assigned projects                       |
| Some folders have gone missing                           | Soft delete only, delete limited to DC and Admin, audit log, scheduled file backup |
| Engineers view and download                              | Engineers view, download and upload for their projects                             |
| Managers approve or reject                               | Resident Engineer, then Area Manager when needed; rejection needs a reason         |
| DC has full access to the database                       | DC controls the records and documents of assigned projects                         |
| Excel is the masterlog                                   | A project register and a document register in the database                         |
| NOCs sit in up to 37 repeating column blocks per project | One NOC list per project with status, dates, reference number and expiry alerts    |

## Users and access

Three of the six roles work on assigned projects only; the CEO, Admin and Area Manager see every project.

| Role                                                    | Projects seen  | Client-consultant contract amount | Approval and other rights                                                                                         |
| ------------------------------------------------------- | -------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| CEO                                                     | All, read-only | Yes                               | None                                                                                                              |
| Admin                                                   | All            | Yes                               | Full access; invites users, assigns roles and projects, decides retention                                         |
| Area Manager (AM)                                       | All            | Yes                               | Second-level approver; may approve in place of an absent Resident Engineer                                        |
| Resident Engineer (RE)                                  | Assigned       | No                                | First-level approver; another assigned RE covers an absence                                                       |
| Engineers (Authority, MEP, Architect, Structure, Civil) | Assigned       | No                                | Upload revisions, view and download; Authority Engineers also edit NOC records                                    |
| Document Controller (DC)                                | Assigned       | No                                | Uploads revisions; manages records and documents of assigned projects; can delete (archive); edits the NOC matrix |

The client-contractor contract amount and contract documents are visible to assigned engineers and the DC. The Project Manager role is not part of the first stages. The NOC tracker starts with 6 users: 3 Authority Engineers and 3 admins, each group split 2 in the head office and 1 in the site office.

## NOC tracker features

The NOC tracker is built first, and Milestone 1 is its demo with sample data.

**Milestone 1** contains:

- **Login:** invited users only, with roles for Authority Engineer, Admin and DC.
- **Projects list:** code, name, client, master authority (Nakheel and Trakhees, Dubai Municipality or Dubai Development Authority), stage and a project image.
- **NOC list per project:** one row per NOC with authority, description, status, planned, apply, receive and expiry dates, reference number, remarks and a link to the file.
- **Search** by project number or description, as in her Excel form.
- **Sample data:** placeholder NOCs until the client provides the real NOC matrix.

**Phase 1** completes the tracker with:

- **NOC matrix editor** for the Authority Engineer and DC, with change history; a change reaches NOCs not yet obtained on active projects and never alters an obtained NOC.
- **Blocking sequence:** a NOC cannot be marked applied until the NOCs before it are approved; Admin can override with a logged reason.
- **Requirements checklist** per NOC.
- **Resubmission history:** every attempt after a rejection is kept and shown.
- **Expiry:** status turns Expired automatically on the expiry date; the DC and the project's Authority Engineer are emailed 14 days before (configurable); the AM and RE see it on screen only.
- **NOC fees:** amount, who pays (client, contractor or consultant advance), paid status and receipt link.
- **Project setup:** code generated automatically (year plus counter, manual entry allowed with a uniqueness check), with Design and Supervision contracts having separate dates.

## Document control features (Phase 2)

Phase 2 delivers nine capabilities on the same accounts and projects, all on the document control core.

- **Accounts:** users are invited by Admin only, with no public signup; Admin assigns each user a role and projects, and deactivates people who leave instead of deleting them.
- **Projects:** each project has a code (year plus 3-digit sequence, such as 23016), a name, a client and its assigned team; the consultant contract amount sits in a separate restricted record.
- **Document register:** document number, title, project, type, status and revision history, replacing the Excel masterlog.
- **Revisions:** R00, R01 and so on, each with its own file and status; older revisions are kept and cannot be approved.
- **Approval:** RE first, Area Manager when needed, rejection with a required reason (detailed below).
- **Downloads:** each download is logged with the user and file size.
- **Audit log:** uploads, approvals, rejections, overrides, role changes and deletions.
- **Delete and retention:** DC or Admin archives a file; archived files are kept at least 1 year; Admin decides when permanent removal happens.
- **Uploads and backup:** engineers and the DC upload revisions through resumable uploads with one configurable size limit, plus a scheduled copy of stored files to a second location.

## Document approval workflow (Phase 2)

A revision is approved only after the Resident Engineer, and after the Area Manager when the RE flags it; every rejection needs a reason and ends in a new revision.

&#91;embedded content: approval flow · RE first, AM when flagged\]

The AM step happens only when the RE flags it; either rejection sends the file back for a new revision.

## Out of scope for now

Everything in the client's data workflow beyond the stages above waits for a later phase, each priced separately.

- **Dashboard,** with discipline statuses, pending submittals and days of delay; how "days pending" is measured is still to be confirmed.
- **Discipline status and third-party specialist tracking,** which sit in the design-status and third-party sections of her Excel masterlog.
- **Contract fee schedules and payment collection,** which stay in Excel for now; only NOC fees are tracked in Phase 1, and the reimbursement ledger comes later.
- **Client identity documents** (passport, Emirates ID, trade license, power of attorney); the system does not store these files.
- **Excel masterlog import;** the pilot uses one real project entered by hand.
- **Files of 2 GB** (for example large CAD files); these need the paid hosting plan and a test with a real file.
- **Project Manager role, Arabic interface and any Construction Management System (CMS) features;** the client said the CMS may come later if the database broadens, and Arabic text is stored correctly from the start.

## Assumptions and open items

Most items below are unconfirmed assumptions; the client should correct any that are wrong.

| Assumption                                                                                                                                     | If it is wrong                                |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| The NOC tracker and document control share one set of accounts, projects and roles                                                             | Split into two apps                           |
| The 3 admins are separate from the DC (the client was unsure)                                                                                  | Merge the two roles                           |
| Days pending counts from the planned date until applied, and from the apply date while waiting on the authority                                | Change one formula                            |
| The signed client-consultant agreement is visible only to CEO, Admin and Area Manager                                                          | Loosen one access rule                        |
| Download volume is unknown; it is logged from day one and measured after the first month                                                       | Re-estimate hosting cost                      |
| An RE who is absent is covered by another assigned RE, or by the AM                                                                            | Adjust the override rule                      |
| The Project Manager has no account in the first stages                                                                                         | Add one role later                            |
| Master Authority in the data workflow and Master Developer in her Excel are the same list                                                      | Keep both fields                              |
| NOC statuses follow the data workflow list (Approved, Rejected, Not Started, Pending for Payment, Not Needed, Expired) until she sends her own | Edit the status list                          |
| AOR in her contract log is not needed in the first stages                                                                                      | Add it as a contract scope                    |

## Infrastructure and hosting

The demo and user testing run on free hosting with sample files; real project files need a paid plan, paid by the client. Figures are approximate as of 29 September 2026 and must be confirmed on Supabase's pricing page before quoting.

| Stage                       | Hosting                               | Limit or cost                                                           |
| --------------------------- | ------------------------------------- | ----------------------------------------------------------------------- |
| Demo and user testing       | Next.js on Vercel, Supabase Free      | 50 MB per file; sample files only                                       |
| Pilot with real data        | Supabase Pro                          | About $25 per month; 250 GB downloads included, then about $0.09 per GB |
| Large files (after Phase 2) | Supabase Pro with a raised file limit | Test with a real 2 GB file                                              |

The production Supabase account is created under the client's ownership so billing is theirs from the start.

Supabase's published region list has no UAE region ([Supabase regions](https://supabase.com/docs/guides/platform/regions)). The client accepted the default hosting, so use the closest listed region, probably Mumbai, after checking latency, because a project's region is hard to change later. Real project data stays out until the client confirms hosting in writing, and the code stays portable so a move to a UAE server remains possible.

Supabase's daily database backups do not include files stored through its Storage feature, so a lost file would stay lost even after a restore ([Supabase backup docs](https://supabase.com/docs/guides/platform/backups.md)). Phase 2 therefore includes a scheduled copy of stored files to a second location, and one test restore before real data goes in.

## Delivery plan and acceptance

The build runs in four steps, with two gates before real project data goes in.

&#91;embedded content: delivery plan · 4 steps, 2 gates\]

The first gate is user testing on sample files; the second is the pilot, which starts the client's paid hosting plan.

Each stage is accepted when its own checks pass.

**Milestone 1 (NOC demo):**

- A user logs in and sees only the projects assigned to them; Admin sees all.
- Each project shows its NOC list with status, dates, reference number and remarks.
- Only Authority Engineers, the DC and Admin can edit NOC records.

**NOC tracker (Phase 1):**

- A matrix change reaches NOCs not yet obtained on active projects and never alters an obtained NOC.
- Every resubmission after a rejection is kept and shown as history.
- The DC and the project's Authority Engineer are emailed 14 days before expiry, and the status turns Expired on the expiry date.

**Document control (Phase 2):**

- An engineer cannot open a project they are not assigned to.
- Only the CEO, Admin and Area Manager can see the client-consultant contract amount.
- A rejected revision needs a reason and leads to a new revision (R01).
- An archived file can be restored, and a file restored from the backup copy opens.
- Every upload, approval, override, role change and deletion appears in the audit log.
