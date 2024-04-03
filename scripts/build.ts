import { encodeBase64 } from "@std/encoding/base64";
import { minify } from "terser";

const name = "deno_lz4";

const encoder = new TextEncoder();

function requires(...executables: string[]) {
  const where = Deno.build.os === "windows" ? "where" : "which";

  for (const executable of executables) {
    const command = new Deno.Command(where);
    const { success } = command.outputSync();

    if (success) {
      err(`Could not find required build tool ${executable}`);
    }
  }
}

function run(msg: string, cmd: string[]) {
  log(msg);

  const command = new Deno.Command(cmd[0], { args: cmd.slice(1) });
  const { success } = command.outputSync();

  if (!success) {
    err(`${msg} failed`);
  }
}

function log(text: string): void {
  console.log(`[log] ${text}`);
}

function err(text: string): never {
  console.log(`[err] ${text}`);
  return Deno.exit(1);
}

requires("rustup", "rustc", "cargo", "wasm-pack", "wasm-opt");

if (!(await Deno.stat("Cargo.toml")).isFile) {
  err(`the build script should be executed in the "${name}" root`);
}

run(
  "building using wasm-pack",
  ["wasm-pack", "build", "--target", "web", "--release"],
);

const wasm = await Deno.readFile(`pkg/${name}_bg.wasm`);
const encoded = encodeBase64(wasm);
log(
  `encoded wasm using base64, size increase: ${
    encoded.length -
    wasm.length
  } bytes`,
);

log("inlining wasm in js");
const source =
  `export const source = Uint8Array.from(atob("${encoded}"), c => c.charCodeAt(0));`;

const init = await Deno.readTextFile(`pkg/${name}.js`);

log("minifying js");
const output = await minify(`${source}${init}`, {
  mangle: { module: true },
  output: {
    preamble: "// deno-lint-ignore-file\n//deno-fmt-ignore-file",
  },
});

if (output.error) {
  err(`encountered error when minifying: ${output.error}`);
}

const reduction = new Blob([`${source}${init}`]).size -
  new Blob([output.code]).size;
log(`minified js, size reduction: ${reduction} bytes`);

log(`writing output to file ("wasm.js")`);
await Deno.writeFile("wasm.js", encoder.encode(output.code));

const outputFile = await Deno.stat("wasm.js");
log(
  `output file ("wasm.js"), final size is: ${outputFile.size} bytes`,
);
