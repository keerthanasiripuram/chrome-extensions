// import { Note, NoteType } from '../types/noteType';

// export const loadNotes = (setLocalNotes: Function, setGlobalNotes: Function) => {
//   console.log("load")
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const currentUrl = tabs[0]?.url;
//     chrome.storage.local.get(['local', 'global'], (data) => {
//       const localData: Note[] = currentUrl ? data.local?.[currentUrl] || [] : [];
//       const globalData: Note[] = data.global || [];
//       setLocalNotes(localData);
//       setGlobalNotes(globalData);
//     });
//   });
// };

// export const addNote = (type: NoteType, noteInput: string, setNoteInput: Function, loadNotes: Function) => {
//   console.log("heyyyy")
//   if (!noteInput.trim()) return alert('Note cannot be empty!');
//   const note: Note = { content: noteInput.trim(), timestamp: new Date().toISOString() };

//   if (type === 'local') {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       const currentUrl = tabs[0]?.url;
//       if (!currentUrl) return;
//       chrome.storage.local.get(['local'], (data) => {
//         const notes: Record<string, Note[]> = data.local || {};
//         if (!notes[currentUrl]) notes[currentUrl] = [];
//         notes[currentUrl].push(note);
//         chrome.storage.local.set({ local: notes }, () => loadNotes()); 
//       });
//     });
//   } else {
//     chrome.storage.local.get(['global'], (data) => {
//       const notes: Note[] = data.global || [];
//       notes.push(note);
//       chrome.storage.local.set({ local: notes }, () => loadNotes()); 
//     });
//   }
//   setNoteInput('');
// };

// export const saveEdit = (editIndex: number | null, editType: NoteType|null , editContent: string, loadNotes: Function) => {
//   console.log("edit")
//   if (editIndex === null || !editType || !editContent.trim()) return alert('Invalid edit!');

//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const currentUrl = tabs[0]?.url;
//     if (editType === 'local' && currentUrl) {
//       chrome.storage.local.get(['local'], (data) => {
//         const notes: Record<string, Note[]> = data.local || {};
//         if (notes[currentUrl]) {
//           notes[currentUrl][editIndex].content = editContent.trim();
//           chrome.storage.local.set({ local: notes }, () => loadNotes()); 
//         }
//       });
//     } else {
//       chrome.storage.local.get(['global'], (data) => {
//         const notes: Note[] = data.global || [];
//         chrome.storage.local.set({ local: notes }, () => loadNotes()); 
//       });
//     }
//   });
// };

// export const removeNote = (type: NoteType, index: number, loadNotes: Function) => {
//   console.log("remove")
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const currentUrl = tabs[0]?.url;
//     if (type === 'local' && currentUrl) {
//       chrome.storage.local.get(['local'], (data) => {
//         const notes: Record<string, Note[]> = data.local || {};
//         if (notes[currentUrl]) {
//           notes[currentUrl].splice(index, 1);
//           chrome.storage.local.set({ local: notes }, () => loadNotes()); 
//         }
//       });
//     } else {
//       chrome.storage.local.get(['global'], (data) => {
//         const notes: Note[] = data.global || [];
//         notes.splice(index, 1);
//         chrome.storage.local.set({ local: notes }, () => loadNotes()); 
//       });
//     }
//   });
// };


// export const startEditing = (type: NoteType, index: number, content: string,setEditIndex:Function,setEditType:Function,setEditContent:Function) => {
//   console.log("start editing")
//     setEditIndex(index);
//     setEditType(type);
//     setEditContent(content);
//   };



import { Note, NoteType } from '../types/noteType';

export const loadNotes = (setLocalNotes: Function, setGlobalNotes: Function) => {
  console.log("load")
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentUrl = tabs[0]?.url;
    chrome.storage.local.get(['local', 'global'], (data) => {
      const localData: Note[] = currentUrl ? data.local?.[currentUrl] || [] : [];
      const globalData: Note[] = data.global || [];
      setLocalNotes(localData);
      setGlobalNotes(globalData);
    });
  });
};

export const addNote = (type: NoteType, noteInput: string, setNoteInput: Function, loadNotes: Function) => {
  console.log("heyyyy")
  if (!noteInput.trim()) return alert('Note cannot be empty!');
  const note: Note = { content: noteInput.trim(), timestamp: new Date().toISOString() };

  if (type === 'local') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentUrl = tabs[0]?.url;
      if (!currentUrl) return;
      chrome.storage.local.get(['local'], (data) => {
        const notes: Record<string, Note[]> = data.local || {};
        if (!notes[currentUrl]) notes[currentUrl] = [];
        notes[currentUrl].push(note);
        chrome.storage.local.set({ local: notes }, () => loadNotes(setLocalNotes, setGlobalNotes)); 
      });
    });
  } else {
    chrome.storage.local.get(['global'], (data) => {
      const notes: Note[] = data.global || [];
      notes.push(note);
      chrome.storage.local.set({ global: notes }, () => loadNotes(setLocalNotes, setGlobalNotes)); 
    });
  }
  setNoteInput('');
};

export const saveEdit = (editIndex: number | null, editType: NoteType | null, editContent: string, loadNotes: Function) => {
  console.log("edit")
  if (editIndex === null || !editType || !editContent.trim()) return alert('Invalid edit!');

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentUrl = tabs[0]?.url;
    if (editType === 'local' && currentUrl) {
      chrome.storage.local.get(['local'], (data) => {
        const notes: Record<string, Note[]> = data.local || {};
        if (notes[currentUrl]) {
          notes[currentUrl][editIndex].content = editContent.trim();
          chrome.storage.local.set({ local: notes }, () => loadNotes()); 
        }
      });
    } else {
      chrome.storage.local.get(['global'], (data) => {
        const notes: Note[] = data.global || [];
        notes[editIndex!].content = editContent.trim();
        chrome.storage.local.set({ global: notes }, () => loadNotes()); 
      });
    }
  });
};

export const removeNote = (type: NoteType, index: number, loadNotes: Function) => {
  console.log("remove")
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentUrl = tabs[0]?.url;
    if (type === 'local' && currentUrl) {
      chrome.storage.local.get(['local'], (data) => {
        const notes: Record<string, Note[]> = data.local || {};
        if (notes[currentUrl]) {
          notes[currentUrl].splice(index, 1);
          chrome.storage.local.set({ local: notes }, () => loadNotes()); 
        }
      });
    } else {
      chrome.storage.local.get(['global'], (data) => {
        const notes: Note[] = data.global || [];
        notes.splice(index, 1);
        chrome.storage.local.set({ global: notes }, () => loadNotes()); 
      });
    }
  });
};

export const startEditing = (type: NoteType, index: number, content: string, setEditIndex: Function, setEditType: Function, setEditContent: Function) => {
  console.log("start editing")
  setEditIndex(index);
  setEditType(type);
  setEditContent(content);
};

