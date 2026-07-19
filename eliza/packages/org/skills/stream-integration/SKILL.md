---
name: stream-integration
description: >
  Stream.io integration skill for Stream. Covers Stream Video SDK integration,
  Stream Chat SDK integration, server-side token generation, Expo/React Native
  integration, connection recovery strategies, push notifications via APNs and
  FCM, livestreaming setup, and EAS build considerations. All references point
  to official Stream documentation.
metadata:
  author: NottyBoi Engineering
  team: Stream
  version: 1.0.0
  tags:
    - stream-io
    - video
    - chat
    - push-notifications
    - livestreaming
    - expo
    - realtime
---

# Stream.io Integration

Skill for integrating Stream Video and Chat SDKs into the NottyBoi
application. All implementation guidance must be verified against official
Stream documentation before use.

---

## Official Documentation References

Before implementing any feature, consult the relevant official docs:

| Topic | Documentation |
|---|---|
| Video SDK (React Native) | https://getstream.io/video/docs/react-native/ |
| Chat SDK (React Native) | https://getstream.io/chat/docs/react-native/ |
| Video API Reference | https://getstream.io/video/docs/ |
| Chat API Reference | https://getstream.io/chat/docs/ |
| Push Notifications | https://getstream.io/chat/docs/react-native/push-notifications/ |
| Livestreaming | https://getstream.io/video/docs/ |
| Expo Integration | https://getstream.io/video/docs/react-native/ |

Never assume an API surface. Always check the latest SDK version's
documentation.

---

## Stream Video SDK

### Setup

```bash
npx expo install @stream-io/react-native-sdk @stream-io/expo-video
```

The SDK requires both the core SDK and the Expo video player component.

### Provider Configuration

Wrap the app in the `StreamVideo` provider:

```tsx
import { StreamVideo, StreamVideoClient } from '@stream-io/react-native-sdk'
import { tokenProvider } from '@/lib/stream-token'

const client = new StreamVideoClient({
  apiKey: process.env.EXPO_PUBLIC_STREAM_API_KEY,
  user: { id: userDid },
  tokenProvider,
})

export function StreamProvider({ children }: { children: React.ReactNode }) {
  return <StreamVideo client={client}>{children}</StreamVideo>
}
```

### Video Call Lifecycle

```tsx
import { useCalls } from '@stream-io/react-native-sdk'

function CallButton() {
  const calls = useCalls()

  const startCall = async () => {
    const call = client.call('default', callId)
    await call.join()
  }

  return <Button onPress={startCall}>Start Call</Button>
}
```

### Call Types

Define call types in your Stream dashboard and reference them by name:

| Type | Use Case |
|---|---|
| `default` | 1:1 and small group calls |
| `livestream` | Broadcast-style with audience |
| `audio_room` | Audio-only spaces |

### Video Quality Settings

Configure quality based on network conditions:

```tsx
const call = client.call('default', callId)
await call.join({
  video: true,
  audio: true,
})
```

The SDK handles adaptive bitrate automatically. Do not override this unless
there is a documented reason.

---

## Stream Chat SDK

### Setup

```bash
npx expo install @stream-io/react-native-sdk @stream-io/expo-video
```

The Chat SDK shares infrastructure with the Video SDK. Use the unified
`@stream-io/react-native-sdk` package.

### Chat Client Initialization

```tsx
import { StreamChat } from 'stream-chat'

const chatClient = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY)

await chatClient.connectUser(
  { id: userDid, name: displayName },
  token
)
```

### Channel Types

```tsx
const channel = chatClient.channel('messaging', channelId, {
  members: [userDid, otherDid],
})

await channel.watch()
```

### Message Sending

```tsx
await channel.sendMessage({
  text: 'Hello',
  attachments: [
    {
      type: 'image',
      image_url: 'https://...',
    },
  ],
})
```

### Message Components

Use Stream's provided components as the baseline. Customize via theming, not
by replacing components outright.

---

## Token Generation

### Server-Side Only

Stream tokens must be generated on the server. Never expose your Stream
secret key to client code.

```ts
import { StreamChat } from 'stream-chat'

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
)

const token = serverClient.createToken(userDid)
```

### Token Expiration

Set token expiration for production. The default is 30 days.

```ts
const token = serverClient.createToken(userDid, Math.floor(Date.now() / 1000) + 3600)
```

1-hour tokens are recommended. The client SDK handles refresh automatically
via the `tokenProvider`.

### Token Provider Pattern

```ts
const tokenProvider = async () => {
  const response = await fetch('https://api.nottyboi.dev/v1/stream/token', {
    headers: { Authorization: `Bearer ${authToken}` },
  })
  const { token } = await response.json()
  return token
}
```

The `tokenProvider` is called automatically when the token expires or on
connection recovery.

---

## Expo Integration

### Required Packages

```bash
npx expo install \
  @stream-io/react-native-sdk \
  @stream-io/expo-video \
  expo-notifications \
  expo-device
```

### Expo Router Integration

Place the Stream providers in the root layout:

```tsx
// app/_layout.tsx
import { StreamProvider } from '@/components/stream-provider'

export default function RootLayout() {
  return (
    <StreamProvider>
      <Stack />
    </StreamProvider>
  )
}
```

### Expo Development Builds

Stream SDKs require native modules. They will not work in Expo Go. Ensure
`expo-dev-client` is installed and all builds use development builds or EAS.

### Expo Video Player

Use `@stream-io/expo-video` for the video player component within calls.
Do not use `expo-av` for real-time video — it does not support the low-latency
requirements of video calls.

---

## Connection Recovery

### Automatic Reconnection

The Stream SDKs handle reconnection automatically. When the network drops:

1. The SDK detects the disconnection.
2. It queues outgoing messages and calls.
3. On reconnect, it syncs state from the server.

