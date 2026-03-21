# Design System Strategy: The Seasonal Editorial

## 1. Overview & Creative North Star
**Creative North Star: The Living Panorama**
In high-end real estate, we aren't just selling structures; we are selling the passage of time and the beauty of place. This design system departs from the rigid, "boxed-in" nature of traditional property portals. Instead, it adopts a **High-End Editorial** approach, treating the interface like a premium lifestyle magazine. 

We break the "template" look through **Intentional Asymmetry**. Large-scale typography may overlap high-resolution imagery, and containers are intentionally offset to guide the eye in a rhythmic, non-linear fashion. By utilizing the vibrant seasonal palette against sophisticated neutral "galleries," we create an experience that feels as curated as the homes it showcases.

---

## 2. Colors: Tonal Depth & Soul
The palette is a celebration of the four seasons, but its application must remain architectural and professional.

### The Palette Roles
*   **Primary (`#006383` - Winter Sky):** Our core brand anchor. Used for high-level navigation and primary calls to action.
*   **Secondary (`#a33700` - Autumn Sunset):** Reserved for moments of warmth—urgent alerts, price changes, or featured "hot" properties.
*   **Tertiary (`#3c6600` - Spring Leaf):** Used for growth-oriented features, such as "newly listed" tags or sustainability certifications.
*   **Neutrals:** The `surface` series (`#f6f6f9` to `#dbdde0`) acts as our canvas, providing a crisp, clean environment that allows property photography to shine.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content. Boundaries must be defined through background shifts. A section using `surface-container-low` should sit directly against a `surface` background to create a clean, modern break without visual clutter.

### The "Glass & Gradient" Rule
To elevate the UI beyond standard SaaS layouts:
*   **Glassmorphism:** Use semi-transparent `surface` colors with a `backdrop-filter: blur(20px)` for floating navigation bars or property detail overlays. This allows the vibrant brand colors to bleed through softly.
*   **Signature Textures:** Apply a subtle linear gradient from `primary` to `primary-container` on major CTAs. This creates a "light-source" effect that flat fills cannot achieve, suggesting a premium, tactile quality.

---

## 3. Typography: The Editorial Voice
We utilize a dual-font system to balance authority with approachability.

*   **Display & Headlines (Manrope):** This is our "Editorial" voice. Used for large headers (`display-lg` at 3.5rem). The wide apertures and modern geometric shapes of Manrope feel established and architectural. 
*   **Body & Labels (Plus Jakarta Sans):** Our "Functional" voice. This typeface offers exceptional legibility at smaller scales (`body-md` at 0.875rem), ensuring that complex property data remains readable and clean.

**Hierarchy Strategy:** 
Use extreme scale contrast. Pair a massive `display-md` headline with a small, all-caps `label-md` sub-header to create a sophisticated, intentional layout that feels designed, not just populated.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are often a crutch for poor spacing. In this system, we prioritize **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f0f0f3) background. The subtle 3% shift in brightness creates a natural lift that feels organic to the eye.
*   **Ambient Shadows:** If a floating element (like a "Contact Agent" fab) requires a shadow, use a 30px-40px blur at 6% opacity. Tint the shadow using the `on-surface` color (#2d2f31) rather than pure black to simulate natural light refraction.
*   **The "Ghost Border" Fallback:** If a container sits on a background of the same color, use the `outline-variant` token at **15% opacity**. This creates a "whisper" of a boundary that defines space without adding visual weight.

---

## 5. Components: Architectural Primitives

### Buttons & Chips
*   **Primary Buttons:** Use the `ROUND_EIGHT` (0.5rem) corner radius. Apply the Primary-to-Primary-Container gradient. 
*   **Chips:** Use `full` roundness (pill shape). These should be styled using `secondary-container` or `tertiary-container` for seasonal categorization (e.g., a "Summer Rental" tag).

### Input Fields
*   **Text Inputs:** No bottom-only borders. Use a solid `surface-container-high` fill with a `Ghost Border` focus state. Labels should use `label-md` and sit 0.5rem above the field, never inside as placeholders.

### Cards & Property Lists
*   **The Divider Prohibition:** Forbid 1px horizontal dividers in lists. Separate property entries using `8` (2rem) or `10` (2.5rem) vertical spacing.
*   **Nesting:** Place property details (price, beds, baths) inside a `surface-container-lowest` card which itself sits on a `surface` page background.

### Custom Components: The "Season Toggle"
A signature component for this system is a segmented control that allows users to view properties through a "Seasonal Filter," shifting the accent colors of the UI to match the selected season (e.g., shifting Primary accents to Sun Yellow for "Summer Homes").

---

## 6. Do's and Don'ts

### Do:
*   **Use White Space as a Tool:** Use the `16` (4rem) spacing token between major sections to let the design breathe.
*   **Layer Surfaces:** Treat the UI like a stack of fine paper. Use depth to imply importance.
*   **Lead with Imagery:** The vibrant palette is meant to complement—not compete with—property photography.

### Don't:
*   **Don't use high-contrast borders:** Avoid "boxed" layouts. If it looks like a spreadsheet, it has failed.
*   **Don't use default black:** Always use `on-background` (#2d2f31) for text to maintain a soft, premium feel. Pure black is too harsh for an editorial experience.
*   **Don't overcrowd:** If a screen feels busy, increase the spacing scale rather than adding lines or boxes.