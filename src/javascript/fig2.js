const global_fig2_margin = {top: 15, right: 8, bottom: 40, left: 60},
  global_fig2_width = 620 - global_fig2_margin.left - global_fig2_margin.right,
  global_fig2_height = 475 - global_fig2_margin.top - global_fig2_margin.bottom,
  global_fig2_xmax = 10,
  global_fig2_ymax = 10,
  global_radius = 5;

const mystery_datapoint = [{field_goals_made: 4, defensive_rebounds: 4}];

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
  d3.csv("assets/data/nba_sorted_with_distances.csv", function(data) {

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
          .text("Shots Made")
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
      .text("Defensive Rebounds")
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
        .attr('class', function(d) {  // classes of dots based on room type
          if (d.lasted_5_years_in_nba == 'y') {
            return 'dot-1'
          } else { return 'dot-2' }
        })
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

      // have the dots fly in
      circles.transition()
        .delay(function(d,i){return(i*3)})
        .duration(2000)
        .attr("cx", function (d) { return x(d.field_goals_made); } )  // final loc of flying points
        .attr("cy", function (d) { return y(d.defensive_rebounds); } );  // final loc of flying points

      // give dots some mouseover properties (radius increase + outline + tooltip)
      function handleMouseOver(d, i) {  // Add interactivity
            // select element, change attributes
            // d3.select(this)
            //   .attr('stroke-width', 1)
            //   .attr('r', global_radius*2);

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
            // d3.select(this)
            //   .attr('stroke-width', 0)
            //   .attr('r', global_radius);

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
    .attr("cx", function (d) { return x(d.field_goals_made); } )
    .attr("cy", function (d) { return y(d.defensive_rebounds); } )
    .attr("r", global_radius)
    .attr('class', 'blinking');
}

var fig2__animate_distance_measurements = function() {
  if (d3.select("#figure2").select("svg").select(".distance_measurement").empty() == false) {
    console.log('not creating new dist measurement lines')
    return  // we've already created these, no need to do again
  }
  //Read the data
  d3.csv("assets/data/nba_sorted_with_distances.csv", function(data) {
    var svg = d3.select("#figure2").select("svg").select("g");
    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, global_fig2_xmax])
      .range([ 0, global_fig2_width ]);
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, global_fig2_ymax])
      .range([ global_fig2_height, 0]);

    // console.log(x(mystery_datapoint['field_goals_made']));
    var lines = svg.append('g')
      .selectAll("measurement")
      .data(data)
      .enter()
      .append('line')
        .attr("x1", function (d) { return x(mystery_datapoint[0]['field_goals_made']); } )
        .attr("y1", function (d) { return y(mystery_datapoint[0]['defensive_rebounds']); } )
        .attr("x2", function (d) { return x(mystery_datapoint[0]['field_goals_made']); } )
        .attr("y2", function (d) { return y(mystery_datapoint[0]['defensive_rebounds']); } )
        .attr('class', 'distance_measurement');

      var num_lines = d3.selectAll(data).size();

      lines.transition()
        .duration(450)
        .delay(function (d, i) { return i*25})
        .attr("x1", function (d) { return x(mystery_datapoint[0]['field_goals_made']); } )
        .attr("y1", function (d) { return y(mystery_datapoint[0]['defensive_rebounds']); } )
        .attr("x2", function (d) { return x(d.field_goals_made); } )
        .attr("y2", function (d) { return y(d.defensive_rebounds); } );
      
    fig2__add_blinking_new_mystery_point();
      

  })
}

var fig2__remove_measurement_lines = function() {
  d3.select("#figure2").select("svg").selectAll(".distance_measurement")
    .transition()
    .duration(500)
    .style("opacity", 0)
    .remove();
}

var fig2__circle_closest_points_and_remove_measurement_lines = function(k=5) {
  // fade out distance_measurement lines
  fig2__remove_measurement_lines();

  // get distances the data
  d3.csv("assets/data/nba_sorted_with_distances.csv", function(data) {
    var svg = d3.select("#figure2").select("svg").select("g");
    var x = d3.scaleLinear()
      .domain([0, global_fig2_xmax])
      .range([ 0, global_fig2_width]);
    var y = d3.scaleLinear()
      .domain([0, global_fig2_ymax])
      .range([ global_fig2_height, 0]);

    if (svg.selectAll('#model_results_heading').size() == 0) {
      svg.append('text')
        .attr('id', 'model_results_heading')
        .attr('x', global_fig2_width/2 - global_fig2_margin.left*2.2)
        .attr('y', 0)
        .text('Classes of nearest neighbors');
      // svg.append('text')
        // .attr('id', 'prop_homes')
        // .attr('class', 'dot-1')
        // .attr('x', global_fig2_width/2 - global_fig2_margin.left - global_fig2_margin.right + 95)
        // .attr('y', 24);
      // svg.append('text')
        // .attr('id', 'prop_privates')
        // .attr('class', 'dot-2')
        // .attr('x', global_fig2_width/2 - global_fig2_margin.left - global_fig2_margin.right - 42)
        // .attr('y', 24);
      }

    // function to figure out how the neighbors voted
    function update_prediction(data_subset) {
      var private_rooms_count = 0,
        entire_homes_count = 0;

      for (i=0; i < data_subset.length; i++) {
        if (data_subset[i].lasted_5_years_in_nba === "y") {
          private_rooms_count += 1;
        } else {
          entire_homes_count += 1;
        };
      }
      var total = private_rooms_count + entire_homes_count;

      // update text that holds predictions
      d3.select('#prop_homes')
        .text(`5+ years: ${private_rooms_count}`);
      d3.select('#prop_privates')
        .text(`<5 years: ${entire_homes_count}`);
    }

    // check if any points need to be removed
    var num_existing_circles = d3.select("#figure2")
      .selectAll(".closest_points")
      .size();

    if (k > num_existing_circles) {  // make circles around any new points only
      update_prediction(data.slice(0, k));

      data_small = data.slice(num_existing_circles, k);

      var circles = svg.selectAll("dot")
        .data(data_small);

      circles.enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.field_goals_made); } )
        .attr("cy", function (d) { return y(d.defensive_rebounds); } )
        .attr("r", global_radius*2)
        .attr('class', 'outline_only closest_points')
        .style("opacity", 0)
        .transition()
        .duration(200)
        .style("opacity", 1);

    } else if (k < num_existing_circles) {  // remove extra circles
      data_small = data.slice(0, k);
      update_prediction(data_small);

      var circles = svg.selectAll(".closest_points")
        .data(data_small);

      circles.exit()
        .transition()
        .duration(100)
        .style("opacity", 0)
        .remove();
      }
    }
  )
}

var fig2__remove_closest_point_circles = function() {
  d3.select("#figure2")
    .selectAll(".closest_points")
    .transition()
    .duration(200)
    .style("opacity", 0)
    .remove();
}
