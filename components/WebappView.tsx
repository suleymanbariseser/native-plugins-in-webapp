import AsyncStorage from '@react-native-async-storage/async-storage';
import isPromise from 'is-promise';
import React, { useCallback, useRef } from 'react';
import { Platform, Share } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { MessageType } from '../types/Communication';
import CommunicationBridgeNativeSide from '../utils/CommunicationBridgeNativeSide';

export type Keys = 'STORAGE_READ' | 'STORAGE_WRITE' | 'SHARE' | 'LOG';

const injectedJavaScript = `
  window.nativePlatform = '${Platform.OS}';
`;

const WebappView = () => {
  const webRef = useRef<WebView>(null);

  const getDataFromPlugin = useCallback(
    (nativeData: MessageType<Keys, any>) => {
      switch (nativeData.key) {
        case 'STORAGE_READ':
          return AsyncStorage.getItem(nativeData.data.key);
        case 'STORAGE_WRITE':
          return AsyncStorage.setItem(
            nativeData.data.key,
            nativeData.data.value
          );
        case 'SHARE':
          return Share.share(nativeData.data.content, nativeData.data.options);
        default:
          return Promise.resolve(false);
      }
    },
    []
  );

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const eventData = event.nativeEvent.data;

      // if data is not string then it is not ours
      if (typeof eventData !== 'string') return false;

      // parse event data
      const nativeData = JSON.parse(eventData) as MessageType<Keys, any>;

      /** each event of us contains key and idempotence so if there is no this data
       * then it means it is not our event
       */
      if (!(nativeData.key && nativeData.idempotence)) return false;
      console.log(nativeData);

      const communication = new CommunicationBridgeNativeSide(webRef);

      // get response from responding plugin
      const response = getDataFromPlugin(nativeData);

      // create a response and send it to client
      const sendResponse = (value: any, isError = false) => {
        const newData = {
          idempotence: nativeData.idempotence,
          key: nativeData.key,
          ...(!isError
            ? { data: value }
            : {
                error: {
                  message: value.message,
                  stack: value.stack,
                },
              }),
        } as MessageType<string, any>;

        communication.sendMessage(newData);
      };

      // if plugins returns a promise then, wait for it to be done
      if (isPromise(response)) {
        response
          .then((value) => {
            sendResponse(value);
          })
          .catch((error) => {
            sendResponse(error, true);
          });
      } else {
        sendResponse(response);
      }
    },
    [webRef]
  );

  return (
    <WebView
      ref={webRef}
      originWhitelist={['*']}
      allowFileAccess={true}
      source={{
        uri:
          Platform.OS === 'android'
            ? 'http://10.0.2.2:3000/'
            : 'http://localhost:3000/',
      }}
      cacheEnabled
      javaScriptEnabled
      domStorageEnabled={true}
      allowUniversalAccessFromFileURLs={true}
      allowFileAccessFromFileURLs={true}
      mixedContentMode='always'
      injectedJavaScript={injectedJavaScript}
      onMessage={onMessage}
    />
  );
};

export default WebappView;
