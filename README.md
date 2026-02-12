# tafel-plugin-roman

Roman numeral converter for [Tafel](https://github.com/bsteinig/Tafel). Convert between arabic numbers and roman numerals (1–3999).

## Install

Search for **"roman"** in Tafel's Plugin Store (`Plugins → Browse`) and click Install.

## Usage

| Input | Output |
|---|---|
| `42 to roman` | `XLII` |
| `roman 2025` | `MMXXV` |
| `XLII to dec` | `42` |
| `XIV` | `14` |

### Supported syntax

- **To roman:** `<number> to roman`, `<number> in roman`, `roman <number>`
- **To decimal:** `<roman> to dec`, `<roman> to decimal`, `<roman> in arabic`
- **Auto-detect:** Type any valid roman numeral (e.g. `MCMXCIX`) and it converts automatically

Valid range is **1–3999** (standard roman numeral system).

## License

MIT
