/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-use-before-define */
window.onload = () => {
  // 变量声明
  const mouseFrom = {};
  const mouseTo = {};
  let drawType = null;
  let textbox = null;
  const drawWidth = 2; // 笔触宽度
  const color = '#E34F51'; // 画笔颜色
  let drawingObject = null; // 当前绘制对象
  let isDrawing = false; // 绘制状态

  // 初始化画板
  const canvas = new fabric.Canvas('c', {
    isDrawingMode: true,
    skipTargetFind: true,
    selectable: false,
    selection: false,
    width: 1920,
    height: 1080,
  });

  canvas.freeDrawingBrush.color = color; // 设置自由绘颜色
  canvas.freeDrawingBrush.width = drawWidth;

  // 绑定画板事件
  canvas.on('mouse:down', (options) => {
    mouseFrom.x = options.e.offsetX;
    mouseFrom.y = options.e.offsetY;
    isDrawing = true;
    if (drawType === 'text') {
      drawing();
    }
  });
  canvas.on('mouse:up', (options) => {
    mouseTo.x = options.e.offsetX;
    mouseTo.y = options.e.offsetY;
    drawingObject = null;
    isDrawing = false;
  });
  canvas.on('mouse:move', (options) => {
    if (!isDrawing || drawType === 'text') {
      return;
    }
    mouseTo.x = options.e.offsetX;
    mouseTo.y = options.e.offsetY;
    drawing();
  });

  canvas.on('selection:created', (e) => {
    if (e.target._objects) {
    // 多选删除
      e.target._objects.forEach((x) => {
        canvas.remove(x);
      });
      canvas.discardActiveObject();
    } else {
      // 单选删除
      canvas.remove(e.target);
    }
  });

  // 绑定工具事件
  jQuery('#toolsul')
    .find('li')
    .on('click', function () {
      // 设置样式
      jQuery('#toolsul')
        .find('li>i')
        .each(function () {
          jQuery(this).attr('class', jQuery(this).attr('data-default'));
        });
      jQuery(this)
        .addClass('active')
        .siblings()
        .removeClass('active');
      jQuery(this)
        .find('i')
        .attr(
          'class',
          jQuery(this)
            .find('i')
            .attr('class')
            .replace('black', 'select'),
        );
      drawType = jQuery(this).attr('data-type');
      canvas.isDrawingMode = false;
      if (textbox) {
        // 退出文本编辑状态
        textbox.exitEditing();
        textbox = null;
      }
      if (drawType === 'pen') {
        canvas.isDrawingMode = true;
      } else if (drawType === 'remove') {
        canvas.selection = true;
        canvas.skipTargetFind = false;
        canvas.selectable = true;
      } else {
        canvas.skipTargetFind = true; // 画板元素不能被选中
        canvas.selection = false; // 画板不显示选中
      }
    });

  // 绘画方法
  function drawing() {
    if (drawingObject) {
      canvas.remove(drawingObject);
    }
    let canvasObject = null;
    switch (drawType) {
      case 'arrow': // 箭头
        canvasObject = new fabric.Path(
          drawArrow(mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y, 30, 30),
          {
            stroke: color,
            fill: 'rgba(255,255,255,0)',
            strokeWidth: drawWidth,
          },
        );
        break;
      case 'line': // 直线
        canvasObject = new fabric.Line([mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y], {
          stroke: color,
          strokeWidth: drawWidth,
        });
        break;
      case 'dottedline': // 虚线
        canvasObject = new fabric.Line([mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y], {
          strokeDashArray: [3, 1],
          stroke: color,
          strokeWidth: drawWidth,
        });
        break;
      case 'circle': { // 正圆
        const left = mouseFrom.x;
        const top = mouseFrom.y;
        const radius = Math.sqrt(
          (mouseTo.x - left) * (mouseTo.x - left) + (mouseTo.y - top) * (mouseTo.y - top),
        ) / 2;
        canvasObject = new fabric.Circle({
          left,
          top,
          stroke: color,
          fill: 'rgba(255, 255, 255, 0)',
          radius,
          strokeWidth: drawWidth,
        });
        break;
      }
      case 'ellipse': { // 椭圆
        const left = mouseFrom.x;
        const top = mouseFrom.y;
        canvasObject = new fabric.Ellipse({
          left,
          top,
          stroke: color,
          fill: 'rgba(255, 255, 255, 0)',
          originX: 'center',
          originY: 'center',
          rx: Math.abs(left - mouseTo.x),
          ry: Math.abs(top - mouseTo.y),
          strokeWidth: drawWidth,
        });
        break;
      }
      case 'rectangle': { // 长方形
        const left = mouseFrom.x;
        const top = mouseFrom.y;
        const path = `M ${mouseFrom.x} ${mouseFrom.y} L ${mouseTo.x} ${mouseFrom.y} L ${mouseTo.x} ${mouseTo.y} L ${mouseFrom.x} ${mouseTo.y} L ${mouseFrom.x} ${mouseFrom.y} z`;
        canvasObject = new fabric.Path(path, {
          left,
          top,
          stroke: color,
          strokeWidth: drawWidth,
          fill: 'rgba(255, 255, 255, 0)',
        });
        // 也可以使用fabric.Rect
        break;
      }
      case 'rightangle': { // 直角三角形
        const left = mouseFrom.x;
        const top = mouseFrom.y;
        const path = `M ${mouseFrom.x} ${mouseFrom.y} L ${mouseFrom.x} ${mouseTo.y} L ${mouseTo.x} ${mouseTo.y} z`;
        canvasObject = new fabric.Path(path, {
          left,
          top,
          stroke: color,
          strokeWidth: drawWidth,
          fill: 'rgba(255, 255, 255, 0)',
        });
        break;
      }
      case 'equilateral': { // 等边三角形
        const height = mouseTo.y - mouseFrom.y;
        canvasObject = new fabric.Triangle({
          top: mouseFrom.y,
          left: mouseFrom.x,
          width: Math.sqrt(height ** 2 + (height / 2.0) ** 2),
          height,
          stroke: color,
          strokeWidth: drawWidth,
          fill: 'rgba(255,255,255,0)',
        });
        break;
      }
      case 'text':
        textbox = new fabric.Textbox('', {
          left: mouseFrom.x,
          top: mouseFrom.y,
          width: 150,
          fontSize: 18,
          borderColor: '#2c2c2c',
          fill: color,
          hasControls: false,
        });
        canvas.add(textbox);
        textbox.enterEditing();
        break;
      case 'remove':
        break;
      default:
        break;
    }
    if (canvasObject) {
      canvas.add(canvasObject);
      drawingObject = canvasObject;
    }
  }

  // 绘制箭头方法
  function drawArrow(fromX, fromY, toX, toY, theta, headlen) {
    // eslint-disable-next-line no-param-reassign
    theta = typeof theta !== 'undefined' ? theta : 30;
    // eslint-disable-next-line no-param-reassign
    headlen = typeof theta !== 'undefined' ? headlen : 10;
    // 计算各角度和对应的P2,P3坐标
    const angle = (Math.atan2(fromY - toY, fromX - toX) * 180) / Math.PI;
    const angle1 = ((angle + theta) * Math.PI) / 180;
    const angle2 = ((angle - theta) * Math.PI) / 180;
    const topX = headlen * Math.cos(angle1);
    const topY = headlen * Math.sin(angle1);
    const botX = headlen * Math.cos(angle2);
    const botY = headlen * Math.sin(angle2);
    let arrowX = fromX - topX;
    let arrowY = fromY - topY;
    let path = ` M ${fromX} ${fromY}`;
    path += ` L ${toX} ${toY}`;
    arrowX = toX + topX;
    arrowY = toY + topY;
    path += ` M ${arrowX} ${arrowY}`;
    path += ` L ${toX} ${toY}`;
    arrowX = toX + botX;
    arrowY = toY + botY;
    path += ` L ${arrowX} ${arrowY}`;
    return path;
  }
};
