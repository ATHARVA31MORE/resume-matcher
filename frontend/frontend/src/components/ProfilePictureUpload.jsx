import React, { useState, useRef } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import axios from 'axios';

function ProfilePictureUpload({ user, onUploadSuccess }) {
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (file) => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'unsigned_preset'); // Replace with your Cloudinary preset

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dzucbzoaj/image/upload`,
        formData
      );

      const imageUrl = res.data.secure_url;

      await updateProfile(auth.currentUser, { photoURL: imageUrl });

      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        photoURL: imageUrl
      });

      if (onUploadSuccess) onUploadSuccess(imageUrl);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Single Circle: Profile Image (clickable to upload) */}
      <div
        className="relative rounded-full cursor-pointer group"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => fileInputRef.current.click()}
      >
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            className={`w-32 h-32 rounded-full object-cover shadow-lg ${
              hover ? 'ring-4 ring-blue-500' : 'ring-2 ring-gray-300'
            } transition-all duration-200`}
            alt="Profile"
          />
        ) : (
          <div
            className={`w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-white shadow-lg ${
              hover ? 'ring-4 ring-blue-500' : 'ring-2 ring-gray-300'
            } transition-all duration-200`}
          >
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}

        {/* Hover camera icon */}
        {hover && !loading && (
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])}
        />
      </div>

      {/* Email below */}
      <p className="mt-3 text-lg font-semibold text-gray-700">{user?.email}</p>
    </div>
  );
}

export default ProfilePictureUpload;
