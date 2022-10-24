import { useEffect, useRef } from "react";

/**
 * Prompts user to confirm navigation when `when` parameter is true.
 * @param when Condition to trigger navigation confirmation.
 */
export default function useUnloadWarning(when: boolean) {
  const whenRef = useRef(when)

  useEffect(() => {
    whenRef.current = when
  }, [when])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (whenRef.current) {
        e.preventDefault()
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [])
}