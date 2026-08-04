# Memory Profiling

## Overview

Memory profiling techniques for React Native applications, including leak detection, heap analysis, and optimization strategies.

## React Native Memory Tools

### Flipper Memory Profiler

```
1. Open Flipper → Hermes Debugger → Memory
2. Take heap snapshot before and after actions
3. Compare snapshots to find growing objects
4. Look for detached DOM nodes and retained closures
```

### React DevTools Profiler

```
1. Open React DevTools → Profiler → Record
2. Perform suspected leak action
3. Check component count in "Commit" phase
4. Look for components that mount but never unmount
```

### Xcode Instruments (iOS)

```
1. Open Instruments → Leaks
2. Record app session
3. Look for red X markers indicating leaks
4. Check Call Tree for leak origins
5. Use Allocations for memory growth tracking
```

### Android Studio Profiler

```
1. Open Android Studio → Profiler → Memory
2. Click "Capture heap dump"
3. Filter by package name
4. Look for large retained sizes
5. Check for Activity/Fragment leaks
```

## Leak Detection

### Common React Native Leak Patterns

```javascript
// LEAK: Subscription not cleaned up
useEffect(() => {
  const subscription = EventEmitter.addListener('event', handler);
  // Missing return () => subscription.remove();
}, []);

// LEAK: Timer not cleared
useEffect(() => {
  const interval = setInterval(fetchData, 5000);
  // Missing return () => clearInterval(interval);
}, []);

// LEAK: Closure capturing stale reference
useEffect(() => {
  const data = heavyComputation();
  const handler = () => console.log(data);
  // data is captured in closure even after component unmounts
}, []);

// CORRECT: Proper cleanup
useEffect(() => {
  const subscription = EventEmitter.addListener('event', handler);
  const interval = setInterval(fetchData, 5000);
  return () => {
    subscription.remove();
    clearInterval(interval);
  };
}, []);
```

### LeakCanary (Android)

```kotlin
// build.gradle
dependencies {
    debugImplementation 'com.squareup.leakcanary:leakcanary-android:2.12'
}

// That's it - LeakCanary auto-initializes in debug builds
// Check logcat for leak reports:
// D/LeakCanary: ┬───
// D/LeakCanary: │ ObjectWatcher has been closed
// D/LeakCanary: │    LEAK: Activity (Activity#destroy() was called)
```

### iOS Memory Debugger

```bash
# Check for memory warnings
xcrun simctl diagnose --no-archive

# Use Memory Graph Debugger in Xcode
# Debug → Capture Memory Graph

# Command line memory check
xcrun instruments -t "Leaks" -l 10000 ./build/MyApp.app
```

## Heap Snapshots

### Taking Heap Snapshots

```javascript
// React Native (Hermes)
if (global.HermesInternal) {
  // Force garbage collection
  global.HermesInternal.collectGarbage();

  // Take heap snapshot (saved to device)
  global.HermesInternal.dumpSnapshot('/tmp/heap.heapsnapshot');
}
```

### Analyzing Heap Snapshots

```
1. Take snapshot A (baseline)
2. Perform suspected leak action
3. Force garbage collection
4. Take snapshot B
5. Compare A → B in Chrome DevTools or Flipper

Key metrics to watch:
- Detached DOM elements (should be 0)
- Growing object counts by type
- Retained size per constructor
```

### Heap Analysis Comparison

| Metric                | Healthy        | Leaking           |
|-----------------------|----------------|-------------------|
| Detached elements     | 0              | Growing           |
| JS heap size          | Stable         | Continuously growing |
| Event listeners       | Fixed count    | Increasing        |
| Component instances    | Fixed count    | Increasing        |
| Retained closures     | Minimal        | Large retained set|

## Memory Budgets

### Platform Targets

