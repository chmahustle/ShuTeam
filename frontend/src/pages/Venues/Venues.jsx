import React, { useState } from 'react';
import { MapPin, Wifi, Zap, Monitor, Coffee, Clock, Users, Star, Tag } from 'lucide-react';
import './Venues.css';

const VENUES = [
  {
    id: 1,
    name: 'Кофейня «Зерно»',
    address: 'ул. Абая, 45',
    rating: 4.8,
    capacity: 25,
    hours: '08:00 – 22:00',
    amenities: ['Wi-Fi', 'Розетки', 'Проектор', 'Тихая зона'],
    menu: 'Кофе, выпечка, напитки',
    promo: 'Скидка 10% участникам ШуКоманды',
    special: 'Бесплатный кофе лидеру при группе от 5 человек',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    name: 'Лофт «Творца»',
    address: 'пр. Достык, 12',
    rating: 4.9,
    capacity: 40,
    hours: '10:00 – 23:00',
    amenities: ['Проектор', 'Флипчарт', 'Wi-Fi', 'Мольберты'],
    menu: 'Чай, кофе, снеки',
    promo: 'Бесплатный чай для групп от 5 человек',
    special: '-20% для сообществ художников по будням',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    name: 'Коворкинг Origin',
    address: 'ул. Мира, 7',
    rating: 4.7,
    capacity: 60,
    hours: 'Круглосуточно',
    amenities: ['Wi-Fi', 'Розетки', 'Конференц-зал', 'Кухня'],
    menu: 'Кофе, чай, перекусы',
    promo: 'Первый час бесплатно для новых клубов',
    special: 'Корпоративные скидки для сообществ 10+',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80'
  },
];

const AMENITY_ICONS = { 'Wi-Fi': <Wifi size={12}/>, 'Розетки': <Zap size={12}/>, 'Проектор': <Monitor size={12}/>, 'Флипчарт': <Monitor size={12}/> };

const Venues = () => {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="venues-page">
      <header className="venues-header">
        <h1>Где собраться?</h1>
        <p>Партнёрские площадки для ваших встреч</p>
      </header>
      <div className="venues-content">
        <div className="venue-list">
          {VENUES.map(v => (
            <div key={v.id} className="venue-card">
              <div className="venue-img" style={{ backgroundImage: `url(${v.image})` }}>
                <div className="rating-badge"><Star size={12} fill="currentColor" /> {v.rating}</div>
                <div className="capacity-badge"><Users size={12} /> до {v.capacity}</div>
              </div>
              <div className="venue-content-inner">
                <div className="venue-main">
                  <h3>{v.name}</h3>
                  <p className="address"><MapPin size={12} /> {v.address}</p>
                  <p className="hours"><Clock size={12} /> {v.hours}</p>
                </div>

                <div className="amenities-row">
                  {v.amenities.map((a, i) => (
                    <span key={i} className="amenity-chip">
                      {AMENITY_ICONS[a] || <Coffee size={12}/>} {a}
                    </span>
                  ))}
                </div>

                <div className="menu-row"><Coffee size={12}/> {v.menu}</div>

                <div className="promo-banner">
                  <Tag size={14}/> {v.promo}
                </div>

                {expanded === v.id && (
                  <div className="special-offer">
                    <div className="special-title">🎁 Специальное предложение</div>
                    <div className="special-text">{v.special}</div>
                  </div>
                )}

                <div className="venue-btns">
                  <button className="offer-btn" onClick={() => setExpanded(expanded === v.id ? null : v.id)}>
                    {expanded === v.id ? 'Скрыть' : 'Спецпредложения'}
                  </button>
                  <button className="book-btn">Забронировать</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Venues;
