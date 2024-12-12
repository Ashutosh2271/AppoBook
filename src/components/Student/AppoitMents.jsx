import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { CalendarIcon, ClockIcon, UserIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/context/Context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BookAppointment = () => {
  const [teachers, setTeachers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [teacherId, setTeacherId] = useState("");
  const [message, setMessage] = useState("");
  const [time, setTime] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const teacherList = [];
        const teacherMap = {};
        querySnapshot.forEach((doc) => {
          if (doc.data().role === "teacher") {
            const teacher = { id: doc.id, ...doc.data() };
            teacherList.push(teacher);
            teacherMap[doc.id] = teacher.name;
          }
        });
        setTeachers(teacherList);
        return teacherMap;
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setError("Failed to load teachers. Please try again.");
        return {};
      }
    };

    const fetchAppointments = async () => {
      const student = currentUser;
      if (!student) return;
      try {
        const q = query(
          collection(db, "appointments"),
          where("studentUid", "==", student.uid)
        );
        const querySnapshot = await getDocs(q);
        const teacherMap = await fetchTeachers();
        const appointmentsWithNames = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          teacherName: teacherMap[doc.data().teacherUid] || "Unknown",
        }));
        setAppointments(appointmentsWithNames);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError("Failed to load appointments. Please try again.");
      }
    };

    fetchAppointments();
  }, [currentUser]);

  const filteredTeachers = teachers.filter((teacher) =>
    `${teacher.name} ${teacher.department}`.toLowerCase().includes(
      search.toLowerCase()
    )
  );

  const validateForm = () => {
    if (!teacherId) {
      setError("Please select a teacher");
      return false;
    }
    if (!time) {
      setError("Please select an appointment time");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const student = currentUser;
    if (!student) return;

    // Reset previous errors
    setError(null);

    // Validate form
    if (!validateForm()) return;

    setLoading(true);
    try {
      const newAppointment = {
        studentUid: student.uid,
        studentName: student.username,
        teacherUid: teacherId,
        time: new Date(time).toISOString(),
        message,
        approval: false,
      };

      const docRef = await addDoc(
        collection(db, "appointments"),
        newAppointment
      );
      setAppointments((prev) => [
        ...prev,
        {
          id: docRef.id,
          ...newAppointment,
          teacherName: teachers.find((t) => t.id === teacherId)?.name,
        },
      ]);
      
      // Reset form
      setMessage("");
      setTime("");
      setTeacherId("");
      
      // Success feedback
      setError("Appointment booked successfully!");
    } catch (error) {
      console.error("Error booking appointment:", error);
      setError("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="mr-3 text-blue-600" />
            Book Appointment
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Error/Success Alert */}
          {error && (
            <Alert variant={error.includes("successfully") ? "default" : "destructive"}>
              <AlertTitle>{error.includes("successfully") ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search Teachers */}
          <div className="mb-6 mt-4">
            <label className="block text-gray-700 font-medium mb-2">
              Search Teachers
            </label>
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or department"
            />
          </div>

          {/* Appointment Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Select Teacher
              </label>
              <Select 
                value={teacherId}
                onValueChange={setTeacherId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a Teacher" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTeachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name} - {teacher.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Appointment Time
              </label>
              <Input
                type="datetime-local"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Message
              </label>
              <Textarea
                placeholder="Add any additional details"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                "Book Appointment"
              )}
            </Button>
          </form>

          {/* Appointment List */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              My Appointments
            </h3>
            {appointments.length === 0 ? (
              <p className="text-gray-500">No appointments scheduled</p>
            ) : (
              appointments.map((appt) => (
                <Card key={appt.id} className="mb-4">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <p>
                        <strong>Teacher:</strong> {appt.teacherName}
                      </p>
                      <p>
                        <strong>Time:</strong> {new Date(appt.time).toLocaleString()}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span className={
                          appt.approval 
                            ? "text-green-600" 
                            : "text-yellow-600"
                        }>
                          {appt.approval ? "Approved" : "Pending Approval"}
                        </span>
                      </p>
                      {appt.message && (
                        <p>
                          <strong>Message:</strong> {appt.message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookAppointment;