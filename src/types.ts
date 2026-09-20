export interface ProjectItem {
  id: string;
  type: string;
  title: string;
  description: string;
  tags: string[];
  diagram: string;
  chip: string;
  number: string;
  visualType: 'mirror' | 'robot' | 'energy' | 'security' | 'homeauto' | 'qubit' | 'typetrack' | 'railway';
  link?: string;
  linkLabel?: string;
  featured?: boolean;
  lastUpdated?: string;
  stars?: number;
}

export type CertificateCategory = 'all' | 'technical' | 'learning' | 'participation';

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  img: string;
  category: 'technical' | 'learning' | 'participation';
  badge: string;
}
