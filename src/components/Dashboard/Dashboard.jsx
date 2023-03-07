import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext'

import useFolder from "@/hooks/useFolder"
import AddFolderButton from "@/components/AddFolderButton"
import AddFileButton from "@/components/AddFileButton"
import Folder from "@/components/Folder"
import File from "@/components/File"
import FolderBreadcrumbs from "@/components/FolderBreadcrumbs"
import { useParams, useLocation } from "react-router-dom"

export default function Dashboard() {
  const [show, setShow] = useState(true);
  const { folderId } = useParams();
  const { state = {} } = useLocation()
  console.log({ state });
  const { folder, childFolders, childFiles } = useFolder(folderId, state?.folder);

  const { verification, verificationEmail, user, verify } = useAuth();

  useEffect(() => {
    if(verification) {
      setShow(false);
    }
  }, [verification]);

  async function handleVerify(evt) {
    evt.preventDefault();
    await verify();
  }
  

  return (
    <Container fluid className="mt-4">
        { (!verification && show) ? 
        <Alert variant="warning" onClose={() => setShow(false)} dissmissible>
            <Alert.Heading>Just a warning!</Alert.Heading>
            <hr/>
            Your account is not verified. { verificationEmail ? <span>We have already sent you a verification email to your inbox</span> : <a href='#' role={"button"} onClick={handleVerify}>Click here to verify your account</a>}.
          </Alert> : <></> }
        <div className="d-flex align-items-center">
          <FolderBreadcrumbs currentFolder={folder} />
          <AddFileButton currentFolder={folder} />
          <AddFolderButton currentFolder={folder} />
        </div>
        {childFolders.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFolders.map(childFolder => (
              <div
                key={childFolder.id}
                style={{ maxWidth: "250px" }}
                className="p-2"
              >
                <Folder folder={childFolder} />
              </div>
            ))}
          </div>
        )}
        {childFolders.length > 0 && childFiles.length > 0 && <hr />}
        {childFiles.length > 0 && (
          <div className="d-flex flex-wrap">
            {childFiles.map(childFile => (
              <div
                key={childFile.id}
                style={{ maxWidth: "250px" }}
                className="p-2"
              >
                <File file={childFile} />
              </div>
            ))}
          </div>
        )}
    </Container>
  )
}
