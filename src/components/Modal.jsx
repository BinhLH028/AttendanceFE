import React from 'react';
import "./../style/ModalStyle.css";

// import nft from './nft.jpg';
// const QRUrl = "https://zxing.org/w/chart?cht=qr&chs=350x350&chld=L&choe=UTF-8&chl=http%3A%2F%2Flocalhost%3A3082%2Fattend-successfull%2F"
const QRUrl = "https://zxing.org/w/chart?cht=qr&chs=350x350&chld=L&choe=UTF-8&chl=http%3A%2F%2F103.143.207.183%3A3082%2Fattend-successfull%2F"
// const QRUrl = "https://zxing.org/w/chart?cht=qr&chs=350x350&chld=L&choe=UTF-8&chl=https%3A%2F%2Fattendancefe.onrender.com%2Fattend-successfull%2F"
const Modal = ({ open, onClose, modalData }) => {
  const randomNumber = Math.floor(Math.random() * 900) + 100;
  if (!open) return null;
  return (
    <div onClick={onClose} className='overlay'>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer'
      >
        <img src={QRUrl + modalData + "/" + randomNumber} alt='/' />
      </div>
    </div>
  );
};

export default Modal;