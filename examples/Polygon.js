/**
 * 多边形对象
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} centerX 中心x坐标
 * @param {number} centerY 中心y坐标
 * @param {number} radius 半径
 * @param {number} sides 边数，几边形
 * @param {number} startAngle 开始角度
 * @param {string} strokeStyle
 * @param {string} fillStyle
 * @param {boolean} filled 是否填充
 */
class Polygon {
  constructor(
    ctx,
    centerX,
    centerY,
    radius,
    sides,
    startAngle,
    strokeStyle,
    fillStyle,
    filled
  ) {
    if (sides < 3) {
      throw Error("sides 应大于等于3");
    }
    /**
     * @type CanvasRenderingContext2D
     */
    this.ctx = ctx;
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
    this.sides = sides;
    this.startAngle = startAngle;
    this.strokeStyle = strokeStyle;
    this.fillStyle = fillStyle;
    this.filled = filled;
  }
  /**
   * 获取每个顶点坐标
   * @returns Points[]
   */
  _getPoints() {
    let points = [],
      angle = this.startAngle || 0;

    for (let i = 0; i < this.sides; i++) {
      points.push(
        new Point(
          this.centerX + this.radius * Math.sin(angle),
          this.centerY - this.radius * Math.cos(angle)
        )
      );
      angle += (2 * Math.PI) / this.sides;
    }

    return points;
  }

  _createPath() {
    const points = this._getPoints();
    /**
     * @type CanvasRenderingContext2D
     */
    const c = this.ctx;

    c.beginPath();
    c.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      const p = points[i];
      c.lineTo(p.x, p.y);
    }
    c.closePath();
  }
  stroke() {
    /**
     * @type CanvasRenderingContext2D
     */
    const c = this.ctx;
    c.save();
    this._createPath();
    c.strokeStyle = this.strokeStyle;
    c.stroke();
    c.restore();
  }
  fill() {
    /**
     * @type CanvasRenderingContext2D
     */
    const c = this.ctx;
    c.save();
    this._createPath();
    c.fillStyle = this.fillStyle;
    c.fill();
    c.restore();
  }
  move(x, y) {
    this.x = x;
    this.y = y;
  }
}

/**
 * 坐标对象
 * @param {number} x x坐标
 * @param {number} y y坐标
 */
function Point(x, y) {
  this.x = x;
  this.y = y;
}

export default Polygon;
