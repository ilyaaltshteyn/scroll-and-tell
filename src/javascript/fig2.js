var create_first_scatterplot = function() {
  if (d3.select("#figure2").select('svg').select('g').empty() == false) {
    return  // no need to do anything if scatterplot already exists
  }

  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;
      // append the svg object to the body of the page
      var svg = d3.select("#figure2")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")")

  //Read the data
  d3.csv("assets/data/berlin_airbnb.csv", function(data) {

    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return d.minimum_nights; })])
      .range([ 0, width ]);
    svg.append("g")
      .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return d.price; })])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add dots
    svg.append('g')
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
        .transition()
        .delay(function(d,i){return(i*3)})
        .duration(2000)
        .attr("cx", function (d) { return x(d.minimum_nights); } )  // final locatoin of flying points
        .attr("cy", function (d) { return y(d.price); } );  // final locatoin of flying points

  })
}
