import React, { useState, useEffect } from 'react';
import DisplayData from './DisplayData';
import "../../global-styles.css"
import { Note, NoteType } from './note.type';
import { getCurrentTab, getStorageData, setStorageData } from './noteTaker2.helper';

const NoteTaker2: React.FC = () => {
    const [localNotes, setLocalNotes] = useState<Note[]>([]);
    const [globalNotes, setGlobalNotes] = useState<Note[]>([]);
    const [noteInput, setNoteInput] = useState<string>('');
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editType, setEditType] = useState<NoteType | null>(null);
    const [editContent, setEditContent] = useState<string>('');


    //place:since tabs.qury, strge.get,set av;lble in popup wrtn hre itslf
    //all these were supprtng prmises
    //hndled errs
    //crctd few cutm errs cz fr empty data prmse wnt reject
    //segrte 
    //api's are nt expsd here
    useEffect(() => {
        loadNotes();
    }, []);

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

    // const loadNotes = async () => {
    //     try {
    //         const tabs = await chrome.tabs.query({ active: true, currentWindow: true });//no ts
    //         if (!tabs.length) {
    //             throw new Error("No tabs found")
    //         }
    //         const currentUrl = tabs[0].url;//shld i wrte type fr ds too

    //         const data = await chrome.storage.local.get(['local', 'global']);
    //         if (!data) {
    //             throw new Error("No data found in storage with specified keys")
    //         }
    //         const localData = currentUrl ? data.local?.[currentUrl] || [] : [];//type
    //         const globalData = data.global || [];//type

    //         setLocalNotes(localData);
    //         setGlobalNotes(globalData);
    //     } catch (error) {
    //         console.error("Error loading notes:", error);
    //     }
    // };

    const loadNotes = async () => {
        try {
            const tabs = await getCurrentTab()
            if (!tabs.length) {
                throw new Error("No tabs found")
            }
            const currentUrl = tabs[0].url;//shld i wrte type fr ds too

            const data = await getStorageData(['local','global'])
            if (!data) {
                throw new Error("No data found in storage with specified keys")
            }
            const localData = currentUrl ? data.local?.[currentUrl] || [] : [];//type
            const globalData = data.global || [];//type

            setLocalNotes(localData);
            setGlobalNotes(globalData);
        } catch (error) {
            console.error("Error loading notes:", error);
        }
    };
    // const loadNotes = () => asyncWrapper(async () => {
    //     const tabs = await getCurrentTab();
    //     if (!tabs || !tabs.length) throw new CustomAPIError("No active tabs found");
    
    //     const currentUrl = tabs[0].url;
    //     const data = await getStorageData<{ local: Record<string, any>; global: any[] }>(["local", "global"]);
        
    //     if (!data) throw new CustomAPIError("No data found in storage");
    
    //     const localData: any[] = currentUrl ? data.local?.[currentUrl] || [] : [];
    //     const globalData: any[] = data.global || [];
    
    //     setLocalNotes(localData);
    //     setGlobalNotes(globalData);
    // });
    
    const addNote = async (type: NoteType) => {
        //input valdtn
        if (!noteInput.trim()) return alert('Note cannot be empty!');

        const note: Note = { content: noteInput.trim(), timestamp: new Date().toISOString() };

        if (type === 'local') {
            const tabs = await getCurrentTab()
            //without await cnsdrd as callbck n type gvn as const tabs: Promise<chrome.tabs.Tab[]>
            //with await trtd as prmse n type gvn as const tabs: chrome.tabs.Tab[]
            if (!tabs) {
                throw new Error("No current tab found")
            }
            const currentUrl = tabs[0].url;//ty
            if (!currentUrl) return;

            // const data = await chrome.storage.local.get(['local'])
            const data=await getStorageData(['local'])
            if (!data) {
                throw new Error("No local Data found")
            }
            const notes: Record<string, Note[]> = data.local || {};//why again ds whn we r gtng lcl data
            if (!notes[currentUrl]) notes[currentUrl] = [];
            notes[currentUrl].push(note);
            // await chrome.storage.local.set({ local: notes });
            await setStorageData("local",notes)
            loadNotes()
        } else {
            // const data = await chrome.storage.local.get(['global'])
            const data=await getStorageData(['global'])
            const notes: Note[] = data.global || [];
            notes.push(note);
            // await chrome.storage.local.set({ global: notes });
            await setStorageData("global",notes)
            loadNotes()
        }
        setNoteInput('');
    };


    // const addNote = (type: NoteType) => {
    //     if (!noteInput.trim()) return alert('Note cannot be empty!');
    //     const note: Note = { content: noteInput.trim(), timestamp: new Date().toISOString() };

    //     if (type === 'local') {
    //         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //             const currentUrl = tabs[0]?.url;
    //             if (!currentUrl) return;

    //             chrome.storage.local.get(['local'], (data) => {
    //                 const notes: Record<string, Note[]> = data.local || {};
    //                 if (!notes[currentUrl]) notes[currentUrl] = [];
    //                 notes[currentUrl].push(note);
    //                 chrome.storage.local.set({ local: notes }, loadNotes);
    //             });
    //         });
    //     } else {
    //         chrome.storage.local.get(['global'], (data) => {
    //             const notes: Note[] = data.global || [];
    //             notes.push(note);
    //             chrome.storage.local.set({ global: notes }, loadNotes);
    //         });
    //     }
    //     setNoteInput('');
    // };

    const startEditing = (type: NoteType, index: number, content: string) => {
        setEditIndex(index);
        setEditType(type);
        setEditContent(content);
    };

    // const saveEdit = () => {
    //     if (editIndex === null || !editType) return;
    //     if (!editContent.trim()) return alert('Note content cannot be empty!');

    //     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //         const currentUrl = tabs[0]?.url;

    //         if (editType === 'local' && currentUrl) {
    //             chrome.storage.local.get(['local'], (data) => {
    //                 const notes: Record<string, Note[]> = data.local || {};
    //                 if (notes[currentUrl]) {
    //                     notes[currentUrl][editIndex].content = editContent.trim();
    //                     chrome.storage.local.set({ local: notes }, loadNotes);
    //                 }
    //             });
    //         } else {
    //             chrome.storage.local.get(['global'], (data) => {
    //                 const notes: Note[] = data.global || [];
    //                 notes[editIndex].content = editContent.trim();
    //                 chrome.storage.local.set({ global: notes }, loadNotes);
    //             });
    //         }
    //     });

    //     setEditIndex(null);
    //     setEditType(null);
    //     setEditContent('');
    // };
    const saveEdit = async () => {
        //i/p valdtns
        if (editIndex === null || !editType) return;
        if (!editContent.trim()) return alert('Note content cannot be empty!');

        const tabs = await getCurrentTab()
        if (!tabs) {
            throw new Error("No current tab found")
        }
        const currentUrl = tabs[0]?.url;//ty

        if (editType === 'local' && currentUrl) {
            // const data = await chrome.storage.local.get(['local'])
            const data=await getStorageData(['local'])
            if (!data) {
                throw new Error("No local Data found")
            }
            const notes: Record<string, Note[]> = data.local || {};
            if (notes[currentUrl]) {
                notes[currentUrl][editIndex].content = editContent.trim();
                // await chrome.storage.local.set({ local: notes });
                await setStorageData("local",notes)
                loadNotes()
            }
        } else {
            const data=await getStorageData(['global'])
            // const data = await chrome.storage.local.get(['global'])
            const notes: Note[] = data.global || [];
            notes[editIndex].content = editContent.trim();//ty
            // await chrome.storage.local.set({ global: notes });
            await setStorageData("global",notes)
            loadNotes();
        }
        setEditIndex(null);
        setEditType(null);
        setEditContent('');
    };
    // const removeNote = (type: NoteType, index: number) => {
    //     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //         const currentUrl = tabs[0]?.url;

    //         if (type === 'local' && currentUrl) {
    //             chrome.storage.local.get(['local'], (data) => {
    //                 const notes: Record<string, Note[]> = data.local || {};
    //                 if (notes[currentUrl]) {
    //                     notes[currentUrl].splice(index, 1);
    //                     chrome.storage.local.set({ local: notes }, loadNotes);
    //                 }
    //             });
    //         } else {
    //             chrome.storage.local.get(['global'], (data) => {
    //                 const notes: Note[] = data.global || [];
    //                 notes.splice(index, 1);
    //                 chrome.storage.local.set({ global: notes }, loadNotes);
    //             });
    //         }
    //     });
    // };
    const removeNote = async (type: NoteType, index: number) => {
        const tabs = await getCurrentTab()
        if (!tabs) {
            throw new Error("No current tab found")
        }
        const currentUrl = tabs[0]?.url;//ty

        if (type === 'local' && currentUrl) {
            const data=await getStorageData(['local'])
            // const data = await chrome.storage.local.get(['local'])
            const notes: Record<string, Note[]> = data.local || {};
            if (notes[currentUrl]) {
                notes[currentUrl].splice(index, 1);
                // await chrome.storage.local.set({ local: notes });
                await setStorageData("local",notes)
                loadNotes();
            }
        } else {
            const data=await getStorageData(['global'])
            // const data = await chrome.storage.local.get(['global'])
            const notes: Note[] = data.global || [];
            notes.splice(index, 1);
            // await chrome.storage.local.set({ global: notes });
            await setStorageData("global",notes)
            loadNotes();
        }
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

export default NoteTaker2;
