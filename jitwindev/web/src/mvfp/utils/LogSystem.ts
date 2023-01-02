export type LogLevel = 'ERR' | 'WAR' | 'INF' | 'DBG';

export type LogRecord = {
  level: LogLevel;
  message: string;
};

export const newLog = (
  message: string,
  level: LogLevel = 'INF'
): LogRecord => ({
  level,
  message,
});

export type CallbackAddLog = (log: LogRecord) => void;
