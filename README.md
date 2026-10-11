# MINDCRAFT — Build Your Future

A maker learning studio whose homepage is a **workshop pegboard**. Visitors hang skill tags (Soldering, Laser Cutting, 3D Modelling…) on the board, and as skills combine, real projects unlock: a phone stand, a pocket synth, a desk lamp, a walnut speaker. Blueprint strings tie each unlocked project's skills together on the board, and the build queue fills with project tickets. The rest of the site, from skill map and courses to projects, workshop and booking, is built from the same workshop materials.

Production URL: `https://mindcraft-ashy.vercel.app`

> Fictional concept brand, built as a portfolio project. Courses, timetables, projects, hours and the workshop are sample content.

---

## Concept

People don't sign up for "Intermediate Electronics". They sign up because they want to build a lamp. MINDCRAFT turns the course catalogue around and starts from the object:

1. **Skills** are tools on a pegboard (10 skills across Design, Fabrication, Electronics, Code and Hand craft).
2. **Projects** unlock when every skill they need is on the board (10 projects, from Starter to Advanced).
3. **Courses** each teach one skill properly, so the path from "I want to make that" to "book this course" is one click long.

## Brand & positioning

- **Promise:** "Build your future". You learn by making real, useful objects, one skill at a time.
- **Tone:** practical, warm, a little workshop-wry ("Measure twice, cut once, sand forever"). Short sentences, real tool names, no hype.
- **Conversion:** a two-hour **taster session** request that reads the visitor's pegboard and suggests a first build. It is a demo form, and nothing is sent.

## Audience

Curious adults (and teens with a parent, at family builds) who would rather make it than buy it. Some are complete beginners who are intimidated by workshops, some are hobbyists who want proper technique, and some are career changers building a maker portfolio.

## Art direction

- **Archetype:** a modular workshop board with bold type. Everything is a physical object: pegboard, hanging tags, a tool tray with a shadow board, a sign-up sheet, blueprint plates with masking tape, a clipboard form, a hanging credit tag.
- **Palette:** kraft `#E8DCC4` (ground), charcoal `#26221E` (ink, hard shadows), safety orange `#F26B1D` (action, unlocks, stamps), blueprint `#2F5DA8` (technical layers: strings, skill map, project drawings). Derived tones are kraft-2/3 and paper.
- **Tactility:** 2 px charcoal outlines with hard offset shadows, CSS peg holes on a masonite-toned board, wood-grain gradients on hand-craft tags, paper fibre noise over the page, hazard stripes in the footer.
- **Imagery:** 100% original SVG. Tool icons, ten blueprint project drawings with dimension lines, and five workshop-zone vignettes generated from the same icon set. No photography.
- **Logo:** an original mark (a charcoal pegboard with an orange tag hanging from a blueprint-blue peg) plus the MINDCRAFT wordmark. See `logo.svg`; `favicon.svg` is the mark alone.

## Typography

- **Anybody** (variable width 75–150%, weight 500–900): expanded, heavy uppercase for headlines and labels; condensed for the board stencil. The width axis gives one family the range of a workshop sign.
- **Golos Text** (400/500/600): clear, friendly text for copy, forms and data.
- Both load from Google Fonts with `display=swap`. Headings use `text-wrap: balance` and never break mid-word; sizes are clamped to fit.

## Motion language

The signature is **snap and swing**:
- Tags fly between the tray and the board with a FLIP spring (overshoot easing), then **swing on their peg** with a damped pendulum.
- Unlocking draws a **blueprint string** between the project's skills and slides a **ticket** into the build queue with an UNLOCKED stamp that lands with a thump.
- Sections are **pinned in**: they arrive slightly rotated and settle square, like a sheet pinned to a board.
- Toggles in the course filters are physical switches.

## Signature interaction — how to use it

1. **Drag** a skill from the tool tray onto the pegboard. It snaps to the nearest free peg slot (slots light up while you drag). Drag a hung tag off the board to return it.
2. Or **press** any tag (mouse, touch, Enter or Space) to hang it or take it down. This is the keyboard and touch equivalent of dragging.
3. Watch the **build queue**: the hint always names the skill that unlocks the next project. **Surprise me** hangs a random project's skills, and **Clear board** empties it.
4. Open a ticket's **Plan**, or any project plate, to see its bill of materials and steps, then **Hang these skills on my board**.
5. In **Courses**, use **Hang [skill]** on any row to add that skill without scrolling back up. In **Skill map**, select a skill or project to trace its connections.

The board is saved in `sessionStorage` for this tab.

## Tech

- Static HTML, CSS and ES modules with no build step and no libraries.
- `board.js`: the pegboard engine. It computes the slot geometry and snaps tag holes to the 24 px peg pitch, handles pointer-event dragging with nearest-free-slot targeting, FLIP transitions between tray and board, pendulum swing, and SVG string rendering with sagging quadratic curves and project badges.
- `art.js`: tool icons, the ten blueprint drawings (with a gear generator and dimension lines) and the zone vignettes.
- `data.js`: skills, projects, courses and zones. `main.js`: build queue, unlock logic, hints, live announcements, skill map with computed link curves, course filters, project plates and dialog, workshop track, form.

## Local development

```bash
npx serve .
```
Open the printed URL. ES modules need HTTP, so opening `index.html` from disk will not work.

## Accessibility

- One `<h1>`, landmarks, a skip link and labelled sections. Every tag is a real `<button>` whose label says what it will do ("Hang Soldering on the board" / "Take Soldering off the board"), so dragging is never required.
- A polite live region announces each change ("3D Printing hung on the board. Unlocked: Phone Stand. 1 of 10 projects unlocked.").
- The skill map works with buttons (`aria-pressed`) and a live text readout, so the decorative SVG links aren't needed to understand it. On phones the links hide and the readout carries the meaning.
- Visible `:focus-visible` outlines (blueprint blue on kraft, safety orange on blue and charcoal).
- Forms: inline errors with `aria-invalid`, focus moved to the first problem, and an honest "nothing was sent" confirmation.
- `prefers-reduced-motion: reduce`: no FLIP flights, swings, string drawing, stamps or pin-in reveals. Tags move instantly, and every interaction still works.

## Performance

- No canvas, WebGL or images: everything is DOM and inline SVG, about 50 KB of hand-written JS.
- Geometry recalculates only on resize (ResizeObserver), and animations are transform/opacity only.

## Known limitations

- On touch screens, vertical swipes over the tray scroll the page, so tapping is the primary way to hang a tag there (horizontal drags still work). Tags already on the board can be dragged freely.
- Hours, timetables and bills of materials are illustrative.

## Credit

Designed & built by Saad Bashir — https://www.linkedin.com/in/saadbashirmarketing/
