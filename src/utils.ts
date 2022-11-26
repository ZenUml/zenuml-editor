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
