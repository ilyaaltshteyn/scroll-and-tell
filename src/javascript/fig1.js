// Container for array of tables
const tableDiv = d3.select('#figure1.figure-for-canvas').append('div').attr('id', 'tableContainer');
const colnames = [
  {colname: "Player Name", coldescription: "The player's name."},
  {colname: "Shots Made", coldescription: "Average number of shots the player made, per game, in their rookie year."},
  {colname:"Rebounds Made", coldescription: "Average number of rebounds (retrieving the ball after the other team misses a shot) per game, in their rookie year."},
  {colname: "NBA Career Length", coldescription: "Did the player go on to have a career of at least 5 years in the NBA?"}
];

// Initial data
let data;
const initialData = [
  { 'Player Name': 'Kevin Willis', 'Shots Made': 3.9, 'Rebounds Made': 4.2, 'NBA Career Length': '5+ years' },
  { 'Player Name': 'Jason Kidd', 'Shots Made': 4.2, 'Rebounds Made': 3.5, 'NBA Career Length': '5+ years' },
  { 'Player Name': 'Kevin Burleson', 'Shots Made': 0.6, 'Rebounds Made': 0.6, 'NBA Career Length': '<5 years' },
  { 'Player Name': 'Marcus Fizer', 'Shots Made': 3.9, 'Rebounds Made': 3.3, 'NBA Career Length': '5+ years' },
  { 'Player Name': 'Doug Smith', 'Shots Made': 3.8, 'Rebounds Made': 3.4, 'NBA Career Length': '5+ years' },
  { 'Player Name': 'Corey Crowder', 'Shots Made': 0.8, 'Rebounds Made': 0.5, 'NBA Career Length': '<5 years' },
  { 'Player Name': 'Rudy Gay', 'Shots Made': 4.1, 'Rebounds Made': 3.3, 'NBA Career Length': '5+ years' },
  { 'Player Name': 'Chris Mills', 'Shots Made': 3.6, 'Rebounds Made': 3.4, 'NBA Career Length': '5+ years' },
  { 'Player Name': 'Lawrence Roberts', 'Shots Made': 0.6, 'Rebounds Made': 0.7, 'NBA Career Length': '<5 years' },
  { 'Player Name': 'Corey Williams', 'Shots Made': 0.9, 'Rebounds Made': 0.3, 'NBA Career Length': '<5 years' },
];

// Tasks
function make_original_table() {
    data = JSON.parse(JSON.stringify(initialData));
    tabulate(data, colnames);
    var lastrow = d3.select("#table_row_ix_10");
    lastrow.transition().duration(300).style('opacity', '0');
}

function revert_to_original_table() {
    data = JSON.parse(JSON.stringify(initialData));
    tabulate(data, colnames, newtable=false, killold=true);
}

function fig1__add_row_to_table() {
    // Add row to table
    data = JSON.parse(JSON.stringify(initialData));
    data.push({ 'Player Name': 'Taj Gibson', 'Shots Made': '3.8', 'Rebounds Made': '4.7', 'NBA Career Length': '???' });
    tabulate(data, colnames, newtable=false);
    var lastrow = d3.select("#table_row_ix_10");
    lastrow.transition().duration(800).attr('class', 'attn-newrow');
}

// Function in charge of updating the table with the latest version of data
function tabulate(
  data,  // data to make a table with
  columns,  // names of columns
  newtable=true,  // new table? false if just adding/removing rows
  killold=false // attempt to remove rows that are no longer in data?
) {
    if (newtable == true) {  // create table + make table header row
      var table = d3.select("#figure1.figure-for-canvas").append("table"),
          thead = table.append("thead"),
          tbody = table.append("tbody");

      thead.append("tr")
      .selectAll("th")
      .data(columns)
      .enter()
      .append("th")
      .html(function(column) {
        return `<span class='tooltip'>${column.colname}<span class='tooltiptext'>${column.coldescription}</span></span>`;
      });
    } else {  // just select existing table
      var tbody = d3.select("#figure1.figure-for-canvas").select("table").select("tbody");
    }

    if (killold == false) {  // do not remove extra row
      // create row for each object in the data
      var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr")
        .attr('id', function (d, i) { return 'table_row_ix_' + i});

      // create a cell in each row for each column
      var cells = rows.selectAll("td")
          .data(function(row) {
              return columns.map(function(column) {
                  return {column: column.colname, value: row[column.colname]};
              });
          })
          .enter()
          .append("td")
          .text(function(d) { return d.value; })
          .style("opacity", 0);

      if (newtable == false) {  // we're adding a new row to existing table!
        // so... make it fade in
        cells.transition().duration(400)
        .style("opacity", 1);
      } else {  // we're creating the whole table from scratch, no need to fade
        cells.style("opacity", 1);
      }

    } else {  // remove extra rows from table
      var rows = tbody.selectAll("tr")
        .data(data);
      rows.exit()
      // .transition().duration(100)
      .style("opacity", 0)
      .remove();
    }
}
