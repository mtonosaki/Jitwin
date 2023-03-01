import { useCallback } from 'react'
import { useWaitingSpinnerCounter } from './hookWaitingSpinnerValue'

// USAGE
// const [requestToShowWaitingSpinner, requestToHideWaitingSpinner] = useWaitingSpinner();
// requestToShowWaitingSpinner() ... to show waiting spinner
// requestToHideWaitingSpinner() ... to hide waiting spinner

export const useWaitingSpinner: () => readonly [
  () => void,
  () => void,
  boolean
] = () => {
  const [showingCounter, setShowingCounter] = useWaitingSpinnerCounter()

  const requestToShowWaitingSpinner = useCallback(() => {
    setShowingCounter(showingCounter + 1)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const requestToHideWaitingSpinner = useCallback(() => {
    setShowingCounter(Math.max(0, showingCounter - 1))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return [
    requestToShowWaitingSpinner,
    requestToHideWaitingSpinner,
    showingCounter > 0,
  ] as const
}
