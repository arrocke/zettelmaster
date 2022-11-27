import { useCombobox } from 'downshift'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Editor } from '@tiptap/react'

interface Item {
  id: string
  text: string
}

export interface ReferenceSearchProps {
  editor: Editor
  onSelect(): void
  onBlur(): void
}

export interface ReferenceSearchRef {
  focus(): void
}

const ReferenceSearch = forwardRef<ReferenceSearchRef, ReferenceSearchProps>(({ editor, onSelect, onBlur }, ref) => {
  const input = useRef<HTMLInputElement>(null)

  // const fetchItems = useCallback(async (search?: string) => {
  //   const url = new URL('/api/notes', window.location.href)
  //   if (search) {
  //     url.searchParams.append('text', search)
  //   }
  //   const response = await fetch(url.toString())
  //   if (response.status === 200) {
  //     const { data } = await response.json()
  //     setItems(data.map((item: any) => ({ id: item.id, text: item.preview })))
  //   } else {
  //     setItems([])
  //   }
  // }, [])

  // useEffect(() => {
  //   fetchItems()
  // }, [fetchItems])

  const [items, setItems] = useState<Item[]>([{ id: '1', text: 'one' }, { id: '2', text: 'two' }])
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
        editor.chain().focus().setReference({ id: changes.selectedItem.id }).run()
        onSelect()
      }
    },
    // async onInputValueChange({ inputValue }) {
    //   await fetchItems(inputValue)
    // },
    items,
    itemToString(item) {
      return item ? item.text : ''
    }
  })

  useImperativeHandle(ref, () => {
    return {
      focus() {
        input.current?.focus()
      }
    }
  }, [])

  return <div className="w-96">
    <input
      placeholder="Best book ever"
      className="focus:outline-none h-8 pl-2 rounded-t-lg border-b border-slate-300 w-full"
      {...getInputProps({ onBlur, ref: input })}
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
        {item.text || 'Empty note'}
      </li>)}
    </ul>
  </div>
})

export default ReferenceSearch
