import { Link } from '@/components/Links';
import Image from 'next/image';
import { Logo } from '@/components/Logo';
import { MediumHeader5 } from '@/components/Text';
import { PrimaryButton } from '@/components/Buttons';
import { app_routes } from '@/lib/constants';

export default function NotFound() {
  return (
    <div className="bg-custom-bg bg-cover bg-center bg-no-repeat h-screen w-screen overflow-y-hidden overflow-x-hidden">
      <div className="z-50 w-full flex flex-wrap items-center justify-between px-10 py-5 navbar-expand-lg shadow h-20">
        <Logo />
      </div>

      <div className="w-full mt-6 pt-6 justify-center items-center text-center px-6">
        <div className="mx-auto flex justify-center text-center my-8">
          <Image src="/img/404.svg" alt="not found" width={500} height={500} />
        </div>

        <MediumHeader5 className="text-white">Sorry, Page not found!</MediumHeader5>
        <div className="mt-6">
          <Link href={app_routes.home}>
            <PrimaryButton>Home</PrimaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
