import './App.css';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import { useAuth } from './context/Context'; // Import the useAuth hook to access the current user
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import AdminDashboard from './components/Admin/AdminDashboard';
import StudentDashboard from './components/Student/StudentDashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import TeacherDetailsForm from './components/teacher/TeacherForm';

function App() {
  const { currentUser, loading, role } = useAuth(); // Get the current user and role from the auth context

  console.log("Current User:", currentUser); // Debugging current user
  console.log("Role:", role); // Debugging role

  if (loading) {
    return <div>Loading...</div>; // Show a loading screen until the user data is loaded
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />
       <Route path='/adminpanel' element={<AdminDashboard/>} />
       <Route path='/studentDash' element={<StudentDashboard user={currentUser}/>}/>
       <Route path='/teacherdash' element={<TeacherDashboard user={currentUser}/>}/>
       <Route path='teacherForm' element={<TeacherDetailsForm user={currentUser}/>}/>
       
      </Routes>
    </div>
  );
}

export default App;
