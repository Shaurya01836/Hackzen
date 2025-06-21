import Register from "../pages/Auth/Register";

function RegisterModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl z-50"
      >
        &times;
      </button>
      <Register />
    </div>
  );
}

export default RegisterModal;
