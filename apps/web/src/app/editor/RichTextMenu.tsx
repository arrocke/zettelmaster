import { BubbleMenu, Editor } from '@tiptap/react'
import { useEffect, useState } from 'react'
import { Icon, IconProps } from '../Icon'
import NoteLinkSearch from './NoteLinkSearch'

interface MenuButtonProps {
  isActive?: boolean
  onClick(): void
  label: string
  icon: IconProps['type']
}

const MenuButton = ({ isActive = false, onClick, label, icon }: MenuButtonProps) => {
  return <button
    onClick={onClick}
    className={`
      w-8 h-8 first:rounded-l-lg last:rounded-r-lg
      focus:bg-slate-300 hover:bg-slate-300
      ${isActive ? 'text-blue-500' : ''}
    `}
    tabIndex={-1}
    title={label}
  >
    <Icon type={icon} />
  </button>
}

export interface RichTextMenuProps {
  editor: Editor
}

const RichTextMenu = ({ editor }: RichTextMenuProps) => {
  const [subMenu, setSubMenu] = useState<'noteLink' | undefined>()

  useEffect(() => {
    return () => setSubMenu(undefined)
  }, [])

  let menuOptions
  switch (subMenu) {
    case 'noteLink': {
      menuOptions = <NoteLinkSearch editor={editor} onSelect={() => setSubMenu(undefined)} />
      break
    }
    default: {
      menuOptions = <>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon="bold"
          label="Bold"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon="italic"
          label="Italic"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          icon="strike"
          label="Strikethrough"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('strike')}
          icon="code"
          label="Code"
        />
        <MenuButton
          onClick={() => { setSubMenu('noteLink') }}
          isActive={editor.isActive('strike')}
          icon="note"
          label="Link to Note"
        />
      </>
      break
    }
  }

  return <BubbleMenu
    className="bg-white rounded-lg border border-slate-300 text-slate-700 drop-shadow-md"
    editor={editor}
    tippyOptions={{
      placement: 'bottom',
      maxWidth: 400,
      onHide() {
        setSubMenu(undefined)
      }
    }}
  >
    {menuOptions}
  </BubbleMenu>
}

export default RichTextMenu
