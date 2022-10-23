import {zlibSync, unzlibSync, strToU8, strFromU8} from 'fflate'

const isEmpty = (str: string) => !str || str.trim() === '';
const isComment = (line: string) => line && line.trim().startsWith('//');

function until(arr: string[], fn: (line: string) => boolean) {
  const l = arr.length;
  let i = 0;
  while (i < l && !fn(arr[i])) {
    i++;
  }
  return arr.slice(0, i);
}

const NEW_PARTICIPANT = 'NewParticipant';

/**
 * add code function borrowed from core. Make sure the behavior is the same.
 * With some refactor.
 * @param oldCode current code inside the editor
 * @param moreCode new code that needs to be added
 */
export function addCode(oldCode: string, moreCode: string) {
  if (moreCode !== NEW_PARTICIPANT) return `${oldCode}\n${moreCode}`;

  const lines = oldCode.split('\n');
  const leadingCommentLines = until(lines, line => !isEmpty(line) && !isComment(line));
  const remainingLines = lines.slice(leadingCommentLines.length)
  const all = leadingCommentLines.concat([NEW_PARTICIPANT]).concat(remainingLines);
  return all.join('\n');
}

/**
 * the function from our laravel project.
 */
export function defaultDiagramName() {
  return `Untitled at ${new Date().toISOString()}`;
}

export function debounce(fn: Function, n = 100) {
  let handle: any
  return (...args: any[]) => {
    if (handle) clearTimeout(handle)
    handle = setTimeout(() => {
      fn(...args)
    }, n)
  }
}

export function utoa(data: string): string {
  const buffer = strToU8(data)
  const zipped = zlibSync(buffer, {level: 9})
  const binary = strFromU8(zipped, true)
  return btoa(binary)
}

export function atou(base64: string): string {
  const binary = atob(base64)

  // zlib header (x78), level 9 (xDA)
  if (binary.startsWith('\x78\xDA')) {
    const buffer = strToU8(binary, true)
    const unzipped = unzlibSync(buffer)
    return strFromU8(unzipped)
  }

  // old unicode hacks for backward compatibility
  // https://base64.guru/developers/javascript/examples/unicode-strings
  return decodeURIComponent(escape(binary))
}
