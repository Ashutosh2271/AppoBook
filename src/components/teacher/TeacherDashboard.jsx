import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  Settings as SettingsIcon 
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Profile from "./Profile";
import Appointments from "./Appointments";

const TeacherDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkDetails = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserDetails(data);

          if (!data.name || !data.department || !data.phone) {
            navigate("/teacherForm");
          }
        } else {
          navigate("/teacherForm");
        }
      } catch (error) {
        console.error("Error checking user details:", error);
        setError("Failed to load user details");
      }
    };

    checkDetails();
  }, [user.uid, navigate]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize);

    // Clean up event listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile user={user} userDetails={userDetails} />;
      case "appointments":
        return <Appointments user={user} />;
      default:
        return (
          <Card className="p-6 text-center text-gray-500">
            Select a tab to view content
          </Card>
        );
    }
  };

  const SidebarButton = ({ icon: Icon, label, tabName }) => (
    <Button
      variant={activeTab === tabName ? "secondary" : "ghost"}
      onClick={() => {
        setActiveTab(tabName);
        setIsMobileMenuOpen(false);
      }}
      className="w-full justify-start"
    >
      <Icon className="mr-3 w-5 h-5" />
      {label}
    </Button>
  );

  const Sidebar = () => (
    <Card className="w-64 p-4 space-y-4">
      {/* User Header */}
      <div className="text-center">
        <Avatar className="mx-auto mb-4 w-20 h-20">
          <AvatarImage 
            src={user.photoURL || "/default-avatar.png"} 
            alt={user.name || "User Avatar"} 
          />
          <AvatarFallback>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold text-gray-800">
          {userDetails?.name || user.name || "User"}
        </h2>
        <p className="text-sm text-gray-500">
          {userDetails?.department || user.role || 'Teacher'}
        </p>
      </div>

      {/* Navigation */}
      <div className="space-y-2">
        <SidebarButton 
          icon={Users} 
          label="Profile" 
          tabName="profile" 
        />
        <SidebarButton 
          icon={Calendar} 
          label="Appointments" 
          tabName="appointments" 
        />
      </div>
    </Card>
  );

  const MobileSidebar = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );

  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-10 p-6 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => navigate("/teacherForm")}>
          Update Profile
        </Button>
      </Card>
    );
  }

  if (!userDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed top-4 left-4 z-50"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </Button>
      )}

      {/* Mobile Sidebar */}
      {isMobile && <MobileSidebar />}

      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Main Content Area */}
      <div className={`
        flex-1 bg-gray-50 p-4 overflow-y-auto 
        ${isMobile ? 'w-full' : 'w-[calc(100%-16rem)]'}
      `}>
        <Card className="h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 capitalize">
              {activeTab} 
            </h1>
          </div>

          {/* Content Rendering Area */}
          <div className="p-8 overflow-y-auto">
            {renderContent()}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;