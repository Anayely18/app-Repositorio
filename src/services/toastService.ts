import { toast, ExternalToast } from "sonner";

type ToastMessage = string;
type ToastOptions = ExternalToast;
type ToastId = string | number;

interface ToastService {
    success(message: ToastMessage, options?: ToastOptions): ToastId;
    error(message: ToastMessage, options?: ToastOptions): ToastId;
    info(message: ToastMessage, options?: ToastOptions): ToastId;
    warning(message: ToastMessage, options?: ToastOptions): ToastId;
    promise<T>(
        promise: Promise<T>,
        messages: {
            loading: ToastMessage;
            success: ToastMessage | ((data: T) => ToastMessage);
            error: ToastMessage | ((error: Error) => ToastMessage);
        },
        options?: ToastOptions
    ): ToastId;
    loading(message: ToastMessage, options?: ToastOptions): ToastId;
    dismiss(toastId?: ToastId): void;
    custom(jsx: (id: ToastId) => React.ReactElement, options?: ToastOptions): ToastId;
}

const DEFAULT_DURATION = 3000;

export const toastService: ToastService = {
    success(message: ToastMessage, options?: ToastOptions): ToastId {
        return toast.success(message, {
            duration: DEFAULT_DURATION,
            ...options
        });
    },

    error(message: ToastMessage, options?: ToastOptions): ToastId {
        return toast.error(message, {
            duration: DEFAULT_DURATION,
            ...options
        });
    },

    info(message: ToastMessage, options?: ToastOptions): ToastId {
        return toast.info(message, {
            duration: DEFAULT_DURATION,
            ...options
        });
    },

    warning(message: ToastMessage, options?: ToastOptions): ToastId {
        return toast.warning(message, {
            duration: DEFAULT_DURATION,
            ...options
        });
    },

    promise<T>(
        promise: Promise<T>,
        messages: {
            loading: ToastMessage;
            success: ToastMessage | ((data: T) => ToastMessage);
            error: ToastMessage | ((error: Error) => ToastMessage);
        },
        options?: ToastOptions
    ): ToastId {
        return toast.promise(promise, {
            loading: messages.loading,
            success: messages.success,
            error: messages.error,
            ...options
        }) as ToastId;
    },

    loading(message: ToastMessage, options?: ToastOptions): ToastId {
        return toast.loading(message, options);
    },

    dismiss(toastId?: ToastId): void {
        toast.dismiss(toastId);
    },

    custom(jsx: (id: ToastId) => React.ReactElement, options?: ToastOptions): ToastId {
        return toast.custom(jsx, options);
    }
};