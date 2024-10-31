import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import {
    Button,
    LinearProgress,
    Typography,
    Alert,
    IconButton,
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import axios, { CancelTokenSource } from 'axios';
import uploadFile, { UploadError, UploadProgress } from '../api/useUploadFile';

interface FileUploadComponentProps {
    uploadUrl?: string; // optional prop with default value
    onUploadSuccess?: (url: string) => void;
    onUploadError?: (error: Error) => void;
}

const FileUploadComponent = ({
    uploadUrl = import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api/files/upload`
        : '/api/files/upload',
    onUploadSuccess,
    onUploadError,
}: FileUploadComponentProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const cancelTokenRef = useRef<CancelTokenSource | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (selectedFile: File) => {
        setFile(selectedFile);
        setError('');
        setProgress(0);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            handleFileSelect(selectedFile);
        }
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);

        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) {
            handleFileSelect(droppedFile);
        }
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleUpload = async () => {
        if (!file) return;

        setError('');
        setProgress(0);
        cancelTokenRef.current = axios.CancelToken.source();

        try {
            const result = await uploadFile(file, uploadUrl, {
                onProgress: (progress: UploadProgress) => {
                    setProgress(progress.progress);
                },
                cancelToken: cancelTokenRef.current,
            });

            onUploadSuccess?.(result.url);
            setFile(null);
            setProgress(0);
        } catch (err) {
            const error = err as UploadError;
            const errorMessage = error.message || 'Upload failed';
            setError(errorMessage);
            onUploadError?.(error);
        }
    };

    const handleCancel = () => {
        cancelTokenRef.current?.cancel();
        setProgress(0);
    };

    const handleClearFile = () => {
        setFile(null);
        setError('');
        setProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-4">
            <div
                className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center transition-colors
                    ${
                        isDragging
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300'
                    }
                    ${error ? 'border-red-300' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                />

                {!file ? (
                    <div className="space-y-4">
                        <UploadIcon className="w-12 h-12 mx-auto text-gray-400" />
                        <Typography variant="body1">
                            Drag and drop a file here, or
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Select File
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Typography noWrap className="flex-1">
                                {file.name}
                            </Typography>
                            <IconButton size="small" onClick={handleClearFile}>
                                <CloseIcon />
                            </IconButton>
                        </div>

                        {progress > 0 && progress < 100 && (
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                className="w-full"
                            />
                        )}

                        <div className="space-x-2">
                            <Button
                                variant="contained"
                                onClick={handleUpload}
                                disabled={progress > 0 && progress < 100}
                            >
                                Upload
                            </Button>
                            {progress > 0 && progress < 100 && (
                                <Button
                                    variant="outlined"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <Alert severity="error" onClose={() => setError('')}>
                    {error}
                </Alert>
            )}
        </div>
    );
};

export default FileUploadComponent;
