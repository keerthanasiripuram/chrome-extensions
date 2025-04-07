// export const chromeStorageAPI = {
//   set: (key, value) => {
//     if(!key || !value) {

//     }
//     chrome.storage.local.set(key, value);
//   },
//   get: (key) => {
//     chrome.storage.local.get(key);
//   }
// }

import { Note } from "./note.type";

interface StorageData {
  local?: Record<string, Note[]>; 
  global?: Note[]; 
}


export const getCurrentTabUrl = (): Promise<string | null> => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]?.url || null);
    });
  });
};

export const getStorageData = (keys: string[]): Promise<StorageData> => {//chnge type
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

export const setStorageData = (items: Record<string, Note[] | Record<string, Note[]>>):Promise<void> => {
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

export const updateNotes = async (
  type: 'local' | 'global',
  updateFn: (notes: Note[]) => void
): Promise<void> => {
  const currentUrl = type === 'local' ? await getCurrentTabUrl() : null;
  if (type === 'local' && !currentUrl) return;

  const key = type === 'local' ? 'local' : 'global';
  const data = await getStorageData([key]);

  if (type === 'local') {
    const notes: Record<string, Note[]> = data.local || {};//an
    if (!notes[currentUrl!]) notes[currentUrl!] = [];
    updateFn(notes[currentUrl!]);
    await setStorageData({ local: notes });
  } else {
    const notes: Note[] = data.global || [];//a
    updateFn(notes);
    await setStorageData({ global: notes });
  }
};

