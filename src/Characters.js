// Character.js
import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import './Characters.css';

const Character = ({ character,onToggleFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleCheckboxChange = () => {
    setIsFavorite(!isFavorite);
    onToggleFavorite();
  };

  return (
    <div className="character-card">
      <img src={character.image} alt={character.name} />
      <h2>{character.name}</h2>
      <p>Status: {character.status}</p>
      <p>Species: {character.species}</p>
      <p>Gender: {character.gender}</p>
      <p>Origin: {character.origin.name}</p>
      <p>Location: {character.location.name}</p>
      <p>Episodes: {character.episode.length}</p>
      <label>
        <input
          type="checkbox"
          checked={isFavorite}
          onChange={handleCheckboxChange}
        />
        <span>Favorite</span>
      </label>
      {isFavorite && <FaHeart color="red" size={20} />}
    </div>
  );
};

export default Character;
