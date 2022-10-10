import { atom, useRecoilState } from 'recoil';

const waitingSpinnerCounter = atom<number>({
  key: 'waitingSpinnerCounter',
  default: 0,
});

export const useWaitingSpinnerCounter = () =>
  useRecoilState(waitingSpinnerCounter);
