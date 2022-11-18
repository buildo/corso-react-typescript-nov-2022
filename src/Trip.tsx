import * as styles from "./Trip.css";
import * as models from "./models";
import { useFormatDate, useTranslation } from "./locales/i18n";
import { Span } from "./designSystem/Span";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTrip } from "./api";

type Props = models.Trip;

export function Trip(props: Props) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(["deleteTrip"], deleteTrip, {
    onSuccess: () => queryClient.invalidateQueries(["trips"]),
  });

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
      <div>
        <Span>
          {t("Trip.dates", {
            startDate: formatDate(props.startDate),
            endDate: formatDate(props.endDate),
          })}
        </Span>
        <button
          className={styles.deleteButton}
          onClick={() => mutate(props.id)}
        >
          {t("Trips.deleteButton.idle")}
        </button>
      </div>
    </div>
  );
}
