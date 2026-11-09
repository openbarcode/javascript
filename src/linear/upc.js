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
 * UPC-A barcode: 11 data digits plus an optional check digit (12 digits in total).
 *
 * @example
 * new UPC('03600029145').code(); // '036000291452'
 */
export class UPC extends LinearBarcode {
  encode(input) {
    const code = completeGtin(input, 11, 'UPC-A');
    // UPC-A is EAN-13 with a leading zero, which selects the all-L left-hand pattern.
    return { code, modules: encodeEan13(`0${code}`) };
  }
}
