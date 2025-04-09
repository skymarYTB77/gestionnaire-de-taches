function Toggle({ enabled, setEnabled, label }) {
  return (
    <div className="flex items-center gap-2">
      <button
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
          ${enabled ? 'bg-amber-200' : 'bg-neutral-700'}`}
        onClick={() => setEnabled(!enabled)}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
      <span className="text-white text-sm">{label}</span>
    </div>
  );
}

export default Toggle;