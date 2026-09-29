---
name: Engineering Document Control & Authority NOC Tracker
description: High-density engineering document management, authority NOC compliance, and workflow tracking for Dubai consultancies
colors:
  primary: '#18181b'
  primary-foreground: '#fafafa'
  neutral-bg: '#ffffff'
  neutral-surface: '#f4f4f5'
  neutral-border: '#e4e4e7'
  ink-primary: '#09090b'
  ink-muted: '#71717a'
  status-success: '#166534'
  status-warning: '#9a3412'
  status-danger: '#991b1b'
  status-info: '#1e40af'
typography:
  display:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: '1.75rem'
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: '-0.02em'
  headline:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: '1.25rem'
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: '-0.015em'
  title:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: '1rem'
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: '-0.01em'
  body:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: '0'
  label:
    fontFamily: "var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: '0.75rem'
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: '0.02em'
rounded:
  sm: '4px'
  md: '6px'
  lg: '8px'
spacing:
  xs: '4px'
  sm: '8px'
  md: '12px'
  lg: '16px'
  xl: '24px'
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.primary-foreground}'
    rounded: '{rounded.md}'
    padding: '8px 16px'
  button-primary-hover:
    backgroundColor: '{colors.ink-primary}'
  button-secondary:
    backgroundColor: '{colors.neutral-surface}'
    textColor: '{colors.ink-primary}'
    rounded: '{rounded.md}'
    padding: '8px 16px'
  input-text:
    backgroundColor: '{colors.neutral-bg}'
    textColor: '{colors.ink-primary}'
    rounded: '{rounded.md}'
    padding: '8px 12px'
---

## 1. Overview

### **Creative North Star: "The Engineering Command Deck"**

The Engineering Command Deck is a utilitarian, high-density operational surface built for engineers, document controllers, and managers managing complex multi-authority construction approvals across Dubai. Every screen prioritizes legibility, state immediacy, and rigorous data structure over ornamentation. The tool gets out of the way of the task: engineers can review drawing revisions, verify submittals, inspect blocking NOC chains, and flag expiring permits without visual friction.

The interface rejects consumer SaaS marketing tropes: no bloated white space, no whimsical illustrations, no slow multi-step animations, and no soft decorative dropshadows. Instead, information architecture is strictly structural, defined by crisp 1px borders, subtle tonal contrast between navigation shells and content panes, and unmistakable semantic status indicators that remain razor-sharp under bright daylight on construction site tablets.

**Key Characteristics:**

- **High-Density Utility:** Compact data grids and tabular layouts presenting deep metadata (project codes, revision labels, authorities, dates, fees) without horizontal scrolling waste.
- **Strict Structural Boundaries:** 1px hairline borders (`#e4e4e7` / `oklch(0.922 0 0)`) define panels, headers, and grid cells instead of floating drop shadows.
- **Immediate Status Visibility:** Authority NOC states (Approved, Rejected, Expired, Pending) communicate urgency with high-contrast badge tokens tested for WCAG AA compliance.
- **Fast, Predictable Motion:** Transitions are instant or capped at 150ms for modal disclosures and tab switching.

## 2. Colors

The color palette is strictly restrained: a neutral monochrome scaffolding punctuated by surgical semantic indicators for authority statuses and compliance deadlines.

### Primary

- **Command Slate** (`#18181b` / `oklch(0.205 0 0)`): Primary action buttons, prominent header titles, and active navigation indicators. Used deliberately on less than 10% of the screen area to anchor user focus.

### Secondary

- **Surface Layer** (`#f4f4f5` / `oklch(0.97 0 0)`): Sidebar backdrops, table header rows, and secondary action button fills.

### Neutral

- **Base Canvas** (`#ffffff` / `oklch(1 0 0)`): Main content workspace, card bodies, and active form field backgrounds.
- **Hairline Border** (`#e4e4e7` / `oklch(0.922 0 0)`): Structural dividers, table cell borders, and card outlines.
- **Ink Primary** (`#09090b` / `oklch(0.145 0 0)`): High-legibility text for titles, data values, and active form entries.
- **Ink Muted** (`#71717a` / `oklch(0.556 0 0)`): Secondary labels, timestamp strings, table column captions, and helper annotations.

### Semantic Status Colors

- **Approved / Success** (`#166534` text on `#dcfce7` bg): Authority approvals and completed sign-offs.
- **Pending / Warning** (`#9a3412` text on `#ffedd5` bg): Pending reviews, upcoming submission deadlines, and payment pending states.
- **Expired / Danger** (`#991b1b` text on `#fee2e2` bg): Rejections requiring resubmission, lapsed permits, and blocking dependencies.
- **Information / Stage** (`#1e40af` text on `#dbeafe` bg): Active review stages and specialist submittal notices.

### Named Rules

**The High-Contrast Status Rule.** Color is reserved exclusively for system state, review outcomes, and compliance urgency. Colored text or backgrounds for purely decorative purposes are prohibited.
**The Restrained Surface Rule.** The primary dark slate accent must occupy no more than 10% of any view, ensuring primary calls to action retain undisputed visual priority.

## 3. Typography

**Display Font:** `var(--font-sans)`, system sans-serif stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`)
**Body Font:** `var(--font-sans)`, system sans-serif stack
**Label/Mono Font:** `var(--font-mono)`, Geist Mono, monospace stack (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`)

**Character:** Technical, neutral, and unembellished. Standardized system-sans ensures immediate native rendering on both desktop browsers and mobile PWA clients without font-loading layout shifts.

### Hierarchy

