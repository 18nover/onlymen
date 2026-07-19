# OWASP Mobile Top 10

## Overview

Comprehensive checklist covering the OWASP Mobile Application Security Testing Guide (MASTG) Top 10 vulnerabilities. Use this as a reference for security reviews and penetration testing.

## M1: Improper Platform Usage

### Description

Misuse of platform security features, including Keychain (iOS), Keystore (Android), permissions, or transport security.

### Common Vulnerabilities

- Storing secrets in SharedPreferences (Android) or UserDefaults (iOS)
- Incorrect Keychain access group configuration
- Missing `usesCleartextTraffic` flag allowing HTTP on Android
- Requesting excessive permissions beyond app functionality
- Not using `android:exported="false"` on components

### Testing Methods

```bash
# Android: Check exported components
aapt dump xmltree AndroidManifest.xml | grep -A2 "exported=true"

# iOS: Check Keychain access
security find-generic-password -s "com.app.bundleid"

# Check network security config (Android)
cat res/xml/network_security_config.xml
```

### Remediation

| Issue                          | Fix                                            |
|--------------------------------|------------------------------------------------|
| Secrets in SharedPreferences  | Use EncryptedSharedPreferences or Keystore     |
| Secrets in UserDefaults       | Use Keychain with `kSecAttrAccessible`          |
| Exported components           | Set `android:exported="false"` explicitly       |
| Cleartext traffic             | Enforce HTTPS with network security config     |
| Excessive permissions         | Audit and remove unnecessary permissions        |

### Tools

- MobSF: Automated static analysis
- QARK: Android manifest and code scanning
- Needle: iOS security assessment

## M2: Inadequate Supply Chain Security

### Description

Compromised build process, third-party libraries, or dependencies introducing vulnerabilities.

### Common Vulnerabilities

- Outdated libraries with known CVEs
- Compromised npm/pip/CocoaPods packages
- Missing dependency verification
- Insecure CI/CD pipeline allowing code injection
- Unverified third-party SDKs

### Testing Methods

```bash
# Android: Check for known vulnerable libraries
./gradlew dependencyCheckAnalyze

# iOS: Check CocoaPods for vulnerabilities
pod audit --no-restrict

# npm audit
npm audit --production

# Check for suspicious permissions in third-party libs
grep -r "android.permission" node_modules/ --include="AndroidManifest.xml"
```

### Remediation

- Pin dependency versions in lockfiles
- Use private artifact repositories
- Enable Dependabot/Renovate for automated updates
- Verify package checksums and signatures
- Audit all third-party SDKs before integration

## M3: Insecure Authentication/Authorization

### Description

Weak authentication mechanisms, missing MFA, or broken authorization logic.

### Common Vulnerabilities

- Client-side authentication validation only
- Hardcoded credentials in the app binary
- Missing rate limiting on authentication endpoints
- JWT without proper validation (algorithm confusion, no expiry check)
- Broken access control on API endpoints

### Testing Methods

```bash
# Decompile and search for hardcoded secrets
jadx --show-bad-code app.apk | grep -i "password\|secret\|key\|token"

# Intercept auth traffic
mitmproxy -s auth_test.py

# Check JWT implementation
jwt_tool <token> -T -S hs256 -p "common_secrets.txt"
```

### Remediation

- Always validate authentication server-side
- Store tokens in secure storage (Keychain/Keystore)
- Implement MFA for sensitive operations
- Use short-lived tokens with refresh mechanism
- Enforce strong password policies

## M4: Insecure Communication

### Description

Insufficient transport encryption, missing certificate pinning, or cleartext data transmission.

### Common Vulnerabilities

- Missing TLS 1.3 enforcement
- No certificate pinning (allowing MITM)
- Cleartext HTTP for API calls
- Weak cipher suites accepted
- SSL/TLS verification disabled in WebView

### Testing Methods

```bash
# Check for cleartext traffic in Android
grep -r "http://" smali/ --include="*.smali"

# Test certificate pinning
sslpinning-bypass --apk app.apk

# Analyze network security config
cat AndroidManifest.xml | grep -i "network\|cleartext"
```

### Remediation

```xml
<!-- Android: Network Security Config -->
<network-security-config>
    <domain-config cleartextTrafficPermitted="false">
        <domain includeSubdomains="true">example.com</domain>
        <pin-set expiration="2025-01-01">
            <pin digest="SHA-256">base64_encoded_pin==</pin>
        </pin-set>
    </domain-config>
</network-security-config>
```

## M5: Insecure Data Storage

### Description

Sensitive data stored insecurely on the device, accessible to other apps or through physical access.

### Common Vulnerabilities

