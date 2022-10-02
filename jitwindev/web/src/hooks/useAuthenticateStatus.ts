import { atom, useRecoilState } from 'recoil';

type AuthenticatedStatus = 'beforeConfirm' | 'waiting' | 'confirmed' | 'error';

const recoilState = atom<AuthenticatedStatus>({
  key: 'authenticateStatus',
  default: 'beforeConfirm',
});

export const useAuthenticateStatus = () => useRecoilState(recoilState);
