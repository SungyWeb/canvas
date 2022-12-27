import { windowToCanvas } from "./common.js";

export class TextCursor {
  /**
   * 光标
   * @param {int} width 光标宽度 默认2
   * @param {color} fillStyle
   */
  constructor(ctx, width, fillStyle) {
    /** @type {CanvasRenderingContext2D} */
    this.ctx = ctx;
    this.fillStyle = fillStyle;
    this.width = width || 2;
    this.height = 0;
    this.left = 0;
    this.top = 0;
    this.blinkTimer1 = null;
    this.blinkTimer2 = null;
  }
  _getHeight() {
    const w = this.ctx.measureText("M").width;
    return Math.ceil(w + w / 6);
  }
  createPath() {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.rect(this.left, this.top, this.width, this.height);
  }
  /** 画光标 */
  draw(loc) {
    const ctx = this.ctx;

    // 每次都要获取高度 字号可能会变
    this.height = this._getHeight();

    ctx.save();

    this.left = Math.round(loc.x);
    this.top = Math.round(loc.y - this.height);

    this.createPath();
    ctx.fillStyle = this.fillStyle;
    ctx.fill();
    ctx.restore();
  }

  erase(imageData) {
    this.ctx.putImageData(
      imageData,
      0,
      0,
      this.left,
      this.top,
      this.width,
      this._getHeight()
    );
  }
  // blink(loc) {
  //   if (this.blinkTimer1) {
  //     clearInterval(this.blinkTimer1);
  //   }
  //   if (this.blinkTimer2) {
  //     clearTimeout(this.blinkTimer2);
  //   }
  //   if (this.imageData) {
  //     this.erase();
  //   }
  //   this.draw(loc);
  //   this.blinkTimer1 = setInterval(() => {
  //     this.erase();
  //     this.blinkTimer2 = setTimeout(() => this.draw(loc), 300);
  //   }, 700 + 300);
  // }
}

export class TextLine {
  constructor(ctx, x, y) {
    /** @type {CanvasRenderingContext2D} */
    this.ctx = ctx;
    this.left = x;
    this.top = y;
    this.text = "";
    this.caret = 0;
  }
  insert(text) {
    this.text =
      this.text.substring(0, this.caret) +
      text +
      this.text.substring(this.caret);
  }
  removeCharactBeforCaret() {
    if (this.caret === 0) return;
    this.text =
      this.text.substring(0, this.caret - 1) + this.text.substring(this.caret);
    this.caret--;
  }
  getWidth() {
    return this.ctx.measureText(this.text).width;
  }
  getHeight() {
    const w = this.ctx.measureText("M").width;
    return Math.ceil(w + w / 6);
  }
  draw() {
    this.ctx.save();
    this.ctx.textAlign = "start";
    this.ctx.textBaseline = "bottom";
    this.ctx.strokeText(this.text, this.left, this.top);
    this.ctx.fillText(this.text, this.left, this.top);
    this.ctx.restore();
  }
  erase(imageData) {
    this.ctx.putImageData(imageData, 0, 0);
  }
}

const CursorShowMs = 700,
  CursorHideMs = 300;
export default class TextEditor {
  constructor(ctx) {
    /** @type {CanvasRenderingContext2D} */
    this.ctx = ctx;
    /** @type {HTMLCanvasElement} */
    this.el = ctx.canvas;
    /** @type {TextCursor} */
    this.cursor = new TextCursor(this.ctx, 2, "red");
    /** @type {ImageData} */
    this.imageData = null;

    this.blinking = false; // 闪烁中
    this.blinkTimer = {
      // 闪烁的定时器
      interval: null,
      timeout: null,
    };

    this.lines = [];

    this._saveSurface();

    this._addEventListener();
  }
  _addEventListener() {
    this.el.addEventListener("mousedown", (e) => {
      // 画光标
      const loc = windowToCanvas(e);
      this.blinking = true;
      this._saveSurface();
      this._blinkCursor(loc);
      const line = new TextLine(this.ctx, this.cursor.left, this.cursor.top);
      this.lines.push(line);
    });

    document.addEventListener("keydown", (e) => {
      const key = e.key;
      if (key !== "Backspace" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();

        const loc = windowToCanvas(e);
        const line = this.lines[this.lines.length - 1];
        line.erase(this.imageData);
        line.insert(key);

        this._blinkCursor({
          x: line.left + line.getWidth(),
          y: line.top,
        });
        const c = this.ctx;
        c.save();
        c.shadowColor = "rgba(0,0,0,0.5)";
        c.shadowOffsetX = 1;
        c.shadowOffsetY = 1;
        c.shadowBlur = 2;
        line.draw();
        c.restore();
      }
    });
  }

  _saveSurface() {
    this.imageData = this.ctx.getImageData(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
  }

  _blinkCursor(loc) {
    if (this.blinkTimer.interval) clearInterval(this.blinkTimer.interval);
    if (this.blinkTimer.timeout) clearTimeout(this.blinkTimer.timeout);
    this.cursor.erase(this.imageData);
    this.cursor.draw(loc);
    this.blinkTimer.interval = setInterval(() => {
      this.cursor.erase(this.imageData);
      this.blinkTimer.timeout = setTimeout(
        () => this.cursor.draw(loc),
        CursorHideMs
      );
    }, CursorShowMs + CursorHideMs);
  }

  blur() {
    this.blinking = false; // 此时不再输入
  }
}
