import React, { useState } from 'react';
import "./../style/PromtStyle.css";

const CustomPrompt = ({ isOpen, onClose, onConfirm, listAttend }) => {
  if (!isOpen) return null;

  if (!Array.isArray(listAttend)) {
    // If listAttend is not an array or is undefined, set it to an empty array
    console.log(listAttend);
    listAttend.forEach((value, key) => {
      console.log(value); // Log each value
    });
  }



  return (
    <div
      isOpen={isOpen}
      onRequestClose={onClose}
      onClick={onClose}
      className='overlay'
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modal1Container">
        <h2>Are you sure you want to save the attendance session?</h2>
        <div className='attendeeList'>
          <h3 className='text-lg font-semibold mb-2'>Attendee List:</h3>
          <ul
            style={{
              background: "lightgray",
              maxHeight: "25rem", // Set a maximum height for the list container
              overflowY: "auto", // Enable vertical scrolling when content exceeds the container's height
              padding: "10px", // Optional: Add padding to improve appearance
            }}
          >
            {Array.from(listAttend.entries()).map(([key, value]) => (
              <li key={key} className='mb-1'>{value}</li>
            ))}
          </ul>
        </div>
        <div className="btnContainer">
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default CustomPrompt;
