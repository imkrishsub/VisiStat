var LEFT, RIGHT, TOP, BOTTOM, xStep;
var yDiffForPlots;
function makeHistogram()
{      
    // TODO: Need to constrain the selection to 3 variables
    
    // boundaries
    LEFT = canvasWidth/2 - plotWidth/2;
    RIGHT = canvasWidth/2 + plotWidth/2;
    
    TOP = canvasHeight/2 - plotHeight/2;
    BOTTOM = canvasHeight/2 + plotHeight/2;            
    
    var canvas = d3.select("#plotCanvas");

    var data = [];
    var mins = [];
    var maxs = [];
    var varNames = [];
    
    var combinedData = [];
    
    var altHistogram = false;
    
    var variableList = sort(currentVariableSelection);
    
    if(currentVariableSelection.length > 1)
    {
        //if more than 2 variables are selected
        switch(variableList["independent"].length)
        {
            case 0:
                    {
                        for(var i=0; i<variableList["dependent"].length; i++)
                        {
                            data[i] = variables[variableList["dependent"][i]]["dataset"];      
                            varNames[i] = variableList["dependent"][i];      
                            mins[i] = MIN[variableList["dependent"][i]]["dataset"];      
                            maxs[i] = MAX[variableList["dependent"][i]]["dataset"];                                  
                        }
                        
                        break;                    
                    }
            case 1:
                    {
                        altHistogram = true;
                        for(var i=0; i<variableList["independent-levels"].length; i++)
                        {
                            data[i] = variables[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            varNames[i] = variableList["dependent"][0] + "[" + variableList["independent-levels"][i] + "]";
                            mins[i] = MIN[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            maxs[i] = MAX[variableList["dependent"][0]][variableList["independent-levels"][i]];                            
                        }
                        break;
                    }
            default:
                    {
                        //this shouldn't happen!
                    }
        }
    }
    else
    {
        data[0] = variables[currentVariableSelection[0]]["dataset"];      
        varNames[0] = currentVariableSelection[0];
        mins[0] = MIN[currentVariableSelection[0]]["dataset"];      
        maxs[0] = MAX[currentVariableSelection[0]]["dataset"];       
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
    
    if(altHistogram == true)    
    {
        labels = levels;
    }    
    else    
    {        
        labels = currentVariableSelection;
    }
    
    var ids = getValidIds(labels);
    
    if(combinedData.unique().length < nBins)
    {
        //bar chart        
        var uniqueData = combinedData.unique();
        
        var numberOfGroovesInXAxis = uniqueData.length;
    
        var slice = (max - min)/uniqueData.length;    
    
        var bins = new Object();
    
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
                .attr("font-size", "24px")
                .text("Frequency")
                .attr("fill", "black");
    

                                    
        xStep = plotWidth/numberOfGroovesInXAxis;
        
        canvas.append("line")
                    .attr("x1", LEFT)
                    .attr("y1", BOTTOM + axesOffset)
                    .attr("x2", RIGHT)
                    .attr("y2", BOTTOM + axesOffset) 
                    .attr("stroke", "black")
                    .attr("id", "xAxis")
                    .attr("class", "axes");
    
        //grooves
        for(j=0; j<=numberOfGroovesInXAxis; j++)
        {
            canvas.append("line")
                        .attr("x1", LEFT + j*xStep)
                        .attr("y1", BOTTOM  + axesOffset)
                        .attr("x2", LEFT + j*xStep)
                        .attr("y2", BOTTOM + 10 + axesOffset)
                        .attr("id", "groove" + j)
                        .attr("class", "xAxisGrooves");
    
            canvas.append("text")
                        .attr("x", LEFT + j*xStep + xStep/2)
                        .attr("y", BOTTOM + tickTextOffsetXAxis + axesOffset)
                        .text(uniqueData[j])
                        .attr("text-anchor", "middle")
                        .attr("id", "groove" + j)
                        .attr("class", "xAxisGrooveText");
        }
    
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
                    .attr("id", "yAxis")
                    .attr("class", "axes");
        
            for(j=0; j<nGroovesY; j++)
            {
                canvas.append("line")
                            .attr("x1", LEFT - 10 - axesOffset)
                            .attr("y1", BOTTOM - j*yStep - i*yDiffForPlots)
                            .attr("x2", LEFT - axesOffset)
                            .attr("y2", BOTTOM - j*yStep - i*yDiffForPlots)
                            .attr("id", "groove" + j)
                            .attr("class", "yAxisGrooves");
        
                canvas.append("text")
                            .attr("x", LEFT - tickTextOffsetYAxis - axesOffset)
                            .attr("y", BOTTOM - j*yStep + yAxisTickTextOffset - i*yDiffForPlots)                                        
                            .text(Math.round(j*binSlice))
                            .attr("text-anchor", "end")
                            .attr("id", "groove" + j)
                            .attr("class", "yAxisGrooveText");
            }
        }
    
        //bars
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
                            .attr("font-size", binCountFontSize)
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
                            .attr("id", ids[i] + j)
                            .attr("class", "bins");
            
                        
            }
        }
    }
    else
    {
        // Should be changeable
        var numberOfGroovesInXAxis = 10;
    
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
                .attr("x", LEFT - axesOffset - 1.5*labelOffset)
                .attr("y", (TOP + BOTTOM)/2)
                .attr("text-anchor", "middle")
                .attr("transform", "rotate (-90 " + (LEFT - axesOffset - 1.5*labelOffset) + " " + ((TOP + BOTTOM)/2) + ")")
                .attr("font-size", "24px")
                .text("Frequency")
                .attr("fill", "black");
        
        canvas.append("line")
                    .attr("x1", LEFT)
                    .attr("y1", BOTTOM + axesOffset)
                    .attr("x2", RIGHT)
                    .attr("y2", BOTTOM + axesOffset) 
                    .attr("stroke", "black")
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
                        .attr("class", "xAxisGrooves");

            canvas.append("text")
                        .attr("x", LEFT + j*xStep)
                        .attr("y", BOTTOM + tickTextOffsetXAxis + axesOffset)
                        .text(dec2(min + j*slice))
                        .attr("text-anchor", "middle")
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
                    .attr("id", "yAxis")
                    .attr("class", "axes");
            
            for(j=0; j<nGroovesY; j++)
            {
                canvas.append("line")
                            .attr("x1", LEFT - 10 - axesOffset)
                            .attr("y1", BOTTOM - j*yStep - i*yDiffForPlots)
                            .attr("x2", LEFT - axesOffset)
                            .attr("y2", BOTTOM - j*yStep -  i*yDiffForPlots)
                            .attr("id", "groove" + j)
                            .attr("class", "yAxisGrooves");
        
                canvas.append("text")
                            .attr("x", LEFT - tickTextOffsetYAxis - axesOffset)
                            .attr("y", BOTTOM - j*yStep + yAxisTickTextOffset - i*yDiffForPlots)                                        
                            .text(Math.round(j*binSlice))
                            .attr("text-anchor", "end")
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
                            .attr("font-size", binCountFontSize)
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
                            .attr("id", ids[i] + j)
                            .attr("class", "bins");
            }
        }
    }
}

