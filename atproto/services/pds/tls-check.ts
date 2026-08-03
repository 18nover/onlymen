import { type PDS, httpLogger } from '@atproto/pds'
import { checkTlsDomain } from './tls-domain.js'

export function registerTlsCheckRoute(pds: PDS) {
  pds.app.get('/tls-check', async (req, res) => {
    try {
      const result = await checkTlsDomain(
        pds.ctx.cfg.service.hostname,
        pds.ctx.cfg.identity.serviceHandleDomains,
        req.query.domain,
        async (handle) => {
          type AccountIdentifier = Parameters<
            typeof pds.ctx.accountManager.getAccount
          >[0]
          const account = await pds.ctx.accountManager.getAccount(
            handle as AccountIdentifier,
          )
          return account != null
        },
      )
      return res.status(result.status).json(result.body)
    } catch (err) {
      httpLogger.error({ err }, 'tls check failed')
      return res.status(500).json({
        error: 'InternalServerError',
        message: 'Internal Server Error',
      })
    }
  })
}
