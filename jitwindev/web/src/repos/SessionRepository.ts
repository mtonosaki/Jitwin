import { User } from 'models/User';

export default class SessionRepository {
  private storage: Storage; // Need blank line below : Expected blank line between class members lines-between-class-members

  private currentUser: User | undefined = undefined;

  constructor(sessionStorage: Storage) {
    this.storage = sessionStorage;
  }

  public setAuthenticatedUser(user: User | undefined) {
    if (user) {
      this.currentUser = { userId: user.userId, displayName: user.displayName };
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

  public isinLoginProcess(): boolean {
    const ret = this.storage.getItem('InLoginProcess') ?? 'false';
    return ret === 'true';
  }
}
