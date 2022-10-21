import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBold, faItalic, faListUl, faListOl, faAdd, faStrikethrough, faCode } from '@fortawesome/free-solid-svg-icons'

const icons = {
  bold: faBold,
  italic: faItalic,
  'bullet-list': faListUl,
  'ordered-list': faListOl,
  'add': faAdd,
  'strike': faStrikethrough,
  'code': faCode
}

export interface IconProps {
  type: keyof typeof icons,
  className?: string
}


export const Icon = (props: IconProps) => {
  return <FontAwesomeIcon className={props.className ?? ''} icon={icons[props.type]} aria-hidden="false" />
}