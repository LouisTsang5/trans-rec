import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { loadList, parseData } from '../../lib/localStorage';
import './save.css';

const Save: FunctionComponent = () => {
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

    const [isFileError, setIsFileError] = useState(false);
    useEffect(() => {
        if (!isFileError) return;
        const timeout = setTimeout(() => setIsFileError(false), 450);
        return () => clearTimeout(timeout);
    }, [isFileError]);

    const uploadElem = useRef<HTMLInputElement>(null);
    const onClickUpload = (e: React.MouseEvent) => {
        e.preventDefault();
        const elem = uploadElem.current;
        if (!elem) throw new Error('Cannot find upload element');
        if (!elem.files || elem.files.length === 0) return setIsFileError(true);
        const file = elem.files[0];
        const fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = (e) => {
            if (!e.target) throw new Error('No target');
            console.log(parseData(e.target.result as string));
        };
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', justifyContent: 'center', alignItems: 'center', width: '100%', height: '60vh' }}>
            <h2>Upload / Download Saved Data</h2>

            <a ref={downloadElem} style={{ display: 'none' }} />
            <button className='btn btn-outline-success' onClick={onClickDownload}>Download Data</button>

            <input type='file' className={`form-control ${isFileError && 'error'}`} ref={uploadElem} onChange={(e) => console.log(e.target)} style={{ width: '70%' }} />
            <button className='btn btn-outline-primary' onClick={onClickUpload}>Upload Data</button>
        </div>
    );
};

export default Save;