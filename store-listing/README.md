# Google Play store listing

Everything needed for the Play Console "Main store listing" page lives in
[`fastlane/metadata/android/en-US`](../fastlane/metadata/android/en-US), in the layout
used by `fastlane supply`.

| Asset | File | Spec |
| --- | --- | --- |
| App name | `title.txt` | 30 / 30 characters |
| Short description | `short_description.txt` | 76 / 80 characters |
| Full description | `full_description.txt` | ~3,100 / 4,000 characters |
| App icon | `images/icon.png` | 512 x 512 PNG, 32-bit, full square with no transparency (Play applies the mask) |
| Feature graphic | `images/featureGraphic.png` | 1024 x 500 PNG |
| Phone screenshots | `images/phoneScreenshots/1-8.png` | 8 x 1080 x 1920 (9:16) |
| 7-inch tablet screenshots | `images/sevenInchScreenshots/1-8.png` | 8 x 1920 x 1080 (16:9) |
| 10-inch tablet screenshots | `images/tenInchScreenshots/1-8.png` | 8 x 2560 x 1440 (16:9) |
| Desktop screenshots | `images/desktopScreenshots/1-8.png` | 8 x 2560 x 1440 (16:9) |

Every screenshot is under 1.5 MB (the limit is 8 MB). `desktopScreenshots` is not part of the fastlane
layout, so upload those by hand in Play Console.

## App icon

The Prompt Window icon is defined once in `icon/build.cjs`, which writes the adaptive icon
foreground and themed (monochrome) vector drawables, the legacy launcher bitmaps, the Play
Store icon and `icon/icon.svg`.

```bash
NODE_PATH=$(npm root -g) node store-listing/icon/build.cjs
```

## Regenerating the images

The look follows the icon: a bold colour field per frame from the icon palette, oversized
white headlines with the key phrase in a white pill, a large device bleeding off the edge
with the icon's tilted back card behind it, and white callout cards popping off the device.
Glows and translucent cards cross the seams so each set reads as one panorama.

The screenshots and feature graphic are rendered from an HTML recreation of the app's
Compose UI (`generator/ui.js`, Material 3 dark scheme, same dp sizes and shapes as the
composables). Marketing copy and app states for each slide are in `generator/scenes.js`.

```bash
# needs Node and Playwright with Chromium
NODE_PATH=$(npm root -g) node store-listing/generator/render.cjs          # everything
NODE_PATH=$(npm root -g) node store-listing/generator/render.cjs phone    # or one set: phone | tab7 | tab10 | desktop | feature
```

Open `generator/index.html?mode=phone` in a browser to preview a set as one panorama.

## Promo video

`promo-video/out/nano-prompt-ground-promo.mp4` is a 28-second 1920 x 1080 motion-graphics film (30 fps, no audio),
with its own look rather than the store screenshots': an obsidian stage, silver type, one mint accent glow,
mono microcopy, orbit rings, a travelling spark, light sweeps and blur reveals. No phone mockup; the product is shown as
a glass prompt composer, a token-by-token streamed answer and live HUD readouts.

Scenes: kinetic headline ("Your phone thinks offline.") → no-signal HUD → prompt typed and sent → haiku streams in with
inference stats → 612 ms speed beat → "Your words stay yours." (packets blocked before the cloud) → feature list → end card.

It is a HyperFrames composition in the [Null Motion](https://github.com/blixvip/NullMotion) template format, built from
the motion vocabulary of its templates (kinetic headline, prompt composer, chat sim, blur reveal, connector list):
`promo-video/index.html` holds one paused GSAP timeline (`window.__timelines.root`, GSAP bundled from Null Motion).
`render.cjs` seeks it frame by frame and pipes every frame into FFmpeg, so no frame is dropped.

```bash
# needs Node, Playwright with Chromium, FFmpeg and curl (Inter and JetBrains Mono are fetched once into promo-video/fonts/)
NODE_PATH=$(npm root -g) node store-listing/promo-video/render.cjs
```

Open `promo-video/index.html#play` in a browser to preview it live.
