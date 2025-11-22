import { useEffect, useState } from 'react';
import styles from './Snowflakes.module.css';

const Snowflakes = ({ count = 50 }) => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const flakes = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 10 + Math.random() * 10,
      animationDelay: Math.random() * 5,
      fontSize: 0.5 + Math.random() * 1,
    }));
    setSnowflakes(flakes);
  }, [count]);

  return (
    <div className={styles.snowflakes} aria-hidden="true">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className={styles.snowflake}
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.animationDelay}s`,
            fontSize: `${flake.fontSize}em`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

export default Snowflakes;
