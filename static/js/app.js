function getPlot(id) {
  // getting data from the json file
  d3.json("samples.json").then((data)=> {
      console.log(data)
      var wfreq = data.metadata.map(d => d.wfreq)
      console.log(`Washing Freq: ${wfreq}`)
      
      // filter by id name 
      var samples = data.samples.filter(s => s.id.toString() === id)[0];
      
      console.log(samples);

      var samplevalues = samples.sample_values.slice(0, 10).reverse();
      var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
      var OTU_id = OTU_top.map(d => "OTU " + d);
      var labels = samples.otu_labels.slice(0, 10);
    //Trace for bar graph
      var trace = {
          x: samplevalues,
          y: OTU_id,
          text: labels,
          marker: {
          color: 'blue'},
          type:"bar",
          orientation: "h",
      };
      // data variable
      var data = [trace];
      // plot graph layout
      var layout = {
          title: "Top 10 OTU",
          yaxis:{
              tickmode:"linear",
          },
          margin: {
              l: 50,
              r: 50,
              t: 50,
              b: 50
          }
      };
      // plot bar graph by pulling data and layout
      Plotly.newPlot("bar", data, layout);
    
      // Trace for bubble chart
      var trace1 = {
          x: samples.otu_ids,
          y: samples.sample_values,
          mode: "markers",
          marker: {
              size: samples.sample_values,
              color: samples.otu_ids
          },
          text: samples.otu_labels
      };
      // creating data variable 
      var data1 = [trace1];
      // bubble layout
      var layout_b = {
          xaxis:{title: "OTU ID"},
          height: 600,
          width: 1000
      };
      // plot bubble graph by pulling data and layout together 
      Plotly.newPlot("bubble", data1, layout_b); 
      // Gauge Chart 
      var data_g = [
        {
        domain: { x: [0, 1], y: [0, 1] },
        value: parseFloat(wfreq),
        title: { text: `Belly Button Washing Frequency` },
        subtitle: 'Scrubs per Week',
        type: "indicator",
        mode: "gauge+number", 
        gauge: { axis: { range: [null, 9], tickcolor:"black" },
                 steps: [[
                  { range: [0, 1], color: "gold" },
                  { range: [1, 2], color: "green yellow" },
                  { range: [2, 3], color: "honeydew" },
                  { range: [3, 4], color: "indian red" },
                  { range: [4, 5], color: "ivory " },
                  { range: [5, 6], color: "khaki" },
                  { range: [6, 7], color: "navy" },
                  { range: [7, 8], color: "olive" },
                  { range: [8, 9], color: "orange" }
                ]}
            
        }
      ];
      var layout_g = { 
          width: 700, 
          height: 600, 
          margin: { t: 50, b: 50, l:100, r:100 } 
        };
      Plotly.newPlot("myDiv", data_g, layout_g);
    });
}  
// get Info function will pull json data
function getInfo(id) {
  // read the json file to get data
  d3.json("samples.json").then((data)=> {
      // get the metadata info for the demographic panel
      var metadata = data.metadata;
      console.log(metadata)
      // filter by id
      var result = metadata.filter(meta => meta.id.toString() === id)[0];
      // select demographic panel to put data
      var demographicInfo = d3.select("#sample-metadata");
      // empty the demographic info panel each time before getting new id info
      demographicInfo.html("");
      // grab the id data to add to the Demographic chart 
      Object.entries(result).forEach((key) => {   
              demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
      });
  });
}
// create the function for the change event
function optionChanged(id) {
  getPlot(id);
  getInfo(id);
}
// drop down menu to select subject id
function init(){
  var dropdown = d3.select('#selDataset');
d3.json("samples.json").then((data)=> {
  console.log(data)
  // get the id data to the dropdwown menu
  data.names.forEach(function(name) {
    dropdown.append("option").text(name).property("value");
});
// call the functions to display the data and the plots to the page
getPlot(data.names[0]);
getInfo(data.names[0]);
});
}
init();
