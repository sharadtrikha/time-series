import { Component, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3'
import { svg } from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'time-series';
  data = []
  datum = []
  @ViewChild('chart') chart: ElementRef;


  ngOnInit() {
    this.datum = [
      {
        "frequency": "daily",
        "snapshots": [
          {
            "timestamp": 1544001338996,
            "status": "skipped"
          }
        ]
      },
      {
        "frequency": "hourly",
        "snapshots": [
          {
            "timestamp": 1544050194168,
            "status": "success"
          },
          {
            "timestamp": 1544006777024,
            "status": "success"
          },
          {
            "timestamp": 1543991650207,
            "status": "success"
          },
          {
            "timestamp": 1543971257297,
            "status": "success"
          },
          {
            "timestamp": 1544051165108,
            "status": "success"
          },
          {
            "timestamp": 1544020458460,
            "status": "success"
          },
          {
            "timestamp": 1544013406506,
            "status": "success"
          },
          {
            "timestamp": 1544034491661,
            "status": "failed"
          },
          {
            "timestamp": 1543994179022,
            "status": "success"
          },
          {
            "timestamp": 1544046625273,
            "status": "success"
          },
          {
            "timestamp": 1543999979185,
            "status": "success"
          },
          {
            "timestamp": 1544023903188,
            "status": "success"
          },
          {
            "timestamp": 1544006430962,
            "status": "success"
          },
          {
            "timestamp": 1544037228279,
            "status": "success"
          },
          {
            "timestamp": 1544010531598,
            "status": "success"
          }
        ]
      },
      {
        "frequency": "minutely",
        "snapshots": [
          {
            "timestamp": 1544020277406,
            "status": "success"
          },
          {
            "timestamp": 1544020337406,
            "status": "success"
          },
          {
            "timestamp": 1544020457406,
            "status": "success"
          },
          {
            "timestamp": 1544020637406,
            "status": "success"
          },
          {
            "timestamp": 1544020877406,
            "status": "success"
          },
          {
            "timestamp": 1544021177406,
            "status": "success"
          },
          {
            "timestamp": 1544021537406,
            "status": "success"
          },
          {
            "timestamp": 1544021957406,
            "status": "failed"
          },
          {
            "timestamp": 1544022437406,
            "status": "failed"
          },
          {
            "timestamp": 1544022977406,
            "status": "success"
          },
          {
            "timestamp": 1544023577406,
            "status": "success"
          },
          {
            "timestamp": 1544024237406,
            "status": "success"
          },
          {
            "timestamp": 1544024957406,
            "status": "success"
          },
          {
            "timestamp": 1544025737406,
            "status": "success"
          },
          {
            "timestamp": 1544026577406,
            "status": "skipped"
          }
        ]
      },
      {
        "frequency": "manual",
        "snapshots": [
          {
            "timestamp": 1544039412943,
            "status": "success"
          },
          {
            "timestamp": 1543998770497,
            "status": "failed"
          },
          {
            "timestamp": 1544007053185,
            "status": "failed"
          },
          {
            "timestamp": 1543998215676,
            "status": "success"
          }
        ]
      }
    ]
  }



  ngAfterContentInit() {

    let currentDay: number;
    let currentMonth: number;
    let currentYear: number;
    let data = [];


    this.datum.forEach(elem => {
      let element = {
        frequency: "",
        timestamp: 0,
        status: ""
      };
      if (elem.snapshots) {
        elem.snapshots.forEach(e => {
          element.frequency = elem.frequency;
          element.status = e.status;
          element.timestamp = e.timestamp;
          data.push(element)
          element = {
            frequency: "",
            timestamp: 0,
            status: ""
          };
        });
      }

    })
    debugger

    let margin = {
      top: 10,
      bottom: 100,
      left: 50,
      right: 50
    }

    let width = 1000 - margin.left - margin.right
    let height = 200 - margin.top - margin.bottom




    /*	A global variable to control which event/location to show */
    let counter = 0;
    /*	A global variable to control the amout of ticks visible */
    let ticks = 8;

    /*	Find the earliest and latest time in the range */
    let timeFirst = d3.min(data, function (d) {
      return new Date(d.timestamp);
    });
    let timeLast = d3.max(data, function (d) {
      return new Date(d.timestamp);
    });

    // Store current date
    currentDay = timeFirst.getDate();
    currentMonth = timeFirst.getMonth();
    currentYear = timeFirst.getFullYear();






















    let svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)


    var leftIcon = svg.append("path")
      .attr("d", "M20.834,8.037L9.641,14.5c-1.43,0.824-1.43,2.175,0,3l11.193,6.463c1.429,0.826,2.598,0.15,2.598-1.5V9.537C23.432,7.887,22.263,7.211,20.834,8.037z")
      .style("pointer-events", "none")
      .attr("transform", "translate(0,0), scale(1.5)");

    var leftButton = svg.append("rect")
      .attr("width", 50)
      .attr("height", 50)
      .style("fill", "blue")
      .style("opacity", 0.2)
      .attr("transform", "translate(0,0)")
      .style("cursor", "pointer")



    let g = svg.append('g')
      .attr("transform", `translate(${margin.left},${margin.top})`)

    var rightIcon = svg.append("path")
      .attr("d", "M11.166,23.963L22.359,17.5c1.43-0.824,1.43-2.175,0-3L11.166,8.037c-1.429-0.826-2.598-0.15-2.598,1.5v12.926C8.568,24.113,9.737,24.789,11.166,23.963z")
      .style("pointer-events", "none")
      .attr("transform", `translate(${width+60},0), scale(1.5)`);

    var rightButton = svg.append("rect")
      .attr("width", 50)
      .attr("height", 50)
      .style("fill", "blue")
      .style("opacity", 0.2)
      .attr("transform", `translate(${width+60},0)`)
      .style("cursor", "pointer")
      .on("click", function (e) {

        updateTimeseries();
        d3.event.preventDefault();
        return false;
      })


    /* Scales */
    let x = d3.scaleTime()
      .domain([timeFirst, timeLast])
      .range([0, width]);

    /* X-Axis */

    let xAxisCall = d3.axisBottom(x)
      .ticks(d3.timeHour)
      .tickFormat(d3.timeFormat("%I %p"))

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxisCall)

    let rectangles = g.selectAll('rect').data(data.filter((d) => {
      if (d && d.timestamp) {
        const elem_ = new Date(d.timestamp)
        if ((elem_.getDate() === timeFirst.getDate()) && (elem_.getMonth() === timeFirst.getMonth()) && (elem_.getFullYear() === timeFirst.getFullYear())) {
          return d
        }
      }
    }))

    let rect = rectangles.enter()
      .append("rect")
      .attr('x', (d, i) => x(new Date(d.timestamp)))
      .attr('y', (d) => {
        switch (d.frequency) {
          case 'daily':
            return 5
          case 'hourly':
            return 15
          case 'minutely':
            return 30
          case 'manual':
            return 50
          default:
            return 25
        }

      })
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', (d) => {
        switch (d.frequency) {
          case 'daily':
            return 'red'
          case 'hourly':
            return 'grey'
          case 'minutely':
            return 'green'
          case 'manual':
            return 'blue'
          default:
            return 'black'
        }

      })
      .on("mouseover", function (d, i) {
        d3.select('.tooltip').html(`<p>${new Date(d.timestamp)}- <br /> ${d.frequency}</p>`)


        let eventLeft = parseInt(d3.select(this).attr("x"));
        let eventWidth = parseInt(d3.select(this).attr("width"));

        let eventTop = parseInt(d3.select(this).attr("y"));
        let tooltip = <HTMLElement>document.querySelector(".tooltip")

        let tooltipHeight = parseInt(tooltip.style.height);

        tooltip.style.position = 'absolute'
        tooltip.style.left = `${eventLeft + (eventWidth / 2)}px`;
        tooltip.style.top = `${145 - (tooltipHeight - eventTop)}px`;
        tooltip.style.opacity = "1";
        tooltip.style.display = "block";
        tooltip.style.transition = "0.2s opacity";
        tooltip.style.transition = "0.2s display";

      })
      .on("mouseout", () => {

        let tooltip = <HTMLElement>document.querySelector(".tooltip")
        tooltip.style.opacity = "0";
        tooltip.style.display = "none";
      })


    function updateTimeseries() {
      console.log(data)
      console.log(currentYear)
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
        timeFirst = d3.min(data, function (d) {
          return new Date(d.timestamp);
        });
        sampleDate = timeFirst;
        console.log(sampleDate);
        let newMinDate = d3.min(data, function (d) {
          const tempDate= new Date(d.timestamp);
          if(sampleDate.getDate() >= tempDate.getDate() &&
          sampleDate.getMonth() === tempDate.getMonth() &&
          sampleDate.getFullYear() === tempDate.getFullYear()) {
            console.log('same date');
            return null;
          } else {
            return tempDate;
          }
        });
        sampleDate = newMinDate
        console.log(newMinDate)
         newMinDate = d3.min(data, function (d) {
          const tempDate= new Date(d.timestamp);
          if(sampleDate.getDate() === tempDate.getDate() &&
          sampleDate.getMonth() === tempDate.getMonth() &&
          sampleDate.getFullYear() === tempDate.getFullYear()) {
            console.log('same date');
            return null;
          } else {
            return tempDate;
          }
        });
        sampleDate = newMinDate
        console.log(newMinDate)
        timeLast = d3.max(data, function (d) {
          return new Date(d.timestamp);
        });

        /*	Replace the values used in the x domain */
        x.domain([timeFirst, timeLast])

        /* Scales */
        x = d3.scaleTime()
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

        rectangles = g.selectAll('rect').data(data.filter((d) => {
          if (d && d.timestamp) {
            const elem_ = new Date(d.timestamp)
            if ((elem_.getDate() === timeFirst.getDate()) && (elem_.getMonth() === timeFirst.getMonth()) && (elem_.getFullYear() === timeFirst.getFullYear())) {
              return d
            }
          }
        }))

        rect
          .transition()
          .attr('x', (d, i) => {
            return x(new Date(d.timestamp))
          })

        // Store current date
        currentDay = timeFirst.getDate();
        currentMonth = timeFirst.getMonth();
        currentYear = timeFirst.getFullYear();
      }
    }
  }
}
