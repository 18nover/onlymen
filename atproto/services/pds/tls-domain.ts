export type TlsCheckResult = {
  status: number
  body: {
    success?: true
    error?: 'InvalidRequest' | 'NotFound' | 'InternalServerError'
    message?: string
  }
}

type AccountExists = (handle: string) => Promise<boolean>

export async function checkTlsDomain(
  hostname: string,
  handleDomains: readonly string[],
  domain: unknown,
  accountExists: AccountExists,
): Promise<TlsCheckResult> {
  if (!domain || typeof domain !== 'string') {
    return {
      status: 400,
      body: {
        error: 'InvalidRequest',
        message: 'bad or missing domain query param',
      },
    }
  }

  if (domain === hostname) {
    return { status: 200, body: { success: true } }
  }

  const isHostedHandle = handleDomains.some((suffix) => domain.endsWith(suffix))
  if (!isHostedHandle) {
    return {
      status: 400,
      body: {
        error: 'InvalidRequest',
        message: 'handles are not provided on this domain',
      },
    }
  }

  if (!(await accountExists(domain))) {
    return {
      status: 404,
      body: { error: 'NotFound', message: 'handle not found for this domain' },
    }
  }

  return { status: 200, body: { success: true } }
}
