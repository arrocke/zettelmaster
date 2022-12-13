import { useCombobox } from 'downshift'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Editor } from '@tiptap/react'
import { Icon } from '../Icon'

interface Item {
  id: string
  name: string
}

export interface ReferenceSearchProps {
  editor: Editor
  onSelect(): void
  onCancel(): void
}

export interface ReferenceSearchRef {
  focus(): void
}

const ReferenceSearch = forwardRef<ReferenceSearchRef, ReferenceSearchProps>(({ editor, onSelect, onCancel }, ref) => {
  const input = useRef<HTMLInputElement>(null)

  const fetchItems = useCallback(async (search?: string) => {
    const url = new URL('/api/references', window.location.href)
    if (search) {
      url.searchParams.append('text', search)
    }
    const response = await fetch(url.toString())
    if (response.status === 200) {
      const { data } = await response.json()
      const items = data.map((item: any) => ({ id: item.id, name: item.name }))
      if (search) {
        setItems([{ id: 'new', name: search }, ...items])
      } else {
        setItems(items)
      }
    } else {
      setItems([])
    }
  }, [])

  const createReference = useCallback(async (name: string) => {
    const request = await fetch('api/references', {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (request.status === 201) {
      const location = request.headers.get('location')
      if (location) {
        return location?.split('/').slice(-1)[0]
      }
    }
    throw new Error()
  }, [])

  const [items, setItems] = useState<Item[]>([])
  const {
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
    reset: _reset
  } = useCombobox({
    isOpen: true,
    async onSelectedItemChange(changes) {
      if (changes.selectedItem) {
        const id = changes.selectedItem.id === 'new'
          ? await createReference(changes.inputValue ?? '')
          : changes.selectedItem.id
        editor.chain().focus().setReference({ id }).run()
        onSelect()
      }
    },
    async onInputValueChange({ inputValue }) {
      await fetchItems(inputValue)
    },
    items,
    itemToString(item) {
      return item ? item.name : ''
    }
  })

  useEffect(() => {
    fetchItems()
  }, [])

  useImperativeHandle(ref, () => {
    return {
      focus() {
        input.current?.focus()
      }
    }
  })

  return <div className="w-96">
    <input
      placeholder="Best book ever"
      className="focus:outline-none h-8 pl-2 rounded-t-lg border-b border-slate-300 w-full"
      {...getInputProps({
        onKeyDown: (e) => {
          if (e.key === 'Escape') {
            e.preventDefault()
            onCancel()
          }
        },
        ref: input
      })}
    />
    <ul
      {...getMenuProps()}
      className="p-0 w-full bg-white max-h-80 overflow-y-scroll rounded-b-lg"
    >
      {items.map((item, index) => <li
        {...getItemProps({ item, index })}
        className={`
          py-2 px-3 border-b border-slate-300
          ${highlightedIndex === index ? 'bg-blue-300' : ''}
          ${selectedItem === item ? 'font-bold' : ''}
        `}
        key={`${item.id}-${index}`}
      >
        {item.id === 'new'
          ? <><Icon type="add" /> {`Add "${item.name}"`}</>
          : (item.name || 'Unknown')}
      </li>)}
    </ul>
  </div>
})

export default ReferenceSearch
