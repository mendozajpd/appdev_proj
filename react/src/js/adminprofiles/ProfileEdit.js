import React, { useState } from 'react';
import Sidebar from '../sidebar';

// import '../css/admindashboard.css';

function ProfileEdit({ onSaveProfile }) {
    const [formState, setFormState] = useState({
        FirstName: '',
        Surname: '',
        MobileNumber: '',
        // addressLine1: '',
        // addressLine2: '',

        // state: '',
        // area: '',
        EmailID: '',
        Education: '',
        EducationalAttainment: '',
        Country: '',
        Region: '',
        Experience: '',
        AditionalDetails: ''
    });

    // Handler for input changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
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
            <div className="container rounded bg-white mt-5 mb-5">
                <div className="row">
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                            <img className="rounded-circle mt-5" width="150px" src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" alt="Profile" />
                            <span className="font-weight-bold">Jean Paul Mendoza</span>
                            <span className="text-black-50">jeypi@gmail.com</span>
                            <span> </span>
                        </div>
                    </div>
                    <div className="col-md-5 border-right">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">Profile Settings</h4>

                            </div>
                            {/* <h5 className="text-right">Profile Settings</h5> */}
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