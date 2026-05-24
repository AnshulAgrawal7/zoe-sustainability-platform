// Visible reminder that all data is illustrative prototype data
export default function PrototypeBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center">
      <p className="text-sm text-amber-800">
        <span className="font-semibold">Prototype Notice:</span> This is a
        frontend MVP with dummy data only. No real data is stored or transmitted.
        Built for the ZOE DSR research project.
      </p>
    </div>
  );
}
