---
name: Folio Aesthetic
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#464555'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#712ae2'
  on-secondary: '#ffffff'
  secondary-container: '#8a4cfc'
  on-secondary-container: '#fffbff'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bbff'
  on-secondary-fixed: '#25005a'
  on-secondary-fixed-variant: '#5a00c6'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  article-body:
    fontFamily: Merriweather
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 34px
  article-body-mobile:
    fontFamily: Merriweather
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  ui-label:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  ui-button:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  caption:
    fontFamily: Public Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  article-width: 720px
  gutter: 24px
  margin-edge: 32px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 64px
---

## Brand & Style

The design system is centered on the concept of "The Modern Atelier"—a space that is functionally quiet to support deep focus, yet punctuated by moments of expressive character. It targets thoughtful writers and readers who value the authority of traditional publishing and the fluidity of modern digital experiences.

The visual style is a **Minimalist-Editorial hybrid**. It leverages the expansive whitespace and structural rigor of high-end print magazines while introducing a "playful edge" through micro-interactions and a vibrant reaction system. The goal is to evoke an emotional response of intellectual calm, interrupted by sparks of digital joy during social engagement.

## Colors

This design system utilizes a "Paper and Ink" foundation. The background is not a sterile white, but a soft, warm off-white (`#FCFCFA`) to reduce eye strain during long-form reading. 

The primary accent, **Ink Purple**, provides a sophisticated anchor for navigation and primary calls to action. The **Reaction Palette** consists of high-chroma colors intentionally designed to vibrate against the neutral UI, signaling a shift from "reading mode" to "interaction mode." 

- **Primary Actions:** Ink Purple for focus and progression.
- **Surface:** Subtle grays (`#F3F4F6`) for secondary containers.
- **Typography:** Deep Charcoal (`#1F2937`) for high legibility without the harshness of pure black.

## Typography

The typography strategy employs a strict "Role Division":
1. **The Narrator (Merriweather):** Used for all long-form body text. The generous line height (34px) and 20px base size ensure a comfortable, authoritative reading rhythm.
2. **The Editor (Playfair Display):** Used for titles and section headings to provide a classic, high-end editorial feel.
3. **The Utility (Public Sans):** A clean, humanist sans-serif used for all UI chrome, navigation, buttons, and metadata. This creates a clear mental distinction between the *content* and the *platform*.

On mobile, display sizes scale down significantly to prevent awkward word breaks, while the body text remains large to prioritize accessibility.

## Layout & Spacing

This design system uses a **centered content model**. While the platform occupies a 12-column grid, the reading experience is constrained to a single 720px column to maintain optimal line length (50-75 characters).

- **Desktop:** The 720px article column is centered, with floating or sidebar utility elements (Table of Contents, Author Bio) placed in the wide margins.
- **Spacing Rhythm:** We use a 4px base unit, favoring large leaps (64px+) between sections to create a sense of breath and luxury.
- **Margins:** Large 32px safe areas on mobile ensure text never feels "trapped" by the screen edges.

## Elevation & Depth

Depth is handled through **Low-contrast outlines** and **Tonal Layering**. 

- **Level 0 (Base):** The page background.
- **Level 1 (Cards):** Post previews and sidebar modules use a 1px border (`#E5E7EB`) with no shadow. This maintains a flat, print-like aesthetic.
- **Level 2 (Interaction):** Upon hover, cards transition to a soft, ambient shadow (10% opacity Ink Purple) to signify interactivity.
- **Level 3 (Modals/Overlays):** Use a backdrop blur (12px) to maintain the "Glassmorphism" feel for settings or reaction pickers, keeping the underlying content vaguely visible but out of focus.

## Shapes

The shape language is **Soft (0.25rem)**. 

While the content is traditional, the slight rounding of images, buttons, and input fields prevents the UI from feeling "sharp" or "hostile." 
- **Buttons:** Use 4px (Soft) rounding unless they are icon-only buttons, which are circular.
- **Article Images:** Feature the same 4px radius to align with the UI containers.
- **Reaction Icons:** These are the exception, utilizing organic, fluid shapes that defy the rigid 4px grid.

## Components

### Buttons & Inputs
Buttons use a clear hierarchy: 
- **Primary:** Solid Ink Purple with white text.
- **Secondary:** Transparent background with a 1px Charcoal border.
- **Inputs:** Minimalist bottom-border only for a "notebook" feel, or full-bordered with 4px radius for functional clarity.

### The Reaction System
The core expressive element. When hovered, the "Reaction" button expands into a horizontal tray. Each icon (Like, Funny, etc.) should use its assigned "Reaction Color" and feature a subtle "squish" animation. Upon selection, the reaction count should pulse with the color of the chosen reaction.

### Post Preview Cards
Cards are defined by their typography. The headline (Playfair) takes priority, followed by a short snippet (Merriweather) and metadata (Public Sans). Borders are used instead of shadows to keep the "Folio" print aesthetic.

### Progress Indicator
A slim, Ink Purple line at the top of the viewport that tracks reading progress through the long-form content.