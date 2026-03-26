import React, { useState } from 'react';
import { X, CreditCard, Smartphone, QrCode, CheckCircle } from 'lucide-react';
import './PaymentModal.css';

const PaymentModal = ({ event, onClose }) => {
  const [step, setStep] = useState('pay'); // 'pay' | 'success'
  const [method, setMethod] = useState('card');

  const handlePay = () => setStep('success');

  const QR_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="white"/>
      ${[...Array(8)].map((_, r) => [...Array(8)].map((_, c) => 
        `<rect x="${c*25}" y="${r*25}" width="${20}" height="${20}" fill="${Math.random() > 0.5 ? '#141414' : 'white'}" rx="2"/>`
      ).join('')).join('')}
      <rect x="10" y="10" width="50" height="50" fill="none" stroke="#141414" stroke-width="4" rx="4"/>
      <rect x="140" y="10" width="50" height="50" fill="none" stroke="#141414" stroke-width="4" rx="4"/>
      <rect x="10" y="140" width="50" height="50" fill="none" stroke="#141414" stroke-width="4" rx="4"/>
      <rect x="20" y="20" width="30" height="30" fill="#141414" rx="2"/>
      <rect x="150" y="20" width="30" height="30" fill="#141414" rx="2"/>
      <rect x="20" y="150" width="30" height="30" fill="#141414" rx="2"/>
    </svg>
  `)}`;

  return (
    <div className="pay-overlay" onClick={onClose}>
      <div className="pay-modal" onClick={e => e.stopPropagation()}>
        {step === 'pay' ? (
          <>
            <div className="pay-header">
              <div>
                <h3>Оплата билета</h3>
                <p>{event?.title || 'Мероприятие'}</p>
              </div>
              <button className="pay-close" onClick={onClose}><X size={20} /></button>
            </div>

            <div className="pay-amount">{event?.cost || 500} ₽</div>

            <div className="pay-methods">
              <div className={`pay-method ${method === 'card' ? 'active' : ''}`} onClick={() => setMethod('card')}>
                <CreditCard size={20} />
                <span>Карта</span>
              </div>
              <div className={`pay-method ${method === 'apple' ? 'active' : ''}`} onClick={() => setMethod('apple')}>
                <span style={{fontSize:'20px'}}>🍎</span>
                <span>Apple Pay</span>
              </div>
              <div className={`pay-method ${method === 'google' ? 'active' : ''}`} onClick={() => setMethod('google')}>
                <span style={{fontSize:'20px'}}>🔵</span>
                <span>Google Pay</span>
              </div>
            </div>

            {method === 'card' && (
              <div className="card-form">
                <input placeholder="1234 5678 9012 3456" maxLength={19} />
                <div className="card-row">
                  <input placeholder="MM/YY" maxLength={5} />
                  <input placeholder="CVV" maxLength={3} type="password" />
                </div>
              </div>
            )}

            <div className="pay-note">🔒 Безопасный платёж через Escrow. Деньги поступят организатору после мероприятия.</div>

            <button className="pay-btn" onClick={handlePay}>Оплатить {event?.cost || 500} ₽</button>
            <button className="refund-note" onClick={onClose}>Условия возврата</button>
          </>
        ) : (
          <div className="pay-success">
            <CheckCircle size={60} color="#77BC79" />
            <h3>Оплата прошла!</h3>
            <p>Ваш QR-билет для входа</p>
            <img src={QR_PLACEHOLDER} alt="QR-код" className="qr-image" />
            <div className="qr-note">Покажите этот код на входе</div>
            <div className="qr-discount">🎁 Скидка 10% в партнёрских кофейнях</div>
            <button className="pay-btn" onClick={onClose}>Закрыть</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
