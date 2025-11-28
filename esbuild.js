const esbuild = require("esbuild");

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
  name: "esbuild-problem-matcher",

  setup(build) {
    build.onStart(() => {
      console.log("[watch] build started");
    });
    build.onEnd((result) => {
      result.errors.forEach(({ text, location }) => {
        console.error(`✘ [ERROR] ${text}`);
        console.error(
          `    ${location.file}:${location.line}:${location.column}:`
        );
      });
      console.log("[watch] build finished");
    });
  },
};

async function main() {
  const defaultSettings = {
    bundle: true,
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    logLevel: "silent",
  };
  const client = await esbuild.context({
    ...defaultSettings,
    entryPoints: ["src/client/main.ts"],
    format: "esm",
    platform: "browser",
    outfile: "dist/main.js",
  });
  const ctx = await esbuild.context({
    ...defaultSettings,
    entryPoints: ["src/extension.ts"],
    format: "cjs",
    platform: "node",
    outfile: "dist/extension.js",
    external: ["vscode"],
    plugins: [
      /* add to the end of plugins array */
      esbuildProblemMatcherPlugin,
    ],
  });
  if (watch) {
    await Promise.all([client.watch(), ctx.watch()]);
  } else {
    await Promise.all([client.rebuild(), ctx.rebuild()]);
    await Promise.all([client.dispose(), ctx.dispose()]);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
