// helpers/storageHelper.js

import { Note } from "../types/noteType";

// export const getStorageData = (keys:Array<String>):Promise<Record<string, any>> => {
//     return new Promise((resolve) => {
//       chrome.storage.local.get(keys, (data) => {
//         resolve(data);
//       });
//     });
//   };

export const getCurrentTabUrl = ():Promise<string|null> => {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs[0]?.url || null);
      });
    });
  };

  export const getStorageData = (keys: string[]): Promise<Record<string, any>> => {//Recors<string,Note[]>
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(keys, (data) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(data);
        }
      });
    });
  };
//   export const setStorageData = (items:Record<string, Note[]>
//   ):Promise<void> => {
//     return new Promise((resolve) => {
//       chrome.storage.local.set(items, () => {
//         resolve();
//       });
//     });
//   };
  export const setStorageData = (items: Record<string, any>): Promise<void> => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(items, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  };

  
//   export const updateNotes = async (type, noteUpdater) => {
//     if (type === 'local') {
//       const currentUrl = await getCurrentTabUrl();
//       if (!currentUrl) return;
      
//       const data = await getStorageData(['local']);
//       const notes = data.local || {};
//       if (!notes[currentUrl]) notes[currentUrl] = [];
//       noteUpdater(notes[currentUrl]);
//       await setStorageData({ local: notes });
//     } else {
//       const data = await getStorageData(['global']);
//       const notes = data.global || [];
//       noteUpdater(notes);
//       await setStorageData({ global: notes });
//     }
//   };
  
export const updateNotes = async (
    type: 'local' | 'global',
    updateFn: (notes: Note[]) => void
  ): Promise<void> => {
    const currentUrl = type === 'local' ? await getCurrentTabUrl() : null;
    if (type === 'local' && !currentUrl) return;
  
    const key = type === 'local' ? 'local' : 'global';
    const data = await getStorageData([key]);
    
    if (type === 'local') {
      const notes: Record<string, any[]> = data.local || {};
      if (!notes[currentUrl!]) notes[currentUrl!] = [];
      updateFn(notes[currentUrl!]);
      console.log(notes)
      await setStorageData({ local: notes });
    } else {
      const notes: any[] = data.global || [];
      updateFn(notes);
      console.log(notes)
      await setStorageData({ global: notes });
    }
  };

  