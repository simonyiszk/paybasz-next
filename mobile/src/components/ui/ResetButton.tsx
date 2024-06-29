export default function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="bg-red-500 hover:bg-red-700 text-white font-bold absolute top-2 left-2 py-2 px-4 rounded"
      onClick={onClick}
    >
      Reset
    </button>
  );
}
