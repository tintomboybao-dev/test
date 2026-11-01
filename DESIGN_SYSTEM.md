# Sủi Study Lab design system

Reference: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

The first education search matched a children-oriented visual style. A narrower verified style search selected Minimalism & Swiss Style, appropriate for university study and documentation. No child-oriented fonts or decorative imagery are used.

## Direction

Clear reading hierarchy, quiet indigo accent, neutral surfaces, consistent grid. Both subjects share the same components and layout. System sans-serif fonts support Vietnamese offline; serif is reserved for mathematical expressions.

## Tokens and components

Theme tokens and overrides live in theme.css. Light and dark themes define foreground, muted text, surfaces, borders, accent and status colors. Cards use 16px corners, 24px padding and 16px grid gaps. Native progress elements expose numeric values alongside visible counts; all controls retain visible keyboard focus. Main controls target at least 44px height. Motion honors prefers-reduced-motion.

## Content and navigation

Two subject options, one selected at a time. Four contextual navigation items. Topic cards have a clear title, description and next action. Study progress has a separate section with total percentage and two labelled meters. Existing learning data and browser progress keys are retained.

## Build

Run python build.py after editing template.html, styles.css, theme.css, app.js, db.js or JSON content. index.html is the generated GitHub Pages entry point.
