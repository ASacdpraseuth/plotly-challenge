// build the metadata

function metadata(sample) {

    // grab metadata from samples
    d3.json('samples.json').then((data) => {

        var metadata= data.metadata;
        var resultsarray= metadata.filter(sampleobject => sampleobject.id == sample);
        var result= resultsarray[0];
        var panel = d3.select('#sample-metadata');
        panel.html('');
        Object.entries(result).forEach(([key, value]) => {
        panel.append('h6').text(`${key}: ${value}`);
        });
    });
}
  
// make charts

function charts(sample) {

    // grab sample data for plots
    d3.json('samples.json').then((data) => {
        var samples = data.samples;
        var resultsarray = samples.filter(sampleobject => sampleobject.id == sample);
        var result = resultsarray[0];

        var ids = result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;

///////////////
// BAR CHART //
///////////////

        var bar_data =[
            {
                y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
                x:values.slice(0,10).reverse(),
                text:labels.slice(0,10).reverse(),
                type:'bar',
                orientation:'h'
            }
        ];

        var barLayout = {
            title: 'Top 10 Bacteria Cultures Found',
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot('bar', bar_data, barLayout);

//////////////////
// BUBBLE CHART //
//////////////////

        var bubbleLayout = {
            margin: { t: 0 },
            xaxis: { title: 'OTU ID' },
            hovermode: 'closest',
        };

        var bubbleData = [ 
            {
                x: ids,
                y: values,
                text: labels,
                mode: 'markers',
                marker: {
                    color: ids,
                    size: values,
                }
            }
        ];

        Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    });
}

function init() {

    // Grab a reference to the dropdown select element
    var selector = d3.select('#selDataset');
    
    // Use the list of sample names to populate the select options
    d3.json('samples.json').then((data) => {
        var names = data.names;
        var dropDown = d3.select('#selDataset');
        dropDown.selectAll('option')
            .data(names)
            .enter()
            .append('option')
            .text(function(d) {
                return `${d}`
            });
        });
};
    
function optionChanged(newSample) {

    // Fetch new data each time a new sample is selected
    charts(newSample);
    metadata(newSample);
}

// Initialize the dashboard
init();