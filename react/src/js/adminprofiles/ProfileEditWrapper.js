// ProfileEditWrapper.js
import React, { useState } from 'react';
import ProfileEdit from './js/adminprofiles/ProfileEdit'; // Adjust the path as necessary
// import '../css/admindashboard.css';

function ProfileEditWrapper() {
    const [savedProfileData, setSavedProfileData] = useState(null);

    const handleSaveProfile = (profileData) => {
        setSavedProfileData(profileData);
        // Here you can also handle saving the profile data to a backend or local storage
        console.log("Profile saved:", profileData);
    };

    return <ProfileEdit onSaveProfile={handleSaveProfile} />;
}

export default ProfileEditWrapper;
