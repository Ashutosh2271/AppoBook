import React from "react";
import { 
  Users, 
  UserCheck, 
  Layout, 
  Shield, 
  Settings 
} from "lucide-react";
import { ManageTeachers } from "./ManageTeacher";
import { ApproveStudents } from "./ApproveSudent";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users, teachers, and system settings</p>
          </div>
          <div className="flex items-center space-x-4">
           
            <div className="bg-indigo-600 text-white px-4 py-2 rounded-full flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span className="font-medium">Admin</span>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-indigo-600 text-white p-6 flex items-center space-x-4">
              <Users className="h-10 w-10" />
              <h2 className="text-2xl font-bold">Manage Teachers</h2>
            </div>
            <div className="p-6">
              <ManageTeachers />
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-green-600 text-white p-6 flex items-center space-x-4">
              <UserCheck className="h-10 w-10" />
              <h2 className="text-2xl font-bold">Approve Students</h2>
            </div>
            <div className="p-6">
              <ApproveStudents />
            </div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
            <Layout className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Dashboard Overview</h3>
            <p className="text-gray-600">Quick insights and system statistics</p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
            <Shield className="mx-auto h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Access Control</h3>
            <p className="text-gray-600">Manage user roles and permissions</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;