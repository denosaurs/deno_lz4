// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

use lz4_compression::prelude::compress;
use lz4_compression::prelude::decompress;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub fn lz4_compress(input: &[u8]) -> Vec<u8> {
    compress(input)
}

#[wasm_bindgen]
pub fn lz4_decompress(input: &[u8]) -> Vec<u8> {
    decompress(input).unwrap()
}
