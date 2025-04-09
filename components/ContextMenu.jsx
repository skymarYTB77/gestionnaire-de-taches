function ContextMenu({ x, y, onClose, options }) {
  const adjustPosition = () => {
    const menuWidth = 160;
    const menuHeight = options.length * 36;
    
    let adjustedX = x;
    let adjustedY = y;
    
    if (adjustedX + menuWidth > window.innerWidth) {
      adjustedX = adjustedX - menuWidth;
    }
    
    if (adjustedY + menuHeight > window.innerHeight) {
      adjustedY = window.innerHeight - menuHeight;
    }
    
    return { adjustedX, adjustedY };
  };

  const { adjustedX, adjustedY } = adjustPosition();

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div
        className="fixed z-50 bg-neutral-800 rounded-lg shadow-lg py-1 border border-neutral-700 min-w-[160px]"
        style={{ 
          top: `${adjustedY}px`,
          left: `${adjustedX}px`,
        }}
      >
        {options.map((option, index) => (
          <button
            key={index}
            className={`w-full px-4 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-700 flex items-center gap-2 ${option.className || ''}`}
            onClick={() => {
              option.onClick();
              onClose();
            }}
          >
            <span className={`text-neutral-400 ${option.className || ''}`}>{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>
    </>
  );
}

export default ContextMenu;