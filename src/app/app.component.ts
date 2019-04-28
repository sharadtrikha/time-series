import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  AfterContentInit
} from '@angular/core';
import * as d3 from 'd3';
import { mockData } from 'src/util/mockData';
import { getNextDate, createArrowButton } from 'src/util/helperMethods';
import { leftIconPath, rightIconPath } from 'src/util/constants';
import { Snapshot } from 'src/models/Snapshot';
import dateUtil from 'src/util/dateUtils';
import { SVGUtils } from 'src/util/SVGUtils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterContentInit {
  title = 'time-series';
  data = [];
  datum = [];
  @ViewChild('chart') chart: ElementRef;

  ngOnInit() {
    this.datum = mockData;
  }

  mapResponse(datum) {
    return datum.reduce((acc, elem) => {
      const snapshots = elem.snapshots.map(e => {
        return {
          frequency: elem.frequency,
          timestamp: e.timestamp,
          status: e.status
        };
      });
      acc.push(...snapshots);
      return acc;
    }, []);
  }

  ngAfterContentInit() {
    let currentDay: number;
    let currentMonth: number;
    let currentYear: number;
    const data = this.mapResponse(this.datum);

    const margin = {
      top: 10,
      bottom: 100,
      left: 50,
      right: 50
    };
    const svgUtils = new SVGUtils(margin);
    const { svg, width, height } = svgUtils;

    /*	A global variable to control which event/location to show */
    const counter = 0;
    /*	A global variable to control the amout of ticks visible */
    const ticks = 8;

    /*	Find the earliest and latest time in the range */
    let { timeFirst, timeLast } = getNextDate(data);

    // Store current date
    currentDay = timeFirst.getDate();
    currentMonth = timeFirst.getMonth();
    currentYear = timeFirst.getFullYear();

    const leftButton = createArrowButton({
      svg,
      backgroundPath: leftIconPath,
      pathTransform: 'translate(0,0), scale(1.5)',
      transform: 'translate(25,25)',
      onClick: () => {}
    });

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const rightButton = createArrowButton({
      svg,
      backgroundPath: rightIconPath,
      pathTransform: `translate(${width + 60},0), scale(1.5)`,
      transform: `translate(${width + 80},25)`,
      onClick: e => {
        updateTimeseries();
        d3.event.preventDefault();
        return false;
      }
    });

    /* Scales */
    let x = d3
      .scaleTime()
      .domain([timeFirst, timeLast])
      .range([0, width]);

    /* X-Axis */

    const xAxisCall = d3
      .axisBottom(x)
      .ticks(d3.timeHour)
      .tickFormat(d3.timeFormat('%I %p'));

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxisCall);

    let rectangles = g.selectAll('rect').data(
      data.filter(d => {
        if (d && d.timestamp) {
          const elem = new Date(d.timestamp);
          if (dateUtil.isDateEquals(elem, timeFirst)) {
            return d;
          }
        }
      })
    );

    const rect = rectangles
      .enter()
      .append('rect')
      .attr('x', (d: Snapshot, i) => x(new Date(d.timestamp)))
      .attr('y', (d: Snapshot) => {
        switch (d.frequency) {
          case 'daily':
            return 5;
          case 'hourly':
            return 15;
          case 'minutely':
            return 30;
          case 'manual':
            return 50;
          default:
            return 25;
        }
      })
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', (d: Snapshot) => {
        switch (d.frequency) {
          case 'daily':
            return 'red';
          case 'hourly':
            return 'grey';
          case 'minutely':
            return 'green';
          case 'manual':
            return 'blue';
          default:
            return 'black';
        }
      })
      .on('mouseover', function(d: Snapshot, i) {
        d3.select('.tooltip').html(
          `<p>${new Date(d.timestamp)}- <br /> ${d.frequency}</p>`
        );

        const eventLeft = parseInt(d3.select(this).attr('x'), 10);
        const eventWidth = parseInt(d3.select(this).attr('width'), 10);

        const eventTop = parseInt(d3.select(this).attr('y'), 10);
        const tooltip = document.querySelector('.tooltip') as HTMLElement;

        const tooltipHeight = parseInt(tooltip.style.height, 10);

        tooltip.style.position = 'absolute';
        tooltip.style.left = `${eventLeft + eventWidth / 2}px`;
        tooltip.style.top = `${145 - (tooltipHeight - eventTop)}px`;
        tooltip.style.opacity = '1';
        tooltip.style.display = 'block';
        tooltip.style.transition = '0.2s opacity';
        tooltip.style.transition = '0.2s display';
      })
      .on('mouseout', () => {
        const tooltip = document.querySelector('.tooltip') as HTMLElement;
        tooltip.style.opacity = '0';
        tooltip.style.display = 'none';
      });

    function updateTimeseries() {
      if (data && data.length > 0) {
        ({ timeFirst, timeLast } = getNextDate(data, timeFirst));

        /*	Replace the values used in the x domain */
        x.domain([timeFirst, timeLast]);

        /* Scales */
        x = d3
          .scaleTime()
          .domain([timeFirst, timeLast])
          .range([0, width]);

        /* X-Axis */

        // xAxisCall = d3.axisBottom(x)
        //   .ticks(d3.timeHour)
        //   .tickFormat(d3.timeFormat("%I %p"))

        // g.append('g')
        //   .attr('class', 'x-axis')
        //   .attr('transform', `translate(0,${height})`)
        //   .call(xAxisCall)

        rectangles = g.selectAll('rect').data(
          data.filter(d => {
            if (d && d.timestamp) {
              const elem_ = new Date(d.timestamp);
              if (
                elem_.getDate() === timeFirst.getDate() &&
                elem_.getMonth() === timeFirst.getMonth() &&
                elem_.getFullYear() === timeFirst.getFullYear()
              ) {
                return d;
              }
            }
          })
        );

        rect.transition().attr('x', (d: Snapshot, i) => {
          return x(new Date(d.timestamp));
        });

        // Store current date
        currentDay = timeFirst.getDate();
        currentMonth = timeFirst.getMonth();
        currentYear = timeFirst.getFullYear();
      }
    }
  }
}
