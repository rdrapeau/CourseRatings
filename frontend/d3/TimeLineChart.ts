import d3 = require('d3');
import D3Visualization = require('./D3Visualization');

/**
 * A line chart built with D3
 */
class TimeLineChart implements D3Visualization {
  private margin : any;
  private width : number;
  private height : number;

  private element : string;
  private svg : any;

  /**
   * Constructs a line chart
   * @param {string} el The DOM element where the chart lives
   * @param {any} props Properties of the chart
   * @param {any} state State of the chart
   */
  constructor(el, props, state) {
    this.margin = props.margin || {top: 20, right: 20, bottom: 30, left: 50};
    this.width = props.width - this.margin.left - this.margin.right;
    this.height = props.height - this.margin.top - this.margin.bottom;
    this.element = el;

    this.svg = d3.select(this.element).append('svg')
              .attr("width", this.width + this.margin.left + this.margin.right)
              .attr("height", this.height + this.margin.top + this.margin.bottom)
              .append("g")
              .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
              .attr('class', 'd3-data-points');

    this.svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")");
    this.svg
      .append("g")
        .attr("class", "y axis")
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Value");
    this.svg
        .append("path")
        .attr("class", "line");

    this.update(state);
  }

  /**
   * Updates the state of the chart
   * @param {any} state The new state
   */
  public update(state) {
    // redraw the data
    var data = this.dataPreprocess(state.data);
    this.drawPoints(data);
  }

  /**
   * Destroys the chart (cleanup)
   */
  public destroy() {
    // Any clean-up would go here
    // in this class there is nothing to do
  }

  /**
   * Preprocess the data for display
   * @param {any[]} data The given data array
   * @return {any[]} The processed data
   */
  private dataPreprocess(data : any[]) {
    var result = data.slice(0);


    result.sort((a, b) => {
      return a.date - b.date;
    });

    result.forEach((d) => {
      d.date = new Date(d.date * 1000);
    });


    return result;
  }

  /**
   * Drawing helper
   * @param {any[]} data The data to draw
   */
  private drawPoints(data) {
    // Scaling / Axis
    var x = d3.time.scale()
        .range([0, this.width]);

    var y = d3.scale.linear()
        .range([this.height, 0]);


    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // Fit scaling to data
    x.domain(d3.extent(data, (d : any) => { return d.date; }));
    y.domain(d3.extent(data, (d : any) => { return d.value; }));

    // Line segments
    var line = d3.svg.line()
        .x((d : any) => { return x(d.date); })
        .y((d : any) => { return y(d.value); });

    var el = this.element;
    var g = d3.select(el).selectAll('.d3-points');


    // Update
    this.svg.selectAll(".x.axis")
        .call(xAxis);
    this.svg.selectAll(".y.axis")
        .call(yAxis);
    this.svg.selectAll(".line")
        .data([data])
        .attr("d", line);
  }
}

export = TimeLineChart;