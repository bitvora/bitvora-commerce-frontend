import { type ReactNode, useEffect } from 'react';

const ScrollTop = ({ children }: { children: ReactNode }): ReactNode => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  return children;
};

export default ScrollTop;
