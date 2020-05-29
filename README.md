# deno_lz4

[![stars](https://img.shields.io/github/stars/denosaurs/deno_lz4)](https://github.com/denosaurs/deno_lz4/stargazers)
[![workflow](https://img.shields.io/github/workflow/status/denosaurs/deno_lz4/ci)](https://github.com/denosaurs/deno_lz4/actions)
[![releases](https://img.shields.io/github/v/release/denosaurs/deno_lz4)](https://github.com/denosaurs/deno_lz4/releases/latest/)
[![deno version](https://img.shields.io/badge/deno-^1.0.2-informational)](https://github.com/denoland/deno)
[![deno doc](https://img.shields.io/badge/deno-doc-informational)](https://doc.deno.land/https/deno.land/x/deno_lz4/mod.ts)
[![Discord](https://img.shields.io/discord/713043818806509608)](https://discord.gg/shHG8vg)
[![license](https://img.shields.io/github/license/denosaurs/deno_lz4)](https://github.com/denosaurs/deno_lz4/blob/master/LICENSE)
[![issues](https://img.shields.io/github/issues/denosaurs/deno_lz4)](https://github.com/denosaurs/deno_lz4/issues)

This module provides [lz4](https://en.wikipedia.org/wiki/LZ4_(compression_algorithm)) support for deno and the web by providing [simple bindings](src/lib.rs) using [lz4-compression](https://github.com/johannesvollmer/lz4-compression-rs) compiled to webassembly.

## Usage

### Compression

```ts
import { compress } from "https://deno.land/x/lz4/mod.ts";
const text = new TextEncoder().encode("X".repeat(64));
console.log(text.length);                   // 64 Bytes
console.log(compress(text).length);         // 6  Bytes
```

### Decompression

```ts
import { decompress } from "https://deno.land/x/lz4/mod.ts";
const compressed = Uint8Array.from([ 31, 88, 1, 0, 44, 0 ]);
console.log(compressed.length);             // 6 Bytes
console.log(decompress(compressed).length); // 64 Bytes
```

## Other

### Contribution

Pull request, issues and feedback are very welcome. Code style is formatted with `deno fmt` and commit messages are done following [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) spec.

### Licence

Copyright 2020-present, the denosaurs team. All rights reserved. MIT license.
