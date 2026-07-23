# Secret Management

## Overview

This document covers secure handling of secrets across the development lifecycle, including storage, rotation, audit logging, and emergency procedures.

## Environment Variables

### Loading Secrets

```python
import os
from pathlib import Path

class SecretManager:
    def __init__(self):
        self._cache = {}

    def get(self, key: str, required: bool = True) -> str:
        if key in self._cache:
            return self._cache[key]

        value = os.environ.get(key)
        if value is None and required:
            raise SecretNotFoundError(f"Required secret '{key}' not found")

        self._cache[key] = value
        return value

    def get_int(self, key: str, required: bool = True) -> int:
        value = self.get(key, required)
        try:
            return int(value)
        except (TypeError, ValueError):
            raise SecretValidationError(f"Secret '{key}' is not a valid integer")
```

### Environment File Management

```bash
# .env (NEVER commit to git)
DATABASE_URL=postgresql://user:pass@host:5432/db
API_KEY=sk_live_xxxxxxxxxxxx
JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# .env.example (safe to commit, contains placeholders)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
API_KEY=your_api_key_here
JWT_SECRET=your_jwt_secret_here
```

### Git Ignore Rules

```gitignore
# Environment files
.env
.env.local
.env.*.local
!.env.example

# Secrets files
*.pem
*.key
*.cert
secrets.json
credentials.json
service-account.json
```

## Keychain (iOS)

### Storing Secrets

```swift
import Security

class KeychainManager {
    static func save(key: String, value: String) -> Bool {
        guard let data = value.data(using: .utf8) else { return false }

        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecAttrService as String: Bundle.main.bundleIdentifier!,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlock
        ]

        SecItemDelete(query as CFDictionary)
        let status = SecItemAdd(query as CFDictionary, nil)
        return status == errSecSuccess
    }

    static func get(key: String) -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecAttrService as String: Bundle.main.bundleIdentifier!,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)

        guard status == errSecSuccess, let data = result as? Data else {
            return nil
        }
        return String(data: data, encoding: .utf8)
    }
}
```

### Keychain Access Levels

| Protection Level                     | When Available            | Use Case                |
|--------------------------------------|---------------------------|-------------------------|
| `kSecAttrAccessibleWhenUnlocked`     | Device unlocked           | Background services     |
| `kSecAttrAccessibleAfterFirstUnlock` | After first unlock        | Persistent secrets      |
| `kSecAttrAccessibleWhenUnlockedThisDeviceOnly` | Device unlocked | Device-specific secrets |
| `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly` | After first unlock | Backup-excluded secrets |

## Keystore (Android)

### Storing Secrets

```kotlin
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import java.security.KeyStore
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.Cipher

class KeystoreManager {
    private val keyAlias = "app_secret_key"

    fun generateKey(): SecretKey {
        val keyGenerator = KeyGenerator.getInstance(
            KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore"
        )
        keyGenerator.init(
            KeyGenParameterSpec.Builder(
                keyAlias,
                KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
            )
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
            .setKeySize(256)
            .build()
        )
        return keyGenerator.generateKey()
    }

    fun encrypt(data: ByteArray): ByteArray {
        val keyStore = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
        val key = keyStore.getKey(keyAlias, null) as SecretKey
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, key)
        return cipher.doFinal(data)
    }
}
```

## Secret Rotation Schedule

### Rotation Matrix

| Secret Type           | Rotation Period | Rotation Method       | Downtime |
|-----------------------|-----------------|----------------------|----------|
| API Keys              | 90 days         | Dual-key rotation    | None     |
| Database Password     | 30 days         | Rolling update       | None     |
| JWT Signing Key       | 24 hours        | Key rotation         | None     |
| TLS Certificates      | 90 days         | Auto-renewal (ACME)  | None     |
| Encryption Keys       | 180 days        | Versioned rotation   | None     |
| OAuth Client Secrets  | 365 days        | Manual with audit    | Possible |
| SSH Keys              | 365 days        | Deploy new, revoke old| Minimal |

### Dual-Key Rotation Pattern

