# Battery Optimization

## Overview

Techniques for minimizing battery impact in mobile applications, covering background tasks, location services, network batching, and power-efficient patterns.

## Background Task Management

### iOS Background Modes

```xml
<!-- Info.plist -->
<key>UIBackgroundModes</key>
<array>
  <string>fetch</string>
  <string>remote-notification</string>
  <string>processing</string>
</array>
```

### Background Fetch (iOS)

```javascript
// Register background fetch
import BackgroundFetch from 'react-native-background-fetch';

BackgroundFetch.configure({
  minimumFetchInterval: 15, // minutes (minimum)
  stopOnTerminate: false,
  startOnBoot: true,
  enableHeadless: true,
}, async (taskId) => {
  console.log('[BackgroundFetch] taskId:', taskId);

  // Perform minimal work
  await syncCriticalData();

  // Signal completion
  BackgroundFetch.finish(taskId);
}, (taskId) => {
  console.log('[BackgroundFetch] timeout:', taskId);
  BackgroundFetch.finish(taskId);
});
```

### Android WorkManager

```kotlin
// Periodic work request
val workRequest = PeriodicWorkRequestBuilder<SyncWorker>(
    15, TimeUnit.MINUTES  // Minimum interval
).setConstraints(
    Constraints.Builder()
        .setRequiredNetworkType(NetworkType.CONNECTED)
        .setRequiresBatteryNotLow(true)
        .setRequiresCharging(false)
        .build()
).build()

WorkManager.getInstance(context).enqueueUniquePeriodicWork(
    "data-sync",
    ExistingPeriodicWorkPolicy.KEEP,
    workRequest
)
```

### Background Task Budgets

| Platform      | Background Fetch | Processing  | Push Handler  |
|---------------|-----------------|-------------|---------------|
| iOS           | 30s             | 30s         | 30s           |
| Android       | 10 min          | 10 min      | 30s           |
| Budget        | 30s/call        | 30s/call    | 30s/call      |
| Frequency     | 15-60 min       | 15-60 min   | On demand     |

## Location Services

### Battery-Efficient Location

```javascript
import Geolocation from '@react-native-community/geolocation';

// Use appropriate accuracy for use case
const getBatteryEfficientLocation = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: false,  // Use GPS only when needed
        timeout: 15000,
        maximumAge: 60000,          // Accept cached location up to 1 min
      }
    );
  });
};

// Monitor with appropriate interval
const watchId = Geolocation.watchPosition(
  (position) => updateLocation(position),
  (error) => handleError(error),
  {
    enableHighAccuracy: false,
    distanceFilter: 100,           // Minimum 100m movement to trigger
    interval: 30000,               // 30 second intervals
    fastestInterval: 15000,        // 15 second minimum
  }
);
```

### Location Accuracy vs Battery

| Mode             | Accuracy | Battery Impact | Use Case              |
|------------------|----------|----------------|-----------------------|
| High (GPS)       | 5-10m    | Very High      | Navigation            |
| Balanced         | 10-50m   | Medium         | Ride-sharing          |
| Low (Network)    | 100m+    | Low            | Weather, general      |
| Passive          | From other apps | Minimal  | Background sync       |

### Geofencing (Low Power)

```javascript
// Geofencing uses cellular/WiFi, not GPS
import Geofencing from 'react-native-geofencing';

Geofencing.startGeofencing([
  {
    identifier: 'office',
    latitude: 37.7749,
    longitude: -122.4194,
    radius: 100,          // meters
    notifyOnEnter: true,
    notifyOnExit: true,
  }
]);
```

## Network Request Batching

### Batch Strategy

```javascript
class NetworkBatcher {
  constructor(options = {}) {
    this.queue = [];
    this.flushInterval = options.flushInterval || 5000;  // 5 seconds
    this.maxBatchSize = options.maxBatchSize || 10;
    this.timer = null;
  }

  add(request) {
    this.queue.push(request);

    if (this.queue.length >= this.maxBatchSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.flushInterval);
    }
  }

  async flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.maxBatchSize);
    try {
      await api.batchRequest(batch);
    } catch (error) {
      // Re-queue failed requests
      this.queue.unshift(...batch);
    }
  }
}
```

### Request Prioritization

