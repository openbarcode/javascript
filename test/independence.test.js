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

// Regression test: the Python port kept a class-level `bars = []` that every instance
// appended to. Instances must not share any module state.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Code39, EAN, UPC } from 'openbarcode/linear';

test('UPC instances do not share module arrays', () => {
  const first = new UPC('03600029145');
  const before = first.barcode();

  const second = new UPC('01234567890');
  assert.equal(first.barcode().length, 95);
  assert.deepEqual(first.barcode(), before);
  assert.notDeepEqual(second.barcode(), before);
  assert.equal(second.barcode().length, 95);
});

test('EAN and Code39 instances do not share module arrays', () => {
  const ean1 = new EAN('400638133393');
  const ean2 = new EAN('4006381333931');
  const c39a = new Code39('ABC');
  const expectedEan = ean1.barcode().join('');
  const expectedC39 = c39a.barcode().join('');

  new Code39('XYZ');
  new EAN('590123412345');
  new UPC('01234567890');

  assert.equal(ean1.barcode().join(''), expectedEan);
  assert.equal(ean2.barcode().join(''), expectedEan);
  assert.equal(c39a.barcode().join(''), expectedC39);
  assert.equal(c39a.barcode().length, 5 * 12 + 4);
});

test('barcode() returns a copy, so callers cannot change an instance', () => {
  const bc = new UPC('03600029145');
  const modules = bc.barcode();
  modules.fill(0);
  modules.push(1);

  assert.equal(bc.barcode().length, 95);
  assert.equal(bc.barcode().includes(1), true);
  assert.notEqual(bc.barcode().join(''), '0'.repeat(95));
});

test('repeated barcode() calls on one instance return equal, independent arrays', () => {
  const bc = new Code39('CODE39');
  const a = bc.barcode();
  const b = bc.barcode();
  assert.notEqual(a, b);
  assert.deepEqual(a, b);
});
