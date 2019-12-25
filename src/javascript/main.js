function init(selector) {
  // using d3 for convenience
  var main = d3.select(selector);
  var figure = main.selectAll('figure');
  var figure_for_canvas = main.selectAll('figure.figure-for-canvas');
  var article = main.select('article');
  var step = article.selectAll('.step');

  // initialize the scrollama
  var scroller = scrollama();

  // generic window resize listener event
  function handleResize() {
    // 1. update height of step elements
    var stepH = Math.floor(window.innerHeight * 0.9);
    step.style('height', stepH + 'px');
    var figureHeight = window.innerHeight / 2
    var figureMarginTop = (window.innerHeight - figureHeight) / 2
    figure
      .style('height', figureHeight + 'px')
      .style('top', figureMarginTop + 'px');
    // 3. tell scrollama to update new element dimensions
    scroller.resize();
  }

  // scrollama event handlers
  function update_text(selector, response) {
    if (selector === "#part1") {
      figure_for_canvas.select('p').text("A table: STEP " + String(response.index));
    } else if (selector === "#part2") {
      figure_for_canvas.select('p').text("Data flying around a scatterplot: STEP " + String(response.index));
    }
  }
  function handleStepEnter(response) {
    console.log(response)
    // response = { element, direction, index }

    if (selector == "#part1"){  // part1 only
      // add table row
      if (response['index'] == 2 && response['direction'] == "down") {
        fig1__add_row_to_table();  // from fig1.js
      }
    }

    if (selector == "#part2"){  // part2 only
      // draw scatterplot animation
      if (response['index'] == 0 && response['direction'] == "down") {
        fig2__create_first_scatterplot();  // from fig2.js
      }
      // add new blinking point
      if (response['index'] == 3 && response['direction'] == "down") {
        fig2__add_blinking_new_mystery_point();  // from fig2.jss
      }
      // draw lines from point to all other points
      if (response['index'] == 5 && response['direction'] == "down") {
        fig2__animate_distance_measurements();  // from fig2.jss
      }
      // highlight closest points and remove lines
      if (response['index'] == 6 && response['direction'] == "down") {
        fig2__circle_closest_points_and_remove_measurement_lines();  // from fig2.jss
      }


    }

    // add color to current step only
    step.classed('is-active', function (d, i) {
      return i === response.index;
    })
    // update graphic based on step
    update_text(selector, response);
  }
  function handleStepExit(response) {
    console.log(response)
    // response = { element, direction, index }

    if (selector == "#part1"){  // part1 only
      // revert table to original
      if (response['index'] == 3 && response['direction'] == "up") {
        revert_to_original_table();  // from fig1.js
      }
    }

    // add color to current step only
    step.classed('is-active', false)
    // update graphic based on step
    update_text(selector, response);
  }

  scroller.setup({
    step: selector + ' article .step',
    offset: 0.15,
    debug: true,
  }).onStepEnter(handleStepEnter).onStepExit(handleStepExit)
  // setup resize event
  window.addEventListener('resize', handleResize);
  handleResize();
}

// kick things off
init("#part1");
init("#part2");
make_original_table();
