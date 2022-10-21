import React, {
  forwardRef, useEffect, useImperativeHandle,
  useState,
} from 'react'

export interface NoteSuggestionListProps {
  items: { id: string }[]
  command: any
}

export interface NoteSuggestionListRef {
  onKeyDown(options: { event: KeyboardEvent }): boolean
}

export default forwardRef<NoteSuggestionListRef, NoteSuggestionListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]

    if (item) {
      props.command({ noteId: item.id })
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  return (
    <div className="items">
      {props.items.length
        ? props.items.map((item, index) => (
          <button
            className={`item ${index === selectedIndex ? 'is-selected' : ''}`}
            key={index}
            onClick={() => selectItem(index)}
          >
            {item.id}
          </button>
        ))
        : <div className="item">No result</div>
      }
    </div>
  )
})