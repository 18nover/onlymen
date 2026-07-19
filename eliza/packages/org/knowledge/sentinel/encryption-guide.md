# Encryption Guide

## Overview

Comprehensive encryption reference covering TLS configuration, Ed25519 for AT Protocol, AES-256 for data at rest, key management, and certificate pinning.

## TLS 1.3 Configuration

### Server Configuration (nginx)

```nginx
# /etc/nginx/conf.d/ssl.conf
ssl_protocols TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ecdh_curve X25519:secp256r1:secp384r1;

# TLS 1.3 cipher suites (in preference order)
ssl_conf_command Ciphersuites TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256;

# Session configuration
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;

# OCSP stapling
ssl_stapling on;
ssl_stapling_verify on;
resolver 1.1.1.1 8.8.8.8 valid=300s;
resolver_timeout 5s;
```

### Client Configuration (Python)

```python
import ssl
import httpx

def create_tls_context() -> ssl.SSLContext:
    ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
    ctx.minimum_version = ssl.TLSVersion.TLSv1_3
    ctx.maximum_version = ssl.TLSVersion.TLSv1_3
    ctx.load_default_certs()
    ctx.verify_mode = ssl.CERT_REQUIRED
    ctx.check_hostname = True
    return ctx

# With custom CA
def create_custom_tls_context(ca_cert_path: str) -> ssl.SSLContext:
    ctx = create_tls_context()
    ctx.load_verify_locations(ca_cert_path)
    return ctx
```

### TLS 1.3 vs 1.2 Comparison

| Feature                  | TLS 1.2         | TLS 1.3         |
|--------------------------|-----------------|-----------------|
| Handshake Round Trips    | 2 (full)        | 1 (full), 0 (resumed) |
| Cipher Suites            | 300+            | 5               |
| Forward Secrecy          | Optional        | Mandatory       |
| Key Exchange             | RSA/DHE/ECDHE   | ECDHE/X25519 only |
| Record Layer Encryption  | AEAD or CBC     | AEAD only       |
| 0-RTT Resumption         | Not supported   | Supported       |

### Recommended Cipher Suites

| Priority | Suite                           | Key Size | Notes                    |
|----------|---------------------------------|----------|--------------------------|
| 1        | TLS_AES_256_GCM_SHA384         | 256-bit  | Best for most cases      |
| 2        | TLS_CHACHA20_POLY1305_SHA256   | 256-bit  | Better on mobile (no AES-NI) |
| 3        | TLS_AES_128_GCM_SHA256         | 128-bit  | Fastest, still secure    |

## Ed25519 for AT Protocol

### Key Generation

```python
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.hazmat.primitives import serialization
import hashlib
import base64

def generate_ed25519_keypair():
    private_key = Ed25519PrivateKey.generate()
    public_key = private_key.public_key()

    # Serialize private key
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )

    # Serialize public key
    public_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )

    return private_pem, public_pem

def sign_did_document(doc: dict, private_key: Ed25519PrivateKey) -> bytes:
    """Sign a DID document for AT Protocol."""
    doc_bytes = canonicalize_json(doc).encode()
    return private_key.sign(doc_bytes)

def verify_did_signature(doc: dict, signature: bytes, public_key) -> bool:
    """Verify a DID document signature."""
    doc_bytes = canonicalize_json(doc).encode()
    try:
        public_key.verify(signature, doc_bytes)
        return True
    except Exception:
        return False
```

### AT Protocol Integration

```python
# DID:web document signing
did_doc = {
    "@context": ["https://www.w3.org/ns/did/v1"],
    "id": "did:web:example.com:user:alice",
    "verificationMethod": [{
        "id": "did:web:example.com:user:alice#key-1",
        "type": "Ed25519VerificationKey2020",
        "controller": "did:web:example.com:user:alice",
        "publicKeyMultibase": "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
    }],
    "authentication": ["did:web:example.com:user:alice#key-1"],
    "assertionMethod": ["did:web:example.com:user:alice#key-1"]
}
```

### Ed25519 vs ECDSA

