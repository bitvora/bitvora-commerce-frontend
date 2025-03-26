import { PrimaryButton } from '@/components/Buttons';
import { SemiboldHeader4, SemiboldSmallText } from '@/components/Text';
import { app_routes } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex flex-col gap-2 w-full text-center justify-center h-full md:w-[600px] min-h-[450px] md:h-auto md:border-[0.5px] md:border-light-400 md:rounded-lg lg:py-10 px-4 lg:px-10">
      <div className="mx-auto">
        <Image src="/img/login.png" alt="login" width={50} height={50} />
      </div>

      <SemiboldHeader4 className="text-light-900">Login</SemiboldHeader4>

      <SemiboldSmallText className="text-light-700">
        Thank you for confirming you email, you may now login here:
      </SemiboldSmallText>

      <div className="flex flex-col gap-2 absolute lg:relative bottom-10 lg:bottom-[unset] max-w-[500px] mx-auto w-full lg:w-[unset] left-0 lg:left-[unset] right-0 lg:right-[unset] mt-6 pt-6">
        <Link href={app_routes.login}>
          <PrimaryButton className="w-full md:min-w-[400px] h-12">Login</PrimaryButton>
        </Link>
      </div>
    </div>
  );
}
