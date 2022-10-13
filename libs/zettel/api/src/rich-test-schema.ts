import { BlockNode, DocumentNode, Mark } from '@zettelmaster/zettel/domain'
import { z } from 'zod'

const markSchema: z.Schema<Mark> = z.discriminatedUnion('type', [
  z.object({ type: z.literal('bold') }),
  z.object({ type: z.literal('italic') }),
  z.object({ type: z.literal('code') }),
  z.object({
    type: z.literal('link'),
    attrs: z.object({
      href: z.string(),
      noteId: z.string(),
    }),
  }),
])

const textNodeSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
  marks: z.array(markSchema),
})

const imageNodeSchema = z.object({
  type: z.literal('image'),
  attrs: z.object({
    src: z.string(),
    alt: z.string().optional(),
    title: z.string().optional(),
  }),
})

const referenceNodeSchema = z.object({
  type: z.literal('reference'),
  attrs: z.object({
    id: z.string(),
  }),
  content: z.array(textNodeSchema),
})

const inlineNodeSchema = z.discriminatedUnion('type', [
  textNodeSchema,
  imageNodeSchema,
  referenceNodeSchema,
])

const paragraphNodeSchema = z.object({
  type: z.literal('paragraph'),
  content: z.array(inlineNodeSchema),
})

const codeBlockNodeSchema = z.object({
  type: z.literal('codeBlock'),
  content: z.array(textNodeSchema),
})

const headingNodeSchema = z.object({
  type: z.literal('heading'),
  content: z.array(inlineNodeSchema),
  attrs: z.object({
    level: z.number(),
  }),
})

const blockNodeSchema: z.ZodType<BlockNode> = z.lazy(() =>
  z.discriminatedUnion('type', [
    paragraphNodeSchema,
    codeBlockNodeSchema,
    headingNodeSchema,
    blockquoteNodeSchema,
    bulletListNodeSchema,
    orderedListNodeSchema,
  ])
)

const blockquoteNodeSchema = z.object({
  type: z.literal('blockquote'),
  content: z.array(blockNodeSchema),
})

const listItemNodeSchema = z.object({
  type: z.literal('listItem'),
  content: z.array(blockNodeSchema),
})

const bulletListNodeSchema = z.object({
  type: z.literal('bulletList'),
  content: z.array(listItemNodeSchema),
})

const orderedListNodeSchema = z.object({
  type: z.literal('orderedList'),
  content: z.array(listItemNodeSchema),
})

const documentNodeSchema: z.ZodType<DocumentNode> = z.object({
  type: z.literal('doc'),
  content: z.array(blockNodeSchema),
})

export default documentNodeSchema