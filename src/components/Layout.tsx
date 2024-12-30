import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { Pencil, LogOut, Home, Book, FileText } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex">
      {/* Sidebar */}
      <nav className="w-64 bg-white shadow-lg h-screen flex flex-col">
        <div className="p-4">
          <Link to="/" className="flex items-center space-x-2 mb-8">
            <Pencil className="h-8 w-8 text-indigo-500" />
            <span className="text-xl font-bold text-gray-800">HTML Notes</span>
          </Link>
          
          <div className="space-y-2">
            <Link 
              to="/"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 w-full"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/tutorial"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 w-full"
            >
              <Book className="h-5 w-5" />
              <span>Tutorial</span>
            </Link>
            
            <Link 
              to="/resources"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 w-full"
            >
              <FileText className="h-5 w-5" />
              <span>Resources</span>
            </Link>
          </div>
        </div>
        
        <div className="mt-auto p-4">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 w-full"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}