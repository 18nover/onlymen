# Bundle Analysis

## Overview

React Native bundle size measurement, optimization techniques, tree shaking, code splitting, and dependency auditing.

## Bundle Size Measurement

### React Native Bundle Info

```bash
# Generate bundle for analysis
npx react-native bundle \
  --platform ios \
  --dev false \
  --entry-file index.js \
  --bundle-output ios/main.jsbundle \
  --sourcemap-output ios/main.jsbundle.map

# Check bundle size
ls -lh ios/main.jsbundle

# Analyze with metro-bundler-visualizer
npx react-native-bundle-visualizer
```

### Metro Bundle Analyzer

```bash
# Install
npm install -g metro-bundler-visualizer

# Generate and visualize
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output /tmp/bundle.js

npx metro-bundler-visualizer --entry /tmp/bundle.js
```

### Bundle Size Targets

| Metric                    | Target     | Warning     | Critical   |
|---------------------------|------------|-------------|------------|
| Total bundle size         | < 5 MB     | 5-8 MB      | > 8 MB     |
| JavaScript only           | < 2 MB     | 2-4 MB      | > 4 MB     |
| Initial load time         | < 3s       | 3-5s        | > 5s       |
| Time to interactive       | < 5s       | 5-8s        | > 8s       |

## Tree Shaking

### Webpack Configuration

```javascript
// webpack.config.js
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,      // Tree shaking
    minimize: true,
    concatenateModules: true,  // Module concatenation
  },
};
```

### Common Tree Shaking Issues

```javascript
// BAD: Side effects prevent tree shaking
import _ from 'lodash';           // Imports entire lodash
import { cloneDeep } from 'lodash';  // Better, but lodash has side effects

// GOOD: Use lodash-es for tree shaking
import { cloneDeep } from 'lodash-es';

// BAD: Import barrel files
import { Button, Card } from './components';  // Imports all components

// GOOD: Import specific files
import Button from './components/Button';
import Card from './components/Card';
```

### package.json Side Effects

```json
{
  "name": "my-app",
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills.js",
    "./src/global-setup.js"
  ]
}
```

## Code Splitting

### Dynamic Imports

```javascript
// Lazy load entire routes
const HomeScreen = React.lazy(() => import('./screens/HomeScreen'));
const ProfileScreen = React.lazy(() => import('./screens/ProfileScreen'));
const SettingsScreen = React.lazy(() => import('./screens/SettingsScreen'));

// With Suspense
function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Suspense>
  );
}
```

### Lazy Component Loading

```javascript
// Lazy load heavy components
const HeavyChart = React.lazy(() => import('./components/HeavyChart'));
const VideoPlayer = React.lazy(() => import('./components/VideoPlayer'));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <View>
      <Button onPress={() => setShowChart(true)} title="Show Chart" />
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart />
        </Suspense>
      )}
    </View>
  );
}
```

### Route-Based Splitting

```javascript
// Define routes with lazy loading
const routes = {
  home: {
    component: () => import('./screens/HomeScreen'),
    preload: () => import('./screens/HomeScreen'),
  },
  profile: {
    component: () => import('./screens/ProfileScreen'),
    preload: () => import('./screens/ProfileScreen'),
  },
  settings: {
    component: () => import('./screens/SettingsScreen'),
    preload: () => import('./screens/SettingsScreen'),
  },
};

// Preload on hover/focus
const preloadRoute = async (routeName) => {
  if (routes[routeName]?.preload) {
    await routes[routeName].preload();
  }
};
```

## Lazy Imports

### React.lazy Patterns

```javascript
// Pattern 1: Simple lazy import
const LazyComponent = React.lazy(() => import('./MyComponent'));

// Pattern 2: Named export
const LazyComponent = React.lazy(() =>
  import('./MyComponent').then(module => ({
    default: module.MyComponent,
  }))
);

// Pattern 3: Conditional lazy loading
const getComponent = (type) => {
  switch (type) {
    case 'chart':
      return React.lazy(() => import('./ChartComponent'));
    case 'video':
      return React.lazy(() => import('./VideoComponent'));
    default:
      return React.lazy(() => import('./DefaultComponent'));
  }
};
```

### Lazy Loading Best Practices

| Practice                          | Impact                              |
|-----------------------------------|-------------------------------------|
| Lazy load routes                  | Reduces initial bundle by 30-50%    |
| Lazy load heavy components        | Reduces initial load time           |
| Preload on user intent            | Seamless UX with smaller bundle     |
| Avoid lazy loading critical paths | Prevents layout shift               |
| Use dynamic imports for features  | Feature-based code splitting        |