```python
class DualKeyRotator:
    def __init__(self):
        self.current_key = None
        self.previous_key = None
        self.rotation_date = None

    def get_signing_key(self) -> str:
        """Returns current key for signing new tokens."""
        return self.current_key

    def get_verification_keys(self) -> list:
        """Returns both keys for verifying tokens (allows grace period)."""
        return [self.current_key, self.previous_key]

    def rotate(self, new_key: str):
        """Rotate keys, keeping previous for verification."""
        self.previous_key = self.current_key
        self.current_key = new_key
        self.rotation_date = datetime.utcnow()

    def is_old_key_valid(self) -> bool:
        """Check if previous key is still within grace period."""
        if self.rotation_date is None:
            return False
        grace_period = timedelta(hours=24)
        return (datetime.utcnow() - self.rotation_date) < grace_period
```

## Audit Logging

### What to Log

```python
import logging
import hashlib

audit_logger = logging.getLogger("secret_audit")

def log_secret_access(secret_id: str, user: str, action: str, success: bool):
    audit_logger.info(json.dumps({
        "event": "secret_access",
        "secret_id": hashlib.sha256(secret_id.encode()).hexdigest()[:16],
        "user": user,
        "action": action,  # "read", "write", "rotate", "delete"
        "success": success,
        "timestamp": datetime.utcnow().isoformat(),
        "source_ip": get_client_ip(),
        "request_id": get_request_id()
    }))
```

### Log Retention

| Log Type          | Retention Period | Storage        |
|-------------------|------------------|----------------|
| Secret access     | 1 year           | Immutable log  |
| Rotation events   | 3 years          | Archive        |
| Failed access     | 2 years          | Alert on spike |
| Emergency revoke  | 5 years          | Compliance     |

## Emergency Revocation

### Revocation Procedure

```
1. DETECT
   → Anomaly detected (unauthorized access, leak suspected)
   → Immediate alert to security team

2. CONTAIN (< 5 minutes)
   → Rotate affected secrets immediately
   → Invalidate all active sessions using old secrets
   → Block API access with compromised keys

3. ASSESS (< 30 minutes)
   → Determine scope of exposure
   → Check audit logs for unauthorized usage
   → Identify affected services and data

4. RECOVER (< 2 hours)
   → Deploy new secrets to all services
   → Verify all services using new secrets
   → Resume normal operations

5. REVIEW (< 24 hours)
   → Complete incident report
   → Update access controls
   → Implement additional monitoring
```

### Emergency Contacts

```yaml
emergency_contacts:
  primary:
    name: "Security Lead"
    phone: "+1-555-0100"
    slack: "@security-lead"
    escalation_time: "5 minutes"

  secondary:
    name: "Infrastructure Lead"
    phone: "+1-555-0101"
    slack: "@infra-lead"
    escalation_time: "15 minutes"

  tertiary:
    name: "CTO"
    phone: "+1-555-0102"
    slack: "@cto"
    escalation_time: "30 minutes"
```

## CI/CD Secrets

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
env:
  # Reference secrets (NEVER echo or log them)
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}

steps:
  - name: Deploy
    run: |
      # Never echo secrets
      echo "Deploying..."  # OK
      # echo $DATABASE_URL  # NEVER DO THIS
      deploy-script.sh --url "$DATABASE_URL"
```

### Secret Scanning Prevention

```bash
# Pre-commit hook to catch secrets
#!/bin/bash
# .git/hooks/pre-commit

if git diff --cached --name-only | xargs grep -lE '(api_key|secret|password|token)\s*[:=]\s*["\x27][A-Za-z0-9]{20,}' 2>/dev/null; then
    echo "ERROR: Potential secret detected in staged files!"
    echo "Please use environment variables instead."
    exit 1
fi
```

### Tools

| Tool              | Purpose                           | Integration     |
|-------------------|-----------------------------------|-----------------|
| git-secrets       | Pre-commit secret scanning        | Git hooks       |
| truffleHog        | Repository-wide secret detection  | CI pipeline     |
| gitleaks          | Secret scanning in git history    | CI pipeline     |
| HashiCorp Vault   | Centralized secret management     | Runtime         |
| AWS Secrets Manager | Cloud secret management        | Runtime         |
| SOPS              | Encrypted secrets in git          | Deployment      |

## Best Practices Checklist

- [ ] Never commit secrets to version control
- [ ] Use environment variables for configuration
- [ ] Use platform-specific secure storage (Keychain/Keystore)
- [ ] Implement secret rotation schedule
- [ ] Enable audit logging for all secret access
- [ ] Set up automated secret scanning in CI/CD
- [ ] Document emergency revocation procedure
- [ ] Limit secret access to minimum required scope
- [ ] Use short-lived tokens where possible
- [ ] Regularly audit who has access to which secrets
