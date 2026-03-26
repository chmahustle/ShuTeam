import React, { useState } from 'react';
import { MapPin, Clock, Users, ChevronRight, ArrowLeft, Globe, Lock } from 'lucide-react';
import './Dashboard.css';

/* ── DEMO DATA ── */
const MY_JOINED = [
  {
    id: 'art', name: 'Клуб Художников', category: 'Художники', type: 'open',
    members: 45, icon: '', nextEvent: 'Завтра, 18:00',
    upcoming: [
      { id: 1, title: 'Пленэр в центральном парке', type: 'Встреча клуба', status: 'Подтверждено', time: '18:00 - 20:00', place: 'Центральный парк, вход №2', materials: ['Акварель, кисти', 'Бумага А4 (плотная)', 'Складной стульчик'], cost: 0 },
      { id: 2, title: 'Мастер-класс акварели', type: 'Мастер-класс', status: 'Записан', time: '14:00 - 16:00', place: 'Canvas, ул. Мира 7', materials: ['Ничего — всё выдадут'], cost: 700 },
    ],
    past: [
      { id: 10, title: 'Арт-встреча #12', type: 'Встреча клуба', status: 'Посещено', time: '18:00', place: 'Парк Победы', materials: [], cost: 0 },
    ],
  },
  {
    id: 'books', name: 'Книжный клуб «Страница»', category: 'Чтение', type: 'open',
    members: 28, icon: '', nextEvent: 'Пятница, 19:00',
    upcoming: [
      { id: 3, title: 'Обсуждение «Войны и мира»', type: 'Встреча клуба', status: 'Подтверждено', time: '19:00 - 21:00', place: 'Кофейня «Буква», ул. Пушкина 12', materials: [], cost: 0 },
    ],
    past: [
      { id: 11, title: 'Вечер короткого рассказа', type: 'Встреча клуба', status: 'Посещено', time: '19:00', place: 'Кофейня «Буква»', materials: [], cost: 0 },
    ],
  },
  {
    id: 'phi', name: 'Philosophy Talk', category: 'Философия', type: 'partial',
    members: 18, icon: '', nextEvent: 'Среда, 20:00',
    upcoming: [
      { id: 4, title: 'Дискуссия о Сартре', type: 'Встреча клуба', status: 'Может пойти', time: '20:00 - 22:00', place: 'Коворкинг Origin', materials: [], cost: 0 },
    ],
    past: [],
  },
];

/* ── EVENT CARD — дизайн как на скриншоте ── */
const EventCard = ({ ev }) => (
  <div className="event-full-card">
    <div className="event-header">
      <span className="event-type">{ev.type}</span>
      <span className={`event-tag ${ev.status === 'Посещено' ? 'past' : ''}`}>{ev.status}</span>
    </div>
    <h2>{ev.title}</h2>
    <div className="event-meta">
      <div className="meta-item"><Clock size={16}/> {ev.time}</div>
      <div className="meta-item"><MapPin size={16}/> {ev.place}</div>
    </div>
    {ev.materials.length > 0 && (
      <div className="materials-box">
        <h4>Что взять с собой:</h4>
        <ul>{ev.materials.map((m, i) => <li key={i}>{m}</li>)}</ul>
      </div>
    )}
    {ev.cost > 0 && <div className="ev-cost-row">Стоимость: <strong>{ev.cost} ₽</strong></div>}
    <button className="action-btn">Смотреть на карте</button>
  </div>
);

/* ── COMMUNITY SCHEDULE — вкладки + события ── */
const CommunitySchedule = ({ community, onBack }) => {
  const [tab, setTab] = useState('upcoming');
  const events = tab === 'upcoming' ? community.upcoming : community.past;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header sched-header">
        <button className="sched-back-btn" onClick={onBack}><ArrowLeft size={22}/></button>
        <div>
          <h1>{community.name}</h1>
          <p className="sched-sub">{community.members} участников · {community.type === 'open' ? 'Открытое' : 'Частичное'}</p>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="tabs">
          <button className={`tab ${tab === 'upcoming' ? 'active' : ''}`} onClick={() => setTab('upcoming')}>Ближайшие</button>
          <button className={`tab ${tab === 'past' ? 'active' : ''}`} onClick={() => setTab('past')}>Прошедшие</button>
        </div>

        <section className="events-section">
          {events.length === 0 ? (
            <div className="sched-empty">
              <div className="sched-empty-icon"></div>
              <p>{tab === 'upcoming' ? 'Нет предстоящих событий' : 'История встреч пуста'}</p>
            </div>
          ) : (
            events.map(ev => <EventCard key={ev.id} ev={ev}/>)
          )}
        </section>
      </div>
    </div>
  );
};

/* ── MAIN PAGE ── */
const Dashboard = () => {
  const [selected, setSelected] = useState(null);

  if (selected) return <CommunitySchedule community={selected} onBack={() => setSelected(null)}/>;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Расписание</h1>
        <p className="sched-sub-main">Мои сообщества и встречи</p>
      </header>

      <div className="dashboard-content">
        <div className="joined-list">
          {MY_JOINED.map(c => (
            <div key={c.id} className="joined-card" onClick={() => setSelected(c)}>
              {/* Стиль карточки как community-card-new */}
              <div className="card-tags">
                <div className="tag-category">{c.category}</div>
                <div className={`badge ${c.type === 'open' ? 'open' : 'partial'}`}>
                  {c.type === 'open'
                    ? <><Globe size={13}/> Открытое</>
                    : <><Users size={13}/> Частичное</>}
                </div>
              </div>
              <div className="card-main joined-main">
                <h3>{c.name}</h3>
                <div className="joined-meta">
                  <span><Users size={13}/> {c.members} участников</span>
                  {c.nextEvent && <span> {c.nextEvent}</span>}
                </div>
              </div>
              <div className="card-actions">
                <button className="join-btn-new" style={{pointerEvents:'none'}}>
                  Расписание <ChevronRight size={18}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