## Dependency Auditing

### Bundle Analysis Tools

```bash
# npm audit
npm audit --production

# Check bundle size impact
npx bundle-phobia npm-package-name

# Analyze dependencies
npx depcheck

# Find duplicate dependencies
npx yarn-deduplicate
```

### Dependency Size Impact

```javascript
// Check what you're importing
const bundleInfo = {
  // Heavy dependencies (consider alternatives)
  'moment': '72KB min',
  'lodash': '71KB min (full), 4KB min (per method)',
  'axios': '14KB min',
  'chart.js': '65KB min',

  // Lighter alternatives
  'date-fns': 'Tree-shakeable, ~5KB per function',
  'lodash-es': 'Tree-shakeable ES modules',
  'ky': '10KB min, modern fetch wrapper',
  'lightweight-charts': '40KB min',
};
```

### Dependency Audit Checklist

```bash
# 1. Check total dependency count
npm ls --depth=0 | wc -l

# 2. Find unused dependencies
npx depcheck

# 3. Check for heavy dependencies
npx cost-of-modules --no-install

# 4. Analyze bundle composition
npx webpack-bundle-analyzer stats.json
```

## Platform-Specific Bundles

### iOS vs Android

```javascript
// Platform-specific code
import { Platform } from 'react-native';

const config = Platform.select({
  ios: {
    bundleId: 'com.example.ios',
    apiEndpoint: 'https://ios-api.example.com',
  },
  android: {
    bundleId: 'com.example.android',
    apiEndpoint: 'https://android-api.example.com',
  },
});
```

### Platform-Specific Dependencies

```json
{
  "dependencies": {
    "react-native-ios-architecture": "1.0.0",
    "react-native-android-architecture": "1.0.0"
  },
  "peerDependencies": {
    "react-native-ios-architecture": {
      "ios": "1.0.0",
      "android": null
    },
    "react-native-android-architecture": {
      "ios": null,
      "android": "1.0.0"
    }
  }
}
```

### Native Module Splitting

```javascript
// Conditional native module loading
const getNativeModule = () => {
  if (Platform.OS === 'ios') {
    return require('react-native').NativeModules.IOSModule;
  } else if (Platform.OS === 'android') {
    return require('react-native').NativeModules.AndroidModule;
  }
  return null;
};
```

## Optimization Strategies

### Bundle Reduction Techniques

| Technique                    | Typical Savings | Effort     |
|------------------------------|-----------------|------------|
| Remove unused dependencies   | 10-30%          | Low        |
| Tree shaking                 | 5-15%           | Medium     |
| Code splitting               | 30-50%          | High       |
| Image optimization           | 20-40%          | Low        |
| Lazy loading                 | 20-40%          | Medium     |
| Replace heavy libs           | 10-30%          | High       |

### Size Monitoring

```javascript
// In CI pipeline
const checkBundleSize = async () => {
  const stats = await getBundleStats();

  const limits = {
    ios: { warning: 5 * 1024 * 1024, critical: 8 * 1024 * 1024 },
    android: { warning: 5 * 1024 * 1024, critical: 8 * 1024 * 1024 },
  };

  for (const [platform, size] of Object.entries(stats)) {
    if (size > limits[platform].critical) {
      throw new Error(`Bundle size critical: ${platform} is ${(size / 1024 / 1024).toFixed(2)}MB`);
    }
    if (size > limits[platform].warning) {
      console.warn(`Bundle size warning: ${platform} is ${(size / 1024 / 1024).toFixed(2)}MB`);
    }
  }
};
```

### Performance Budget

```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kb",
      "maximumError": "1mb"
    },
    {
      "type": "bundle",
      "name": "vendor",
      "maximumWarning": "200kb",
      "maximumError": "300kb"
    }
  ]
}
```

## Bundle Analysis Checklist

- [ ] Total bundle size measured and within budget
- [ ] Unused dependencies identified and removed
- [ ] Heavy dependencies replaced with lighter alternatives
- [ ] Code splitting implemented for routes
- [ ] Lazy loading for non-critical components
- [ ] Tree shaking enabled and verified
- [ ] Platform-specific bundles analyzed
- [ ] Bundle size tracked in CI/CD
- [ ] Performance budget set and enforced
- [ ] Regular dependency audits scheduled
