import { Calendar } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import SignUp from '@/components/auth/Authentication';
import Sidebar from './auth/Sidebar';
import { useAuth } from '@/context/Context';

const Navbar = () => {
  const { currentUser,logout } = useAuth();

  return (
    <div>
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        {/* App Logo */}
        <div className="flex items-center space-x-2">
          <Calendar className="text-blue-600" size={32} />
          <h1 className="text-2xl font-bold text-blue-800">AppoBook</h1>
        </div>

        {/* User Authentication */}
        <div className="space-x-4 relative flex items-center">
          {currentUser ? (
            <>
               <Sidebar/>
            </>
          ) : (
            <SignUp />
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
