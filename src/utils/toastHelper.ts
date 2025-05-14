import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.minimal.css';

const toastOptions = {
    position: 'top-right' as const,
    autoClose: 3000,
    closeOnClick: false,
}
export const showSuccessToast = (message: string) => {
    toast.success(message, {
        ...toastOptions,
        style: { backgroundColor: 'green', color: 'white' },
    });
};

export const showErrorToast = (message: string) => {
    toast.error(message, {
        ...toastOptions,
        style: { backgroundColor: 'red', color: 'white' },
    });
};

export const showInfoToast = (message: string) => {
    toast.info(message, {
        ...toastOptions,
        style: { backgroundColor: 'black', color: 'white' },
    });
};

export const showWarningToast = (message: string) => {
    toast.warn(message, {
        ...toastOptions,
        style: { backgroundColor: 'black', color: 'white' },
    });
};