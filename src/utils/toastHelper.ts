import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastOptions = {
    position: 'top-right' as const,
    autoClose: 3000,
    closeOnClick: false,
    theme: "light",
}
export const showSuccessToast = (message: string) => {
    toast.success(message, {
        ...toastOptions,
        style: { color: 'green' },
    });
};

export const showErrorToast = (message: string) => {
    toast.error(message, {
        ...toastOptions,
        style: { color: 'red' },
    });
};

export const showInfoToast = (message: string) => {
    toast.info(message, {
        ...toastOptions,
        style: { color: 'blue' },
    });
};

export const showWarningToast = (message: string) => {
    toast.warn(message, {
        ...toastOptions,
        style: { color: 'yellow' },
    });
};