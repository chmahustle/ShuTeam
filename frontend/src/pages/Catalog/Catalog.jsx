import React, { useState } from 'react';
import { Search, MapPin, Clock, Users, ChevronRight } from 'lucide-react';
import CommunityCard from '../../components/CommunityCard/CommunityCard';
import './Catalog.css';

const MOCK_COMMUNITIES = [
  { id: 1, name: 'Рисуем комиксы', description: 'Творческое объединение для любителей живописи. Проводим пленэры и мастер-классы.', type: 'closed', category: 'Художники' },
  { id: 2, name: 'Книжный клуб «Страница»', description: 'Обсуждаем книги, делимся впечатлениями. Встречи каждые две недели.', type: 'open', category: 'Чтение' },
];

const MOCK_EVENTS = [
  { id: 1, title: 'Акварельный пленэр', community: 'Художники', time: 'Сегодня · 18:00', location: 'Парк Победы', spots: '5 мест', type: 'open', emoji: '', cost: 0 },
  { id: 2, title: 'Обсуждение «Мастера и Маргариты»', community: 'Книжный клуб', time: 'Завтра · 19:00', location: 'Кофейня «Буква»', spots: '3 места', type: 'partial', emoji: '', cost: 300 },
  { id: 3, title: 'Вечер Philosophy Talk', community: 'Философия', time: 'Среда · 20:00', location: 'Коворкинг Origin', spots: '8 мест', type: 'open', emoji: '', cost: 0 },
  { id: 4, title: 'Мастер-класс акварели', community: 'Художники', time: 'Четверг · 15:00', location: 'Canvas', spots: '6 мест', type: 'partial', emoji: '', cost: 700 },
];

const CATEGORIES = [
  { id: 1, name: 'Чтение' },
  { id: 2, name: 'Аниме' },
  { id: 3, name: 'Художники' },
  { id: 4, name: 'Психология' },
  { id: 5, name: 'Философия' },
  { id: 6, name: 'Кулинария' },
  { id: 7, name: 'Музыка' },
  { id: 8, name: 'Спорт' },
  { id: 9, name: 'Путешествия' },
  { id: 10, name: 'Программирование' },
  { id: 11, name: 'Кино' },
  { id: 12, name: 'Йога' },
];

