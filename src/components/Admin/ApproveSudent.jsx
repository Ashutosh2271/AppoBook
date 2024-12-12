import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useAuth } from "@/context/Context";

export const ApproveStudents = () => {
  const { currentUser } = useAuth();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Query to fetch students with `approval` set to `false`
        const q = query(collection(db, "appointments"), where("approval", "==", false));
        const querySnapshot = await getDocs(q);
        const fetchedStudents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(fetchedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []); // Dependency array ensures it runs only once

  const approveStudent = async (studentId) => {
    try {
      // Update the `approval` field to `true` for the selected student
      const studentDoc = doc(db, "appointments", studentId);
      await updateDoc(studentDoc, { approval: true });

      // Update the state to remove the approved student
      setStudents((prevStudents) => prevStudents.filter((student) => student.id !== studentId));
      console.log(`Student with ID ${studentId} approved.`);
    } catch (error) {
      console.error("Error approving student:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Approve Students</h2>
      {students.length === 0 ? (
        <p>No students awaiting approval.</p>
      ) : (
        students.map((student) => (
          <div key={student.id} className="p-4 border rounded flex justify-between">
            <span>
              {student.studentName  } - {student.email}
            </span>
            <button
              onClick={() => approveStudent(student.id)}
              className="bg-green-500 text-white py-1 px-3 rounded"
            >
              Approve
            </button>
          </div>
        ))
      )}
    </div>
  );
};
