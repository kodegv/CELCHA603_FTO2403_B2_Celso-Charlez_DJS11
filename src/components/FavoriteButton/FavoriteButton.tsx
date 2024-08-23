import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FavoriteButtonProps } from '../../utils/Interfaces';

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ isFavorite, toggleFavorite }) => {
  return (
    <button className="favorite-button" onClick={toggleFavorite}>
      {isFavorite ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
};

export default FavoriteButton;