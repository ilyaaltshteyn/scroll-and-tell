function init(selector) {
  // using d3 for convenience
  var main = d3.select(selector);
  var figure = main.select('figure');
  var article = main.select('article');
  var step = article.selectAll('.step');

  // initialize the scrollama
  var scroller = scrollama();

  // generic window resize listener event
  function handleResize() {
    // 1. update height of step elements
    var stepH = Math.floor(window.innerHeight * 0.75);
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
    if (selector === "#scrolly1") {
      figure.select('p').text("A table: STEP " + String(response.index));
    } else if (selector === "#scrolly2") {
      figure.select('p').text("Data flying around a scatterplot: STEP " + String(response.index));
    }
  }
  function handleStepEnter(response) {
    console.log(response)
    // response = { element, direction, index }
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
    // add color to current step only
    step.classed('is-active', function (d, i) {
      return false;
    })
    // update graphic based on step
    update_text(selector, response);
  }

  scroller.setup({
    step: selector + ' article .step',
    offset: 0.33,
    debug: true,
  }).onStepEnter(handleStepEnter).onStepExit(handleStepExit)
  // setup resize event
  window.addEventListener('resize', handleResize);
  handleResize();
}

// kick things off
init("#scrolly1");
init("#scrolly2");
