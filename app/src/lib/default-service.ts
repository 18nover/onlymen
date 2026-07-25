/**
 * Resolves the app's default AT Protocol hosting provider.
 *
 * The override is public client configuration, not a secret. Invalid values
 * fail during app startup so a mistyped development endpoint cannot silently
 * send credentials to an unintended service.
 */
export function resolveDefaultServiceUrl(
  configuredUrl: string | undefined,
  fallbackUrl: string,
): string {
  if (!configuredUrl) {
    return fallbackUrl
  }

  let parsed: URL
  try {
    parsed = new URL(configuredUrl)
  } catch {
    throw new Error(
      `EXPO_PUBLIC_DEFAULT_SERVICE_URL must be a valid HTTP(S) URL; received "${configuredUrl}"`,
    )
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(
      `EXPO_PUBLIC_DEFAULT_SERVICE_URL must use HTTP or HTTPS; received "${configuredUrl}"`,
    )
  }

  return configuredUrl
}