const Catalog = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCommunities, setActiveCommunities] = useState(MOCK_COMMUNITIES);
  const [tempSelected, setTempSelected] = useState([]);
  const [selectedChips, setSelectedChips] = useState([]); 
  const [activeFilters, setActiveFilters] = useState(['Все']);
  const [mainTab, setMainTab] = useState('communities'); // 'communities' | 'events'
  const [eventFilter, setEventFilter] = useState('all');

  const filteredEvents = MOCK_EVENTS.filter(ev => {
    if (eventFilter === 'free') return ev.cost === 0;
    if (eventFilter === 'paid') return ev.cost > 0;
    if (eventFilter === 'today') return ev.time.startsWith('Сегодня');
    return true;
  });

  const toggleFilter = (filterName) => {
    if (filterName === 'Все') {
      setActiveFilters(['Все']);
      return;
    }

    let nextFilters = activeFilters.filter(f => f !== 'Все');
    
    if (nextFilters.includes(filterName)) {
      nextFilters = nextFilters.filter(f => f !== filterName);
    } else {
      nextFilters = [...nextFilters, filterName];
    }

    if (nextFilters.length === 0) {
      setActiveFilters(['Все']);
    } else {
      setActiveFilters(nextFilters);
    }
  };

  const toggleTempCategory = (catName) => {
    if (tempSelected.includes(catName)) {
      setTempSelected(tempSelected.filter(n => n !== catName));
    } else {
      setTempSelected([...tempSelected, catName]);
    }
  };

  const applyCategories = () => {
    const newChips = Array.from(new Set([...selectedChips, ...tempSelected]));
    setSelectedChips(newChips);

    // Сразу активируем добавленные категории и убираем "Все"
    if (tempSelected.length > 0) {
      let nextFilters = activeFilters.filter(f => f !== 'Все');
      // Добавляем новые, которых еще нет в активных
      const toActivate = tempSelected.filter(cat => !nextFilters.includes(cat));
      setActiveFilters([...nextFilters, ...toActivate]);
    }

    const newItems = tempSelected
      .filter(catName => !activeCommunities.some(c => c.category === catName))
      .map(catName => ({
        id: Date.now() + Math.random(),
        name: `Мир: ${catName}`,
        description: `Сообщество единомышленников по теме ${catName.toLowerCase()}.`,
        type: 'open',
        category: catName
      }));
    
    setActiveCommunities([...activeCommunities, ...newItems]);
    setIsModalOpen(false);
    setTempSelected([]); // Очищаем временный выбор для следующего раза
  };

  const removeChip = (chipName) => {
    setSelectedChips(selectedChips.filter(c => c !== chipName));
    setActiveFilters(activeFilters.filter(f => f !== chipName));
    if (activeFilters.length <= 1 && activeFilters.includes(chipName)) {
      setActiveFilters(['Все']);
    }
  };

  // Фильтрация списка
  const filteredCommunities = activeFilters.includes('Все') 
    ? activeCommunities 
    : activeCommunities.filter(c => 
        activeFilters.includes(c.category) || 
        (activeFilters.includes('Новые') && activeCommunities.slice(-2).includes(c)) ||
        (activeFilters.includes('Популярные') && c.type === 'closed')
      );

  return (
    <div className="catalog-page">
      <header className="catalog-header">
        <h1>Вступай в новые сообщества !</h1>
      </header>

      <div className="ads-block">
        <img src="/ads_block.svg" alt="Рекламный блок" />
      </div>
      
      <div className="search-container">
        <div className="search-icon-circle">
          <Search size={24} color="#FFEC8B" />
        </div>
        <input type="text" placeholder="Поиск по сообществам.." />
      </div>

      {/* Переключатель Сообщества / События — на тёмном фоне */}
      <div className="main-segment">
        <button 
          className={`segment-btn ${mainTab === 'communities' ? 'active' : ''}`}
          onClick={() => setMainTab('communities')}
        >
          Сообщества
        </button>
        <button 
          className={`segment-btn ${mainTab === 'events' ? 'active' : ''}`}
          onClick={() => setMainTab('events')}
        >
          События
        </button>
      </div>

      <div className="list-wrapper">

        {mainTab === 'communities' && (
          <>
            <div className="filter-chips">
              <button 
                className={`chip ${activeFilters.includes('Все') ? 'active' : ''}`}
                onClick={() => toggleFilter('Все')}
              >
                Все ( {activeCommunities.length} )
              </button>
              
              {selectedChips.map(chipName => (
                <button 
                  key={chipName}
                  className={`chip ${activeFilters.includes(chipName) ? 'active' : ''}`}
                  onClick={() => toggleFilter(chipName)}
                >
                  {chipName}
                </button>
              ))}

              <button 
                className={`chip ${activeFilters.includes('Новые') ? 'active' : ''}`}
                onClick={() => toggleFilter('Новые')}
              >
                Новые
              </button>
              
              <button 
                className={`chip ${activeFilters.includes('Популярные') ? 'active' : ''}`}
                onClick={() => toggleFilter('Популярные')}
              >
                Популярные
              </button>

              <button className="add-btn" onClick={() => setIsModalOpen(true)}>+</button>
            </div>

            <div className="community-list">
              {filteredCommunities.map(c => <CommunityCard key={c.id} community={c} />)}
            </div>
          </>
        )}

        {mainTab === 'events' && (
          <>
            <div className="filter-chips">
              <button className={`chip ${eventFilter === 'all' ? 'active' : ''}`} onClick={() => setEventFilter('all')}>Все</button>
              <button className={`chip ${eventFilter === 'free' ? 'active' : ''}`} onClick={() => setEventFilter('free')}>Бесплатные</button>
              <button className={`chip ${eventFilter === 'paid' ? 'active' : ''}`} onClick={() => setEventFilter('paid')}>Платные</button>
              <button className={`chip ${eventFilter === 'today' ? 'active' : ''}`} onClick={() => setEventFilter('today')}>Сегодня</button>
            </div>

            <div className="events-card-list">
              {filteredEvents.map(ev => (
                <div key={ev.id} className="event-card-big">
                  <div className="card-tags">
                    <div className="tag-category">{ev.community}</div>
                    <div className={`badge ${ev.cost === 0 ? 'open' : 'closed'}`}>
                      {ev.cost === 0 ? 'Бесплатно' : `${ev.cost} ₽`}
                    </div>
                  </div>

                  <div className="card-main">
                    <h3>{ev.title}</h3>
                    <div className="event-meta-row">
                      <span><Clock size={13} /> {ev.time}</span>
                      <span><MapPin size={13} /> {ev.location}</span>
                      <span><Users size={13} /> {ev.spots}</span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button className="join-btn-new">
                      Записаться <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Выберите категорию</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>+</button>
            </div>
            
            <div className="category-pill-grid">
              {CATEGORIES.map(cat => (
                <div 
                  key={cat.id} 
                  className={`category-pill ${tempSelected.includes(cat.name) ? 'active' : ''}`}
                  onClick={() => toggleTempCategory(cat.name)}
                >
                  {cat.name}
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Отменить</button>
              <button className="btn-apply" onClick={applyCategories}>Применить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;
