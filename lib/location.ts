export type LocationItem = {
  podcode: string;
  podph: string;
  bairname: string;
  city: string;
  horoo: string;
  podtoktok: string;
  latitude: string;
  podkfc: string;
  geopoint: string;
  lon: string;
  full_address: string;
  bairnote: string;
  district: string;
  id: string;
  lat: string;
  longitude: string;
};

export const formatLocationAddress = (item: LocationItem) =>
  `${item.full_address} | ${item.bairnote}`;
