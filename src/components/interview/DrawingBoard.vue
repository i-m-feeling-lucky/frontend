<template>
  <div>
    <div style="width:50px;float:left;">
      <ul id="toolsul" class="tools">
        <li id="toolsPencil" data-type="pen" class="active">
          <i
            class="icon-tools icon-pen-select"
            data-default="icon-tools icon-pen-black"
          ></i>
        </li>
        <li data-type="arrow">
          <i
            class="icon-tools icon-arrow-black"
            data-default="icon-tools icon-arrow-black"
          ></i>
        </li>
        <li data-type="line">
          <i
            class="icon-tools icon-line-black"
            data-default="icon-tools icon-line-black"
          ></i>
        </li>
        <li data-type="dottedline">
          <i
            class="icon-tools icon-dottedline-black"
            data-default="icon-tools icon-dottedline-black"
          ></i>
        </li>
        <li data-type="circle">
          <i
            class="icon-tools icon-circle-black"
            data-default="icon-tools icon-circle-black"
          ></i>
        </li>
        <li data-type="ellipse">
          <i
            class="icon-tools icon-ellipse-black"
            data-default="icon-tools icon-ellipse-black"
          ></i>
        </li>
        <li class="hide" data-type="square">
          <i
            class="icon-tools icon-square-black"
            data-default="icon-tools icon-square-black"
          ></i>
        </li>
        <li data-type="rectangle">
          <i
            class="icon-tools icon-rectangle-black"
            data-default="icon-tools icon-rectangle-black"
          ></i>
        </li>
        <li data-type="rightangle">
          <i
            class="icon-tools icon-rightangle-black"
            data-default="icon-tools icon-rightangle-black"
          ></i>
        </li>
        <li data-type="equilateral">
          <i
            class="icon-tools icon-equilateral-black"
            data-default="icon-tools icon-equilateral-black"
          ></i>
        </li>
        <li class="hide" data-type="isosceles">
          <i
            class="icon-tools icon-isosceles-black"
            data-default="icon-tools icon-isosceles-black"
          ></i>
        </li>
        <li data-type="text">
          <i
            class="icon-tools icon-text-black"
            data-default="icon-tools icon-text-black"
          ></i>
        </li>
        <li data-type="remove">
          <i
            class="icon-tools icon-remove-black"
            data-default="icon-tools icon-remove-black"
          ></i>
        </li>
      </ul>
    </div>
    <div style="margin-left: 52px;">
      <canvas id="c"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-underscore-dangle */
import Vue from 'vue';
import jQuery from 'jquery';
import { fabric } from 'fabric';