| Property            | Ed25519           | ECDSA P-256       |
|---------------------|-------------------|-------------------|
| Key Size            | 32 bytes          | 32 bytes          |
| Signature Size      | 64 bytes          | 64 bytes          |
| Performance         | Faster            | Moderate          |
| Deterministic       | Yes               | No (requires RFC 6979) |
| Side-Channel Resistant | Yes           | Implementation-dependent |
| AT Protocol Support | Yes (preferred)   | Supported         |

## AES-256 for Data at Rest

### Encryption/Decryption

```python
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os

class AES256Encryptor:
    def __init__(self, key: bytes = None):
        self.key = key or AESGCM.generate_key(bit_length=256)

    def encrypt(self, plaintext: bytes, associated_data: bytes = None) -> bytes:
        nonce = os.urandom(12)  # 96-bit nonce
        aesgcm = AESGCM(self.key)
        ciphertext = aesgcm.encrypt(nonce, plaintext, associated_data)
        return nonce + ciphertext  # Prepend nonce for storage

    def decrypt(self, data: bytes, associated_data: bytes = None) -> bytes:
        nonce = data[:12]
        ciphertext = data[12:]
        aesgcm = AESGCM(self.key)
        return aesgcm.decrypt(nonce, ciphertext, associated_data)

# Usage
encryptor = AES256Encryptor()
encrypted = encryptor.encrypt(b"sensitive data", b"metadata")
decrypted = encryptor.decrypt(encrypted, b"metadata")
```

### Key Derivation

```python
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes

def derive_key(master_key: bytes, context: str, length: int = 32) -> bytes:
    """Derive a specific key from a master key using HKDF."""
    hkdf = HKDF(
        algorithm=hashes.SHA256(),
        length=length,
        salt=None,
        info=context.encode(),
    )
    return hkdf.derive(master_key)

# Derive different keys for different purposes
encryption_key = derive_key(master_key, "data-encryption")
signing_key = derive_key(master_key, "data-signing")
mac_key = derive_key(master_key, "data-mac")
```

### Storage Pattern

```python
def encrypt_database_field(value: str, field_name: str) -> dict:
    """Encrypt a database field with metadata."""
    encryptor = AES256Encryptor()
    plaintext = value.encode("utf-8")
    ciphertext = encryptor.encrypt(
        plaintext,
        associated_data=field_name.encode()
    )
    return {
        "ciphertext": base64.b64encode(ciphertext).decode(),
        "version": 1,
        "algorithm": "AES-256-GCM"
    }

def decrypt_database_field(stored: dict) -> str:
    """Decrypt a database field."""
    ciphertext = base64.b64decode(stored["ciphertext"])
    encryptor = AES256Encryptor()
    plaintext = encryptor.decrypt(ciphertext)
    return plaintext.decode("utf-8")
```

## Key Management

### Key Hierarchy

```
Master Key (KMS / Hardware Security Module)
    │
    ├── Encryption Keys (per service)
    │   ├── Data Encryption Key (DEK)
    │   └── Backup DEK
    │
    ├── Signing Keys (per service)
    │   ├── JWT Signing Key
    │   └── API Request Signing Key
    │
    └── TLS Keys
        ├── Server Certificate Key
        └── Client Certificate Key
```

### Key Storage Rules

| Key Type           | Storage Location          | Access               |
|--------------------|---------------------------|----------------------|
| Master Key         | Hardware Security Module   | Root admins only     |
| Encryption Keys    | KMS (AWS/GCP)             | Service accounts     |
| JWT Keys           | KMS + cached in memory    | Auth service only    |
| TLS Keys           | Certificate manager       | Load balancer        |
| API Keys           | Environment variables     | Application          |
| Client Secrets     | Secure config store       | Admin only           |

### Key Rotation Implementation

