import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <button onClick={onClose} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  );
};

export default Modal;