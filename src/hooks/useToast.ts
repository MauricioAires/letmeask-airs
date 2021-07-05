import toast, { Toaster } from 'react-hot-toast';

export function useToast() {
  const showToast = function (icon: string, message: string) {
    toast(message, {
      duration: 4000,
      position: 'top-center',
      // Styling
      style: {},
      className: '',
      // Custom Icon
      icon: icon,
      // Change colors of success/error/loading icon
      iconTheme: {
        primary: '#000',
        secondary: '#fff'
      },
      // Aria
      ariaProps: {
        role: 'status',
        'aria-live': 'polite'
      }
    });
  };

  return { showToast, Toaster };
}
