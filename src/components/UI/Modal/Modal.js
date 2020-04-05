import React from 'react';
import Backdrop from '../Backdrop/Backdrop';
import classes from './Modal.module.css';

const Modal = ({ children, show, modalClosed }) => {
  return (
    <React.Fragment>
      <Backdrop show={show} clicked={modalClosed} />
      <div
        className={classes.Modal}
        style={{
          transform: show ? 'translateY(0)' : 'translateY(-100vh)',
          opacity: show ? '1' : '0',
        }}
      >
        {children}
      </div>
    </React.Fragment>
  );
};

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.show === nextProps.show &&
    prevProps.children === nextProps.children
  );
};

export default React.memo(Modal, areEqual);
