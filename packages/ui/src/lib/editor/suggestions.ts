// Editor suggestions functionality

import type { Node } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import type { Suggestion } from '@repo/ui/lib/db/schema';

export interface UISuggestion extends Suggestion {
  isActive?: boolean;
  isHovered?: boolean;
  selectionStart?: number;
  selectionEnd?: number;
}

export function applySuggestion(text: string, suggestion: Suggestion): string {
  return text.replace(suggestion.originalText, suggestion.suggestedText);
}

export function findSuggestionPosition(text: string, suggestion: Suggestion): { start: number; end: number } | null {
  const index = text.indexOf(suggestion.originalText);
  if (index === -1) return null;
  
  return {
    start: index,
    end: index + suggestion.originalText.length,
  };
}

interface Position {
  start: number;
  end: number;
}

function findPositionsInDoc(doc: Node, searchText: string): Position | null {
  let positions: { start: number; end: number } | null = null;

  doc.nodesBetween(0, doc.content.size, (node, pos) => {
    if (node.isText && node.text) {
      const index = node.text.indexOf(searchText);

      if (index !== -1) {
        positions = {
          start: pos + index,
          end: pos + index + searchText.length,
        };

        return false;
      }
    }

    return true;
  });

  return positions;
}

export function projectWithPositions(
  doc: Node,
  suggestions: Array<Suggestion>,
): Array<UISuggestion> {
  return suggestions.map((suggestion) => {
    const positions = findPositionsInDoc(doc, suggestion.originalText);

    if (!positions) {
      return {
        ...suggestion,
        selectionStart: 0,
        selectionEnd: 0,
      };
    }

    return {
      ...suggestion,
      selectionStart: positions.start,
      selectionEnd: positions.end,
    };
  });
}

export const suggestionsPluginKey = new PluginKey('suggestions');

export const suggestionsPlugin = new Plugin({
  key: suggestionsPluginKey,
  state: {
    init() {
      return { decorations: DecorationSet.empty, selected: null };
    },
    apply(tr, state) {
      const newDecorations = tr.getMeta(suggestionsPluginKey);
      if (newDecorations) return newDecorations;

      return {
        decorations: state.decorations.map(tr.mapping, tr.doc),
        selected: state.selected,
      };
    },
  },
  props: {
    decorations(state) {
      return this.getState(state)?.decorations ?? DecorationSet.empty;
    },
  },
});

// Stub for createSuggestionWidget - this should be implemented in the consuming app
// since it depends on React components that may vary by implementation
export function createSuggestionWidget(
  suggestion: UISuggestion,
  view: any,
): { dom: HTMLElement; destroy?: () => void } {
  // Basic implementation - apps should override this with their own UI
  const dom = document.createElement('span');
  dom.className = 'suggestion-widget';
  dom.textContent = '💡';
  return { dom };
}