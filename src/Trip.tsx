import * as styles from "./Trip.css";
import * as models from "./models";
import { useFormatDate, useTranslation } from "./locales/i18n";
import { Span } from "./designSystem/Span";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTrip } from "./api";
import { AsyncButton } from "./AsyncButton";
import { useNavigate } from "react-router";
import * as routes from "./routes";
import { ReactNode, useState } from "react";

type ConfirmDialogState =
  | {
      status: "closed";
    }
  | {
      status: "open";
      message: string;
    };

type Props = models.Trip;

export function Trip(props: Props) {
  const [confirmDialogState, updateConfirmDialogState] =
    useState<ConfirmDialogState>({ status: "closed" });
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

  const renderConfirmModal = (): ReactNode => {
    switch (confirmDialogState.status) {
      case "closed":
        return null;
      case "open":
        return (
          <div className={styles.dialog}>
            <h4>{confirmDialogState.message}</h4>

            <div className={styles.dialogActions}>
              <button
                onClick={(e) => {
                  updateConfirmDialogState({ status: "closed" });
                  e.stopPropagation();
                }}
              >
                {t("Trips.cancelDelete")}
              </button>

              {/* separator */}
              <div style={{ width: 16 }} />

              <AsyncButton
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
        <button
          className={styles.deleteButton}
          onClick={(e) => {
            updateConfirmDialogState({
              status: "open",
              message: t("Trips.confirmDeleteTrip", {
                tripName: `"${props.origin} - ${props.destination}"`,
              }),
            });
            e.stopPropagation();
          }}
        >
          {t("Trips.deleteButton.idle")}
        </button>
      </div>
      <div className={styles.dialogOverlay[confirmDialogState.status]}>
        {renderConfirmModal()}
      </div>
    </div>
  );
}
