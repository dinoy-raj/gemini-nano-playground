// Store screenshot scenes. Each scene = marketing copy + the real app state shown on the device
// + floating callouts. Callouts sit on the left or right edge of the device; y is a fraction of its height.

const SCENES = [
  {
    tag: 'On-device AI',
    title: 'Gemini Nano, <em>right on</em> your phone',
    titleWide: 'Gemini Nano, <em>right on</em> your device',
    sub: 'Prompt Google’s on-device model with no account and no API key.',
    tilt: 0,
    app: {
      query: 'Explain on-device AI in simple terms',
      count: 2,
      response: `<p><strong>On-device AI</strong> means the model runs directly on your phone instead of a server in the cloud.</p>
        <ul><li><strong>Faster:</strong> no round trip to the internet</li>
        <li><strong>Private:</strong> your prompt stays on your device</li>
        <li><strong>Always there:</strong> works without a connection</li></ul>
        <p>Think of it as a smart assistant that lives in your pocket.</p>`,
      stats: ['1532.0', '74', 'STOP'],
    },
    chips: [
      { icon: 'memory', text: 'Runs on device', side: 'l', y: 0.555 },
      { icon: 'key_off', text: 'No API key', side: 'r', y: 0.03 },
      { icon: 'person_off', text: 'No sign-in', side: 'r', y: 0.615 },
    ],
  },
  {
    tag: 'Private by design',
    title: 'Your prompts <em>never leave</em> your phone',
    titleWide: 'Your prompts <em>never leave</em> your device',
    sub: 'Every answer is generated locally by Gemini Nano.',
    app: {
      query: 'Make this sound kinder: “You missed the deadline again.”',
      count: 1,
      response: `<p>Here’s a gentler version:</p>
        <p>“Hey, I noticed the deadline slipped again. Is anything getting in the way? Let’s figure out a plan together.”</p>
        <p>It keeps the message clear while showing support.</p>`,
      stats: ['894.0', '45', 'STOP'],
    },
    chips: [
      { icon: 'lock', text: 'Processed locally', side: 'r', y: 0.03 },
      { icon: 'cloud_off', text: 'Nothing sent to a server', side: 'l', y: 0.52 },
    ],
  },
  {
    tag: 'Works offline',
    title: 'No signal? <em>No problem.</em>',
    sub: 'Once the model is on your phone, prompt it anywhere, even in airplane mode.',
    tilt: 0,
    app: {
      airplane: true,
      query: 'Packing list for a weekend hike',
      count: 3,
      response: `<p><strong>Weekend hike packing list</strong></p>
        <ul><li>Water bottle and trail snacks</li><li>Rain jacket and a warm layer</li>
        <li>Map, headlamp and power bank</li><li>First aid kit and sunscreen</li>
        <li>Comfortable boots and spare socks</li></ul>`,
      stats: ['1207.0', '52', 'STOP'],
    },
    chips: [
      { icon: 'airplanemode_active', text: 'Airplane mode', side: 'r', y: 0.03 },
      { icon: 'signal_wifi_off', text: 'Zero data used', side: 'l', y: 0.52 },
    ],
  },
  {
    tag: 'Playground',
    title: 'Prompt <em>anything</em>',
    sub: 'Summaries, rewrites, ideas and haiku. Tap the field to open a full editor.',
    app: { expanded: true, query: 'Write a haiku about coffee on a rainy Monday', count: 0 },
    chips: [
      { icon: 'summarize', text: 'Summarise', side: 'l', y: 0.2, small: true },
      { icon: 'edit_note', text: 'Rewrite', side: 'r', y: 0.26, small: true },
      { icon: 'lightbulb', text: 'Brainstorm', side: 'l', y: 0.55, small: true },
      { icon: 'school', text: 'Explain', side: 'r', y: 0.61, small: true },
    ],
  },
  {
    tag: 'Real-time',
    title: 'Watch answers <em>stream in</em>',
    sub: 'Tokens appear as the model writes them, with rich Markdown formatting.',
    tilt: 0,
    app: {
      query: 'Summarise this article in 3 bullet points',
      count: 1,
      response: `<p><strong>Summary</strong></p>
        <ul><li>The city will add 40 km of protected bike lanes by 2027.</li>
        <li>Funding comes from the existing transport budget, not new taxes.</li>
        <li>Residents can vote on the first routes<span class="caret" style="height:calc(var(--dp)*20);width:calc(var(--dp)*2);background:#D0BCFF"></span></li></ul>`,
    },
    chips: [{ icon: 'bolt', text: 'Token by token', side: 'r', y: 0.5 }],
  },
  {
    tag: 'For developers',
    title: 'See the <em>speed</em> of every answer',
    sub: 'Inference time, output tokens and finish reason after each response.',
    app: {
      query: 'Write a haiku about coffee on a rainy Monday',
      count: 0,
      response: `<p><em>Grey rain on the glass,<br>steam curls from a warm first cup.<br>Monday, take it slow.</em></p>`,
      stats: ['612.0', '21', 'STOP'],
    },
    statsCard: { side: 'l', y: 0.37, values: [['612', 'ms', 'Inference'], ['21', '', 'Tokens'], ['STOP', '', 'Finish']] },
    chips: [{ icon: 'timer', text: 'Live seconds counter', side: 'r', y: 0.52 }],
  },
  {
    tag: 'Share to Nano',
    title: 'Send text from <em>any app</em>',
    sub: 'Share selected text straight into a prompt with the Android share sheet.',
    app: {
      query: 'Rewrite this in a friendly tone: Your order has been delayed due to unforeseen circumstances.',
      count: 1,
      response: `<p>Quick heads-up! Your order is running a little late because of something we didn’t see coming. We’re on it, and it’ll be with you soon. Thanks for your patience!</p>`,
      stats: ['1046.0', '38', 'STOP'],
    },
    shareCard: { side: 'l', y: 0.42 },
    chips: [],
  },
  {
    tag: 'Know your model',
    title: 'Check which <em>Nano</em> you have',
    sub: 'Tap the model bar to see the Gemini Nano version on your device.',
    app: { screen: 'info', version: 'nano-v3' },
    chips: [
      { icon: 'verified', text: 'nano-v2 & nano-v3', side: 'r', y: 0.3 },
      { icon: 'code', text: 'Open source', side: 'l', y: 0.48 },
    ],
  },
];
