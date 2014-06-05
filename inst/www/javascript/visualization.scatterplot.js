//boundaries    
var LEFT;
var RIGHT;

var TOP;
var BOTTOM;

var data = new Object(); 
var mins = new Object();
var maxs = new Object();

var uniqueDataX, uniqueDataY;
var xStep, yStep;
    
   
function makeScatterplot()
{   
    logListVisualizations.push(
        {
            time: new Date().getTime(), 
            dataset: sessionStorage.fileName,
            variables: currentVariableSelection.slice(0).join("|"),
            visualization: "scatterplot"
        }
    );

    writeToFileVisualizations(sessionStorage.logFileName + "_visualizations");
    // graphics
    LEFT = plotPanelWidth/2 - plotWidth/2;
    RIGHT = plotPanelWidth/2 + plotWidth/2;

    TOP = plotPanelHeight/2 - plotHeight/2 - topOffset;
    BOTTOM = plotPanelHeight/2 + plotHeight/2 - topOffset;

    var canvas = d3.select("#plotCanvas");
    
    if(currentVariableSelection.length == 3)
    {
        var variableList = getSelectedVariables();
        
        if(variableList["dependent"].length == 2 && variableList["independent"].length == 1)
        {
            if(currentVariableSelection[2] != variableList["independent"][0])
            {
                if(currentVariableSelection[1] == variableList["independent"][0])
                {
                    var temp = currentVariableSelection[2];
                    currentVariableSelection[2] = currentVariableSelection[1];
                    currentVariableSelection[1] = temp;
                }
                else
                {
                    var temp = currentVariableSelection[2];
                    currentVariableSelection[2] = currentVariableSelection[0];
                    currentVariableSelection[0] = temp;
                }
            }
        }
        else if(variableList["independent"].length == 2 && variableList["dependent"].length == 1)
        {
            if((currentVariableSelection[2] != variableList["independent"][0]) && (currentVariableSelection[2] != variableList["independent"][1]))
            {
                var temp = currentVariableSelection[2];
                currentVariableSelection[2] = currentVariableSelection[1];
                currentVariableSelection[1] = temp;
            }
        }
    }   

    // getting data
    data["X"] = variables[currentVariableSelection[0]]["dataset"];
    data["Y"] = variables[currentVariableSelection[1]]["dataset"];
    
    mins["X"] = MIN[currentVariableSelection[0]]["dataset"];
    mins["Y"] = MIN[currentVariableSelection[1]]["dataset"];
    
    maxs["X"] = MAX[currentVariableSelection[0]]["dataset"];
    maxs["Y"] = MAX[currentVariableSelection[1]]["dataset"];
    
    findCorrelationCoefficient(currentVariableSelection[0], currentVariableSelection[1]);
    
    var colorData;
    var uniqueColorData;
    
    var colorsForPlot = new Object();
    var varNames = [];
    
    if((currentVariableSelection.length == 3))
    {
        if(parseInt(variables[currentVariableSelection[2]]["dataset"].unique().length) <= 10)
        {
            colorData = variables[currentVariableSelection[2]]["dataset"];
            uniqueColorData = colorData.unique();
        
            for(var i=0; i<uniqueColorData.length; i++)
            {
                colorsForPlot[uniqueColorData[i]] = colors[i];
                varNames[i] = uniqueColorData[i];
            }
            drawScatterPlotLegends(varNames);
        }
    }    
    
    var ids = currentVariableSelection;
    
    
    // Draw axes
        
    canvas.append("line")
              .attr("x1", LEFT)
              .attr("y1", BOTTOM + axesOffset)
              .attr("x2", RIGHT)
              .attr("y2", BOTTOM + axesOffset) 
              .attr("stroke", "black")
              .attr("id", "xAxis")
              .attr("class", "axes");
              
    canvas.append("text")
                .attr("x", (LEFT + RIGHT)/2)
                .attr("y", BOTTOM + axesOffset + 1.25*labelOffset)
                .attr("text-anchor", "middle")
                .attr("font-size", fontSizeLabels + "px")
                .text(currentVariableSelection[0])
                .attr("fill", "black");
    
    canvas.append("line")
              .attr("x1", LEFT - axesOffset)
              .attr("y1", TOP)
              .attr("x2", LEFT - axesOffset)
              .attr("y2", BOTTOM)
              .attr("stroke", "black")
              .attr("id", "yAxis")              
              .attr("class", "axes");
    
    canvas.append("text")
                .attr("x", LEFT - axesOffset - 1.25*labelOffset)
                .attr("y", (TOP + BOTTOM)/2)
                .attr("text-anchor", "middle")
                .attr("transform", "rotate (-90 " + (LEFT - axesOffset - 1.25*labelOffset) + " " + ((TOP + BOTTOM)/2) + ")")
                .attr("font-size", fontSizeLabels + "px")
                .text(currentVariableSelection[1])
                .attr("fill", "black");
                                    
    
    //grooves
    
    uniqueDataX = data["X"].unique().sort();
    uniqueDataY = data["Y"].unique().sort();  
    
    var numberOfGroovesInXAxis = uniqueDataX.length > numberOfGrooves ? numberOfGrooves : uniqueDataX.length;
    var numberOfGroovesInYAxis = uniqueDataY.length > numberOfGrooves ? numberOfGrooves : uniqueDataY.length;
    
    //y-axis grooves
    xStep = uniqueDataX.length <= numberOfGrooves ? plotWidth/numberOfGroovesInXAxis : plotWidth/(numberOfGroovesInXAxis - 1);
    yStep = uniqueDataY.length <= numberOfGrooves ? plotHeight/numberOfGroovesInYAxis : plotHeight/(numberOfGroovesInYAxis - 1);
    
    var xSlice = (maxs["X"] - mins["X"])/(numberOfGroovesInXAxis - 1);    
    var ySlice = (maxs["Y"] - mins["Y"])/(numberOfGroovesInYAxis - 1);    
    
    var axisText, textPosition;
    //grooves
    for(i=0; i<numberOfGroovesInXAxis; i++)
    {
        axisText = dec2(mins["X"] + i*xSlice);
        textPosition = LEFT + i*xStep;
        
        if(uniqueDataX.length <= numberOfGrooves)
        {
            axisText = uniqueDataX[i];
            textPosition = LEFT + xStep/2 + i*xStep;
        }
        
        canvas.append("line")
                    .attr("x1", textPosition)
                    .attr("y1", BOTTOM + axesOffset)
                    .attr("x2", textPosition)
                    .attr("y2", BOTTOM + 10 + axesOffset)
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooves");
        
        canvas.append("text")
                    .attr("x", textPosition)
                    .attr("y", BOTTOM + tickTextOffsetXAxis + axesOffset)                    
                    .text(axisText)
                    .attr("font-size", fontSizeTicks + "px")
                    .attr("text-anchor", "middle")
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooveText");
    }
    
    for(i=0; i<numberOfGroovesInYAxis; i++)
    {
        axisText = dec2(mins["Y"] + i*ySlice);
        textPosition = BOTTOM - i*yStep;                  
        
        if(uniqueDataY.length <= numberOfGrooves)
        {
            axisText = uniqueDataY[i];
            textPosition = BOTTOM - yStep/2 - i*yStep;                    
        }
        
        canvas.append("line")
                    .attr("x1", LEFT - 10 - axesOffset)
                    .attr("y1", textPosition)
                    .attr("x2", LEFT  - axesOffset)
                    .attr("y2", textPosition)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");
        
        canvas.append("text")
                    .attr("x", LEFT - tickTextOffsetYAxis - axesOffset)
                    .attr("y", textPosition + yAxisTickTextOffset)                     
                    .text(axisText)
                    .attr("font-size", fontSizeTicks + "px")
                    .attr("text-anchor", "end")
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }
    
    for(var i=0; i<data["X"].length; i++)
    {
        var x,y;
        
        if(uniqueDataX.length <= numberOfGrooves)
            x = LEFT + uniqueDataX.indexOf(data["X"][i])*xStep + xStep/2;    
        else
            x = LEFT + getValue1(data["X"][i], mins["X"], maxs["X"])*plotWidth;
            
        if(uniqueDataY.length <= numberOfGrooves)
            y = BOTTOM - uniqueDataY.indexOf(data["Y"][i])*yStep - yStep/2;
        else
            y = BOTTOM - getValue1(data["Y"][i], mins["Y"], maxs["Y"])*plotHeight;
        
        
        
        var color = getObjectLength(colorsForPlot) > 0 ? colorsForPlot[colorData[i]] : "black";        
        
        canvas.append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", datapointRadius)
                    .attr("fill", color)
                    .attr("id", "data" + i)
                    .attr("class", "datapoints");     
    }
}

function makeScatterplotHistory()
{       
    var LEFT = scaleForWindowSize(75);
    var RIGHT = entryWidth - scaleForWindowSize(100);
    
    var TOP = currentHistoryY + scaleForWindowSize(50);
    var BOTTOM = currentHistoryY + entryHeight - scaleForWindowSize(50)

    var sideCanvas = d3.select("#sideCanvas");
    
    if(currentVariableSelection.length == 3)
    {
        var variableList = getSelectedVariables();
        
        if(variableList["dependent"].length == 2 && variableList["independent"].length == 1)
        {
            if(currentVariableSelection[2] != variableList["independent"][0])
            {
                if(currentVariableSelection[1] == variableList["independent"][0])
                {
                    var temp = currentVariableSelection[2];
                    currentVariableSelection[2] = currentVariableSelection[1];
                    currentVariableSelection[1] = temp;
                }
                else
                {
                    var temp = currentVariableSelection[2];
                    currentVariableSelection[2] = currentVariableSelection[0];
                    currentVariableSelection[0] = temp;
                }
            }
        }
        else if(variableList["independent"].length == 2 && variableList["dependent"].length == 1)
        {
            if((currentVariableSelection[2] != variableList["independent"][0]) && (currentVariableSelection[2] != variableList["independent"][1]))
            {
                var temp = currentVariableSelection[2];
                currentVariableSelection[2] = currentVariableSelection[1];
                currentVariableSelection[1] = temp;
            }
        }
    }   

    // getting data
    data["X"] = variables[currentVariableSelection[0]]["dataset"];
    data["Y"] = variables[currentVariableSelection[1]]["dataset"];
    
    mins["X"] = MIN[currentVariableSelection[0]]["dataset"];
    mins["Y"] = MIN[currentVariableSelection[1]]["dataset"];
    
    maxs["X"] = MAX[currentVariableSelection[0]]["dataset"];
    maxs["Y"] = MAX[currentVariableSelection[1]]["dataset"];
    
    // findCorrelationCoefficient(currentVariableSelection[0], currentVariableSelection[1]);
    
    var colorData;
    var uniqueColorData;
    
    var colorsForPlot = new Object();
    var varNames = [];
    
    if((currentVariableSelection.length == 3))
    {
        if(parseInt(variables[currentVariableSelection[2]]["dataset"].unique().length) <= 10)
        {
            colorData = variables[currentVariableSelection[2]]["dataset"];
            uniqueColorData = colorData.unique();
        
            for(var i=0; i<uniqueColorData.length; i++)
            {
                colorsForPlot[uniqueColorData[i]] = colors[i];
                varNames[i] = uniqueColorData[i];
            }
            // drawScatterPlotLegends(varNames);
        }
    }    
    
    var ids = currentVariableSelection;
    
    
    // Draw axes
        
    sideCanvas.append("line")
              .attr("x1", LEFT)
              .attr("y1", BOTTOM + scaleToHistoryEntry(axesOffset))
              .attr("x2", RIGHT)
              .attr("y2", BOTTOM + scaleToHistoryEntry(axesOffset))
              .attr("stroke", "black");
              
    sideCanvas.append("text")
                .attr("x", (LEFT + RIGHT)/2)
                .attr("y", BOTTOM + scaleToHistoryEntry(axesOffset + 1.25*labelOffset))
                .attr("text-anchor", "middle")
                .attr("font-size", scaleToHistoryEntry(fontSizeLabels) + "px")
                .text(currentVariableSelection[0])
                .attr("fill", "black");
    
    sideCanvas.append("line")
              .attr("x1", LEFT - scaleToHistoryEntry(axesOffset))
              .attr("y1", TOP)
              .attr("x2", LEFT - scaleToHistoryEntry(axesOffset))
              .attr("y2", BOTTOM)
              .attr("stroke", "black");
    
    sideCanvas.append("text")
                .attr("x", LEFT - scaleToHistoryEntry(axesOffset + 1.25*labelOffset))
                .attr("y", (TOP + BOTTOM)/2)
                .attr("text-anchor", "middle")
                .attr("transform", "rotate (-90 " + (LEFT - scaleToHistoryEntry(axesOffset + 1.25*labelOffset)) + " " + ((TOP + BOTTOM)/2) + ")")
                .attr("font-size", scaleToHistoryEntry(fontSizeLabels) + "px")
                .text(currentVariableSelection[1])
                .attr("fill", "black");
                                    
    
    //grooves
    
    uniqueDataX = data["X"].unique().sort();
    uniqueDataY = data["Y"].unique().sort();  
    
    var numberOfGroovesInXAxis = uniqueDataX.length > numberOfGrooves ? numberOfGrooves : uniqueDataX.length;
    var numberOfGroovesInYAxis = uniqueDataY.length > numberOfGrooves ? numberOfGrooves : uniqueDataY.length;
    
    //y-axis grooves
    xStep = uniqueDataX.length <= numberOfGrooves ? (RIGHT - LEFT)/numberOfGroovesInXAxis : (RIGHT - LEFT)/(numberOfGroovesInXAxis - 1);
    yStep = uniqueDataY.length <= numberOfGrooves ? (BOTTOM - TOP)/numberOfGroovesInYAxis : (BOTTOM - TOP)/(numberOfGroovesInYAxis - 1);
    
    var xSlice = (maxs["X"] - mins["X"])/(numberOfGroovesInXAxis - 1);    
    var ySlice = (maxs["Y"] - mins["Y"])/(numberOfGroovesInYAxis - 1);    
    
    var axisText, textPosition;
    //grooves
    for(i=0; i<numberOfGroovesInXAxis; i++)
    {
        axisText = dec2(mins["X"] + i*xSlice);
        textPosition = LEFT + i*xStep;
        
        if(uniqueDataX.length <= numberOfGrooves)
        {
            axisText = uniqueDataX[i];
            textPosition = LEFT + xStep/2 + i*xStep;
        }
        
        sideCanvas.append("line")
                    .attr("x1", textPosition)
                    .attr("y1", BOTTOM + scaleToHistoryEntry(axesOffset))
                    .attr("x2", textPosition)
                    .attr("y2", BOTTOM + scaleToHistoryEntry(10 + axesOffset))
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooves");
        
        sideCanvas.append("text")
                    .attr("x", textPosition)
                    .attr("y", BOTTOM + scaleToHistoryEntry(tickTextOffsetXAxis + axesOffset))                    
                    .text(axisText)
                    .attr("font-size", scaleToHistoryEntry(fontSizeTicks) + "px")
                    .attr("text-anchor", "middle")
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooveText");
    }
    
    for(i=0; i<numberOfGroovesInYAxis; i++)
    {
        axisText = dec2(mins["Y"] + i*ySlice);
        textPosition = BOTTOM - i*yStep;                  
        
        if(uniqueDataY.length <= numberOfGrooves)
        {
            axisText = uniqueDataY[i];
            textPosition = BOTTOM - yStep/2 - i*yStep;                    
        }
        
        sideCanvas.append("line")
                    .attr("x1", LEFT - scaleToHistoryEntry(10 + axesOffset))
                    .attr("y1", textPosition)
                    .attr("x2", LEFT  - scaleToHistoryEntry(axesOffset))
                    .attr("y2", textPosition)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");
        
        sideCanvas.append("text")
                    .attr("x", LEFT - scaleToHistoryEntry(tickTextOffsetYAxis + axesOffset))
                    .attr("y", textPosition + scaleToHistoryEntry(yAxisTickTextOffset))
                    .text(axisText)
                    .attr("font-size", scaleToHistoryEntry(fontSizeTicks) + "px")
                    .attr("text-anchor", "end")
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }
    
    for(var i=0; i<data["X"].length; i++)
    {
        var x,y;
        
        if(uniqueDataX.length <= numberOfGrooves)
            x = LEFT + uniqueDataX.indexOf(data["X"][i])*xStep + xStep/2;    
        else
            x = LEFT + getValue1(data["X"][i], mins["X"], maxs["X"])*(RIGHT - LEFT);
            
        if(uniqueDataY.length <= numberOfGrooves)
            y = BOTTOM - uniqueDataY.indexOf(data["Y"][i])*yStep - yStep/2;
        else
            y = BOTTOM - getValue1(data["Y"][i], mins["Y"], maxs["Y"])*(BOTTOM - TOP);        
        
        var color = getObjectLength(colorsForPlot) > 0 ? colorsForPlot[colorData[i]] : "black";        
        
        sideCanvas.append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", scaleToHistoryEntry(datapointRadius))
                    .attr("fill", color)
                    .attr("id", "data" + i)
                    .attr("class", "datapoints");     
    }
}

