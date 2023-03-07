import { useReducer, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from  "@/contexts/AppContext";

import { getDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export const ACTIONS = {
  SELECT_FOLDER: "select-folder",
  UPDATE_FOLDER: "update-folder",
  SET_CHILD_FOLDERS: "set-child-folders",
  SET_CHILD_FILES: "set-child-files",
}

export const ROOT_FOLDER = { name: "Root", id: null, path: [] }

function reducer(state, { type, payload }) {
    switch (type) {
        case ACTIONS.SELECT_FOLDER:
            return {
                folderId: payload.folderId,
                folder: payload.folder,
                childFiles: [],
                childFolders: [],
            }
        case ACTIONS.UPDATE_FOLDER:
            return {
                ...state,
                folder: payload.folder,
            }
        case ACTIONS.SET_CHILD_FOLDERS:
            return {
                ...state,
                childFolders: payload.childFolders,
            }
        case ACTIONS.SET_CHILD_FILES:
            return {
                ...state,
                childFiles: payload.childFiles,
            }
        default:
            return state
    }
}

export default function useFolder(folderId = null, folder = null) {

    const { cloud } = useApp();
    const { user } = useAuth()

    const [ state, dispatch ] = useReducer(reducer, {
        folderId,
        folder,
        childFolders: [],
        childFiles: [],
    });

    useEffect(() => {
        dispatch({ type: ACTIONS.SELECT_FOLDER, payload: { folderId, folder } })
    }, [folderId, folder])

    useEffect(() => {
        if (folderId == null) {
            return dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: { folder: ROOT_FOLDER },
            })
        }

        getDoc(cloud.folder(folderId))
        .then(doc => {
            dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: { folder: cloud.format(doc) },
            })
        })
        .catch(() => {
            dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: { folder: ROOT_FOLDER },
            })
        })
    }, [folderId]);

    useEffect(() => {
        
        const q =  query(cloud.folders, where("parentId", "==", folderId), where("userId", "==", user.uid), orderBy("createdAt"));
        return onSnapshot(q, (snapshot) => {
            dispatch({
                type: ACTIONS.SET_CHILD_FOLDERS,
                payload: { childFolders: snapshot.docs.map(cloud.format) },
            })
        })
    }, [folderId, user]);

    useEffect(() => {
        let q = query(cloud.files, where("folderId", "==", folderId), where("userId", "==", user.uid), orderBy("createdAt"));

        return onSnapshot(q , (snapshot) => {
            dispatch({
                type: ACTIONS.SET_CHILD_FILES,
                payload: { childFiles: snapshot.docs.map(cloud.format) },
            })
        })
        
    }, [folderId, user]);

    return state;
}