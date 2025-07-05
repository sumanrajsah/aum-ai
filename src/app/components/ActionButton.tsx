"use client"
import React from 'react';
import './style.css'
interface ActionButtonProps {
  text: string; // Text to display on the button
  onClick: () => void; // Function to execute when the button is clicked
}

const ActionButton: React.FC<ActionButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className='action-button'
    >
      {text}
    </button>
  );
};

export default ActionButton;