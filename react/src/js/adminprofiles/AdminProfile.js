// AdminProfile.js
import React from 'react';
import Sidebar from '../sidebar';

function AdminProfile({ profileData }) {
    if (!profileData) {
        return <div>Loading profile data...</div>;
    }

    return (
        <div>
            <Sidebar />
            <div className="name-text"> Updated Profile
                <div className='scrollable-container'>
                </div>

            </div>
            <div className="container rounded bg-white mt-5 mb-5">
                <div className="row">
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                            <img className="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" alt="Profile" />
                            <span className="font-weight-bold">{profileData.FirstName} {profileData.Surname}</span>
                            <span className="text-black-50">{profileData.EmailID}</span>
                        </div>
                    </div>
                    <div className="col-md-5 border-right">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">Profile Settings</h4>
                            </div>
                            <div className="row mt-2">
                                <p>Education Background: {profileData.Education}</p>
                                <p>Educational Attainment: {profileData.EducationalAttainment}</p>
                                <p>Country: {profileData.Country}</p>
                                <p>Region: {profileData.Region}</p>
                                <p>Experience: {profileData.Experience}</p>
                                <p>Additional Details: {profileData.AdditionalDetails}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminProfile;
