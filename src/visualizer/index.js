import React from 'react';
import VisualizerBase from '@selia/visualizer';

import ImageVisualizerToolbar from './ImageVisualizerToolbar';
import {
  NAME, VERSION, DESCRIPTION, CONFIGURATION_SCHEMA,
} from './ImageVisualizerInfo';


const MAX_SCALE = 50;
const MIN_SCALE = 0.5;
const SCALE_FACTOR = 0.05;
const HISTORY_LENGHT = 20;

const MOVING = 'moving';
const ZOOMING = 'zooming';


class ImageVisualizer extends VisualizerBase {
  name = NAME;

  version = VERSION;

  description = DESCRIPTION;

  configurationSchema = CONFIGURATION_SCHEMA;

  init() {
    this.canvas.style.cssText += '-moz-box-shadow: inset 0 0 7px #404040;'
      + '-webkit-box-shadow: inset 0 0 7px #404040;'
      + 'box-shadow: inset 0 0 7px #404040;'
      + 'background-color: gray';

    this.ctx = this.canvas.getContext('2d');
    this.image = new Image();
    this.image.src = this.getItemUrl();

    this.stateHistory = [];
    this.toolbar = React.createRef();

    this.last = this.createPoint(0.5, 0.5);
    this.ratio = 1;
    this.imgSize = null;

    this.state = MOVING;

    this.config = {
      scale: 1.0,
      xOffset: 0,
      yOffset: 0,
      rotation: 0,
    };

    this.dragging = {
      point: null,
      active: false,
    };

    this.zooming = {
      start: null,
      end: null,
      active: false,
    };

    this.draw();

    this.image.onload = () => {
      this.imgSize = this.getImgSize();
      this.ratio = this.getRatio();
      this.ready = true;
    };
  }

  saveState() {
    this.stateHistory.push({ ...this.config });

    if (this.stateHistory.length > HISTORY_LENGHT) {
      this.stateHistory.shift();
    }
  }

  restoreState() {
    if (this.stateHistory.length > 0) {
      this.setConfig(this.stateHistory.pop());
    } else {
      this.resetConfig();
    }

    this.draw();
    this.emitUpdateEvent();
  }

  discardState() {
    if (this.stateHistory.length > 0) {
      this.stateHistory.pop();
    }
  }

  draw() {
    if (!this.ready) {
      this.drawLoading();
      return;
    }

    this.clear();
    this.setTransformFromState();
    this.drawImage();

    if (this.state === ZOOMING && this.zooming.active) {
      this.drawZoomRect();
    }
  }

  drawLoading(timestamp) {
    const { width, height } = this.canvas;

    if (this.ready) {
      this.draw();
      return;
    }

    this.clear();

    let shift = 0;
    if (timestamp !== null) {
      shift = timestamp / 300;
    }

    const angle = Math.PI / 2;
    const innerRadius = 20;
    const outerRadius = 30;

    this.ctx.beginPath();
    this.ctx.arc(width / 2, height / 2, innerRadius, shift, shift + angle);
    this.ctx.arc(width / 2, height / 2, outerRadius, shift + angle, shift, true);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(width / 2, height / 2, innerRadius, shift + 2 * angle, shift + 3 * angle);
    this.ctx.arc(width / 2, height / 2, outerRadius, shift + 3 * angle, shift + 2 * angle, true);
    this.ctx.fill();

    requestAnimationFrame((time) => this.drawLoading(time));
  }

  drawImage() {
    const { widthRel, heightRel } = this.imgSize;
    this.ctx.drawImage(this.image, -widthRel / 2, -heightRel / 2, widthRel, heightRel);
  }

  drawZoomRect() {
    const start = this.transformCanvasToPoint(this.zooming.start);
    const end = this.transformCanvasToPoint(this.zooming.end);

    this.ctx.strokeStyle = 'red';
    this.ctx.lineWidth = 0.001;
    this.ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
  }

  onWindowResize() {
    this.adjustSize();
    this.ratio = this.getRatio();
    this.draw();
    this.emitUpdateEvent();
  }

  setTransformFromState() {
    const { width, height } = this.canvas;
    const { scale, xOffset, yOffset, rotation } = this.config;

    const xShift = (width / 2) + (xOffset * width);
    const yShift = (height / 2) + (yOffset * height);

    const ratio = this.ratio * scale;
    const radians = (rotation * Math.PI) / 180;

    this.ctx.setTransform(
      Math.cos(radians) * ratio,
      Math.sin(radians) * ratio,
      -Math.sin(radians) * ratio,
      Math.cos(radians) * ratio,
      xShift,
      yShift,
    );
  }

  setState(state) {
    this.state = state;
  }

  getEvents() {
    return {
      mousedown: this.onMouseDown.bind(this),
      mousemove: this.onMouseMove.bind(this),
      mouseup: this.onMouseUp.bind(this),
      mouseout: this.onMouseOut.bind(this),
      DOMMouseScroll: this.onMouseScroll.bind(this),
      mousewheel: this.onMouseScroll.bind(this),
    };
  }

  onMouseOut() {
    if (this.state === MOVING) {
      this.dragging.point = null;
    }
  }

  onMouseDown(event) {
    this.last = this.getMouseEventPosition(event);

    this.canvasToPoint(this.last);

    if (this.state === MOVING) {
      this.dragging.point = this.last;
      this.dragging.active = false;
      this.saveState();
      return;
    }

    if (this.state === ZOOMING) {
      this.zooming.start = this.last;
    }
  }

  onMouseMove(event) {
    this.last = this.getMouseEventPosition(event);

    if (this.state === MOVING && this.dragging.point) {
      this.translate(
        this.last.x - this.dragging.point.x,
        this.last.y - this.dragging.point.y,
      );

      this.dragging.active = true;
      this.dragging.point = this.last;

      this.draw();
      this.emitUpdateEvent();
      return;
    }

    if (this.state === ZOOMING && this.zooming.start) {
      this.zooming.end = this.last;
      this.zooming.active = true;
      this.draw();
    }
  }