export default Vue.extend({
  name: 'DrawingBoard',
  props: ['value'],
  data() {
    return {
      mouseFrom: {} as any,
      mouseTo: {} as any,
      drawType: null as any,
      textbox: null as any,
      drawWidth: 2, // 笔触宽度
      color: '#E34F51', // 画笔颜色
      drawingObject: null as any, // 当前绘制对象
      isDrawing: false, // 绘制状态
      canvas: null as any,
    };
  },

  methods: {
    drawArrow(
      fromX: number,
      fromY: number,
      toX: number,
      toY: number,
      theta: number,
      headlen: number,
    ) {
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
    },

    // 绘画方法
    drawing() {
      if (this.drawingObject) {
        this.canvas.remove(this.drawingObject);
      }
      let canvasObject = null;
      switch (this.drawType) {
        case 'arrow': // 箭头
          canvasObject = new fabric.Path(
            this.drawArrow(
              this.mouseFrom.x,
              this.mouseFrom.y,
              this.mouseTo.x,
              this.mouseTo.y,
              30,
              30,
            ),
            {
              stroke: this.color,
              fill: 'rgba(255,255,255,0)',
              strokeWidth: this.drawWidth,
            },
          );
          break;
        case 'line': // 直线
          canvasObject = new fabric.Line(
            [
              this.mouseFrom.x,
              this.mouseFrom.y,
              this.mouseTo.x,
              this.mouseTo.y,
            ],
            {
              stroke: this.color,
              strokeWidth: this.drawWidth,
            },
          );
          break;
        case 'dottedline': // 虚线
          canvasObject = new fabric.Line(
            [
              this.mouseFrom.x,
              this.mouseFrom.y,
              this.mouseTo.x,
              this.mouseTo.y,
            ],
            {
              strokeDashArray: [3, 1],
              stroke: this.color,
              strokeWidth: this.drawWidth,
            },
          );
          break;
        case 'circle': {
          // 正圆
          const left = this.mouseFrom.x;
          const top = this.mouseFrom.y;
          const radius = Math.sqrt(
            (this.mouseTo.x - left) * (this.mouseTo.x - left)
                + (this.mouseTo.y - top) * (this.mouseTo.y - top),
          ) / 2;
          canvasObject = new fabric.Circle({
            left,
            top,
            stroke: this.color,
            fill: 'rgba(255, 255, 255, 0)',
            radius,
            strokeWidth: this.drawWidth,
          });
          break;
        }
        case 'ellipse': {
          // 椭圆
          const left = this.mouseFrom.x;
          const top = this.mouseFrom.y;
          canvasObject = new fabric.Ellipse({
            left,
            top,
            stroke: this.color,
            fill: 'rgba(255, 255, 255, 0)',
            originX: 'center',
            originY: 'center',
            rx: Math.abs(left - this.mouseTo.x),
            ry: Math.abs(top - this.mouseTo.y),
            strokeWidth: this.drawWidth,
          });
          break;
        }
        case 'rectangle': {
          // 长方形
          const left = this.mouseFrom.x;
          const top = this.mouseFrom.y;
          const path = `M ${this.mouseFrom.x} ${this.mouseFrom.y} L ${this.mouseTo.x} ${this.mouseFrom.y} L ${this.mouseTo.x} ${this.mouseTo.y} L ${this.mouseFrom.x} ${this.mouseTo.y} L ${this.mouseFrom.x} ${this.mouseFrom.y} z`;
          canvasObject = new fabric.Path(path, {
            left,
            top,
            stroke: this.color,
            strokeWidth: this.drawWidth,
            fill: 'rgba(255, 255, 255, 0)',
          });
          // 也可以使用fabric.Rect
          break;
        }
        case 'rightangle': {
          // 直角三角形
          const left = this.mouseFrom.x;
          const top = this.mouseFrom.y;
          const path = `M ${this.mouseFrom.x} ${this.mouseFrom.y} L ${this.mouseFrom.x} ${this.mouseTo.y} L ${this.mouseTo.x} ${this.mouseTo.y} z`;
          canvasObject = new fabric.Path(path, {
            left,
            top,
            stroke: this.color,
            strokeWidth: this.drawWidth,
            fill: 'rgba(255, 255, 255, 0)',
          });
          break;
        }
        case 'equilateral': {
          // 等边三角形
          const height = this.mouseTo.y - this.mouseFrom.y;
          canvasObject = new fabric.Triangle({
            top: this.mouseFrom.y,
            left: this.mouseFrom.x,
            width: Math.sqrt(height ** 2 + (height / 2.0) ** 2),
            height,
            stroke: this.color,
            strokeWidth: this.drawWidth,
            fill: 'rgba(255,255,255,0)',
          });
          break;
        }
        case 'text':
          this.textbox = new fabric.Textbox('', {
            left: this.mouseFrom.x,
            top: this.mouseFrom.y,
            width: 150,
            fontSize: 18,
            borderColor: '#2c2c2c',
            fill: this.color,
            hasControls: false,
          });
          this.canvas.add(this.textbox);
          this.textbox.enterEditing();
          break;
        case 'remove':
          break;
        default:
          break;
      }
      if (canvasObject) {
        this.canvas.add(canvasObject);
        this.drawingObject = canvasObject;
      }
    },
  },

  mounted() {
    // 初始化画板
    this.canvas = new (fabric as any).Canvas('c', {
      isDrawingMode: true,
      skipTargetFind: true,
      selectable: false,
      selection: false,
      width: 1920,
      height: 1080,
      // backgroundColor: 'green',
    });
    this.canvas.freeDrawingBrush.color = this.color; // 设置自由绘颜色
    this.canvas.freeDrawingBrush.width = this.drawWidth;

    // 绑定画板事件
    this.canvas.on('mouse:down', (options: any) => {
      this.mouseFrom.x = options.e.offsetX;
      this.mouseFrom.y = options.e.offsetY;
      this.isDrawing = true;
      if (this.drawType === 'text') {
        this.drawing();
      }
    });
    this.canvas.on('mouse:up', (options: any) => {
      this.mouseTo.x = options.e.offsetX;
      this.mouseTo.y = options.e.offsetY;
      this.drawingObject = null;
      this.isDrawing = false;
      this.$emit('input', this.canvas.toJSON());
    });
    this.canvas.on('mouse:move', (options: any) => {
      if (!this.isDrawing || this.drawType === 'text') {
        return;
      }
      this.mouseTo.x = options.e.offsetX;
      this.mouseTo.y = options.e.offsetY;
      this.drawing();
    });

    this.canvas.on('selection:created', (e: any) => {
      if (e.target._objects) {
        // 多选删除
        e.target._objects.forEach((x: any) => {
          this.canvas.remove(x);
        });
        this.canvas.discardActiveObject();
      } else {
        // 单选删除
        this.canvas.remove(e.target);
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this; // TODO
    // 绑定工具事件
    jQuery('#toolsul')
      .find('li')
      .on('click', function () {
        // 设置样式
        jQuery('#toolsul')
          .find('li>i')
          .each(function () {
            jQuery(this).attr(
              'class',
              (jQuery(this) as any).attr('data-default'),
            );
          });
        jQuery(this)
          .addClass('active')
          .siblings()
          .removeClass('active');
        jQuery(this)
          .find('i')
          .attr(
            'class',
            (jQuery(this) as any)
              .find('i')
              .attr('class')
              .replace('black', 'select'),
          );
        that.drawType = jQuery(this).attr('data-type');
        that.canvas.isDrawingMode = false;
        if (that.textbox) {
          // 退出文本编辑状态
          that.textbox.exitEditing();
          that.textbox = null;
        }
        if (that.drawType === 'pen') {
          that.canvas.isDrawingMode = true;
        } else if (that.drawType === 'remove') {
          that.canvas.selection = true;
          that.canvas.skipTargetFind = false;
          that.canvas.selectable = true;
        } else {
          that.canvas.skipTargetFind = true; // 画板元素不能被选中
          that.canvas.selection = false; // 画板不显示选中
        }
      });
  },

  watch: {
    value(val) {
      this.canvas.loadFromJSON(val, this.canvas.renderAll.bind(this.canvas));
    },
  },
});
</script>

<style>
.tools {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tools li {
  width: 100%;
  height: 50px;
  text-align: center;
  line-height: 50px;
  font-size: 28px;
  border-top: #dad7d9 solid 1px;
  background: #fefefe;
  cursor: pointer;
  position: relative;
}

.tools li:hover {
  background: #f2f1f2;
}

.tools li.active {
  background: #e34f51;
}

.hide {
  display: none;
}

.icon-tools {
  display: inline-block;
  width: 28px;
  height: 28px;
  background-image: url('../../assets/tools-28.png');
  background-repeat: no-repeat;
  margin-top: 10px;
}

.icon-color-gray {
  background-position: -0px -0px;
}

.icon-color-red {
  background-position: -28px -0px;
}

.icon-color-black {
  background-position: -56px -0px;
}

.icon-color-blue {
  background-position: -84px -0px;
}

.icon-color-select {
  background-position: -112px -0px;
}

.icon-eye-black {
  background-position: -140px -0px;
}

.icon-eye-select {
  background-position: -168px -0px;
}

.icon-noeye-black {
  background-position: -196px -0px;
}

.icon-noeye-select {
  background-position: -0px -28px;
}

.icon-grids-black {
  background-position: -28px -28px;
}

.icon-grids-select {
  background-position: -56px -28px;
}

.icon-nogrids-black {
  background-position: -84px -28px;
}

.icon-nogrids-select {
  background-position: -112px -28px;
}

.icon-pen-black {
  background-position: -140px -28px;
}

.icon-pen-select {
  background-position: -168px -28px;
}

.icon-move-black {
  background-position: -196px -28px;
}

.icon-move-select {
  background-position: -0px -56px;
}

.icon-text-black {
  background-position: -28px -56px;
}

.icon-text-select {
  background-position: -56px -56px;
}

.icon-dottedline-arrow-black {
  background-position: -84px -56px;
}

.icon-dottedline-arrow-select {
  background-position: -112px -56px;
}

.icon-line-black {
  background-position: -140px -56px;
}

.icon-line-select {
  background-position: -168px -56px;
}

.icon-dottedline-black {
  background-position: -196px -56px;
}

.icon-dottedline-select {
  background-position: -0px -84px;
}

.icon-arrow-black {
  background-position: -28px -84px;
}

.icon-arrow-select {
  background-position: -56px -84px;
}

.icon-circle-black {
  background-position: -84px -84px;
}

.icon-circle-select {
  background-position: -112px -84px;
}

.icon-ellipse-black {
  background-position: -140px -84px;
}

.icon-ellipse-select {
  background-position: -168px -84px;
}

.icon-square-black {
  background-position: -196px -84px;
}

.icon-square-select {
  background-position: -0px -112px;
}

.icon-rectangle-black {
  background-position: -28px -112px;
}

.icon-rectangle-select {
  background-position: -56px -112px;
}

.icon-rightangle-black {
  background-position: -84px -112px;
}

.icon-rightangle-select {
  background-position: -112px -112px;
}

.icon-equilateral-black {
  background-position: -140px -112px;
}

.icon-equilateral-select {
  background-position: -168px -112px;
}

.icon-isosceles-black {
  background-position: -196px -112px;
}

.icon-isosceles-select {
  background-position: -0px -140px;
}

.icon-remove-black {
  background-position: -84px -140px;
}

.icon-remove-select {
  background-position: -112px -140px;
}
</style>
