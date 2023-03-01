import HttpClientCustom from 'network/HttpClientCustom'
import { User } from 'models/User'
import SessionRepository from './SessionRepository'

export default class SessionRepositoryNetwork implements SessionRepository {
  private storage: Storage // Need blank line below : Expected blank line between class members lines-between-class-members

  private httpClient: HttpClientCustom // Need blank line below : Expected blank line between class members lines-between-class-members

  private currentUser: User | undefined = undefined

  constructor(sessionStorage: Storage, httpClient: HttpClientCustom) {
    this.storage = sessionStorage
    this.httpClient = httpClient
  }

  setAuthenticatedUser(user: User | undefined) {
    if (user) {
      this.currentUser = {
        userId: user.userId,
        displayName: user.displayName,
        givenName: user.givenName,
        userPrincipalName: user.userPrincipalName,
      }
    } else {
      this.currentUser = undefined
    }
  }

  getAuthenticatedUser(): User | undefined {
    if (this.currentUser) {
      return {
        ...this.currentUser,
      }
    }
    return undefined
  }

  setInLoginProcess() {
    this.storage.setItem('InLoginProcess', 'true')
  }

  resetInLoginProcess() {
    this.storage.removeItem('InLoginProcess')
  }

  isInLoginProcess(): boolean {
    const ret = this.storage.getItem('InLoginProcess') ?? 'false'
    return ret === 'true'
  }

  async logoutSession() {
    await this.httpClient.post('/logout')
  }
}
