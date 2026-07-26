import { useCallback, useRef } from 'react';

const BTN =
  'select-none touch-none rounded-md border-2 border-[#42557a] bg-[#1b2436]/80 text-[#c9f24b] flex items-center justify-center active:bg-[#2a3f66] active:scale-95 transition-transform';

const TouchControls = ({ onInput }) => {
  const activeRef = useRef(new Map());

  const start = useCallback(
    (action) => (e) => {
      e.preventDefault();
      const id = e.pointerId ?? e.changedTouches?.[0]?.identifier ?? 0;
      activeRef.current.set(id, action);
      onInput(action, true);
    },
    [onInput],
  );

  const end = useCallback(
    (e) => {
      e.preventDefault();
      const id = e.pointerId ?? e.changedTouches?.[0]?.identifier ?? 0;
      const action = activeRef.current.get(id);
      if (action) {
        onInput(action, false);
        activeRef.current.delete(id);
      }
    },
    [onInput],
  );

  const dpadBtn = (action, label, className, ariaLabel) => (
    <button
      className={`${BTN} ${className}`}
      aria-label={ariaLabel}
      onPointerDown={start(action)}
      onPointerUp={end}
      onPointerCancel={end}
    >
      {label}
    </button>
  );

  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none md:hidden pb-4 px-4 flex justify-between items-end">
      {/* D-pad */}
      <div className="pointer-events-auto grid grid-cols-3 grid-rows-3 gap-1 w-[120px] h-[120px]">
        <span />
        {dpadBtn('up', '▲', 'w-9 h-9 justify-self-center self-end text-sm', 'Up')}
        <span />
        {dpadBtn('left', '◀', 'w-9 h-9 justify-self-end self-center text-sm', 'Left')}
        <span />
        {dpadBtn('right', '▶', 'w-9 h-9 justify-self-start self-center text-sm', 'Right')}
        <span />
        {dpadBtn('down', '▼', 'w-9 h-9 justify-self-center self-start text-sm', 'Down')}
        <span />
      </div>

      {/* Action buttons */}
      <div className="pointer-events-auto flex gap-3 items-center">
        <button
          className={`${BTN} w-12 h-12 text-[10px] font-mono uppercase`}
          aria-label="Back"
          onPointerDown={start('back')}
          onPointerUp={end}
          onPointerCancel={end}
        >
          Esc
        </button>
        <button
          className={`${BTN} w-14 h-14 text-xs font-mono uppercase border-[#c9f24b]`}
          aria-label="Enter"
          onPointerDown={start('enter')}
          onPointerUp={end}
          onPointerCancel={end}
        >
          Enter
        </button>
      </div>
    </div>
  );
};

export default TouchControls;
