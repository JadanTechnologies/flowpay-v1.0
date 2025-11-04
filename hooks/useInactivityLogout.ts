
import { useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';

const useInactivityLogout = (timeout: number, enabled: boolean = true) => {
  const timeoutId = useRef<number | null>(null);
  const { logout: appLogout, addNotification } = useAppContext();

  const logout = useCallback(() => {
    addNotification({ message: "You have been logged out due to inactivity.", type: 'warning' });
    appLogout();
    // The onAuthStateChange listener in AppContext or state update will handle the redirect.
  }, [appLogout, addNotification]);

  const resetTimer = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    if (enabled) {
      timeoutId.current = window.setTimeout(logout, timeout);
    }
  }, [timeout, enabled, logout]);

  const handleUserActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

    events.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    resetTimer();

    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [handleUserActivity, resetTimer, enabled]);
};

export default useInactivityLogout;