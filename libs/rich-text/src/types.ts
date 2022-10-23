export interface BoldMark {
  type: 'bold'
}
export interface ItalicMark {
  type: 'italic'
}
export interface StrikeMark {
  type: 'strike'
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
export interface NoteLinkMark {
  type: 'noteLink'
  attrs: {
    noteId: string
  }
}
export type Mark = BoldMark | ItalicMark | StrikeMark | CodeMark | LinkMark | NoteLinkMark

export interface TextNode {
  type: 'text'
  text: string
  marks?: Mark[]
}
export interface HardBreak {
  type: 'hardBreak'
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
export type InlineNode = TextNode | ImageNode | ReferenceNode | HardBreak

export interface ParagraphNode {
  type: 'paragraph'
  content?: InlineNode[]
}
export interface HorizontalRule {
  type: 'horizontalRule'
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

export interface ListItemNode {
  type: 'listItem'
  content?: BlockNode[]
}

export interface BulletListNode {
  type: 'bulletList'
  content?: ListItemNode[]
}
export interface OrderedListNode {
  type: 'orderedList'
  content?: ListItemNode[]
}

export type BlockNode =
  | ParagraphNode
  | HorizontalRule
  | BlockquoteNode
  | CodeBlockNode
  | HeadingNode
  | BulletListNode
  | OrderedListNode

export interface DocumentNode {
  type: 'doc'
  content?: BlockNode[]
}

export type Node = BlockNode | InlineNode | ListItemNode | DocumentNode
