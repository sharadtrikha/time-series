import * as d3 from 'd3';
import { leftIconPath, rightIconPath } from './constants';

const commonMapper = d => {
  return new Date(d.timestamp);
};

export const getMinElement = data => {
  return d3.min(data, commonMapper);
};

export const getMaxElement = data => {
  return d3.max(data, commonMapper);
};

export const createArrowButton = ({
  svg,
  pathTransform,
  transform,
  onClick,
  backgroundPath
}) => {
  svg
    .append('path')
    .attr('d', backgroundPath)
    .style('pointer-events', 'none')
    .attr('transform', pathTransform);
  svg
    .append('circle')
    .attr('r', 20)
    .style('fill', 'blue')
    .style('opacity', 0.2)
    .attr('transform', transform)
    .style('cursor', 'pointer')
    .on('click', onClick);
};
