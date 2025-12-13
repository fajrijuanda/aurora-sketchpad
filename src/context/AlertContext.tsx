import { createContext, useContext, useState, type ReactNode } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Button } from '../components/ui/Button';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

type AlertType = 'success' | 'info' | 'danger' | 'warning';

interface AlertOptions {
    title?: string;
    message: string;
    type?: AlertType;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
}

interface AlertContextType {
    showAlert: (options: AlertOptions) => void;
    closeAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [alert, setAlert] = useState<AlertOptions | null>(null);

    const showAlert = (options: AlertOptions) => {
        setAlert(options);
    };

    const closeAlert = () => {
        setAlert(null);
    };

    const handleConfirm = () => {
        if (alert?.onConfirm) alert.onConfirm();
        closeAlert();
    };

    const handleCancel = () => {
        if (alert?.onCancel) alert.onCancel();
        closeAlert();
    };

    return (
        <AlertContext.Provider value={{ showAlert, closeAlert }}>
            {children}
            <AnimatePresence>
                {alert && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-md"
                        >
                            <GlassCard className="!p-0 overflow-hidden border border-white/10 shadow-2xl">
                                <div className={clsx("h-2 w-full",
                                    alert.type === 'danger' && "bg-gradient-to-r from-red-500 to-orange-500",
                                    alert.type === 'success' && "bg-gradient-to-r from-green-500 to-emerald-500",
                                    alert.type === 'info' && "bg-gradient-to-r from-blue-500 to-cyan-500",
                                    (!alert.type || alert.type === 'warning') && "bg-gradient-to-r from-yellow-500 to-orange-500"
                                )} />

                                <div className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className={clsx("p-3 rounded-full flex-shrink-0",
                                            alert.type === 'danger' && "bg-red-500/10 text-red-500",
                                            alert.type === 'success' && "bg-green-500/10 text-green-500",
                                            alert.type === 'info' && "bg-blue-500/10 text-blue-500",
                                            (!alert.type || alert.type === 'warning') && "bg-yellow-500/10 text-yellow-500"
                                        )}>
                                            {alert.type === 'danger' && <AlertCircle size={24} />}
                                            {alert.type === 'success' && <CheckCircle size={24} />}
                                            {(alert.type === 'info' || !alert.type || alert.type === 'warning') && <Info size={24} />}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white mb-1">
                                                {alert.title || (alert.type === 'danger' ? 'Error' : alert.type === 'success' ? 'Success' : 'Information')}
                                            </h3>
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                {alert.message}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 mt-6">
                                        {alert.onConfirm ? (
                                            <>
                                                <button
                                                    onClick={handleCancel}
                                                    className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                                >
                                                    {alert.cancelText || 'Cancel'}
                                                </button>
                                                <Button
                                                    onClick={handleConfirm}
                                                    glow
                                                    className={clsx(
                                                        alert.type === 'danger' && "!bg-red-500 !shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                                                    )}
                                                >
                                                    {alert.confirmText || 'Confirm'}
                                                </Button>
                                            </>
                                        ) : (
                                            <Button onClick={closeAlert} glow variant="glass">
                                                Close
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AlertContext.Provider>
    );
};