### Manual Intervention

If the SDK reports a permanent disconnection, reinitialize:

```tsx
useEffect(() => {
  const unsubscribe = chatClient.wsConnect(() => {
    // Connection restored
  })

  return () => unsubscribe()
}, [])
```

### Offline Support

The Chat SDK caches recent messages locally. When offline:

- Users can read cached messages.
- Outgoing messages are queued and sent on reconnect.
- The UI should indicate offline status clearly.

### Best Practices

- Show a visible connection status indicator in the UI.
- Do not retry connections manually. Let the SDK handle it.
- Log connection state changes for debugging.
- Handle the `disconnected` and `reconnecting` states in your UI.

---

## Push Notifications

### APNs (iOS)

1. Generate an APNs key in the Apple Developer portal.
2. Upload the key to the Stream dashboard under Chat > Push Notifications.
3. Configure the push certificate in `app.json`:

```json
{
  "expo": {
    "ios": {
      "apsEnvironment": "production"
    }
  }
}
```

4. Register the device token with Stream:

```tsx
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'

async function registerForPushNotifications(userId: string) {
  if (!Device.isDevice) return

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') return

  const token = await Notifications.getExpoPushTokenAsync()
  await chatClient.addDevice(token.data, 'expo', userId)
}
```

### FCM (Android)

1. Create a Firebase project and download `google-services.json`.
2. Upload the FCM server key to the Stream dashboard.
3. Register the device token:

```tsx
const token = await Notifications.getExpoPushTokenAsync()
await chatClient.addDevice(token.data, 'expo', userId)
```

### Push Notification Handling

```tsx
Notifications.addNotificationReceivedListener((notification) => {
  // Handle foreground notification
})

Notifications.addNotificationResponseReceivedListener((response) => {
  // Handle notification tap - navigate to the relevant chat/call
})
```

### EAS and Push Notifications

- Push notifications require native code. They do not work in Expo Go.
- Test push notifications on physical devices only. Simulators do not
  receive APNs/FCM notifications.
- Use EAS Build for production builds. Development builds on physical
  devices work for testing.

---

## Livestreaming

### Stream Type

Use the `livestream` call type for broadcast scenarios:

```tsx
const call = client.call('livestream', streamId)
await call.goLive()
```

### Viewer Role

Viewers join without publishing video/audio:

```tsx
const call = client.call('livestream', streamId)
await call.join({ data: { role: 'viewer' } })
```

### Host Controls

```tsx
// Mute a participant
await call.muteUser(participantId, 'audio')

// Kick a participant
await call.removeParticipant(participantId)

// End the stream
await call.end()
```

### Chat During Livestreaming

Use a dedicated channel for stream chat. The channel type should be
`livestream` or `messaging` depending on permissions:

```tsx
const channel = chatClient.channel('livestream', `stream-${streamId}`, {
  members: [hostDid],
})
await channel.watch()
```

### Recording

Enable recording in the Stream dashboard for the call type. Access
recordings via the API after the call ends.

---

## EAS Build Considerations

### Required Dependencies

Ensure all Stream packages are in `package.json` and installed via
`npx expo install` (not `npm install`) to get compatible versions.

### Native Modules

Stream SDKs include native modules for video/audio processing. These are
handled automatically by EAS Build, but:

- Do not strip native modules in Metro bundler config.
- Test on both iOS and Android. Video codecs and hardware acceleration
  differ between platforms.
- Android requires the `INTERNET` and `RECORD_AUDIO` permissions in
  `AndroidManifest.xml`.

### Bundle Size

Stream SDKs add significant bundle size. Use dynamic imports for video/chat
features that are not in the critical path:

```tsx
const StreamChatScreen = React.lazy(() => import('@/screens/stream-chat'))
```

### Memory Management

Video calls are memory-intensive. On low-memory devices:

- Reduce video quality automatically.
- Disable video for participants who are not speaking.
- Monitor `call.state` for memory pressure events.

---

## Common Gotchas

- **Expo Go limitation**: Stream SDKs require native code. They will not
  work in Expo Go. Always use development builds.
- **Token expiry**: If users get disconnected unexpectedly, check token
  expiry. Use short-lived tokens with a `tokenProvider` for refresh.
- **Permission prompts**: iOS requires camera and microphone permissions
  before starting a call. Request permissions early, not at call time.
- **Background behavior**: Video calls may pause or disconnect when the app
  goes to background. Handle `AppState` changes and rejoin on foreground.
- **Android audio focus**: On Android, other apps can steal audio focus.
  Handle `Audio` session interruptions.
- **SDK version mismatches**: Video and Chat SDKs must use compatible
  versions. Use `npx expo install` to ensure alignment.
- **Stream dashboard config**: Push notification certificates, call types,
  and permissions are configured in the Stream dashboard, not in code.
  Verify dashboard settings when debugging.

---

## Security Considerations

- **Server-side tokens only**: Never generate Stream tokens on the client.
  The secret key must never leave the server.
- **Short token expiry**: Use 1-hour token expiry with refresh via
  `tokenProvider`. Long-lived tokens are a security risk.
- **Permission enforcement**: Enforce call and channel permissions server-side.
  Do not rely solely on client-side permission checks.
- **Recording consent**: Ensure users consent to recording before enabling
  it. Log consent events for compliance.
- **Sensitive data in chat**: Do not send passwords, tokens, or PII in chat
  messages. Use end-to-end encryption if supported, or route sensitive
  data through a separate secure channel.
- **Rate limiting on token endpoint**: Rate limit the token generation
  endpoint to prevent abuse. An attacker with a valid user DID could
  request unlimited tokens.
- **API key rotation**: Rotate Stream API keys periodically. The Stream
  dashboard supports key rotation without downtime.
