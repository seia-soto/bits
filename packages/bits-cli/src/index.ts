#!/usr/bin/env tsx
import * as bits from 'bits';
import {existsSync, readFileSync} from 'fs';
import {parseArgs} from 'util';

const failSafe = <T extends () => unknown>(fn: T) => {
	try {
		return fn() as ReturnType<typeof fn>;
	} catch (error) {
		return error as Error;
	}
};

const readMappings = (content: string) => content.split('\n').map(line => {
	const [_name, _size] = line.split(':');
	const name = _name.trim();
	const size = parseInt(_size.trim(), 10);

	if (isNaN(size)) {
		throw new Error('Invalid number of field');
	}

	return [name, size] as const;
});

const {values} = parseArgs({
	options: {
		inflate: {
			type: 'boolean',
			short: 'i',
		},
		deflate: {
			type: 'boolean',
			short: 'd',
		},
		bigint: {
			type: 'boolean',
			short: 'e',
		},
		config: {
			type: 'string',
			short: 'c',
		},
		bin: {
			type: 'string',
			short: 'b',
		},
	},
});

if (!values.config) {
	console.error('The config file including the mapping of fields was not given: -c <file>');
	process.exit(1);
}

if (!values.bin) {
	console.error('The numeric data to inflate or deflate was not given: -b <data>');
	process.exit(1);
}

if (!values.inflate && !values.deflate) {
	console.error('The flag to inflate or deflate was not given: -d or -i');
	process.exit(1);
}

if (values.inflate && values.deflate) {
	console.error('You cannot inflate and deflate at the time: -d or -i');
	process.exit(1);
}

if (!existsSync(values.config)) {
	console.error('The given config file does not exists!');
	process.exit(1);
}

const mappings = failSafe(() => readMappings(readFileSync(values.config!, 'utf-8')));

if (mappings instanceof Error) {
	console.error('The given config file is not valid mapping file: <field-name>: <value>[\\n<field-name>: <value>...]');
	process.exit(1);
}

const fieldNames = mappings.map(mapping => mapping[0]);

// Handle bigint
if (values.bigint) {
	console.warn('(Experimental) Enabled bigint support!');

	const fieldSizesBigInt = mappings.map(mapping => BigInt(mapping[1]));

	if (values.inflate) {
		const bin = failSafe(() => BigInt(values.bin!));

		if (bin instanceof Error) {
			console.error('The given data is not valid bigint (radix of 10)!');
			process.exit(1);
		}

		const fieldValues = bits.inflateBigInt(fieldSizesBigInt, bin);

		for (let i = 0; i < fieldNames.length; i++) {
			console.log(`${fieldNames[i] ?? '(unknown)'}: ${fieldValues[i]}`);
		}
	} else {
		const bins = values.bin.split(',').map(_bin => {
			const bin = failSafe(() => BigInt(_bin));

			if (bin instanceof Error) {
				console.error('The given data is not valid bigint (radix of 10)!');
				process.exit(1);
			}

			return bin;
		});
		const bin = bits.deflateBigInt(fieldSizesBigInt, bins);

		console.log(bin.toString());
	}

	process.exit(0);
}

const fieldSizes = mappings.map(mapping => mapping[1]);

if (values.inflate) {
	const bin = parseInt(values.bin, 10);

	if (isNaN(bin)) {
		console.error('The given data is not valid number (radix of 10)!');
		process.exit(1);
	}

	const fieldValues = bits.inflate(fieldSizes, bin);

	for (let i = 0; i < fieldNames.length; i++) {
		console.log(`${fieldNames[i] ?? '(unknown)'}: ${fieldValues[i]}`);
	}
} else {
	const bins = values.bin.split(',').map(_bin => {
		const bin = parseInt(_bin, 10);

		if (isNaN(bin)) {
			console.error('The given data is not valid comma-spread numbers (radix of 10)!');
			process.exit(1);
		}

		return bin;
	});
	const bin = bits.deflate(fieldSizes, bins);

	console.log(bin);
}

process.exit(0);
