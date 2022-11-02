import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestIds } from 'tests/TestIds';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, useParams } from 'react-router-dom';
import { mocked } from 'jest-mock';
import App from './App';

const mockStubUseParams = mocked(useParams);
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

describe('Routing', () => {
  it('can render HomePage', () => {
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </RecoilRoot>
    );

    expect(screen.getByTestId(TestIds.PAGE_HOME)).toBeInTheDocument();
  });

  it('can render MenuPage', () => {
    mockStubUseParams.mockReturnValue({ targetOid: 'sample-oid-123' });
    render(
      <RecoilRoot>
        <MemoryRouter initialEntries={['/*/stage']}>
          <App />
        </MemoryRouter>
      </RecoilRoot>
    );
    expect(screen.getByTestId(TestIds.PAGE_MAIN)).toBeInTheDocument();
    expect(
      screen.getByTestId(`${TestIds.PAGE_MAIN}-sample-oid-123`)
    ).toBeInTheDocument();
  });
});
