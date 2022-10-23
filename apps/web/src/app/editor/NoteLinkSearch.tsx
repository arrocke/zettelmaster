import { useCombobox } from 'downshift'
import { useState } from 'react'
import { Editor } from '@tiptap/react'

interface Item {
  id: string
  text: string
}

export interface NoteLinkSearchProps {
  editor: Editor
  onSelect(): void
}

const NoteLinkSearch = ({ editor, onSelect }: NoteLinkSearchProps) => {
  const [items, setItems] = useState<Item[]>([])
  const {
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    isOpen: true,
    onSelectedItemChange(changes) {
      if (changes.selectedItem) {
        console.log(changes.selectedItem)
        editor.chain().focus().setNoteLink({ noteId: changes.selectedItem.id }).run()
        onSelect()
      }
    },
    async onInputValueChange({ inputValue }) {
      const response = await fetch(`/api/notes?text=${inputValue}`)
      if (response.status === 200) {
        const { data } = await response.json()
        setItems(data.map((item: any) => ({ id: item.id, text: item.preview })))
      } else {
        setItems([])
      }
    },
    items,
    itemToString(item) {
      return item ? item.text : ''
    }
  })

  return <div className="w-96">
    <input
      placeholder="Best book ever"
      className="focus:outline-none h-8 pl-2 rounded-t-lg border-b border-slate-300 w-full"
      {...getInputProps()}
    />
    <ul
      {...getMenuProps()}
      className="p-0 w-full bg-white max-h-80 overflow-y-scroll rounded-b-lg"
    >
      {items.map((item, index) => <li
        {...getItemProps({ item, index })}
        className={`
          py-2 px-3 flex flex-col border-b border-slate-300
          ${highlightedIndex === index ? 'bg-blue-300' : ''}
          ${selectedItem === item ? 'font-bold' : ''}
        `}
        key={`${item.id}-${index}`}
      >
        {item.text}
      </li>)}
    </ul>
  </div>
}

export default NoteLinkSearch