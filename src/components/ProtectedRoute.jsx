import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/Context'; // Assuming you have useAuth that provides current user and role

const ProtectedRoute = ({ requiredRole, children }) => {
  const { currentUser, role } = useAuth();
  console.log("currentuser", role)

  if (useRole !=='admin') {
    // If the user is not logged in or does not have the correct role, redirect them
    return <Navigate to="/" />;
  }

  return children; // Allow the route if role matches
};

export default ProtectedRoute;
