import React, { FunctionComponent, useEffect, useReducer, useRef } from 'react';
import { useErrorInput } from '../lib/errorInput/errorInput';
import { loadList, parseData } from '../lib/localStorage';
import '../lib/errorInput/errorInput.css';

type SaveProps = {
    onUpload: (newList: TransactionData[]) => void,
}

function parseFile(file: File) {
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    return new Promise<TransactionData[]>((resolve, reject) => {
        fileReader.onload = (e) => {
            if (!e.target) return reject(new Error('No target'));
            try {
                resolve(parseData(e.target.result as string));
            } catch (error) {
                reject(error);
            }
        };
    });
}

type UploadState = {
    isUploading: boolean,
    isSuccess: boolean,
    isFailed: boolean,
    errorMessage: string,
}

type UploadAction = {
    type: 'Restart'
} | {
    type: 'Start'
} | {
    type: 'Success'
} | {
    type: 'Failed',
    errorMessage: string
}

function uploadStateReducer(state: UploadState, action: UploadAction): UploadState {
    switch (action.type) {
        case 'Start':
            return {
                isUploading: true,
                isSuccess: false,
                isFailed: false,
                errorMessage: ''
            };
        case 'Success':
            return {
                isUploading: false,
                isSuccess: true,
                isFailed: false,
                errorMessage: ''
            };
        case 'Failed':
            return {
                isUploading: false,
                isSuccess: false,
                isFailed: true,
                errorMessage: action.errorMessage
            };
        case 'Restart':
            return initialState;
        default:
            return state;
    }
}

const initialState: UploadState = {
    isUploading: false,
    isSuccess: false,
    isFailed: false,
    errorMessage: '',
};

const Save: FunctionComponent<SaveProps> = ({ onUpload }) => {
    //Download button
    const downloadElem = useRef<HTMLAnchorElement>(null);
    const onClickDownload = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!downloadElem.current) throw new Error('Cannot find download element');
        const elem = downloadElem.current;
        const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(loadList()))}`;
        elem.setAttribute('href', dataStr);
        elem.setAttribute('download', 'data.json');
        elem.click();
    };

    //Upload button and file input
    const [isFileError, setIsFileError] = useErrorInput(false);
    const [uploadState, dispatchUploadState] = useReducer(uploadStateReducer, initialState);
    useEffect(() => {
        if (uploadState.isFailed) setIsFileError(true);
    }, [uploadState.isFailed]);

    const uploadElem = useRef<HTMLInputElement>(null);
    const onClickUpload = (e: React.MouseEvent) => {
        e.preventDefault();
        const elem = uploadElem.current;
        if (!elem) throw new Error('Cannot find upload element');
        if (!elem.files || elem.files.length === 0) return dispatchUploadState({ type: 'Failed', errorMessage: new Error('Cannot find file').toString() });
        const file = elem.files[0];
        dispatchUploadState({ type: 'Start' });
        parseFile(file)
            .then(newList => {
                onUpload(newList);
                dispatchUploadState({ type: 'Success' });
            })
            .catch(err => {
                dispatchUploadState({ type: 'Failed', errorMessage: err.toString() });
            });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', justifyContent: 'center', alignItems: 'center', width: '100%', height: '60vh' }}>
            <h2>Upload / Download Saved Data</h2>

            <a ref={downloadElem} style={{ display: 'none' }} />
            <button className='btn btn-outline-success' onClick={onClickDownload}>Download Data</button>

            <input type='file' className={`form-control ${isFileError && 'error'}`} ref={uploadElem} onChange={() => dispatchUploadState({ type: 'Restart' })} disabled={uploadState.isSuccess} style={{ width: '70%' }} />
            <button className='btn btn-outline-primary' onClick={onClickUpload} disabled={uploadState.isUploading || uploadState.isSuccess || uploadState.isFailed}>
                {
                    uploadState.isUploading ? 'Uploading' :
                        uploadState.isSuccess ? 'Upload Successful' :
                            uploadState.isFailed ? uploadState.errorMessage :
                                'Upload Data'
                }
            </button>
        </div>
    );
};

export default Save;