'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Note {
  _id?: string;
  user_id: string;
  module_id: string;
  content: string;
  createdAt?: string;
}

export default function ModuleDetails() {
  const params = useParams();
  const moduleId = params?.moduleId;

  const [module, setModule] = useState({
    title: '',
    description: '',
    resources: [] as string[],
  });
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  // Get userId from cookie
  useEffect(() => {
    const cookies = document.cookie;
    const userCookie = cookies.split('; ').find((cookie) => cookie.startsWith('user='));
    if (userCookie) {
      const user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
      setUserId(user.id ?? null); // default to null if user.id is undefined
    }
  }, []);

  // Fetch module details
  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        if (!moduleId) throw new Error('Module ID is missing.');

        const response = await fetch(`http://localhost:3001/modules/${moduleId}`);
        if (!response.ok) throw new Error('Failed to fetch module details.');

        const data = await response.json();
        setModule(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred.');
        }
      }
    };

    fetchModuleDetails();
  }, [moduleId]);

  // Fetch notes for the user and module
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        if (!moduleId || !userId) return;

        const url = `http://localhost:3001/notes/user/${userId}/module/${moduleId}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch notes.');

        const data = await response.json();
        setNotes(data);
      } catch (err) {
        if (err instanceof Error) {
          console.error('Error fetching notes:', err.message);
        } else {
          console.error('An unexpected error occurred.');
        }
      }
    };

    fetchNotes();
  }, [moduleId, userId]);

  // Handle creating a new note
  const handleCreateNote = async () => {
    try {
      // Log the values to see if they are set correctly
      console.log("newNote:", newNote);
      console.log("moduleId:", moduleId);
      console.log("userId:", userId);
  
      if (!newNote.trim() || !moduleId || !userId) {
        console.error('Missing data:', { newNote, moduleId, userId });
        return;
      }
  
      const noteData = {
        user_id: userId,
        module_id: moduleId,
        content: newNote,
      };
  
      const response = await fetch(`http://localhost:3001/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create note: ${errorData.message || 'Unknown error'}`);
      }
  
      const createdNote = await response.json();
      setNotes((prevNotes) => [...prevNotes, createdNote]);
      setNewNote('');
    } catch (err: any) {
      if (err instanceof Error) {
        console.error('Error:', err.message);
      } else {
        console.error('Unexpected error occurred:', err);
      }
    }
  };
  
    // Handle updating a note
  const handleUpdateNote = async (noteId: string) => {
    try {
      if (!editContent.trim()) {
        console.error('Content cannot be empty.');
        return;
      }

      const updatedNote = {
        content: editContent,
      };

      const response = await fetch(`http://localhost:3001/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNote),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update note: ${errorData.message || 'Unknown error'}`);
      }

      const updatedNoteData = await response.json();
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteId ? { ...note, content: updatedNoteData.content } : note
        )
      );
      setEditNoteId(null);
      setEditContent('');
    } catch (err: any) {
      console.error('Error:', err.message);
    }
  };

  // Handle deleting a note
  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete note: ${errorData.message || 'Unknown error'}`);
      }

      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (err: any) {
      console.error('Error:', err.message);
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{module.title}</h1>
      <p style={styles.description}>{module.description}</p>

      <h2 style={styles.subtitle}>Resources</h2>
      <ul style={styles.resourceList}>
        {module.resources.map((resource, index) => (
          <li key={index}>
            <a href={resource} download target="_blank" rel="noopener noreferrer">
              Download Resource {index + 1}
            </a>
          </li>
        ))}
      </ul>

      <h2 style={styles.subtitle}>Notes</h2>
      <div style={styles.notesContainer}>
        <textarea
          placeholder="Write a new note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          style={styles.textarea}
        />
        <button onClick={handleCreateNote} style={styles.button}>
          Add Note
        </button>

        <ul style={styles.notesList}>
          {notes.map((note) => (
            <li key={note._id!} style={styles.noteItem}> {/* Non-null assertion here */}
              {editNoteId === note._id ? (
                <>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    style={styles.textarea}
                  />
                  <button onClick={() => handleUpdateNote(note._id!)} style={styles.button}>
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditNoteId(null);
                      setEditContent('');
                    }}
                    style={styles.button}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p>{note.content}</p>
                  <small>{new Date(note.createdAt || '').toLocaleString()}</small>
                  <button onClick={() => setEditNoteId(note._id!)} style={styles.button}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteNote(note._id!)} style={styles.button}>
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 800, margin: '0 auto', padding: '2rem', fontFamily: 'Arial, sans-serif' },
  title: { fontSize: '2rem', marginBottom: '1rem', fontWeight: 'bold' },
  description: { marginBottom: '2rem', fontSize: '1.2rem' },
  subtitle: { fontSize: '1.5rem', marginBottom: '1rem' },
  resourceList: { listStyleType: 'none', padding: 0 },
  notesContainer: { marginTop: '2rem' },
  textarea: { width: '100%', height: '100px', marginBottom: '1rem', padding: '0.5rem', fontSize: '1rem' },
  button: { padding: '0.5rem 1rem', fontSize: '1rem', backgroundColor: '#4CAF50', color: '#fff', border: 'none', marginRight: '0.5rem' },
  notesList: { listStyleType: 'none', padding: 0, marginTop: '1rem' },
  noteItem: { padding: '1rem', borderBottom: '1px solid #ccc' },
};
