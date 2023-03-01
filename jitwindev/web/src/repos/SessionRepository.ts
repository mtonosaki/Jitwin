export default interface SessionRepository {
  setInLoginProcess: () => void
  resetInLoginProcess: () => void
  isInLoginProcess: () => boolean
  logoutSession: () => Promise<void>
}
