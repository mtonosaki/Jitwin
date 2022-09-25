import { User } from 'User';

export default class SessionRepository {
  private currentUser: User | undefined = undefined;

  public setAuthenticatedUser(user: User | undefined) {
    if (user) {
      this.currentUser = { oid: user.oid, displayName: user.displayName };
    } else {
      this.currentUser = undefined;
    }
  }

  public getAuthenticatedUser(): User | undefined {
    if (this.currentUser) {
      return {
        oid: this.currentUser.oid,
        displayName: this.currentUser.displayName,
      };
    }
    return undefined;
  }
}
