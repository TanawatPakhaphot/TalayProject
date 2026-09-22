import { Construction } from 'lucide-react';
import './ComingSoon.css';

interface ComingSoonProps {
  title: string;
}

export function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="coming-soon">
      <Construction className="coming-soon__icon" size={28} aria-hidden="true" />
      <h1 className="coming-soon__title">{title}</h1>
      <p className="coming-soon__description">This section is coming soon.</p>
    </div>
  );
}
