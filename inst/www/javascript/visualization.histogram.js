var LEFT, RIGHT, TOP, BOTTOM, xStep;
var yDiffForPlots;

// Plot a histogram in the plot canvas

function plotHistogram()
{   
    // ToDo: write a function to log visualisations better
    logViz.push({
        time: new Date().getTime(), 
        dataset: sessionStorage.fileName,
        variables: selectedVariables.slice(0).join("|"),
        visualization: "histogram"
    });

    writeToFileVisualizations(sessionStorage.logFileName + "_visualizations");
    
    // Define the boundaries of the plot
    
    LEFT = plotPanelWidth/2 - plotWidth/2;
    RIGHT = plotPanelWidth/2 + plotWidth/2;

    TOP = plotPanelHeight/2 - plotHeight/2;
    BOTTOM = plotPanelHeight/2 + plotHeight/2;            
    
    var canvas = d3.select("#plotCanvas"); 

    var data = [];
    var mins = [];
    var maxs = [];
    var varNames = [];    
    var combinedData = [];

    var histogramOfDVAcrossLevelsOfIV = false;
    
    var variableList = sort(selectedVariables);
    var DV = variableList["dependent"].length > 0 ? variableList["dependent"][0] : null; 
    
    if(variableList["independent"].length <= 1)
    {        
        switch(selectedVariables.length)
        {
            case 1:
                    {     
                        data[0] = variables[selectedVariables[0]]["dataset"];      
                        varNames[0] = selectedVariables[0];
                        mins[0] = MIN[selectedVariables[0]]["dataset"];      
                        maxs[0] = MAX[selectedVariables[0]]["dataset"];                                                                                   

                        nBins = DV == null ? nBins : nBinsArray[DV]["dataset"];                        
                        break;                    
                    }
            case 2:
                    {
                        if(variableList["independent"].length == 1)
                        {
                            histogramOfDVAcrossLevelsOfIV = true;
                            var t = 0;

                            for(var i=0; i<variableList["independent-levels"].length; i++)
                            {
                                data[i] = variables[DV][variableList["independent-levels"][i]];
                                varNames[i] = DV + "[" + variableList["independent-levels"][i] + "]";
                                mins[i] = MIN[DV][variableList["independent-levels"][i]];
                                maxs[i] = MAX[DV][variableList["independent-levels"][i]];                            

                                if(nBinsArray[DV][variableList["independent-levels"][i]] > t)                                    
                                    t = nBinsArray[DV][variableList["independent-levels"][i]];
                            }    

                            nBins = t;
                            
                        }
                        else
                        {
                            // both are DVs
                            var t = 0;

                            for(var i=0; i<selectedVariables.length; i++)
                            {
                                data[i] = variables[selectedVariables[i]]["dataset"];
                                varNames[i] = selectedVariables[i];
                                mins[i] = MIN[selectedVariables[i]]["dataset"];
                                maxs[i] = MAX[selectedVariables[i]]["dataset"];

                                if(nBinsArray[selectedVariables[i]]["dataset"] > t)
                                    t = nBinsArray[selectedVariables[i]]["dataset"];
                            }

                            nBins = t;
                            
                        }
                        
                        break;
                    }            
        }
    }    
    
    // combine the collected data
    for(var i=0; i<data.length; i++)
    {
        for(var j=0; j<data[i].length; j++)
        {
            combinedData.push(data[i][j]);
        }
    } 
        

    // Find minimum and maximum values
    var min = Array.min(mins);
    var max = Array.max(maxs);
    
    var labels;
    var levels = variableList["independent-levels"];//todo
    
    if(histogramOfDVAcrossLevelsOfIV == true)    
        labels = levels;
    else    
        labels = selectedVariables;
    
    var ids = getValidIds(labels);    
    
    
    if(combinedData.unique().length < nBins)
    {
        // Bar chart        
        var uniqueData = combinedData.unique();
        
        var numberOfGroovesInXAxis = uniqueData.length;
    
        var slice = (max - min)/uniqueData.length;    
    
        var bins = new Object();
    
        // Init. counts of bins

        for(var i=0; i<labels.length; i++)
        {
            bins[labels[i]] = new Array();
            for(var j=0; j<nBins; j++)
            {
                bins[labels[i]][j] = 0;
            }  
        }
    
        // Update counts

        for(var i=0; i<labels.length; i++)
        {
            for(var j=0; j<data[i].length; j++)
            {           
                var index = Math.ceil((data[i][j] - min)/slice);
            
                if(index >= uniqueData.length)
                    index = uniqueData.length - 1;
                
                bins[labels[i]][uniqueData.indexOf(data[i][j])]++;         
            }
        }
    
        var binMaxs = new Array();
        var binMins = new Array();
    
        for(var i=0; i<labels.length; i++)
        {
            binMaxs[i] = Array.max(bins[labels[i]]);        
        }
        
         // Find ticks   
        var nGroovesY = findTicksForHistogramFrequencyAxis(Array.max(binMaxs));    
        var individualPlotHeight = labels.length > 1 ? (plotHeight/labels.length)-axesOffset : plotHeight;
        yDiffForPlots = labels.length > 1 ? (plotHeight/labels.length) : plotHeight;
        drawHistogramLegends(varNames);
        
        nGroovesY = Math.ceil(nGroovesY * (individualPlotHeight/plotHeight));
        nGroovesY = nGroovesY < 2 ? 2 : nGroovesY;
        var binSlice = Array.max(binMaxs)/(nGroovesY-1);
    
        // Draw axes    

        canvas.append("text")
                .attr("x", LEFT - axesOffset - 1.5*labelOffset)
                .attr("y", (TOP + BOTTOM)/2)
                .attr("text-anchor", "middle")
                .attr("transform", "rotate (-90 " + (LEFT - axesOffset - 1.5*labelOffset) + " " + ((TOP + BOTTOM)/2) + ")")
                .attr("font-size", fontSizes["label"] )
                .text("Count")
                .attr("fill", "black");
                                    
        xStep = plotWidth/numberOfGroovesInXAxis;
        
        canvas.append("line")
                    .attr("x1", LEFT)
                    .attr("y1", BOTTOM + axesOffset)
                    .attr("x2", RIGHT)
                    .attr("y2", BOTTOM + axesOffset) 
                    .attr("stroke", "black")
                    .attr("stroke-width", strokeWidth["axis"])
                    .attr("id", "xAxis")
                    .attr("class", "axes");
    
        // X-grooves

        for(j=0; j<=numberOfGroovesInXAxis; j++)
        {
            canvas.append("line")
                        .attr("x1", LEFT + j*xStep)
                        .attr("y1", BOTTOM  + axesOffset)
                        .attr("x2", LEFT + j*xStep)
                        .attr("y2", BOTTOM + tickLength + axesOffset)
                        .attr("id", "groove" + j)
                        .attr("stroke-width", strokeWidth["tick"])
                        .attr("class", "xAxisGrooves");
    
            canvas.append("text")
                        .attr("x", LEFT + j*xStep + xStep/2)
                        .attr("y", BOTTOM + tickTextOffsetXAxis + axesOffset)
                        .text(uniqueData[j])
                        .attr("text-anchor", "middle")
                        .attr("font-size", fontSizes["tick"] )
                        .attr("id", "groove" + j)
                        .attr("class", "xAxisGrooveText");
        }
    
        // Y-grooves

        var yStep;
    
        for(i=0; i<labels.length; i++)
        {
            yStep = individualPlotHeight/(nGroovesY-1);
            
            canvas.append("line")
                    .attr("x1", LEFT - axesOffset)
                    .attr("y1", BOTTOM - individualPlotHeight - i*yDiffForPlots)
                    .attr("x2", LEFT - axesOffset)
                    .attr("y2", BOTTOM - i*yDiffForPlots)
                    .attr("stroke", "black")
                    .attr("stroke-width", strokeWidth["axis"])
                    .attr("id", "yAxis")
                    .attr("class", "axes");
        
            for(j=0; j<nGroovesY; j++)
            {
                canvas.append("line")
                            .attr("x1", LEFT - tickLength - axesOffset)
                            .attr("y1", BOTTOM - j*yStep - i*yDiffForPlots)
                            .attr("x2", LEFT - axesOffset)
                            .attr("y2", BOTTOM - j*yStep - i*yDiffForPlots)
                            .attr("id", "groove" + j)
                            .attr("stroke-width", strokeWidth["tick"])
                            .attr("class", "yAxisGrooves");
        
                canvas.append("text")
                            .attr("x", LEFT - tickTextOffsetYAxis - axesOffset)
                            .attr("y", BOTTOM - j*yStep + parseFloat(fontSizes["tick"])/2 - i*yDiffForPlots)                                        
                            .text(Math.round(j*binSlice))
                            .attr("text-anchor", "end")
                            .attr("font-size", fontSizes["tick"] )
                            .attr("id", "groove" + j)
                            .attr("class", "yAxisGrooveText");
            }
        }
    
        // Bars
        for(i=0; i<labels.length; i++)
        {
            for(j=0; j<uniqueData.length+2; j++)
            {           
                if(bins[labels[i]][j] != 0)
                {                    
                    canvas.append("text")
                            .attr("x", LEFT + j*xStep + xStep/2)                        
                            .attr("y", BOTTOM - (bins[labels[i]][j]/Array.max(binMaxs))*individualPlotHeight - yAxisTickTextOffset - i*yDiffForPlots)
                            .attr("fill", "black")
                            .attr("text-anchor", "middle")
                            .attr("font-size", fontSizes["bin text"] )
                            .attr("display", "none")
                            .text(bins[labels[i]][j])
                            .attr("id", ids[i] + j)
                            .attr("class", "binTexts");
                }
                        
                canvas.append("rect")
                            .attr("x", LEFT + j*xStep)
                            .attr("y", BOTTOM - (bins[labels[i]][j]/Array.max(binMaxs))*individualPlotHeight - i*yDiffForPlots)
                            .attr("height", (bins[labels[i]][j]/Array.max(binMaxs))*individualPlotHeight)
                            .attr("width", plotWidth/uniqueData.length)          
                            .attr("fill", colors[i])         
                            .attr("stroke-width", strokeWidth["histogram.bar"])
                            .attr("id", ids[i] + j)
                            .attr("class", "bins");
            
                        
            }
        }
    }
    else
    {
        // Should be changeable
        var numberOfGroovesInXAxis = nBins;
    
        var slice = (max - min)/nBins;    
    
        var bins = new Object();
        var canvas = d3.select("#plotCanvas");
    
        // Set all bin count to zero
        for(var i=0; i<labels.length; i++)
        {
            bins[labels[i]] = new Array();
            for(var j=0; j<nBins; j++)
            {
                bins[labels[i]][j] = 0;
            }  
        }
    
        // Update counts
        for(var i=0; i<labels.length; i++)
        {
            for(var j=0; j<data[i].length; j++)
            {           
                var index = Math.ceil((data[i][j] - min)/slice);
            
                if(index >= nBins)
                    index = nBins - 1;
                
                bins[labels[i]][index]++;         
            }
        }
    
        var binMaxs = new Array();
        var binMins = new Array();
    
        for(var i=0; i<labels.length; i++)
        {
            binMaxs[i] = Array.max(bins[labels[i]]);        
        }
        
         // Find ticks   
        var nGroovesY = findTicksForHistogramFrequencyAxis(Array.max(binMaxs));  
        var individualPlotHeight = labels.length > 1 ? (plotHeight/labels.length)-axesOffset : plotHeight;
        yDiffForPlots = labels.length > 1 ? (plotHeight/labels.length) : plotHeight;

        drawHistogramLegends(varNames);
        
        nGroovesY = Math.ceil(nGroovesY * (individualPlotHeight/plotHeight));
        nGroovesY = nGroovesY < 2 ? 2 : nGroovesY;
        var binSlice = Array.max(binMaxs)/(nGroovesY-1);
        
        canvas.append("text")
                .attr("x", LEFT - axesOffset - 1.25*labelOffset)
                .attr("y", (TOP + BOTTOM)/2)
                .attr("text-anchor", "middle")
                .attr("transform", "rotate (-90 " + (LEFT - axesOffset - 1.25*labelOffset) + " " + ((TOP + BOTTOM)/2) + ")")
                .attr("font-size", fontSizes["label"] )
                .text("Count")
                .attr("fill", "black");
        
        canvas.append("line")
                    .attr("x1", LEFT)
                    .attr("y1", BOTTOM + axesOffset)
                    .attr("x2", RIGHT)
                    .attr("y2", BOTTOM + axesOffset) 
                    .attr("stroke", "black")
                    .attr("stroke-width", strokeWidth["axis"])
                    .attr("id", "xAxis")
                    .attr("class", "axes");  
        
        xStep = plotWidth/numberOfGroovesInXAxis;

        //grooves
        for(j=0; j<=numberOfGroovesInXAxis; j++)
        {
            canvas.append("line")
                        .attr("x1", LEFT + j*xStep)
                        .attr("y1", BOTTOM  + axesOffset)
                        .attr("x2", LEFT + j*xStep)
                        .attr("y2", BOTTOM + 10 + axesOffset)
                        .attr("id", "groove" + j)
                        .attr("stroke-width", strokeWidth["tick"])
                        .attr("class", "xAxisGrooves");

            canvas.append("text")
                        .attr("x", LEFT + j*xStep)
                        .attr("y", BOTTOM + tickTextOffsetXAxis + axesOffset)
                        .text(dec2(min + j*slice))
                        .attr("text-anchor", "middle")
                        .attr("font-size", fontSizes["tick"] )
                        .attr("id", "groove" + j)
                        .attr("class", "xAxisGrooveText");
        }

        var yStep;
        for(i=0; i<labels.length; i++)
        {
            yStep = individualPlotHeight/(nGroovesY-1);
            
            canvas.append("line")
                    .attr("x1", LEFT - axesOffset)
                    .attr("y1", BOTTOM - i*yDiffForPlots)
                    .attr("x2", LEFT - axesOffset)
                    .attr("y2", BOTTOM - individualPlotHeight - i*yDiffForPlots)
                    .attr("stroke", "black")
                    .attr("stroke-width", strokeWidth["axis"])
                    .attr("id", "yAxis")
                    .attr("class", "axes");
            
            for(j=0; j<nGroovesY; j++)
            {
                canvas.append("line")
                            .attr("x1", LEFT - 10 - axesOffset)
                            .attr("y1", BOTTOM - j*yStep - i*yDiffForPlots)
                            .attr("x2", LEFT - axesOffset)
                            .attr("y2", BOTTOM - j*yStep -  i*yDiffForPlots)
                            .attr("stroke-width", strokeWidth["tick"])
                            .attr("id", "groove" + j)
                            .attr("class", "yAxisGrooves");
        
                canvas.append("text")
                            .attr("x", LEFT - tickTextOffsetYAxis - axesOffset)
                            .attr("y", BOTTOM - j*yStep + yAxisTickTextOffset - i*yDiffForPlots)                                        
                            .text(Math.round(j*binSlice))
                            .attr("text-anchor", "end")
                            .attr("font-size", fontSizes["tick"] )
                            .attr("id", "groove" + j)
                            .attr("class", "yAxisGrooveText");
            }
        }
        
        //bars
        for(i=0; i<labels.length; i++)
        {
            for(j=0; j<nBins; j++)
            {           
                if(bins[labels[i]][j] != 0)
                {                    
                    canvas.append("text")
                            .attr("x", LEFT + j*xStep + xStep/2)                        
                            .attr("y", BOTTOM - (bins[labels[i]][j]/Array.max(binMaxs))*individualPlotHeight - i*yDiffForPlots - yAxisTickTextOffset)
                            .attr("fill", "black")
                            .attr("text-anchor", "middle")
                            .attr("font-size", fontSizes["tick"] )
                            .attr("display", "none")
                            .text(bins[labels[i]][j])
                            .attr("id", ids[i] + j)
                            .attr("class", "binTexts");
                }
                        
                canvas.append("rect")
                            .attr("x", LEFT + j*xStep)
                            .attr("y", BOTTOM - (bins[labels[i]][j]/Array.max(binMaxs))*individualPlotHeight - i*yDiffForPlots)
                            .attr("height", (bins[labels[i]][j]/Array.max(binMaxs))*individualPlotHeight)
                            .attr("width", plotWidth/nBins)          
                            .attr("fill", colors[i])    
                            .attr("stroke-width", strokeWidth["histogram.bar"])     
                            .attr("id", ids[i] + j)
                            .attr("class", "bins");
            }
        }
    }
}

