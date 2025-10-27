import { contextBridge, ipcRenderer } from 'electron'

declare global {
  interface Window {
    App: typeof API
    ipcRenderer: typeof ipcRendererAPI
  }
}

const API = {
  sayHelloFromBridge: () => console.log('\nHello from bridgeAPI! 👋\n\n'),
  username: process.env.USER,
}

// Store mapping of user listeners to wrapped listeners for proper cleanup
const listenerMap = new WeakMap<Function, Function>();

const ipcRendererAPI = {
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
  send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
  on: (channel: string, listener: (...args: any[]) => void) => {
    const wrappedListener = (_event: any, ...args: any[]) => {
      listener(...args);
    };
    listenerMap.set(listener, wrappedListener);
    ipcRenderer.on(channel, wrappedListener);
  },
  off: (channel: string, listener: (...args: any[]) => void) => {
    const wrappedListener = listenerMap.get(listener);
    if (wrappedListener) {
      ipcRenderer.removeListener(channel, wrappedListener);
      listenerMap.delete(listener);
    }
  },
}

contextBridge.exposeInMainWorld('App', API)
contextBridge.exposeInMainWorld('ipcRenderer', ipcRendererAPI)
