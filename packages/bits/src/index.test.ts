import test from 'ava';
import {deflate, inflate} from '.';

const fields = [4, 8, 12, 24];
const values = [1, 2, 3, 4];

test('deflate and inflate', t => {
	const bits = deflate(fields, values);

	t.deepEqual(values, inflate(fields, bits));
});
