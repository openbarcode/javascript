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

import { LinearBarcode } from './linear-barcode.js';

/*
 * Code 39 symbols. Each symbol has 9 elements (5 bars and 4 spaces), 3 of
 * them wide. Elements alternate bar, space, bar, ... starting with a bar.
 * 'n' is a narrow element (1 module) and 'w' is a wide element (2 modules).
 * '*' is the start and stop character and cannot appear in the data.
 */
const PATTERNS = {
  '0': 'nnnwwnwnn', '1': 'wnnwnnnnw', '2': 'nnwwnnnnw', '3': 'wnwwnnnnn', '4': 'nnnwwnnnw',
  '5': 'wnnwwnnnn', '6': 'nnwwwnnnn', '7': 'nnnwnnwnw', '8': 'wnnwnnwnn', '9': 'nnwwnnwnn',
  'A': 'wnnnnwnnw', 'B': 'nnwnnwnnw', 'C': 'wnwnnwnnn', 'D': 'nnnnwwnnw', 'E': 'wnnnwwnnn',
  'F': 'nnwnwwnnn', 'G': 'nnnnnwwnw', 'H': 'wnnnnwwnn', 'I': 'nnwnnwwnn', 'J': 'nnnnwwwnn',
  'K': 'wnnnnnnww', 'L': 'nnwnnnnww', 'M': 'wnwnnnnwn', 'N': 'nnnnwnnww', 'O': 'wnnnwnnwn',
  'P': 'nnwnwnnwn', 'Q': 'nnnnnnwww', 'R': 'wnnnnnwwn', 'S': 'nnwnnnwwn', 'T': 'nnnnwnwwn',
  'U': 'wwnnnnnnw', 'V': 'nwwnnnnnw', 'W': 'wwwnnnnnn', 'X': 'nwnnwnnnw', 'Y': 'wwnnwnnnn',
  'Z': 'nwwnwnnnn', '-': 'nwnnnnwnw', '.': 'wwnnnnwnn', ' ': 'nwwnnnwnn', '$': 'nwnwnwnnn',
  '/': 'nwnwnnnwn', '+': 'nwnnnwnwn', '%': 'nnnwnwnwn', '*': 'nwnnwnwnn',
};

/**
 * Converts one Code 39 symbol to its 12 modules (no gap).
 */
function symbolModules(char) {
  const pattern = PATTERNS[char];
  const modules = [];
  for (let k = 0; k < pattern.length; k++) {
    const bar = k % 2 === 0 ? 1 : 0;
    const width = pattern[k] === 'w' ? 2 : 1;
    for (let j = 0; j < width; j++) {
      modules.push(bar);
    }
  }
  return modules;
}

/**
 * Code 39 barcode. Input is case-insensitive (it is uppercased) and may contain
 * 0-9, A-Z, space, and - . $ / + %.
 *
 * @example
 * new Code39('hello').code(); // 'HELLO'
 */
export class Code39 extends LinearBarcode {
  encode(input) {
    if (typeof input !== 'string') {
      throw new TypeError('Code 39 code must be a string');
    }
    if (input.length === 0) {
      throw new Error('Code 39 code must not be empty');
    }

    const original = Array.from(input);
    const chars = original.map((ch, index) => {
      const upper = ch.toUpperCase();
      if (upper.length !== 1 || upper === '*' || !Object.hasOwn(PATTERNS, upper)) {
        throw new Error(`Code 39 does not support character "${ch}" at position ${index + 1}`);
      }
      return upper;
    });

    const code = chars.join('');
    // One narrow gap between adjacent symbols; none before the start or after the stop.
    const modules = [];
    ['*', ...chars, '*'].forEach((char, index) => {
      if (index > 0) {
        modules.push(0);
      }
      modules.push(...symbolModules(char));
    });
    return { code, modules };
  }
}
