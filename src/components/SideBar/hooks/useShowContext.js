import { useState, useEffect } from 'react'

const useShowContext = (contextRef) => {
  const [showContext, setShowContext] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextRef.current && !contextRef.current.contains(event.target) && showContext) {
        setShowContext(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showContext])

  return [showContext, setShowContext]
}

export default useShowContext
