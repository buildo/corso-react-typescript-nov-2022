import * as styles from "./TripDetails.css";
import { getTrip } from "./api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { matchQuery } from "./utils/matchQuery";
import { unsafeTranslatedString, useTranslation } from "./locales/i18n";
import { useFormatDate } from "./locales/i18n";
import { Span } from "./designSystem/Span";

export function TripDetails() {
  const params = useParams<"tripId">();
  const tripId = params.tripId!;
  const { t } = useTranslation();
  const formatDate = useFormatDate();

  const tripQuery = useQuery(["trip", tripId], () => getTrip(tripId));

  return (
    <div className={styles.tripDetails}>
      {matchQuery(tripQuery, {
        error: () => (
          <div>
            <Span>{t("TripDetails.error")}</Span>
          </div>
        ),
        loading: () => (
          <div>
            <Span>{t("TripDetails.loading")}</Span>
          </div>
        ),
        success: (trip) => (
          <>
            <div className={styles.from}>
              <Span>{t("TripDetails.from")}</Span>
              <Span>{unsafeTranslatedString(trip.origin)}</Span>
              <Span>{formatDate(trip.startDate)}</Span>
            </div>
            <div className={styles.to}>
              <Span>{t("TripDetails.to")}</Span>
              <Span>{unsafeTranslatedString(trip.destination)}</Span>
              <Span>{formatDate(trip.endDate)}</Span>
            </div>
          </>
        ),
      })}
    </div>
  );
}
