export function drawGrid(ctx, color, stepx, stepy) {
  ctx.save();

  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;
  let w = ctx.canvas.width,
    h = ctx.canvas.height;
  let columnx = 1;
  while (columnx * stepx <= w) {
    ctx.moveTo(columnx * stepx + 0.5, 0);
    ctx.lineTo(columnx * stepx + 0.5, h);
    columnx++;
  }
  let columny = 1;
  while (columny * stepy <= h) {
    ctx.moveTo(0, columny * stepx + 0.5);
    ctx.lineTo(w, columny * stepx + 0.5);
    columny++;
  }
  ctx.stroke();
  ctx.restore();
}

/**
 * 鼠标点击事件 转化为canvas坐标
 * @param {MouseEvent} event
 * @return {x: number, y: number}
 */
export function windowToCanvas(event) {
  const { target, clientX, clientY } = event;
  const rect = target.getBoundingClientRect();
  return {
    x: (clientX - rect.left) * (target.width / rect.width),
    y: (clientY - rect.top) * (target.height / rect.height),
  };
}
