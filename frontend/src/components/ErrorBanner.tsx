import { AlertTriangle, RefreshCw } from 'lucide-react';
import './ErrorBanner.css';

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="error-banner" role="alert">
      <AlertTriangle className="error-banner__icon" size={20} aria-hidden="true" />
      <span className="error-banner__message">{message}</span>
      <button type="button" className="error-banner__retry" onClick={onRetry}>
        <RefreshCw size={16} aria-hidden="true" />
        Retry
      </button>
    </div>
  );
}
