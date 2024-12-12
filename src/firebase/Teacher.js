// src/services/teacherService.js
import { 
    doc, 
    setDoc, 
    updateDoc, 
    getDoc, 
    collection, 
    query, 
    where, 
    getDocs,
    serverTimestamp, 
    addDoc 
  } from 'firebase/firestore';
import { db } from './firebase';

  
  // Teacher Profile Management
  export const createTeacherProfile = async (userData) => {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, {
        name: userData.name,
        email: userData.email,
        department: userData.department,
        subjects: userData.subjects,
        role: 'teacher',
        availableSlots: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error creating teacher profile:', error);
      throw error;
    }
  };
  
  // Availability Management
  export const setTeacherAvailability = async (availabilityData) => {
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        availableSlots: availabilityData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error setting availability:', error);
      throw error;
    }
  };
  
  // Appointment Management
  export const getTeacherAppointments = async () => {
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(appointmentsRef, where('teacherId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const appointments = [];
      for (const doc of querySnapshot.docs) {
        const appointment = doc.data();
        // Get student details
        const studentDoc = await getDoc(doc.data().studentId);
        appointments.push({
          id: doc.id,
          ...appointment,
          student: studentDoc.data()
        });
      }
      
      return appointments;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  };
  
  export const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, {
        status: status,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  };
  
  // Message Management
  export const sendMessage = async (studentId, message) => {
    try {
      await addDoc(collection(db, 'messages'), {
        senderId: auth.currentUser.uid,
        receiverId: studentId,
        content: message,
        createdAt: serverTimestamp(),
        read: false
      });
      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };