export interface BoldMark {
  type: 'bold'
}
export interface ItalicMark {
  type: 'italic'
}
export interface CodeMark {
  type: 'code'
}
export interface LinkMark {
  type: 'link'
  attrs: {
    href: string
  }
}
export type Mark = BoldMark | ItalicMark | CodeMark | LinkMark

export interface TextNode {
  type: 'text'
  text: string
  marks: Mark[]
}
export interface ImageNode {
  type: 'image'
  attrs: {
    src: string
    alt: string
    title: string
  }
}
export type InlineNode = TextNode | ImageNode

export interface ParagraphNode {
  type: 'paragraph'
  content: InlineNode[]
}
export interface BlockquoteNode {
  type: 'blockquote'
  content: BlockNode[]
}
export interface CodeBlockNode {
  type: 'codeBlock'
  content: TextNode[]
}
export interface HeadingNode {
  type: 'heading'
  content: InlineNode[]
  attrs: {
    level: number
  }
}

export interface LineItemNode {
  type: 'lineItem'
  content: BlockNode[]
}

export interface BulletListNode {
  type: 'bulletList'
  content: LineItemNode[]
}
export interface OrderedListNode {
  type: 'orderedList'
  content: LineItemNode[]
}

export type BlockNode =
  | ParagraphNode
  | BlockquoteNode
  | CodeBlockNode
  | HeadingNode
  | BulletListNode
  | OrderedListNode

export interface DocumentNode {
  type: 'doc'
  content: BlockNode[]
}

export type Node = BlockNode | InlineNode | LineItemNode | DocumentNode

export function findNodeRecursive(
  node: Node,
  fn: (node: Node) => boolean
): Node | undefined {
  if (fn(node)) return node
  else if ('content' in node) {
    for (const child of node.content) {
      const nestedResult = findNodeRecursive(child, fn)
      if (nestedResult) {
        return nestedResult
      }
    }
  }
  return
}

export function findMarkRecursive(
  node: Node,
  fn: (node: Mark) => boolean
): Mark | undefined {
  if ('marks' in node) {
    for (const mark of node.marks) {
      if (fn(mark)) return mark
    }
  }
  if ('content' in node) {
    for (const child of node.content) {
      const nestedResult = findMarkRecursive(child, fn)
      if (nestedResult) {
        return nestedResult
      }
    }
  }
  return
}
