import React, { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({ name: "", department: "", email: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null); // To store error messages
  console.log(teachers)

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const teacherList = querySnapshot.docs
          .filter((doc) => doc.data().role === "teacher")
          .map((doc) => ({ id: doc.id, ...doc.data() }));
        setTeachers(teacherList);
      } catch (err) {
        setError("Error fetching teachers: " + err.message);
      }
    };
    fetchTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateDoc(doc(db, "users", editId), form);
        setTeachers((prevTeachers) =>
          prevTeachers.map((teacher) =>
            teacher.id === editId ? { ...teacher, ...form } : teacher
          )
        );
      } else {
        const docRef = await addDoc(collection(db, "users"), { ...form, role: "teacher" });
        setTeachers((prevTeachers) => [
          ...prevTeachers,
          { id: docRef.id, ...form },
        ]);
      }
      setForm({ name: "", department: "", email: "" });
      setEditId(null);
    } catch (err) {
      setError("Error submitting form: " + err.message);
    }
  };

  const handleEdit = (teacher) => {
    setForm({ name: teacher.name, department: teacher.department, email: teacher.email });
    setEditId(teacher.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setTeachers((prevTeachers) => prevTeachers.filter((teacher) => teacher.id !== id));
    } catch (err) {
      setError("Error deleting teacher: " + err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Teachers</h2>
      {error && <div className="text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Department"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          {editId ? "Update Teacher" : "Add Teacher"}
        </button>
      </form>
      <div className="space-y-4">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="p-4 border rounded flex justify-between">
            <span>
              {teacher.username} ({teacher.department}) - {teacher.email}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(teacher)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(teacher.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
