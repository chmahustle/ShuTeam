import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Share2, MoreVertical, Users, Trophy, 
  Calendar, MapPin, CheckCircle2, Image, Lock, Globe, Clock
} from 'lucide-react';
import PaymentModal from '../../components/PaymentModal/PaymentModal';
import './CommunityDetail.css';

const MEDIA_ALBUMS = [
  { id: 1, title: 'Пленэр декабрь', count: 12, cover: '' },
  { id: 2, title: 'Мастер-класс', count: 8, cover: '' },
  { id: 3, title: 'Зимняя встреча', count: 20, cover: '' },
];

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [payEvent, setPayEvent] = useState(null);
  const [joined, setJoined] = useState(false);

  const community = {
    name: 'Художники',
    description: 'Творческое сообщество для всех, кто любит рисовать и делиться опытом.',
    members: 45,
    rank: '#3 ранг',
    icon: '',
    privacy: 'open', // 'open' | 'partial' | 'closed'
  };

  const TABS = [
    { key: 'info', label: 'Инфо' },
    { key: 'calendar', label: 'Встречи' },
    { key: 'goals', label: 'Цели' },
    { key: 'rating', label: 'Рейтинг' },
    { key: 'media', label: 'Медиа' },
  ];

  const EVENTS = [
    { id: 1, title: 'Пленэр в парке', date: 'Завтра · 18:00', location: 'Парк Победы', cost: 0, spots: 15, filled: 12, age: 'Все возрасты' },
    { id: 2, title: 'Мастер-класс акварели', date: '30 мар · 15:00', location: 'Canvas', cost: 700, spots: 10, filled: 7, age: 'Senior' },
  ];

  return (
    <div className="community-detail">
      <header className="detail-header">
        <div className="header-nav">
          <button className="icon-btn" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
          <div className="header-actions">
            <button className="icon-btn"><Share2 size={24} /></button>
            <button className="icon-btn"><MoreVertical size={24} /></button>
          </div>
        </div>
        
        <div className="community-main-info">
          <div className="main-info-card">
            <div className="community-avatar"></div>
            <div className="community-text">
              <h1>{community.name}</h1>
              <p>{community.description}</p>
              <div className="community-stats">
                <span><Users size={16} /> {community.members} участников</span>
                <span><Trophy size={16} /> {community.rank}</span>
                <span>{community.privacy === 'open' ? <><Globe size={14}/> Открытое</> : <><Lock size={14}/> Закрытое</>}</span>
              </div>
            </div>
            <div className="main-actions">
              {!joined ? (
                <button className="btn-primary" onClick={() => setJoined(true)}>Вступить</button>
              ) : (
                <button className="btn-primary" style={{background:'#C6C6BE'}}>Вы участник ✓</button>
              )}
              <button className="btn-secondary">Поделиться</button>
            </div>
          </div>
        </div>
      </header>

      {/* Вкладки */}
      <div className="detail-tabs">
        {TABS.map(t => (
          <button key={t.key} className={`detail-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="detail-content">
        {/* === ИНФО === */}
        {activeTab === 'info' && (
          <>
            <section className="detail-section">
              <h2>Следующая встреча</h2>
              <div className="next-meeting-card">
                <div className="meeting-header">
                  <h3>Пленэр в парке</h3>
                  <span className="badge-free">Бесплатно</span>
                </div>
                <div className="meeting-meta">
                  <div className="meta-row"><Calendar size={16} /> Завтра · 18:00 - 20:00</div>
                  <div className="meta-row"><MapPin size={16} /> Парк Победы</div>
                  <div className="meta-row"><Users size={16} /> 12/15 записано</div>
                </div>
                <div className="bring-list">
                  <p>Что принести:</p>
                  <div className="tags">
                    <span className="tag-item">Акварель</span>
                    <span className="tag-item">Кисти</span>
                    <span className="tag-item">Бумага А4</span>
                  </div>
                </div>
                <button className="join-meeting-btn" onClick={() => setPayEvent({title: 'Пленэр в парке', cost: 0})}>Записаться на встречу</button>
              </div>
            </section>
          </>
        )}

        {/* === ВСТРЕЧИ === */}
        {activeTab === 'calendar' && (
          <section className="detail-section">
            <h2>Расписание встреч</h2>
            <div className="events-calendar">
              {EVENTS.map(ev => (
                <div key={ev.id} className="cal-event-card">
                  <div className="cal-header">
                    <div>
                      <div className="cal-title">{ev.title}</div>
                      <div className="cal-meta"><Calendar size={12}/> {ev.date}</div>
                      <div className="cal-meta"><MapPin size={12}/> {ev.location}</div>
                      <div className="cal-age">👥 {ev.age}</div>
                    </div>
                    <div className="cal-right">
                      <div className="cal-spots">{ev.filled}/{ev.spots} мест</div>
                      <div className="cal-cost">{ev.cost > 0 ? `${ev.cost} ₽` : 'Бесплатно'}</div>
                    </div>
                  </div>
                  <button className="join-meeting-btn" onClick={() => setPayEvent(ev)}>
                    {ev.cost > 0 ? `Купить билет (${ev.cost} ₽)` : 'Записаться'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* === ЦЕЛИ === */}
        {activeTab === 'goals' && (
          <section className="detail-section">
            <h2>Цели и челленджи</h2>
            <div className="goals-list">
              {[
                { type: 'Цель недели', title: 'На этой неделе все рисуем закат', progress: 67, label: '8/12 участников', pill: 'week' },
                { type: 'Челлендж месяца', title: 'Нарисовать 5 картин за март', progress: 40, label: '2/5 картин', pill: 'month' },
                { type: 'Стрик', title: 'Посещать встречи каждую неделю', progress: 75, label: '3 из 4 недель', pill: 'streak' },
              ].map((g, i) => (
                <div key={i} className="goal-card">
                  <div className="goal-header">
                    <span className="goal-label-pill">{g.type}</span>
                    <span className="goal-percent">{g.progress}%</span>
                  </div>
                  <h4>{g.title}</h4>
                  <p>{g.label}</p>
                  <div className="goal-progress">
                    <div className="progress-bar-fill" style={{width: `${g.progress}%`}}></div>
                  </div>
                  <button className="mark-btn"><CheckCircle2 size={16} /> Отметить выполнение</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* === РЕЙТИНГ === */}
        {activeTab === 'rating' && (
          <section className="detail-section">
            <h2>Рейтинг участников</h2>
            <div className="rating-list">
              {[
                { name: 'Мария С.', points: 1250, rank: 1, color: '#FFD700' },
                { name: 'Иван П.', points: 980, rank: 2, color: '#C0C0C0' },
                { name: 'Вы', points: 780, rank: 3, color: '#CD7F32', isMe: true },
                { name: 'Алексей К.', points: 610, rank: 4, color: '#8a8a8a' },
              ].map((user, i) => (
                <div key={i} className={`rating-item ${user.isMe ? 'is-me' : ''}`}>
                  <div className="user-rank" style={{backgroundColor: user.color}}>{user.rank}</div>
                  <div className="user-avatar-small"></div>
                  <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-points">{user.points} очков</div>
                  </div>
                  {user.isMe && <CheckCircle2 size={18} className="me-check" />}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* === МЕДИА === */}
        {activeTab === 'media' && (
          <section className="detail-section">
            <h2>Медиа-архив</h2>
            <div className="media-grid">
              {MEDIA_ALBUMS.map(a => (
                <div key={a.id} className="media-album">
                  <div className="media-cover"></div>
                  <div className="media-title">{a.title}</div>
                  <div className="media-count"><Image size={12}/> {a.count} фото</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {payEvent && <PaymentModal event={payEvent} onClose={() => setPayEvent(null)} />}
    </div>
  );
};

export default CommunityDetail;
