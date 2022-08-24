export interface MessageError {
  message: string;
  stack?: string;
}

export interface MessageType<K extends string, T> {
  key: K;
  idempotence: string;
  data: T;
  error?: MessageError;
}
