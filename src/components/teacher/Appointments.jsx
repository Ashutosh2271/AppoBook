import { useState, useEffect } from "react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { CheckCircleIcon, XCircleIcon, UserIcon, MessageCircleIcon, ClockIcon, Loader2 } from "lucide-react";
import { auth, db } from "@/firebase/firebase";
import { useAuth } from "@/context/Context";

const TeacherDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {currentUser} =useAuth()
   appointments.map((appointments)=>{
    console.log(appointments.approval)
   })
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const teacher = currentUser
      if (!teacher) throw new Error("You are not authenticated.");

      const q = query(collection(db, "appointments"), where("teacherUid", "==", teacher.uid));
      const querySnapshot = await getDocs(q);

      const fetchedAppointments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAppointments(fetchedAppointments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Function to approve an appointment
  const approveAppointment = async (appointmentId) => {
    try {
      await updateDoc(doc(db, "appointments", appointmentId), {
        approval: true,
      });
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId ? { ...appointment, approval: true } : appointment
        )
      );
      alert("Appointment approved!");
    } catch (error) {
      console.error("Error approving appointment:", error);
    }
  };

  // Function to reject an appointment
  const rejectAppointment = async (appointmentId) => {
    try {
      await updateDoc(doc(db, "appointments", appointmentId), {
        approval: false,
      });
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === appointmentId ? { ...appointment, approval: false } : appointment
        )
      );
      alert("Appointment rejected!");
    } catch (error) {
      console.error("Error rejecting appointment:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-indigo-600" />
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="bg-red-100 p-4 rounded-full inline-block mb-4">
            <XCircleIcon className="h-12 w-12 text-red-600 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchAppointments} 
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10 border-b border-gray-200">
            <h1 className="text-3xl font-extrabold text-gray-900">Appointment Requests</h1>
            <p className="mt-2 text-gray-600">Review and manage your upcoming appointments</p>
          </div>

          <div className="divide-y divide-gray-200">
            {appointments.length === 0 ? (
              <div className="text-center py-16 px-6">
                <MessageCircleIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <p className="text-xl text-gray-500">No appointments scheduled</p>
                <p className="text-gray-400 mt-2">Check back later for new requests</p>
              </div>
            ) : (
              appointments.map((appointment) => (
                <div 
                  key={appointment.id} 
                  className="px-6 py-8 sm:px-10 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-4">
                        <UserIcon className="h-10 w-10 text-indigo-600 bg-indigo-100 p-2 rounded-full" />
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {appointment.studentName}
                          </p>
                          <div className="flex items-center space-x-2 text-gr ay-500 text-sm mt-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>{new Date(appointment.time).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center space-x-2">
                        <MessageCircleIcon className="h-5 w-5 text-gray-400" />
                        <p className="text-gray-600">{appointment.message}</p>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <span 
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.approval === null
                            ? "bg-yellow-100 text-yellow-800"
                            : appointment.approval
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {appointment.approval === null
                          ? "Pending"
                          : appointment.approval
                          ? "Approved"
                          : "Rejected"}
                      </span>
                    </div>
                  </div>

                  {appointment.approval === false && (
                    <div className="mt-6 flex space-x-4">
                      <button
                        onClick={() => approveAppointment(appointment.id)}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <CheckCircleIcon className="-ml-1 mr-2 h-5 w-5" />
                        Approve
                      </button>
                      <button
                        onClick={() => rejectAppointment(appointment.id)}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <XCircleIcon className="-ml-1 mr-2 h-5 w-5" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;