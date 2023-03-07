import React, { useState } from "react"
import ReactDOM from "react-dom"
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { v4 as uuidV4 } from "uuid"
import ProgressBar from "react-bootstrap/ProgressBar"
import Toast from "react-bootstrap/Toast"

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { query, where, getDocs, setDoc, doc } from 'firebase/firestore';

const { PUBLIC_FIREBASE_APP_NAME='syncsilo' } = import.meta.env;

export default function AddFileButton({ currentFolder }) {
  const [uploadingFiles, setUploadingFiles] = useState([])
  const { user } = useAuth()
  const { storage, cloud } = useApp();

  function handleUpload(e) {

    const file = e.target.files[0]
    if (currentFolder == null || file == null) return

    const id = uuidV4()

    setUploadingFiles(prevUploadingFiles => [
      ...prevUploadingFiles,
      { id: id, name: file.name, progress: 0, error: false },
    ])

    const currentFolderId = currentFolder.id;

    let filePath = ['', PUBLIC_FIREBASE_APP_NAME, user.uid];

    if(currentFolderId !== null) {
      // move forward
      filePath.push(currentFolderId);
    }

    filePath.push(file.name);

    filePath = filePath.join('/').trimEnd('/');

    const storageRef = ref(storage, filePath);

    const uploadTask = uploadBytesResumable(storageRef, file);
    

    // const uploadTask = storage
    //   .ref(`/files/${user.uid}/${filePath}`)
    //   .put(file)

    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes
        setUploadingFiles(prevUploadingFiles => {
          return prevUploadingFiles.map(uploadFile => {
            if (uploadFile.id === id) {
              return { ...uploadFile, progress: progress }
            }

            return uploadFile
          })
        })
      },
      () => {
        setUploadingFiles(prevUploadingFiles => {
          return prevUploadingFiles.map(uploadFile => {
            if (uploadFile.id === id) {
              return { ...uploadFile, error: true }
            }
            return uploadFile
          })
        })
      },
      () => {
        setUploadingFiles(prevUploadingFiles => {
          return prevUploadingFiles.filter(uploadFile => {
            return uploadFile.id !== id
          })
        })
        
        getDownloadURL(uploadTask.snapshot.ref).then( async url => {
          // let q = query(cloud.files, where("name", "==", file.name), where("userId", "==", user.uid), where("folderId", "==", currentFolder.id));
          
          // let docs = await getDocs(q);

          const newFile = doc(cloud.files);
          
          let icon = 'fa-file';

          if(file.type.indexOf("audio/") !== -1) {
            icon = 'fa-file-audio'
          }else if(file.type.indexOf("image/") !== -1) {
            icon = "fa-file-image"
          }else if(file.type.indexOf("video/") !== -1) {
            icon = "fa-file-video"
          }else if(file.type.indexOf("text/html") !== -1 || file.type.indexOf("text/css") !== -1 || file.type.indexOf("application/javascript") || file.type.indexOf("application/json")) {
            icon = "fa-file-code"
          }else if(file.type.indexOf("application/pdf") !== -1) {
            icon = "fa-file-pdf"
          }else if(file.type.indexOf("text/plain") !== -1 || file.type.indexOf("text/") != -1) {
            icon = "fa-file-alt"
          }else if(file.type.indexOf("application/msword") !== -1) {
            icon = "fa-file-word"
          }else if(file.type.indexOf("application/vnd.ms-excel") !== -1) {
            icon = "fa-file-excel"
          }else if(file.type.indexOf("application/vnd.ms-powerpoint") !== -1 ) {
            icon = "fa-file-powerpoint"
          }

          await setDoc(newFile, {
            url: url,
            name: file.name,
            folderId: currentFolder.id,
            icon,
            userId: user.uid,
            type: file.type,
            createdAt: cloud.getCurrentTimestamp(),
          });
        })
      }
    )
  }

  return (
    <>
      <label className="btn btn-outline-success btn-sm m-0 mx-2">
        <i className="fas fa-file-upload"></i>
        <input
          type="file"
          onChange={handleUpload}
          style={{ opacity: 0, position: "absolute", left: "-9999px" }}
        />
      </label>
      {uploadingFiles.length > 0 &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              right: "1rem",
              maxWidth: "250px",
            }}
          >
            {uploadingFiles.map(file => (
              <Toast
                key={file.id}
                onClose={() => {
                  setUploadingFiles(prevUploadingFiles => {
                    return prevUploadingFiles.filter(uploadFile => {
                      return uploadFile.id !== file.id
                    })
                  })
                }}
              >
                <Toast.Header
                  closeButton={file.error}
                  className="text-truncate w-100 d-block"
                >
                  {file.name}
                </Toast.Header>
                <Toast.Body>
                  <ProgressBar
                    animated={!file.error}
                    variant={file.error ? "danger" : "primary"}
                    now={file.error ? 100 : file.progress * 100}
                    label={
                      file.error
                        ? "Error"
                        : `${Math.round(file.progress * 100)}%`
                    }
                  />
                </Toast.Body>
              </Toast>
            ))}
          </div>,
          document.body
        )}
    </>
  )
}