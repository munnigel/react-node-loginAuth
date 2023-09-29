import useLocalStorage from "./useLocalStorage";

export const useInput = (key, initValue) => {
  const [value, setValue] = useLocalStorage(key, initValue)

  const reset = () => {
    setValue(initValue)
  }

  const attributeObject = {
    value,
    onChange: (e) => setValue(e.target.value)
  }

  return [value, reset, attributeObject]
}

export const useInputAgency = (key, initValue) => {
  const [value, setValue] = useLocalStorage(key, initValue)
  const agencyReset = () => {
    setValue(initValue)
  }

  const agencyAttributeObject = {
    value,
    onChange: (e) => setValue(e)
  }
  return [value, agencyReset, agencyAttributeObject]
}

// export useInput, useInputAgency