"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../core/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { logout } from "../core/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    mobile: "",
    email: "",
  });
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/SignIn");
      } else {
        setUser(currentUser);
        setProfile((prev) => ({ ...prev, email: currentUser.email }));
        await fetchProfile(currentUser.uid);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  
  const fetchProfile = async (uid) => {
    try {
      const docRef = doc(db, "profiles", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile(docSnap.data());
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleSave = async (e) => {
    e.preventDefault();
    if (!profile.name || !profile.age || !profile.mobile) {
      alert("Please fill all fields before saving!");
      return;
    }

    try {
      const docRef = doc(db, "profiles", user.uid);
      await setDoc(docRef, { ...profile });
      setIsSaved(true);
      alert("Profile saved successfully!");
    } catch (error) {
      alert("Error saving profile: " + error.message);
    }
  };

  
  
  const handleEdit = () => setIsSaved(false);

 
  const handleLogout = async () => {
    await logout();
    router.push("/SignIn");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#5581B1] text-white text-xl">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-[#5581B1] min-h-screen flex flex-col items-center justify-center text-black">
      <div className="bg-white p-8 rounded-xl shadow-xl w-[400px] flex flex-col space-y-5">
        <h1 className="text-2xl font-bold text-center text-blue-600">
          {isSaved ? "Your Profile" : "Create Your Profile"}
        </h1>

        <form onSubmit={handleSave} className="flex flex-col space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="p-3 border rounded-md outline-none"
            value={profile.name}
            onChange={handleChange}
            disabled={isSaved}
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            className="p-3 border rounded-md outline-none"
            value={profile.age}
            onChange={handleChange}
            disabled={isSaved}
          />
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            className="p-3 border rounded-md outline-none"
            value={profile.mobile}
            onChange={handleChange}
            disabled={isSaved}
          />
          <input
            type="email"
            name="email"
            readOnly
            className="p-3 border rounded-md bg-gray-100 cursor-not-allowed"
            value={profile.email}
          />

          {!isSaved && (
            <button
              type="submit"
              className="bg-yellow-300 hover:bg-yellow-400 p-3 rounded-md font-semibold"
            >
              Save Profile
            </button>
          )}
        </form>

        {isSaved && (
          <button
            onClick={handleEdit}
            className="bg-orange-300 hover:bg-orange-400 p-3 rounded-md font-semibold"
          >
            Edit Profile
          </button>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-400 hover:bg-red-500 p-3 rounded-md font-semibold text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
