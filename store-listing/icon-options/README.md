# App icon options

Three icon concepts in the style of Google's 2025 icon refresh: chunky rounded shapes,
saturated gradients with soft colour blooms, and simple white glyphs.

![Preview on light and dark](preview.png)

| Option | Idea |
| --- | --- |
| [1. Prompt Bubble](option-1-prompt-bubble.svg) | A chat bubble carrying the sparkle: prompt anything. |
| [2. Pocket Spark](option-2-pocket-spark.svg) | A phone on a stacked card with a sparkle: AI right on your phone. |
| [3. Nano Chip](option-3-nano-chip.svg) | A chip with a multicolour sparkle: Gemini Nano runs on-device. |

Each option has a 512 x 512 SVG and a transparent PNG. `preview.png` shows them large and
inside circle and squircle launcher masks.

```bash
# needs Node and Playwright with Chromium
NODE_PATH=$(npm root -g) node store-listing/icon-options/generate.cjs
```
