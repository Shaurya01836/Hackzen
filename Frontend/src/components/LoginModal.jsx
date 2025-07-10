import Login from "../pages/Auth/Login";

function LoginModal({ onClose, onSwitchToRegister }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl z-50"
      >
        &times;
      </button>
      <Login onClose={onClose} onSwitchToRegister={onSwitchToRegister} />
    </div>
  );
}

export default LoginModal;
