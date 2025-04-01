import React, { useState, useEffect } from 'react';
import DisplayData from './DisplayData';
import "../GlobalStyles.css"
import { getCurrentTabUrl, getStorageData, updateNotes } from '../../helpers/noteTaker';

export type Note = {
  content: string;
  timestamp: string;
};

export type NoteType = 'local' | 'global';

const NoteTaker1: React.FC = () => {
  const [localNotes, setLocalNotes] = useState<Note[]>([]);
  const [globalNotes, setGlobalNotes] = useState<Note[]>([]);
  const [noteInput, setNoteInput] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editType, setEditType] = useState<NoteType | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const currentUrl = await getCurrentTabUrl();
    const data = await getStorageData(['local', 'global']);
    console.log("data",data)
    const localData = currentUrl ? data.local?.[currentUrl] || [] : [];
    const globalData = data.global || [];
    console.log("localdata",localData)
    console.log("globaldata",globalData)
    setLocalNotes(localData);
    setGlobalNotes(globalData);
  };
  
//   const loadNotes = () => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       const currentUrl = tabs[0]?.url;
//       chrome.storage.local.get(['local', 'global'], (data) => {
//         const localData: Note[] = currentUrl ? data.local?.[currentUrl] || [] : [];
//         const globalData: Note[] = data.global || [];
//         setLocalNotes(localData);
//         setGlobalNotes(globalData);
//       });
//     });
//   };

  const addNote = async (type:NoteType) => {
    if (!noteInput.trim()) return alert('Note cannot be empty!');
    const note = { content: noteInput.trim(), timestamp: new Date().toISOString() };
  
    await updateNotes(type, (notes: Note[]) => notes.push(note));
    loadNotes();
    setNoteInput('');
  };
  
//   const addNote = (type: NoteType) => {
//     if (!noteInput.trim()) return alert('Note cannot be empty!');
//     const note: Note = { content: noteInput.trim(), timestamp: new Date().toISOString() };

//     if (type === 'local') {
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         const currentUrl = tabs[0]?.url;
//         if (!currentUrl) return;

//         chrome.storage.local.get(['local'], (data) => {
//           const notes: Record<string, Note[]> = data.local || {};
//           if (!notes[currentUrl]) notes[currentUrl] = [];
//           notes[currentUrl].push(note);
//           chrome.storage.local.set({ local: notes }, loadNotes);
//         });
//       });
//     } else {
//       chrome.storage.local.get(['global'], (data) => {
//         const notes: Note[] = data.global || [];
//         notes.push(note);
//         chrome.storage.local.set({ global: notes }, loadNotes);
//       });
//     }
//     setNoteInput('');
//   };

  const startEditing = (type: NoteType, index: number, content: string) => {
    setEditIndex(index);
    setEditType(type);
    setEditContent(content);
  };

//   const saveEdit = () => {
//     if (editIndex === null || !editType) return;
//     if (!editContent.trim()) return alert('Note content cannot be empty!');

//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       const currentUrl = tabs[0]?.url;

//       if (editType === 'local' && currentUrl) {
//         chrome.storage.local.get(['local'], (data) => {
//           const notes: Record<string, Note[]> = data.local || {};
//           if (notes[currentUrl]) {
//             notes[currentUrl][editIndex].content = editContent.trim();
//             chrome.storage.local.set({ local: notes }, loadNotes);
//           }
//         });
//       } else {
//         chrome.storage.local.get(['global'], (data) => {
//           const notes: Note[] = data.global || [];
//           notes[editIndex].content = editContent.trim();
//           chrome.storage.local.set({ global: notes }, loadNotes);
//         });
//       }
//     });

//     setEditIndex(null);
//     setEditType(null);
//     setEditContent('');
//   };

  const saveEdit = async () => {
    if (editIndex === null || !editType) return;
    if (!editContent.trim()) return alert('Note content cannot be empty!');
  
    await updateNotes(editType, (notes) => {
      if (notes[editIndex]) notes[editIndex].content = editContent.trim();
    });
  
    loadNotes();
    setEditIndex(null);
    setEditType(null);
    setEditContent('');
  };
  
//   const saveEdit = async () => {
//     if (editIndex === null || !editType) return;
//     if (!editContent.trim()) return alert('Note content cannot be empty!');
  
//     await updateNotes(editType, (notes) => {
//       if (notes[editIndex]) notes[editIndex].content = editContent.trim();
//     });
  
//     loadNotes();
//     setEditIndex(null);
//     setEditType(null);
//     setEditContent('');
//   };
  
  
//   const removeNote = (type: NoteType, index: number) => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       const currentUrl = tabs[0]?.url;

//       if (type === 'local' && currentUrl) {
//         chrome.storage.local.get(['local'], (data) => {
//           const notes: Record<string, Note[]> = data.local || {};
//           if (notes[currentUrl]) {
//             notes[currentUrl].splice(index, 1);
//             chrome.storage.local.set({ local: notes }, loadNotes);
//           }
//         });
//       } else {
//         chrome.storage.local.get(['global'], (data) => {
//           const notes: Note[] = data.global || [];
//           notes.splice(index, 1);
//           chrome.storage.local.set({ global: notes }, loadNotes);
//         });
//       }
//     });
//   };

  const removeNote = async (type:NoteType, index:number) => {
    await updateNotes(type, (notes) => notes.splice(index, 1));
    loadNotes();
  };
  
  return (
    <div>
      <h2>Smart Notes</h2>
      <textarea value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="Enter your note..." />
      <button onClick={() => addNote('local')}>Add Local Note</button>
      <button onClick={() => addNote('global')}>Add Global Note</button>
      <DisplayData type="local" notes={localNotes} editType={editType} editIndex={editIndex} editContent={editContent}
        saveEdit={saveEdit} setEditContent={setEditContent} startEditing={startEditing} removeNote={removeNote} />
      <DisplayData type="global" notes={globalNotes} editType={editType} editIndex={editIndex} editContent={editContent}
        saveEdit={saveEdit} setEditContent={setEditContent} startEditing={startEditing} removeNote={removeNote} />
    </div>
  );
};

export default NoteTaker1;
