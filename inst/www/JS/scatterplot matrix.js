var minX, maxX, minY, maxY;

// Scatterplot matrix
var shortAxesOffset, shortTickLength, shortDataPointRadius, shortNumberOfGrooves, shortTickTextOffsetXAxis, shortTickTextOffsetYAxis, shortYAxisTickTextOffset, shortFontSize;

function makeScatterplotMatrix()
{
    var variableList = sort(currentVariableSelection);
    
    
    //any number of dependent variables -> should work
    var numberOfVariables = currentVariableSelection.length;
    
    // Scatterplot matrix
    shortAxesOffset = axesOffset/numberOfVariables;
    shortTickLength = tickLength/numberOfVariables;
    shortDataPointRadius = datapointRadius/numberOfVariables < 1 ? 1 : datapointRadius/numberOfVariables;
    shortNumberOfGrooves = Math.ceil(numberOfGrooves/(numberOfVariables * 1.5)) < 5 ? 5 : Math.ceil(numberOfGrooves/(numberOfVariables * 1.5));
    shortTickTextOffsetXAxis = tickTextOffsetXAxis/(numberOfVariables);
    shortTickTextOffsetYAxis = tickTextOffsetYAxis/(numberOfVariables);
    shortYAxisTickTextOffset = yAxisTickTextOffset/numberOfVariables;
    shortFontSize = fontSize;
    
    if(numberOfVariables == 3)
    {
        shortFontSize = fontSize - 3;
    }
    if(numberOfVariables > 3)
    {
        shortFontSize = 0;
    }
        
    var canvas = d3.select("#plotCanvas");    
    
    var LEFT = canvasWidth/2 - plotWidth/2;
    var TOP = canvasHeight/2 - plotHeight/2;
    
    if(numberOfVariables >= 2)
    {        
        for(var i=0; i<numberOfVariables; i++)
        {
            for(var j=0; j<numberOfVariables; j++)
            {
                if(i != j)
                    makeScatterPlotAt(LEFT + j*((plotWidth/numberOfVariables) + shortAxesOffset + shortTickTextOffsetYAxis), TOP + i*((plotHeight/numberOfVariables) + shortAxesOffset + shortTickTextOffsetXAxis), (plotWidth/numberOfVariables) - (shortAxesOffset + shortTickTextOffsetYAxis), (plotHeight/numberOfVariables) - (shortAxesOffset + shortTickTextOffsetXAxis), currentVariableSelection[j], currentVariableSelection[i]); 
                else
                {
                    canvas.append("text")
                            .attr("x", LEFT + j*((plotWidth/numberOfVariables) + shortAxesOffset + shortTickTextOffsetYAxis) + ((plotWidth/numberOfVariables) - (shortAxesOffset + shortTickTextOffsetYAxis))/2)
                            .attr("y", TOP + i*((plotHeight/numberOfVariables) + shortAxesOffset + shortTickTextOffsetXAxis) + ((plotHeight/numberOfVariables) - (shortAxesOffset + shortTickTextOffsetXAxis))/2)
                            .attr("text-anchor", "middle")
                            .attr("fill","black")
                            .text(currentVariableSelection[i]);
                }
            }
        }
        
        if(allVariablesAreNumeric())
            drawButtonInSideBar("PERFORM MULTIPLE REGRESSION", "regression");
    }
}

