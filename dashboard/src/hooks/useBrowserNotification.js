import { useEffect } from 'react';

export const useBrowserNotification = (alertCount) => {
  useEffect(() => {
    // Keep the title simple - no alert count or status changes
    // The title will remain as set in index.html: "Tourist Safety Dashboard"
    
    // This hook can be used for other browser notifications if needed in the future
    // but for now, we keep the title unchanged
  }, [alertCount]);
};

export default useBrowserNotification;
