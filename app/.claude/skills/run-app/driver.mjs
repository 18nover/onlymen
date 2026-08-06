#!/usr/bin/env node
// Minimal chromium driver for the run-app skill. Stands in for `chromium-cli`
// on machines that don't have it: drives the cached Puppeteer Chrome build
// against the Expo web dev server and reports back what it saw.
//
// Usage:
//   node driver.mjs screenshot <url> <outfile.png> [--full]
//   node driver.mjs snapshot <url>              # title + console + network errors
//   node driver.mjs eval <url> "<jsExpression>"  # evaluate JS in page context, print result

import puppeteer from 'puppeteer-core'
import { existsSync } from 'node:fs'

const CHROME_CANDIDATES = [
  'C:/Users/jerry/.cache/puppeteer/chrome/win64-131.0.6778.204/chrome-win64/chrome.exe',
]

function findChrome() {
  const fromEnv = process.env.RUN_APP_CHROME_PATH
  if (fromEnv && existsSync(fromEnv)) return fromEnv
  for (const path of CHROME_CANDIDATES) {
    if (existsSync(path)) return path
  }
  throw new Error(
    'No Chrome executable found. Set RUN_APP_CHROME_PATH or install one with:\n' +
      '  npx puppeteer browsers install chrome',
  )
}

async function withPage(url, fn) {
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: ['--disable-gpu', '--no-sandbox'],
  })
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 900 })

    const consoleMessages = []
    page.on('console', msg => consoleMessages.push(`[${msg.type()}] ${msg.text()}`))
    const failedRequests = []
    page.on('requestfailed', req =>
      failedRequests.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`),
    )

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60_000 })
    return await fn(page, { consoleMessages, failedRequests })
  } finally {
    await browser.close()
  }
}

async function main() {
  const [cmd, url, arg3, arg4] = process.argv.slice(2)
  if (!cmd || !url) {
    console.error(
      'Usage:\n' +
        '  node driver.mjs screenshot <url> <outfile.png> [--full]\n' +
        '  node driver.mjs snapshot <url>\n' +
        '  node driver.mjs eval <url> "<jsExpression>"',
    )
    process.exit(1)
  }

  if (cmd === 'screenshot') {
    const outfile = arg3 ?? 'screenshot.png'
    const fullPage = arg4 === '--full'
    await withPage(url, async (page, diag) => {
      await page.screenshot({ path: outfile, fullPage })
      console.log(`Saved ${outfile} (${fullPage ? 'full page' : 'viewport'})`)
      if (diag.consoleMessages.some(m => m.startsWith('[error]'))) {
        console.log('Console errors:')
        diag.consoleMessages.filter(m => m.startsWith('[error]')).forEach(m => console.log(' ', m))
      }
      if (diag.failedRequests.length) {
        console.log('Failed requests:')
        diag.failedRequests.forEach(m => console.log(' ', m))
      }
    })
    return
  }

  if (cmd === 'snapshot') {
    await withPage(url, async (page, diag) => {
      const title = await page.title()
      console.log(`Title: ${title}`)
      console.log(`Console messages (${diag.consoleMessages.length}):`)
      diag.consoleMessages.forEach(m => console.log(' ', m))
      console.log(`Failed requests (${diag.failedRequests.length}):`)
      diag.failedRequests.forEach(m => console.log(' ', m))
    })
    return
  }

  if (cmd === 'eval') {
    const expr = arg3
    if (!expr) throw new Error('eval requires a JS expression as the 3rd argument')
    await withPage(url, async page => {
      const result = await page.evaluate(new Function(`return (${expr})`))
      console.log(JSON.stringify(result, null, 2))
    })
    return
  }

  throw new Error(`Unknown command: ${cmd}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
