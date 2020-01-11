function init(selector, callback) {
  // using d3 for convenience
  var main = d3.select(selector);
  var figure = main.selectAll('figure');
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
    var figureMarginTop = (window.innerHeight - figureHeight) / 3
    figure
      .style('height', figureHeight + 'px')
      .style('top', figureMarginTop + 'px');
    // 3. tell scrollama to update new element dimensions
    scroller.resize();
  }

  // scrollama event handlers
  function handleStepEnter(response) {
    // response = { element, direction, index }

    if (selector == "#section-part1"){  // part1 only, funcs from fig1.js
      if (response['index'] == 1) {
        revert_to_original_table();
      }
      if (response['index'] == 2 && response['direction'] == "down") {
        fig1__add_row_to_table();
      }
    }

    if (selector == "#section-part2"){  // part2 only, all funcs from fig2.js
      if (response['index'] == 0 && response['direction'] == "down") {
        fig2__create_first_scatterplot();
      }
      if (response['index'] == 1 && response['direction'] == "down") {
        fig2__add_blinking_new_mystery_point();
        fig2__remove_measurement_lines();
      }
      if (response['index'] == 2) {
        fig2__animate_distance_measurements();
        fig2__remove_closest_point_circles();
      }
      if (response['index'] == 3 && response['direction'] == "down") {
        fig2__circle_closest_points_and_remove_measurement_lines();
      }
    }

    console.log(`entered ${selector} step ` + response.index);
  }
  function handleStepExit(response) {
    // response = { element, direction, index }

    // this func may be unnecessary; leaving it here just in case
  }

  scroller.setup({
    step: selector + ' article .step',
    offset: 0.7,
    debug: false,
  }).onStepEnter(handleStepEnter).onStepExit(handleStepExit)
  // setup resize event
  window.addEventListener('resize', handleResize);
  handleResize();

  typeof callback === 'function' && callback();  // if callback, callback()
}

function set_up_slider() {
  // slider for part 2
  var slider = document.getElementById("myRange");
  var output = document.getElementById("k_equals_value");
  output.innerHTML = 'K = ' + slider.value; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
    output.innerHTML = 'K = ' + this.value;
    fig2__circle_closest_points_and_remove_measurement_lines(k=this.value);
  }
}

// makes header disappear on scroll (need to uncomment this and also the css):
// var prevScrollpos = window.pageYOffset;
// window.onscroll = function() {
//   var currentScrollPos = window.pageYOffset;
//   if (prevScrollpos > currentScrollPos) {
//     document.getElementById("header").style.top = "0";
//   } else {
//     document.getElementById("header").style.top = "-4rem";
//   }
//   prevScrollpos = currentScrollPos;
// }

// kick things off
init("#section-part1");
init("#section-part2", set_up_slider);
make_original_table();
