import React from 'react';
import { useParams } from 'react-router-dom';
import { TestIds } from '../tests/TestIds';
import styles from './MenuPage.module.scss';

export default function MenuPage() {
  const { targetOid } = useParams();

  return (
    <div className={styles.base} data-testid={TestIds.PAGE_MENU}>
      <div data-testid={`${TestIds.PAGE_MENU}-${targetOid}`} />
      <div className={styles.container}>
        <div className={styles.vMargin}>Menu</div>
      </div>
    </div>
  );
}
