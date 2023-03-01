import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import PrimaryButton from './PrimaryButton'

describe('Primary Button', () => {
  it('when icon property as default, not show icon', () => {
    render(<PrimaryButton>Hoge</PrimaryButton>)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('when icon property set, show icon', () => {
    render(<PrimaryButton icon="login">Hoge</PrimaryButton>)

    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('given not disabled, when clicked, fire onClick', () => {
    const spyOnClick = jest.fn()
    render(<PrimaryButton onClick={spyOnClick}>Hoge</PrimaryButton>)

    fireEvent.click(screen.getByRole('button'))

    expect(spyOnClick).toBeCalled()
  })

  it('given disabled, when clicked, do NOT fire onClick', () => {
    const spyOnClick = jest.fn()
    render(
      <PrimaryButton disabled onClick={spyOnClick}>
        Hoge
      </PrimaryButton>
    )

    fireEvent.click(screen.getByRole('button'))

    expect(spyOnClick).not.toBeCalled()
  })

  it('when set child text, show it', () => {
    render(<PrimaryButton>Hoge</PrimaryButton>)

    expect(screen.getByText('Hoge')).toBeInTheDocument()
  })
})
