export const maxSlots = Number.MAX_SAFE_INTEGER.toString(2).length;

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

		if (slots > maxSlots) {
			throw new Error(`Exceeded maximum expressible number! max=${maxSlots} count=${slots}`);
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
 * Inflate bits by following fields.
 * @param fields The size of fields expressed in array of numbers.
 * @param values The values of fields expressed in array of numbers.
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
