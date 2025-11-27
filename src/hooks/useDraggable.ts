import { useState, useRef, useCallback, useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

export function useDraggable(initialPosition?: Position) {
  const [position, setPosition] = useState<Position>(initialPosition || { x: 100, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef<Position>({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only drag from title bar
      const target = e.target as HTMLElement;
      if (!target.classList.contains("title-bar") && !target.classList.contains("title-bar-text")) {
        return;
      }

      setIsDragging(true);
      dragStartPos.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    },
    [position]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return {
    position,
    isDragging,
    dragRef,
    handleMouseDown,
  };
}
