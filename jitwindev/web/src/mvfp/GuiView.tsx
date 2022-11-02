import React, { useEffect, useRef } from 'react';
import { drawCircle, drawRectangle } from './drawSet';

type Props = {
  className: string;
};

export default function GuiView({ className }: Props) {
  const refCanvas = useRef<HTMLCanvasElement | null>(null);

  const drawParts = (canvas: HTMLCanvasElement | null) => {
    const g = canvas?.getContext('2d');
    if (!g) return;

    g.canvas.width = g.canvas.clientWidth;
    g.canvas.height = g.canvas.clientHeight;
    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    drawCircle(g, 300, 300, 50, 0.3);
    drawRectangle(g, 300, 300, 50, 50, 0.0);
    drawRectangle(g, 300, 300, 50, 50, 0.3);
    drawRectangle(g, 300, 300, 50, 50, 0.6);
  };

  const onResizeWindow = () => {
    drawParts(refCanvas.current);
  };

  useEffect(() => {
    window.addEventListener('resize', onResizeWindow);
    drawParts(refCanvas.current);

    return () => {
      window.removeEventListener('resize', onResizeWindow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={refCanvas} className={className} />;
}
