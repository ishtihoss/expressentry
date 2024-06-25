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
        <p>Sign in for unlimited queries and full access to all features.</p>
      </div>
    </div>
  );
};

export default SignInSentinel;