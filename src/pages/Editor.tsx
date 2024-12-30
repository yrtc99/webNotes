import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { ArrowLeft } from 'lucide-react';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    const loadNote = async () => {
      if (!id) return;

      const noteRef = doc(db, 'notes', id);
      const noteSnap = await getDoc(noteRef);

      if (noteSnap.exists()) {
        setCode(noteSnap.data().content);
        setTitle(noteSnap.data().title);
      }
    };

    loadNote();
  }, [id]);

  const handleCodeChange = async (value: string) => {
    setCode(value);
    if (!id) return;

    const noteRef = doc(db, 'notes', id);
    await updateDoc(noteRef, {
      content: value,
      updatedAt: new Date(),
    });
  };

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!id) return;

    const noteRef = doc(db, 'notes', id);
    await updateDoc(noteRef, {
      title: newTitle,
      updatedAt: new Date(),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-white hover:shadow-md transition duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>

        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="flex-1 px-4 py-2 text-xl font-semibold bg-transparent border-b-2 border-gray-200 focus:border-indigo-500 outline-none"
          placeholder="Note Title"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 h-[calc(100vh-200px)]">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-full overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <CodeMirror
              value={code}
              height="100%"
              extensions={[html()]}
              onChange={handleCodeChange}
              theme="light"
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                highlightSpecialChars: true,
                history: true,
                foldGutter: true,
                drawSelection: true,
                dropCursor: true,
                allowMultipleSelections: true,
                indentOnInput: true,
                syntaxHighlighting: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                rectangularSelection: true,
                crosshairCursor: true,
                highlightActiveLine: true,
                highlightSelectionMatches: true,
                closeBracketsKeymap: true,
                defaultKeymap: true,
                searchKeymap: true,
                historyKeymap: true,
                foldKeymap: true,
                completionKeymap: true,
                lintKeymap: true,
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 overflow-auto">
          <div
            dangerouslySetInnerHTML={{ __html: code }}
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl 
              prose-headings:font-bold prose-headings:text-gray-800
              prose-h1:text-4xl prose-h1:mb-4
              prose-h2:text-3xl prose-h2:mb-3
              prose-h3:text-2xl prose-h3:mb-3
              prose-h4:text-xl prose-h4:mb-2
              prose-h5:text-lg prose-h5:mb-2
              prose-h6:text-base prose-h6:mb-2
              prose-p:text-gray-600 prose-p:mb-4
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:font-bold prose-strong:text-gray-800
              prose-ul:list-disc prose-ul:ml-4
              prose-ol:list-decimal prose-ol:ml-4
              max-w-none"
          />
        </div>
      </div>
    </div>
  );
}