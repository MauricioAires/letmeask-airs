import { useEffect, useState } from 'react';

export function useInterval() {
  const [seconds, setSeconds] = useState<number>(0);
  const [stop, setStop] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1000);

    if (stop) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [seconds, stop]);

  function stopInterval() {
    setStop(true);
  }

  return { seconds, stopInterval };
}
