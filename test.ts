// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.67.0/testing/asserts.ts";

import { compress, decompress } from "./mod.ts";

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

    // errors
    assertThrows(() => decompress(Uint8Array.from([16, 97, 2, 0])));
    assertThrows(() => decompress(Uint8Array.from([64, 97, 1, 0])));
  },
});
