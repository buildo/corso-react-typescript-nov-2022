import * as styles from "./Trip.css";
import * as models from "./models";
import { useFormatDate, useTranslation } from "./locales/i18n";
import { Span } from "./designSystem/Span";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTrip } from "./api";
import { AsyncButton } from "./AsyncButton";
import { useNavigate } from "react-router";

type Props = models.Trip;

export function Trip(props: Props) {
  const queryClient = useQueryClient();
  const { status, mutate } = useMutation(["deleteTrip"], deleteTrip, {
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
  const navigate = useNavigate();

  return (
    <div
      className={`${styles.trip} ${styles.tripStatus[props.status]}`}
      onClick={() => navigate(`/trips/${props.id}`)}
    >
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
        <AsyncButton
          className={styles.deleteButton}
          status={status}
          onClick={(e) => {
            mutate(props.id);
            e.stopPropagation();
          }}
          labels={{
            loading: t("Trips.deleteButton.loading"),
            error: t("Trips.deleteButton.error"),
            success: t("Trips.deleteButton.success"),
            idle: t("Trips.deleteButton.idle"),
          }}
        />
      </div>
    </div>
  );
}