- **Display** (SemiBold 600, 1.75rem / 28px, line-height 1.2, letter-spacing -0.02em): Top-level dashboard summary headings and module titles.
- **Headline** (SemiBold 600, 1.25rem / 20px, line-height 1.3, letter-spacing -0.015em): Section titles, project detail headers, and modal dialog titles.
- **Title** (SemiBold 600, 1rem / 16px, line-height 1.4, letter-spacing -0.01em): Table group headers, card titles, and drawer headers.
- **Body** (Regular 400, 0.875rem / 14px, line-height 1.5, letter-spacing 0): Main data table cells, submittal notes, review comments, and description text.
- **Label** (Medium 500, 0.75rem / 12px, line-height 1.25, letter-spacing 0.02em): Form field labels, table column headers, status badges, and metadata tags.
- **Mono Data** (Regular 400 / Medium 500, 0.8125rem / 13px, line-height 1.4): Project codes (e.g., `23016`), revision codes (`R00`, `R01`), authority reference numbers, and date timestamps.

### Named Rules

**The Fixed-Density Scale Rule.** Fluid typography clamps are prohibited in core data tables and toolbars. Type sizes are fixed across viewports to maintain deterministic data alignment.
**The Monospace Reference Rule.** All project codes, drawing revision numbers, and authority permit IDs must render in monospace font tokens to guarantee scannability.

## 4. Elevation

Surfaces are strictly flat and structural. Spatial hierarchy is communicated through background tonal contrast (`#ffffff` vs `#f4f4f5`) and 1px borders (`#e4e4e7`), not drop shadows.

### Shadow Vocabulary

- **Resting Elements:** `box-shadow: none`. All cards, table rows, sidebars, and input fields remain flat at rest.
- **Overlay Flyouts:** `box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.08)`. Subtle, tight ambient shadow applied exclusively to floating dropdown menus, select popovers, and modal dialog backdrops to separate them from underlying dense data grids.

### Named Rules

**The Structural Border Rule.** Never use drop shadows to demarcate cards or data panels. Every container boundary must be established with a solid 1px border.
**The Ghost Card Prohibition.** Never combine a 1px border with a diffuse drop shadow (blur > 8px) on interactive elements.

## 5. Components

### Buttons

- **Shape:** Compact rounded corners (6px radius, `--radius-md`).
- **Primary:** Dark slate background (`#18181b`), white text (`#fafafa`), padding `8px 16px`, font weight 500, font size 14px.
- **Hover / Focus:** Hover darkens to `#09090b`; keyboard focus displays a 2px offset ring (`--ring`).
- **Secondary / Outline:** White or surface fill, 1px border (`#e4e4e7`), ink primary text (`#09090b`), hover background `#f4f4f5`.
- **Destructive:** Red accent background (`#dc2626`), white text, reserved for irreversible deletions or rejections with comments.

### Status Badges & Chips

- **Style:** Compact pill (4px radius), 1px solid border matching status tone, uppercase or capitalized 11px label font.
- **Variants:** Approved (green), Pending Payment (amber), Expired (red), In Review (blue), Draft/Archived (slate).

### Cards & Panels

- **Corner Style:** Controlled radius (8px radius, `--radius-lg`).
- **Background:** White (`#ffffff`) for foreground cards; surface slate (`#f4f4f5`) for side rails and metadata drawers.
- **Border:** Uniform 1px solid `#e4e4e7`.
- **Internal Padding:** 16px to 20px padding; tight 12px padding for dense metric panels.

### Inputs & Select Fields

- **Style:** 1px solid border (`#e4e4e7`), background `#ffffff`, radius 6px, height 36px for dense alignment.
- **Focus:** 1px border shift to primary slate with 2px subtle ring outline.
- **Disabled:** Background `#f4f4f5`, text `#71717a`, cursor not-allowed.

### Navigation Shell

- **Style:** Persistent top bar and collapsible side navigation with 1px bottom/right dividing border.
- **Typography:** 14px medium font with subtle active highlight indicators.

### Data Grid & NOC Matrix (Signature Component)

- **Structure:** Monospace project codes, fixed column widths, sticky table header with subtle `#f4f4f5` fill.
- **Rows:** Alternating subtle row hover (`#fafafa`), 1px bottom cell dividers, inline status pills, and direct-action trigger menus.

## 6. Do's and Don'ts

### Do:

- **Do** use strict 1px borders (`#e4e4e7`) to separate data sections, table cells, and panel modules.
- **Do** display project codes (e.g. `23016`), drawing revisions (`R00`, `R01`), and authority reference IDs in monospace font tokens.
- **Do** ensure all text hits at least 4.5:1 contrast against its background for outdoor on-site readability.
- **Do** enforce instant feedback (≤150ms transitions) on state changes, approvals, and filter selections.
- **Do** show explicit delay counters (e.g. "4 days delayed") and expiry countdowns in prominent warning badges.

### Don't:

- **Don't** use oversized rounded cards (border-radius > 16px) or puffy pill containers.
- **Don't** use decorative gradient text (`background-clip: text` with gradient fills) anywhere in the application.
- **Don't** add decorative illustrations, doodle SVGs, or marketing hero graphics to technical workflows.
- **Don't** waste vertical screen real estate with bloated padding or arbitrary spacing gaps.
- **Don't** reproduce legacy ERP spaghetti: avoid unstyled HTML tables, unformatted timestamps, and hidden menus.
- **Don't** use casual pastel badges or low-contrast muted gray text for critical authority statuses.
- **Don't** implement slow multi-step page entrance animations or delayed transitions that interrupt technical workflows.
- **Don't** use side-stripe borders (`border-left` > 1px) as alert markers on table rows or list items.
