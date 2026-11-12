import LeafletSearchMap from "../map/LeafletSearchMap";

export default function SearchMap({ rooms = [], center, radiusKm }) {
  return <LeafletSearchMap rooms={rooms} center={center} />;
}
