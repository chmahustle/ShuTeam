import React, { useState, useRef, useEffect } from 'react';
import { Plus, Users, Trash2, ChevronRight, ArrowLeft, Globe, Lock, Share2, MoreVertical, Trophy, MapPin, Calendar, CheckCircle2, Image, ChevronDown, Check } from 'lucide-react';
import './MyCommunities.css';

/* ── DEMO DATA ── */
const DEMO_COMMUNITIES = [
  { id: 1, name: 'Клуб Художников', category: 'Художники', type: 'open', members: 45, rank: 3, description: 'Творческое объединение для любителей живописи. Проводим пленэры и мастер-классы.', icon: '', nextEvent: 'Завтра, 18:00' },
];
const VENUES_CATALOG = [
  { id: 1, name: 'Кофейня «Буква»', address: 'ул. Пушкина, 12', capacity: 20 },
  { id: 2, name: 'Коворкинг Origin', address: 'пр. Ленина, 34', capacity: 50 },
  { id: 3, name: 'Canvas', address: 'ул. Мира, 7', capacity: 30 },
];
const CATEGORIES_LIST = ['Художники', 'Чтение', 'Музыка', 'Аниме', 'Кулинария', 'Философия', 'Спорт'];
const MONTHS = ['Янв','Фев','Мар','Апр','Май','Июн'];
const GROWTH = [5, 8, 12, 18, 20, 26];
const TRANSACTIONS = [
  { id: 1, desc: 'Билет: Пленэр в парке', amount: 500, commission: 50, date: '15 мар' },
  { id: 2, desc: 'Билет: Мастер-класс', amount: 1500, commission: 150, date: '8 мар' },
];
const INITIAL_MEMBERS = [
  { id: 1, name: 'Мария Петрова', visits: 24, role: 'participant', active: true },
  { id: 2, name: 'Иван Козлов', visits: 5, role: 'moderator', active: false },
  { id: 3, name: 'Анна Новак', visits: 31, role: 'participant', active: true },
];
const MEDIA_ALBUMS = [
  { id: 1, title: 'Пленэр декабрь', count: 12 },
  { id: 2, title: 'Мастер-класс', count: 8 },
  { id: 3, title: 'Зимняя встреча', count: 20 },
];
const ROLES_MAP = { participant: 'Участник', moderator: 'Модератор', helper: 'Помощник' };
const maxGrowth = Math.max(...GROWTH);

