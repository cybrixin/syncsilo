
import React, { useState } from "react"

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { ROOT_FOLDER } from "@/hooks/useFolder";

import { addDoc } from 'firebase/firestore';
import { logEvent } from "firebase/analytics";

export default function AddFolderButton({currentFolder}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const { cloud, analytics } = useApp();
  const { user } = useAuth()

  function openModal() {
    setOpen(true)
  }

  function closeModal() {
    setOpen(false)
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (currentFolder == null) return

    const path = [...currentFolder.path]
    if (currentFolder !== ROOT_FOLDER) {
      path.push({ name: currentFolder.name, id: currentFolder.id })
    }

    
    addDoc(cloud.folders, {
      name: name,
      parentId: currentFolder.id,
      userId: user.uid,
      path: path,
      createdAt: cloud.getCurrentTimestamp(),
    }).then( () => {
      logEvent(analytics, 'add_folder', {
        uid: user.uid
      });
    });

    setName("")
    closeModal()
  }

  return (
    <>
      <Button onClick={openModal} variant="outline-success" size="sm"><i className="fas fa-folder-plus"></i></Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Folder Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Add Folder
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