- Plaintext credentials in local database
- Sensitive data in app logs
- Cache files containing PII
- Clipboard containing sensitive data
- Backup including sensitive data

### Testing Methods

```bash
# Check app data directory
adb shell run-as com.app.name ls -la /data/data/com.app.name/

# Search for sensitive data in shared preferences
adb shell run-as com.app.name cat /data/data/com.app.name/shared_prefs/*.xml

# Check SQLite databases
sqlite3 /data/data/com.app.name/databases/app.db ".tables"

# Check for sensitive data in logs
adb logcat | grep -i "password\|token\|secret"
```

### Remediation

- Use EncryptedSharedPreferences / Keychain for secrets
- Clear sensitive data from memory after use
- Disable backup for sensitive data: `android:allowBackup="false"`
- Use ProGuard/R8 to strip logging in release builds
- Implement screen capture prevention for sensitive screens

## M6: Insecure Cryptography

### Description

Weak or incorrect cryptographic implementations, including deprecated algorithms and improper key management.

### Common Vulnerabilities

- Using MD5 or SHA-1 for password hashing
- ECB mode for symmetric encryption
- Hardcoded encryption keys
- Insufficient key length (DES, 3DES)
- Predictable IVs/nonces

### Testing Methods

```bash
# Search for crypto usage in decompiled code
grep -r "DES\|MD5\|SHA-1\|ECB" smali/ --include="*.smali"

# Check for hardcoded keys
grep -r "SecretKeySpec\|Cipher.getInstance" smali/
```

### Remediation

| Algorithm     | Use Instead        | Notes                          |
|---------------|--------------------|--------------------------------|
| MD5           | SHA-256 / bcrypt   | Never for passwords            |
| DES/3DES      | AES-256-GCM        | Deprecated and weak            |
| ECB mode      | CBC/GCM with IV    | No diffusion                   |
| RSA < 2048    | RSA-2048+ / Ed25519| Insufficient key length        |

## M7: Client Code Quality

### Description

Code quality issues that create security vulnerabilities, including buffer overflows, SQL injection, and format string bugs.

### Common Vulnerabilities

- SQL injection via string concatenation
- WebView JavaScript interface exposure
- Buffer overflow in native code
- Input validation failures
- Unsafe deserialization

### Testing Methods

```bash
# Static analysis with MobSF
python3 mobsfmanage.py --scan app.apk

# Check for SQL injection patterns
grep -r "rawQuery\|execSQL" smali/

# Check WebView security
grep -r "addJavascriptInterface\|setJavaScriptEnabled" smali/
```

## M8: Code Tampering

### Description

Insufficient code protection allowing reverse engineering, repackaging, or tampering.

### Common Vulnerabilities

- Missing code obfuscation
- No integrity verification
- Debuggable release builds
- No root/jailbreak detection
- Repackaging without detection

### Remediation

- Enable R8/ProGuard obfuscation for Android
- Enable bitcode for iOS
- Implement runtime integrity checks
- Add anti-tamper mechanisms
- Use SafetyNet (Android) / DeviceCheck (iOS)

## M9: Reverse Engineering

### Description

Application binary can be reverse engineered to extract secrets, algorithms, or intellectual property.

### Testing Methods

```bash
# Decompile Android APK
jadx -d output/ app.apk

# Disassemble iOS binary
class-dump -H MyApp

# Analyze with Ghidra or IDA Pro
ghidra MyApp &
```

### Remediation

- Enable obfuscation and minification
- Strip debug symbols from release builds
- Implement anti-debugging checks
- Use binary protection (Arxan, Irdeto)
- Deploy server-side logic for sensitive operations

## M10: Extraneous Functionality

### Description

Hidden functionality, debug features, or backdoors left in production builds.

### Common Vulnerabilities

- Debug endpoints in production
- Admin accounts with default credentials
- Feature flags that bypass security
- Test user accounts with elevated privileges
- Verbose error messages exposing internals

### Testing Methods

```bash
# Search for debug endpoints
grep -r "debug\|admin\|test\|backdoor" routes/

# Check for debug flags
grep -r "DEBUG\s*=\s*True" . --include="*.py"
grep -r "isDebuggable" AndroidManifest.xml
```

## Testing Tools Summary

| Tool    | Platform | Use Case                        |
|---------|----------|---------------------------------|
| MobSF   | Both     | Static/dynamic analysis         |
| QARK    | Android  | Manifest and code analysis      |
| Needle  | iOS      | Security assessment             |
| Frida   | Both     | Dynamic instrumentation         |
| Objection | Both   | Runtime mobile exploration      |
| Drozer  | Android  | Security testing framework      |
| Burp Suite | Both  | Traffic interception            |
| Ghidra  | Both     | Reverse engineering             |
