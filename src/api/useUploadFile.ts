import axios, {
    AxiosRequestConfig,
    AxiosProgressEvent,
    CancelTokenSource,
    AxiosError
} from 'axios';

const DEFAULT_UPLOAD_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/files/upload`
    : '/api/files/upload';

interface UploadProgress {
    loaded: number;
    total: number;
    progress: number; // 0-100
}

interface UploadOptions {
    onProgress?: (progress: UploadProgress) => void;
    cancelToken?: CancelTokenSource;
}

interface UploadResponse {
    url: string;
}

class UploadError extends Error {
    constructor(
        message: string,
        public readonly code?: string,
        public readonly response?: unknown
    ) {
        super(message);
        this.name = 'UploadError';
    }
}

const uploadFile = async (
    file: File,
    url: string = DEFAULT_UPLOAD_URL, // 设置默认值
    options?: UploadOptions
): Promise<UploadResponse> => {
    if (!file || !(file instanceof File)) {
        throw new UploadError('Invalid file input');
    }

    if (!url || typeof url !== 'string') {
        throw new UploadError('Invalid upload URL');
    }

    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        cancelToken: options?.cancelToken?.token,
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total && options?.onProgress) {
                const progress: UploadProgress = {
                    loaded: progressEvent.loaded,
                    total: progressEvent.total,
                    progress: Math.round((progressEvent.loaded / progressEvent.total) * 100),
                };
                options.onProgress(progress);
            }
        },
    };

    try {
        const response = await axios.post<UploadResponse>(url, formData, config);
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            throw new UploadError('Upload cancelled by user');
        }

        const axiosError = error as AxiosError;
        throw new UploadError(
            axiosError.message || 'Upload failed',
            axiosError.code,
            axiosError.response?.data
        );
    }
}

export type { UploadProgress, UploadOptions, UploadResponse };
export { UploadError, DEFAULT_UPLOAD_URL };
export default uploadFile;