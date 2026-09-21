import type { Metadata } from 'next';
import { fontVariableClass } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: '손편지 — 마음을 손으로 써서 보내드려요',
  description: '웹에서 편지지를 고르고 편지를 쓰면, 실제 손글씨로 써서 우편으로 보내드립니다.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ko" className={`${fontVariableClass} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
