import React from 'react';
import './empty-styles.scss';
import EmptyImage from 'src/assets/images/empty.png';

interface IVoteeEmpty {
  icon?: React.ReactNode;
  text?: React.ReactNode;
  className?: string;
}

const VoteeEmpty: React.FC<IVoteeEmpty> = ({ icon, text, className }) => {
  return (
    <div className={`votee-empty-wrapper ${className ? className : ''}`}>
      <div className="votee-empty-wrapper__image">
        {icon ? icon : <img src={EmptyImage} alt="empty" />}
      </div>
      <div className="votee-empty-wrapper__text">{text ? text : 'No data'}</div>
    </div>
  );
};

export default VoteeEmpty;
