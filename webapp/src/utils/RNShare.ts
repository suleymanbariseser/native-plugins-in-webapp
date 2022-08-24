import { ShareContent, ShareOptions } from 'react-native';
import { MessageType } from '../../../types/Communication';
import CommunicationBridgeWebSide from './CommunicationBridgeWebSide';

export type ShareKeyType = 'SHARE';
export type ShareDataType = {
  content: ShareContent;
  options?: ShareOptions;
};

export type ShareMessageType = MessageType<ShareKeyType, ShareDataType>;

class RNShare {
  static async share(content: ShareContent, options?: ShareOptions) {
    const message: Omit<ShareMessageType, 'idempotence'> = {
      key: 'SHARE',
      data: {
        content,
        options,
      },
    };

    const communication = new CommunicationBridgeWebSide<ShareKeyType, ShareDataType>();

    // send message to native app
    communication.sendMessage(message);

    // now, wait for the response
    return communication.receiveMessage();
  }
}

export default RNShare;
