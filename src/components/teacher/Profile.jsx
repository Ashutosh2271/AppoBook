import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { db } from "@/firebase/firebase";
import { Edit, Loader2, Save, X } from "lucide-react";

const Profile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
          setLoading(false)
        } else {
          console.error("No profile found!");
         
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [user.uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, profile);

      alert("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }


  return (
    <div className="w-full h-full overflow-y-auto p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {editMode ? "Edit Profile" : "Your Profile"}
          </h2>
          {!editMode ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="mb-2">Name</Label>
              <Input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2">Email</Label>
              <Input
                id="email"
                name="email"
                value={profile.email}
                disabled
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="mb-2">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="department" className="mb-2">Department</Label>
              <Input
                id="department"
                name="department"
                value={profile.department}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="subject" className="mb-2">Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={profile.subject}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="bio" className="mb-2">Bio</Label>
              <textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                disabled={!editMode}
                className="w-full p-2 border rounded-md min-h-[100px] resize-y"
              />
            </div>
          </div>
        </div>

        {editMode && (
          <div className="flex gap-4 mt-6">
            <Button 
              onClick={handleUpdate} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setEditMode(false)}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Profile;