import { useState, useEffect } from 'react'

const useShowPopup = (wrapperRef) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target) && show) {
        setShow(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [show])

  return [show, setShow]
}

export default useShowPopup
