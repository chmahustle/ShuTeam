import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import './AuthPage.css';

/* ════════════════════════════
   AUTH PAGE
════════════════════════════ */
const AuthPage = ({ onAuth }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1); // для регистрации: шаг 1 = инфо, шаг 2 = интересы

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirm: '', city: '',
    categories: [],
  });

  const CATEGORIES = ['Художники', 'Чтение', 'Музыка', 'Аниме', 'Кулинария', 'Философия', 'Спорт', 'Кино', 'Вязание', 'Языки'];

  const toggleCategory = (cat) => {
    setForm(f => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter(c => c !== cat)
        : [...f.categories, cat],
    }));
  };

  const handleLogin = (e) => { e.preventDefault(); onAuth(); };
  const handleRegisterStep1 = (e) => { e.preventDefault(); setStep(2); };
  const handleRegisterStep2 = (e) => { e.preventDefault(); onAuth(); };

  return (
    <div className="auth-page">
      {/* ── ФОН + ЛОГО ── */}
      <div className="auth-bg">
        <div className="auth-logo">
          <div className="auth-logo-mark">S</div>
          <span className="auth-logo-text">ShuTeam</span>
        </div>
        <div className="auth-tagline">Офлайн-сообщества рядом с тобой</div>
      </div>

      {/* ── КАРТОЧКА ФОРМЫ ── */}
      <div className="auth-card">
        <div className="auth-card-handle"/>

        {/* ВХОД */}
        {mode === 'login' && (
          <>
            <h2 className="auth-title">Добро пожаловать!</h2>
            <p className="auth-sub">Войдите в свой аккаунт</p>
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="auth-field">
                <label>Email или телефон</label>
                <input required type="text" placeholder="example@mail.ru" value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
              </div>
              <div className="auth-field">
                <label>Пароль</label>
                <div className="pass-wrap">
                  <input required type={showPassword ? 'text' : 'password'} placeholder="Введите пароль" value={form.password} onChange={e => setForm({...form, password: e.target.value})}/>
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
              </div>
              <button type="button" className="forgot-link" onClick={() => setMode('forgot')}>Забыли пароль?</button>
              <button type="submit" className="auth-submit-btn">Войти <ArrowRight size={18}/></button>
            </form>
            <div className="auth-divider"><span>или</span></div>
            <div className="auth-switch">Нет аккаунта? <button onClick={() => { setMode('register'); setStep(1); }}>Зарегистрироваться</button></div>
          </>
        )}

        {/* РЕГИСТРАЦИЯ — шаг 1 */}
        {mode === 'register' && step === 1 && (
          <>
            <div className="auth-step-row">
              <div className="auth-step active">1</div>
              <div className="auth-step-line"/>
              <div className="auth-step">2</div>
            </div>
            <h2 className="auth-title">Создать аккаунт</h2>
            <p className="auth-sub">Шаг 1 из 2 — Личные данные</p>
            <form className="auth-form" onSubmit={handleRegisterStep1}>
              <div className="auth-field">
                <label>Имя</label>
                <input required placeholder="Ваше имя" value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
              </div>
              <div className="auth-field">
                <label>Email</label>
                <input required type="email" placeholder="example@mail.ru" value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
              </div>
              <div className="auth-field">
                <label>Телефон</label>
                <input type="tel" placeholder="+7 (___) ___-__-__" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}/>
              </div>
              <div className="auth-field">
                <label>Город</label>
                <input placeholder="Москва" value={form.city} onChange={e => setForm({...form, city: e.target.value})}/>
              </div>
              <div className="auth-field">
                <label>Пароль</label>
                <div className="pass-wrap">
                  <input required type={showPassword ? 'text' : 'password'} placeholder="Минимум 8 символов" value={form.password} onChange={e => setForm({...form, password: e.target.value})}/>
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
              </div>
              <div className="auth-field">
                <label>Подтвердите пароль</label>
                <div className="pass-wrap">
                  <input required type={showConfirm ? 'text' : 'password'} placeholder="Повторите пароль" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})}/>
                  <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
              </div>
              <button type="submit" className="auth-submit-btn">Далее <ArrowRight size={18}/></button>
            </form>
            <div className="auth-switch">Уже есть аккаунт? <button onClick={() => setMode('login')}>Войти</button></div>
          </>
        )}

        {/* РЕГИСТРАЦИЯ — шаг 2: интересы */}
        {mode === 'register' && step === 2 && (
          <>
            <div className="auth-step-row">
              <div className="auth-step done"><Check size={14}/></div>
              <div className="auth-step-line active"/>
              <div className="auth-step active">2</div>
            </div>
            <h2 className="auth-title">Ваши интересы</h2>
            <p className="auth-sub">Шаг 2 из 2 — Выберите категории</p>
            <form className="auth-form" onSubmit={handleRegisterStep2}>
              <div className="auth-categories">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`auth-cat-chip ${form.categories.includes(cat) ? 'selected' : ''}`}
                    onClick={() => toggleCategory(cat)}
                  >
                    {form.categories.includes(cat) && <Check size={13}/>}
                    {cat}
                  </button>
                ))}
              </div>
              <p className="auth-cat-hint">Выбрано: {form.categories.length} категорий</p>
              <button type="submit" className="auth-submit-btn" disabled={form.categories.length === 0}>
                Начать <ArrowRight size={18}/>
              </button>
              <button type="button" className="auth-skip-btn" onClick={onAuth}>Пропустить</button>
            </form>
          </>
        )}

        {/* ВОССТАНОВЛЕНИЕ ПАРОЛЯ */}
        {mode === 'forgot' && (
          <>
            <h2 className="auth-title">Восстановление</h2>
            <p className="auth-sub">Введите email — мы отправим ссылку</p>
            <form className="auth-form" onSubmit={(e) => { e.preventDefault(); setMode('login'); }}>
              <div className="auth-field">
                <label>Email</label>
                <input required type="email" placeholder="example@mail.ru" value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
              </div>
              <button type="submit" className="auth-submit-btn">Отправить ссылку <ArrowRight size={18}/></button>
              <button type="button" className="auth-skip-btn" onClick={() => setMode('login')}>← Вернуться ко входу</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
