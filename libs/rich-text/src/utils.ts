import { Mark, Node } from "./types"

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
