import { RefObject } from 'react';
import WebView from 'react-native-webview';
import { MessageType } from '../types/Communication';

class CommunicationBridgeNativeSide {
  webRef: RefObject<WebView>;

  constructor(webRef: RefObject<WebView>) {
    this.webRef = webRef;
  }

  sendMessage(message: MessageType<string, any>) {
    this.webRef.current?.postMessage(JSON.stringify(message));
  }
}

export default CommunicationBridgeNativeSide;
