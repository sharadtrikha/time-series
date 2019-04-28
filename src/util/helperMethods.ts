import * as d3 from 'd3';
import { Snapshot } from 'src/models/Snapshot';
import dateUtil from './dateUtils';

export const getMinElement = (data, timeFirst?: Date) => {
  const dateData = data.map((d: Snapshot) => new Date(d.timestamp));

  const finalData = dateData.filter((date: Date) => {
    if (timeFirst && dateUtil.isDateBefore(date, timeFirst)) {
      console.log(timeFirst, date);
      return;
    }
    return date;
  });

  return d3.min(finalData, (d: Date) => {
    // const date = new Date(d.timestamp);
    // return date;
    return d;
  });
};

export const getMaxElement = (data, timeFirst?: Date) => {
  return d3.max(data, (d: Snapshot) => {
    return new Date(d.timestamp);
  });
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
