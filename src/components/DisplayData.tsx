import { Note, NoteType } from "./NoteTaker"

type DisplayDataProps={
    type: NoteType;
    notes:Note[],
    editType:NoteType | null,
    editIndex:number | null,
    editContent:string,
    saveEdit:()=>void,
    setEditContent: (value: string) => void,//usestte one
    startEditing:(type: NoteType, index: number, content: string) => void,//hw prnt listens to these chnges
    removeNote: (type: NoteType, index: number) => void
}

const DisplayData=(props:DisplayDataProps)=>{
    return(
        <>
         <h3>{props.type === 'local' ? 'Local Notes (Only visible on this page)' : 'Global Notes (Visible on all pages)'}</h3>
              <ul>
        {props.notes.map((note, index) => (
          <li key={index}>
            {props.editType === props.type && props.editIndex === index ? (
              <>
                <input type="text" value={props.editContent} onChange={(e) => props.setEditContent(e.target.value)} />
                <button onClick={props.saveEdit}>Save</button>
              </>
            ) : (
              <>
                <span>{note.content}</span>
                <button onClick={() => props.startEditing(props.type, index, note.content)}>✏️ Edit</button>
              </>
            )}
            <button onClick={() => props.removeNote(props.type, index)}>❌ Remove</button>
          </li>
        ))}
      </ul>
        </>
    )
}

export default DisplayData