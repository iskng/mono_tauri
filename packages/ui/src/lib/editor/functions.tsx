'use client';

import { defaultMarkdownSerializer } from 'prosemirror-markdown';
import { DOMParser, type Node } from 'prosemirror-model';
import { Decoration, DecorationSet, type EditorView } from 'prosemirror-view';
import { renderToString } from 'react-dom/server';

import { Markdown } from '../../components/markdown';

import { documentSchema } from './config';
import { createSuggestionWidget, type UISuggestion } from './suggestions';

// Editor utility functions

export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function getCharCount(text: string): number {
  return text.length;
}

export const buildDocumentFromContent = (content: string) => {
  const parser = DOMParser.fromSchema(documentSchema);
  const stringFromMarkdown = renderToString(<Markdown>{content}</Markdown>);
  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = stringFromMarkdown;
  return parser.parse(tempContainer);
};

export const buildContentFromDocument = (document: Node) => {
  return defaultMarkdownSerializer.serialize(document);
};

export const createDecorations = (
  suggestions: Array<UISuggestion>,
  view: EditorView,
) => {
  const decorations: Array<Decoration> = [];

  for (const suggestion of suggestions) {
    if (suggestion.selectionStart !== undefined && suggestion.selectionEnd !== undefined) {
      decorations.push(
        Decoration.inline(
          suggestion.selectionStart,
          suggestion.selectionEnd,
          {
            class: 'suggestion-highlight',
          },
          {
            suggestionId: suggestion.id,
            type: 'highlight',
          },
        ),
      );
    }

    if (suggestion.selectionStart !== undefined) {
      decorations.push(
        Decoration.widget(
          suggestion.selectionStart,
          (view) => {
            const { dom } = createSuggestionWidget(suggestion, view);
            return dom;
          },
          {
            suggestionId: suggestion.id,
            type: 'widget',
          },
        ),
      );
    }
  }

  return DecorationSet.create(view.state.doc, decorations);
};