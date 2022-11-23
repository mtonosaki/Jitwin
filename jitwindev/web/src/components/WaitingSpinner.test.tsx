import React, { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { TestIds } from 'tests/TestIds';
import { useWaitingSpinner } from 'hooks/useWaitingSpinner';
import WaitingSpinner from './WaitingSpinner';

type WrapperProps = {
  isLoading: boolean;
};
function WrapperWaitingSpinner({ isLoading }: WrapperProps) {
  const [requestToShowWaitingSpinner, requestToHideWaitingSpinner] =
    useWaitingSpinner();

  useEffect(() => {
    if (isLoading) {
      requestToShowWaitingSpinner();
      return () => {
        requestToHideWaitingSpinner();
      };
    }
    return () => {};
  }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps
  return <WaitingSpinner />;
}

describe('WaitingSpinner', () => {
  it('When not spinning state, Sophie can not see spin image', () => {
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={['/fake']}>
          <div id="spinner-layer" />
          <WrapperWaitingSpinner isLoading={false} />
        </MemoryRouter>
      </RecoilRoot>
    );

    expect(
      screen.queryByTestId(TestIds.WAITING_SPINNER)
    ).not.toBeInTheDocument();
  });

  it('When spinning state, Sophie can see spin image', () => {
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={['/fake']}>
          <div id="spinner-layer" />
          <WrapperWaitingSpinner isLoading />
        </MemoryRouter>
      </RecoilRoot>
    );

    expect(screen.getByTestId(TestIds.WAITING_SPINNER)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'loading spinner' })
    ).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
