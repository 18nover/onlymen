import {resolveDefaultServiceUrl} from '#/lib/default-service'

describe('resolveDefaultServiceUrl', () => {
  const fallback = 'https://bsky.social'

  it('uses the production fallback when no override is configured', () => {
    expect(resolveDefaultServiceUrl(undefined, fallback)).toBe(fallback)
  })

  it('accepts the local WSL PDS URL', () => {
    expect(resolveDefaultServiceUrl('http://localhost:2583', fallback)).toBe(
      'http://localhost:2583',
    )
  })

  it('accepts an HTTPS provider URL', () => {
    expect(resolveDefaultServiceUrl('https://pds.example.com', fallback)).toBe(
      'https://pds.example.com',
    )
  })

  it('rejects malformed URLs', () => {
    expect(() => resolveDefaultServiceUrl('localhost:2583', fallback)).toThrow(
      'must use HTTP or HTTPS',
    )
  })

  it('rejects non-HTTP protocols', () => {
    expect(() =>
      resolveDefaultServiceUrl('ftp://localhost:2583', fallback),
    ).toThrow('must use HTTP or HTTPS')
  })
})