function makeScatterplotMatrixForMultipleRegression(outcomeVariable)
{
    var variableList = sort(currentVariableSelection);
    
    //any number of dependent variables -> should work
    var explanatoryVariables = [];
    for(var i=0; i<currentVariableSelection.length; i++)
    {
        if(currentVariableSelection[i] != outcomeVariable)
        {
            explanatoryVariables.push(currentVariableSelection[i]);
        }
    }
    
    var numberOfVariables = currentVariableSelection.length - 1;
    
    // Scatterplot matrix
    shortAxesOffset = axesOffset/numberOfVariables;
    shortTickLength = tickLength/numberOfVariables;
    shortDataPointRadius = datapointRadius/numberOfVariables < 1 ? 1 : datapointRadius/numberOfVariables;
    shortNumberOfGrooves = Math.ceil(numberOfGrooves/(numberOfVariables * 1.5)) < 5 ? 5 : Math.ceil(numberOfGrooves/(numberOfVariables * 1.5));
    shortTickTextOffsetXAxis = tickTextOffsetXAxis/(numberOfVariables);
    shortTickTextOffsetYAxis = tickTextOffsetYAxis/(numberOfVariables);
    shortYAxisTickTextOffset = yAxisTickTextOffset/numberOfVariables;
    shortFontSize = fontSize;
    
    if(numberOfVariables == 3)
    {
        shortFontSize = fontSize - 3;
    }
    if(numberOfVariables > 3)
    {
        shortFontSize = 0;
    }
    
    var plotCanvas = d3.select("#plotCanvas");
    
    var LEFT = canvasWidth/2 - plotWidth/2;
    var TOP = canvasHeight/2 - plotHeight/2;
    var BOTTOM = canvasHeight/2 + plotHeight/2;
    
    if(numberOfVariables >= 1)
    {        
        for(var i=0; i<numberOfVariables; i++)
        {
            makeScatterPlotAt(LEFT + i*((plotWidth/numberOfVariables) + 2*shortAxesOffset + shortTickTextOffsetYAxis), TOP, (plotWidth/numberOfVariables) - (2*shortAxesOffset + shortTickTextOffsetYAxis), (plotHeight/numberOfVariables) - (shortAxesOffset + shortTickTextOffsetXAxis), explanatoryVariables[i], outcomeVariable, "true", testResults["coefficients"][i], testResults["intercepts"][i]);             
            
            if(i==0)
            {   
                plotCanvas.append("text")
                            .attr("x", LEFT - axesOffset - labelOffset)
                            .attr("y", (TOP + BOTTOM)/4)
                            .attr("text-anchor", "middle")
                            .attr("transform", "rotate (-90 " + (LEFT - axesOffset - labelOffset) + " " + ((TOP + BOTTOM)/4) + ")")
                            .attr("font-size", 2*fontSizeLabels/3 + "px")
                            .text(outcomeVariable)
                            .attr("fill", "black");
                
                plotCanvas.append("text")
                            .attr("x", LEFT +  i*((plotWidth/numberOfVariables) + 2*shortAxesOffset + shortTickTextOffsetYAxis) + ((plotWidth/numberOfVariables) - (2*shortAxesOffset + shortTickTextOffsetYAxis))/2)
                            .attr("y", TOP + (plotHeight/numberOfVariables) - (shortAxesOffset + shortTickTextOffsetXAxis) + 2*axesOffset)
                            .attr("text-anchor", "middle")
                            .attr("font-size", 2*fontSizeLabels/3 + "px")
                            .text(explanatoryVariables[i])
                            .attr("fill", "black");
            }
            else
            {
                plotCanvas.append("text")
                            .attr("x", LEFT +  i*((plotWidth/numberOfVariables) + 2*shortAxesOffset + shortTickTextOffsetYAxis) + ((plotWidth/numberOfVariables) - (2*shortAxesOffset + shortTickTextOffsetYAxis))/2)
                            .attr("y", TOP + (plotHeight/numberOfVariables) - (shortAxesOffset + shortTickTextOffsetXAxis) + 2*axesOffset)
                            .attr("text-anchor", "middle")
                            .attr("font-size", 2*fontSizeLabels/3 + "px")
                            .text(explanatoryVariables[i])
                            .attr("fill", "black");
            }    
        }
    }
}

