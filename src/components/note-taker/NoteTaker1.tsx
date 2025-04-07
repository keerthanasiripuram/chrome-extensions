import React, { useState, useEffect } from 'react';
import DisplayData from './DisplayData';
import "../../global-styles.css"
import { getCurrentTabUrl, getStorageData, updateNotes } from './noteTaker.helper';
import { Note, NoteType } from './note.type';


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
        const localData = currentUrl ? data.local?.[currentUrl] || [] : [];
        const globalData = data.global || [];
        setLocalNotes(localData);
        setGlobalNotes(globalData);
    };

    const addNote = async (type: NoteType) => {
        if (!noteInput.trim()) return alert('Note cannot be empty!');
        const note = { content: noteInput.trim(), timestamp: new Date().toISOString() };
        await updateNotes(type, (notes: Note[]) => notes.push(note));
        loadNotes();
        setNoteInput('');
    };

    const startEditing = (type: NoteType, index: number, content: string) => {
        setEditIndex(index);
        setEditType(type);
        setEditContent(content);
    };

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

    const removeNote = async (type: NoteType, index: number) => {
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
