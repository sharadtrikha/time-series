import * as d3 from 'd3';

interface Margin {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export class SVGUtils {
  width: number;
  height: number;
  svg: any;

  constructor(margin: Margin) {
    // this.svg = new SVGElement();
    this.width = 1000 - margin.left - margin.right;
    this.height = 200 - margin.top - margin.bottom;
    this.svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', this.width + margin.left + margin.right)
      .attr('height', this.height + margin.top + margin.bottom);
  }
}
