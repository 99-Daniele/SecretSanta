import React from 'react';
import styles from './Snowflakes.module.css';

const Snowflakes = ({ count = 50 }) => {
  // Assign a deterministic variant per index so we can avoid inline styles
  const variants = Array.from({ length: count }, (_, i) => `variant${i % 10}`);

  return (
    <div className={styles.snowflakes} aria-hidden="true">
      {variants.map((v, i) => (
        <div key={i} className={`${styles.snowflake} ${styles[v]}`}>
          ❄
        </div>
      ))}
    </div>
  );
};

export default Snowflakes;
