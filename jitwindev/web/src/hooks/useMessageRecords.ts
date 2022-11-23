import { atom, useRecoilState } from 'recoil';
import { MessageRecord } from 'models/MessageRecord';
import { useCallback, useEffect, useState } from 'react';

const recoilState = atom<Array<MessageRecord>>({
  key: 'messageRecords',
  default: [],
});

export const useMessageRecords: () => [
  (record: MessageRecord) => void,
  Array<MessageRecord>
] = () => {
  const [messageRecords, setMessageRecords] = useRecoilState(recoilState);
  const [newRecord, setNewRecord] = useState<MessageRecord | undefined>();

  const addMessage = useCallback((record: MessageRecord) => {
    setNewRecord(record);
  }, []);

  useEffect(() => {
    if (newRecord) {
      setMessageRecords([newRecord, ...messageRecords]);
    }
  }, [newRecord]); // eslint-disable-line react-hooks/exhaustive-deps

  return [addMessage, messageRecords];
};

export function newMessage(message: string): MessageRecord {
  return { dateTimeReal: new Date(Date.now()), message };
}
