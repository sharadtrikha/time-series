import { Component, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { svg } from 'd3';
import { mockData } from 'src/util/mockData';
import {
  getMinElement,
  getMaxElement,
  createArrowButton
} from 'src/util/helperMethods';
import { leftIconPath, rightIconPath } from 'src/util/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
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

    let margin = {
      top: 10,
      bottom: 100,
      left: 50,
      right: 50
    };

    let width = 1000 - margin.left - margin.right;
    let height = 200 - margin.top - margin.bottom;

    /*	A global variable to control which event/location to show */
    let counter = 0;
    /*	A global variable to control the amout of ticks visible */
    let ticks = 8;

    /*	Find the earliest and latest time in the range */
    let timeFirst = getMinElement(data);
    let timeLast = getMaxElement(data);

    // Store current date
    currentDay = timeFirst.getDate();
    currentMonth = timeFirst.getMonth();
    currentYear = timeFirst.getFullYear();

    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const leftButton = createArrowButton({
      svg,
      backgroundPath: leftIconPath,
      pathTransform: 'translate(0,0), scale(1.5)',
      transform: 'translate(25,25)',
      onClick: () => {}
    });

    let g = svg
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

    let xAxisCall = d3
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
          if (
            elem.getDate() === timeFirst.getDate() &&
            elem.getMonth() === timeFirst.getMonth() &&
            elem.getFullYear() === timeFirst.getFullYear()
          ) {
            return d;
          }
        }
      })
    );

    let rect = rectangles
      .enter()
      .append('rect')
      .attr('x', (d, i) => x(new Date(d.timestamp)))
      .attr('y', d => {
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
      .attr('fill', d => {
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
      .on('mouseover', function(d, i) {
        d3.select('.tooltip').html(
          `<p>${new Date(d.timestamp)}- <br /> ${d.frequency}</p>`
        );

        let eventLeft = parseInt(d3.select(this).attr('x'));
        let eventWidth = parseInt(d3.select(this).attr('width'));

        let eventTop = parseInt(d3.select(this).attr('y'));
        let tooltip = <HTMLElement>document.querySelector('.tooltip');

        let tooltipHeight = parseInt(tooltip.style.height);

        tooltip.style.position = 'absolute';
        tooltip.style.left = `${eventLeft + eventWidth / 2}px`;
        tooltip.style.top = `${145 - (tooltipHeight - eventTop)}px`;
        tooltip.style.opacity = '1';
        tooltip.style.display = 'block';
        tooltip.style.transition = '0.2s opacity';
        tooltip.style.transition = '0.2s display';
      })
      .on('mouseout', () => {
        let tooltip = <HTMLElement>document.querySelector('.tooltip');
        tooltip.style.opacity = '0';
        tooltip.style.display = 'none';
      });

    function updateTimeseries() {
      console.log(data);
      console.log(currentYear);
      // data = data.filter(d => {
      //   const elemTimestamp = new Date(d.timestamp)
      //   if (elemTimestamp.getDate() > currentDay ||
      //     elemTimestamp.getMonth() > currentMonth ||
      //     elemTimestamp.getFullYear() > currentYear) {
      //     return d
      //   }
      // })

      if (data && data.length > 0) {
        let sampleDate;
        timeFirst = d3.min(data, function(d) {
          return new Date(d.timestamp);
        });
        sampleDate = timeFirst;
        console.log(sampleDate);
        let newMinDate = d3.min(data, function(d) {
          const tempDate = new Date(d.timestamp);
          if (
            sampleDate.getDate() >= tempDate.getDate() &&
            sampleDate.getMonth() === tempDate.getMonth() &&
            sampleDate.getFullYear() === tempDate.getFullYear()
          ) {
            console.log('same date');
            return null;
          } else {
            return tempDate;
          }
        });
        sampleDate = newMinDate;
        console.log(newMinDate);
        newMinDate = d3.min(data, function(d) {
          const tempDate = new Date(d.timestamp);
          if (
            sampleDate.getDate() === tempDate.getDate() &&
            sampleDate.getMonth() === tempDate.getMonth() &&
            sampleDate.getFullYear() === tempDate.getFullYear()
          ) {
            console.log('same date');
            return null;
          } else {
            return tempDate;
          }
        });
        sampleDate = newMinDate;
        console.log(newMinDate);
        timeLast = d3.max(data, function(d) {
          return new Date(d.timestamp);
        });

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

        rect.transition().attr('x', (d, i) => {
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
