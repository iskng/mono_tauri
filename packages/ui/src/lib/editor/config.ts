// Editor configuration

import { Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { Transaction } from 'prosemirror-state';
import { InputRule } from 'prosemirror-inputrules';

export const EDITOR_CONFIG = {
  placeholder: 'Start typing...',
  maxLength: 10000,
  debounceMs: 300,
};

export const documentSchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks,
});

export function handleTransaction(tr: Transaction): Transaction {
  // Placeholder transaction handler
  return tr;
}

export const headingRule = new InputRule(/^(#{1,6})\s$/, (state, match, start, end) => {
  const level = match[1].length;
  return state.tr
    .setBlockType(start, end, state.schema.nodes.heading, { level })
    .deleteRange(start, end);
});