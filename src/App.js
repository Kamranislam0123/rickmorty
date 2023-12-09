// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Character from './Characters';
import { FaHeart } from 'react-icons/fa';
import './App.css';

const App = () => {
  const [characters, setCharacters] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [relatedCharacters, setRelatedCharacters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://rickandmortyapi.com/api/character');
        setCharacters(response.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const toggleFavorite = async (character) => {
    const isFavorite = favorites.some((fav) => fav.id === character.id);

    if (isFavorite) {
      setFavorites(favorites.filter((fav) => fav.id !== character.id));
      setRelatedCharacters([]); // Clear related characters when removing a favorite
    } else {
      setFavorites([...favorites, character]);

      // Fetch characters who appeared in the same episodes as the selected favorite character
      const episodeIds = character.episode.map((ep) => ep.split('/').pop());
      const episodeCharacters = await fetchRelatedCharacters(episodeIds);
      setRelatedCharacters(episodeCharacters);
    }
  };

  const fetchRelatedCharacters = async (episodeIds) => {
    const episodePromises = episodeIds.map((id) => axios.get(`https://rickandmortyapi.com/api/episode/${id}`));
    const episodes = await Promise.all(episodePromises);
    const characterIds = episodes.flatMap((episode) => episode.data.characters.map((char) => char.split('/').pop()));
    const uniqueCharacterIds = Array.from(new Set(characterIds));

    const characterPromises = uniqueCharacterIds.map((id) => axios.get(`https://rickandmortyapi.com/api/character/${id}`));
    const characters = await Promise.all(characterPromises);

    return characters.map((char) => char.data);
  };

  return (
    <div className="app">
      <h1>Rick and Morty Characters</h1>
      <div className="character-list">
        {characters.map((character) => (
          <Character
            key={character.id}
            character={character}
            onToggleFavorite={() => toggleFavorite(character)}
          />
        ))}
      </div>
      <div className="favorites-section">
        <h2>Favorites</h2>
        {favorites.length === 0 ? (
          <p>No favorites selected.</p>
        ) : (
          <div className="favorites-list">
            {favorites.map((favCharacter) => (
              <div key={favCharacter.id} className="favorite-card">
                <input
                  type="checkbox"
                  checked
                  readOnly
                  className="favorite-checkbox"
                />
                <img src={favCharacter.image} alt={favCharacter.name} />
                <h3>{favCharacter.name}</h3>
                <FaHeart color="red" size={20} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="related-characters-section">
        <h2>Related Characters</h2>
        {relatedCharacters.length === 0 ? (
          <p>No related characters.</p>
        ) : (
          <div className="related-characters-list">
            {relatedCharacters.map((relatedCharacter) => (
              <div key={relatedCharacter.id} className="related-character-card">
                <img src={relatedCharacter.image} alt={relatedCharacter.name} />
                <h3>{relatedCharacter.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