function getValue1(number, min, max)
{
    return (number - min)/(max - min);
}

function drawScatterPlotLegends(varNames)
{
    // var canvas = d3.select("#sideBarCanvas");
    
    // var yStep = plotHeight/10;
    
    // for(var i=0; i<varNames.length; i++)
    // {
    //     canvas.append("circle")
    //             .attr("cx", sideBarWidth/2)
    //             .attr("cy", TOP + histLegendOffsetY + i*yStep)
    //             .attr("r", datapointRadius)
    //             .attr("fill", colors[i])
    //             .attr("id", "legend" + i)
    //             .attr("class", "circles");
        
    //     canvas.append("text")
    //             .attr("x", sideBarWidth/2 + histLegendSize)
    //             .attr("y", TOP + histLegendOffsetY + i*yStep + 3)
    //             .attr("fill", "black")
    //             .attr("font-size", fontSizeTicks + "px")
    //             .attr("text-anchor", "start")
    //             .text(varNames[i])
    //             .attr("id", "legend" + i)
    //             .attr("class", "text");
            
    // }

    var canvas = d3.select("#plotCanvas");
    
    var xStep = (plotPanelWidth - 2*histLegendSize)/10;
    
    for(var i=0; i<varNames.length; i++)
    {
        canvas.append("circle")
                .attr("x", (10-i)*xStep)
                .attr("y", scaleForWindowSize(10))
                .attr("width", histLegendSize)
                .attr("height", histLegendSize)
                .attr("fill", colors[i])                
                .attr("id", "legend" + i)
                .attr("class", "circles");
        
        canvas.append("text")
                .attr("x", (10-i)*xStep)
                .attr("y", 1.5*histLegendSize + scaleForWindowSize(10)*2)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .attr("font-size", fontSizeTicks + "px")
                .text(varNames[i])
                .attr("id", "legend" + i)
                .attr("class", "circles");
            
    }
}