```python
class VersionedKeyManager:
    def __init__(self):
        self.keys = {}  # version → (key, created_at, expires_at)
        self.current_version = 0

    def add_key(self, version: int, key: bytes, ttl_days: int = 90):
        self.keys[version] = {
            "key": key,
            "created_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(days=ttl_days)
        }
        if version > self.current_version:
            self.current_version = version

    def get_current_key(self) -> bytes:
        return self.keys[self.current_version]["key"]

    def get_key_for_decrypt(self, version: int) -> bytes:
        if version not in self.keys:
            raise KeyError(f"Key version {version} not found")
        return self.keys[version]["key"]

    def rotate(self, new_key: bytes, ttl_days: int = 90):
        new_version = self.current_version + 1
        self.add_key(new_version, new_key, ttl_days)
        self.current_version = new_version

    def cleanup_expired(self):
        now = datetime.utcnow()
        expired = [v for v, k in self.keys.items() if k["expires_at"] < now]
        for v in expired:
            del self.keys[v]
```

## Certificate Pinning

### iOS Implementation

```swift
class PinningDelegate: NSObject, URLSessionDelegate {
    let pinnedCertHashes = [
        "SHA256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
        "SHA256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="
    ]

    func urlSession(
        _ session: URLSession,
        didReceive challenge: URLAuthenticationChallenge,
        completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void
    ) {
        guard let serverTrust = challenge.protectionSpace.serverTrust,
              let certificate = SecTrustGetCertificateAtIndex(serverTrust, 0) else {
            completionHandler(.cancelAuthenticationChallenge, nil)
            return
        }

        let serverCertData = SecCertificateCopyData(certificate) as Data
        let serverHash = sha256Hash(serverCertData)

        if pinnedCertHashes.contains(serverHash) {
            completionHandler(.useCredential, URLCredential(trust: serverTrust))
        } else {
            completionHandler(.cancelAuthenticationChallenge, nil)
        }
    }
}
```

### Android Implementation (Network Security Config)

```xml
<!-- res/xml/network_security_config.xml -->
<network-security-config>
    <domain-config>
        <domain includeSubdomains="true">api.example.com</domain>
        <pin-set expiration="2025-12-31">
            <!-- Primary pin -->
            <pin digest="SHA-256">base64EncodedPrimaryPin==</pin>
            <!-- Backup pin (different CA) -->
            <pin digest="SHA-256">base64EncodedBackupPin==</pin>
        </pin-set>
    </domain-config>
</network-security-config>
```

### Pinning Failure Handling

```python
class PinningHandler:
    def __init__(self, pins: list, backup_pins: list):
        self.pins = pins
        self.backup_pins = backup_pins
        self.pin_failure_count = 0
        self.max_failures_before_alert = 3

    def on_pin_failure(self, reason: str):
        self.pin_failure_count += 1
        if self.pin_failure_count >= self.max_failures_before_alert:
            self.alert_security_team(reason)
        # Never disable pinning on failure
        # Always fail closed
```

## Secure Random Generation

### Cryptographically Secure Random

```python
import secrets
import os

def generate_api_key() -> str:
    return f"sk_{secrets.token_urlsafe(32)}"

def generate_session_token() -> str:
    return secrets.token_hex(32)

def generate_iv(length: int = 12) -> bytes:
    return os.urandom(length)

def generate_salt(length: int = 16) -> bytes:
    return os.urandom(length)
```

### What NOT to Use

| Method               | Secure? | Use Instead     |
|----------------------|---------|-----------------|
| `random.random()`    | No      | `secrets`       |
| `random.randint()`   | No      | `secrets`       |
| `uuid.uuid4()`       | Partial | `secrets`       |
| `os.urandom()`       | Yes     | `secrets`       |
| `secrets.token_hex()` | Yes    | Recommended     |
| `time.time()` as seed | No    | Never           |

## Compliance Notes

| Standard    | Encryption Requirement          | Algorithm           |
|-------------|--------------------------------|---------------------|
| SOC 2       | AES-256 for data at rest       | AES-GCM             |
| HIPAA       | AES-128+ for PHI               | AES-GCM             |
| PCI DSS     | TLS 1.2+ for transit           | TLS 1.3 preferred   |
| GDPR        | Appropriate technical measures  | Industry standards  |
| AT Protocol | Ed25519 for DID signing        | Ed25519             |
