import { Node } from './types'
import { traverse } from './traverse'

export function toMarkdownString(node: Node): string {
  return traverse<string>(({ node, childrenValues }): string => {
    switch (node.type) {
      case 'text': {
        const markTypes = node.marks?.map(mark => mark.type) ?? []
        const wrapper = [
          markTypes.includes('code') && '`',
          markTypes.includes('bold') && '*',
          markTypes.includes('italic') && '_',
          markTypes.includes('strike') && '~'
        ].filter(Boolean)
        return `${wrapper.join('')}${node.text}${wrapper.reverse().join('')}`
      }
      case 'hardBreak': return '\n'
      case 'image': return '[image]'
      case 'reference': return ''
      case 'paragraph': return childrenValues.join('')
      case 'horizontalRule': return '---'
      case 'blockquote': return childrenValues.join('\n\n').split('\n').map(line => `> ${line}`).join('\n')
      case 'codeBlock': return "```\n" + childrenValues.join('') + "\n```"
      case 'heading': return `${''.padEnd(node.attrs.level, '#')} ${childrenValues.join('')}`
      case 'listItem': return childrenValues.map((child, i) => {
        if (i == 0 || ['bulletList', 'orderedList'].includes(node.content?.[i].type ?? '')) {
          return child
        } else {
          return `\n${child}`
        }
      }).join('\n')
      case 'bulletList': return childrenValues.map((child) => {
        const lines = child.split('\n')
        return [
          `- ${lines[0] ?? ''}`,
          ...lines.splice(1).map(line => `  ${line}`)
        ].join('\n')
      }).join('\n')
      case 'orderedList': {
        const numberSize = (childrenValues.length + 1).toString().length
        return childrenValues.map((child, i) => {
          const lines = child.split('\n')
          return [
            `${(i + 1).toString().padStart(numberSize, ' ')}. ${lines[0] ?? ''}`,
            ...lines.splice(1).map(line => `${''.padStart(numberSize + 1, ' ')}${line}`)
          ].join('\n')
        }).join('\n')
      }
      case 'doc': return childrenValues.join('\n\n')
      default: return ''
    }
  }, node)
}

export function toSearchString(node: Node): string {
  return traverse<string>(({ node, childrenValues }): string => {
    switch (node.type) {
      case 'text': return node.text.split('\n').join('')
      case 'paragraph':
      case 'codeBlock':
        return childrenValues.join('')
      case 'hardBreak': return ' '
      case 'horizontalRule': return ''
      default: return childrenValues.filter(x => x !== '').join(' ')
    }
  }, node)
}
