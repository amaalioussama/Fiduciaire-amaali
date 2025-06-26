import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { usePathname, useSearchParams } from 'next/navigation';

const GA_MEASUREMENT_ID = 'G-TF2CWFGZMX';

const useGoogleAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    ReactGA.initialize(GA_MEASUREMENT_ID);
  }, []);

  useEffect(() => {
    // Track pageview on route change
    const page = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    ReactGA.send({ hitType: 'pageview', page });
  }, [pathname, searchParams]);
};

export default useGoogleAnalytics; 