/* ════════════════════════════════
   CUSTOM DROPDOWN
════════════════════════════════ */
const CustomSelect = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => (o.value || o) === value);
  const label = selected ? (selected.label || selected) : (placeholder || 'Выбрать');

  return (
    <div className="cselect" ref={ref}>
      <div className={`cselect-trigger ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
        <span>{label}</span>
        <ChevronDown size={16} className={`cselect-arrow ${open ? 'rotated' : ''}`} />
      </div>
      {open && (
        <div className="cselect-dropdown">
          {options.map(o => {
            const val = o.value || o;
            const lbl = o.label || o;
            return (
              <div key={val} className={`cselect-option ${val === value ? 'selected' : ''}`} onClick={() => { onChange(val); setOpen(false); }}>
                <span>{lbl}</span>
                {val === value && <Check size={14}/>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════
   BOTTOM SHEET MODAL
════════════════════════════════ */
const BottomSheet = ({ title, onClose, children }) => (
  <div className="ap-overlay" onClick={onClose}>
    <div className="ap-sheet" onClick={e => e.stopPropagation()}>
      <div className="ap-sheet-handle"></div>
      <h3 className="ap-sheet-title">{title}</h3>
      {children}
    </div>
  </div>
);

/* ════════════════════════════════
   ADMIN PANEL
════════════════════════════════ */
const AdminPanel = ({ community, onBack }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [mgmtTab, setMgmtTab] = useState('meetings');
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [goals, setGoals] = useState([{ id: 1, title: 'Нарисовать 5 картин', type: 'month', reward: 'Бейдж художника' }]);
  const [events, setEvents] = useState([{ id: 1, title: 'Пленэр в парке', date: '26 мар', time: '18:00', cost: 0, spots: 20, filled: 12, location: 'Парк Победы' }]);

  const [showEventModal, setShowEventModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showVenueModal, setShowVenueModal] = useState(false);

  const [eventForm, setEventForm] = useState({ title: '', date: '', time: '', cost: '', spots: '', age: 'all', materials: '', location: '' });
  const [goalForm, setGoalForm] = useState({ title: '', type: 'week', reward: '' });

  const balance = TRANSACTIONS.reduce((s, t) => s + t.amount - t.commission, 0);

  const createEvent = (e) => {
    e.preventDefault();
    setEvents([...events, { ...eventForm, id: Date.now(), filled: 0, spots: parseInt(eventForm.spots) || 20 }]);
    setShowEventModal(false);
    setEventForm({ title: '', date: '', time: '', cost: '', spots: '', age: 'all', materials: '', location: '' });
  };

  const createGoal = (e) => {
    e.preventDefault();
    setGoals([...goals, { ...goalForm, id: Date.now() }]);
    setShowGoalModal(false);
    setGoalForm({ title: '', type: 'week', reward: '' });
  };

  const TABS = ['info','calendar','goals','rating','media','manage'];
  const TAB_LABELS = { info:'Инфо', calendar:'Встречи', goals:'Цели', rating:'Рейтинг', media:'Медиа', manage:'Админ-панель' };
  const MGMT_TABS = [{ key:'meetings',label:'Встречи'},{key:'members',label:'Участники'},{key:'analytics',label:'Аналитика'},{key:'gamification',label:'Игры'},{key:'finance',label:'Финансы'}];

  const AGE_OPTIONS = [{ value:'all', label:'Все возрасты' }, { value:'junior', label:'До 18' }, { value:'senior', label:'18+' }];
  const GOAL_TYPE_OPTIONS = [{ value:'week', label:'Цель недели' }, { value:'month', label:'Месяц' }, { value:'streak', label:'Стрик' }];

  return (
    <div className="community-detail">
      {/* Хедер — стиль CommunityDetail */}
      <header className="detail-header">
        <div className="header-nav">
          <button className="icon-btn" onClick={onBack}><ArrowLeft size={24}/></button>
          <div className="header-actions">
            <button className="icon-btn"><Share2 size={24}/></button>
            <button className="icon-btn"><MoreVertical size={24}/></button>
          </div>
        </div>
        <div className="community-main-info">
          <div className="main-info-card">
            <div className="community-avatar">{community.icon || ''}</div>
            <div className="community-text">
              <h1>{community.name}</h1>
              <p>{community.description || 'Ваше сообщество'}</p>
              <div className="community-stats">
                <span><Users size={16}/> {community.members} участников</span>
                <span><Trophy size={16}/> #{community.rank || '-'} ранг</span>
                <span>{community.type==='open' ? <><Globe size={14}/> Открытое</> : <><Lock size={14}/> Закрытое</>}</span>
              </div>
            </div>
            <div className="main-actions">
              <button className="btn-primary" style={{background:'#C6C6BE',cursor:'default'}}>Вы лидер ✓</button>
              <button className="btn-secondary">Поделиться</button>
            </div>
          </div>
        </div>
      </header>

      {/* Вкладки */}
      <div className="detail-tabs">
        {TABS.map(t => (
          <button key={t} className={`detail-tab ${activeTab===t?'active':''}`} onClick={() => setActiveTab(t)}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="detail-content">

        {/* ИНФО */}
        {activeTab==='info' && (
          <section className="detail-section">
            <h2>Следующая встреча</h2>
            <div className="next-meeting-card">
              <div className="meeting-header"><h3>Пленэр в парке</h3><span className="badge-free">Бесплатно</span></div>
              <div className="meeting-meta">
                <div className="meta-row"><Calendar size={16}/> Завтра · 18:00 - 20:00</div>
                <div className="meta-row"><MapPin size={16}/> Парк Победы</div>
                <div className="meta-row"><Users size={16}/> 12/15 записано</div>
              </div>
              <div className="bring-list"><p>Что принести:</p><div className="tags"><span className="tag-item">Акварель</span><span className="tag-item">Кисти</span><span className="tag-item">Бумага А4</span></div></div>
            </div>
          </section>
        )}

        {/* ВСТРЕЧИ */}
        {activeTab==='calendar' && (
          <section className="detail-section">
            <h2>Расписание встреч</h2>
            {events.map(ev => (
              <div key={ev.id} className="cal-event-card">
                <div className="cal-header">
                  <div><div className="cal-title">{ev.title}</div><div className="cal-meta"><Calendar size={12}/> {ev.date} {ev.time}</div><div className="cal-meta"><MapPin size={12}/> {ev.location}</div></div>
                  <div className="cal-right"><div className="cal-spots">{ev.filled}/{ev.spots}</div><div className="cal-cost">{ev.cost>0?`${ev.cost} ₽`:'Бесплатно'}</div></div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ЦЕЛИ */}
        {activeTab==='goals' && (
          <section className="detail-section">
            <h2>Цели и челленджи</h2>
            <div className="goals-list">
              {[{type:'Цель недели',title:'Все рисуем закат',progress:67,label:'8/12 участников'},{type:'Челлендж месяца',title:'Нарисовать 5 картин за март',progress:40,label:'2/5 картин'}].map((g,i)=>(
                <div key={i} className="goal-card">
                  <div className="goal-header"><span className="goal-label-pill">{g.type}</span><span className="goal-percent">{g.progress}%</span></div>
                  <h4>{g.title}</h4><p>{g.label}</p>
                  <div className="goal-progress"><div className="progress-bar-fill" style={{width:`${g.progress}%`}}></div></div>
                  <button className="mark-btn"><CheckCircle2 size={16}/> Отметить выполнение</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* РЕЙТИНГ */}
        {activeTab==='rating' && (
          <section className="detail-section">
            <h2>Рейтинг участников</h2>
            <div className="rating-list">
              {[{name:'Мария С.',points:1250,rank:1,color:'#FFD700'},{name:'Иван П.',points:980,rank:2,color:'#C0C0C0'},{name:'Вы',points:780,rank:3,color:'#CD7F32',isMe:true},{name:'Алексей К.',points:610,rank:4,color:'#8a8a8a'}].map((u,i)=>(
                <div key={i} className={`rating-item ${u.isMe?'is-me':''}`}>
                  <div className="user-rank" style={{backgroundColor:u.color}}>{u.rank}</div>
                  <div className="user-avatar-small"></div>
                  <div className="user-info"><div className="user-name">{u.name}</div><div className="user-points">{u.points} очков</div></div>
                  {u.isMe && <CheckCircle2 size={18} className="me-check"/>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* МЕДИА */}
        {activeTab==='media' && (
          <section className="detail-section">
            <h2>Медиа-архив</h2>
            <div className="media-grid">
              {MEDIA_ALBUMS.map(a=>(<div key={a.id} className="media-album"><div className="media-cover"></div><div className="media-title">{a.title}</div><div className="media-count"><Image size={12}/> {a.count} фото</div></div>))}
            </div>
          </section>
        )}

        {/* УПРАВЛЕНИЕ */}
        {activeTab==='manage' && (
          <section className="detail-section">
            <h2>Панель лидера</h2>
            <div className="admin-tabs" style={{marginBottom:'15px'}}>
              {MGMT_TABS.map(t=>(<button key={t.key} className={`admin-tab ${mgmtTab===t.key?'active':''}`} onClick={()=>setMgmtTab(t.key)}>{t.label}</button>))}
            </div>

            {/* Встречи */}
            {mgmtTab==='meetings' && (
              <div className="tab-section">
                <button className="ap-create-btn" onClick={() => setShowEventModal(true)}>
                  <Plus size={18}/> Создать встречу
                </button>
                <div className="ap-list">
                  {events.map(ev => (
                    <div key={ev.id} className="ap-event-card">
                      <div><div className="ap-ev-title">{ev.title}</div><div className="ap-ev-meta">{ev.date} {ev.time} · {ev.location}</div></div>
                      <div className="ap-ev-right"><span><Users size={12}/> {ev.filled}/{ev.spots}</span><span>{ev.cost>0?`${ev.cost} ₽`:'Бесплатно'}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Участники */}
            {mgmtTab==='members' && (
              <div className="tab-section">
                <div className="members-info">Всего: {members.length} · <span className="green-text">{members.filter(m=>m.active).length} активных</span></div>
                {members.map(m => (
                  <div key={m.id} className={`ap-member-card ${!m.active?'inactive':''}`}>
                    <div className="ap-avatar">{m.name[0]}</div>
                    <div className="ap-member-info"><div className="ap-member-name">{m.name}</div><div className="ap-member-meta">{m.visits} встреч · {m.active?'Активен':'Неактивен'}</div></div>
                    <div className="ap-member-actions">
                      <CustomSelect
                        value={m.role}
                        onChange={role => setMembers(members.map(x => x.id===m.id ? {...x, role} : x))}
                        options={Object.entries(ROLES_MAP).map(([v,l])=>({value:v,label:l}))}
                      />
                      <button className="ap-del-btn" onClick={() => setMembers(members.filter(x=>x.id!==m.id))}><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Аналитика */}
            {mgmtTab==='analytics' && (
              <div className="tab-section">
                <div className="ap-card"><h4>Рост участников</h4><div className="ap-chart">{GROWTH.map((v,i)=>(<div key={i} className="ap-chart-col"><div className="ap-bar-wrap"><div className="ap-bar" style={{height:`${(v/maxGrowth)*100}%`}}></div></div><div className="ap-label">{MONTHS[i]}</div><div className="ap-val">{v}</div></div>))}</div></div>
                <div className="ap-card"><h4>Активность</h4><div className="ap-activity-row"><div className="ap-act-item green-bg"><div className="ap-act-val">{members.filter(m=>m.active).length}</div><div className="ap-act-lbl">Активные</div></div><div className="ap-act-item red-bg"><div className="ap-act-val">{members.filter(m=>!m.active).length}</div><div className="ap-act-lbl">Неактивные</div></div><div className="ap-act-item blue-bg"><div className="ap-act-val">{events.length}</div><div className="ap-act-lbl">Встреч</div></div></div></div>
              </div>
            )}

            {/* Геймификация */}
            {mgmtTab==='gamification' && (
              <div className="tab-section">
                <button className="ap-create-btn" onClick={() => setShowGoalModal(true)}>
                  <Plus size={18}/> Создать цель / бейдж
                </button>
                {goals.map(g => (
                  <div key={g.id} className="ap-goal-card">
                    <div className="ap-goal-title">{g.title}</div>
                    <div className="ap-goal-meta">
                      <span>{g.type==='week'?'Неделя':g.type==='month'?'Месяц':'Стрик'}</span>
                      {g.reward && <span className="ap-reward">{g.reward}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Финансы */}
            {mgmtTab==='finance' && (
              <div className="tab-section">
                <div className="ap-balance-card"><div className="ap-balance-label">Баланс организатора</div><div className="ap-balance-amount">{balance.toLocaleString()} ₽</div><div className="ap-balance-note">* После вычета 10% комиссии</div><button className="ap-withdraw-btn">Вывести средства</button></div>
                <h4 className="ap-tr-title">История транзакций</h4>
                {TRANSACTIONS.map(t=>(<div key={t.id} className="ap-tr-item"><div><div className="ap-tr-desc">{t.desc}</div><div className="ap-tr-date">{t.date}</div></div><div className="ap-tr-right"><div className="ap-tr-gross">+{t.amount} ₽</div><div className="ap-tr-comm">−{t.commission} ₽</div><div className="ap-tr-net">{t.amount-t.commission} ₽</div></div></div>))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* ── МОДАЛКИ ── */}

      {/* Создание встречи */}
      {showEventModal && (
        <BottomSheet title="Создать встречу" onClose={() => setShowEventModal(false)}>
          <form onSubmit={createEvent} className="sheet-form">
            <div className="ap-group"><label>Название мероприятия</label><input required value={eventForm.title} onChange={e=>setEventForm({...eventForm,title:e.target.value})} placeholder="Пленэр в парке"/></div>
            <div className="sheet-row">
              <div className="ap-group"><label>Дата</label><input required type="date" value={eventForm.date} onChange={e=>setEventForm({...eventForm,date:e.target.value})}/></div>
              <div className="ap-group"><label>Время</label><input required type="time" value={eventForm.time} onChange={e=>setEventForm({...eventForm,time:e.target.value})}/></div>
            </div>
            <div className="sheet-row">
              <div className="ap-group"><label>Стоимость (₽)</label><input type="number" value={eventForm.cost} onChange={e=>setEventForm({...eventForm,cost:e.target.value})} placeholder="0 — бесплатно"/></div>
              <div className="ap-group"><label>Мест</label><input type="number" value={eventForm.spots} onChange={e=>setEventForm({...eventForm,spots:e.target.value})} placeholder="20"/></div>
            </div>
            <div className="ap-group">
              <label>Возрастная группа</label>
              <CustomSelect value={eventForm.age} onChange={v=>setEventForm({...eventForm,age:v})} options={AGE_OPTIONS}/>
            </div>
            <div className="ap-group"><label>Что принести (через запятую)</label><input value={eventForm.materials} onChange={e=>setEventForm({...eventForm,materials:e.target.value})} placeholder="Акварель, кисти, альбом"/></div>
            <div className="ap-group">
              <label>Локация</label>
              <div className="venue-row">
                <input value={eventForm.location} onChange={e=>setEventForm({...eventForm,location:e.target.value})} placeholder="Введите адрес..."/>
                <button type="button" className="venue-pick-btn" onClick={()=>setShowVenueModal(true)}><MapPin size={14}/></button>
              </div>
            </div>
            <div className="ap-footer">
              <button type="button" className="ap-btn-cancel" onClick={() => setShowEventModal(false)}>Отмена</button>
              <button type="submit" className="ap-btn-ok">Создать</button>
            </div>
          </form>
        </BottomSheet>
      )}

      {/* Создание цели */}
      {showGoalModal && (
        <BottomSheet title="Создать цель / бейдж" onClose={() => setShowGoalModal(false)}>
          <form onSubmit={createGoal} className="sheet-form">
            <div className="ap-group"><label>Описание задания</label><input required value={goalForm.title} onChange={e=>setGoalForm({...goalForm,title:e.target.value})} placeholder="Нарисовать 5 картин"/></div>
            <div className="ap-group">
              <label>Тип цели</label>
              <CustomSelect value={goalForm.type} onChange={v=>setGoalForm({...goalForm,type:v})} options={GOAL_TYPE_OPTIONS}/>
            </div>
            <div className="ap-group"><label>Награда</label><input value={goalForm.reward} onChange={e=>setGoalForm({...goalForm,reward:e.target.value})} placeholder="Бейдж, скидка 10%..."/></div>
            <div className="ap-footer">
              <button type="button" className="ap-btn-cancel" onClick={() => setShowGoalModal(false)}>Отмена</button>
              <button type="submit" className="ap-btn-ok">Добавить</button>
            </div>
          </form>
        </BottomSheet>
      )}

      {/* Выбор площадки */}
      {showVenueModal && (
        <BottomSheet title="Выбор площадки" onClose={() => setShowVenueModal(false)}>
          <div className="venue-list-sheet">
            {VENUES_CATALOG.map(v => (
              <div key={v.id} className="ap-venue-item" onClick={() => { setEventForm(f=>({...f,location:v.name})); setShowVenueModal(false); }}>
                <div className="ap-vi-name">{v.name}</div>
                <div className="ap-vi-addr">{v.address} · до {v.capacity} чел.</div>
              </div>
            ))}
          </div>
        </BottomSheet>
      )}
    </div>
  );
};

/* ════════════════════════════════
   МОИ СООБЩЕСТВА
════════════════════════════════ */
const MyCommunities = () => {
  const [communities, setCommunities] = useState(DEMO_COMMUNITIES);
  const [selected, setSelected] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Художники', type: 'open', description: '' });

  const handleCreate = (e) => {
    e.preventDefault();
    setCommunities([...communities, { id: Date.now(), ...form, members: 1, rank: '-', icon: '', nextEvent: null }]);
    setIsCreateOpen(false);
    setForm({ name: '', category: 'Художники', type: 'open', description: '' });
  };

  if (selected) return <AdminPanel community={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="mc-page">
      <header className="mc-header">
        <h1>Мои сообщества</h1>
        <p>Управляйте вашими клубами</p>
      </header>

      <div className="mc-content">
        <button className="mc-create-btn" onClick={() => setIsCreateOpen(true)}>
          <Plus size={20}/> Создать сообщество
        </button>

        {communities.length === 0 ? (
          <div className="mc-empty">
            <div className="mc-empty-icon"></div>
            <p>У вас пока нет сообществ</p>
          </div>
        ) : (
          <div className="mc-list">
            {communities.map(c => (
              <div key={c.id} className="mc-card" onClick={() => setSelected(c)}>
                <div className="card-tags">
                  <div className="tag-category">{c.category}</div>
                  <div className={`badge ${c.type==='open'?'open':'closed'}`}>
                    {c.type==='open' ? <><Globe size={13}/> Открытое</> : <><Lock size={13}/> Закрытое</>}
                  </div>
                </div>
                <div className="card-main">
                  <h3>{c.icon} {c.name}</h3>
                  {c.description && <p>{c.description}</p>}
                  <div className="mc-card-meta">
                    <span><Users size={13}/> {c.members} участников</span>
                    {c.nextEvent && <span> {c.nextEvent}</span>}
                  </div>
                </div>
                <div className="card-actions">
                  <button className="join-btn-new">Управлять <ChevronRight size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модалка создания сообщества */}
      {isCreateOpen && (
        <BottomSheet title="Создание сообщества" onClose={() => setIsCreateOpen(false)}>
          <form onSubmit={handleCreate} className="sheet-form">
            <div className="ap-group"><label>Название</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Название клуба"/></div>
            <div className="ap-group"><label>Описание</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Коротко о вашем клубе..." rows={3}/></div>
            <div className="ap-group">
              <label>Категория</label>
              <CustomSelect value={form.category} onChange={v=>setForm({...form,category:v})} options={CATEGORIES_LIST}/>
            </div>
            <div className="ap-group"><label>Тип доступа</label>
              <div className="mc-type-row">
                <button type="button" className={`mc-type-btn ${form.type==='open'?'active':''}`} onClick={()=>setForm({...form,type:'open'})}><Globe size={16}/> Открытое</button>
                <button type="button" className={`mc-type-btn ${form.type==='closed'?'active':''}`} onClick={()=>setForm({...form,type:'closed'})}><Lock size={16}/> Закрытое</button>
              </div>
            </div>
            <div className="ap-footer" style={{marginTop:'10px'}}>
              <button type="button" className="ap-btn-cancel" onClick={() => setIsCreateOpen(false)}>Отмена</button>
              <button type="submit" className="ap-btn-ok">Создать</button>
            </div>
          </form>
        </BottomSheet>
      )}
    </div>
  );
};

export default MyCommunities;
