import React, { useState } from 'react';
import Sidebar from '../sidebar';
import '../adminprofiles/profilePictureStyles.css';




function ProfileEdit({ onSaveProfile }) {
    const [formState, setFormState] = useState({
        FirstName: '',
        Surname: '',
        MobileNumber: '',
        EmailID: '',
        Education: '',
        EducationalAttainment: '',
        Country: '',
        Region: '',
        Experience: '',
        AditionalDetails: '',
        ProfilePicture: null // State to store the selected profile picture
    });

    // Handler for input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handler for profile picture upload
    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        setFormState(prevState => ({
            ...prevState,
            ProfilePicture: file
        }));
    };

    const handleSave = () => {
        onSaveProfile(formState);
    };

    const renderInputFields = () => {
        return Object.keys(formState).map(key => (
            <div key={key} className="col-md-6">
                <label className="labels">{key}</label>
                <input type="text" className="form-control" placeholder={key} value={formState[key]} onChange={handleInputChange} name={key} />
            </div>
        ));
    };

    return (
        <div>
            <Sidebar />
            <div className="name-text"> Edit Profile
                {/* <div className="font-weight-bold">Edogaru</div> */}
            </div>
            <div className="container rounded bg-light mt-5 mb-5">
                <div className="row">
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                            {/* Display the selected profile picture */}
                            {formState.ProfilePicture ? (
                                <img className="rounded-circle mt-5" width="290px" src={URL.createObjectURL(formState.ProfilePicture)} alt="Profile" />
                            ) : (
                                <div>
                                    <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
                                    <label htmlFor="fileInput" className="form-label">Choose a profile picture</label>
                                </div>
                            )}
                            {/* <span className="font-weight-bolder">JEAN PAUL MENDOZA</span>
                            <span className="text-black-50">jeypi@gmail.com</span> */}
                            <span> </span>
                        </div>
                    </div>
                    <div className="col-md-5 border-right">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">Profile Settings</h4>
                            </div>
                            <div className="row mt-2">
                                {renderInputFields()}
                            </div>
                            <div className="mt-5 text-center">
                                <button className="btn btn-primary profile-button" type="button" onClick={handleSave}>Save Profile</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center experience">
                                <span>Edit Experience</span>
                                <span className="border px-3 p-1 add-experience">
                                    <i className="fa fa-plus"></i>&nbsp;Experience
                                </span>
                            </div>
                            <br />
                            <div className="col-md-12">
                                <label className="labels">Experience in Designing</label>
                                <input type="text" className="form-control" placeholder="experience" value={formState.experience} onChange={handleInputChange} name="experience" />
                            </div>
                            <br />
                            <div className="col-md-12">
                                <label className="labels">Additional Details</label>
                                <input type="text" className="form-control" placeholder="additional details" value={formState.additionalDetails} onChange={handleInputChange} name="additionalDetails" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileEdit;
