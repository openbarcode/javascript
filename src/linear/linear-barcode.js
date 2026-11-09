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

/**
 * Base class for linear (one-dimensional) barcodes.
 *
 * Subclasses implement encode(input), which validates the input and returns
 * { code, modules }: the normalized code text (including any check digit)
 * and the module sequence, where 1 is a bar and 0 is a space.
 *
 * All state is per instance and private, so instances never share arrays.
 */
export class LinearBarcode {
  #code;
  #modules;

  /**
   * @param {string} input barcode data, validated by the subclass
   * @throws {Error} if the input is not valid for this symbology
   */
  constructor(input) {
    const { code, modules } = this.encode(input);
    this.#code = code;
    this.#modules = modules;
  }

  /**
   * Validates the input and produces the module sequence. Overridden by subclasses.
   *
   * @param {string} input
   * @returns {{code: string, modules: number[]}}
   */
  encode(input) {
    throw new TypeError('LinearBarcode is abstract; use UPC, EAN or Code39');
  }

  /**
   * @returns {string} the full code text, including any computed check digit
   */
  code() {
    return this.#code;
  }

  /**
   * @returns {number[]} a new array of 0/1 modules (1 = bar, 0 = space)
   */
  barcode() {
    return this.#modules.slice();
  }
}
