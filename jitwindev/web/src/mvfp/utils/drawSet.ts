export const drawCircle = (
  g: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  r: number,
  rotateRad?: number
) => {
  g.translate(centerX, centerY)
  if (rotateRad) {
    g.rotate(rotateRad)
  }
  g.beginPath()
  g.arc(0, 0, 100, 0, 2 * Math.PI)
  g.stroke()
  if (rotateRad) {
    g.rotate(-rotateRad)
  }
  g.translate(-centerX, -centerY)
}

export const drawRectangle = (
  g: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  rotateRad?: number
) => {
  const w2 = width / 2
  const h2 = height / 2
  g.translate(centerX, centerY)
  if (rotateRad) {
    g.rotate(rotateRad)
  }
  g.strokeRect(-w2, -h2, width, height)
  if (rotateRad) {
    g.rotate(-rotateRad)
  }
  g.translate(-centerX, -centerY)
}
