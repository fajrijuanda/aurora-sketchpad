import { createContext } from 'react';

export type AlertType = 'success' | 'info' | 'danger' | 'warning';

export interface AlertOptions {
    title?: string;
    message: string;
    type?: AlertType;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
}

export interface AlertContextType {
    showAlert: (options: AlertOptions) => void;
    closeAlert: () => void;
}

export const AlertContext = createContext<AlertContextType | undefined>(undefined);
