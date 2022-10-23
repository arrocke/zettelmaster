import { Mark, Node } from "./types"

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
