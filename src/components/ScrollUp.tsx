import { useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';

const ScrollToTop: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { pathname } = useLocation();
  const outlet = useOutlet();

  useEffect(() => {
    const isSeasonPath = pathname.match(/\/season\/\d+$/);
    if (!outlet && !isSeasonPath) {
      window.scrollTo(0, 0);
    }
  }, [pathname, outlet]);

  
  return <>{children}</>;
};

export default ScrollToTop;