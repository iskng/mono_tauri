// Editor configuration

import { Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { Transaction } from 'prosemirror-state';
import { InputRule } from 'prosemirror-inputrules';
import { EditorView } from 'prosemirror-view';
import type { MutableRefObject } from 'react';

export const EDITOR_CONFIG = {
  placeholder: 'Start typing...',
  maxLength: 10000,
  debounceMs: 300,
};

export const documentSchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks,
});

export function handleTransaction({
  transaction,
  editorRef,
  onSaveContent,
}: {
  transaction: Transaction;
  editorRef: MutableRefObject<EditorView | null>;
  onSaveContent: (content: string, debounce: boolean) => void;
}): void {
  const newState = editorRef.current!.state.apply(transaction);
  editorRef.current!.updateState(newState);
  
  // Save content if changed
  if (transaction.docChanged) {
    const content = newState.doc.textContent;
    onSaveContent(content, true);
  }
}

export const headingRule = (level: number) => new InputRule(
  new RegExp(`^(#{${level}})\\s$`),
  (state, match, start, end) => {
    return state.tr
      .setBlockType(start, end, state.schema.nodes.heading, { level })
      .deleteRange(start, end);
  }
);