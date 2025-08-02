// src/components/LoginPromptModal.jsx
import React from 'react';

const LoginPromptModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Login Required</h2>
        <p className="mb-6 text-gray-700">You must be logged in to favorite products.</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <a
            href="/login"
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;
