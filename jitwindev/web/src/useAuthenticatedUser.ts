import { atom, useRecoilState } from 'recoil';
import { User } from 'User';

const recoilState = atom<User | undefined>({
  key: 'authenticatedUserState',
  default: undefined,
});

export const useAuthenticatedUser = () => useRecoilState(recoilState);
