import { useEffect } from 'react';
import Snowflakes from './Snowflakes';
import styles from './ChristmasAnimation.module.css';

const ChristmasAnimation = ({ message = 'Estraendo i Secret Santa...', duration = 3000, onComplete }) => {
  useEffect(() => {
    if (onComplete && duration) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onComplete]);

  return (
    <div className={styles.animation}>
      <Snowflakes count={100} />
      
      <div className={styles.santa}>🎅</div>
      
      <div className={styles.text}>{message}</div>
      
      <div className={styles.gifts}>
        <span className={styles.gift}>🎁</span>
        <span className={styles.gift}>🎁</span>
        <span className={styles.gift}>🎁</span>
      </div>

      <div className={styles.progress}>
        <div className={styles.progressBar}></div>
      </div>
    </div>
  );
};

export default ChristmasAnimation;
