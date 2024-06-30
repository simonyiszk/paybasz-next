import Modal from "./ui/Modal";

export default function SuccessModal() {
  return (
    <Modal className="w-5/6">
      <div className="text-center p-4 text-wrap break-words">
        <h1 className="text-sm font-bold text-green-600">SUCCESS</h1>
      </div>
    </Modal>
  );
}
