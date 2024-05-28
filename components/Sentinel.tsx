import React, { useState } from 'react';
import styles from './sentinel.module.css';

const Sentinel = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`${styles.sprite} ${
          isHovered ? styles.attackAnimation : styles.idleAnimation
        }`}
      />
      <div className={styles.speechBubble}>New features coming soon.</div>
    </div>
  );
};

export default Sentinel;