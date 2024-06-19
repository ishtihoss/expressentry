// components/SignInSentinel.tsx

import React, { useState } from 'react';
import styles from './sentinel.module.css';

const SignInSentinel = () => {
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
      <div className={styles.speechBubble}>
        <p>You need to sign in to access this page. We request this to prevent abuse from bots.</p>
      </div>
    </div>
  );
};

export default SignInSentinel;