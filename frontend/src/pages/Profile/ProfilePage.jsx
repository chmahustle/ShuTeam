import React, { useState } from 'react';
import { Users, Trophy, Calendar, MapPin, Image, CheckCircle2, ChevronRight, Settings, Globe, User, Bell, Shield, LogOut, Palette, HelpCircle } from 'lucide-react';
import './ProfilePage.css';

/* ── DATA ── */
const MY_COMMUNITIES = [
  { id: 'all', name: 'Все', color: '#77BC79' },
  { id: 'art', name: 'Художники', color: '#f87171' },
  { id: 'books', name: 'Книги', color: '#60a5fa' },
  { id: 'phi', name: 'Философия', color: '#fbbf24' },
];

const CONFIRMED = [
  { id: 1, title: 'Акварельный пленэр', community: 'Художники', date: 'Завтра, 18:00', place: 'Парк Победы', cost: 0, materials: ['Акварель', 'Кисти', 'Альбом'] },
  { id: 2, title: 'Philosophy Talk', community: 'Философия', date: 'Среда, 20:00', place: 'Коворкинг Origin', cost: 0, materials: [] },
];
const AVAILABLE = [
  { id: 3, title: 'Обсуждение «Войны и мира»', community: 'Книги', date: 'Пятница, 19:00', spots: 4, cost: 0 },
  { id: 4, title: 'Пленэр в ботсаду', community: 'Художники', date: 'Суббота, 10:00', spots: 2, cost: 300 },
];
const HISTORY = [
  { id: 5, title: 'Арт-встреча #12', date: '15 март', community: 'Художники', hasMedia: true },
  { id: 6, title: 'Книжный вечер', date: '8 март', community: 'Книги', hasMedia: false },
  { id: 7, title: 'Дискуссия о Камю', date: '1 март', community: 'Философия', hasMedia: true },
];
const CHALLENGES = [
  { id: 1, title: 'Нарисовать 5 картин', community: 'Художники', progress: 3, total: 5, type: 'month' },
  { id: 2, title: 'Прочитать 3 книги', community: 'Книги', progress: 1, total: 3, type: 'month' },
  { id: 3, title: 'Встречи каждую неделю', community: 'Художники', progress: 4, total: 8, type: 'streak' },
];
const BADGES = [
  { id: 1, emoji: '', name: 'Художник', community: 'Художники' },
  { id: 2, emoji: '', name: 'Книгочей', community: 'Книги' },
  { id: 3, emoji: '', name: 'Чемпион', community: 'Философия' },
  { id: 4, emoji: '', name: 'Ранний птах', community: 'Художники' },
  { id: 5, emoji: '', name: 'Стрик 30д', community: 'Художники' },
  { id: 6, emoji: '', name: 'Новатор', community: 'Философия' },
];
const MONTHS = ['Янв','Фев','Мар','Апр','Май','Июн'];
const VISITS  = [2, 4, 3, 7, 5, 8];
const maxVisit = Math.max(...VISITS);

/* ── UTILS ── */
const CommChip = ({ name, color }) => (
  <span className="prof-comm-chip" style={{ background: color + '22', color }}>{name}</span>
);

