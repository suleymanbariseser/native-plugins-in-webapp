import { MessageType } from '../../../types/Communication';
import CommunicationBridgeWebSide from './CommunicationBridgeWebSide';

export type StorageReadKeyType = 'STORAGE_READ';
export type StorageReadDataType = {
  key: string;
};
export type StorageReadResponseType = string;
export type StorageReadMessageType = Omit<
  MessageType<StorageReadKeyType, StorageReadDataType>,
  'idempotence'
>;

export type StorageWriteKeyType = 'STORAGE_WRITE';
export type StorageWriteDataType = {
  key: string;
  value: string;
};

export type StorageWriteMessageType = Omit<
  MessageType<StorageWriteKeyType, StorageWriteDataType>,
  'idempotence'
>;

class RNStorage {
  static async read(
    key: StorageReadMessageType['data']['key']
  ): Promise<string> {
    const message: StorageReadMessageType = {
      key: 'STORAGE_READ',
      data: {
        key,
      },
    };

    const communication = new CommunicationBridgeWebSide<
      StorageReadKeyType,
      StorageReadDataType
    >();

    // send message to native app
    communication.sendMessage(message);

    // now, wait for the response
    return communication.receiveMessage<StorageReadResponseType>();

  }

  static async write(
    key: StorageWriteMessageType['data']['key'],
    value: StorageWriteMessageType['data']['value']
  ) {
    const message: StorageWriteMessageType = {
      key: 'STORAGE_WRITE',
      data: {
        key,
        value,
      },
    };

    const communication = new CommunicationBridgeWebSide<
      StorageWriteKeyType,
      StorageReadDataType
    >();

    // send message to native app
    communication.sendMessage(message);

    // now, wait for the response
    return communication.receiveMessage();
  }
}

export default RNStorage;
