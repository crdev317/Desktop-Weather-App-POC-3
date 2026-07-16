// A City is always a resolved place (see Context.MD): a name plus coordinates.
// The raw text a user typed is a transient search query, never stored as a City.
export interface City {
  name: string;
  latitude: number;
  longitude: number;
  country?: string; // may be absent for some places
  admin1?: string; // region/state; may be absent for some places
}
