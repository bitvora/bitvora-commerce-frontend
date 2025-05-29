import { Buttons } from './server-components';
import { NavLinks, Menu, AppLogo, Footer } from './client-components';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen h-screen bg-bg flex flex-col overflow-y-auto overflow-x-hidden">
      <header className="w-screen z-[1000] fixed top-0 left-0 right-0 px-5 md:px-0 backdrop-blur-3xl">
        <div
          className="rounded-4xl xl:rounded-[4000px] mt-4 h-16 md:h-[64px] lg:h-[80px] w-full md:max-w-[600px] z-[1000] bg-bg lg:max-w-[900px] xl:max-w-[1050px] 2xl:max-w-[1256px] mx-auto border-[0.5px] border-primary-500 px-[20px] xl:px-[32px] py-[px] flex items-center justify-between"
          id="navbar">
          <AppLogo />

          <NavLinks />

          <div className="flex items-center gap-3">
            <Buttons />

            <Menu />
          </div>
        </div>
      </header>

      {children}

      <Footer />
    </div>
  );
}
