/**
 * Deflate values into the format of fields.
 * @param fields The size of fields expressed in array of numbers.
 * @param values The values of fields expressed in array of numbers. Maximum size of value depends on the sizes of fields and this will be checked in runtime.
 * @returns An encoded bits.
 */
export const deflate = (fields: number[], values: number[]) => {
	const len = fields.length;

	if (len !== values.length) {
		throw new Error('The number of fields and values do not match!');
	}

	let slots = 0;
	let bits = 0;

	for (let i = 0; i < len; i++) {
		const maxValue = (2 ** fields[i]) - 1;

		if (values[i] > maxValue) {
			throw new Error(`Exceeded maximum expressible number in slot! max=${maxValue} value=${values[i]}`);
		}

		// eslint-disable-next-line no-bitwise
		bits |= values[i] << slots;
		slots += fields[i];

		if (slots > 32) {
			throw new Error(`Exceeded maximum expressible number! max=32 count=${slots}`);
		}
	}

	return bits;
};

/**
 * Deflate but DO NOT CHECK anything in runtime.
 * @param fields The size of fields expressed in array of numbers.
 * @param values The values of fields expressed in array of numbers.
 * @returns An encoded bits.
 */
export const deflateUnsafe = (fields: number[], values: number[]) => {
	let slots = 0;
	let bits = 0;

	for (let i = 0; i < fields.length; i++) {
		// eslint-disable-next-line no-bitwise
		bits |= values[i] << slots;
		slots += fields[i];
	}

	return bits;
};

/**
 * Deflate bigint values into the format of fields.
 * @param fields The size of fields expressed in array of numbers.
 * @param values The values of fields expressed in array of numbers. Maximum size of value depends on the sizes of fields and this will be checked in runtime.
 * @returns An encoded bits.
 */
export const deflateBigInt = (fields: bigint[], values: bigint[]) => {
	const len = fields.length;

	if (len !== values.length) {
		throw new Error('The number of fields and values do not match!');
	}

	let slots = 0n;
	let bits = 0n;

	for (let i = 0; i < len; i++) {
		const maxValue = BigInt((2n ** fields[i]) - 1n);

		if (values[i] > maxValue) {
			throw new Error(`Exceeded maximum expressible number in slot! max=${maxValue} value=${values[i]}`);
		}

		// eslint-disable-next-line no-bitwise
		bits |= values[i] << slots;
		slots += fields[i];

		if (slots > 64) {
			throw new Error(`Exceeded maximum expressible number! max=64 count=${slots}`);
		}
	}

	return bits;
};

/**
 * Deflate bigint but DO NOT CHECK anything in runtime.
 * @param fields The size of fields expressed in array of numbers.
 * @param values The values of fields expressed in array of numbers.
 * @returns An encoded bits.
 */
export const deflateBigIntUnsafe = (fields: bigint[], values: bigint[]) => {
	let slots = 0n;
	let bits = 0n;

	for (let i = 0; i < fields.length; i++) {
		// eslint-disable-next-line no-bitwise
		bits |= values[i] << slots;
		slots += fields[i];
	}

	return bits;
};

/**
 * Inflate bits by following fields.
 * @param fields The size of fields expressed in array of numbers.
 * @param bits The bits storing data in number.
 * @returns A decoded array of numbers.
 */
export const inflate = (fields: number[], bits: number) => {
	const values: number[] = [];

	let slots = 0;

	for (const field of fields) {
		// eslint-disable-next-line no-bitwise
		values.push((bits & (((2 ** field) - 1) << slots)) >>> slots);

		slots += field;
	}

	return values;
};

/**
 * Inflate bigint bits by following fields.
 * @param fields The size of fields expressed in array of numbers.
 * @param bits The bits storing data in number.
 * @returns A decoded array of numbers.
 */
export const inflateBigInt = (fields: bigint[], bits: bigint) => {
	const values: bigint[] = [];

	let slots = 0n;

	for (const field of fields) {
		// eslint-disable-next-line no-bitwise
		values.push((bits & (((2n ** field) - 1n) << slots)) >> slots);

		slots += field;
	}

	return values;
};
