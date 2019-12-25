const global_fig2_margin = {top: 15, right: 30, bottom: 40, left: 60},
  global_fig2_width = 650 - global_fig2_margin.left - global_fig2_margin.right,
  global_fig2_height = 500 - global_fig2_margin.top - global_fig2_margin.bottom,
  global_fig2_xmax = 29,
  global_fig2_ymax = 300,
  global_radius = 4;

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
      .call(d3.axisBottom(x).ticks(8).tickSize(2));

    // X axis label
      svg.append("text")
          .attr("transform",
                "translate(" + (global_fig2_width/2) + " ," +
                               (global_fig2_height + global_fig2_margin.top*2.3) + ")")
          .style("text-anchor", "middle")
          .text("Minimum Nights")
          .classed("axis-label", true);


    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, global_fig2_ymax])
      .range([ global_fig2_height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y).ticks(8).tickSize(2));

    // Y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - global_fig2_margin.left*.85)
      .attr("x",0 - (global_fig2_height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Price")
      .classed("axis-label", true);

    // move axis a bit to space away from tick marks
    d3.selectAll('.domain').attr('transform', 'translate(3,-3)');

    // Add dots but all in one spot at the top
    var circles = svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(4); } )  // origin of flying points
        .attr("cy", function (d) { return 0; } )  // origin of flying points
        .attr("r", global_radius)
        .style('opacity', .8)
        .style('fill', function(d) {  // color dots based on room type
          if (d.room_type == 'Private room') {
            return '#3C56FF'
          } else { return '#FF5851' }
        })
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

      // have the dots fly in
      circles.transition()
        .delay(function(d,i){return(i*3)})
        .duration(2000)
        .attr("cx", function (d) { return x(d.minimum_nights); } )  // final loc of flying points
        .attr("cy", function (d) { return y(d.price); } );  // final loc of flying points

      // give dots some mouseover properties (radius increase + outline + tooltip)
      function handleMouseOver(d, i) {  // Add interactivity
            // select element, change attributes
            d3.select(this)
              .attr('stroke-width', 1)
              .attr('r', global_radius*2);

            // // Specify where to put label of text
            // svg.append("text").attr({
            //    id: "t" + d.x + "-" + d.y + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
            //     x: function() { return xScale(d.x) - 30; },
            //     y: function() { return yScale(d.y) - 15; }
            // })
            // .text(function() {
            //   return [d.x, d.y];  // Value of the text
            // });
          }

      function handleMouseOut(d, i) {
            // Use D3 to select element, change color back to normal
            d3.select(this)
              .attr('stroke-width', 0)
              .attr('r', global_radius);

            // // Select text by id and then remove
            // d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();  // Remove text location
          }
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
    .attr("r", global_radius*1.5)
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
        .duration(650)
        .delay(function (d, i) { return i*40})
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
    .duration(800)
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
      .attr("r", global_radius*2)
      .attr('class', 'outline_only closest_points')
      .style("opacity", 0)
      .transition()
      .duration(300)
      .style("opacity", 1);

  })
}
