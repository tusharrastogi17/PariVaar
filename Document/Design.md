# Design & Visual Systems - PariVaar

## 1. Typography
* **Font Family**: `'Inter', sans-serif` (Imported via Google Fonts).
* **Font Weights**:
  * `400`: Regular body copy.
  * `500`: Navigation items, label text.
  * `600`: Standard headers, button texts.
  * `700` & `800`: Main page titles, branding logos.
* **Heading Sizing & Styling**:
  * Large Hero Text: `4.5rem` / `800` weight with `-0.02em` letter-spacing.
  * Card Titles: `1.25rem` / `600` weight.

---

## 2. Color Palette & Accents
* **Backgrounds**:
  * Core App Background: `#f8fafc` (Slate 50).
  * Panel Backgrounds: `#ffffff` (White).
  * Dark Accents/Sidebar Footer: `#0f172a` (Slate 900).
* **Primary Interactive Accents**:
  * Primary Button Accent: `#111111` (Deep Charcoal/Black) or `#3b82f6` (Indigo/Blue).
  * Brand Gradients: `linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)` (Purple-to-Indigo).
* **Gender-Based Color Indicators (Visual Nodes)**:
  * **Male**: Blue indicators (`#60a5fa` for background avatars, `#bfdbfe` for border highlights).
  * **Female**: Pink indicators (`#f472b6` for background avatars, `#fbcfe8` for border highlights).
  * **Unknown**: Slate indicators (`#94a3b8` background avatar).

---

## 3. UI Accents & Layout System
* **Borders**:
  * Subtle borders using `#eaeaea` or `#e2e8f0`.
* **Border Radii**:
  * Inputs and Buttons: `8px`.
  * Cards and Small Panels: `12px`.
  * Modals and Layout Containers: `16px`.
* **Visual Styling Effects**:
  * Glassmorphism applied to the sidebar layout: `backdrop-filter: blur(10px)` combined with semi-transparent white backgrounds (`rgba(255, 255, 255, 0.9)`).
  * Micro-shadows (`box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05)`) for premium card depth.
