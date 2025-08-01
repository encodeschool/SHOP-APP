import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center py-4 shadow-inner mt-auto">
      <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Shop. All rights reserved.</p>
    </footer>
  );
}