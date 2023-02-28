import React from "react"
import Container from "react-bootstrap/Container"

export default function CenteredContainer(props) {
    return (
        <Container fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <style>

            </style>
            <div className={`w-100 ${props?.className ?? ""}`.trim()} style={{ maxWidth: 'var(--max-width, 400px)' }}>
                {props.children}
            </div>
        </Container>
    );
}