import { setBlockType } from 'prosemirror-commands';
import { NodeType } from 'prosemirror-model';
import { Command, NodeSelection } from 'prosemirror-state';

export function insertNode(nodeType: NodeType): Command {
  return (state, dispatch) => {
    if (
      state.selection instanceof NodeSelection &&
      state.selection.node.type === nodeType
    ) {
      return false;
    }
    if (dispatch) {
      dispatch(state.tr.replaceSelectionWith(nodeType.createAndFill()!));
    }
    return true;
  };
}

export function toggleCodeBlock(
  codeBlock: NodeType,
  paragraph: NodeType
): Command {
  return (state, dispatch, view) => {
    const codeBlockPositions: [start: number, end: number][] = [];
    for (const range of state.selection.ranges) {
      state.doc.nodesBetween(range.$from.pos, range.$to.pos, (node, pos) => {
        if (node.type === codeBlock) {
          codeBlockPositions.push([pos, pos + node.nodeSize]);
        }
      });
    }
    if (!codeBlockPositions.length) {
      return setBlockType(codeBlock)(state, dispatch, view);
    }
    if (dispatch) {
      const tr = state.tr;
      for (const [start, end] of codeBlockPositions) {
        tr.setBlockType(start, end, paragraph);
      }
      dispatch(tr);
    }
    return true;
  };
}

export function insertTable(tableType: NodeType): Command {
  const rowType = tableType.contentMatch.defaultType!;
  const cellType = rowType.contentMatch.defaultType!;
  return (state, dispatch) => {
    const cell = cellType.createAndFill()!;
    const row = rowType.create(undefined, [cell, cell, cell]);
    dispatch?.(
      state.tr.replaceSelectionWith(
        tableType.create(undefined, [row, row, row])
      )
    );

    return true;
  };
}
