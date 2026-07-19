# React Native Patterns — Nova Knowledge Base

## Component Patterns

### Compound Components
Use compound components when a component has tightly coupled sub-components that share implicit state.

```tsx
// Pattern: Context-based compound components
interface ChatContextValue {
  isExpanded: boolean;
  toggle: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('Must be used within Chat.Provider');
  return ctx;
}

function Chat({ children, defaultExpanded = false }: Props) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const toggle = useCallback(() => setIsExpanded(p => !p), []);

  return (
    <ChatContext.Provider value={{ isExpanded, toggle }}>
      <View>{children}</View>
    </ChatContext.Provider>
  );
}

Chat.Header = function ChatHeader() {
  const { toggle } = useChatContext();
  return <TouchableOpacity onPress={toggle}><Text>Toggle</Text></TouchableOpacity>;
};

Chat.Body = function ChatBody({ children }: { children: ReactNode }) {
  const { isExpanded } = useChatContext();
  if (!isExpanded) return null;
  return <View>{children}</View>;
};
```

**When to use:** Navigation headers, collapsible sections, modals with shared state.
**When not to use:** When components are independent — just use props.

### Render Props (Rare in Hooks Era)
Use sparingly; prefer hooks for most shared-logic scenarios.

```tsx
interface RenderProps {
  hasPermission: boolean;
  requestPermission: () => void;
}

function CameraPermission({ children }: { children: (props: RenderProps) => ReactNode }) {
  const [hasPermission, setPermission] = useState(false);

  const requestPermission = useCallback(async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setPermission(status === 'granted');
  }, []);

  return <>{children({ hasPermission, requestPermission })}</>;
}

// Usage — prefer custom hook instead:
// function useCameraPermission() { ... }
```

### Custom Hooks Pattern
Encapsulate reusable logic in custom hooks. This is the primary pattern for shared behavior.

```tsx
function useChatMessages(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToMessages(roomId, (newMessages) => {
      setMessages(newMessages);
      setIsLoading(false);
    });
    return unsubscribe;
  }, [roomId]);

  const sendMessage = useCallback(async (text: string) => {
    await sendMessageToRoom(roomId, text);
  }, [roomId]);

  return { messages, isLoading, sendMessage };
}
```

### Render Optimization Components
```tsx
// React.memo for expensive renders
const MessageBubble = React.memo(function MessageBubble({ message }: Props) {
  return (
    <View style={styles.bubble}>
      <Text>{message.text}</Text>
    </View>
  );
}, (prev, next) => prev.message.id === next.message.id && prev.message.text === next.message.text);

// useMemo for expensive computations
const sortedMessages = useMemo(
  () => [...messages].sort((a, b) => b.timestamp - a.timestamp),
  [messages]
);

// useCallback for stable function references
const handleSend = useCallback((text: string) => {
  sendMessage(text);
}, [sendMessage]);
```

### Error Boundaries
```tsx
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
    Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <View style={styles.errorContainer}>
          <Text>Something went wrong</Text>
          <Button title="Retry" onPress={() => this.setState({ hasError: false })} />
        </View>
      );
    }
    return this.props.children;
  }
}

// Usage: wrap at screen level
<ErrorBoundary fallback={<ErrorScreen />}>
  <ChatScreen />
</ErrorBoundary>
```

---

## State Management Patterns

### TanStack Query for Server State
```tsx
// Query hook
function useMessages(roomId: string) {
  return useQuery({
    queryKey: ['messages', roomId],
    queryFn: () => fetchMessages(roomId),
    staleTime: 30_000,
    refetchInterval: 5_000, // for real-time feel
  });
}

// Mutation with optimistic update
function useSendMessage(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => sendMessage(roomId, text),
    onMutate: async (text) => {
      await queryClient.cancelQueries({ queryKey: ['messages', roomId] });
      const previous = queryClient.getQueryData(['messages', roomId]);
      queryClient.setQueryData(['messages', roomId], (old: Message[]) => [
        ...old,
        { id: Date.now().toString(), text, status: 'sending' },
      ]);
      return { previous };
    },
    onError: (_err, _text, context) => {
      queryClient.setQueryData(['messages', roomId], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
    },
  });
}
```

### React Context for UI State
```tsx
interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  colors: typeof lightColors;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const toggleTheme = useCallback(() => setTheme(t => t === 'light' ? 'dark' : 'light'), []);
  const colors = theme === 'light' ? lightColors : darkColors;

  const value = useMemo(() => ({ theme, toggleTheme, colors }), [theme, toggleTheme, colors]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
```

