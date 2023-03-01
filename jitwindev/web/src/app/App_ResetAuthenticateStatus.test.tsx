import React from 'react'
import { act, render } from '@testing-library/react'
import HomePage from 'pages/HomePage'
import UsersRepositoryBackend from 'repos/UsersRepositoryBackend'
import { useAuthenticateStatus } from 'hooks/useAuthenticateStatus'
import { RecoilRoot } from 'recoil'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

jest.mock('repos/UsersRepositoryBackend')
jest.mock('pages/HomePage')
jest.mock('hooks/useAuthenticateStatus')

describe('Authenticate Status', () => {
  it('After exit App, status become beforeConfirm', async () => {
    ;(HomePage as jest.Mock).mockReturnValue(<div>FakeHomePage</div>)
    ;(UsersRepositoryBackend as jest.Mock).mockImplementation(() => ({
      getMe: () => Promise.reject(),
    }))

    let lastStatus = ''
    ;(useAuthenticateStatus as any).mockReturnValue([
      'error',
      (val: string) => {
        lastStatus = val
      },
    ])

    let renderingHandle: any
    await act(async () => {
      renderingHandle = await render(
        <RecoilRoot>
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        </RecoilRoot>
      )
    })
    renderingHandle.unmount()

    expect(lastStatus).toBe('beforeConfirm')
  })
})
