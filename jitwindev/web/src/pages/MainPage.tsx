import React from 'react';
import { useParams } from 'react-router-dom';
import { TestIds } from 'tests/TestIds';
import styles from './MainPage.module.scss';
import HeaderPanel from '../Components/HeaderPanel';

export default function MainPage() {
  const { targetOid } = useParams();

  return (
    <div className={styles.base} data-testid={TestIds.PAGE_MAIN}>
      <div data-testid={`${TestIds.PAGE_MAIN}-${targetOid}`} />
      <div className={styles.container}>
        <HeaderPanel />
        <div className={styles.vMargin}>
          <h1>Main</h1>
        </div>
      </div>
    </div>
  );
}
