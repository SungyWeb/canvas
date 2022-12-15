/**
 * 多边形对象
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x 中心x坐标
 * @param {number} y 中心y坐标
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
    x,
    y,
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
    this.x = x;
    this.y = y;
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
  getPoints() {
    let points = [],
      angle = this.startAngle || 0;

    for (let i = 0; i < this.sides; i++) {
      points.push(
        new Point(
          this.x + this.radius * Math.cos(angle),
          this.y - this.radius * Math.sin(angle)
        )
      );
      angle += (2 * Math.PI) / this.sides;
    }

    return points;
  }

  createPath() {
    const points = this.getPoints();
    /**
     * @type CanvasRenderingContext2D
     */
    const c = this.ctx;
    // 指示点
    // c.save();
    // c.beginPath();
    // c.arc(points[0].x, points[0].y, 5, 0, Math.PI * 2, false);
    // c.fillStyle = "red";
    // c.fill();
    // c.restore();

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
