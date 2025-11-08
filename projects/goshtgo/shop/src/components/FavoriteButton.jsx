import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import LoginPromptModal from './LoginPromptModal';
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const FavoriteButton = ({ productId, favorites, setFavorites }) => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const isFavorite = favorites.includes(productId);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const { t } = useTranslation();

  const toggleFavorite = async (e) => {
    e.preventDefault();

    if (!userId || !token) {
      setShowLoginModal(true);
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`/favorites`, {
          params: { userId, productId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites((prev) => prev.filter((id) => id !== productId));
        toast.info('Removed from favorites');
      } else {
        await axios.post(
          `/favorites`,
          null,
          {
            params: { userId, productId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFavorites((prev) => [...prev, productId]);
        toast.success('Added to favorites');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast.error('An error occurred');
    }
  };

  return (
    <>
      <button
        onClick={toggleFavorite}
        className={`absolute top-2 right-2 z-10  p-3 hover:text-red-500 ${
          isFavorite ? 'text-red-500' : 'text-gray-400'
        }`}
      >
        <FaHeart size={25} />
      </button>
      <LoginPromptModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default FavoriteButton;
