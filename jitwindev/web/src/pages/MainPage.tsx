import { callbackAddLog } from 'mvfp/utils/LogSystem'
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TestIds } from 'tests/TestIds';
import HeaderPanel from 'components/HeaderPanel';
import SessionRepository from 'repos/SessionRepository';
import JitStage from 'jit/JitStage';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import styles from './MainPage.module.scss';

type Props = {
  sessionRepository: SessionRepository;
};

export default function MainPage({ sessionRepository }: Props) {
  const { targetOid } = useParams();
  const [isReadonly, setIsReadonly] = useState(true);
  const [authenticatedUser] = useAuthenticatedUser();

  useEffect(() => {
    setIsReadonly(authenticatedUser?.userId !== targetOid);
  }, [targetOid, authenticatedUser]);

  const onAddLog: callbackAddLog = (log) => {

  }

  return (
    <div className={styles.base} data-testid={TestIds.PAGE_MAIN}>
      <div data-testid={`${TestIds.PAGE_MAIN}-${targetOid}`} />
      <div className={styles.container}>
        <HeaderPanel sessionRepository={sessionRepository} />
        <div className={styles.vMargin}>
          <JitStage isReadonly={isReadonly} features={[]} onAddLog={onAddLog} />
        </div>
      </div>
    </div>
  );
}
