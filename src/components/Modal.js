import React from 'react';
import "./../style/ModalStyle.css";

// import nft from './nft.jpg';
const QRUrl = "https://zxing.org/w/chart?cht=qr&chs=350x350&chld=L&choe=UTF-8&chl=http%3A%2F%2Flocalhost%3A3000%2Fattend-successfull%2F"
const Modal = ({ open, onClose, modalData }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} className='overlay'>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer'
      >
        <img src={QRUrl + modalData} alt='/' />
        <div className='modalRight'>
          <p style={{cursor:"pointer"}} className='closeBtn' onClick={onClose}>
            X
          </p>
          <div className='content'>
            <p>Do you want a</p>
            <h1>$20 CREDIT</h1>
            <p>for your first tade?</p>
          </div>
          <div className='btnContainer'>
            <button className='btnPrimary'>
              <span className='bold'>YES</span>, I love NFT's
            </button>
            <button className='btnOutline'>
              <span className='bold'>NO</span>, thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;