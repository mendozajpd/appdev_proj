import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";


const RootLayout = () => {

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Container>
                <Outlet />
            </Container>
        </div>
    );
}

export default RootLayout;