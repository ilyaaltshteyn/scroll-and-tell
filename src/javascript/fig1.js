// Container for array of tables
const tableDiv = d3.select('#figure1.figure-for-canvas').append('div').attr('id', 'tableContainer');
const colnames = [
  {colname: "Shots Made", coldescription: "The price per night, in euros."},
  {colname:"Rebounds", coldescription: "The minimum # of nights that a guest has to reserve."},
  {colname: "NBA Career Length", coldescription: "Is the entire home for rent, or just a private room?"}
];

// Initial data
let data;
const initialData = [
  { 'Shots Made': '10', 'Rebounds': '4', 'NBA Career Length': '5+ years' },
  { 'Shots Made': '32', 'Rebounds': '2', 'NBA Career Length': '5+ years' },
  { 'Shots Made': '40', 'Rebounds': '6', 'NBA Career Length': '5+ years' },
  { 'Shots Made': '60', 'Rebounds': '1', 'NBA Career Length': '5+ years' },
  { 'Shots Made': '25', 'Rebounds': '9', 'NBA Career Length': '5+ years' },
  { 'Shots Made': '27', 'Rebounds': '3', 'NBA Career Length': '5+ years' },
  { 'Shots Made': '99', 'Rebounds': '1', 'NBA Career Length': '5+ years' },
  { 'Shots Made': '39', 'Rebounds': '2', 'NBA Career Length': '5+ years' },
  { 'Shots Made': '70', 'Rebounds': '1', 'NBA Career Length': '5+ years' },
  { 'Shots Made': '45', 'Rebounds': '3', 'NBA Career Length': '5+ years' },
  { 'Shots Made': '90', 'Rebounds': '1', 'NBA Career Length': '5+ years' }
];

// Tasks
function make_original_table() {
    data = JSON.parse(JSON.stringify(initialData));
    tabulate(data, colnames);
    var lastrow = d3.select("#table_row_ix_11");
    lastrow.transition().duration(300).style('opacity', '0');
}

function revert_to_original_table() {
    data = JSON.parse(JSON.stringify(initialData));
    tabulate(data, colnames, newtable=false, killold=true);
}

function fig1__add_row_to_table() {
    // Add row to table
    data = JSON.parse(JSON.stringify(initialData));
    data.push({ 'Shots Made': '50', 'Rebounds': '5', 'NBA Career Length': '???' });
    tabulate(data, colnames, newtable=false);
    var lastrow = d3.select("#table_row_ix_11");
    lastrow.transition().duration(800).style('background-color', '#FFF93C');
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
        cells.transition().duration(1000)
        .style("opacity", 1);
      } else {  // we're creating the whole table from scratch, no need to fade
        cells.style("opacity", 1);
      }

    } else {  // remove extra rows from table
      var rows = tbody.selectAll("tr")
        .data(data);
      rows.exit()
      .transition().duration(1000)
      .style("opacity", 0)
      .remove();
    }
}
