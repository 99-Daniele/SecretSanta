import { useCountdown } from '../../hooks/useCountdown';
import styles from './CountdownBar.module.css';

const CountdownBar = ({ targetDate, eventName, showEventName = true }) => {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <div className={showEventName ? styles.countdownBar : styles.countdownInline}>
        {showEventName && (
          <div className={styles.container}>
            <span className={styles.eventName}>{eventName}</span>
            <span className={styles.expired}>Evento concluso</span>
          </div>
        )}
        {!showEventName && (
          <span className={styles.expiredInline}>Evento concluso</span>
        )}
      </div>
    );
  }

  if (showEventName) {
    return (
      <div className={styles.countdownBar}>
        <div className={styles.container}>
          <span className={styles.eventName}>{eventName}</span>
          <div className={styles.countdown}>
            <div className={styles.timeUnit}>
              <div className={styles.timeValue}>{days}</div>
              <div className={styles.timeLabel}>giorni</div>
            </div>
            <div className={styles.timeSeparator}>:</div>
            <div className={styles.timeUnit}>
              <div className={styles.timeValue}>{hours}</div>
              <div className={styles.timeLabel}>ore</div>
            </div>
            <div className={styles.timeSeparator}>:</div>
            <div className={styles.timeUnit}>
              <div className={styles.timeValue}>{minutes}</div>
              <div className={styles.timeLabel}>min</div>
            </div>
            <div className={styles.timeSeparator}>:</div>
            <div className={styles.timeUnit}>
              <div className={styles.timeValue}>{seconds}</div>
              <div className={styles.timeLabel}>sec</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Inline mode for TopBar
  return (
    <div className={styles.countdownInline}>
      <div className={styles.timeUnit}>
        <div className={styles.timeValue}>{days}</div>
        <div className={styles.timeLabel}>giorni</div>
      </div>
      <div className={styles.timeSeparator}>:</div>
      <div className={styles.timeUnit}>
        <div className={styles.timeValue}>{hours}</div>
        <div className={styles.timeLabel}>ore</div>
      </div>
      <div className={styles.timeSeparator}>:</div>
      <div className={styles.timeUnit}>
        <div className={styles.timeValue}>{minutes}</div>
        <div className={styles.timeLabel}>min</div>
      </div>
      <div className={styles.timeSeparator}>:</div>
      <div className={styles.timeUnit}>
        <div className={styles.timeValue}>{seconds}</div>
        <div className={styles.timeLabel}>sec</div>
      </div>
    </div>
  );
};

export default CountdownBar;