### Zustand for Complex Local State
```tsx
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChatStore {
  draftMessage: string;
  isMuted: boolean;
  setDraftMessage: (text: string) => void;
  toggleMute: () => void;
}

const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      draftMessage: '',
      isMuted: false,
      setDraftMessage: (text) => set({ draftMessage: text }),
      toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
    }),
    {
      name: 'chat-preferences',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### State Colocation Principles
- Keep state as close to where it's used as possible
- Lift state up only when multiple siblings need it
- Server state → TanStack Query cache (not local state)
- URL state → navigation params or query params
- Form state → React Hook Form or local component state
- UI state (modals, toggles) → local or Zustand
- Shared UI state (theme, auth) → Context
- Persistent state → Zustand with AsyncStorage middleware

---

## Performance Patterns

### List Rendering
```tsx
// FlatList for standard lists
<FlatList
  data={messages}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <MessageBubble message={item} />}
  inverted // for chat (newest at bottom)
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  getItemLayout={(_data, index) => ({
    length: MESSAGE_HEIGHT,
    offset: MESSAGE_HEIGHT * index,
    index,
  })}
/>

// FlashList for very large lists (Shopify's replacement for FlatList)
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={messages}
  renderItem={({ item }) => <MessageBubble message={item} />}
  estimatedItemSize={60}
/>
```

### Image Optimization
```tsx
import { Image } from 'expo-image';

// Use expo-image for better performance
<Image
  source={{ uri: url }}
  contentFit="cover"
  transition={300}
  placeholder={blurhash}
  style={{ width: 200, height: 200 }}
  cachePolicy="memory-disk"
/>

// Prefetch critical images
import { Image } from 'expo-image';
Image.prefetch(importantImageUrl);
```

### Animation Patterns
```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

function SwipeableMessage({ onSwipeReply }: Props) {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = Math.max(0, e.translationX);
    })
    .onEnd(() => {
      if (translateX.value > 100) {
        runOnJS(onSwipeReply)();
      }
      translateX.value = withSpring(0);
    });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>
        <MessageContent />
      </Animated.View>
    </GestureDetector>
  );
}
```

### Lazy Loading / Code Splitting
```tsx
import { lazy, Suspense } from 'react';

const AdminPanel = lazy(() => import('./screens/AdminPanel'));
const AnalyticsDashboard = lazy(() => import('./screens/Analytics'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
      </Routes>
    </Suspense>
  );
}
```

---

## Platform-Specific Code

### File-Based Platform Splitting
```
components/
  VideoPlayer.tsx          # Shared interface
  VideoPlayer.ios.ts      # iOS implementation
  VideoPlayer.android.ts  # Android implementation
```

### Platform API Usage
```tsx
import { Platform, PermissionsAndroid } from 'react-native';

async function requestNotificationPermission() {
  if (Platform.OS === 'ios') {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  if (Platform.OS === 'android') {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }

  return false;
}
```

### Platform-Specific Styles
```tsx
const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 4 },
    }),
  },
});
```

---

## Testing Patterns

### Component Testing
```tsx
import { render, screen, fireEvent } from '@testing-library/react-native';

describe('MessageInput', () => {
  it('calls onSend with text when send button pressed', () => {
    const onSend = jest.fn();
    render(<MessageInput onSend={onSend} />);

    fireEvent.changeText(screen.getByPlaceholderText('Type a message'), 'Hello');
    fireEvent.press(screen.getByLabelText('Send'));

    expect(onSend).toHaveBeenCalledWith('Hello');
  });

  it('disables send button when input is empty', () => {
    render(<MessageInput onSend={jest.fn()} />);
    expect(screen.getByLabelText('Send')).toBeDisabled();
  });
});
```

### Hook Testing
```tsx
import { renderHook, act } from '@testing-library/react-hooks';

describe('useChatMessages', () => {
  it('adds message to list', () => {
    const { result } = renderHook(() => useChatMessages('room-1'));

    act(() => {
      result.current.sendMessage('Hello');
    });

    expect(result.current.messages).toContainEqual(
      expect.objectContaining({ text: 'Hello' })
    );
  });
});
```

### Mocking Patterns
```tsx
// Mock navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
  useRoute: () => ({ params: { roomId: 'test-room' } }),
}));

// Mock API
jest.mock('../services/api', () => ({
  fetchMessages: jest.fn().mockResolvedValue([]),
  sendMessage: jest.fn().mockResolvedValue({ id: '1', text: 'sent' }),
}));

// Mock Expo modules
jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  scheduleNotificationAsync: jest.fn(),
}));
```

### Snapshot Testing (Use Sparingly)
```tsx
it('renders message bubble correctly', () => {
  const tree = renderer.create(
    <MessageBubble message={{ id: '1', text: 'Hello', timestamp: Date.now() }} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
```

**When to use snapshots:** Simple presentational components, icon components.
**When not to use:** Components with dynamic content, complex interactions, time-dependent data.
