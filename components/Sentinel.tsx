import React, { useState, useEffect } from 'react';
import Parser from 'rss-parser';
import { useUser } from '@supabase/auth-helpers-react';
import styles from './sentinel.module.css';

const Sentinel = () => {
  const user = useUser();
  const [isHovered, setIsHovered] = useState(false);
  const [latestHeadline, setLatestHeadline] = useState<{
    title: string;
    link: string;
  } | null>(null);

  useEffect(() => {
    const fetchLatestHeadline = async () => {
      console.log('Fetching latest headline...');
      console.log('User:', user);

      try {
        const parser = new Parser();
        const feed = await parser.parseURL(
          'https://api.io.canada.ca/io-server/gc/news/en/v2?dept=departmentofcitizenshipandimmigration&sort=publishedDate&orderBy=desc&publishedDate%3E=2021-07-23&pick=50&format=atom&atomtitle=Immigration,%20Refugees%20and%20Citizenship%20Canada'
        );

        console.log('Feed:', feed);

        if (feed.items.length > 0) {
          const latestItem = feed.items[0];
          console.log('Latest item:', latestItem);

          setLatestHeadline({
            title: latestItem.title || '',
            link: latestItem.link || '',
          });
        } else {
          console.log('No items found in the feed');
        }
      } catch (error) {
        console.error('Error fetching latest headline:', error);
      }
    };

    fetchLatestHeadline();
  }, []);

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
        {latestHeadline ? (
          <>
            <h3>{latestHeadline.title}</h3>
            <a href={latestHeadline.link} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          </>
        ) : (
          <p>Loading headline...</p>
        )}
      </div>
    </div>
  );
};

export default Sentinel;