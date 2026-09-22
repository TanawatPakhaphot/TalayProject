import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import './Toast.css';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onDismiss: () => void;
  duration?: number;
}

export function Toast({ message, type = 'success', onDismiss, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(timer);
  }, [onDismiss, duration]);

  const Icon = type === 'success' ? CheckCircle2 : XCircle;

  // Portal to <body> so `position: fixed` isn't clipped by an ancestor with overflow:hidden (e.g. .app-shell).
  return createPortal(
    <div
      className={`toast toast--${type}`}
      role="status"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <Icon className="toast__icon" size={18} aria-hidden="true" />
      <span className="toast__message">{message}</span>
      <button
        type="button"
        className="toast__close"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>,
    document.body,
  );
}