function makeHistogramWithDensityCurve(LEFT, TOP, histWidth, histHeight, dependentVariable, level, distributionType)
{
    var variableList = sort(currentVariableSelection);
    
    var RIGHT = LEFT + histWidth;
    var BOTTOM = TOP + histHeight;
    
    var data;
    var min;
    var max;
    
    if(variableList["independent"].length == 2)
    {
        console.log("level = " + level);
    }
    else
    {   
        data = variables[dependentVariable][level];
    }
    min = Array.min(data);
    max = Array.max(data);;
    
    var shortAxesOffset = axesOffset*(histWidth/plotWidth);
    
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

                                
    xStep = histWidth/numberOfGroovesInXAxis;

    //grooves
    for(i=0; i<=numberOfGroovesInXAxis; i++)
    {
        canvas.append("line")
                    .attr("x1", LEFT + i*xStep)
                    .attr("y1", BOTTOM  + shortAxesOffset)
                    .attr("x2", LEFT + i*xStep)
                    .attr("y2", BOTTOM + 10 + shortAxesOffset)
                    .attr("id", "groove" + i)
                    .attr("class", "densityCurve");
    
        canvas.append("text")
                    .attr("x", LEFT + i*xStep)
                    .attr("y", BOTTOM + tickTextOffsetXAxis + shortAxesOffset)                    
                    .text(dec2(min + i*(max-min)))
                    .attr("text-anchor", "middle")
                    .attr("id", "groove" + i)
                    .attr("class", "densityCurve");
    }


    xStep  = histWidth/nBins;
    curveX.push(LEFT);
    curveY.push(BOTTOM);
    //bins
    for(i=0; i<nBins; i++)
    {
        curveX.push(LEFT + i*xStep + xStep/2);
        
        curveY.push(BOTTOM - (bins[i]/maxBinSize)*histHeight);   
    }  
    
    curveX.push(RIGHT);
    curveY.push(BOTTOM);
    
    var xscale = d3.scale.linear()
                .domain([d3.min(curveX), d3.max(curveX)])
                .range([LEFT, RIGHT]); 

    var yscale = d3.scale.linear()
        .domain([d3.min(curveY), d3.max(curveY)])
        .range([TOP, BOTTOM]) //svg corner starts at top left

    var line = d3.svg.line()
        .x(function(d) {
          //for each x value we map it to the pixel value
          return xscale(d);
        })
        .y(function(d,i) {
          //for each data point we perform our y function and then
          //map that value to pixels
          return yscale(curveY[i]);
        })
        .interpolate("basis");

    var path = canvas.append("path")
      .data([curveX])
      .attr("d", line) //this calls the line function with this element's data
      .style("fill", "none")
      .style("stroke", densityCurveColors[distributionType])
      .attr("stroke-width", "2px")
      .attr("id", level)
      .attr("class", "densityCurve");
}

function drawHistogramLegends(varNames)
{
    var canvas = d3.select("#sideBarCanvas");
    
    var yStep = plotHeight/10;
    
    for(var i=0; i<varNames.length; i++)
    {
        canvas.append("rect")
                .attr("x", sideBarWidth/4)
                .attr("y", BOTTOM - i*yDiffForPlots - yDiffForPlots/2 - histLegendSize/2)
                .attr("width", histLegendSize)
                .attr("height", histLegendSize)
                .attr("fill", colors[i])
                .attr("stroke", "black")
                .attr("id", "legend" + i)
                .attr("class", "rect");
        
        canvas.append("text")
                .attr("x", sideBarWidth/2 + histLegendSize)
                .attr("y", BOTTOM - i*yDiffForPlots - yDiffForPlots/2 + 3)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .attr("font-size", fontSizeTicks + "px")
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
            bins[i].setAttribute("opacity", "0.25");
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