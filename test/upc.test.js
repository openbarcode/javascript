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
import { UPC } from '@openbarcode/javascript/linear';

// Cross-language vector: 11 data digits, check digit 2 -> 036000291452, 95 modules.
const UPC_VECTOR_BITS =
  '10100011010111101010111100011010001101000110101010110110011101001100110101110010011101101100101';

test('UPC-A vector: 11 digits compute the check digit and encode 95 modules', () => {
  const bc = new UPC('03600029145');
  assert.equal(bc.code(), '036000291452');
  assert.equal(bc.barcode().join(''), UPC_VECTOR_BITS);
  assert.equal(bc.barcode().length, 95);
});

test('UPC-A: a 12-digit code with a correct check digit gives the same modules', () => {
  const bc = new UPC('036000291452');
  assert.equal(bc.code(), '036000291452');
  assert.equal(bc.barcode().join(''), UPC_VECTOR_BITS);
});

test('UPC-A: a 12-digit code with a wrong check digit throws', () => {
  assert.throws(() => new UPC('036000291453'), /UPC-A check digit mismatch: expected 2, got 3/);
});

test('UPC-A: barcode() returns numbers that are 0 or 1', () => {
  const modules = new UPC('03600029145').barcode();
  assert.ok(modules.every((m) => m === 0 || m === 1));
});

test('UPC-A: rejects lengths other than 11 or 12, and names UPC-A in the message', () => {
  assert.throws(() => new UPC('0360002914'), /UPC-A code must be 11 or 12 digits, got 10/);
  assert.throws(() => new UPC('0360002914523'), /UPC-A code must be 11 or 12 digits, got 13/);
  assert.throws(() => new UPC(''), /UPC-A code must be 11 or 12 digits, got 0/);
});

test('UPC-A: rejects non-digit characters', () => {
  assert.throws(() => new UPC('0360002914X'), /UPC-A code must contain digits only/);
  assert.throws(() => new UPC('036 00029145'), /UPC-A code must contain digits only/);
  assert.throws(() => new UPC('-3600029145'), /UPC-A code must contain digits only/);
});

test('UPC-A: rejects non-string input', () => {
  assert.throws(() => new UPC(3600029145), TypeError);
  assert.throws(() => new UPC(undefined), TypeError);
});