```javascript
const RequestPriority = {
  CRITICAL: 0,    // Auth, payments - send immediately
  HIGH: 1,        // User actions - send within 1s
  NORMAL: 2,      // Data sync - batch within 5s
  LOW: 3,         // Analytics - batch within 30s
  BACKGROUND: 4,  // Telemetry - batch within 60s
};

class PriorityBatcher {
  constructor() {
    this.batches = new Map();  // priority → requests
  }

  add(request, priority = RequestPriority.NORMAL) {
    if (!this.batches.has(priority)) {
      this.batches.set(priority, []);
    }
    this.batches.get(priority).push(request);
  }

  async flush() {
    // Process in priority order
    const priorities = [...this.batches.keys()].sort();
    for (const priority of priorities) {
      const requests = this.batches.get(priority);
      if (requests.length > 0) {
        await this.sendBatch(requests);
        this.batches.set(priority, []);
      }
    }
  }
}
```

## Wake Lock Management

### Preventing Unnecessary Wake Locks

```javascript
// Bad: Holding wake lock during long operations
const syncData = async () => {
  WakeLock.acquire();
  await syncAllData();  // Could take minutes
  WakeLock.release();
};

// Good: Acquire only when needed
const syncData = async () => {
  const chunks = splitIntoChunks(data);
  for (const chunk of chunks) {
    WakeLock.acquire();
    await processChunk(chunk);
    WakeLock.release();
    await sleep(100);  // Allow system to rest
  }
};
```

### iOS Background Task Rules

```
1. Keep background work under 30 seconds
2. Don't hold wake locks unnecessarily
3. Use silent push notifications instead of background polling
4. Batch network requests to minimize radio wake-ups
5. Use appropriate background mode for your use case
6. Call backgroundTaskScheduler completionHandler promptly
```

### Android Battery Optimization

```kotlin
// Request battery optimization exemption (use sparingly)
val intent = Intent()
intent.action = Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS
intent.data = Uri.parse("package:$packageName")
startActivity(intent)

// Check if battery optimization is enabled
val powerManager = getSystemService(POWER_SERVICE) as PowerManager
val isIgnoring = powerManager.isIgnoringBatteryOptimizations(packageName)
```

## Push Notification Efficiency

### Efficient Push Strategy

```javascript
// Combine notifications when possible
class NotificationBatcher {
  constructor() {
    this.pending = [];
    this.flushDelay = 2000;  // 2 seconds
  }

  add(notification) {
    this.pending.push(notification);
    if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.flushDelay);
    }
  }

  flush() {
    if (this.pending.length === 1) {
      // Single notification - show directly
      showNotification(this.pending[0]);
    } else if (this.pending.length > 1) {
      // Multiple - show summary
      showSummaryNotification(
        `${this.pending.length} new updates`,
        this.pending.map(n => n.title).join(', ')
      );
    }
    this.pending = [];
    this.timer = null;
  }
}
```

### Notification Best Practices

| Practice                         | Battery Impact | User Experience |
|----------------------------------|----------------|-----------------|
| Batch non-urgent notifications   | Reduced        | Good            |
| Use silent push for data sync    | Reduced        | Seamless        |
| Respect Do Not Disturb           | Minimal        | Respectful      |
| Limit notification frequency     | Reduced        | Less annoying   |
| Use content-available for iOS    | Reduced        | Background fresh|

## Battery Monitoring

```javascript
import { NativeModules } from 'react-native';

// Monitor battery level
const monitorBattery = async () => {
  const batteryLevel = await NativeModules.Battery.getLevel();
  const isCharging = await NativeModules.Battery.isCharging();

  if (batteryLevel < 0.2 && !isCharging) {
    // Enable power-saving mode
    reduceBackgroundActivity();
    lowerImageQuality();
    increase batching intervals();
  }
};

// Adaptive behavior based on battery
const getNetworkConfig = (batteryLevel) => {
  if (batteryLevel < 0.15) {
    return { batchInterval: 60000, maxRetries: 1 };  // Very conservative
  } else if (batteryLevel < 0.30) {
    return { batchInterval: 30000, maxRetries: 2 };
  }
  return { batchInterval: 5000, maxRetries: 3 };  // Normal
};
```

## Battery Optimization Checklist

- [ ] Background fetch uses minimum required interval
- [ ] Location services use appropriate accuracy level
- [ ] Network requests are batched when possible
- [ ] Wake locks are acquired only when needed
- [ ] Push notifications are not excessive
- [ ] Animations respect reduced-motion setting
- [ ] Timer intervals are appropriate for use case
- [ ] Background work completes quickly
- [ ] Battery level monitoring is implemented
- [ ] Power-saving mode reduces app activity
