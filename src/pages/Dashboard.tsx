import React, { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, getDocs, addDoc, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Plus, File, Trash2, Search, Menu } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { setIsSidebarOpen, isSidebarOpen } = useOutletContext<{
    setIsSidebarOpen: (open: boolean) => void;
    isSidebarOpen: boolean;
  }>();


  // 載入筆記
  useEffect(() => {
    loadNotes();
  }, []);

  // 在 Dashboard 組件中添加刪除函數
  const handleDelete = async (e: React.MouseEvent, noteId: string) => {
    try {
      e.stopPropagation(); // 防止觸發卡片的點擊事件
      if (!auth.currentUser?.email) return;

      const isConfirmed = window.confirm('確定要刪除這個筆記嗎？此操作無法復原。');
      if (!isConfirmed) return;

      const noteRef = doc(db, 'users', auth.currentUser.email, 'notes', noteId);
      await deleteDoc(noteRef);

      // 更新本地狀態，移除已刪除的筆記
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('刪除失敗，請稍後再試');
    }
  };

  // 讀取筆記列表
  const loadNotes = async () => {
    try {
      if (!auth.currentUser?.email) return;

      const userNotesRef = collection(db, 'users', auth.currentUser.email, 'notes');
      const q = query(userNotesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const notesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt?.toDate() || doc.data().createdAt.toDate(),
      })) as Note[];

      setNotes(notesData);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // 創建新筆記
  const createNewNote = async () => {
    try {
      if (!auth.currentUser?.email) return;

      const newNote = {
        title: '未命名筆記',
        content: '<h1>Hello World!</h1>',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const userNotesRef = collection(db, 'users', auth.currentUser.email, 'notes');
      const docRef = await addDoc(userNotesRef, newNote);
      navigate(`/edit/${docRef.id}`);
    } catch (error) {
      console.error('Error creating new note:', error);
    }
  };

  // 過濾筆記
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 載入中顯示
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 頂部操作列 */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="搜尋筆記..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={createNewNote}
            className="flex items-center space-x-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">新增筆記</span>
          </button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 筆記列表 */}
      {filteredNotes.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          {searchTerm ? '沒有找到相關筆記' : '還沒有筆記，立即創建一個吧！'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => navigate(`/edit/${note.id}`)}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-indigo-500" />
                  <h3 className="font-medium text-gray-900 truncate">
                    {note.title}
                  </h3>
                </div>
                {/* 刪除按鈕 */}
                <button
                  onClick={(e) => handleDelete(e, note.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all"
                  title="刪除筆記"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                最後更新：
                {note.updatedAt.toLocaleDateString('zh-TW', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}