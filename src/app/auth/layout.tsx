import { Link } from '@/components/Links';
import { Logo } from '@/components/Logo';
import { app_routes } from '@/lib/constants';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Suspense } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <div className="w-screen h-screen px-3 py-3 overflow-hidden flex flex-col lg:grid lg:grid-cols-3 gap-4">
        <div
          className="lg:col-span-1 h-[200px] lg:h-full rounded-xl flex flex-col px-8 py-8 relative justify-center"
          id="auth-section">
          <header className="absolute top-10 left-4 lg:left-7">
            <Logo />
          </header>

          <div className="my-12 hidden lg:flex flex-col gap-4 max-w-[350px]">
            <h1 className="text-4xl/[115%] font-normal">
              Open Source <br />
              <span className="text-secondary-700">Bitcoin Payments</span> <br />
              For Everyone
            </h1>

            <p className="text-light-900 font-normal text-sm">
              The 100% open source Bitcoin payment platform for merchants, online stores, and
              businesses. Accept Lightning and on-chain payments without giving up control.
            </p>
          </div>

          <div className="absolute bottom-10 left-7 hidden lg:flex">
            <Link href={app_routes.home}>
              <div className="flex items-center gap-2 text-light-900 hover:text-light-800">
                <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                <p>Back to home</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="w-full h-full lg:col-span-2 lg:py-10 px-4 lg:px-10 flex lg:justify-center lg:items-center relative">
          {children}
        </div>
      </div>
    </Suspense>
  );
}
