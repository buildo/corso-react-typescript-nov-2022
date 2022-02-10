import { getTrips } from "./api";
import { useTranslation } from "./locales/i18n";
import { Trip } from "./Trip";
import * as styles from "./Trips.css";
import { useQuery } from "@tanstack/react-query";
import { matchQuery } from "./utils/matchQuery";

export function Trips() {
  const tripsQuery = useQuery({ queryKey: ["trips"], queryFn: getTrips });
  const { t } = useTranslation();

  return (
    <div className={styles.trips}>
      {matchQuery(tripsQuery, {
        success: (trips, isFetching) =>
          isFetching
            ? t("Trips.QueryLoading")
            : trips.map((trip) => <Trip key={trip.id} {...trip} />),
        error: () => t("Trips.QueryError"),
        loading: () => t("Trips.QueryLoading"),
      })}
    </div>
  );
}
