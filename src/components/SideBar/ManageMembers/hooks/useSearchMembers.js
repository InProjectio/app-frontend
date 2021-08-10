import { useState } from 'react'
import { deleteAccents } from 'utils/utils'

let timeout = null

const useSearchMembers = (MEMBERS) => {
  const [ members, setMembers ] = useState(MEMBERS)
  const [ text, setText ] = useState('')

  const handleSearch = (text) => {
    setText(text)
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      if (text) {
        const textSearch = deleteAccents(text.toLowerCase())
        setMembers(MEMBERS.filter((item) => deleteAccents(`${item.email}--${item.fullName}`.toLowerCase()).indexOf(textSearch) !== -1 ))
      } else {
        setMembers(MEMBERS)
      }
    }, 300)
  }

  return { text, handleSearch, members, setMembers }
}

export default useSearchMembers
