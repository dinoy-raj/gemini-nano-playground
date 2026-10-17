# Play Store listing

| Field | Value | Length |
| --- | --- | --- |
| App name | Nano Prompt Ground: Local AI | 28 / 30 |
| Short description | Try Gemini Nano on your phone: private, offline generative AI with no API key | 77 / 80 |
| Full description | [`full-description.txt`](full-description.txt) | 1565 / 4000 |

| Console slot | File |
| --- | --- |
| App icon (512 × 512) | `icon-512.png` |
| Feature graphic (1024 × 500) | `feature-graphic-1024x500.png` |
| Phone screenshots (1080 × 1920) | `phone/1-6` |
| 7-inch tablet screenshots (1080 × 1920) | `tablet-7in/1-6` |
| 10-inch tablet screenshots (1440 × 2560) | `tablet-10in/1-6` |

The device screens in the screenshots are HTML recreations of the app's Compose UI, drawn from
`ground/ui` and `info/ui` with the app's fallback dark colour scheme. Regenerate everything with
`node tools/render.mjs` (needs `playwright` and network access for Google Fonts).
