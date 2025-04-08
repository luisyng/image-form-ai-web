import { ProcessMethod } from './process-method';

export abstract class ProcessManager<T, R> {
  constructor(protected processMethod: ProcessMethod) {}
  
  abstract processData(data: T): Promise<R>;

  getProcessName(): string {
    return this.processMethod.name || 'Data Processing';
  }
} 