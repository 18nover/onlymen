import { describe, expect, it, vi } from 'vitest'
import { checkTlsDomain } from './tls-domain.js'

const hostname = 'pds.onlymen.example'
const handleDomains = [`.${hostname}`]

describe(checkTlsDomain, () => {
  it('approves the exact PDS hostname without looking up an account', async () => {
    const accountExists = vi.fn<(handle: string) => Promise<boolean>>()

    const result = await checkTlsDomain(
      hostname,
      handleDomains,
      hostname,
      accountExists,
    )

    expect(result).toEqual({ status: 200, body: { success: true } })
    expect(accountExists).not.toHaveBeenCalled()
  })

  it('approves an existing account handle in a hosted domain', async () => {
    const accountExists = vi.fn(async () => true)

    const result = await checkTlsDomain(
      hostname,
      handleDomains,
      `alice.${hostname}`,
      accountExists,
    )

    expect(result).toEqual({ status: 200, body: { success: true } })
    expect(accountExists).toHaveBeenCalledWith(`alice.${hostname}`)
  })

  it('rejects a nonexistent account handle', async () => {
    const result = await checkTlsDomain(
      hostname,
      handleDomains,
      `missing.${hostname}`,
      async () => false,
    )

    expect(result).toEqual({
      status: 404,
      body: {
        error: 'NotFound',
        message: 'handle not found for this domain',
      },
    })
  })

  it('rejects an unrelated domain', async () => {
    const result = await checkTlsDomain(
      hostname,
      handleDomains,
      'alice.example.com',
      async () => true,
    )

    expect(result).toEqual({
      status: 400,
      body: {
        error: 'InvalidRequest',
        message: 'handles are not provided on this domain',
      },
    })
  })

  it('rejects a missing domain parameter', async () => {
    const result = await checkTlsDomain(
      hostname,
      handleDomains,
      undefined,
      async () => true,
    )

    expect(result).toEqual({
      status: 400,
      body: {
        error: 'InvalidRequest',
        message: 'bad or missing domain query param',
      },
    })
  })

  it('rejects a domain that only contains the hosted suffix', async () => {
    const result = await checkTlsDomain(
      hostname,
      handleDomains,
      `alice.${hostname}.attacker.example`,
      async () => true,
    )

    expect(result.status).toBe(400)
  })

  it('surfaces account lookup failures to the route adapter', async () => {
    await expect(
      checkTlsDomain(hostname, handleDomains, `alice.${hostname}`, async () => {
        throw new Error('database unavailable')
      }),
    ).rejects.toThrow('database unavailable')
  })
})
