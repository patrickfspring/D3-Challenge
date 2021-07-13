// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create a SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//console.log('Checkpoint #1 !!!');
// Import Data
d3.csv("assets/data/data.csv").then(function(hlthData) {

    console.log('I got here 2 !!!');

    // Parse Data/Cast as numbers

    hlthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.age = +data.age;
      data.smokes = +data.smokes;
      //console.log('after parsing');
      //console.log(data.state, data.abbr);
      //console.log(data.poverty);
      //console.log(data.healthcare);
      //console.log(data.age);
      //console.log(data.smokes);
    });

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([9, d3.max(hlthData, d => d.poverty)])
      //.domain([30, d3.max(hlthData, d => d.age)])  **Save if switch back to age/smokes 
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(hlthData, d => d.healthcare)])
      //.domain([8, d3.max(hlthData, d => d.smokes)])  **Save if switch back to age/smokes
      .range([height, 0]);

    // Create the axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append the axis to the bottom and left on the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(hlthData)
    .enter()
    .append("circle")
    //.attr("cx", d => xLinearScale(d.age))  **Save if switch back to age/smokes
    //.attr("cy", d => yLinearScale(d.smokes))  **Save if switch back to age/smokes
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))    
    .attr("r", "14")
    .attr("fill", "green")
    .attr("opacity", ".75");

    // Initialize tool tip and prepare styling for its container
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      //.offset([80, -60])  ** Not using so the tooltip is right over the individual circle 
      .style("position", "absolute")
      .style("text-align", "center")
      .style("width", "100px")
      .style("height", "60px")
      .style("padding", "2px")
      .style("font", "12px sans-serif")     
      .style("background", "lightsteelblue")
      .style("border", "0px")
      .style("border-radius", "8px")
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
        //return (`${d.abbr}<br>Smokes: ${d.smokes}<br>Age: ${d.age}`);  **Save if switch back to age/smokes
      });

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // on mouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    var circleLabels = chartGroup.selectAll(null)
                                 .data(hlthData).enter()
                                 .append("text");

    circleLabels
      .attr("x", function(d) {
        return xLinearScale(d.poverty);
        //return xLinearScale(d.age);  **Save if switch back to age/smokes
       })
      .attr("y", function(d) {
        return yLinearScale(d.healthcare);
        //return yLinearScale(d.smokes);  **Save if switch back to age/smokes
      }) 
      .text(function(d) {
        return d.abbr;
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("fill", "white");  

    //console.log('Checkpoint #2 !!!');  
    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left - 5)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .attr("font-family", "sans-serif")
      .attr("font-size", "16px")
      .attr("font-weight", 600)
      .text("Lacks Healthcare (%)");
      //.text("Smokes");  **Save if switch back to age/smokes

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .attr("font-family", "sans-serif")
      .attr("font-size", "16px")
      .attr("font-weight", 600)
      .text("In Poverty (%)");
      //.text("Age");  **Save if switch back to age/smokes

  }).catch(function(error) {
    console.log(error);
  });
