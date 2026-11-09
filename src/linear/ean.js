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
import { completeGtin, encodeEan13 } from './gs1.js';

/**
 * EAN-13 barcode: 12 data digits plus an optional check digit (13 digits in total).
 *
 * @example
 * new EAN('400638133393').code(); // '4006381333931'
 */
export class EAN extends LinearBarcode {
  encode(input) {
    const code = completeGtin(input, 12, 'EAN-13');
    return { code, modules: encodeEan13(code) };
  }
}
