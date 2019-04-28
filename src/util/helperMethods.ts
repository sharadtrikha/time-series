import * as d3 from 'd3';
import { Snapshot } from 'src/models/Snapshot';
import dateUtil from './dateUtils';

export const getNextDate = (data, prevTimeFirst?: Date) => {
  const finalData = data
    .map((d: Snapshot) => new Date(d.timestamp))
    .filter((date: Date) => {
      return !(prevTimeFirst && dateUtil.isDateBefore(date, prevTimeFirst));
    });

  const timeFirst = d3.min(finalData, (d: Date) => d);
  const timeLast = new Date(timeFirst);
  timeLast.setDate(timeLast.getDate() + 1);
  return { timeFirst, timeLast };
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
