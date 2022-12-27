# canvas

# 基础知识点

1. canvas 元素的背景色默认与父元素的背景色一致 [001.html](./examples/001.html)
2. canvas 默认大小为300*150
3. canvas 设置`width` `height`时一般不写单位`px`(虽然一般浏览器都允许)
4. canvas 的大小可以分为元素大小和画布大小。

  当设置元素的`width` `height`属性时，实际上是同时修改了元素大小和画布大小。

  如果通过css设置元素大小，并不会影响画布大小。此时canvas元素的大小不符合其绘图表面大小，浏览器会对绘图表面进行缩放，使其符合元素大小。

  `width` `height`可以取非负整数，前面可以加”+“和空格，但是后面**不能**加`px`

5. `save` 方法将当前的caves状态推送到一个保存canvas状态的堆栈顶部（这表示可用嵌套使用），包括当前的变换信息、剪辑区域以及所有绘图环境对象的属性，但不包过当前的路径或位图（路径只能通过`beginPath()`来重制路径，位图是canvas对象的属性，并不属于绘图环境。
6. `restore` 方法将canvas状态堆栈的顶部弹出，并设置为当前canvas状态。
7. **离屏canvas** 将背景或者不常变化的内容存储在一个或多个离屏canvas（通过`display:none`达到离屏效果）中，在通过`img`标签绘制到屏幕上，来提高程序性能
8. 向量运算 在力和运动中非常重要，要理解向量大小、单位向量、向量加减、向量点积
9. 动画速度 物体的运动频率不应该随着动画的帧速率而改变（这样会导致帧速率越高，动画越快）。

像素/帧 = X * Y / 1000

X = 毫秒/帧   Y = 像素/秒(速度)

10. 非零环绕 如果当前路径是循环的或包含多个子路径，当调用`fill()`方法时，canvas通过非零环绕规则进行是否填充的判断。

arc(x, y, r, start, end, 是否逆时针)

rect() 方法默认是顺时针，且不可修改

> 非零环绕 对于路径中任意给定的区域，从该区域内部画出一条足长的直线，然后初始化一个为0的计数器，沿着直线，如果是与路径的顺时针部分相交，则加1，如果与路径的逆时针部分相交，则减1；最终如果计数器**不是0浏览器会对该区域填充**，如果不是0，则不会填充。[002-非零环绕-圆环剪纸](./examples/002-%E9%9D%9E%E9%9B%B6%E7%8E%AF%E7%BB%95.html)

11. 坐标转换

这里需要注意的是 转换的是整个画布 而不是某个路径

+ rotate(angle) 按给定弧度旋转，顺时针从0度（x轴正方向，以左上角为中心）进行旋转 公式：

$$
  x' = x \times \cos(angle) - y \times \sin(angle)
$$
$$
  y' = y \times \cos(angle) + x \times \sin(angle)
$$

+ scale(x, y) 在x y方向上分别按给顶的数值倍数进行缩放 公式：

$$
  x' = x \times sx
$$
$$
  y' = y \times sy
$$

+ translate(x, y) 将坐标系中心点平移到(x, y)坐标位置

$$
  x' = x + dx
$$
$$
  y' = y + dy
$$



> scale(-1, 1) 可以将画布水平镜像； scale(1, -1) 可以垂直镜像

`transform(a, b, c, d, e, f)`和`setTransform(a, b, c, d, e, f)`都接受6参数，其<font color=red>***计算公式***</font>为：

$$
  x' = ax + cy + e
$$
$$
  y' = bx + dy + f
$$

运用上述公式

平移至 (5, 10) `transform(0, 0, 0, 0, 5, 10)`

$$
  x' = a \times x + c \times y + e = 0 + 0 + 5
$$

$$
  y' = b \times x + d \times y + f = 0 + 0 + 10
$$

缩放 x轴2倍 y轴3倍  `transform(2, 0, 0, 3, 0, 0)`

$$
  x' = a \times x + c \times y + e = 2 \times x + 0 + 0
$$

$$
  y' = b \times x + d \times y + f = 0 + 3 \times y + 0
$$

旋转45角度(`Math.PI/4`弧度) `transform(cons(angle), sin(angle), -sin(angle), cos(angle), 0, 0)`

$$
  x' = a \times x + c \times y + e = cos(angle) \times x -sin(angle) \times y + 0
$$

$$
  y' = b \times x + d \times y + f = sin(angle) \times x + cos(angle) \times y + 0
$$

> `transform`是累加的每次调用都是对当前坐标系的转换；`setTransform`是先将当前的变换重置，再执行变换

11. `measureText()` 用于测量文本的宽度， 一般用字母M测量当前设置下的宽度，再乘以字符长度，在调用之前要设置好文本的字体、字号等。文本的行高可以用宽度乘以一定比例计算得到，一般采用宽度的 1.2 倍作为高度