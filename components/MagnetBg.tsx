/// <reference lib="dom" />
import React, { useEffect, useRef } from "react";

// 擴展 Window 介面以包含 CSS.paintWorklet
interface PaintWorkletWindow extends Window {
  CSS: {
    paintWorklet: {
      addModule: (module: string) => Promise<void>;
    };
  };
}

const MagnetBg: React.FC = () => {
  const bgRef = useRef<HTMLDivElement>(null);

  // 檢查 paintWorklet 是否存在
  const isSupport: boolean = Boolean((window as PaintWorkletWindow).CSS?.paintWorklet?.addModule);

  useEffect(() => {
    if (!isSupport) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      bgRef.current?.style.setProperty("--mouse-x", e.clientX.toString());
      bgRef.current?.style.setProperty("--mouse-y", e.clientY.toString());
    };

    const onMouseLeave = () => {
      bgRef.current?.style.setProperty("--mouse-x", "-999");
      bgRef.current?.style.setProperty("--mouse-y", "-999");
    };

    window.addEventListener("mouseenter", onMouseMove);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    (window as PaintWorkletWindow).CSS.paintWorklet.addModule(
      `data:application/javascript;charset=utf8,${encodeURIComponent(`
      // MagnetMatrixPaintWorklet 的代碼...
    `)}`
    );

    return () => {
      window.removeEventListener("mouseenter", onMouseMove);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [isSupport]);

  return isSupport ? <div ref={bgRef} className="magnet-bg"></div> : null;
};

export default MagnetBg;
