import React from 'react';
import { useParams } from 'react-router-dom';
import { TestIds } from 'tests/TestIds';
import HeaderPanel from 'components/HeaderPanel';
import SessionRepository from 'repos/SessionRepository';
import styles from './MainPage.module.scss';

type Props = {
  sessionRepository: SessionRepository;
};

export default function MainPage({ sessionRepository }: Props) {
  const { targetOid } = useParams();

  return (
    <div className={styles.base} data-testid={TestIds.PAGE_MAIN}>
      <div data-testid={`${TestIds.PAGE_MAIN}-${targetOid}`} />
      <div className={styles.container}>
        <HeaderPanel sessionRepository={sessionRepository} />
        <div className={styles.vMargin}>
          <h1>Main</h1>
        </div>
      </div>
    </div>
  );
}
