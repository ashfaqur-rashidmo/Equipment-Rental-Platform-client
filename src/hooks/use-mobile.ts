import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const mql = React.useMemo(() => {
    if (typeof window === "undefined") {
      return null
    }
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  }, [])

  const isMobile = React.useSyncExternalStore(
    React.useCallback(
      (onStoreChange: () => void) => {
        if (!mql) return () => {}
        mql.addEventListener("change", onStoreChange)
        return () => mql.removeEventListener("change", onStoreChange)
      },
      [mql]
    ),
    () => (mql ? mql.matches : false),
    () => false
  )

  return isMobile
}
