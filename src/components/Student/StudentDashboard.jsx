import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import Profile from "./Profile";
import { MagnifyingGlassIcon, UserCircleIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import BookAppointment from "./AppoitMents";
import Profile from "./Profile";

const StudentDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState("profile");
    
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile user={(user)} />
      case "bookAppointment":
        return <BookAppointment/>
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white text-black flex flex-col p-4">
        <h1 className="text-2xl font-bold mb-8">{user.username}</h1>
        <nav className="flex flex-col gap-4">
          <Button
            variant={activeTab === "profile" ? "default" : "ghost"}
            onClick={() => setActiveTab("profile")}
            className="flex items-center gap-2"
          >
            <UserCircleIcon className="w-5 h-5" />
            Profile
          </Button>
          <Button
            variant={activeTab === "bookAppointment" ? "default" : "ghost"}
            onClick={() => setActiveTab("bookAppointment")}
            className="flex items-center gap-2"
          >
            📅
            Book Appointment
          </Button>
       
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-8 overflow-y-auto">
        <Card className="p-6 shadow-md">{renderContent()}</Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
