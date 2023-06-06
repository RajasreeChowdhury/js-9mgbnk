import './style.css';
const data = [
  { name: "Aditya Birla Sun Life AMC Ltd", currentMarketValue: 5957724.02, investedValue: 4310993.79, unrealisedGainLoss: 1646730.23 },
  { name: "Axis Asset Management Company Limited", currentMarketValue: 3926794.52, investedValue: 3272436.25, unrealisedGainLoss: 654358.27 },
  { name: "Bandhan Asset Management Company Limited", currentMarketValue: 765922.66, investedValue: 723842.69, unrealisedGainLoss: 42079.97 },
  { name: "Canara Robeco Asset Management Co. Ltd.", currentMarketValue: 818874.84, investedValue: 500000, unrealisedGainLoss: 318874.84 },
  { name: "DSP Investment Managers Private Limited", currentMarketValue: 1364967.72, investedValue: 1188141.43, unrealisedGainLoss: 176826.29 },
  { name: "FRANKLIN TEMPLETON", currentMarketValue: 84195.04, investedValue: 36430.76, unrealisedGainLoss: 47764.28 },
  { name: "HDFC Asset Management Company Limited", currentMarketValue: 4553346.75, investedValue: 4076444.24, unrealisedGainLoss: 476902.51 },
  { name: "HSBC Asset Management(India)Private Ltd", currentMarketValue: 6999522.8, investedValue: 6363984.57, unrealisedGainLoss: 635538.23 },
  { name: "ICICI Prudential Asset Management Company Limited", currentMarketValue: 5824643.4, investedValue: 3071378.82, unrealisedGainLoss: 2753264.58 },
  { name: "Kotak Mahindra Asset Management Co Ltd", currentMarketValue: 1776957.68, investedValue: 1058992.63, unrealisedGainLoss: 717965.05 },
  { name: "Mirae Asset Investment Managers (India) Private Limited", currentMarketValue: 3886181.89, investedValue: 3008971.37, unrealisedGainLoss: 877210.52 },
  { name: "Motilal Oswal Asset Management Co. Ltd", currentMarketValue: 1733600.01, investedValue: 1230000, unrealisedGainLoss: 503600.01 },
  { name: "Nippon Life India Asset Management Ltd", currentMarketValue: 1755453.15, investedValue: 1595144.19, unrealisedGainLoss: 160308.96 },
  { name: "UTI Asset Management Company Ltd", currentMarketValue: 733943.39, investedValue: 529980, unrealisedGainLoss: 203963.39 }
];

const maxValue = Math.max(
...data.flatMap((d) => [
d.currentMarketValue,
d.investedValue,
d.unrealisedGainLoss,
]));
const parentWidth = document.getElementById("container").parentElement.clientWidth;
const width = parentWidth;
const itemHeight = 40;
const margin = { top: 20, right: 20, bottom: 40, left: 220};
let displayedCompanies = 5;
let height = displayedCompanies*itemHeight;
const colors = ["#B8E3FF", "#276899", "#8ED8B7"];

const keys = ["Current Market Value", "Invested Value", "Unrealised Gain/Loss"];
const color = d3.scaleOrdinal().domain(keys).range(colors);

const svg = d3.select("#container")
  .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
  .attr("preserveAspectRatio", "xMinYMin")
  .attr("height", height + margin.top + margin.bottom);
const x = d3.scaleLinear()
.domain([0, maxValue/1000000])
.range([margin.left, width-margin.right]);
const y = d3.scaleBand()
.domain(data.slice(0, displayedCompanies).map((d) => d.name))
.range([margin.top, height - margin.bottom])
.padding(0.2);

function wrap(text, width) {
text.each(function () {
var text = d3.select(this),
words = text.text().split(/\s+/).reverse(),word,line = [],lineNumber = 0,lineHeight = 1.1,x = text.attr("x"),y = text.attr("y"),
dy = parseFloat(text.attr("dy")),
tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy+"em");
while (word =words.pop()) {
  line.push(word);
  tspan.text(line.join(" "));
  if (tspan.node().getComputedTextLength() > width) {
    line.pop();
    tspan.text(line.join(" "));
    line = [word];
    tspan = text.append("tspan").attr("x", x).attr("y",y).attr("dy",++lineNumber *lineHeight+dy+"em").text(word);
    }
  }
});
}
svg.append("g") 
.attr("transform", `translate(0,${height - margin.bottom})`)
.call(d3.axisBottom(x).ticks(width/80).tickSizeOuter(0).tickFormat((d) => d +"M"));
svg.append("g")
.attr("transform", `translate(${margin.left},0)`)
.call(d3.axisLeft(y).tickSizeOuter(0))
.selectAll(".tick text")
.call(wrap, margin.left - 4);

