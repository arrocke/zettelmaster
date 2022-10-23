import { Node } from './types'

export interface NodeTraversalOptions<T> {
  node: Node,
  index: number,
  childrenValues: T[]
}

export function traverse<T>(fn: (options: NodeTraversalOptions<T>) => T, node: Node, index = 0): T {
  const childrenValues = 'content' in node && node.content
    ? node.content.map(
      (node, index) => traverse(fn, node, index)
    )
    : []
  return fn({ node, index, childrenValues })
}