  onMouseUp(event) {
    if (this.state === MOVING) {
      this.dragging.point = null;
      if (!this.dragging.active) {
        this.discardState();
        this.zoom(event.shiftKey ? -1 : 1, this.last);
      }
      return;
    }

    if (this.state === ZOOMING) {
      this.saveState();
      this.zoomOnRect();
      this.zooming = {
        start: null,
        end: null,
        active: false,
      };
      this.draw();
      this.emitUpdateEvent();
    }
  }

  onMouseScroll(event) {
    let delta = 0;
    if (event.wheelDelta) {
      delta = event.wheelDelta / 80;
    } else if (event.detail) {
      delta = -event.detail;
    }

    if (delta) {
      this.saveState();
      this.zoom(delta, this.last);
    }

    event.preventDefault();
  }

  getImgSize() {
    const { height, width } = this.image;
    const factor = Math.max(height, width);

    return {
      height,
      width,
      factor,
      heightRel: height / factor,
      widthRel: width / factor,
    };
  }

  getRatio() {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    const { width, height, factor } = this.imgSize;

    const yRatio = canvasHeight / height;
    const xRatio = canvasWidth / width;
    return yRatio < xRatio ? yRatio * factor : xRatio * factor;
  }

  clear() {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }

  resetConfig() {
    this.config = {
      scale: 1,
      xOffset: 0,
      yOffset: 0,
      rotation: 0,
    };
  }

  centerImage() {
    this.resetConfig();
    this.draw();
    this.emitUpdateEvent();
  }

  renderToolbar() {
    return (
      <ImageVisualizerToolbar
        active={this.active}
        activator={this.activator}
        state={this.state}
        setState={(state) => this.setState(state)}
        home={() => this.centerImage()}
        restoreState={() => this.restoreState()}
        zoom={(clicks) => this.zoom(clicks, this.getCenterPoint())}
        ref={(ref) => { this.toolbar = ref; }}
      />
    );
  }

  getCenterPoint() {
    return this.createPoint(0.5, 0.5);
  }

  getItemUrl() {
    return this.itemInfo.url;
  }

  setScale(scale) {
    const prevScale = this.config.scale;
    const newScale = Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE);
    const ratio = newScale / prevScale;
    this.config.scale = newScale;
    this.config.xOffset *= ratio;
    this.config.yOffset *= ratio;
  }

  setXOffset(xOffset) {
    this.config.xOffset = xOffset;
  }

  setYOffset(yOffset) {
    this.config.yOffset = yOffset;
  }

  setRotation(rotation) {
    this.config.rotation = rotation % 360;
  }

  zoom(clicks, point) {
    const { scale, xOffset, yOffset } = this.config;
    const factor = SCALE_FACTOR * clicks;

    const pointXOffset = -(point.x - 0.5 - xOffset) * (factor / scale);
    const pointYOffset = -(point.y - 0.5 - yOffset) * (factor / scale);

    if (factor + scale > MAX_SCALE) return;
    if (factor + scale < MIN_SCALE) return;

    this.config.scale = factor + scale;
    this.translate(pointXOffset, pointYOffset);

    this.draw();
    this.emitUpdateEvent();
  }

  zoomOnRect() {
    const { start, end } = this.zooming;
    const { scale } = this.config;
    const center = this.createPoint(
      (start.x + end.x) / 2,
      (start.y + end.y) / 2,
    );

    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);

    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    const yFactor = canvasHeight / height;
    const xFactor = canvasWidth / width;

    const factor = yFactor < xFactor ? height : width;
    const newScale = scale / factor;

    this.centerOnPoint(center);
    this.setScale(newScale);
    this.setState(MOVING);

    if (this.toolbar.setState) {
      this.toolbar.setState({ state: MOVING });
    }
  }

  centerOnPoint(point) {
    const { width, height } = this.imgSize;
    const center = this.pointToCanvas(this.createPoint(
      width / 2,
      height / 2,
    ));

    const x = center.x - point.x;
    const y = center.y - point.y;

    this.setXOffset(x);
    this.setYOffset(y);
  }

  translate(x, y) {
    const { xOffset, yOffset } = this.config;
    this.setXOffset(xOffset + x);
    this.setYOffset(yOffset + y);
  }

  transformCanvasToPoint(p) {
    const transform = this.ctx.getTransform();
    const canvasPoint = this.coordsToPixel(p);
    return canvasPoint.matrixTransform(transform.invertSelf());
  }

  rotate(angle) {
    this.setRotation(this.config.rotation + angle);
  }

  canvasToPoint(p) {
    const { width, height, factor } = this.imgSize;
    const pt = this.transformCanvasToPoint(p);

    pt.x += width / (2 * factor);
    pt.y += height / (2 * factor);

    pt.x *= factor;
    pt.y *= factor;

    return pt;
  }

  pointToCanvas(p) {
    const { widthRel, heightRel, factor } = this.imgSize;
    const transform = this.ctx.getTransform();

    const pt = this.createPoint(
      p.x / factor - widthRel / 2,
      p.y / factor - heightRel / 2,
    );
    const pixels = pt.matrixTransform(transform);

    return this.pixelToCoords(pixels);
  }

  validatePoints(p) {
    const x = Math.min(Math.max(p.x, 0), this.image.width);
    const y = Math.min(Math.max(p.y, 0), this.image.height);
    return this.createPoint(x, y);
  }

  getConfig() {
    return this.config;
  }

  setConfig(config) {
    this.config = config;
  }
}


export default ImageVisualizer;