function makeScatterPlotAt(x,y,shortWidth, shortHeight, variableX, variableY, noColor, slope, intercept)
{
    // make sure that all preprocessing is done in the makeScatterPlotMatrix() function
    var canvas = d3.select("#plotCanvas");
    
    y = y + shortHeight;

    var dataX = variables[variableX]["dataset"];
    var dataY = variables[variableY]["dataset"];
    
    var uniqueDataX = dataX.unique();
    var uniqueDataY = dataY.unique();  

    var minX=0, minY=0, maxX=0, maxY=0;
    
    if(!isNaN(dataX[0]))
    {
        maxX = MAX[variableX]["dataset"];        
        minX = MIN[variableX]["dataset"];
    }
    
    if(!isNaN(dataY[0]))
    {
        maxY = MAX[variableY]["dataset"];
        minY = MIN[variableY]["dataset"];
    }
    
    var numberOfGroovesInXAxis = uniqueDataX.length <= shortNumberOfGrooves ? uniqueDataX.length : shortNumberOfGrooves;
    var numberOfGroovesInYAxis = uniqueDataY.length <= shortNumberOfGrooves ? uniqueDataY.length : shortNumberOfGrooves;
    
    //y-axis grooves
    var xStep = uniqueDataX.length <= shortNumberOfGrooves ? shortWidth/numberOfGroovesInXAxis : shortWidth/(numberOfGroovesInXAxis - 1);
    var yStep = uniqueDataY.length <= shortNumberOfGrooves ? shortHeight/numberOfGroovesInYAxis : shortHeight/(numberOfGroovesInYAxis - 1);
    
    var xSlice = (maxX - minX)/(shortNumberOfGrooves-1);    
    var ySlice = (maxY - minY)/(shortNumberOfGrooves-1);  
    
    if(noColor == undefined)
    {
        var r = findCorrelationCoefficient(variableX, variableY);
        
        canvas.append("rect")
                .attr("x", x)
                .attr("y", y-shortHeight)
                .attr("rx", "5px")
                .attr("ry", "5px")
                .attr("width", shortWidth)
                .attr("height", shortHeight)
                .attr("fill", "rgba(0, 255, 0, " + 0.6*Math.abs(r) + ")")                
                .attr("id", getValidId(variableX) + getValidId(variableY))
                .attr("class", "scatterplotMatrixCellRect");
    }
    else
    {
        //multiple regression                
        var x1, y1, x2, y2;    
        var X1, X2, Y1, Y2;
    
        X1 = minX;
        X2 = maxX;
        Y1 = (slope*X1 + intercept) > maxY ? maxY : (slope*X1 + intercept);
        Y1 = (slope*X1 + intercept) < minY ? minY : (slope*X1 + intercept);
        Y2 = (slope*X2 + intercept) > maxY ? maxY : (slope*X2 + intercept);
        Y2 = (slope*X2 + intercept) < minY ? minY : (slope*X2 + intercept);
        
        if(uniqueDataX.length <= shortNumberOfGrooves)
            x1 = LEFT + uniqueDataX.indexOf(X1)*xStep + xStep/2;    
        else
            x1 = x + getValue(X1, minX, maxX)*shortWidth;
        
        if(uniqueDataY.length <= shortNumberOfGrooves)
            y1 = y - uniqueDataY.indexOf(Y1)*yStep - yStep/2;
        else
            y1 = y - getValue(Y1, minY, maxY)*shortHeight;
    
        if(uniqueDataX.length <= shortNumberOfGrooves)
            x2 = x + uniqueDataX.indexOf(X1)*xStep + xStep/2;    
        else
            x2 = x + getValue(X2, minX, maxX)*shortWidth;
        
        if(uniqueDataY.length <= shortNumberOfGrooves)
            y2 = y - uniqueDataY.indexOf(Y2)*yStep - yStep/2;
        else
            y2 = y - getValue(Y2, minY, maxY)*shortHeight;
            
    
        canvas.append("line")
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr("y2", y2)
                .attr("stroke", "magenta")
                .attr("stroke-width", "5px")
                .attr("id", "regressionLine");
    }
    
    // x-axis
    canvas.append("line")
            .attr("x1", x)
            .attr("y1", y + shortAxesOffset)
            .attr("x2", x + shortWidth)
            .attr("y2", y + shortAxesOffset)
            .attr("stroke", "black")
            .attr("id", "axis")
            .attr("class", "xAxis");
    
    // y-axis
    canvas.append("line")
            .attr("x1", x - shortAxesOffset)
            .attr("y1", y)
            .attr("x2", x - shortAxesOffset)
            .attr("y2", y - shortHeight)
            .attr("stroke", "black")
            .attr("id", "axis")
            .attr("class", "yAxis");
    
     
    
    //grooves
    
    var axisText, textPosition;
    //x-axis ticks
    for(i=0; i<numberOfGroovesInXAxis; i++)
    {
        axisText = format(minX + i*xSlice);
        textPosition = x + i*xStep;
        
        var textAnchor = "middle";
        
        if(uniqueDataX.length <= shortNumberOfGrooves)
        {
            axisText = uniqueDataX[i];
            textPosition = x + xStep/2 + i*xStep;
        }
        else
        {
            if(i == 0)
            {
                textAnchor = "start";
            }
            else if(i == shortNumberOfGrooves-1)
            {
                textAnchor = "end";
            }
        }
        
        canvas.append("line")
                    .attr("x1", textPosition)
                    .attr("y1", y + shortAxesOffset)
                    .attr("x2", textPosition)
                    .attr("y2", y + shortAxesOffset + shortTickLength)
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooves");
                    
        canvas.append("text")
                    .attr("x", textPosition)
                    .attr("y", y + shortAxesOffset + shortTickLength + shortFontSize)     
                    .attr("font-size", shortFontSize)
                    .text(axisText)
                    .attr("text-anchor", textAnchor)
                    .attr("id", "groove" + i)
                    .attr("class", "xAxisGrooveText");
    }
    
    for(i=0; i<numberOfGroovesInYAxis; i++)
    {
        axisText = format(minY + i*ySlice);
        textPosition = y - i*yStep;                  
        var offset = 0;
        
        if(uniqueDataY.length <= shortNumberOfGrooves)
        {
            axisText = uniqueDataY[i];
            textPosition = y - yStep/2 - i*yStep;                    
        }
        else
        {
            if(i == 0)
            {
                offset = -shortFontSize/3;
            }
            else if(i == shortNumberOfGrooves-1)
            {
                offset = shortFontSize/3;
            }
        }
        
        canvas.append("line")
                    .attr("x1", x - shortAxesOffset)
                    .attr("y1", textPosition)
                    .attr("x2", x - shortAxesOffset - shortTickLength)
                    .attr("y2", textPosition)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");       
        
        
        
        
        
        canvas.append("text")
                    .attr("x", x - shortAxesOffset - shortTickTextOffsetYAxis)
                    .attr("y", textPosition + shortTickLength + offset)  
                    .text(axisText)
                    .attr("font-size", shortFontSize + "px")
                    .attr("text-anchor", "end")
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }
    
    for(var i=0; i<dataX.length; i++)
    {
        var X,Y;
        
        if(isNaN(dataX[0]))
            X = x + uniqueDataX.indexOf(dataX[i])*xStep + xStep/2;    
        else
            X = x + getValue(dataX[i], minX, maxX)*shortWidth;
            
        if(isNaN(dataY[0]))
            Y = y - uniqueDataY.indexOf(dataY[i])*yStep - yStep/2;
        else
            Y = y - getValue(dataY[i], minY, maxY)*shortHeight;
            
        var color = "black";
        
        canvas.append("circle")
                    .attr("cx", X)
                    .attr("cy", Y)
                    .attr("r", shortDataPointRadius)
                    .attr("fill", color)                    
                    .attr("class", "points");     
    }
}

function getValue(number, min, max)
{
    return (number - min)/(max - min);
}