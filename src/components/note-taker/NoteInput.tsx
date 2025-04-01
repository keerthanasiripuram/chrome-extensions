// NoteInput.tsx
import React from 'react';
import { NoteType } from '../../types/noteType'

interface NoteInputProps {
  noteInput: string;
  setNoteInput: (input: string) => void;
  addNote: (type: NoteType) => void;
}

const NoteInput: React.FC<NoteInputProps> = ({ noteInput, setNoteInput, addNote }) => (
  <div>
    <textarea value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="Enter your note..." />
    <button onClick={() => addNote('local')}>Add Local Note</button>
    <button onClick={() => addNote('global')}>Add Global Note</button>
  </div>
);

export default NoteInput;

