// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { compress, decompress } from "./mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

function encode(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}

Deno.test({
  name: "compress",
  fn: () => {
    // empty
    assertEquals(compress(encode("")), [0]);
    // 'X' x64 times
    assertEquals(compress(encode("X".repeat(64))), [31, 88, 1, 0, 44, 0]);
  },
});

Deno.test({
  name: "decompress",
  fn: () => {
    // empty
    assertEquals(decompress(Uint8Array.from([0])), []);
    // 'X' x64 times
    assertEquals(
      decompress(Uint8Array.from([31, 88, 1, 0, 44, 0])),
      encode("X".repeat(64)),
    );
  },
});
