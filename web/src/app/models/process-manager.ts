/**
 * Interface for process managers that handle data processing operations.
 * 
 * @template T The input data type
 * @template R The result data type
 */
export interface ProcessManager<T, R> {
  /**
   * Process the input data and return a promise with the result.
   * 
   * @param data The input data to process
   * @returns A promise that resolves with the processed result
   */
  processData: (data: T) => Promise<R>;
  
  /**
   * Get the display name of the process.
   * 
   * @returns The name of the process
   */
  getProcessName: () => string;
} 