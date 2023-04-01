import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

export default function Folder({ folder }) {
  return (
    <Button
        to={{
            pathname: `/folder/${folder.id}`,
        }}
        state = {{ folder: folder }}
        variant="outline-dark"
        className="text-truncate w-100"
        as={Link}>
        <i className="fas fa-folder mr-2"></i>&nbsp;{folder.name}
    </Button>
  )
}