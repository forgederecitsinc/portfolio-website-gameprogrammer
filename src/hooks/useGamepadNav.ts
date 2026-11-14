import { useEffect, useRef, useState } from 'react';

interface UseGamepadNavOptions {
  itemCount: number;
  isModalOpen: boolean;
  onOpenIndex: (index: number) => void;
  onCloseModal: () => void;
  onPrevModal: () => void;
  onNextModal: () => void;
}

/**
 * Polls the HTML5 Gamepad API when a controller (DualSense, Xbox, etc.) is connected,
 * enabling D-pad/stick portfolio card navigation, A/Cross to open, and B/Circle to close.
 */
export function useGamepadNav({
  itemCount,
  isModalOpen,
  onOpenIndex,
  onCloseModal,
  onPrevModal,
  onNextModal,
}: UseGamepadNavOptions) {
  const [connectedName, setConnectedName] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const lastActionRef = useRef(0);
  const prevButtonsRef = useRef<boolean[]>([]);
  const focusedRef = useRef<number | null>(null);
  focusedRef.current = focusedIndex;

  useEffect(() => {
    const onConnect = (e: GamepadEvent) => {
      setConnectedName(e.gamepad.id.split('(')[0].trim() || 'Controller');
      setFocusedIndex((prev) => (prev === null ? 0 : prev));
    };
    const onDisconnect = () => {
      const pads = navigator.getGamepads?.() ?? [];
      const active = Array.from(pads).find(Boolean);
      if (!active) {
        setConnectedName(null);
        setFocusedIndex(null);
      }
    };

    window.addEventListener('gamepadconnected', onConnect);
    window.addEventListener('gamepaddisconnected', onDisconnect);
    return () => {
      window.removeEventListener('gamepadconnected', onConnect);
      window.removeEventListener('gamepaddisconnected', onDisconnect);
    };
  }, []);

  useEffect(() => {
    if (!connectedName || itemCount === 0) return;
    let raf = 0;

    const poll = (now: number) => {
      const pads = navigator.getGamepads?.() ?? [];
      const pad = Array.from(pads).find(Boolean);
      if (pad) {
        const pressed = pad.buttons.map((b) => b.pressed);
        const justPressed = (idx: number) => pressed[idx] && !prevButtonsRef.current[idx];

        const axX = pad.axes[0] ?? 0;
        const axY = pad.axes[1] ?? 0;
        const dLeft = pressed[14] || axX < -0.55;
        const dRight = pressed[15] || axX > 0.55;
        const dUp = pressed[12] || axY < -0.55;
        const dDown = pressed[13] || axY > 0.55;

        if (isModalOpen) {
          if (justPressed(1)) onCloseModal();
          else if (justPressed(4) || justPressed(14)) onPrevModal();
          else if (justPressed(5) || justPressed(15)) onNextModal();
        } else {
          if (now - lastActionRef.current > 180) {
            if (dRight || dDown) {
              lastActionRef.current = now;
              setFocusedIndex((prev) => (((prev ?? -1) + 1) % itemCount));
            } else if (dLeft || dUp) {
              lastActionRef.current = now;
              setFocusedIndex((prev) => (((prev ?? 0) - 1 + itemCount) % itemCount));
            }
          }
          if (justPressed(0) && focusedRef.current !== null) {
            onOpenIndex(focusedRef.current);
          }
        }

        prevButtonsRef.current = pressed;
      }
      raf = requestAnimationFrame(poll);
    };

    raf = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(raf);
  }, [connectedName, itemCount, isModalOpen, onOpenIndex, onCloseModal, onPrevModal, onNextModal]);

  return { connectedName, focusedIndex };
}
