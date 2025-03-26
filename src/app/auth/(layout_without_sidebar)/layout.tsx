import { Logo } from '@/components/Logo';
import { Suspense } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <div className="w-screen h-screen px-3 py-8 md:py-10 md:px-10 overflow-hidden flex flex-col lg:grid lg:grid-cols-3 gap-4 relative">
        <header className="h-[150px] md:h-[unset]">
          <Logo />
        </header>

        <div className="w-full h-full flex flex-col md:justify-center md:items-center">
          {children}
        </div>
      </div>
    </Suspense>
  );
}
