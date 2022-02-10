import * as styles from "./Trip.css";
import * as models from "./models";
import { useFormatDate, useTranslation } from "./locales/i18n";
import { Span } from "./designSystem/Span";

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

  const { t } = useTranslation();
  const formatDate = useFormatDate();

  return (
    <div className={`${styles.trip} ${styles.tripStatus[props.status]}`}>
      <Span>
        {t("Trip.info", {
          origin: props.origin,
          destination: props.destination,
          seatNumber,
        })}
      </Span>
      <Span>
        {t("Trip.dates", {
          startDate: formatDate(props.startDate),
          endDate: formatDate(props.endDate),
        })}
      </Span>
    </div>
  );
}