/* ════════════════════════════
   PROFILE PAGE
════════════════════════════ */
const ProfilePage = () => {
  const [selectedFilters, setSelectedFilters] = useState(['all']);
  const [activeTab, setActiveTab] = useState('achievements');
  const [schedTab, setSchedTab] = useState('confirmed');
  const [showSettings, setShowSettings] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [userName, setUserName] = useState('Алёна Дмитриева');
  const [editName, setEditName] = useState('Алёна Дмитриева');

  const toggleFilter = (id) => {
    if (id === 'all') { setSelectedFilters(['all']); return; }
    let f = selectedFilters.filter(x => x !== 'all');
    f = f.includes(id) ? f.filter(x => x !== id) : [...f, id];
    setSelectedFilters(f.length === 0 ? ['all'] : f);
  };

  const SCHED_TABS = [{ key:'confirmed',label:'Записан'},{key:'available',label:'Могу пойти'},{key:'history',label:'История'}];

  return (
    <div className="community-detail">

      {/* ── ХЕДЕР (стиль CommunityDetail) ── */}
      <header className="detail-header">
        <div className="header-nav">
          <div style={{width:44}}/>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setShowSettings(true)}><Settings size={22}/></button>
          </div>
        </div>

        <div className="community-main-info">
          <div className="main-info-card">
            <div className="profile-big-avatar">{userName.split(' ').map(w=>w[0]).join('')}</div>
            <div className="community-text">
              <h1>{userName}</h1>
              <p>Участник с января 2024 · 4 сообщества</p>
              <div className="community-stats">
                <span><Users size={15}/> 47 встреч</span>
                <span><Trophy size={15}/> 6 бейджей</span>
                <span><Globe size={15}/> 4 клуба</span>
              </div>
            </div>

            {/* Фильтр по клубам */}
            <div className="prof-filter-row">
              {MY_COMMUNITIES.map(c => (
                <button
                  key={c.id}
                  className={`prof-filter-chip ${selectedFilters.includes(c.id) ? 'active' : ''}`}
                  style={selectedFilters.includes(c.id) ? { background: c.color, color: '#141414' } : {}}
                  onClick={() => toggleFilter(c.id)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="detail-content">

        {/* ════ ДОСТИЖЕНИЯ ════ */}
        {activeTab==='achievements' && (
          <section className="detail-section">

            {/* График посещаемости */}
            <div className="ap-card">
              <h4>Посещаемость по месяцам</h4>
              <div className="ap-chart">
                {VISITS.map((v, i) => (
                  <div key={i} className="ap-chart-col">
                    <div className="ap-bar-wrap">
                      <div className="ap-bar" style={{height:`${(v/maxVisit)*100}%`}}></div>
                    </div>
                    <div className="ap-label">{MONTHS[i]}</div>
                    <div className="ap-val">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Уровень и ранг */}
            <div className="prof-ranks-row">
              <div className="prof-rank-card">
                <div className="prof-rank-name">Художники</div>
                <div className="prof-rank-val">Уровень 7</div>
                <div className="prof-rank-sub">#3 в рейтинге</div>
              </div>
              <div className="prof-rank-card">
                <div className="prof-rank-name">Книги</div>
                <div className="prof-rank-val">Уровень 4</div>
                <div className="prof-rank-sub">#8 в рейтинге</div>
              </div>
              <div className="prof-rank-card">
                <div className="prof-rank-name">Философия</div>
                <div className="prof-rank-val">Уровень 3</div>
                <div className="prof-rank-sub">#12 в рейтинге</div>
              </div>
            </div>

            {/* Про́гресс челленджи */}
            <div className="ap-card">
              <h4>Текущие цели</h4>
              <div className="prof-challenges">
                {CHALLENGES.map(c => (
                  <div key={c.id} className="prof-challenge-item">
                    <div className="pci-top">
                      <div className="pci-title">{c.title}</div>
                      <div className="pci-count">{c.progress}/{c.total}</div>
                    </div>
                    <CommChip name={c.community} color="#77BC79"/>
                    <div className="pci-progress">
                      <div className="pci-bar" style={{width:`${(c.progress/c.total)*100}%`}}></div>
                    </div>
                    <div className="pci-type">{c.type==='month'?'Месяц':c.type==='streak'?'Стрик':'Неделя'}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Коллекция бейджей */}
            <div className="ap-card">
              <h4>Коллекция бейджей</h4>
              <div className="prof-badges-grid">
                {BADGES.map(b => (
                  <div key={b.id} className="prof-badge">
                    <div className="prof-badge-icon">{b.emoji}</div>
                    <div className="prof-badge-name">{b.name}</div>
                    <div className="prof-badge-comm">{b.community}</div>
                  </div>
                ))}
              </div>
            </div>

          </section>
        )}
      </div>

      {/* ══ ШТОРКА НАСТРОЕК ══ */}
      {showSettings && (
        <div className="ap-overlay" onClick={() => setShowSettings(false)}>
          <div className="ap-sheet" onClick={e => e.stopPropagation()}>
            <div className="ap-sheet-handle"></div>
            <h3 className="ap-sheet-title">Настройки</h3>

            <div className="settings-list">
              <button className="settings-item" onClick={() => { setShowSettings(false); setEditModal(true); }}>
                <div className="si-icon green"><User size={18}/></div>
                <div className="si-text"><div className="si-label">Редактировать профиль</div><div className="si-sub">Имя, фото, описание</div></div>
                <ChevronRight size={16} className="si-arrow"/>
              </button>

              <button className="settings-item">
                <div className="si-icon blue"><Bell size={18}/></div>
                <div className="si-text"><div className="si-label">Уведомления</div><div className="si-sub">Встречи, напоминания</div></div>
                <ChevronRight size={16} className="si-arrow"/>
              </button>

              <button className="settings-item">
                <div className="si-icon purple"><Palette size={18}/></div>
                <div className="si-text"><div className="si-label">Внешний вид</div><div className="si-sub">Тема, язык</div></div>
                <ChevronRight size={16} className="si-arrow"/>
              </button>

              <button className="settings-item">
                <div className="si-icon gray"><Shield size={18}/></div>
                <div className="si-text"><div className="si-label">Конфиденциальность</div><div className="si-sub">Кто видит мой профиль</div></div>
                <ChevronRight size={16} className="si-arrow"/>
              </button>

              <button className="settings-item">
                <div className="si-icon gray"><HelpCircle size={18}/></div>
                <div className="si-text"><div className="si-label">Помощь и поддержка</div><div className="si-sub">FAQ, связаться с нами</div></div>
                <ChevronRight size={16} className="si-arrow"/>
              </button>

              <div className="settings-divider"/>

              <button className="settings-item danger" onClick={() => setShowSettings(false)}>
                <div className="si-icon red"><LogOut size={18}/></div>
                <div className="si-text"><div className="si-label">Выйти из аккаунта</div></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ МОДАЛКА РЕДАКТИРОВАНИЯ ══ */}
      {editModal && (
        <div className="ap-overlay" onClick={() => setEditModal(false)}>
          <div className="ap-sheet" onClick={e => e.stopPropagation()}>
            <div className="ap-sheet-handle"></div>
            <h3 className="ap-sheet-title">Редактировать профиль</h3>
            <form className="sheet-form" onSubmit={e => { e.preventDefault(); setUserName(editName); setEditModal(false); }}>
              <div className="edit-avatar-row">
                <div className="profile-big-avatar" style={{width:70,height:70,fontSize:22}}>
                  {editName.split(' ').map(w=>w[0]).join('')}
                </div>
                <button type="button" className="edit-photo-btn">Изменить фото</button>
              </div>
              <div className="ap-group">
                <label>Имя</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Ваше имя"/>
              </div>
              <div className="ap-group">
                <label>О себе</label>
                <textarea placeholder="Напишите немного о себе..." rows={3}/>
              </div>
              <div className="ap-group">
                <label>Email</label>
                <input type="email" placeholder="your@email.com"/>
              </div>
              <div className="ap-footer">
                <button type="button" className="ap-btn-cancel" onClick={() => setEditModal(false)}>Отмена</button>
                <button type="submit" className="ap-btn-ok">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

