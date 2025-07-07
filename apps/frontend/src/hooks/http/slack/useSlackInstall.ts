import { errorHandler, tsrClient } from '@/lib/tsr-client';
import { useState } from 'react';

export const useSlackInstall = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const installSlack = async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const data = await tsrClient.slackContract.install.query();
      if (data.status === 302 && data.headers && typeof data.headers.get === 'function') {
        const location = data.headers.get('Location');
        if (location) {
          window.location.href = location;
          return;
        }
      }
      setIsError(true);
      setError('Unexpected response from Slack install endpoint.');
    } catch (err) {
      setIsError(true);
      setError(err);
      errorHandler(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    installSlack,
    isLoading,
    isError,
    error,
  };
};
