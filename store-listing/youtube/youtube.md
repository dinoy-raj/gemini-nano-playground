# YouTube upload kit: Nano Prompt Ground promo

Everything needed to publish the promo film on YouTube (and use it as the Google Play promo video).

## Files

| File | What it is |
| --- | --- |
| `youtube-upload.mp4` | **Upload this.** 1920 x 1080, 30 fps, H.264 + 48 kHz AAC 320 kbps, 0:28, fast-start |
| `thumbnail.jpg` | Custom thumbnail, 1280 x 720 (16:9), JPG, under 2 MB |
| `captions.srt` | English captions (on-screen text + music cue) |
| `youtube-upload-helvetica.mp4`, `youtube-upload-gilroy.mp4` | Typeface variants (not committed; rebuilt by `render.cjs`) |

Rebuild everything after re-rendering the promo: `NODE_PATH=$(npm root -g) node store-listing/youtube/render.cjs`

## Title (pick one, ≤ 100 characters)

1. **Nano Prompt Ground: Private, Offline AI on Your Phone (Gemini Nano)**
2. Gemini Nano on Android, Fully Offline | Nano Prompt Ground
3. Run AI on Your Phone With No Internet: Nano Prompt Ground

## Description

```
Your phone thinks offline. Nano Prompt Ground puts Gemini Nano, the AI model built into Android, at your fingertips. No account, no API key, no cloud. Your words never leave your device.

▶ Get it free on Google Play: https://play.google.com/store/apps/details?id=com.dino.nanoplayground
⭐ Open source on GitHub: https://github.com/dinoy-raj/gemini-nano-playground

WHAT YOU GET
• Private by design: every prompt is answered on your phone
• Works offline: airplane mode, no signal, zero data used
• Answers that stream in token by token, with rich Markdown
• Inference time, output tokens and finish reason after every answer
• Share to Nano: send text from any app straight into a prompt
• See which Gemini Nano version (nano-v2 / nano-v3) your phone runs
• Material 3 Expressive design, built with Kotlin and Jetpack Compose

HOW IT WORKS
The app talks to the on-device model through the ML Kit GenAI Prompt API and Android AICore. After the one-time model download, everything runs locally.

SUPPORTED DEVICES
Phones with AICore and Gemini Nano, such as the Pixel 9 and Pixel 10 series, Samsung Galaxy S26 series and Galaxy Z Fold7, OnePlus 13 and 15, Xiaomi 15 series and more. Android 13 or later.

Music: original track made for this video.
Gemini Nano is a model by Google. Nano Prompt Ground is an independent, open-source project and is not affiliated with or endorsed by Google.

#GeminiNano #OnDeviceAI #Android
```

The first three hashtags in the description show above the title. No chapters: YouTube needs at least three chapters of 10 seconds or more, and this film is 28 seconds.

## Tags (paste into the Tags field, about 380 of the 500-character limit)

```
gemini nano, on-device ai, offline ai, android ai, nano prompt ground, gemini nano android, private ai, ai without internet, ml kit genai, prompt api, android aicore, local llm, on device llm, pixel ai, galaxy ai, jetpack compose, material 3 expressive, material you, open source android app, kotlin, ai app, offline chatbot, android app promo, app promo video, gemini nano app
```

## YouTube Studio settings

| Setting | Value |
| --- | --- |
| Thumbnail | Upload `thumbnail.jpg` |
| Audience | **No, it's not made for kids** |
| Altered or synthetic content | **No.** It's motion graphics, not realistic footage of people or events |
| Paid promotion | No (it's your own app, not a sponsorship) |
| Category | Science & Technology |
| Video language / caption language | English |
| Subtitles | Upload `captions.srt` as English (With timing) |
| License | Standard YouTube License |
| Allow embedding | **On** (needed for Google Play) |
| Comments | On |
| Visibility | Public, or Unlisted if it's only for the Play listing |

### For the Google Play listing

Play Console → Main store listing → **Video**: paste the YouTube URL. Google Play requires the video to be **public or unlisted**,
**embeddable**, **not age-restricted** and **without ads**, so leave monetization off for this video.

### End screen (optional)

YouTube allows end screens on videos of 25 s or longer, for the last 5–20 s. Use a 5 s end screen (0:23–0:28) with one
**Subscribe** element in a top corner, so it doesn't cover the app name and the "Free on Google Play" button.

### Copyright

The soundtrack and every sound effect are original (synthesised by `promo-video/music.py`) and the fonts are open-licensed
(Google Sans Flex, Material Symbols), so the upload shouldn't trigger Content ID claims.

## Pinned comment

```
Try it yourself: https://play.google.com/store/apps/details?id=com.dino.nanoplayground
What should I prompt Gemini Nano with next? 👇
```
