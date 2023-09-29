import { useState, useEffect } from "react";

const getLocalValue = (key, initValue) => {

  // if we are using Next.js which is server-side rendered, we need to check if window is defined
  if (typeof window == "undefined") {
    return initValue
  }

  // if value is already in localStorage, then return that value
  const localValue = JSON.parse(localStorage.getItem(key))
  if (localValue) {
    return localValue
  }

  // if initValue is a function that is stored in local storage, then return the result of that function
  if (initValue instanceof Function) {
    return initValue()
  }

  return initValue

}

const useLocalStorage = (key, initValue) => {
  // useState either first has localValue or initValue
  const [value, setValue] = useState(() => {
    return getLocalValue(key, initValue)
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}


export default useLocalStorage