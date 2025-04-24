"use client"

import { useState, createContext, useContext, useCallback, useMemo } from "react"

const TOAST_REMOVE_DELAY = 3000

const ToastContext = createContext({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
  updateToast: () => {},
})

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.map((toast) => (toast.id === id ? { ...toast, open: false } : toast)))

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, 300) // Animation duration
  }, [])

  const addToast = useCallback(
    (toast) => {
      const id = Math.random().toString(36).substring(2, 9)
      setToasts((prevToasts) => [...prevToasts, { ...toast, id, open: true }])

      // Automatically remove toast after delay
      setTimeout(() => {
        removeToast(id)
      }, TOAST_REMOVE_DELAY)

      return id
    },
    [removeToast],
  )

  const updateToast = useCallback((id, toast) => {
    setToasts((prevToasts) => prevToasts.map((t) => (t.id === id ? { ...t, ...toast } : t)))
  }, [])

  const contextValue = useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
      updateToast,
    }),
    [toasts, addToast, removeToast, updateToast],
  )

  return <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>
}

export const useToast = () => {
  const context = useContext(ToastContext)

  if (context === undefined) {
    console.warn("useToast was used outside of ToastProvider")
    // Return a default object with an empty toasts array to prevent errors
    return {
      toast: () => {},
      toasts: [],
      dismissToast: () => {},
    }
  }

  const { toasts, addToast, removeToast, updateToast } = context

  const toast = useCallback(
    (props) => {
      const id = addToast(props)

      return {
        id,
        update: (newProps) => updateToast(id, newProps),
        dismiss: () => removeToast(id),
      }
    },
    [addToast, updateToast, removeToast],
  )

  const dismissToast = useCallback(
    (id) => {
      removeToast(id)
    },
    [removeToast],
  )

  return {
    toast,
    toasts,
    dismissToast,
  }
}