| Platform        | Warning     | Critical     | Max Allowed   |
|-----------------|-------------|--------------|---------------|
| iOS             | 150 MB      | 200 MB       | 250 MB        |
| Android (low)   | 100 MB      | 150 MB       | 200 MB        |
| Android (high)  | 150 MB      | 250 MB       | 400 MB        |
| Background      | 30 MB       | 50 MB        | 80 MB         |

### Monitoring Memory Usage

```javascript
import { NativeModules } from 'react-native';

function getMemoryUsage() {
  if (Platform.OS === 'android') {
    return NativeModules.MemoryModule.getMemoryUsage();
  }

  // iOS: Use bridge to check memory
  return new Promise((resolve) => {
    // Custom native module needed for iOS memory check
    NativeModules.MemoryInfo.getUsage(resolve);
  });
}

// Monitor in development
if (__DEV__) {
  setInterval(() => {
    getMemoryUsage().then((usage) => {
      if (usage.jsHeapUsed > 100 * 1024 * 1024) {
        console.warn('High memory usage:', usage);
      }
    });
  }, 10000);
}
```

## Image Cache Optimization

### React Native Fast Image

```javascript
import FastImage from 'react-native-fast-image';

// Preload images
FastImage.preload([
  { uri: 'https://example.com/image1.jpg' },
  { uri: 'https://example.com/image2.jpg' },
]);

// Set cache control
<FastImage
  source={{
    uri: imageUrl,
    priority: FastImage.priority.normal,
    cache: FastImage.cacheControl.immutable,
  }}
  style={{ width: 200, height: 200 }}
  resizeMode={FastImage.resizeMode.cover}
/>
```

### Image Cache Configuration

```javascript
// Limit memory cache size
FastImage.setMemoryCacheSize(50); // 50 MB
FastImage.setDiskCacheSize(200);  // 200 MB

// Clear cache
FastImage.clearMemoryCache();
FastImage.clearDiskCache();
```

### Image Optimization Strategies

| Strategy                | Memory Savings | Quality Impact |
|-------------------------|----------------|----------------|
| Resize to display size  | 60-80%         | None           |
| WebP format             | 25-35%         | Minimal        |
| Progressive loading     | 40-60%         | None           |
| Lazy loading            | 30-50%         | None           |
| BlurHash placeholders   | 90%+ (initial) | Temporary      |

## Component Lifecycle

### Memory-Managed Patterns

```javascript
// Pattern 1: Lazy state initialization
function HeavyComponent() {
  const [state, setState] = useState(() => {
    // Expensive computation only runs once
    return computeInitialState();
  });
}

// Pattern 2: Memoization for expensive computations
function DataList({ items }) {
  const processedItems = useMemo(() => {
    return items.map(processItem);
  }, [items]);

  return <FlatList data={processedItems} renderItem={renderItem} />;
}

// Pattern 3: Virtualized list for large datasets
function LargeList({ data }) {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      getItemLayout={(data, index) => (
        { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
      )}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
    />
  );
}
```

### FlatList Memory Optimization

```javascript
<FlatList
  data={largeDataset}
  renderItem={renderItem}
  keyExtractor={item => item.id}
  // Memory optimization props
  removeClippedSubviews={true}    // Remove off-screen views
  maxToRenderPerBatch={10}        // Render max 10 per batch
  updateCellsBatchingPeriod={50}  // Time between batches
  windowSize={5}                  // Render 5 screens worth
  initialNumToRender={10}         // Initial render count
  getItemLayout={getItemLayout}   // Avoid layout measurement
/>
```

## Memory Profiling Checklist

- [ ] Take heap snapshots at key user flows
- [ ] Check for detached DOM nodes
- [ ] Verify subscription cleanup in useEffect
- [ ] Verify timer cleanup in useEffect
- [ ] Profile image memory usage
- [ ] Check FlatList with large datasets
- [ ] Monitor memory during navigation transitions
- [ ] Test memory on low-end devices
- [ ] Verify background memory is released
- [ ] Profile memory growth over long sessions
