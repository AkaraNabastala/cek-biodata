import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-500">
      <p>
        © {new Date().getFullYear()} SMP Islam Caruy. All rights reserved.
      </p>
      <p className="mt-1">
        Built with ❤️ by <a href="https://nebula.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-green-600 hover:text-green-800 transition-colors">NEBULA</a> - Menciptakan bintang disemesta digital
      </p>
    </footer>
  );
};

export default Footer;
