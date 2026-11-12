import LeafletPropertyMap from "../map/LeafletPropertyMap";

export default function PropertyMap({ location, title }) {
  return <LeafletPropertyMap location={location} title={title} />;
}
