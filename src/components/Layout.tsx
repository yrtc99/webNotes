import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { Pencil, LogOut, Home, Book, FileText, Menu } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <nav className={`
        fixed lg:static inset-y-0 left-0 z-10
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-200 ease-in-out
        w-64 bg-white shadow-lg h-full flex flex-col
      `}>
        <div className="p-4 flex-1 overflow-y-auto">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <Pencil className="h-6 w-6 text-indigo-500" />
            <span className="text-xl font-bold text-gray-800">HTML Notes</span>
          </Link>

          <div className="space-y-2">
            <Link
              to="/"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 w-full"
            >
              <Home className="h-5 w-5" />
              <span>筆記 Home</span>
            </Link>

            <Link
              to="/tutorial"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 w-full"
            >
              <Book className="h-5 w-5" />
              <span>使用教學 Tutorial</span>
            </Link>

            <Link
              to="/resources"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 w-full"
            >
              <FileText className="h-5 w-5" />
              <span>外部學習資源 Resources</span>
            </Link>
          </div>
        </div>

        <div className="p-4 border-t">
          {/* 使用者資訊 */}
          <div className="flex items-center space-x-3 px-4 py-2 mb-2">
            <img
              src={auth.currentUser?.photoURL || ''}
              alt="使用者頭像"
              className="h-8 w-8 rounded-full"
              onError={(e) => {
                e.currentTarget.src = 'https://www.gravatar.com/avatar/?d=mp';
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {auth.currentUser?.displayName || '使用者'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {auth.currentUser?.email}
              </p>
            </div>
          </div>


          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 w-full"
          >
            <LogOut className="h-5 w-5" />
            <span>登出</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet context={{ setIsSidebarOpen, isSidebarOpen }} />
      </main>
    </div>
  );
}