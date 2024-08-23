import React from 'react';
import { ErrorProps } from '../../utils/Interfaces';
import { MdOutlineRunningWithErrors } from 'react-icons/md';
import './Error.css';



const Error: React.FC<ErrorProps> = ({ message }) => {
  return (
    <div className="error-page">
      <MdOutlineRunningWithErrors className="error-icon" />
      <h1>Something went wrong</h1>
      <p>{message}</p>
    </div>
  );
};

export default Error;