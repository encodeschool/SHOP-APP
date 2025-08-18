import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const LoginPromptModal = ({ open, onClose }) => {
  const { t } = useTranslation();
  const modalRef = useRef(null);
  const cancelButtonRef = useRef(null);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && open && typeof onClose === 'function') {
        onClose();
      }
    };

    // Set focus to the cancel button when modal opens
    if (open && cancelButtonRef.current) {
      cancelButtonRef.current.focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Trap focus within the modal
  useEffect(() => {
    const handleTabKey = (event) => {
      if (!open || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-prompt-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl p-6 w-full max-w-sm sm:max-w-md shadow-lg"
      >
        <h2 id="login-prompt-title" className="text-lg font-semibold mb-4">
          {t('Login Required', 'Login Required')}
        </h2>
        <p className="mb-6 text-gray-700">
          {t('You must be logged in to favorite products.', 'You must be logged in to favorite products.')}
        </p>
        <div className="flex justify-end gap-2">
          <button
            ref={cancelButtonRef}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onClick={typeof onClose === 'function' ? onClose : () => {}}
          >
            {t('Cancel', 'Cancel')}
          </button>
          <Link
            to="/login"
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {t('Login', 'Login')}
          </Link>
        </div>
      </div>
    </div>
  );
};

LoginPromptModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LoginPromptModal;