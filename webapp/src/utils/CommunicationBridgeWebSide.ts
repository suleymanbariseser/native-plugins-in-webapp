import { nanoid } from 'nanoid';
import { MessageType } from '../../../types/Communication';

export const isWebView = !!(window as any).ReactNativeWebView;

class CommunicationBridgeWebSide<K extends string, D> {
  idempotence: string;
  timeout: number;

  constructor(timeout = 10000) {
    this.idempotence = nanoid();
    this.timeout = timeout;
    if (!isWebView) throw new Error('NOT_IMPLEMENTED');
  }

  sendMessage(message: Omit<MessageType<K, D>, 'idempotence'>) {
    const newMessage = {
      ...message,
      idempotence: this.idempotence,
    };

    (isWebView
      ? (window as any).ReactNativeWebView
      : window.parent
    ).postMessage(JSON.stringify(newMessage), '*');
  }

  receiveMessage = <T>(): Promise<T> => {
    return new Promise((resolve, reject) => {
      const classThis = this;
      window.addEventListener('message', function messageListener(event) {
        const timer = setTimeout(() => {
          clearTimeout(timer);
          window.removeEventListener('message', messageListener);
          reject(new Error('TIMEOUT'));
        }, classThis.timeout);

        const req: MessageType<K, T> =
          event &&
          event.data &&
          typeof event.data === 'string' &&
          JSON.parse(event.data);

        if (req && req.idempotence === classThis.idempotence) {
          clearTimeout(timer);
          window.removeEventListener('message', messageListener);
          if (req.error) {
            return reject(req.error);
          }
          return resolve(req.data);
        }
      });
    });
  }
}

export default CommunicationBridgeWebSide;
