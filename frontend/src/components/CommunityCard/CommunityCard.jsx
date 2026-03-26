import React from 'react';
import './CommunityCard.css';
import { Lock, Unlock, Globe, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommunityCard = ({ community }) => {
  const navigate = useNavigate();
  const { id, name, description, type, category } = community;

  const renderPrivacyBadge = () => {
    switch(type) {
      case 'open': return <div className="badge open"><Globe size={14} /> Открытое</div>;
      case 'partial': return <div className="badge partial"><Unlock size={14} /> Частично</div>;
      case 'closed': return <div className="badge closed"><Lock size={14} /> Закрытое</div>;
      default: return null;
    }
  };

  return (
    <div className="community-card-new" onClick={() => navigate(`/community/${id}`)}>
      <div className="card-tags">
        <div className="tag-category">{category}</div>
        {renderPrivacyBadge()}
      </div>
      
      <div className="card-main">
        <h3>{name}</h3>
        <p>{description}</p>
      </div>

      <div className="card-actions">
        <button className="join-btn-new">
          Вступить <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default CommunityCard;
