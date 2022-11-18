import { Trip } from "./models";
import * as t from "io-ts";
import { PathReporter } from "io-ts/PathReporter";
import { either } from "fp-ts";

const baseUrl = process.env.REACT_APP_API_URL;
const apiKey = process.env.REACT_APP_API_KEY;

const authenticationHeader = {
  Authorization: `Bearer ${apiKey}`,
};

const get = (path: string) =>
  fetch(`${baseUrl}${path}`, { headers: authenticationHeader })
    .then((res) => res.json())
    .then((res) => res.records.map((r: { fields: unknown[] }) => r.fields));

const del = (path: string, id: string) =>
  fetch(`${baseUrl}${path}?records[]=${id}`, {
    method: "DELETE",
    headers: authenticationHeader,
  }).then(() => {});

export const getTrips = async (): Promise<Trip[]> => {
  const response = await get("/Trips");
  return decodeOrThrow(t.array(Trip), response);
};

export const deleteTrip = async (id: Trip["id"]): Promise<void> => {
  return del("/Trips", id);
};

function decodeOrThrow<A, O>(type: t.Type<A, O>, value: unknown): A {
  const decoded = type.decode(value);
  if (either.isLeft(decoded)) {
    throw new Error(PathReporter.report(decoded).join("\n"));
  }
  return decoded.right;
}
