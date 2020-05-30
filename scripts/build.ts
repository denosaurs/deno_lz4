// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { encode } from "https://deno.land/std@0.54.0/encoding/base64.ts";
import Terser from "https://cdn.pika.dev/terser@^4.7.0";

const encoder = new TextEncoder();

const toml = await Deno.stat("Cargo.toml");
if (!toml.isFile) {
  console.log(
    `[!] Error: the build script should be executed in the "deno_lz4" root`,
  );
  Deno.exit(1);
}

console.log("[!] building using wasm-pack");
const pack = Deno.run(
  { cmd: ["wasm-pack", "build", "--target", "web", "--release"] },
);
await pack.status();

console.log("[!] inlining wasm in js");
const wasm = await Deno.readFile("pkg/deno_lz4_bg.wasm");

const source = `export const source = Uint8Array.from(atob("${
  encode(wasm)
}"), c => c.charCodeAt(0));`;

const init = await Deno.readTextFile("pkg/deno_lz4.js");

const output = Terser.minify(`${source}\n${init}`, {
  mangle: {
    module: true,
    reserved: ["decode"],
  },
  output: {
    preamble: "//deno-fmt-ignore-file",
  },
});
console.log(
  `[!] minified js, size reduction: ${new Blob([(`${source}\n${init}`)]).size -
    new Blob([output.code]).size} bytes`,
);

console.log(`[!] writing output to file ("wasm.js")`);
await Deno.writeFile(
  "wasm.js",
  encoder.encode(output.code),
);

const outputFile = await Deno.stat("wasm.js");
console.log(`[!] output file ("wasm.js") size is: ${outputFile.size} bytes`);
