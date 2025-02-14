import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { ArrowLeft, Trash2 } from 'lucide-react';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('已儲存');

  useEffect(() => {
    loadNote();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (!id || !auth.currentUser) return;

      // 顯示確認對話框
      const isConfirmed = window.confirm('確定要刪除這個筆記嗎？此操作無法復原。');

      if (!isConfirmed) return;

      const noteRef = doc(db, 'users', auth.currentUser.uid, 'notes', id);
      await deleteDoc(noteRef);
      navigate('/');
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('刪除失敗，請稍後再試');
    }
  };

  const loadNote = async () => {
    try {
      if (!id || !auth.currentUser?.email) return;

      const noteRef = doc(db, 'users', auth.currentUser.email, 'notes', id);
      const noteSnap = await getDoc(noteRef);

      if (noteSnap.exists()) {
        setCode(noteSnap.data().content);
        setTitle(noteSnap.data().title);
      }
    } catch (error) {
      console.error('Error loading note:', error);
    } finally {
      setLoading(false);
    }
  };

  // 使用防抖來延遲儲存
  useEffect(() => {
    if (!code || !id) return;

    setSaveStatus('儲存中...');
    const timer = setTimeout(() => {
      handleSave();
    }, 1000);

    return () => clearTimeout(timer);
  }, [code]);

  const handleSave = async () => {
    try {
      if (!id || !auth.currentUser?.email) return;

      const noteRef = doc(db, 'users', auth.currentUser.email, 'notes', id);
      await updateDoc(noteRef, {
        content: code,
        updatedAt: new Date(),
      });
      setSaveStatus('已儲存');
    } catch (error) {
      console.error('Error saving note:', error);
      setSaveStatus('儲存失敗');
    }
  };

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    try {
      if (!id || !auth.currentUser?.email) return;

      const noteRef = doc(db, 'users', auth.currentUser.email, 'notes', id);
      await updateDoc(noteRef, {
        title: newTitle,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* 頂部工具列 */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="text-xl font-semibold focus:outline-none border-b border-transparent focus:border-indigo-500"
            placeholder="輸入標題..."
          />
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">{saveStatus}</span>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="刪除筆記"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 分屏編輯區域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左側編輯器 */}
        <div className="w-1/2 border-r overflow-hidden">
          <CodeMirror
            value={code}
            height="100%"
            extensions={[html()]}
            onChange={(value) => {
              setCode(value);
              setSaveStatus('未儲存');
            }}
            theme="light"
            className="h-full overflow-auto"
          />
        </div>

        {/* 右側預覽 */}
        <div className="w-1/2 overflow-auto">
          <div
            className="prose max-w-none p-8"
            dangerouslySetInnerHTML={{ __html: code }}
          />
        </div>
      </div>
    </div>
  );
}