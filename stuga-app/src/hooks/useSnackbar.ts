import { useState } from 'react';

export function useSnackbar() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(3000);

  function showSnackbar(msg: string, durationMs: number = 3000) {
    setMessage(msg);
    setDuration(durationMs);
    setVisible(true);
  }

  function hideSnackbar() {
    setVisible(false);
  }

  return {
    visible,
    message,
    duration,
    showSnackbar,
    hideSnackbar
  };
}
