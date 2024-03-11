// ProfileManagement.js
import React, { useState } from 'react';
import ProfileEdit from './ProfileEdit'; // Adjust the path as necessary
import AdminProfile from './AdminProfile'; // Adjust the path as necessary

function ProfileManagement() {
    const [savedProfileData, setSavedProfileData] = useState(null);

    const handleSaveProfile = (profileData) => {
        setSavedProfileData(profileData);
    };

    return (
        <div>
            <ProfileEdit onSaveProfile={handleSaveProfile} />
            <AdminProfile profileData={savedProfileData} />
        </div>
    );
}

export default ProfileManagement;
