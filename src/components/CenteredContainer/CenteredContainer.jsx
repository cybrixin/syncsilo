import React from "react"
import Container from "react-bootstrap/Container"

export default function CenteredContainer(props) {
    return (
        <Container fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="w-100" style={{ maxWidth: props.maxWidth ?? "400px" }}>
                {props.children}
            </div>
        </Container>
    );
}