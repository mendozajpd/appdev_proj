import React from "react";
import { Container, CloseButton, Image, Button } from "react-bootstrap";



const UserPlayingView = () => {

    return (
        <div className="playing-view p-3 overflow-auto" style={{ width: '40rem' }}>
            <div className="d-flex justify-content-between pb-5">
                <div>
                    Playing View
                </div>
                <CloseButton variant="white" />
            </div>
            <div className="py-5 justify-content-center">
                <Image src="https://via.placeholder.com/400x250" alt="Album Cover" style={{ width: '100%', height: '100%' }} />
            </div>
            <div className="d-flex justify-content-between py-3">
                <div className="">
                    <div className="display-6">
                        title
                    </div>
                    <div className="text-gray">
                        album name
                    </div>
                </div>
                <div className="align-items-center d-flex gap-2">
                    <i className="fa fa-plus-circle display-7" />
                    <i className="fa fa-ellipsis-h display-7" />
                </div>
            </div>
            <div className="playing-view-description p-3">
                <div>
                    About
                </div>
                <div className="text-gray text-truncate-description">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                </div>
                <div className="d-flex justify-content-between">
                    <div className="py-3 d-flex gap-2">
                        <div>
                            <Image src="https://via.placeholder.com/50x50" alt="Artist" rounded />
                        </div>
                        <div>
                            <div>
                                Artist Name
                            </div>
                            <div className="text-gray">
                                1,000,000 listeners
                            </div>
                        </div>
                    </div>
                    <div className="py-3 align-content-center">
                        <div>
                            <Button variant="outline-danger">
                                Follow
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-5">
                
            </div>
        </div>
    )
}

export default UserPlayingView;