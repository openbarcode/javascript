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

/*
 * GS1 helpers shared by UPC-A and EAN-13: check digit, input validation and
 * the EAN-13 module encoding.
 *
 * Every digit is a 7-module pattern. The L table is the base table. The R
 * patterns are the bitwise complement of L, and the G patterns are R reversed.
 */

const L_PATTERNS = [
  '0001101', '0011001', '0010011', '0111101', '0100011',
  '0110001', '0101111', '0111011', '0110111', '0001011',
];

const toBits = (pattern) => Array.from(pattern, Number);

const L = L_PATTERNS.map(toBits);
const R = L.map((bits) => bits.map((bit) => 1 - bit));
const G = R.map((bits) => [...bits].reverse());

// Parity of the six left-hand EAN-13 digits (positions 2-7), selected by the leading digit.
const PARITY = [
  'LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG',
  'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL',
];

const GUARD = [1, 0, 1];
const CENTER = [0, 1, 0, 1, 0];

/**
 * Computes the GS1 mod-10 check digit for a string of digits (without the check digit).
 * The rightmost digit has weight 3, and the weights alternate 3, 1 moving left.
 *
 * @param {string} body digits only
 * @returns {number} check digit, 0-9
 */
export function checkDigit(body) {
  let sum = 0;
  for (let i = 0; i < body.length; i++) {
    const weight = (body.length - i) % 2 === 1 ? 3 : 1;
    sum += Number(body[i]) * weight;
  }
  return (10 - (sum % 10)) % 10;
}

/**
 * Validates a numeric GS1 code that is either `bodyLength` digits (the check
 * digit is computed) or `bodyLength + 1` digits (the check digit is verified).
 *
 * @param {string} input
 * @param {number} bodyLength number of digits before the check digit
 * @param {string} name symbology name used in error messages, e.g. "UPC-A"
 * @returns {string} the full code, with the check digit
 * @throws {TypeError|Error} if the input is not a valid code
 */
export function completeGtin(input, bodyLength, name) {
  if (typeof input !== 'string') {
    throw new TypeError(`${name} code must be a string`);
  }
  const hasCheckDigit = input.length === bodyLength + 1;
  if (input.length !== bodyLength && !hasCheckDigit) {
    throw new Error(`${name} code must be ${bodyLength} or ${bodyLength + 1} digits, got ${input.length}`);
  }
  if (!/^[0-9]+$/.test(input)) {
    throw new Error(`${name} code must contain digits only`);
  }
  if (!hasCheckDigit) {
    return input + checkDigit(input);
  }
  const expected = checkDigit(input.slice(0, bodyLength));
  const actual = Number(input[bodyLength]);
  if (actual !== expected) {
    throw new Error(`${name} check digit mismatch: expected ${expected}, got ${actual}`);
  }
  return input;
}

/**
 * Encodes a full 13-digit EAN-13 code (check digit included) as modules.
 *
 * @param {string} digits 13 digits
 * @returns {number[]} 95 modules
 */
export function encodeEan13(digits) {
  const parity = PARITY[Number(digits[0])];
  const modules = [...GUARD];
  for (let i = 1; i <= 6; i++) {
    const table = parity[i - 1] === 'L' ? L : G;
    modules.push(...table[Number(digits[i])]);
  }
  modules.push(...CENTER);
  for (let i = 7; i <= 12; i++) {
    modules.push(...R[Number(digits[i])]);
  }
  modules.push(...GUARD);
  return modules;
}
