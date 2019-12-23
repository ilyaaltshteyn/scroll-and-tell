const global_fig2_margin = {top: 10, right: 30, bottom: 30, left: 60},
  global_fig2_width = 460 - global_fig2_margin.left - global_fig2_margin.right,
  global_fig2_height = 400 - global_fig2_margin.top - global_fig2_margin.bottom,
  global_fig2_xmax = 29,
  global_fig2_ymax = 300;

const mystery_datapoint = [{minimum_nights: 8, price: 160}];

var fig2__create_first_scatterplot = function() {
  if (d3.select("#figure2").select('svg').select('g').empty() == false) {
    return  // no need to do anything if scatterplot already exists
  }

  // append the svg object to the body of the page
  var svg = d3.select("#figure2")
    .append("svg")
      .attr("width", global_fig2_width + global_fig2_margin.left + global_fig2_margin.right)
      .attr("height", global_fig2_height + global_fig2_margin.top + global_fig2_margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + global_fig2_margin.left + "," + global_fig2_margin.top + ")")

  //Read the data
  d3.csv("assets/data/berlin_airbnb.csv", function(data) {

    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, global_fig2_xmax])
      .range([ 0, global_fig2_width ]);
    svg.append("g")
      .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
      .attr("transform", "translate(0," + global_fig2_height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, global_fig2_ymax])
      .range([ global_fig2_height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add dots
    var circles = svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(4); } )  // origin of flying points
        .attr("cy", function (d) { return 0; } )  // origin of flying points
        .attr("r", '3px')
        .style('fill', function(d) {  // color dots based on room type
          if (d.room_type == 'Private room') {
            return 'blue'
          } else { return 'red' }
        })

      circles.transition()
        .delay(function(d,i){return(i*3)})
        .duration(2000)
        .attr("cx", function (d) { return x(d.minimum_nights); } )  // final locatoin of flying points
        .attr("cy", function (d) { return y(d.price); } );  // final locatoin of flying points

      // SCATTERPLOT TOOLTIPS!
      // Define div to hold tooltip
      var tooltip_div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

      // enable mouseover events on circles
      circles.on("mouseover", function(d) {  // add mouseover tooltip
            tooltip_div.transition()
              .duration(200)
              .style("opacity", .9);
            tooltip_div.html(
              'Min nights: ' + String(d.minimum_nights) + '<br>Price: ' + String(d.price)
            )
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            tooltip_div.transition()
            .duration(500)
            .style("opacity", 0);
        });

  })
}

var fig2__add_blinking_new_mystery_point = function() {
  var svg = d3.select("#figure2").select("svg").select("g");
  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, global_fig2_xmax])
    .range([ 0, global_fig2_width ]);
  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, global_fig2_ymax])
    .range([ global_fig2_height, 0]);

  // Add dots
  var circles = svg.append('g')
    .selectAll("dot")
    .data(mystery_datapoint)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.minimum_nights); } )
    .attr("cy", function (d) { return y(d.price); } )
    .attr("r", '3px')
    .attr('class', 'blinking');
}

var fig2__animate_distance_measurements = function() {
  if (d3.select("#figure2").select("svg").select(".distance_measurement").empty() == false) {
    console.log('not creating new dist measurement lines')
    return  // we've already created these, no need to do again
  }
  //Read the data
  d3.csv("assets/data/berlin_airbnb_small.csv", function(data) {
    var svg = d3.select("#figure2").select("svg").select("g");
    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, global_fig2_xmax])
      .range([ 0, global_fig2_width ]);
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, global_fig2_ymax])
      .range([ global_fig2_height, 0]);

    // console.log(x(mystery_datapoint['minimum_nights']));
    var lines = svg.append('g')
      .selectAll("measurement")
      .data(data)
      .enter()
      .append('line')
        .attr("x1", function (d) { return x(mystery_datapoint[0]['minimum_nights']); } )
        .attr("y1", function (d) { return y(mystery_datapoint[0]['price']); } )
        .attr("x2", function (d) { return x(mystery_datapoint[0]['minimum_nights']); } )
        .attr("y2", function (d) { return y(mystery_datapoint[0]['price']); } )
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .attr('opacity', .5)
        .attr('class', 'distance_measurement');

      var num_lines = d3.selectAll(data).size();

      lines.transition()
        .duration(2000)
        .delay(function (d, i) { return i*100})
        .attr("x1", function (d) { return x(mystery_datapoint[0]['minimum_nights']); } )
        .attr("y1", function (d) { return y(mystery_datapoint[0]['price']); } )
        .attr("x2", function (d) { return x(d.minimum_nights); } )
        .attr("y2", function (d) { return y(d.price); } );

  })
}

var fig2__circle_closest_points_and_remove_measurement_lines = function() {
  if (d3.select("#figure2").select("svg").select(".closest_points").empty() == false) {
    console.log('not creating new closest points blinker')
    return  // we've already created these, no need to do again
  }
  d3.select("#figure2").select("svg").selectAll(".distance_measurement")
    .transition()
    .duration(2000)
    .style("opacity", 0)
    .remove();

  //Read the data
  d3.csv("assets/data/berlin_airbnb_small.csv", function(data) {
    var svg = d3.select("#figure2").select("svg").select("g");
    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, global_fig2_xmax])
      .range([ 0, global_fig2_width ]);
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, global_fig2_ymax])
      .range([ global_fig2_height, 0]);

    // make circles around the top 5 points
    // data = data[:10]
    // Add circles
    data_small = data.slice(0, 10);
    var circles = svg.append('g')
      .selectAll("dot")
      .data(data_small)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(d.minimum_nights); } )
      .attr("cy", function (d) { return y(d.price); } )
      .attr("r", '10px')
      .attr('class', 'outline_only closest_points');

  })
}
