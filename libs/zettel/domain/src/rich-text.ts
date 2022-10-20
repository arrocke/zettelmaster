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
    href?: string
    noteId?: string
  }
}
export type Mark = BoldMark | ItalicMark | CodeMark | LinkMark

export interface TextNode {
  type: 'text'
  text: string
  marks?: Mark[]
}
export interface ImageNode {
  type: 'image'
  attrs: {
    src: string
    alt?: string
    title?: string
  }
}
export interface ReferenceNode {
  type: 'reference'
  attrs: {
    id: string
  }
  content?: TextNode[]
}
export type InlineNode = TextNode | ImageNode | ReferenceNode

export interface ParagraphNode {
  type: 'paragraph'
  content?: InlineNode[]
}
export interface BlockquoteNode {
  type: 'blockquote'
  content?: BlockNode[]
}
export interface CodeBlockNode {
  type: 'codeBlock'
  content?: TextNode[]
}
export interface HeadingNode {
  type: 'heading'
  content?: InlineNode[]
  attrs: {
    level: number
  }
}

export interface ListItem {
  type: 'listItem'
  content?: BlockNode[]
}

export interface BulletListNode {
  type: 'bulletList'
  content?: ListItem[]
}
export interface OrderedListNode {
  type: 'orderedList'
  content?: ListItem[]
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
  content?: BlockNode[]
}

export type Node = BlockNode | InlineNode | ListItem | DocumentNode

export function isMarkType<MarkType extends Mark>(
  mark: Mark,
  type: MarkType['type']
): mark is MarkType {
  return mark.type === type
}

export function isNodeType<NodeType extends Node>(
  node: Node,
  type: NodeType['type']
): node is NodeType {
  return node.type === type
}

export function findNode(
  node: Node,
  fn: (node: Node) => boolean
): Node | undefined {
  if (fn(node)) return node
  else if ('content' in node) {
    for (const child of node.content ?? []) {
      const nestedResult = findNode(child, fn)
      if (nestedResult) {
        return nestedResult
      }
    }
  }
  return
}

export function filterNodes(node: Node, fn: (node: Node) => boolean): Node[] {
  let nodes: Node[] = []
  if (fn(node)) nodes.push(node)
  if ('content' in node)
    nodes = nodes.concat(...(node.content ?? []).map((child) => filterNodes(child, fn)))
  return nodes
}

export function findMark(
  node: Node,
  fn: (node: Mark) => boolean
): Mark | undefined {
  if ('marks' in node) {
    for (const mark of node.marks ?? []) {
      if (fn(mark)) return mark
    }
  }
  if ('content' in node) {
    for (const child of node.content ?? []) {
      const nestedResult = findMark(child, fn)
      if (nestedResult) {
        return nestedResult
      }
    }
  }
  return
}

export function filterMarks(node: Node, fn: (node: Mark) => boolean): Mark[] {
  let nodes: Mark[] = []
  if ('marks' in node && node.marks) nodes = nodes.concat(node.marks.filter(fn))
  if ('content' in node)
    nodes = nodes.concat(...(node.content ?? []).map((child) => filterMarks(child, fn)))
  return nodes
}
