/**
 * Copyright 2013 Floms, LLC (Yoel Nunez)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Code39 } from 'openbarcode/linear';

// Cross-language vectors. Each symbol is 12 modules. A single narrow (0) gap separates adjacent
// symbols, including the start and stop characters, with no gap before the start or after the stop.
const bits = (bc) => bc.barcode().join('');

const CODE39_VECTOR_BITS =
  '1001011011010110110100101011010110100101010110010110110101100101011011001010101011001011010100101101101';
const HELLO_WORLD_VECTOR_BITS =
  '100101101101011010100110101101011001010101101010011010110101001101101011010010100110101101011001101010101101011010010110101011001010110101001101010110010110100101101101';

test('Code 39 vector: CODE39 encodes 103 modules', () => {
  const bc = new Code39('CODE39');
  assert.equal(bc.code(), 'CODE39');
  assert.equal(bc.barcode().join(''), CODE39_VECTOR_BITS);
  assert.equal(bc.barcode().length, 103);
  assert.equal(bits(bc).slice(0, 30), CODE39_VECTOR_BITS.slice(0, 30));
  assert.equal(bits(bc).slice(-30), CODE39_VECTOR_BITS.slice(-30));
});

test('Code 39 vector: HELLO WORLD (space is supported) encodes 168 modules', () => {
  const bc = new Code39('HELLO WORLD');
  assert.equal(bc.code(), 'HELLO WORLD');
  assert.equal(bc.barcode().join(''), HELLO_WORLD_VECTOR_BITS);
  assert.equal(bc.barcode().length, 168);
  assert.equal(bits(bc).slice(0, 30), HELLO_WORLD_VECTOR_BITS.slice(0, 30));
  assert.equal(bits(bc).slice(-30), HELLO_WORLD_VECTOR_BITS.slice(-30));
});

test('Code 39: lowercase input is uppercased and encodes the same as uppercase', () => {
  const lower = new Code39('hello world');
  assert.equal(lower.code(), 'HELLO WORLD');
  assert.equal(lower.barcode().join(''), HELLO_WORLD_VECTOR_BITS);
});

test('Code 39: every supported character encodes without error', () => {
  const all = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%';
  const modules = new Code39(all).barcode();
  // 12 modules per symbol, plus one gap between each pair of adjacent symbols.
  assert.equal(modules.length, (all.length + 2) * 12 + (all.length + 1));
});

test('Code 39: rejects unsupported characters and reports the position', () => {
  assert.throws(() => new Code39('AB@C'), /Code 39 does not support character "@" at position 3/);
  assert.throws(() => new Code39('a_b'), /Code 39 does not support character "_" at position 2/);
});

test('Code 39: rejects the start/stop character "*" inside the data', () => {
  assert.throws(() => new Code39('A*B'), /does not support character "\*" at position 2/);
});

test('Code 39: rejects an empty string', () => {
  assert.throws(() => new Code39(''), /Code 39 code must not be empty/);
});

test('Code 39: rejects non-string input', () => {
  assert.throws(() => new Code39(12345), TypeError);
});