function plotHistogramWithDensityCurve(LEFT, TOP, histWidth, histHeight, dependentVariable, level, distributionType)
{
    var variableList = sort(selectedVariables);
    
    var RIGHT = LEFT + histWidth;
    var BOTTOM = TOP + histHeight;
    
    var data;
    var min;
    var max;

    nBins = 10;
    
    // get data
    if(variableList["independent"].length == 2)
    {        
        var levels = level.split("-");        
        data = colourBoxPlotData[levels[0]][levels[1]];
    }
    else
    {   
        data = variables[dependentVariable][level];
        nBins = nBinsArray[dependentVariable][level] > 15 ? 15 : nBinsArray[dependentVariable][level];
    }

    min = Array.min(data);
    max = Array.max(data);

    var m, sd;
    m = mean(data);
    sd = getStandardDeviation(data);

    var normalizedData = [];

    for(var i=0; i<data.length; i++)
    {
        normalizedData[i] = ((data[i] - min)*(RIGHT - LEFT))/(max - min);        
    }

    var M = mean(normalizedData)
    var SD = getStandardDeviation(normalizedData);

    // console.log("min = " + min + ", max = " + max);
    // console.log("actual mean = " + m + ", modified mean = " + M);
    // console.log("actual SD = " + sd + ", modified SD = " + SD);
    
    var shortAxesOffset = axesOffset*(histWidth/plotWidth);    
    var shortLabelOffset = labelOffset*(histWidth/plotWidth);    
    var id = level;              
    var numberOfGroovesInXAxis = 1; //make this into a dynamic variable    
    
    var slice = (max - min)/nBins;    

    var bins = [];
    var canvas = d3.select("#plotCanvas"); //this should be changed
    
    curveX = [];
    curveY = [];

    // Set all bin count to zero
    for(var i=0; i<nBins; i++)
    {
        bins[i] = 0;
    }  

    // Binning
    for(var i=0; i<data.length; i++)
    {
        var index = Math.ceil((data[i] - min)/slice);
        
        if(index >= nBins)
            index = nBins - 1;
        
        bins[index]++;                 
    }

    var maxBinSize = Array.max(bins);
    
    // Find ticks   
    var nGroovesY = Math.ceil(findTicksForHistogramFrequencyAxis(maxBinSize)*(histWidth/plotWidth)); 
    
    nGroovesY = nGroovesY < 2 ? 2: nGroovesY;
    var binSlice = maxBinSize/(nGroovesY-1);

    // Draw axes
    
    var xAxis = canvas.append("line")
                                    .attr("x1", LEFT)
                                    .attr("y1", BOTTOM + shortAxesOffset)
                                    .attr("x2", RIGHT)
                                    .attr("y2", BOTTOM + shortAxesOffset) 
                                    .attr("stroke", "black")
                                    .attr("id", "xAxis")
                                    .attr("class", "densityCurve");

    var yAxis = canvas.append("line")
                                    .attr("x1", LEFT - shortAxesOffset)
                                    .attr("y1", TOP)
                                    .attr("x2", LEFT - shortAxesOffset)
                                    .attr("y2", BOTTOM)
                                    .attr("stroke", "black")
                                    .attr("id", "yAxis")
                                    .attr("class", "densityCurve");

    // Y-axis label
    canvas.append("text")
            .attr("x", LEFT - shortAxesOffset - shortLabelOffset)
            .attr("y", (BOTTOM + TOP)/2)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate (-90 " + (LEFT - shortAxesOffset - shortLabelOffset) + " " + ((TOP + BOTTOM)/2) + ")")
            .attr("font-size", scaleForWindowSize(12) )
            .attr("class", "densityCurve")
            .text("Count");

                                
    xStep = histWidth/numberOfGroovesInXAxis;

    // Draw grooves

    if(document.getElementsByClassName("means").length <= 4)
    {
        for(i=0; i<=numberOfGroovesInXAxis; i++)
        {
            canvas.append("line")
                        .attr("x1", LEFT + i*xStep)
                        .attr("y1", BOTTOM  + shortAxesOffset)
                        .attr("x2", LEFT + i*xStep)
                        .attr("y2", BOTTOM + 10 + shortAxesOffset)
                        .attr("id", "groove" + i)
                        .attr("stroke", "black")
                        .attr("class", "densityCurve");
            
            var textAnchor = "end";
            if(i == 0)
                textAnchor = "start";
            
            canvas.append("text")
                        .attr("x", LEFT + i*xStep)
                        .attr("y", BOTTOM + tickTextOffsetXAxis + shortAxesOffset)                    
                        .text(dec2(min + i*(max-min)))
                        .attr("text-anchor", textAnchor)
                        .attr("font-size", scaleForWindowSize(12) )
                        .attr("id", "groove" + i)
                        .attr("class", "densityCurve");
        }
    }


    xStep  = histWidth/nBins;
    var fillColor = distributionType == "normal" ? "green" : "red";

    for(i=0; i<nBins; i++)
    {           
        canvas.append("rect")
                    .attr("x", LEFT + i*xStep)
                    .attr("y", BOTTOM - (bins[i]/maxBinSize)*histHeight)
                    .attr("height", (bins[i]/maxBinSize)*histHeight)
                    .attr("width", histWidth/nBins)          
                    .attr("fill", fillColor)         
                    .attr("class", "densityCurve");
    }

    // Plotting the normal curve

    var denominator = (SD * Math.sqrt(2*Math.PI));
    var bezierCurvePath = "M";

    for(var x=LEFT; x<=RIGHT; x++)
    {
        var y = (Math.exp((-Math.pow(((x - LEFT) - M), 2))/(2*Math.pow(SD, 2))))/denominator;    

        var X = x;
        var Y = BOTTOM - ((y * (BOTTOM - TOP))/(1/denominator));

        if(x == LEFT)
            bezierCurvePath += dec2(X) + "," + dec2(Y) + " L";
        else if(x+1 > RIGHT)
            bezierCurvePath += dec2(X) + "," + dec2(Y) ;
        else
            bezierCurvePath += dec2(X) + "," + dec2(Y) + " ";
    }

    canvas.append("path")
            .attr("d", bezierCurvePath)
            .attr("stroke", "black")
            .attr("stroke-width", "2px")
            .attr("stroke-dasharray", "5,5")
            .attr("fill", "none")
            .attr("class", "densityCurve");
}

