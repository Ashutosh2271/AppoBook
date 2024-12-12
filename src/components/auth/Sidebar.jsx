import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/Context";
import { db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { LogOut } from "lucide-react";

const Sidebar = () => {
  const [userData, setUserData] = useState(null);
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.warn("No user document found.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

  const getInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName[0].toUpperCase();
    }
    if (currentUser?.email) {
      return currentUser.email[0].toUpperCase();
    }
    return "U";
  };

  const SidebarContent = () => (
    <div className="flex h-screen max-h-[400px] flex-col justify-between">
      {/* User Profile Section */}
      <div className="flex flex-col items-center py-2 px-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={currentUser?.photoURL || ""} alt="User" />
          <AvatarFallback className="bg-blue-100 text-blue-600">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center mt-1">
          <h2 className="text-sm font-semibold text-gray-800 truncate max-w-[180px]">
            {currentUser?.displayName || userData?.username || "User"}
          </h2>
          <p className="text-xs text-gray-500 truncate max-w-[180px]">
            {currentUser?.email}
          </p>
        </div>
      </div>

      {/* Logout Button */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 hover:bg-gray-100 h-8 text-sm"
          onClick={logout}
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );

  // Handle loading state
  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-50 rounded-full p-0"
          aria-label="Open sidebar"
        >
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={currentUser?.photoURL || ""} alt="User" />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-64 p-0 max-h-[400px] h-auto"
      >
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;