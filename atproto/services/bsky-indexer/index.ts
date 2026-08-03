import assert from 'node:assert'
import * as bsky from '@atproto/bsky'

// Indexer half of the AppView: subscribes to a PDS/relay firehose and
// populates the Postgres database that the bsky-app-view-service (api.ts)
// reads from over BSKY_DATAPLANE_URLS. See services/bsky-indexer/README.md.
const main = async () => {
  const env = getEnv()
  assert(env.dbPostgresUrl, 'must set BSKY_DB_POSTGRES_URL')
  assert(env.repoProvider, 'must set BSKY_REPO_PROVIDER')

  // Reads the same BSKY_*/MOD_SERVICE_DID vars as bsky-app-view-service;
  // BsyncSubscription needs the full server config, not just the indexer's
  // own vars.
  const config = bsky.ServerConfig.readEnv()

  const db = new bsky.Database({
    url: env.dbPostgresUrl,
    poolSize: env.dbPoolSize,
  })

  if (env.dbMigrate) {
    await db.migrateToLatestOrThrow()
  }

  const dataplane = await bsky.DataPlaneServer.create(
    db,
    env.dataplanePort,
    config.didPlcUrl,
  )

  const bsyncSub = new bsky.BsyncSubscription({ db, config })
  const repoSub = new bsky.RepoSubscription({
    service: env.repoProvider,
    db,
    idResolver: dataplane.idResolver,
  })

  bsyncSub.start()
  void repoSub.start()

  console.log(
    `bsky indexer listening on ${env.dataplanePort}, subscribed to ${env.repoProvider}`,
  )

  const shutdown = async () => {
    await repoSub.destroy()
    await bsyncSub.destroy()
    await dataplane.destroy()
    await db.close()
  }
  process.on('SIGTERM', shutdown)
}

const getEnv = () => ({
  dbPostgresUrl: process.env.BSKY_DB_POSTGRES_URL || undefined,
  dbPoolSize: maybeParseInt(process.env.BSKY_DB_POOL_SIZE) ?? 10,
  dbMigrate: process.env.BSKY_DB_MIGRATE === '1',
  dataplanePort: maybeParseInt(process.env.BSKY_DATAPLANE_PORT) ?? 3000,
  repoProvider: process.env.BSKY_REPO_PROVIDER || undefined,
})

const maybeParseInt = (str: string | undefined) => {
  if (!str) return undefined
  const int = parseInt(str, 10)
  if (isNaN(int)) return undefined
  return int
}

main()
