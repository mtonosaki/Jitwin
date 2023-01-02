export type LogLevel = 'ERR' | 'WAR' | 'INF' | 'DBG';

export type LogRecord = {
  level: LogLevel;
  message: string;
};

export function newLog(message: string, level: LogLevel = 'INF'): LogRecord {
  return {
    level,
    message,
  };
}

export type callbackAddLog = (log: LogRecord) => void;
