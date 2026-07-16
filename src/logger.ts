import log from 'electron-log';

// electron-log (Technical-Context.MD instrumentation) writes to a per-OS log file
// and, in dev, the console. Open-Meteo call failures and unhandled errors are logged
// at ERROR. Usable in both the main and renderer processes.
export const logger = log;
