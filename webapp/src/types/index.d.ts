export {};

declare global {
  interface Window {
    nativePlatform: 'ios' | 'android';
    ReactNativeWebView: {
        postMessage(string): void
    }
  }
}