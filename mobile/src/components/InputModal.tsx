export default function InputModal({
  message,
  isNumberOnly = false,
  onFinish,
}: {
  message: string;
  isNumberOnly?: boolean;
  onFinish: (value: string) => void;
}) {
  return (
    <div className="h-full absolute z-30 w-full">
      <div className="flex items-center justify-center w-full h-full flex-row">
        <div className="bg-gray-50 rounded-xl p-6">
          <form
            className="text-center p-4 text-wrap break-words flex flex-col items-center"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const value = formData.get("input") as string;
              onFinish(value);
            }}
          >
            <h1 className="text-sm font-bold text-black">{message}</h1>
            <input
              id="input"
              name="input"
              type={isNumberOnly ? "number" : "text"}
              className="border-2 border-gray-500 rounded-lg px-4 py-2 mt-4 bg-transparent text-black"
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-lg px-4 py-2 mt-4"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
