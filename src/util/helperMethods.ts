import * as d3 from 'd3';
import { Snapshot } from 'src/models/Snapshot';
import dateUtil from './dateUtils';

let firstDate;

const getTimes = timeFirst => {
  const timeLast = new Date(timeFirst);
  timeLast.setDate(timeLast.getDate() + 1);
  return { timeFirst, timeLast };
};

export const getNextDate = (isNext: boolean, data, prevTimeFirst?: Date) => {
  let timeFirst = prevTimeFirst;
  if (firstDate && dateUtil.isDateEquals(firstDate, prevTimeFirst) && !isNext) {
  } else {
    const finalData = data
      .map((d: Snapshot) => new Date(d.timestamp))
      .filter((date: Date) => {
        if (isNext) {
          return !(prevTimeFirst && dateUtil.isDateBefore(date, prevTimeFirst));
        } else {
          return !(prevTimeFirst && dateUtil.isDateAfter(date, prevTimeFirst));
        }
      });

    if (isNext) {
      timeFirst = d3.min(finalData, (d: Date) => d);
    } else {
      timeFirst = d3.max(finalData, (d: Date) => d);
    }

    if (!firstDate) {
      firstDate = new Date(timeFirst);
    }
  }
  return getTimes(timeFirst);
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