function drawHistogramLegends(varNames)
{
    var canvas = d3.select("#plotCanvas");
    
    var xStep = (plotPanelWidth - 3*histLegendSize)/5;
    
    for(var i=0; i<varNames.length; i++)
    {
        canvas.append("rect")
                .attr("x", (5-i)*xStep)
                .attr("y", scaleForWindowSize(10))
                .attr("width", histLegendSize)
                .attr("height", histLegendSize)
                .attr("fill", colors[i])
                .attr("stroke", "black")
                .attr("id", "legend" + i)
                .attr("class", "rect");
        
        canvas.append("text")
                .attr("x", (5-i)*xStep + histLegendSize/2)
                .attr("y", 1.5*histLegendSize + scaleForWindowSize(10)*2)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .attr("font-size", fontSizes["tick"] )
                .text(varNames[i])
                .attr("id", "legend" + i)
                .attr("class", "text");
            
    }
}

function getBinCenterX(j)
{
    return LEFT + j*xStep + xStep/2;
}

//Returns the largest possible factor for the given number so that there are a maximum of 10 ticks
function findTicksForHistogramFrequencyAxis(number)
{
    var factor = 0;
    if((isPrime(number)) && (number > 10))
    {
        number = number + 1;  //so that we get a non-prime  
    }
    
    //we now have a non-prime number
    for(var i=1; i<=number/2; i++)
    {
        if((number%i == 0) && (number/i <= 10))
        {
            factor = i;
            break;
        }
    }
    
    return (number/factor)+1;
}

//On hovering over a bin, highlight that bin
function highlightBinWithId(ID)
{
    var bins = document.getElementsByClassName("bins");
    var binTexts = document.getElementsByClassName("binTexts");
    
    for(var i=0; i<bins.length; i++)
    {    
        if(removeAlphabetsFromString(bins[i].getAttribute("id")) != removeAlphabetsFromString(ID))
        {
            bins[i].setAttribute("opacity", "0.355");
        }
        else
        {
            bins[i].setAttribute("opacity", "1.0");
            
            binText = d3.select("#" + bins[i].getAttribute("id") + ".binTexts");
            
            if(binText.length > 0)
            {                
                binText.attr("display", "inline");                
            }
        }
    }
}

//On hovering out from a bin, restore the opacity of all bins
function unhighlightBins()
{
    var bins = document.getElementsByClassName("bins");
    var binTexts = document.getElementsByClassName("binTexts");
    
    for(var i=0; i<bins.length; i++)
    {   
        bins[i].setAttribute("opacity", "1.0");

        binTexts = d3.selectAll(".binTexts");
            
        if(binTexts.length > 0)
        {
            binTexts.attr("display", "none");
        }
    }
}