import { ValueObject } from '@zettelmaster/domain/base';
import {
  DocumentNode,
  findNodeRecursive,
  findMarkRecursive,
  Node,
  Mark,
} from './rich-text';

export * from './rich-text'

/** Represents rich text content for a note. */
export default class NoteText extends ValueObject<DocumentNode> {
  get document() {
    return this._data
  }

	/** Recursively search through text contents for the first node that meets the condition. */
  findNode(fn: (node: Node) => boolean): Node | undefined {
    return findNodeRecursive(this._data, fn);
  }

	/** Recursively search through text contents for the first mark that meets the condition. */
  findMark(fn: (node: Mark) => boolean): Mark | undefined {
    return findMarkRecursive(this._data, fn);
  }
}
