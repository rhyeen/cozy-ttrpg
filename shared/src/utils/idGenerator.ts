const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const CHARACTERS_LENGTH = CHARACTERS.length;

/**
 * Creates non-collision-resistant but more human ids.
 * For uuids, use `import { v4 as uuidv4 } from 'uuid';` then `uuidv4()`
 *
 * Returns a string of alphanumeric characters with `${prefix}_` appended.
 * The total length of the returned string is the length given as the parameter.
 *
 * The default is no prefix with a length of 16.
 * See: https://devina.io/collision-calculator
 *
 *
 * `prefix` cannot be longer than 5 and the random characters in the string
 * cannot be less than 9 characters.
 * We highly recommend not going below 12 random characters; however,
 * unless its a very low volume id.
 */
export const generateId = (prefix?: string, length?: number): string => {
  let result = '';
  const _length = length ?? 16;
  let _prefix = prefix ?? '';
  if (_prefix && !_prefix.endsWith('_')) {
    _prefix = `${_prefix}_`;
  }
  if (_prefix.length > 6) {
    throw new Error('prefix cannot be more than 5 characters, including the postfixed "_"');
  }
  for (let i = 0; i < _length - _prefix.length; i++) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS_LENGTH));
  }
  if (result.length < 9) {
    throw new Error('there must be at least 9 random characters in the result');
  }
  return _prefix + result;
};
