import React, { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { Plus, File } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Note {
  id: string;
  title: string;
  createdAt: Date;
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadNotes = async () => {
      if (!auth.currentUser) return;
      
      const q = query(
        collection(db, 'notes'),
        where('userId', '==', auth.currentUser.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const notesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Note[];
      
      setNotes(notesData);
    };

    loadNotes();
  }, []);

  const createNewNote = async () => {
    if (!auth.currentUser) return;

    const newNote = {
      userId: auth.currentUser.uid,
      title: 'Untitled Note',
      content: '<h1>Hello World!</h1>',
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, 'notes'), newNote);
    navigate(`/edit/${docRef.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My HTML Notes</h1>
        <button
          onClick={createNewNote}
          className="flex items-center space-x-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>New Note</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => navigate(`/edit/${note.id}`)}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
          >
            <div className="flex items-start space-x-3">
              <File className="h-6 w-6 text-indigo-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800">{note.title}</h3>
                <p className="text-sm text-gray-500">
                  {note.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}