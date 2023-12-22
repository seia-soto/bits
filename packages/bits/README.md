# bits

`bits` is a simple library to store data in a number.

## Usage

```typescript
/**
 * Deflate values into the format of fields.
 * @param fields The size of fields expressed in array of numbers.
 * @param values The values of fields expressed in array of numbers. Maximum size of value depends on the sizes of fields and this will be checked in runtime.
 * @returns An encoded bits.
 */
export type deflate = (fields: number[], values: number[]): number

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
 * @param bits The bits storing data in number.
 * @returns A decoded array of numbers.
 */
export type inflate = (fields: number[], bits: number) => number
```

BigInt APIs:

```typescript
/**
 * Deflate bigint values into the format of fields.
 * @param fields The size of fields expressed in array of numbers.
 * @param values The values of fields expressed in array of numbers. Maximum size of value depends on the sizes of fields and this will be checked in runtime.
 * @returns An encoded bits.
 */
export type deflateBigInt = (fields: bigint[], values: bigint[]): bigint

/**
 * Deflate bigint but DO NOT CHECK anything in runtime.
 * @param fields The size of fields expressed in array of numbers.
 * @param values The values of fields expressed in array of numbers.
 * @returns An encoded bits.
 */
export type deflateBigIntUnsafe = (fields: bigint[], values: bigint[]): bigint

/**
 * Inflate bigint bits by following fields.
 * @param fields The size of fields expressed in array of numbers.
 * @param bits The bits storing data in number.
 * @returns A decoded array of numbers.
 */
export type inflateBigInt = (fields: bigint[], bits: bigint): bigint[]
```
