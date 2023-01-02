import HeaderPanel from 'components/HeaderPanel';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { newMessage, useMessageRecords } from 'hooks/useMessageRecords';
import JitStage from 'jit/JitStage';
import { GuiFeatureCollection } from 'mvfp/GuiFeatureCollection';
import { CallbackAddLog } from 'mvfp/utils/LogSystem';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SessionRepository from 'repos/SessionRepository';
import { TestIds } from 'tests/TestIds';
import styles from './MainPage.module.scss';

type Props = {
  sessionRepository: SessionRepository;
  features: GuiFeatureCollection;
};

export default function MainPage({ sessionRepository, features }: Props) {
  const { targetOid } = useParams();
  const [isReadonly, setIsReadonly] = useState(true);
  const [authenticatedUser] = useAuthenticatedUser();
  const [addMessage] = useMessageRecords();

  useEffect(() => {
    setIsReadonly(authenticatedUser?.userId !== targetOid);
  }, [targetOid, authenticatedUser]);

  const onAddLog: CallbackAddLog = (log) => {
    const level = log.level.substr(0, 1);
    addMessage(newMessage(`[${level}] ${log.message}`));
  };

  return (
    <div className={styles.base} data-testid={TestIds.PAGE_MAIN}>
      <div data-testid={`${TestIds.PAGE_MAIN}-${targetOid}`} />
      <div className={styles.container}>
        <HeaderPanel sessionRepository={sessionRepository} />
        <div className={styles.vMargin}>
          <JitStage
            isReadonly={isReadonly}
            features={features}
            onAddLog={onAddLog}
          />
        </div>
      </div>
    </div>
  );
}
