# Google Play store listing

Everything needed for the Play Console "Main store listing" page lives in
[`fastlane/metadata/android/en-US`](../fastlane/metadata/android/en-US), in the layout
used by `fastlane supply`.

| Asset | File | Spec |
| --- | --- | --- |
| App name | `title.txt` | 30 / 30 characters |
| Short description | `short_description.txt` | 77 / 80 characters |
| Full description | `full_description.txt` | ~3,200 / 4,000 characters |
| App icon | `images/icon.png` | 512 x 512 PNG, 32-bit, same icon as the live listing |
| Feature graphic | `images/featureGraphic.png` | 1024 x 500 PNG |
| Phone screenshots | `images/phoneScreenshots/1-8.png` | 8 x 1080 x 1920 (9:16) |
| 7-inch tablet screenshots | `images/sevenInchScreenshots/1-8.png` | 8 x 1920 x 1080 (16:9) |
| 10-inch tablet screenshots | `images/tenInchScreenshots/1-8.png` | 8 x 2560 x 1440 (16:9) |
| Desktop screenshots | `images/desktopScreenshots/1-8.png` | 8 x 2560 x 1440 (16:9) |

All screenshots are under 1.5 MB. `desktopScreenshots` is not part of the fastlane
layout, so upload those by hand in Play Console.

## Regenerating the images

The screenshots and feature graphic are rendered from an HTML recreation of the app's
Compose UI (`generator/ui.js`, Material 3 dark scheme, same dp sizes and shapes as the
composables). Marketing copy and app states for each slide are in `generator/scenes.js`.

```bash
# needs Node and Playwright with Chromium
NODE_PATH=$(npm root -g) node store-listing/generator/render.cjs          # everything
NODE_PATH=$(npm root -g) node store-listing/generator/render.cjs phone    # or one set: phone | tab7 | tab10 | desktop | feature
```

Open `generator/index.html?mode=phone` in a browser to preview a set as one panorama.
