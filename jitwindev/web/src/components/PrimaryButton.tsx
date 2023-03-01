import React, { ButtonHTMLAttributes } from 'react'
import classNames from 'classnames'
import styles from './PrimaryButton.module.scss'

type Props = {
  icon?: 'login'
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function PrimaryButton({
  className,
  icon,
  children,
  disabled,
  onClick,
  ...originalProps
}: Props) {
  return (
    <div>
      <button
        type="button"
        className={classNames(styles.primary, className)}
        disabled={disabled}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...originalProps}
        onClick={(e) => {
          if (!disabled && onClick) {
            onClick(e)
          }
        }}
      >
        {icon && (
          <img
            className={disabled ? styles.iconDisabled : styles.iconEnabled}
            src={`/icons/${icon}.svg`}
            alt={`${icon}-icon`}
          />
        )}
        {children}
      </button>
    </div>
  )
}
