import React from 'react';
import styles from './DateTime.module.scss';

type Props = {
  value: number;
  vr: 'Virtual' | 'Real';
};

export default function DateTime({ value, vr }: Props) {
  const dateTime = new Date(value);
  const style = vr === 'Real' ? styles.real : styles.virtual;

  return (
    <span className={style}>
      {vr === 'Real' && <img src="/icons/real.svg" alt="real time" />}
      {vr === 'Virtual' && <img src="/icons/virtual.svg" alt="virtual time" />}
      <span>
        {String(dateTime.getHours()).padStart(2, '0')}:
        {String(dateTime.getMinutes()).padStart(2, '0')}
      </span>
      <span>:{String(dateTime.getSeconds()).padStart(2, '0')}</span>
    </span>
  );
}
