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

/**
 * 获取两个点之间的距离和弧度
 * @param {object} startPoint {x: number, y: number}
 * @param {object} endPoint {x: number, y: number}
 * @returns [radius, angle]
 */
export function getRadiusAndAngle(startPoint, endPoint) {
  let radius = 0,
    angle = 0;
  if (startPoint.y === endPoint.y) {
    // 一条横线 半径为 endPoint.x - startPoint.x
    radius = Math.abs(endPoint.x - startPoint.x);
  } else if (startPoint.x === endPoint.x) {
    // 一条竖线 半径为 endPoint.y - startPoint.y
    radius = Math.abs(endPoint.y - startPoint.y);
  } else {
    // 不是直线
    const disX = Math.abs(endPoint.x - startPoint.x);
    const disY = Math.abs(endPoint.y - startPoint.y);
    radius = Math.sqrt(Math.pow(disX, 2) + Math.pow(disY, 2));
  }

  // 可以写成 startPoint.y - endPoint.y
  const atan2Y = -(endPoint.y - startPoint.y);
  const atan2X = endPoint.x - startPoint.x;
  angle = Math.atan2(atan2Y, atan2X);

  if (angle === -0) {
    // 会有-0的情况
    angle = 0;
  }

  return [radius, angle];
}

/**
 * 在指定点画十字辅助线
 * @param {*} ctx
 * @param {*} x
 * @param {*} y
 */
export function drawGuidewires(ctx, x, y) {
  ctx.save();
  ctx.strokeStyle = "rgba(0,0,230,0.4)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(x + 0.5, 0);
  ctx.lineTo(x + 0.5, ctx.canvas.height);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, y + 0.5);
  ctx.lineTo(ctx.canvas.width, y + 0.5);
  ctx.stroke();
  ctx.restore();
}
