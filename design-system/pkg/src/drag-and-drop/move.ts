// https://github.com/adobe/react-spectrum/blob/759ac41ae9683d053044c508d9ec0dccebd3b8dd/packages/%40react-stately/data/src/useListData.ts#L335
export function move<T>(
  items: ReadonlyArray<T>,
  indices: number[],
  toIndex: number
): Array<T> {
  // Shift the target down by the number of items being moved from before the target
  toIndex -= indices.filter(index => index < toIndex).length;

  let moves = indices.map(from => ({
    from,
    to: toIndex++,
  }));

  // Shift later from indices down if they have a larger index
  for (let i = 0; i < moves.length; i++) {
    let a = moves[i].from;
    for (let j = i; j < moves.length; j++) {
      let b = moves[j].from;

      if (b > a) {
        moves[j].from--;
      }
    }
  }

  // Interleave the moves so they can be applied one by one rather than all at once
  for (let i = 0; i < moves.length; i++) {
    let a = moves[i];
    for (let j = moves.length - 1; j > i; j--) {
      let b = moves[j];

      if (b.from < a.to) {
        a.to++;
      } else {
        b.from++;
      }
    }
  }

  let copy = items.slice();
  for (let move of moves) {
    let [item] = copy.splice(move.from, 1);
    copy.splice(move.to, 0, item);
  }

  return copy;
}
