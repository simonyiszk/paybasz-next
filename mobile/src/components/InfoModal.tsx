import Modal from "./ui/Modal";

export default function InfoModal({
  onClose,
  message,
}: {
  onClose: () => void;
  message: string;
}) {
  return (
    <Modal className="w-5/6">
      <div className="text-center p-4 text-wrap break-words">
        <h1 className="text-sm font-bold text-black">{message}</h1>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white rounded-lg px-4 py-2 mt-4"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
