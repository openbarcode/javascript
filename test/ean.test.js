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
import { EAN, UPC } from '@openbarcode/javascript/linear';
import { encodeEan13 } from '../src/linear/gs1.js';

// Cross-language vector: 12 data digits, check digit 1 -> 4006381333931, 95 modules.
const EAN_VECTOR_BITS =
  '10100011010100111010111101111010001001011001101010100001010000101000010111010010000101100110101';

test('EAN-13 vector: 12 digits compute the check digit and encode 95 modules', () => {
  const bc = new EAN('400638133393');
  assert.equal(bc.code(), '4006381333931');
  assert.equal(bc.barcode().join(''), EAN_VECTOR_BITS);
  assert.equal(bc.barcode().length, 95);
});

test('EAN-13: a 13-digit code with a correct check digit gives the same modules', () => {
  const bc = new EAN('4006381333931');
  assert.equal(bc.code(), '4006381333931');
  assert.equal(bc.barcode().join(''), EAN_VECTOR_BITS);
});

test('EAN-13: a 13-digit code with a wrong check digit throws and names EAN-13', () => {
  assert.throws(() => new EAN('4006381333939'), /EAN-13 check digit mismatch: expected 1, got 9/);
});

test('EAN-13: rejects lengths other than 12 or 13, and names EAN-13 in the message', () => {
  assert.throws(() => new EAN('40063813339'), /EAN-13 code must be 12 or 13 digits, got 11/);
  assert.throws(() => new EAN('40063813339312'), /EAN-13 code must be 12 or 13 digits, got 14/);
});

test('EAN-13: rejects non-digit characters', () => {
  assert.throws(() => new EAN('40063813339A'), /EAN-13 code must contain digits only/);
  assert.throws(() => new EAN('4006381333 31'), /EAN-13 code must contain digits only/);
});

test('EAN-13: a leading digit 0 encodes the same modules as UPC-A', () => {
  const upc = new UPC('03600029145');
  const ean = new EAN('0036000291452');
  assert.equal(ean.barcode().join(''), upc.barcode().join(''));
});

test('EAN-13: the leading digit selects the left-hand parity, so different leads differ', () => {
  const rest = '40063813339';
  const zero = encodeEan13(`0${rest}1`);
  const one = encodeEan13(`1${rest}1`);
  // The left-hand digits use different L/G patterns, so the left half changes.
  assert.notDeepEqual(zero.slice(3, 45), one.slice(3, 45));
  // The right-hand half depends only on the right-hand digits, which are identical here.
  assert.deepEqual(zero.slice(50, 92), one.slice(50, 92));
});
