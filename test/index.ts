import { Test, run } from 'beater';
export * from './example';

const tests = ([] as Test[]);

run(tests).catch(() => process.exit(1));
