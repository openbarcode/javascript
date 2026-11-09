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
import { checkDigit, completeGtin, encodeEan13 } from '../src/linear/gs1.js';

test('checkDigit: GS1 mod-10 values, including the cross-language vectors', () => {
  assert.equal(checkDigit('03600029145'), 2); // UPC-A
  assert.equal(checkDigit('400638133393'), 1); // EAN-13
  assert.equal(checkDigit('00000000000'), 0);
  assert.equal(checkDigit('00000000001'), 7);
  assert.equal(checkDigit('9999999999'), 0);
});

test('completeGtin: computes the check digit for body-length input', () => {
  assert.equal(completeGtin('03600029145', 11, 'UPC-A'), '036000291452');
});

test('completeGtin: accepts a correct full code and rejects a wrong check digit', () => {
  assert.equal(completeGtin('036000291452', 11, 'UPC-A'), '036000291452');
  assert.throws(() => completeGtin('036000291459', 11, 'UPC-A'), /UPC-A check digit mismatch: expected 2, got 9/);
});

test('encodeEan13: every leading digit yields 95 modules with 3-5-3 guards', () => {
  for (let lead = 0; lead <= 9; lead++) {
    const modules = encodeEan13(`${lead}400638133391`);
    assert.equal(modules.length, 95);
    assert.deepEqual(modules.slice(0, 3), [1, 0, 1]);
    assert.deepEqual(modules.slice(45, 50), [0, 1, 0, 1, 0]);
    assert.deepEqual(modules.slice(92), [1, 0, 1]);
  }
});
