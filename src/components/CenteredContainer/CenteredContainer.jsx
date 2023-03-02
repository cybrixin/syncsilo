import React from "react"
import Container from "react-bootstrap/Container"
import styles from './CenteredContainer.module.css';

export default function CenteredContainer(props) {
    return (
        <Container fluid className={`d-flex align-items-md-center mt-md-0 mt-sm-5 justify-content-center ${styles.container}`}>
            <style>

            </style>
            <div className={`w-100 ${styles['container-div']} ${props?.className ?? ""}`.trim()} style={{...(props?.style ?? {})}}>
                {props.children}
            </div>
        </Container>
    );
}