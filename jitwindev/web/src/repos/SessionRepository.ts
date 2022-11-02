import { User } from 'models/User';

export default interface SessionRepository {
  setAuthenticatedUser: (user: User | undefined) => void;
  setInLoginProcess: () => void;
  resetInLoginProcess: () => void;
  isInLoginProcess: () => boolean;
  logoutSession: () => Promise<void>;
}
