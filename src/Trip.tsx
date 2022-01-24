import * as styles from "./Trip.css";
import * as models from "./models";
import { useFormatDate } from "./locales/i18n";

type Props = models.Trip;

export function Trip(props: Props) {
  const seatNumber = ((): string => {
    switch (props.status) {
      case "Booked":
      case "Requested":
        return "";
      case "CheckedIn":
        return `⋅ 💺 ${props.seatNumber}`;
    }
  })();

  const formatDate = useFormatDate();

  return (
    <div className={`${styles.trip} ${styles.tripStatus[props.status]}`}>
      <span>{`${props.origin} -> ${props.destination} ${seatNumber} `}</span>
      <span>
        {`${formatDate(props.startDate)} -> ${formatDate(props.endDate)}`}
      </span>
    </div>
  );
}
