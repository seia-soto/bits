# bits

`bits` is a simple library to store data in a number.

## Usage

```typescript
export const maxSlots = Number.MAX_SAFE_INTEGER.toString(2).length;

/**
 * Deflate values into the format of fields.
 * @param fields The size of fields expressed in array of numbers.
 * @param values The values of fields expressed in array of numbers. Maximum size of value depends on the sizes of fields and this will be checked in runtime.
 * @returns An encoded bits.
 */
export type deflate = (fields: number[], values: number[]) => number

/**
 * Deflate but DO NOT CHECK anything in runtime.
 * @param fields The size of fields expressed in array of numbers.
 * @param values The values of fields expressed in array of numbers.
 * @returns An encoded bits.
 */
export type deflateUnsafe = (fields: number[], values: number[]) => number

/**
 * Inflate bits by following fields.
 * @param fields The size of fields expressed in array of numbers.
 * @param values The values of fields expressed in array of numbers.
 * @returns A decoded array of numbers.
 */
export const inflate = (fields: number[], bits: number) => number
```
