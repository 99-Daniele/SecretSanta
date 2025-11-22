import { useCountdown } from '../../hooks/useCountdown';
import styles from './Countdown.module.css';

const Countdown = ({ targetDate, expiredMessage = '🎄 È ora di aprire i regali!' }) => {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <div className={styles.expired}>
        <div className={styles.expiredText}>{expiredMessage}</div>
        <div className={styles.expiredSubtext}>Il momento è arrivato! 🎁</div>
      </div>
    );
  }

  return (
    <div className={styles.countdown}>
      <div className={styles.timeBlock}>
        <div className={styles.number}>{days}</div>
        <div className={styles.label}>Giorni</div>
      </div>
      <div className={styles.timeBlock}>
        <div className={styles.number}>{hours}</div>
        <div className={styles.label}>Ore</div>
      </div>
      <div className={styles.timeBlock}>
        <div className={styles.number}>{minutes}</div>
        <div className={styles.label}>Minuti</div>
      </div>
      <div className={styles.timeBlock}>
        <div className={styles.number}>{seconds}</div>
        <div className={styles.label}>Secondi</div>
      </div>
    </div>
  );
};

export default Countdown;
