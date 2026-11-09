<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/branding/open-barcode-logo-dark.svg">
    <img src="assets/branding/open-barcode-logo.svg" alt="Open Barcode by Floms" width="420">
  </picture>
</p>

<p align="center"><em>Barcodes, made open.</em></p>

# Open Barcode for JavaScript

Barcode generation library for JavaScript (Code 39, EAN, UPC).

The library has no runtime dependencies. It runs on Node.js 18 and later and in modern browsers, as an ES module.

## Install

```sh
npm install openbarcode
```

## Usage

The package is ES-module only. Use `import` in Node.js, or `<script type="module">` in the browser. `require()` is not supported.

In Node.js:

```js
import { UPC, EAN, Code39 } from 'openbarcode/linear';

const upc = new UPC('03600029145');  // 11 digits: the check digit is computed
upc.code();                          // '036000291452'
upc.barcode();                       // [1, 0, 1, 0, 0, 0, 1, 1, ...] (95 modules)

new EAN('4006381333931');            // 13 digits: the check digit is verified
new Code39('Hello World');           // stored as 'HELLO WORLD'
```

In the browser, import the module directly from a CDN:

```html
<script type="module">
  import { UPC } from 'https://cdn.jsdelivr.net/npm/openbarcode@2.0.0/src/linear/index.js';

  const modules = new UPC('03600029145').barcode();
  // Draw each module: 1 = bar, 0 = space.
</script>
```

### API

The linear (one-dimensional) barcodes are exported from `openbarcode/linear`.

- `new UPC(code)`: UPC-A. Accepts 11 digits (the check digit is computed) or 12 digits (the check digit is verified).
- `new EAN(code)`: EAN-13. Accepts 12 digits (the check digit is computed) or 13 digits (the check digit is verified).
- `new Code39(text)`: Code 39. Lowercase letters are uppercased. Allowed characters are `0-9`, `A-Z`, space, `-`, `.`, `$`, `/`, `+` and `%`.
- `barcode()`: returns a new array of `0` and `1` values, where `1` is a bar and `0` is a space.
- `code()`: returns the full code text, including the check digit.

Invalid input throws an `Error`. A non-string argument throws a `TypeError`.

## Testing

```sh
npm test
```

The tests use Node's built-in test runner (`node --test`), so there is nothing to install beyond the package itself. CI runs them on Node.js 18, 20 and 22.

## Open Barcode in other languages

Open Barcode is available in several languages:

- Java: https://github.com/openbarcode/java
- C#: https://github.com/openbarcode/csharp
- Python: https://github.com/openbarcode/python
- PHP: https://github.com/openbarcode/php
- JavaScript: https://github.com/openbarcode/javascript

Project homepage: https://openbarcode.dev

This repository was split from the original multi-language project at
https://github.com/floms/Open-Barcode. The commit history was preserved
with git-filter-repo; commit hashes differ from the original.

Copyright 2013 Floms, LLC (Yoel Nunez)

Copyright 2026 Floms, Inc.

Licensed under the Apache License, Version 2.0. See LICENSE.md for details.
