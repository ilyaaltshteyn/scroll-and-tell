// Container for array of tables
const tableDiv = d3.select('#figure1').append('div').attr('id', 'tableContainer');
const colnames = ["price", "minnights", "type"];

// Initial data
let data;
const initialData = [
  { price: '100', minnights: '4', type: 'Entire home/apt' },
  { price: '32', minnights: '2', type: 'Entire home/apt' },
  { price: '40', minnights: '6', type: 'Private room' },
  { price: '60', minnights: '1', type: 'Entire home/apt' },
  { price: '25', minnights: '9', type: 'Private room' },
  { price: '27', minnights: '3', type: 'Private room' },
  { price: '99', minnights: '1', type: 'Entire home/apt' },
  { price: '39', minnights: '2', type: 'Private room' },
  { price: '70', minnights: '1', type: 'Entire home/apt' },
  { price: '45', minnights: '3', type: 'Entire home/apt' },
  { price: '90', minnights: '1', type: 'Entire home/apt' },
  { price: '30', minnights: '2', type: 'Private room' },
  { price: '...', minnights: '...', type: '...' }
];

// Tasks
function make_original_table() {
    data = JSON.parse(JSON.stringify(initialData));
    tabulate(data, colnames);
}

function revert_to_original_table() {
    data = JSON.parse(JSON.stringify(initialData));
    tabulate(data, colnames, newtable=false, killold=true);
}

function fig1__add_row_to_table() {
    // Add row to table
    // data = JSON.parse(JSON.stringify(initialData));
    // data.push({ price: '50', minnights: '5', type: '???' });
    data = JSON.parse(JSON.stringify(initialData));
    data.push({ price: '50', minnights: '5', type: '???' });
    tabulate(data, colnames, newtable=false);
}

// Function in charge of updating the table with the latest version of data
function tabulate(
  data,  // all of the data to make a table with
  columns,  // names of columns
  newtable=true,  // new table? false if just adding/removing rows
  killold=false // attempt to remove rows that are no longer in data?
) {
    if (newtable == true) {  // create table + make table header row
      var table = d3.select("#figure1").append("table"),
          thead = table.append("thead"),
          tbody = table.append("tbody");

      thead.append("tr")
      .selectAll("th")
      .data(columns)
      .enter()
      .append("th")
      .text(function(column) { return column; });
    } else {  // just select existing table
      var tbody = d3.select("#figure1").select("table").select("tbody");
    }

    if (killold == false) {  // do not remove extra row
      // create row for each object in the data
      var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

      // create a cell in each row for each column
      var cells = rows.selectAll("td")
          .data(function(row) {
              return columns.map(function(column) {
                  return {column: column, value: row[column]};
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
