import { getTrips } from "./api";
import { Trip } from "./Trip";
import * as styles from "./Trips.css";
import { useQuery } from "@tanstack/react-query";
import { matchQuery } from "./utils/matchQuery";

export function Trips() {
  const tripsQuery = useQuery({ queryKey: ["trips"], queryFn: getTrips });

  return (
    <div className={styles.trips}>
      {matchQuery(tripsQuery, {
        success: (trips, isFetching) =>
          isFetching
            ? "Loading..."
            : trips.map((trip) => <Trip key={trip.id} {...trip} />),
        error: () => "Error while fetching trips!!",
        loading: () => "Loading...",
      })}
    </div>
  );
}
