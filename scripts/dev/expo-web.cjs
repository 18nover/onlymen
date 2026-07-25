#!/usr/bin/env node

const path = require("node:path");
const { createRequire } = require("node:module");

async function main() {
  const projectRoot = process.cwd();
  const requestedPort = Number.parseInt(process.argv[2] || "8081", 10);
  if (!Number.isInteger(requestedPort) || requestedPort < 1 || requestedPort > 65535) {
    throw new Error(`Invalid Expo web port: ${process.argv[2]}`);
  }

  // Expo SDK 54's public `expo start --web --port` applies the requested port
  // to Metro and leaves the legacy Webpack server on 19006. The internal
  // web-only setting is what makes `--port` select Webpack's port.
  const cliEntry = require.resolve("@expo/cli", { paths: [projectRoot] });
  const cliRoot = path.resolve(path.dirname(cliEntry), "..", "..");
  const cliRequire = createRequire(cliEntry);
  const configEntry = cliRequire.resolve("@expo/config");
  const expoConfig = cliRequire(configEntry);
  require.cache[configEntry].exports = {
    ...expoConfig,
    getConfig(...args) {
      const config = expoConfig.getConfig(...args);
      config.exp.web = { ...config.exp.web, bundler: "webpack" };
      // `startAsync` otherwise includes the native Metro bundler even when its
      // private web-only setting is enabled. Pointing every platform at Webpack
      // collapses the server set to the single web server requested here.
      config.exp.ios = { ...config.exp.ios, bundler: "webpack" };
      config.exp.android = { ...config.exp.android, bundler: "webpack" };
      return config;
    },
  };
  const { resolveOptionsAsync } = require(
    path.join(cliRoot, "build/src/start/resolveOptions.js"),
  );
  const { startAsync } = require(
    path.join(cliRoot, "build/src/start/startAsync.js"),
  );

  const options = await resolveOptionsAsync(projectRoot, {
    "--localhost": true,
    "--max-workers": 2,
    "--port": requestedPort,
    "--web": true,
  });

  await startAsync(projectRoot, options, { webOnly: true });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