function drawRegressionLine(intercept, slope)
{
    var canvas = d3.select("#plotCanvas");
    canvas.attr("viewBox", "0 0 " + plotPanelWidth + " " + parseFloat(plotPanelHeight+scaleForWindowSize(400)));    
    
    intercept = parseFloat(intercept);
    slope = parseFloat(slope);
    
    var x1, y1, x2, y2;
    
    var X1, X2;
    
    X1 = mins["X"];
    X2 = maxs["X"];
    
    Y1 = ((slope*X1) + intercept) > maxs["Y"] ? maxs["Y"] : ((slope*X1) + intercept);
    Y1 = ((slope*X1) + intercept) < mins["Y"] ? mins["Y"] : ((slope*X1) + intercept);
    
    Y2 = ((slope*X2) + intercept) > maxs["Y"] ? maxs["Y"] : ((slope*X2) + intercept);
    Y2 = ((slope*X2) + intercept) < mins["Y"] ? mins["Y"] : ((slope*X2) + intercept);
    
    if(uniqueDataX.length <= numberOfGrooves)
        x1 = LEFT + uniqueDataX.indexOf(X1)*xStep + xStep/2;    
    else
        x1 = LEFT + getValue1(X1, mins["X"], maxs["X"])*plotWidth;
        
    y1 = BOTTOM - getValue1(Y1, mins["Y"], maxs["Y"])*plotHeight;
    
    if(uniqueDataX.length <= numberOfGrooves)
        x2 = LEFT + uniqueDataX.indexOf(X2)*xStep + xStep/2;    
    else
        x2 = LEFT + getValue1(X2, mins["X"], maxs["X"])*plotWidth;
        
    y2 = BOTTOM - getValue1(Y2, mins["Y"], maxs["Y"])*plotHeight; 
    
    canvas.append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke", "#627bf4")
            .attr("stroke-width", "10px")
            .attr("id", "regressionLine");
            
    canvas.append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke", "transparent")
            .attr("stroke-width", "30px")
            .attr("id", "regressionLine");            
}