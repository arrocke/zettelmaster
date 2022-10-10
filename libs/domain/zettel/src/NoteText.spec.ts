import NoteText, { CodeBlockNode, DocumentNode, LinkMark, TextNode } from './NoteText'

describe('findNode', () => {
	test('returns found inline node', () => {
		const nodeToFind: TextNode = { type: 'text', text: 'world', marks: [{ type: 'bold' }] }
		const data: DocumentNode = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{ type: 'text', text: 'Hello ', marks: [] },
						nodeToFind
					]
				}
			]
		}
		const node = new NoteText(data)
		expect(node.findNode(node => node.type === 'text' && node.marks.some(mark => mark.type === 'bold'))).toEqual(nodeToFind)
	})

	test('returns found block node', () => {
		const nodeToFind: CodeBlockNode = { type: 'codeBlock', content: [{ type: 'text', text: 'hello world', marks: [] }] }
		const data: DocumentNode = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{ type: 'text', text: 'Hello ', marks: [] }
					]
				},
				nodeToFind
			]
		}
		const node = new NoteText(data)
		expect(node.findNode(node => node.type === 'codeBlock')).toEqual(nodeToFind)
	})

	test('returns undefined if no node is found', () => {
		const data: DocumentNode = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{ type: 'text', text: 'Hello world', marks: [] }
					]
				}
			]
		}
		const node = new NoteText(data)
		expect(node.findNode(node => node.type === 'blockquote')).toEqual(undefined)
	})
})

describe('findMark', () => {
	test('returns found mark', () => {
		const markToFind: LinkMark = { type: 'link', attrs: { href: 'https://google.com' } }
		const data: DocumentNode = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{ type: 'text', text: 'Hello ', marks: [] },
						{ type: 'text', text: 'Google', marks: [markToFind] },
					]
				}
			]
		}
		const node = new NoteText(data)
		expect(node.findMark(mark => mark.type === 'link')).toEqual(markToFind)
	})

	test('returns undefined if no mark is found', () => {
		const data: DocumentNode = {
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{ type: 'text', text: 'Hello world', marks: [] }
					]
				}
			]
		}
		const node = new NoteText(data)
		expect(node.findMark(mark => mark.type === 'bold')).toEqual(undefined)
	})
})