import { DocumentNode, Node } from "./types"
import { traverse } from './traverse'

test('executes reduce function on every node', () => {
  const doc: DocumentNode = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'hello world! '
          },
          {
            type: 'text',
            text: 'bold',
            marks: [{ type: 'bold' }]
          }
        ]
      },
      {
        type: 'bulletList',
        content: [{
          type: 'listItem',
          content: [{
            type: 'paragraph',
            content: [{
              type: 'text',
              text: 'list item 1'
            }]
          }]
        }, {
          type: 'listItem',
          content: [{
            type: 'paragraph',
            content: [{
              type: 'text',
              text: 'list item 2'
            }]
          }]
        }]
      }
    ]
  }

  const fn = jest.fn<number, [{ node: Node, childrenValues: number[] }]>().mockImplementation(({ childrenValues }) => childrenValues.reduce((prev, n) => prev + n, 1))

  expect(traverse(fn, doc)).toEqual(11)

  const docWithoutTypes = doc as any
  expect(fn).toHaveBeenCalledTimes(11)
  expect(fn).toHaveBeenNthCalledWith(1, { node: docWithoutTypes.content[0].content[0], index: 0, childrenValues: [] })
  expect(fn).toHaveBeenNthCalledWith(2, { node: docWithoutTypes.content[0].content[1], index: 1, childrenValues: [] })
  expect(fn).toHaveBeenNthCalledWith(3, { node: docWithoutTypes.content[0], index: 0, childrenValues: [1, 1] })
  expect(fn).toHaveBeenNthCalledWith(4, { node: docWithoutTypes.content[1].content[0].content[0].content[0], index: 0, childrenValues: [] })
  expect(fn).toHaveBeenNthCalledWith(5, { node: docWithoutTypes.content[1].content[0].content[0], index: 0, childrenValues: [1] })
  expect(fn).toHaveBeenNthCalledWith(6, { node: docWithoutTypes.content[1].content[0], index: 0, childrenValues: [2] })
  expect(fn).toHaveBeenNthCalledWith(7, { node: docWithoutTypes.content[1].content[1].content[0].content[0], index: 0, childrenValues: [] })
  expect(fn).toHaveBeenNthCalledWith(8, { node: docWithoutTypes.content[1].content[1].content[0], index: 0, childrenValues: [1] })
  expect(fn).toHaveBeenNthCalledWith(9, { node: docWithoutTypes.content[1].content[1], index: 1, childrenValues: [2] })
  expect(fn).toHaveBeenNthCalledWith(10, { node: docWithoutTypes.content[1], index: 1, childrenValues: [3, 3] })
  expect(fn).toHaveBeenNthCalledWith(11, { node: docWithoutTypes, index: 0, childrenValues: [3, 7] })
})