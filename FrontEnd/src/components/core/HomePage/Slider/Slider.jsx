import React, { useState, useEffect, useRef } from 'react';
import './Slider.scss';
import image1 from './image1.jpg';
import image2 from './image2.jpg';
import image3 from './image3.jpg';

const cards = [
  {
    name: 'Captain America',
    location: 'Marvel Collection',
    description: 'Super-Potion Gave Super Powers',
    image: image1,
  },
  {
    name: 'Super Soldier',
    location: 'Limited Edition',
    description: 'Super Soldier to the rescue',
    image: image2,
  },
  {
    name: 'Incredible Hulk',
    location: 'Hulk Collection',
    description: 'Hulk...SMASH!!',
    image: image3,
  },
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageRefs = useRef([]);

  const previous = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const getCardClass = (index) => {
    if (index === currentIndex) return 'card current--card';
    if (index === (currentIndex - 1 + cards.length) % cards.length) return 'card previous--card';
    if (index === (currentIndex + 1) % cards.length) return 'card next--card';
    return 'card';
  };

  const getImageClass = (index) => {
    if (index === currentIndex) return 'app__bg__image current--image';
    if (index === (currentIndex - 1 + cards.length) % cards.length) return 'app__bg__image previous--image';
    if (index === (currentIndex + 1) % cards.length) return 'app__bg__image next--image';
    return 'app__bg__image';
  };

  const getInfoClass = (index) => {
    if (index === currentIndex) return 'info current--info';
    if (index === (currentIndex - 1 + cards.length) % cards.length) return 'info previous--info';
    if (index === (currentIndex + 1) % cards.length) return 'info next--info';
    return 'info';
  };

  return (
    <div className='app'>
      {/* Background images */}
      <div className="app__bg">
        {cards.map((card, index) => (
          <div
            key={index}
            className={getImageClass(index)}
            ref={(el) => (imageRefs.current[index] = el)}
          >
            <img src={card.image} alt="" />
          </div>
        ))}
      </div>

      {/* Card List */}
      <div className="cardList">
        <button className="cardList__btn btn--left" onClick={previous}>
          <div className="icon">
            <svg viewBox="0 0 24 24"><path fill="white" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
          </div>
        </button>
        <div className="cards__wrapper">
          {cards.map((card, index) => (
            <div key={index} className={getCardClass(index)}>
              <div className="card__image">
                <img src={card.image} alt="" />
              </div>
            </div>
          ))}
        </div>
        <button className="cardList__btn btn--right" onClick={next}>
          <div className="icon">
            <svg viewBox="0 0 24 24"><path fill="white" d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z" />
</svg>
          </div>
        </button>
      </div>

      {/* Info List */}
      <div className="infoList">
        <div className="info__wrapper">
          {cards.map((card, index) => (
            <div key={index} className={getInfoClass(index)}>
              <div className="text name">{card.name}</div>
              <div className="text location">{card.location}</div>
              <div className="text description">{card.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
