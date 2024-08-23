import { FaSpinner } from 'react-icons/fa';
import './Loading.css';

const Loading: React.FC = () => {
  return (
    <div className="loading-container">
      <FaSpinner className="spinner" />
    </div>
  );
};

export default Loading;