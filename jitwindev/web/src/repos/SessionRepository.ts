import { User } from 'models/User';
import HttpClientCustom from '../network/HttpClientCustom';

export default class SessionRepository {
  private storage: Storage; // Need blank line below : Expected blank line between class members lines-between-class-members

  private httpClient: HttpClientCustom; // Need blank line below : Expected blank line between class members lines-between-class-members

  private currentUser: User | undefined = undefined;

  constructor(sessionStorage: Storage, httpClient: HttpClientCustom) {
    this.storage = sessionStorage;
    this.httpClient = httpClient;
  }

  public setAuthenticatedUser(user: User | undefined) {
    if (user) {
      this.currentUser = {
        userId: user.userId,
        displayName: user.displayName,
        userPrincipalName: user.userPrincipalName,
      };
    } else {
      this.currentUser = undefined;
    }
  }

  public getAuthenticatedUser(): User | undefined {
    if (this.currentUser) {
      return {
        ...this.currentUser,
      };
    }
    return undefined;
  }

  public setInLoginProcess() {
    this.storage.setItem('InLoginProcess', 'true');
  }

  public resetInLoginProcess() {
    this.storage.removeItem('InLoginProcess');
  }

  public isInLoginProcess(): boolean {
    const ret = this.storage.getItem('InLoginProcess') ?? 'false';
    return ret === 'true';
  }

  public async logoutSession() {
    await this.httpClient.post('/logout');
  }
}
