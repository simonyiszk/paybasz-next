export default function Button({
  children,
  onClick,
  full = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  full?: boolean;
}) {
  return (
    <button
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
        full ? "w-64" : "w-5/12"
      } aspect-square`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
