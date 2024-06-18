import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import Filters from "./Filters";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    endYear: "",
    topic: "",
    sector: "",
    region: "",
    pestle: "",
    source: "",
    country: "",
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/data")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
        drawChart(data);
      });
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    let filtered = data;
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        filtered = filtered.filter((d) => d[key].includes(filters[key]));
      }
    });
    setFilteredData(filtered);
    drawChart(filtered);
  };

  const drawChart = (data) => {
    d3.select("#chart").selectAll("*").remove();

    const width = 1154;
    const height = 1154;
    const color = d3.scaleOrdinal(d3.schemeTableau10);

    const root = d3
      .hierarchy({ children: data })
      .sum((d) => d.intensity)
      .sort((a, b) => b.value - a.value);

    d3.treemap().size([width, height]).padding(1).round(true)(root);

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    const leaf = svg
      .selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", (d) => `translate(${d.x0},${d.y0})`);

    const format = d3.format(",d");
    leaf.append("title").text(
      (d) =>
        `${d
          .ancestors()
          .reverse()
          .map((d) => d.data.title)
          .join(".")}\n${format(d.value)}`
    );

    leaf
      .append("rect")
      .attr("id", (d) => (d.leafUid = d3.create("svg:rect")).id)
      .attr("fill", (d) => {
        while (d.depth > 1) d = d.parent;
        return color(d.data.title);
      })
      .attr("fill-opacity", 0.6)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0);

    leaf
      .append("clipPath")
      .attr("id", (d) => (d.clipUid = d3.create("svg:clipPath")).id)
      .append("use")
      .attr("xlink:href", (d) => d.leafUid.href);

    leaf
      .append("text")
      .attr("clip-path", (d) => d.clipUid)
      .selectAll("tspan")
      .data((d) =>
        d.data.title.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value))
      )
      .join("tspan")
      .attr("x", 3)
      .attr(
        "y",
        (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`
      )
      .attr("fill-opacity", (d, i, nodes) =>
        i === nodes.length - 1 ? 0.7 : null
      )
      .text((d) => d);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  return (
    <div>
      <Filters filters={filters} onFilterChange={handleFilterChange} />
      <div id="chart"></div>
    </div>
  );
};

export default Dashboard;
