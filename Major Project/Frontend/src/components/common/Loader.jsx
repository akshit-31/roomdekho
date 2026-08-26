import Spinner from "./Spinner";

export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[200px] w-full flex-col items-center justify-center gap-3 py-12">
      <Spinner size={28} />
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