const tooltip = svg.append("g")
  .attr("class","tooltip")
  .style("display","none");
tooltip.append("rect")
  .attr("width",120)
  .attr("height", 80)
  .attr("fill","white")
  .style("opacity",0.9)
  .attr("rx", 5) 
  .attr("ry", 5);
tooltip.append("text")
  .attr("x",10)
  .attr("y",20)
  .attr("font-size","14px")
  .attr("font-weight","bold");
function showTooltip(d) {
    const tooltip = d3.select("#tooltip");
    tooltip.classed("hidden",false);
    tooltip.select("#companyName").text(d.name);
    tooltip.select("#currentMarketValue").text("Current Market Value: " + d.currentMarketValue);
    tooltip.select("#investedValue").text("Invested Value: " + d.investedValue);
    tooltip.select("#unrealisedGainLoss").text("Unrealised Gain/Loss: " + d.unrealisedGainLoss);
  }
function moveTooltip(event) {
    const tooltip = d3.select("#tooltip");
    tooltip.style("left",event.pageX + 10 + "px");
    tooltip.style("top",event.pageY + 10 + "px");
  }
function hideTooltip() {
  const tooltip = d3.select("#tooltip");
  tooltip.classed("hidden",true);
  }

  function createLegend(height) {
    const size = 10;
    const legendXPosition = width-margin.right-keys.length*size*1.2;
    svg.selectAll(".legend-dots").remove();
    svg.selectAll(".legend-labels").remove();
    svg
      .selectAll("legend-dots")
      .data(keys)
      .enter()
      .append("rect")
      .attr("class", "legend-dots")
      .attr("x", legendXPosition)
      .attr("y", function (d, i) {
        return height - 4 + i * (size + 5);
      })
      .attr("width", size)
      .attr("height", size)
      .style("fill", function (d) {
        return color(d);
      });
    svg
      .selectAll("legend-labels")
      .data(keys)
      .enter()
      .append("text")
      .attr("class", "legend-labels")
      .attr("x", legendXPosition+size * 1.2)
      .attr("y", function (d, i) {
        return height - 0 + i * (size + 5) + size / 2;
      })
      .style("fill", function (d) {
        return color(d);
      })
      .text(function (d) {
        return d;
      })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "bottom");
  }
  
  function updateDisplayedCompanies() {
    const filteredData = data.slice(0, displayedCompanies);
  height = displayedCompanies * itemHeight;
  svg.attr("height", height + margin.top + margin.bottom);
  svg.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`);
  y.range([margin.top, height - margin.bottom]);
  svg.select("g").attr("transform", `translate(0,${height - margin.bottom})`);
    y.domain(filteredData.map((d) => d.name));
    svg.selectAll(".tick").remove();
    svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSizeOuter(0))
    .selectAll(".tick text")
    .call(wrap, margin.left - 4);  
    const groups = svg
      .selectAll(".bar-group")
      .data(filteredData)
      .join("g")
      .attr("class", "bar-group")
      .attr("transform", (d) => `translate(0, ${y(d.name)})`);
  
    groups
      .selectAll(".bar")
      .data((d) => [
        { key: "currentMarketValue", value: d.currentMarketValue },
        { key: "investedValue", value: d.investedValue },
        { key: "unrealisedGainLoss", value: d.unrealisedGainLoss },
      ])
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(0))
      .attr("y", (d, i) => y.bandwidth() / 3.5 * i + 2 * i)
      .attr("width", 0)
      .attr("height", y.bandwidth() / 3.5 - 2)
      .attr("fill", (d, i) => colors[i])
      .attr("rx", 5)
      .attr("ry", 5)
      .on("mouseover", (event, d) => {
      const currentCompanyData = d3.select(event.currentTarget.parentNode).datum();
        showTooltip(currentCompanyData);
        moveTooltip(event);
      })
      .on("mousemove", (event) => {
        moveTooltip(event);
      })
      .on("mouseout", hideTooltip)
      .transition()
      .duration(1000)
      .attr("width", (d) => x(d.value / 1000000) - x(0));
      createLegend(height);
  
  }
  
  updateDisplayedCompanies();
  
document.querySelector("#view-all").addEventListener("click", () => {
  displayedCompanies = data.length;
  updateDisplayedCompanies();
  
});
