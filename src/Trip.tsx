import * as styles from "./Trip.css";
import * as models from "./models";
import { useFormatDate, useTranslation } from "./locales/i18n";
import { Span } from "./designSystem/Span";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTrip } from "./api";
import { AsyncButton } from "./AsyncButton";
import { useNavigate } from "react-router";
import * as routes from "./routes";
import { useState } from "react";

type Props = models.Trip;

type State =
  | {
      state: "ready";
    }
  | {
      state: "confirmDelete";
    };

export function Trip(props: Props) {
  const queryClient = useQueryClient();
  const { status, mutate } = useMutation(["deleteTrip"], deleteTrip, {
    onSuccess: () => queryClient.invalidateQueries(["trips"]),
  });
  const [state, updateState] = useState<State>({ state: "ready" });

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

  const renderDelete = (): React.ReactNode => {
    switch (state.state) {
      case "ready":
        return (
          <button
            className={styles.tripButton}
            onClick={(e) => {
              updateState({ state: "confirmDelete" });
              e.stopPropagation();
            }}
          >
            {t("Trips.deleteButton.idle")}
          </button>
        );
      case "confirmDelete":
        return (
          <>
            <button
              className={styles.tripButton}
              onClick={(e) => {
                updateState({ state: "ready" });
                e.stopPropagation();
              }}
            >
              {t("Trips.deleteCancel")}
            </button>
            <AsyncButton
              className={styles.tripButton}
              onClick={(e) => {
                mutate(props.id);
                e.stopPropagation();
              }}
              status={status}
              labels={{
                loading: t("Trips.deleteButton.loading"),
                error: t("Trips.deleteButton.error"),
                success: t("Trips.deleteButton.success"),
                idle: t("Trips.deleteButton.confirm"),
              }}
            />
          </>
        );
    }
  };

  return (
    <div
      className={`${styles.trip} ${styles.tripStatus[props.status]}`}
      onClick={() => navigate(routes.trip({ tripId: String(props.id) }))}
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
        {renderDelete()}
      </div>
    </div>
  );
}
