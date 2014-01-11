var max, min, data, iqr, TOPFringe, BOTTOMFringe;

function makeBoxplot()
{
    //drawing
    var LEFT = canvasWidth/2 - plotWidth/2;
    var RIGHT = canvasWidth/2 + plotWidth/2;
    
    var TOP = canvasHeight/2 - plotHeight/2;
    var BOTTOM = canvasHeight/2 + plotHeight/2;

    var canvas = d3.select("#plotCanvas");
    drawButtonInSideBar("COMPARE MEANS", "compareMean");
//     drawNavigator(["boxplot", "significance test", "result", "post-hoc pairwise"]);
    
    //initializations
    var variableList = sort(currentVariableSelection);
    
    var altBoxPlot = false;
    var data = [];
    var mins = [];
    var maxs = [];
    var iqrs = [];
    var medians = [];
    var means = [];
    var CIs = [];    
    var levels = [];
    var labels;
    var nGroovesX, nGroovesY;
    var ids = [];
    var widthOfEachBox;
    
    //for colour boxplot
    var levelsForColor;
    var levelsForXAxis;
    
    //get data
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
                            mins[i] = MIN[variableList["dependent"][i]]["dataset"];      
                            maxs[i] = MAX[variableList["dependent"][i]]["dataset"];      
                            means[i] = mean(data[i]);
                            medians[i] = median(data[i]);
                            iqrs[i] = IQR[variableList["dependent"][i]]["dataset"]; 
                            CIs[i] = CI[variableList["dependent"][i]]["dataset"]; 
                        }                      
                        break;                    
                    }
            case 1:
                    {
                        altBoxPlot = true;
                        for(var i=0; i<variableList["independent-levels"].length; i++)
                        {
                            data[i] = variables[variableList["dependent"]][variableList["independent-levels"][i]];
                            mins[i] = MIN[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            maxs[i] = MAX[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            means[i] = mean(data[i]);
                            medians[i] = median(data[i]);
                            iqrs[i] = IQR[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            CIs[i] = CI[variableList["dependent"][0]][variableList["independent-levels"][i]];
                        }
                        break;
                    }
            case 2: 
                    {
                        altBoxPlot = true;
                        var splitData = splitThisLevelBy(variableList["independent"][0], variableList["independent"][1], variableList["dependent"][0]);
                        colourBoxPlotData = splitData;
                        var index = 0;
                        
                        drawBoxPlotLegends(variables[variableList["independent"][1]]["dataset"].unique());
                        
                        for(var i=0; i<variableList["independent-levels"][0].length; i++)
                        {
                            for(var j=0; j<variableList["independent-levels"][1].length; j++)
                            {   

                                levels.push(variableList["independent-levels"][0][i] + "-" + variableList["independent-levels"][1][j]);
                            
                                data[index] = splitData[variableList["independent-levels"][0][i]][variableList["independent-levels"][1][j]];                                
                                mins[index] = Array.min(data[index]);
                                maxs[index] = Array.max(data[index]);
                                means[index] = mean(data[index]);
                                medians[index] = median(data[index]);
                                iqrs[index] = findIQR(data[index]);
                                CIs[index] = findCI(data[index]);
                                
                                index++;
                                
                            }
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
        mins[0] = MIN[currentVariableSelection[0]]["dataset"];      
        maxs[0] = MAX[currentVariableSelection[0]]["dataset"];
        medians[0] = median(data[0]);
        iqrs[0] = IQR[currentVariableSelection[0]]["dataset"];
        CIs[0] = CI[currentVariableSelection[0]]["dataset"];
        means[0] = mean(data[0]);  
    }   
    
    min = Array.min(mins);
    max = Array.max(maxs);
    
    if(variableList["independent"].length == 1)    
        levels = variableList["independent-levels"]; //otherwise the arrays are contained into independent-levels
     
    //alt boxplot is the one with independent variable
    if(altBoxPlot)    
        labels = levels;
    else    
        labels = currentVariableSelection;
    
    ids = getValidIds(labels);
    
    nGroovesY = numberOfGrooves;
    
    // Draw axes        
    canvas.append("line")
            .attr("x1", LEFT)
            .attr("y1", BOTTOM + axesOffset)
            .attr("x2", RIGHT)
            .attr("y2", BOTTOM + axesOffset) 
            .attr("stroke", "black")
            .attr("id", "xAxis")
            .attr("class", "axes");
    
    canvas.append("line")
            .attr("x1", LEFT - axesOffset)
            .attr("y1", TOP)
            .attr("x2", LEFT - axesOffset)
            .attr("y2", BOTTOM)
            .attr("stroke", "black")
            .attr("id", "yAxis")
            .attr("class", "axes");
    
    //axes labels
    if(altBoxPlot)
    {
        canvas.append("text")
                .attr("x", canvasWidth/2 - plotWidth/2 - 1.25*labelOffset)
                .attr("y", (TOP + BOTTOM)/2)
                .attr("text-anchor", "middle")
                .attr("transform", "rotate (-90 " + (LEFT - axesOffset - 1.25*labelOffset) + " " + ((TOP + BOTTOM)/2) + ")")
                .attr("font-size", fontSizeLabels + "px")
                .text(variableList["dependent"][0])
                .attr("fill", "black");
    }
    
    //grooves
    
    //x-axis grooves           
    nGroovesX = labels.length;  
    widthOfEachBox = plotWidth/(labels.length*2) > boxWidth ? boxWidth : plotWidth/(labels.length*2);
    
    var xStep = plotWidth/nGroovesX;  
    var index = 0;
    for(i=0; i<nGroovesX; i++)
    {
        if(variableList["independent"].length == 2)
        {
            levelsForXAxis = variableList["independent-levels"][0];
            xStep = plotWidth/levelsForXAxis.length;  
            if(i<levelsForXAxis.length)
            {
                canvas.append("line")
                        .attr("x1", LEFT + index*xStep + xStep/2)
                        .attr("y1", BOTTOM  + axesOffset)
                        .attr("x2", LEFT + index*xStep + xStep/2)
                        .attr("y2", BOTTOM + tickLength + axesOffset)
                        .attr("stroke", "black");
    
                canvas.append("text")
                        .attr("x", LEFT + index*xStep + xStep/2)
                        .attr("y", BOTTOM + tickTextOffsetXAxis + axesOffset)                    
                        .text(levelsForXAxis[index])
                        .attr("fill", "black")
                        .attr("font-size", fontSizeTicks + "px")
                        .attr("text-anchor", "middle");
                        
                index++;
            }   
        }
        else
        {
            canvas.append("line")
                        .attr("x1", LEFT + i*xStep + xStep/2)
                        .attr("y1", BOTTOM  + axesOffset)
                        .attr("x2", LEFT + i*xStep + xStep/2)
                        .attr("y2", BOTTOM + tickLength + axesOffset)
                        .attr("id", ids[i])
                        .attr("class", "xAxisGrooves");
    
            canvas.append("text")
                        .attr("x", LEFT + i*xStep + xStep/2)
                        .attr("y", BOTTOM + tickTextOffsetXAxis + axesOffset)                    
                        .text(labels[i])
                        .attr("fill", "black")
                        .attr("font-size", fontSizeTicks + "px")
                        .attr("text-anchor", "middle")
                        .attr("id", ids[i])
                        .attr("class", "xAxisGrooveText");
        }
    }

    xStep = plotWidth/nGroovesX;  
    
    //y-axis grooves
    var yStep = plotHeight/(nGroovesY-1);
    var slice = (max - min)/(nGroovesY-1);    
    
    for(i=0; i<nGroovesY; i++)
    {
        canvas.append("line")
                    .attr("x1", LEFT - tickLength - axesOffset)
                    .attr("y1", BOTTOM - i*yStep)
                    .attr("x2", LEFT - axesOffset)
                    .attr("y2", BOTTOM - i*yStep)
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooves");
        
        yAxisTexts.push(canvas.append("text")
                    .attr("x", LEFT - tickTextOffsetYAxis - axesOffset)
                    .attr("y", BOTTOM - i*yStep + yAxisTickTextOffset)                    
                    .text(dec2(min + i*slice))
                    .attr("font-size", fontSizeTicks + "px")
                    .attr("text-anchor", "end")
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText"));
    }
    
    var widthSlice = plotWidth/(nGroovesX);
    
    for(var i=0; i<nGroovesX; i++)
    {
        if(data[i].length > 0)
        {
            var boxColor = boxColors["normal"];
        
            if(variableList["independent"].length == 2)
            {
                levelsForColor = variableList["independent-levels"][1];
                boxColor = colors[i%levelsForColor.length];
            }
        
            var rectBottom = (medians[i] - iqrs[i]/2) < min ? min : (medians[i] - iqrs[i]/2);
            var rectTop = (medians[i] + iqrs[i]/2) > max ? max : (medians[i] + iqrs[i]/2);
        
            boxes.push(canvas.append("rect")
                        .attr("x", LEFT + i*widthSlice - widthOfEachBox/2 + xStep/2)
                        .attr("y", BOTTOM - getFraction(rectTop)*plotHeight)
                        .attr("height", getFraction(rectTop)*plotHeight - getFraction(rectBottom)*plotHeight)
                        .attr("width", widthOfEachBox)
                        .attr("fill", boxColor)
                        .attr("stroke", "black")
                        .attr("id", ids[i])
                        .attr("class", "IQRs"));
                
            // median
            medianLines.push(canvas.append("line")
                        .attr("x1", LEFT + i*widthSlice - widthOfEachBox/2 + xStep/2)
                        .attr("y1", BOTTOM - getFraction(medians[i])*plotHeight)
                        .attr("x2", LEFT + i*widthSlice + widthOfEachBox/2 + xStep/2)
                        .attr("y2", BOTTOM - getFraction(medians[i])*plotHeight)
                        .attr("id", ids[i])
                        .attr("class", "medians"));
    
            //end fringes
            BOTTOMFringe = (medians[i] - 1.5*iqrs[i]) < min ? min : (medians[i] - 1.5*iqrs[i]);
            TOPFringe = (medians[i] + 1.5*iqrs[i]) > max ? max : (medians[i] + 1.5*iqrs[i]);
    
            topFringes.push(canvas.append("line")
                        .attr("x1", canvasWidth/2 - widthOfEachBox/4 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y1", BOTTOM - getFraction(TOPFringe)*plotHeight)
                        .attr("x2", canvasWidth/2 + widthOfEachBox/4 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y2", BOTTOM - getFraction(TOPFringe)*plotHeight)
                        .attr("id", ids[i])
                        .attr("stroke-width", "2")
                        .attr("class", "TOPFringes"));
    
            topFringeConnectors.push(canvas.append("line")
                        .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y1", BOTTOM - getFraction(TOPFringe)*plotHeight)
                        .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y2", BOTTOM- getFraction(rectTop)*plotHeight)
                        .attr("id", ids[i])
                        .attr("class", "TOPFringeConnectors"));    
    
            bottomFringes.push(canvas.append("line")
                        .attr("x1", canvasWidth/2 - widthOfEachBox/4 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y1", BOTTOM - getFraction(BOTTOMFringe)*plotHeight)
                        .attr("x2", canvasWidth/2 + widthOfEachBox/4 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y2", BOTTOM - getFraction(BOTTOMFringe)*plotHeight)
                        .attr("id", ids[i])
                        .attr("stroke-width", "2")
                        .attr("class", "BOTTOMFringes"));
                
            bottomFringeConnectors.push(canvas.append("line")
                        .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y1", BOTTOM - getFraction(BOTTOMFringe)*plotHeight)
                        .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y2", BOTTOM - getFraction(rectBottom)*plotHeight)
                        .attr("id", ids[i])
                        .attr("class", "BOTTOMFringeConnectors"));
    
        
        
            CILines.push(canvas.append("line")
                    .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y1", BOTTOM - getFraction(CIs[i][0])*plotHeight)
                    .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y2", BOTTOM - getFraction(CIs[i][1])*plotHeight)
                    .attr("stroke", "rosybrown")
                    .attr("stroke-width", "4")
                    .attr("id", ids[i])
                    .attr("class", "CIs"));
        
            CIBottomLines.push(canvas.append("line")
                    .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 - CIFringeLength)
                    .attr("y1", BOTTOM - getFraction(CIs[i][0])*plotHeight)
                    .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 + CIFringeLength)
                    .attr("y2", BOTTOM - getFraction(CIs[i][0])*plotHeight)
                    .attr("stroke", "rosybrown")
                    .attr("stroke-width", "4")
                    .attr("id", ids[i])
                    .attr("class", "CIBottomFringes"));
        
            CITopLines.push(canvas.append("line")
                    .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 - CIFringeLength)
                    .attr("y1", BOTTOM - getFraction(CIs[i][1])*plotHeight)
                    .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 + CIFringeLength)
                    .attr("y2", BOTTOM - getFraction(CIs[i][1])*plotHeight)
                    .attr("stroke", "rosybrown")
                    .attr("stroke-width", "4")
                    .attr("id", ids[i])
                    .attr("class", "CITopFringes"));
        
            var outliers = getOutliers(data[i], TOPFringe, BOTTOMFringe);
            
            for(var j=0; j<outliers.length; j++)
            {
                canvas.append("circle")
                        .attr("cx", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("cy", BOTTOM - getFraction(outliers[j])*plotHeight)
                        .attr("r", outlierRadius)
                        .attr("fill", "red")
                        .attr("stroke", "none")
                        .attr("id", ids[i] + j)
                        .attr("class", "outliers");
            }
        
            var dataAttributeForIndependentVariableA, dataAttributeForIndependentVariableB;
            if(variableList["independent"].length == 2)
            {
                dataAttributeForIndependentVariableA = variableList["independent"][0];
                dataAttributeForIndependentVariableB = variableList["independent"][1];
            }   

            meanCircles.push(canvas.append("circle")
                        .attr("cx", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("cy", BOTTOM - getFraction(means[i])*plotHeight)
                        .attr("r", meanRadius)
                        .attr("fill", meanColors["normal"])
                        .attr("style", "z-index: 5;")
                        .attr("id", ids[i])
                        .attr("class", "means")
                        .attr("data-indepenentVariableA", dataAttributeForIndependentVariableA)
                        .attr("data-indepenentVariableB", dataAttributeForIndependentVariableB)
                        .attr("data-levelA", (ids[i].split("-"))[0])
                        .attr("data-levelB", (ids[i].split("-"))[1]));
        }        
    }
}

function redrawBoxPlot()
{
    var LEFT = canvasWidth/2 - plotWidth/2;
    var RIGHT = canvasWidth/2 + plotWidth/2;
    
    var TOP = canvasHeight/2 - plotHeight/2;
    var BOTTOM = canvasHeight/2 + plotHeight/2;

    var canvas = d3.select("#plotCanvas");
    
    //initializations
    var variableList = sort(currentVariableSelection);
    
    var altBoxPlot = false;
    var data = [];
    var mins = [];
    var maxs = [];
    var iqrs = [];
    var medians = [];
    var means = [];
    var CIs = [];    
    var levels = [];
    var labels;
    var nGroovesX, nGroovesY;
    var ids = [];
    var widthOfEachBox;
    
    //get data
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
                            mins[i] = MIN[variableList["dependent"][i]]["dataset"];      
                            maxs[i] = MAX[variableList["dependent"][i]]["dataset"];      
                            means[i] = mean(data[i]);
                            medians[i] = median(data[i]);
                            iqrs[i] = IQR[variableList["dependent"][i]]["dataset"]; 
                            CIs[i] = CI[variableList["dependent"][i]]["dataset"]; 
                        }
                        
                        break;                    
                    }
            case 1:
                    {
                        altBoxPlot = true;
                        for(var i=0; i<variableList["independent-levels"].length; i++)
                        {
                            data[i] = variables[variableList["dependent"]][variableList["independent-levels"][i]];
                            mins[i] = MIN[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            maxs[i] = MAX[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            means[i] = mean(data[i]);
                            medians[i] = median(data[i]);
                            iqrs[i] = IQR[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            CIs[i] = CI[variableList["dependent"][0]][variableList["independent-levels"][i]];
                        }
                        break;
                    }
            case 2: 
                    {
                        altBoxPlot = true;
                        var splitData = splitThisLevelBy(variableList["independent"][0], variableList["independent"][1], variableList["dependent"][0]);
                        colourBoxPlotData = splitData;
                        var index = 0;
                        drawBoxPlotLegends(variables[variableList["independent"][1]]["dataset"].unique());
                        
                        for(var i=0; i<variableList["independent-levels"][0].length; i++)
                        {
                            for(var j=0; j<variableList["independent-levels"][1].length; j++)
                            {   

                                levels.push(variableList["independent-levels"][0][i] + "-" + variableList["independent-levels"][1][j]);
                            
                                data[index] = splitData[variableList["independent-levels"][0][i]][variableList["independent-levels"][1][j]];                                
                                mins[index] = Array.min(data[index]);
                                maxs[index] = Array.max(data[index]);
                                means[index] = mean(data[index]);
                                medians[index] = median(data[index]);
                                iqrs[index] = findIQR(data[index]);
                                CIs[index] = findCI(data[index]);
                                
                                index++;
                                
                            }
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
        mins[0] = MIN[currentVariableSelection[0]]["dataset"];      
        maxs[0] = MAX[currentVariableSelection[0]]["dataset"];
        medians[0] = median(data[0]);
        iqrs[0] = IQR[currentVariableSelection[0]]["dataset"];
        CIs[0] = CI[currentVariableSelection[0]]["dataset"];
        means[0] = mean(data[0]);  
    }   
    
    min = Array.min(mins);
    max = Array.max(maxs);
    
    if(variableList["independent"].length == 1)    
        levels = variableList["independent-levels"]; //otherwise the arrays are contained into independent-levels
     
    //alt boxplot is the one with independent variable
    if(altBoxPlot)    
        labels = levels;
    else    
        labels = currentVariableSelection;
    
    ids = getValidIds(labels);

    nGroovesY = numberOfGrooves;
    
    // Draw axes        
    canvas.append("line")
            .attr("x1", LEFT)
            .attr("y1", BOTTOM + axesOffset)
            .attr("x2", RIGHT)
            .attr("y2", BOTTOM + axesOffset) 
            .attr("stroke", "black")
            .attr("id", "xAxis")
            .attr("class", "axes");
    
    canvas.append("line")
            .attr("x1", LEFT - axesOffset)
            .attr("y1", TOP)
            .attr("x2", LEFT - axesOffset)
            .attr("y2", BOTTOM)
            .attr("stroke", "black")
            .attr("id", "yAxis")
            .attr("class", "axes");

    //axes labels
    if(altBoxPlot)
    {
        canvas.append("text")
                .attr("x", canvasWidth/2 - plotWidth/2 - 1.25*labelOffset)
                .attr("y", (TOP + BOTTOM)/2)
                .attr("text-anchor", "middle")
                .attr("transform", "rotate (-90 " + (LEFT - axesOffset - 1.25*labelOffset) + " " + ((TOP + BOTTOM)/2) + ")")
                .attr("font-size", fontSizeLabels + "px")
                .text(variableList["dependent"][0])
                .attr("fill", "black");
    }
    
    //x-axis grooves           
    nGroovesX = labels.length;    
    widthOfEachBox = plotWidth/(labels.length*2) > boxWidth ? boxWidth : plotWidth/(labels.length*2);
    
    var xStep = plotWidth/nGroovesX; 
    
    //y-axis grooves
    var yStep = plotHeight/(nGroovesY-1);
    var slice = (max - min)/(nGroovesY-1);    

    for(i=0; i<nGroovesY; i++)
    {
        yAxisTexts[i].transition().duration(boxPlotTransformationDuration)        
                    .attr("x", LEFT - tickTextOffsetYAxis - axesOffset)
                    .attr("y", BOTTOM - i*yStep + yAxisTickTextOffset)                    
                    .text(dec2(min + i*slice))
                    .attr("text-anchor", "end")
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }
    
    var widthSlice = plotWidth/(nGroovesX);
    
    for(var i=0; i<nGroovesX; i++)
    {
        if(data[i].length > 0)
        {
            var rectBottom = (medians[i] - iqrs[i]/2) < min ? min : (medians[i] - iqrs[i]/2);
            var rectTop = (medians[i] + iqrs[i]/2) > max ? max : (medians[i] + iqrs[i]/2);
        
            boxes[i].transition().duration(boxPlotTransformationDuration)
                        .attr("x", LEFT + i*widthSlice - widthOfEachBox/2 + xStep/2)
                        .attr("y", BOTTOM - getFraction(rectTop)*plotHeight)
                        .attr("height", getFraction(rectTop)*plotHeight - getFraction(rectBottom)*plotHeight)
                        .attr("width", widthOfEachBox)
                        .attr("fill", boxColors["normal"]);
                
            // median
            medianLines[i].transition().duration(boxPlotTransformationDuration)
                        .attr("x1", LEFT + i*widthSlice - widthOfEachBox/2 + xStep/2)
                        .attr("y1", BOTTOM - getFraction(medians[i])*plotHeight)
                        .attr("x2", LEFT + i*widthSlice + widthOfEachBox/2 + xStep/2)
                        .attr("y2", BOTTOM - getFraction(medians[i])*plotHeight);
    
            //end fringes
            BOTTOMFringe = (medians[i] - 1.5*iqrs[i]) < min ? min : (medians[i] - 1.5*iqrs[i]);
            TOPFringe = (medians[i] + 1.5*iqrs[i]) > max ? max : (medians[i] + 1.5*iqrs[i]);
    
            topFringes[i].transition().duration(boxPlotTransformationDuration)
                        .attr("x1", canvasWidth/2 - widthOfEachBox/4 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y1", BOTTOM - getFraction(TOPFringe)*plotHeight)
                        .attr("x2", canvasWidth/2 + widthOfEachBox/4 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y2", BOTTOM - getFraction(TOPFringe)*plotHeight);
    
            topFringeConnectors[i].transition().duration(boxPlotTransformationDuration)
                        .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y1", BOTTOM - getFraction(TOPFringe)*plotHeight)
                        .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y2", BOTTOM- getFraction(rectTop)*plotHeight);    
    
            bottomFringes[i].transition().duration(boxPlotTransformationDuration)
                        .attr("x1", canvasWidth/2 - widthOfEachBox/4 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y1", BOTTOM - getFraction(BOTTOMFringe)*plotHeight)
                        .attr("x2", canvasWidth/2 + widthOfEachBox/4 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y2", BOTTOM - getFraction(BOTTOMFringe)*plotHeight);
                
            bottomFringeConnectors[i].transition().duration(boxPlotTransformationDuration)
                        .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y1", BOTTOM - getFraction(BOTTOMFringe)*plotHeight)
                        .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("y2", BOTTOM - getFraction(rectBottom)*plotHeight);
    
            CILines[i].transition().duration(boxPlotTransformationDuration)
                    .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y1", BOTTOM - getFraction(CIs[i][0])*plotHeight)
                    .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                    .attr("y2", BOTTOM - getFraction(CIs[i][1])*plotHeight);
        
            CIBottomLines[i].transition().duration(boxPlotTransformationDuration)
                    .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 - CIFringeLength)
                    .attr("y1", BOTTOM - getFraction(CIs[i][0])*plotHeight)
                    .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 + CIFringeLength)
                    .attr("y2", BOTTOM - getFraction(CIs[i][0])*plotHeight);
        
            CITopLines[i].transition().duration(boxPlotTransformationDuration)
                    .attr("x1", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 - CIFringeLength)
                    .attr("y1", BOTTOM - getFraction(CIs[i][1])*plotHeight)
                    .attr("x2", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2 + CIFringeLength)
                    .attr("y2", BOTTOM - getFraction(CIs[i][1])*plotHeight);
        
            removeElementsByClassName("outliers");
    
            var outliers = getOutliers(data[i], TOPFringe, BOTTOMFringe);
            
            for(var j=0; j<outliers.length; j++)
            {
                canvas.append("circle")
                        .attr("cx", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("cy", BOTTOM - getFraction(outliers[j])*plotHeight)
                        .attr("r", outlierRadius)
                        .attr("fill", "red")
                        .attr("stroke", "none")
                        .attr("id", ids[i] + j)
                        .attr("class", "outliers");
            }
    
            meanCircles[i].transition().duration(boxPlotTransformationDuration)
                        .attr("cx", canvasWidth/2 + i*widthSlice - plotWidth/2 + xStep/2)
                        .attr("cy", BOTTOM - getFraction(means[i])*plotHeight);
        }        
    }
}

function drawHomogeneityPlot(homogeneity)
{    
    var color = "";
    
    if(homogeneity)
        color = "green";
    else
        color = "red";
        
    removeElementsByClassName("densityCurve");
    removeElementsByClassName("homogeneityPlot");
    
    var LEFT = canvasWidth/2 - plotWidth/2;
    var RIGHT = canvasWidth/2 + plotWidth/2;
    
    var TOP = canvasHeight/2 - plotHeight/2;
    var BOTTOM = canvasHeight/2 + plotHeight/2;

    var canvas = d3.select("#plotCanvas");
    
    //initializations
    var variableList = sort(currentVariableSelection);
    
    var altBoxPlot = false;
    var data = [];
    var mins = [];
    var maxs = [];
    var iqrs = [];
    var medians = [];
    var means = [];
    var CIs = [];    
    var levels = [];
    var labels;
    var nGroovesX, nGroovesY;
    var ids = [];
    var widthOfEachBox;
    
    //get data
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
                            mins[i] = MIN[variableList["dependent"][i]]["dataset"];      
                            maxs[i] = MAX[variableList["dependent"][i]]["dataset"];      
                            means[i] = mean(data[i]);
                            medians[i] = median(data[i]);
                            iqrs[i] = IQR[variableList["dependent"][i]]["dataset"]; 
                            CIs[i] = CI[variableList["dependent"][i]]["dataset"]; 
                        }
                        
                        break;                    
                    }
            case 1:
                    {
                        altBoxPlot = true;
                        for(var i=0; i<variableList["independent-levels"].length; i++)
                        {
                            data[i] = variables[variableList["dependent"]][variableList["independent-levels"][i]];
                            mins[i] = MIN[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            maxs[i] = MAX[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            means[i] = mean(data[i]);
                            medians[i] = median(data[i]);
                            iqrs[i] = IQR[variableList["dependent"][0]][variableList["independent-levels"][i]];
                            CIs[i] = CI[variableList["dependent"][0]][variableList["independent-levels"][i]];
                        }
                        break;
                    }
            case 2: 
                    {
                        altBoxPlot = true;
                        var splitData = splitThisLevelBy(variableList["independent"][0], variableList["independent"][1], variableList["dependent"][0]);
                        colourBoxPlotData = splitData;
                        var index = 0;                        
                        for(var i=0; i<variableList["independent-levels"][0].length; i++)
                        {
                            for(var j=0; j<variableList["independent-levels"][1].length; j++)
                            {   

                                levels.push(variableList["independent-levels"][0][i] + "-" + variableList["independent-levels"][1][j]);
                            
                                data[index] = splitData[variableList["independent-levels"][0][i]][variableList["independent-levels"][1][j]];                                
                                mins[index] = Array.min(data[index]);
                                maxs[index] = Array.max(data[index]);
                                means[index] = mean(data[index]);
                                medians[index] = median(data[index]);
                                iqrs[index] = findIQR(data[index]);
                                CIs[index] = findCI(data[index]);
                                
                                index++;
                                
                            }
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
        mins[0] = MIN[currentVariableSelection[0]]["dataset"];      
        maxs[0] = MAX[currentVariableSelection[0]]["dataset"];
        medians[0] = median(data[0]);
        iqrs[0] = IQR[currentVariableSelection[0]]["dataset"];
        CIs[0] = CI[currentVariableSelection[0]]["dataset"];
        means[0] = mean(data[0]);  
    }   
    
    min = Array.min(mins);
    max = Array.max(maxs);
    
    if(variableList["independent"].length == 1)    
        levels = variableList["independent-levels"]; //otherwise the arrays are contained into independent-levels
     
    //alt boxplot is the one with independent variable
    if(altBoxPlot)    
        labels = levels;
    else    
        labels = currentVariableSelection;
    
    ids = getValidIds(labels);

    nGroovesY = numberOfGrooves;
    
    //grooves
    
    //x-axis grooves           
    nGroovesX = labels.length;    
    widthOfEachBox = plotWidth/(labels.length*2) > boxWidth ? boxWidth : plotWidth/(labels.length*2);
    
    var xStep = plotWidth/nGroovesX; 
    
    //y-axis grooves
    var yStep = plotHeight/(nGroovesY-1);
    var slice = (max - min)/(nGroovesY-1);   
    
    var widthSlice = plotWidth/(nGroovesX);
    var variances = [];
    
    var varianceMin = 999999;
    var varianceMax =-999999;
    
    for(var i=0; i<nGroovesX; i++)
    {
        if(data[i].length > 0)
        {
            if(mins[i] < varianceMin)
                varianceMin = mins[i];
            
            if(maxs[i] > varianceMax)
                varianceMax = maxs[i];
                
            variances.push(canvas.append("line")
                    .attr("x1", LEFT + i*widthSlice + xStep/2)
                    .attr("y1", BOTTOM - getFraction(mins[i])*plotHeight)
                    .attr("x2", LEFT + i*widthSlice + xStep/2)
                    .attr("y2", BOTTOM - getFraction(maxs[i])*plotHeight)
                    .attr("stroke-width", "3px")
                    .attr("stroke", "black")
                    .attr("class", "homogeneityPlot"));
        }        
    }
    
    canvas.transition().duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight*1.5);
    
    var variancePlotWidth = plotWidth/2;
    var variancePlotHeight = scaleForWindowSize(230);
    
    //make a small variance comparison plot
    var l = canvasWidth/2 - variancePlotWidth/2;
    var b = canvasHeight/2 + plotHeight/2 + 3*axesOffset + variancePlotHeight;
    
    canvas.append("line")
            .attr("x1", l)
            .attr("y1", b)
            .attr("x2", l)
            .attr("y2", b - variancePlotHeight)
            .attr("stroke", "black")
            .attr("class", "homogeneityPlot");
    
    canvas.append("line")
            .attr("x1", l)
            .attr("y1", b)
            .attr("x2", l + variancePlotWidth)
            .attr("y2", b)
            .attr("stroke", "black")
            .attr("class", "homogeneityPlot");
    
    canvas.append("text")
            .attr("x", l - axesOffset)
            .attr("y", b - variancePlotHeight/2)
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .text("VARIANCE")
            .attr("font-size", scaleForWindowSize(12) + "px")
            .attr("transform", "rotate (-90 " + (l - axesOffset) + " " + (b - variancePlotHeight/2) + ")")
            .attr("class", "homogeneityPlot");    
    
    widthSlice = variancePlotWidth/(nGroovesX);
    xStep = variancePlotWidth/nGroovesX; 
    
    for(var i=0; i<nGroovesX; i++)
    {    
        canvas.append("text")
                .attr("x", l + i*widthSlice + xStep/2)
                .attr("y", b + 3*yAxisTickTextOffset)
                .attr("text-anchor", "end")
                .attr("font-size", scaleForWindowSize(12) + "px")
                .attr("transform", "rotate (-75 " + (l + i*widthSlice + xStep/2) + " " + (b + 3*yAxisTickTextOffset) + ")")
                .text(levels[i])
                .attr("class", "homogeneityPlot");
                
        variances[i].transition().delay(800).duration(800)
                        .attr("x1", l + i*widthSlice + xStep/2)
                        .attr("x2", l + i*widthSlice + xStep/2)
                        .attr("y1", b - getFractionForVariancePlot(varianceMin, varianceMin, varianceMax)*variancePlotHeight)
                        .attr("y2", b - getFractionForVariancePlot(varianceMin + (maxs[i] - mins[i]), varianceMin, varianceMax)*variancePlotHeight)
                        .attr("stroke-width", "7px")
                        .attr("stroke", color)
                        .attr("class", "homogeneityPlot");                        
    }
    
}

function drawBoxPlotInRed(level)
{
    level = getValidId(level);

    var box = d3.select("#" + level + ".IQRs");    
    box.attr("fill", boxColors["notnormal"]);
    
    var text = d3.select("#" + level + ".xAxisGrooveText");
    text.attr("fill", boxColors["notnormal"]);
}

function getFraction(number)
{
    return (number - min)/(max - min);
}

function getFractionForVariancePlot(number, min, max)
{
    return (number - min)/(max - min);
}

function getActualValue(fraction)
{
    var BOTTOM = canvasHeight/2 + plotHeight/2;
    return ((BOTTOM - fraction)/plotHeight)*(max-min) + min;
}

function getOutliers(data, TOPFringe, BOTTOMFringe)
{
    var outliers = [];
    
    for(var i=0; i<data.length; i++)
    {
        if((data[i] > (TOPFringe) )|| (data[i] < (BOTTOMFringe) ))
        {
            outliers.push(data[i]);
        }
    }   
    return outliers;
}

//Loop animation
function startLoopAnimation(meanCircle)
{
    var canvas = d3.select("#plotCanvas");
        
    //insert animation
    var loop = canvas.append("circle")
                  .attr("cx", meanCircle.attr("cx"))
                  .attr("cy", meanCircle.attr("cy"))
                  .attr("r", "0px")
                  .attr("fill", "none")
                  .attr("style", "z-index: -1;")
                  .attr("stroke", "black")
                  .attr("stroke-width", "2px")				
                  .attr("class", "loops");

    loop.transition().duration(1500).attr("r", "30px").attr("opacity", "0.25").attr("stroke","lightgrey");
    loop.transition().delay(2300).attr("opacity", "0");

    intervals[meanCircle.attr("id")] = setInterval(function()
    {						
       var loop = canvas.append("circle")
                     .attr("cx", meanCircle.attr("cx"))
                     .attr("cy", meanCircle.attr("cy"))
                     .attr("r", "0px")
                     .attr("fill", "none")
                     .attr("stroke", "black")
                     .attr("stroke-width", "2px")				
                     .attr("class", "loops");

       loop.transition().duration(1500).attr("r", "30px").attr("stroke", "grey");
       loop.transition().delay(1500).attr("opacity", "0");
//        loop.transition().delay(1500).duration(1000).attr("r", "45px").attr("opacity", "0");
    },1000);
}

function drawBoxPlotLegends(varNames)
{
    var canvas = d3.select("#sideBarCanvas");
    
    var yStep = plotHeight/10;
    
    for(var i=0; i<varNames.length; i++)
    {
        canvas.append("rect")
                .attr("x", sideBarWidth/4)
                .attr("y", TOP + histLegendOffsetY + i*yStep - histLegendSize/2)
                .attr("width", histLegendSize)
                .attr("height", histLegendSize)
                .attr("fill", colors[i])
                .attr("stroke", "black")
                .attr("id", "legend" + i)
                .attr("class", "boxplotLegends");
        
        canvas.append("text")
                .attr("x", sideBarWidth/2 + histLegendSize)
                .attr("y", TOP + histLegendOffsetY + i*yStep + 3)
                .attr("text-anchor", "start")
                .attr("fill", "black")
                .attr("font-size", fontSizeTicks + "px")
                .text(varNames[i])
                .attr("id", "legend" + i)
                .attr("class", "boxplotLegends");
            
    }
}

function selectAllMeans()
{    
    var lastMean = findEndingMean();
    var unSelectedMeans = getUnselectedMeansForColourBoxPlotData();
    
    var means = new Array();
    
    if(lastMean != 0)
        means.push(lastMean);
    
    for(var i=0; i<unSelectedMeans.length; i++)
        means.push(unSelectedMeans[i]);
        
    means.sort(function(a, b)
    {
        if(parseFloat(a.getAttribute("cx")) < parseFloat(b.getAttribute("cx")))
            return -1;
        if(parseFloat(a.getAttribute("cx")) > parseFloat(b.getAttribute("cx")))
            return 1;
        return 0;
    });

    var plotCanvas = d3.select("#plotCanvas");    
    for(var i=0; i<means.length; i++)
    {
        var mean = d3.select("#" + means[i].getAttribute("id") + ".means");
        mean.transition().duration(500).attr("fill", meanColors["click"]);
        
        if(i != means.length - 1)
        {
            var line = plotCanvas.append("line")
                        .attr("x1", means[i].getAttribute("cx"))
                        .attr("y1", means[i].getAttribute("cy"))
                        .attr("x2", means[i+1].getAttribute("cx"))
                        .attr("y2", means[i+1].getAttribute("cy"))
                        .attr("stroke", meanColors["click"])
                        .attr("opacity", "0.1")
                        .attr("stroke-dasharray", "5,5")
                        .attr("class", "completeLines");
            
            line.transition().delay(500).duration(500).attr("opacity", "1.0");
        }
    }
}

function unselectAllMeans()
{    
    var selectedMeans = getSelectedMeansForColourBoxPlotData();
    
    selectedMeans.sort(function(a, b)
    {
        if(a.getAttribute("cx") < b.getAttribute("cx"))
            return -1;
        if(a.getAttribute("cx") > b.getAttribute("cx"))
            return 1;
        return 0;
    });
    
    d3.selectAll(".means").transition().duration(500).attr("fill",meanColors["normal"]);
    
    removeElementsByClassName("completeLines");
    removeElementsByClassName("incompleteLines");
}

//get pearson's r or kendall's tau correlation coefficients
function getCorrelationCoefficient(variableA, variableB, method)
{   
    //sort the variables in ascending alphabetical order
    if(variableB < variableA)
    {
        var temp = variableA;
        variableA = variableB;
        variableB = temp;
    }    
    
    var req = ocpu.rpc("getCorrelationCoefficient", 
    {
        distributionX: variables[variableA]["dataset"],                    
        distributionY: variables[variableB]["dataset"],
        method: method
    }, function(output) 
    {                                                                   
        if(method == "pearson")
        {
            console.log("\t\t\t Pearson's Correlation-coefficient for (" + variableA + " , " + variableB + ")");

            testResults["df"] = output.df;
            testResults["statistic"] = "t(" + output.df + ") = " + output.statistic;
    
            testResults["parameter"] = output.statistic;
            testResults["parameter-type"] = "t";
    
            testResults["p"] = changePValueNotation(output.p);                  
            testResults["method"] = output.method; 
    
            testResults["test-type"] = "pC";
    
            testResults["effect-size"] = output.cor;
            testResults["CI"] = [output.CI_min, output.CI_max];
            testResults["effect-size-type"] = "r";
    
            testResults["formula"] = variableA + " : " + variableB;
        
            logResult();

            drawButtonInSideBar("CONSTRUCT MODEL", "regression");
        }
        else if(method == "kendall")
        {
            console.log("\t\t\t Kendall's Correlation-coefficient for (" + variableA + " , " + variableB + ")");
        
            testResults["statistic"] = "z = " + output.statistic;
    
            testResults["parameter"] = output.statistic;
            testResults["parameter-type"] = "z";
  
            testResults["p"] = changePValueNotation(output.p);
            testResults["method"] = output.method; 
            testResults["effect-size"] = output.cor;
            testResults["effect-size-type"] = "𝜏";
    
            testResults["test-type"] = "kC";
    
            testResults["formula"] = variableA + " : " + variableB;
        
            logResult();
    
            drawButtonInSideBar("CONSTRUCT MODEL", "regression");
        }

        displayCorrelationResults();
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });    
}

//get biserial correlation coefficient
function getBiserialCorrelationCoefficient(continuousVariable, binaryVariable)
{
    var req = ocpu.rpc("getBiserialCorrelationCoefficient", 
    {
        continuousVariable: variables[continuousVariable]["dataset"],
        binaryVariable: variables[binaryVariable]["dataset"]
    }, function(output) 
    {                                                   
        console.log("\t\t Biserial Correlation-coefficient for (" + continuousVariable + " , " + binaryVariable + ")");                
    
        testResults["method"] = "Biserial Correlation-coefficient";
        testResults["effect-size"] = output.cor;  
        testResults["effect-size-type"] = "r";                
        testResults["test-type"] = "bC";                
        testResults["formula"] = continuousVariable + " : " + binaryVariable;
    
        logResult();
        displayBiserialCorrelationResults();                    
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//get linear model coefficients (slope and intercept)
function getLinearModelCoefficients(outcome, explanatory)
{ 
    var req = ocpu.rpc("getLinearModelCoefficients", 
    {
        outcome: variables[outcome]["dataset"],
        explanatory: variables[explanatory]["dataset"]
    }, function(output) 
    {                            
        testResults["test-type"] = "linR";
        
        if(isNaN(variables[explanatory]["dataset"][0]))
        {
            //we have a categorical variable
            var levels = variables[explanatory]["dataset"].unique().slice().sort();                    
            var nCoefficients = levels.length - 1;
            var coefficients = output.coefficients;                  
    
            testResults["effect-size"] = output.rSquared;
            testResults["method"] = "Linear Regression Model";
            testResults["equation"] = outcome + " = ";
            testResults["effect-size-type"] = "rS";
    
            testResults["formula"] = explanatory + " => " + outcome;
    
            logResult();
    
            for(var i=0; i<nCoefficients; i++)
            {
                if(i == 0)                        
                    testResults["equation"] = testResults["equation"] + coefficients[i] + levels[i+1];
                else
                    testResults["equation"] = testResults["equation"] + (coefficients[i] < 0 ? coefficients[i] : "+" + coefficients[i]) + levels[i+1];
            }
            testResults["equation"] = testResults["equation"] + (output.intercept < 0 ? output.intercept : "+" + output.intercept);
    
            testResults["coefficients"] = new Object();
    
            for(var i=0; i<levels.length; i++)
            {
                testResults["coefficients"][levels[i]] = coefficients[i];
            }    
            testResults["intercept"] = output.intercept;    
        }
        else
        {  
            var coefficients = output.coefficients;
  
            testResults["effect-size"] = output.rSquared;
            testResults["effect-size-type"] = "rS";
            testResults["method"] = "Linear Regression Model";
            testResults["equation"] = outcome + " = " + coefficients + explanatory + (output.intercept < 0 ? output.intercept : "+" + output.intercept);
            testResults["coefficients"] = coefficients;
            testResults["intercept"] = output.intercept;
            testResults["formula"] = explanatory + " => " + outcome;
        
            logResult();
        
            removeElementsByClassName("significanceTest");
            drawRegressionLine(output.intercept, output.coefficients);                

            displaySimpleRegressionResults();                    
        }
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//get coefficients for multiple regression (individual slopes and intercepts)
function performMultipleRegression(outcomeVariable, explanatoryVariables)
{
    explanatoryVariables = explanatoryVariables.sort();
     
    var req = ocpu.rpc("performMultipleRegression", 
    {
        outcomeVariable: outcomeVariable,
        explanatoryVariables: explanatoryVariables,
        dataset: pathToFile                
    }, function(output) 
    {                                                   
        testResults["test-type"] = "mulR";
        console.log("Performing Multiple Regression for " + outcomeVariable + " ~ [" + explanatoryVariables + "]");
      
        testResults["outcomeVariable"] = outcomeVariable;
        testResults["explanatoryVariables"] = explanatoryVariables;
    
        testResults["effect-size"] = output.rSquared;
        testResults["method"] = "Multiple Regression";
        testResults["equation"] = outcomeVariable + " = ";
        testResults["effect-size-type"] = "rS";
    
        testResults["formula"] = "[" + explanatoryVariables + "] => " + outcomeVariable;                    
        logResult();
    
        var intercepts = [];
    
        for(var i=0; i<explanatoryVariables.length; i++)
        {
            if(i == 0)
                testResults["equation"] = testResults["equation"] + output.coefficients[i] + explanatoryVariables[i];
            else
                testResults["equation"] = testResults["equation"] + (output.coefficients[i] < 0 ? output.coefficients[i] : "+" + output.coefficients[i]) + explanatoryVariables[i];
            
            var sum=output.intercept;
            for(var j=0; j<explanatoryVariables.length; j++)
            {
                if(i != j)
                {
                    sum += mean(variables[explanatoryVariables[j]]["dataset"])*output.coefficients[j];
                }
            }
        
            intercepts.push(sum);
        }
        testResults["equation"] = testResults["equation"] + (output.intercept < 0 ? output.intercept : "+" + output.intercept);
    
        testResults["coefficients"] = output.coefficients;                
        testResults["intercept"] = output.intercept;
        testResults["intercepts"] = intercepts;
        
        makeScatterplotMatrixForMultipleRegression(outcomeVariable);
        displayMultipleRegressionResults();
        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//dataset information

//Preprocessing
var datasetInformation = new Object();
    datasetInformation["impact"] = "Dataset comparing the verbal, spatial, and other such abilities of athletes in two groups - control and concussed";
    datasetInformation["cars"] = "Dataset with details about different cars";
    datasetInformation["weightLoss"] = "Dataset comparing the weight lost by participants in 3 groups: those who skipped breakfast, those who skipped lunch, and those who skipped dinner";
    datasetInformation["store"] = "TBD";
    datasetInformation["SAT"] = "When deciding whether to admit an applicant, colleges take lots of factors, such as grades, sports, activities, leadership positions, awards, teacher recommendations, and test scores, into consideration. Using SAT scores as a basis of whether to admit a student or not has created some controversy. Among other things, people question whether the SATs are fair and whether they predict college performance. This study examines the SAT and GPA information of 105 students who graduated from a state university with a B.S. in computer science. Using the grades and test scores from high school, can you predict a student's college grades?";
    datasetInformation["hotdogs"] = "Results of a laboratory analysis of calories and sodium content of major hot dog brands. Researchers for Consumer Reports analyzed three types of hot dog: beef, poultry, and meat (mostly pork and beef, but up to 15% poultry meat).";
    datasetInformation["bankloan"] = "TBD";
    datasetInformation["car_sales"] = "TBD";
    datasetInformation["hp"] = "TBD";
    datasetInformation["keyboards"] = "TBD";
    datasetInformation["foodEffect"] = "TBD";
    datasetInformation["weight_loss"] = "TBD";
    datasetInformation["phoneEffect"] = "TBD";

var variablesInDataset = new Object();
    variablesInDataset["impact"] = ["subject","condition","verbalMemoryPre","visualMemoryPre","visualMotorSpeedPre","reactionTimePre","impulseControlPre","totalSymptomPre","verbalMemoryPost","visualMemoryPost","visualMotorSpeedPost","reactionTimePost","impulseConstrolPost","totalSymptomPost"]
    variablesInDataset["cars"] = ["Car","MPG","Cylinders","Displacement","Horsepower","Weight","Acceleration","Model","Origin"];
    variablesInDataset["weightLoss"] = ["participantID", "ageGroup", "condition", "weightLost"];
    variablesInDataset["store"] = ["ID", "price", "store", "subject"];
    variablesInDataset["SAT"] = ["participantID", "high_GPA", "math_SAT", "verb_SAT", "comp_GPA", "univ_GPA"];
    variablesInDataset["hotdogs"] = ["Type", "Calories", "Sodium"];
    variablesInDataset["bankloan"] = ["age", "ed", "employ", "address", "debtinc", "creddebt", "otherdebt", "preddef1", "preddef2", "preddef3"];
    variablesInDataset["car_sales"] = ["manufact", "model", "sales", "resale", "type", "price", "engine_s", "horsepow", "wheelbas", "width", "length", "curb_wgt", "fuel_cap", "mpg"];
    variablesInDataset["hp"] = ["name", "house", "pet"];
    variablesInDataset["keyboards"] = ["participantID", "keyboardLayout", "gender", "typingSpeed", "errors", "userSatisfaction"];
    variablesInDataset["foodEffect"] = ["participantID","foodEaten","gender","score_V","score_Q","satisfactionRating"];
    variablesInDataset["weight_loss"] = ["participantID","condition","exercise","weightLost","BMI","userRating"];
    variablesInDataset["phoneEffect"] = ["participantID","phoneOS","gender", "stressScore","happScore","satisfaction"];
 
var types = ["participant", "dependent", "independent"];
var variablesInDatasetRow = new Object();

var dataTypes = ["nominal", "ordinal", "interval", "ratio"];
var variablesInDatasetType = new Object();
    variablesInDatasetType["impact"] = [dataTypes[0], dataTypes[0], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3]];
    variablesInDatasetType["cars"] = [dataTypes[0], dataTypes[3], dataTypes[1], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[0], dataTypes[0]];
    variablesInDatasetType["weightLoss"] = [dataTypes[0], dataTypes[0], dataTypes[0], dataTypes[3]];
    variablesInDatasetType["store"] = [dataTypes[0], dataTypes[3], dataTypes[0], dataTypes[0]];
    variablesInDatasetType["SAT"] = [dataTypes[0], dataTypes[2], dataTypes[2], dataTypes[2], dataTypes[2], dataTypes[2]];
    variablesInDatasetType["hotdogs"] = [dataTypes[0], dataTypes[3], dataTypes[3]];
    variablesInDatasetType["bankloan"] = [dataTypes[3], dataTypes[0], dataTypes[0], dataTypes[2], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3]];
    variablesInDatasetType["car_sales"] = [dataTypes[0], dataTypes[0], dataTypes[3], dataTypes[3], dataTypes[0], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3], dataTypes[3]];
    variablesInDatasetType["hp"] = [dataTypes[0], dataTypes[0], dataTypes[0]];
    variablesInDatasetType["keyboards"] = [dataTypes[0], dataTypes[0], dataTypes[0], dataTypes[3], dataTypes[3], dataTypes[1]];
    variablesInDatasetType["foodEffect"] = [dataTypes[0], dataTypes[0], dataTypes[0], dataTypes[3], dataTypes[3], dataTypes[1]];
    variablesInDatasetType["weight_loss"] = [dataTypes[0], dataTypes[0], dataTypes[1], dataTypes[3], dataTypes[2], dataTypes[1]];
    variablesInDatasetType["phoneEffect"] = [dataTypes[0], dataTypes[0], dataTypes[0], dataTypes[3], dataTypes[3], dataTypes[1]];
    
function initVariablesInDatasetTypes()
{  
    variablesInDatasetRow["impact"] = [types[0], types[2], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1]];
    variablesInDatasetRow["cars"] = [types[0], types[1], types[2], types[1], types[1], types[1], types[1], types[1], types[2]];
    variablesInDatasetRow["weightLoss"] = [types[0], types[2], types[2], types[1]];
    variablesInDatasetRow["store"] = [types[1], types[1], types[2], types[0]];    
    variablesInDatasetRow["SAT"] = [types[0], types[1], types[1], types[1], types[1], types[1]];
    variablesInDatasetRow["hotdogs"] = [types[2], types[1], types[1]];
    variablesInDatasetRow["bankloan"] = [types[1], types[2], types[2], types[1], types[1], types[1], types[1], types[1], types[1], types[1]];
    variablesInDatasetRow["car_sales"] = [types[2], types[0], types[1], types[1], types[2], types[1], types[1], types[1], types[1], types[1], types[1], types[1], types[1]];
    variablesInDatasetRow["hp"] = [types[2], types[2], types[2]];
    variablesInDatasetRow["keyboards"] = [types[0], types[2], types[2], types[1], types[1], types[1]];
    variablesInDatasetRow["foodEffect"] = [types[0], types[2], types[2], types[1], types[1], types[1]];
    variablesInDatasetRow["weight_loss"] = [types[0], types[2], types[2], types[1], types[1], types[1]];
    variablesInDatasetRow["phoneEffect"] = [types[0], types[2], types[2], types[1], types[1], types[1]];
}

function displayDataForVariable(variable)
{
    var variableData = variables[variable]["dataset"];
    
    var LEFT = canvasWidth/2 - plotWidth/2;
    var RIGHT = canvasWidth/2 + plotWidth/2;
    
    var TOP = canvasHeight/2 - plotHeight/2;
    var BOTTOM = canvasHeight/2 + plotHeight/2;
    
    var canvas = d3.select("#canvas");
    
    canvas.append("p")
            .text("Unfortunately, this variable has too many levels and does not have a meaningful visualisation!")
            .attr("align", "center")
            .attr("style", "font-size: " + fontSizeForDisplayDataTitle + "px")
            .attr("class", "displayDataText");
    
    var table = canvas.append("table")
            .attr("border", "1")
            .attr("class", "displayDataTable")
            .attr("style", "font-size: " + fontSizeForDisplayDataTableElements + "px; position: relative; width: 30%; top: " + scaleForWindowSize(45) + "px; margin: 0 auto; border-spacing: 0; border-collapse: collapse;");
            
    table.append("tr").append("th").text(variable).attr("style", "font-size: " + 1.3*fontSizeForDisplayDataTableElements + "px;");      
            
    for(var i=0; i<variableData.length; i++)
    {
        if(i < displayDataLimit)
        {
            if(i > rangeToFade)
            {
                table.append("tr").append("td").text(variableData[i]).attr("align", "center").attr("style", "color: rgba(0, 0, 0, " + ((displayDataLimit - i)/(displayDataLimit - rangeToFade))*1 + ")");
            }
            else
            {
                table.append("tr").append("td").attr("align", "center").text(variableData[i]);            
            }
        }
    }
}

//drawing
function getWidth()
{
      var x = 0;
      if (self.innerHeight)
      {
              x = self.innerWidth;
      }
      else if (document.documentElement && document.documentElement.clientHeight)
      {
              x = document.documentElement.clientWidth;
      }
      else if (document.body)
      {
              x = document.body.clientWidth;
      }
      return x;
}

function getHeight()
{
      var y = 0;
      if (self.innerHeight)
      {
              y = self.innerHeight;
      }
      else if (document.documentElement && document.documentElement.clientHeight)
      {
              y = document.documentElement.clientHeight;
      }
      else if (document.body)
      {
              y = document.body.clientHeight;
      }
      return y;
}

function plotVisualisation()
{   
    resetSVGCanvas();
    drawFullScreenButton();
   
    switch(currentVisualisationSelection)
    {
        case "Histogram":
                                    {
                                        curveX = [];
                                        curveY = [];
                                        
                                        makeHistogram();
                                        
                                        break;
                                    }
        case "Boxplot":
                                    { 
                                        boxes = [];
                                        meanCircles = [];
                                        medianLines = [];
                                        topFringes = [];
                                        bottomFringes = [];
                                        topFringeConnectors = [];
                                        bottomFringeConnectors = [];
                                        CILines = [];
                                        CITopLines = [];
                                        CIBottomLines = [];
                                        yAxisTexts = [];
                                        outlierValues = [];
                                        topFringeValues = [];
                                        bottomFringeValues = [];
                                        
                                        makeBoxplot();
                                        
                                        break;
                                    }
        case "Scatterplot":
                                    {
                                        makeScatterplot();
                                        
                                        break;
                                    }
        case "Scatterplot-matrix":
                                    {
                                        makeScatterplotMatrix();
                                        
                                        break;
                                    }
    }
}

function resetSVGCanvas()
{
    removeElementsByClassName("regressionPredictionDiv");
    removeElementsByClassName("dialogBox");
    
    if(document.getElementById("plotCanvas") != null)
        removeElementById("plotCanvas");
    if(document.getElementById("sideBarCanvas") != null)
        removeElementById("sideBarCanvas");
            
    var plotCanvas = d3.select("#canvas").append("svg");        
    plotCanvas.attr("id", "plotCanvas")
              .attr("x", 0)
              .attr("y", 0)
              .attr("height", canvasHeight)
              .attr("width", canvasWidth)
              .attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
            
    var sideBarCanvas = d3.select("#sideBar").append("svg");        
    sideBarCanvas.attr("id", "sideBarCanvas")
              .attr("x", 0)
              .attr("y", 0)
              .attr("height", canvasHeight)
              .attr("width", sideBarWidth)
              .attr("viewBox", "0 0 " + sideBarWidth + " " + canvasHeight);
              
//     sideBarCanvas.append("image")
//                     .attr("x", sideBarWidth - 3*(helpButtonWidth + helpButtonOffset))
//                     .attr("y", helpButtonOffset/4)
//                     .attr("width", sideBarWidth)
//                     .attr("height", helpButtonHeight)
//                     .attr("xlink:href", "images/leather.png");
    
    drawHelpButton();
    drawResetButton();
}

function drawFullScreenButton()
{
//     var canvas = d3.select("#sideBarCanvas");
//     
//     canvas.append("image")
//                 .attr("x", canvas.attr("width") - (fullScreenButtonSize + fullScreenButtonOffset))
//                 .attr("y", 0)
//                 .attr("xlink:href", "images/fullscreennormal.png")
//                 .attr("height", fullScreenButtonSize)
//                 .attr("width", fullScreenButtonSize)
//                 .attr("style", "opacity: 1.0;")
//                 .attr("class", "fullscreen");
}

function drawHelpButton()
{
    var sideBar = d3.select("#sideBarCanvas");
    helpButtonOffset = assumptionImageSize*2;
    sideBar.append("rect")
            .attr("x", sideBarWidth - helpButtonWidth - helpButtonOffset)
            .attr("y", scaleForWindowSize(5))//canvasHeight - helpButtonHeight - helpButtonOffset)
            .attr("rx", "15px")
            .attr("ry", "15px")
            .attr("height", helpButtonHeight)
            .attr("width", helpButtonWidth)
            .attr("fill", "url(#buttonFillNormal)")
            .attr("filter", "url(#Bevel)")
            .attr("stroke", "black")
            .attr("class", "helpButtonBack");
    
    sideBar.append("text")
            .attr("x", sideBarWidth - helpButtonWidth/2 - helpButtonOffset)
            .attr("y", scaleForWindowSize(12) + 2*helpButtonHeight/3)//canvasHeight - helpButtonHeight/3 - helpButtonOffset)
            .attr("font-size", scaleForWindowSize(55))
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .text("?")
            .attr("class", "helpButtonText");
    
    sideBar.append("rect")
            .attr("x", sideBarWidth - helpButtonWidth - helpButtonOffset)
            .attr("y", scaleForWindowSize(5))//canvasHeight - helpButtonHeight - helpButtonOffset)
            .attr("rx", "15px")
            .attr("ry", "15px")
            .attr("height", helpButtonHeight)
            .attr("width", helpButtonWidth)
            .attr("opacity", "0.1")
            .attr("class", "helpButtonFront");
}

function drawBackButton()
{
    var sideBar = d3.select("#sideBarCanvas");
    var helpButtonOffset = assumptionImageSize;
    
    var offset = 2;
    
    sideBar.append("rect")
            .attr("x", sideBarWidth - offset*(helpButtonWidth + helpButtonOffset))
            .attr("y", helpButtonOffset/2)//canvasHeight - helpButtonHeight - helpButtonOffset)
            .attr("rx", "15px")
            .attr("ry", "15px")
            .attr("height", helpButtonHeight)
            .attr("width", helpButtonWidth)
            .attr("fill", "url(#bannerFillNormal)")
            .attr("filter", "url(#Bevel)")
            .attr("stroke", "black")
            .attr("class", "backButtonBack");
    
    sideBar.append("text")
            .attr("x", sideBarWidth - offset*(helpButtonWidth + helpButtonOffset) + helpButtonWidth/2)
            .attr("y", helpButtonOffset/2 + 2*helpButtonHeight/3)//canvasHeight - helpButtonHeight/3 - helpButtonOffset)
            .attr("font-size", scaleForWindowSize(32))
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .text("<")
            .attr("class", "backButtonText");
    
    sideBar.append("rect")
            .attr("x", sideBarWidth - offset*(helpButtonWidth + helpButtonOffset))
            .attr("y", helpButtonOffset/2)//canvasHeight - helpButtonHeight - helpButtonOffset)
            .attr("rx", "15px")
            .attr("ry", "15px")
            .attr("height", helpButtonHeight)
            .attr("width", helpButtonWidth)
            .attr("opacity", "0.1")
            .attr("class", "backButtonFront");
}

function drawResetButton()
{
    var sideBar = d3.select("#sideBarCanvas");    
    var helpButtonOffset = assumptionImageSize*2;
    
    var offset = 2;
    
    sideBar.append("rect")
            .attr("x", sideBarWidth - offset*(helpButtonWidth + helpButtonOffset))
            .attr("y", scaleForWindowSize(5))//canvasHeight - helpButtonHeight - helpButtonOffset)
            .attr("rx", "15px")
            .attr("ry", "15px")
            .attr("height", helpButtonHeight)
            .attr("width", helpButtonWidth)
            .attr("fill", "grey")
            .attr("filter", "none")
            .attr("stroke", "black")
            .attr("class", "backButtonBack");
    
    sideBar.append("image")
            .attr("x", sideBarWidth - offset*(helpButtonWidth + helpButtonOffset) + (helpButtonWidth/1.5)/4)
            .attr("y", scaleForWindowSize(5) + (helpButtonHeight/1.5)/4)
            .attr("height", helpButtonHeight/1.5)
            .attr("width", helpButtonWidth/1.5)
            .attr("xlink:href", "images/reset.png")
            .attr("class", "backButtonText");
    
    sideBar.append("rect")
            .attr("x", sideBarWidth - offset*(helpButtonWidth + helpButtonOffset))
            .attr("y", scaleForWindowSize(5))//canvasHeight - helpButtonHeight - helpButtonOffset)
            .attr("rx", "15px")
            .attr("ry", "15px")
            .attr("height", helpButtonHeight)
            .attr("width", helpButtonWidth)
            .attr("opacity", "0.1")
            .attr("class", "backButtonFront");
}

function drawButtonInSideBar(buttonText, className, offset)
{
    if(offset == undefined)
        offset = 0;
        
    var canvas = d3.select("#sideBarCanvas");
    
    canvas.append("rect")
            .attr("x", assumptionImageSize)
            .attr("y", canvasHeight - buttonOffset + offset*(buttonPadding/2 + buttonHeight))
            .attr("width", sideBarWidth - assumptionImageSize*2)
            .attr("height", buttonHeight)
            .attr("rx", scaleForWindowSize(10) + "px")
            .attr("ry", scaleForWindowSize(10) + "px")
            .attr("fill", "url(#buttonFillNormal)")
            .attr("filter", "url(#Bevel)")
            .attr("stroke", "black")
            .attr("id", "button")
            .attr("class", className);
    
    canvas.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight - buttonOffset + offset*(buttonPadding/2 + buttonHeight) + buttonHeight/2 + yAxisTickTextOffset)
            .attr("text-anchor", "middle")
            .text(buttonText)
            .attr("font-size", fontSizeButtonLabel + "px")
            .attr("id", "text")
            .attr("class", className); 
}

function drawDialogBoxToGetOutcomeVariable()
{
    var canvas = d3.select("#plotCanvas");
    
    var dialogBoxHeight = plotHeight/2;
    var dialogBoxWidth = plotWidth/2;
    
    var centerX = canvasWidth/2;
    var centerY = canvasHeight/2;
    
    var variableList = sort(currentVariableSelection);
    
    canvas.append("rect")
            .attr("x", centerX - dialogBoxWidth/2)
            .attr("y", centerY - dialogBoxHeight/2)
            .attr("width", dialogBoxWidth)
            .attr("height", dialogBoxHeight)
            .attr("rx", "5px")
            .attr("ry", "5px")
            .attr("fill", "white")
            .attr("stroke", "grey")
            .attr("filter", "url(#shadow)")
            .attr("id", "regression")
            .attr("class", "dialogBox");
    
    canvas.append("text")
            .attr("x", centerX)
            .attr("y", centerY - dialogBoxHeight/4)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeVariablePanel + "px")
            .text("SELECT THE OUTCOME VARIABLE")
            .attr("id", "regression")
            .attr("class", "dialogBox");
            
    var step = (dialogBoxHeight/2)/currentVariableSelection.length;
    var yStart = centerY;
    var buttHeight = step - 10;
    
    for(var i=0; i<currentVariableSelection.length; i++)
    {
        if(variableRows[currentVariableSelection[i]] == "dependent")
        {
            canvas.append("rect")
                    .attr("x", centerX - dialogBoxWidth/3)
                    .attr("y", i*step + yStart)
                    .attr("width", 2*dialogBoxWidth/3)
                    .attr("height", buttHeight)
                    .attr("rx", scaleForWindowSize(10) + "px")
                    .attr("ry", scaleForWindowSize(10) + "px")
                    .attr("fill", "url(#buttonFillNormal)")
                    .attr("filter", "url(#Bevel)")
                    .attr("stroke", "black")
                    .attr("id", currentVariableSelection[i])
                    .attr("class", "outcomeVariable");
            canvas.append("text")
                    .attr("x", centerX)
                    .attr("y", i*step + yStart + buttHeight/2 + yAxisTickTextOffset)
                    .attr("text-anchor", "middle")
                    .text(currentVariableSelection[i])
                    .attr("font-size", fontSizeVariablePanel)
                    .attr("id", currentVariableSelection[i])
                    .attr("class", "outcomeVariable");
        }
    }
}

function drawDialogBoxToGetPopulationMean()
{
    var canvas = d3.select("#plotCanvas");
    
    var dialogBoxHeight = plotHeight/2;
    var dialogBoxWidth = plotWidth/2;
    
    var centerX = canvasWidth/2;
    var centerY = canvasHeight/2;
    
    var variableList = sort(currentVariableSelection);
    
    canvas.append("rect")
            .attr("x", centerX - dialogBoxWidth/2)
            .attr("y", centerY - dialogBoxHeight/2)
            .attr("width", dialogBoxWidth)
            .attr("height", dialogBoxHeight/3)
            .attr("rx", "5px")
            .attr("ry", "5px")
            .attr("fill", "white")
            .attr("stroke", "grey")
            .attr("filter", "url(#shadow)")
            .attr("id", "regression")
            .attr("class", "dialogBox");
    
    var LEFT = (width - canvasWidth - sideBarWidth) + centerX - dialogBoxWidth/2;
    var TOP = centerY - dialogBoxHeight/2;
    
    var divElement = d3.select("body").append("div").attr("style", "position: absolute; left: " + LEFT + "px; top: " + TOP + "px; height: " + dialogBoxHeight + "px; width: " + dialogBoxWidth + "px; text-align: center;").attr("class", "dialogBox");

    var normality = d3.select("#normality.crosses");
    var inText = d3.select("#normality.crosses").attr("display") == "inline" ? "POPULATION MEDIAN = " : "POPULATION MEAN = ";
    
    divElement.append("label")
                .attr("align", "center")
                .attr("vertical-align", "middle")
                .attr("style", "font:1.2em \"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif; color: black; padding-top: 10px;")
                .text(inText);
    divElement.append("input")
                .attr("type", "text")
                .attr("style", "border-color: #000000")
                .attr("id", "populationValue");
                
    divElement.append("br");
    divElement.append("br");
    
    divElement.append("input")
                .attr("type", "button")
                .attr("onclick", "populationMeanEntered()")
                .attr("id", "oneSampleTestButton")
                .attr("style", "fill: url(#buttonFillNormal); filter: url(#Bevel)")
                .attr("value","TEST AGAINST POPULATION ESTIMATE");
    
}   

function drawEffectSize(value)
{
    var sideBar = d3.select("#sideBarCanvas");
    
    var type = testResults["effect-size-type"];
    
    if(type == "d")
        value = value > 3.0 ? 3.0 : value;
    
    var min = parseFloat(effectSizeMins[type]);
    var max = parseFloat(effectSizeMaxs[type]);
    value = parseFloat(value);
    
    var color = getColour(type, value);
    
    var L = sideBarWidth/2 - effectSizeWidth/2;
    var T = significanceTestResultOffsetTop - significanceTestResultStep - effectSizeHeight/2;
    
    var bar = sideBar.append("rect")
            .attr("x", L)
            .attr("y", T)
            .attr("width", effectSizeWidth)
            .attr("height", effectSizeHeight)
            .attr("stroke", "MediumSlateBlue")
            .attr("fill", "none")
            .attr("class", "effectSize");
            
    var scale = d3.scale.linear()
                            .domain([min, max])
                            .range([0, effectSizeWidth]);
    
    if(scale(min + (value - 0)) > 0)
    {
        var effectSize = sideBar.append("rect")
                                    .attr("x", L + scale(0))
                                    .attr("y", T)
                                    .attr("width", scale(min + (value - 0)))
                                    .attr("height", effectSizeHeight)
                                    .attr("fill", color)
                                    .attr("class", "effectSize");
    }
    else
    {
        var effectSize = sideBar.append("rect")
                                    .attr("x", L + scale(0) + scale(min + (value - 0)))
                                    .attr("y", T)
                                    .attr("width", -scale(min + (value - 0)))
                                    .attr("height", effectSizeHeight)
                                    .attr("fill", color)
                                    .attr("class", "effectSize");
    }
    
    if(Math.abs(scale(min + (value - 0))) > effectSizeWidth/4)
    {    
        sideBar.append("text")
                .attr("x", L + scale(0) + scale(min + (value - 0)) - yAxisTickTextOffset)
                .attr("y", significanceTestResultOffsetTop - significanceTestResultStep + effectSizeHeight/2 - yAxisTickTextOffset)
                .attr("text-anchor", "end")
                .attr("font-size", effectSizeFontSize)
                .attr("fill", "white")
                .text(value)
                .attr("id", "effectSizeValue")
                .attr("class", "effectSize");
    }
    else
    {
        sideBar.append("text")
                .attr("x", L + scale(0) + scale(min + (value - 0)) + yAxisTickTextOffset)
                .attr("y", significanceTestResultOffsetTop - significanceTestResultStep + effectSizeHeight/2 - yAxisTickTextOffset)
                .attr("text-anchor", "start")
                .attr("font-size", effectSizeFontSize)
                .attr("fill", "black")
                .text(value)
                .attr("id", "effectSizeValue")
                .attr("class", "effectSize");
    }
    
    sideBar.append("text")
            .attr("x", L + scale(min))
            .attr("y", T + 3*effectSizeHeight/2)
            .attr("text-anchor", "start")
            .attr("font-size", effectSizeFontSize)
            .attr("fill", "darkgrey")
            .attr("id", "labelMin")
            .attr("class", "effectSize")
            .text(min);
    
    sideBar.append("text")
            .attr("x", L + scale(max))
            .attr("y", T + 3*effectSizeHeight/2)
            .attr("text-anchor", "end")
            .attr("font-size", effectSizeFontSize)
            .attr("fill", "darkgrey")
            .attr("id", "labelMax")
            .attr("class", "effectSize")
            .text(max);
    
    var effectSizeInterpretationIndicators = ["small", "medium", "large"];
        
    for(i=0; i<effectSizeInterpretations[type].length; i++)
    {
        sideBar.append("line")
                .attr("x1", L + scale(effectSizeInterpretations[type][i]))
                .attr("y1", T)
                .attr("x2", L + scale(effectSizeInterpretations[type][i]))
                .attr("y2", T + effectSizeHeight)
                .attr("stroke", "black")
                .attr("display", "none")
                .attr("class", "effectSizeInterpretationIndicators");
        sideBar.append("text")
                .attr("x", L + scale(effectSizeInterpretations[type][i]))
                .attr("y", T - yAxisTickTextOffset)
                .attr("transform", "rotate (-45 " + (L + scale(effectSizeInterpretations[type][i])) + " " + (T - yAxisTickTextOffset) + ")")
                .attr("text-anchor", "start")
                .attr("font-size", scaleForWindowSize(14) + "px")
                .text(effectSizeInterpretationIndicators[i])
                .attr("fill", getColour(type, effectSizeInterpretations[type][i]))
                .attr("display", "none")
                .attr("class", "effectSizeInterpretationIndicators");
    }
    
    
    if(min < 0)
    {
        for(i=0; i<effectSizeInterpretations[type].length; i++)
        {
            sideBar.append("line")
                    .attr("x1", L + scale(-effectSizeInterpretations[type][i]))
                    .attr("y1", T)
                    .attr("x2", L + scale(-effectSizeInterpretations[type][i]))
                    .attr("y2", T + effectSizeHeight)
                    .attr("stroke", "black")
                    .attr("display", "none")
                    .attr("class", "effectSizeInterpretationIndicators");
            sideBar.append("text")
                    .attr("x", L + scale(-effectSizeInterpretations[type][i]))
                    .attr("y", T - yAxisTickTextOffset)
                    .attr("transform", "rotate (-45 " + (L + scale(-effectSizeInterpretations[type][i])) + " " + (T - yAxisTickTextOffset) + ")")
                    .attr("text-anchor", "start")
                    .attr("font-size", scaleForWindowSize(14) + "px")
                    .text(effectSizeInterpretationIndicators[i])
                    .attr("fill", getColour(type, effectSizeInterpretations[type][i]))
                    .attr("display", "none")
                    .attr("class", "effectSizeInterpretationIndicators");
        }
    
        sideBar.append("text")
            .attr("x", L + scale(0))
            .attr("y", T + 3*effectSizeHeight/2)
            .attr("text-anchor", "middle")
            .attr("font-size", effectSizeFontSize)
            .attr("fill", "darkgrey")
            .attr("id", "labelMid")
            .attr("class", "effectSize")
            .text(0);
    }
    
    if(type == "eS")
    {    
        var mainText = sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", significanceTestResultOffsetTop - significanceTestResultStep - effectSizeHeight/2 - yAxisTickTextOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", effectSizeFontSize)
            .attr("fill", "black")
            .attr("id", "effectSizeText")
            .attr("class", "effectSize");
            
        mainText.append("tspan")
                    .text("η");
        mainText.append("tspan")
                    .attr("baseline-shift", "super")
                    .text("2");
    }
    else if(type == "rS")
    {    
        var mainText = sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", significanceTestResultOffsetTop - significanceTestResultStep - effectSizeHeight/2 - yAxisTickTextOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", effectSizeFontSize)
            .attr("id", "effectSizeText")
            .attr("fill", "black")
            .attr("class", "effectSize");
            
        mainText.append("tspan")
                    .text("r");
        mainText.append("tspan")
                    .attr("baseline-shift", "super")
                    .text("2");
    }
    else
    {
        sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", significanceTestResultOffsetTop - significanceTestResultStep - effectSizeHeight/2 - yAxisTickTextOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", effectSizeFontSize)
            .attr("id", "effectSizeText")
            .attr("fill", "black")
            .text(type)
            .attr("class", "effectSize");
    } 
    
    sideBar.append("rect")
            .attr("x", 0)
            .attr("y", T - effectSizeHeight/2)
            .attr("width", sideBarWidth)
            .attr("height", effectSizeHeight*2)
            .attr("stroke", "black")
            .attr("opacity", "0.001")
            .attr("id", "effectSizeFront");        
}

function drawParameter(DF, parameter)
{
    var sideBar = d3.select("#sideBarCanvas");
    
    var type = testResults["parameter-type"];
    

    
    var X = sideBarWidth/2;
    var Y = significanceTestResultOffsetTop + 2*significanceTestResultStep;
    
    if(type == "cS")
    {
        var mainText = sideBar.append("text")
                .attr("x", X)
                .attr("y", Y)
                .attr("font-size", fontSizeSignificanceTestResults + "px")
                .attr("text-anchor", "middle")
                .attr("fill", "#627bf4")
                .attr("class", "parameter");
            
        mainText.append("tspan")
                    .text("𝝌");
        
        mainText.append("tspan")
                    .attr("baseline-shift", "super")
                    .text("2");
        
        mainText.append("tspan")
                    .text("(" + DF + ") = " + parameter);
    }
    else
    {
        if(hasDF[type] && !pairwiseComparisons)
        {
            sideBar.append("text")
                    .attr("x", X)
                    .attr("y", Y)
                    .attr("font-size", fontSizeSignificanceTestResults + "px")
                    .attr("text-anchor", "middle")
                    .attr("fill", "#627bf4")
                    .attr("class", "parameter")
                    .text(type + "(" + DF + ") = " + parameter);
        }
        else
        {
            sideBar.append("text")
                .attr("x", X)
                .attr("y", Y)
                .attr("text-anchor", "middle")
                .attr("font-size", fontSizeSignificanceTestResults + "px")
                .attr("fill", "#627bf4")
                .attr("class", "parameter")
                .text(type + " = " + parameter);
        }
    }
}    

function drawComputingResultsImage()
{
    var sideBar = d3.select("#sideBarCanvas");
    
    var T = sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 - computingResultsImageSize/2)
            .text("PICKING THE APPROPRIATE TEST...")
            .attr("font-size", scaleForWindowSize(14))
            .attr("text-anchor", "middle")
            .attr("id", "computingResultsImage");
    
    T.transition().duration(750).attr("opacity", "0.2");
    T.transition().delay(750).duration(750).attr("opacity", "1.0");
    
    setInterval(function()
    {
        T.transition().duration(750).attr("opacity", "0.2");
        T.transition().delay(750).duration(750).attr("opacity", "1.0");
    }, 1500);
}

function setOpacityForElementsWithClassNames(classNames, opacity)
{
    for(var i=0; i<classNames.length; i++)
    {
        d3.selectAll("." + classNames[i]).transition().duration(1000).delay(500).attr("opacity", opacity);
    }
}

//Significance Tests
function loadAssumptionCheckList(type)
{
    var canvas = d3.select("#sideBarCanvas");
    
    var title = canvas.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", assumptionOffsetTop)
            .attr("font-size", fontSizeAssumptionsTitle + "px")
            .attr("text-anchor", "middle")
            .attr("opacity", "0")
            .attr("fill", "#627bf4")
            .text("ASSUMPTIONS")
            .attr("class", "checkingAssumptions");
    
    title.transition().delay(500).duration(700).attr("opacity", "1.0").attr("y", assumptionOffsetTop - 50);
    
    //timer for 500 ms
    setTimeout(function(){
        for(var i=0; i<assumptions[type].length; i++)
        {
            canvas.append("rect")
                    .attr("x", assumptionImageSize*1.25) 
                    .attr("y", i*assumptionStep + assumptionOffsetTop - assumptionImageSize/2 - 10)
                    .attr("width", sideBarWidth - 2*assumptionImageSize)
                    .attr("height", assumptionImageSize)
                    .attr("rx", "5px")
                    .attr("ry", "5px")
                    .attr("fill", "url(#buttonFillNormal)")
                    .attr("filter", "url(#Bevel)")
                    .attr("stroke", "black")
                    .attr("id", assumptions[type][i])
                    .attr("class", "assumptionsButtonBack");
                    
            canvas.append("text")
                .attr("x", assumptionImageSize*1.25 + assumptionImageSize/2)
                .attr("y", i*assumptionStep + assumptionOffsetTop - 5)
                .attr("font-size", fontSizeAssumptions + "px")
                .attr("fill", "black")
                .text(assumptionsText[assumptions[type][i]])
                .attr("id", assumptions[type][i])
                .attr("class", "assumptions");
                
            canvas.append("image")
                .attr("x", 0)
                .attr("y", i*assumptionStep + assumptionOffsetTop - assumptionImageSize/2 - 10)
                .attr("text-anchor", "end")
                .attr("xlink:href", "images/checkingAssumptions.gif")
                .attr("height", assumptionImageSize)            
                .attr("width", assumptionImageSize)
                .attr("id", assumptions[type][i])
                .attr("class", "loading");
                
            canvas.append("image")
                .attr("x", 0)
                .attr("y", i*assumptionStep + assumptionOffsetTop - assumptionImageSize/2 - 10)
                .attr("text-anchor", "end")
                .attr("xlink:href", "images/tick.png")
                .attr("height", assumptionImageSize)            
                .attr("width", assumptionImageSize)
                .attr("display", "none")
                .attr("id", assumptions[type][i])
                .attr("class", "ticks");
                         
            canvas.append("image")
                .attr("x", 0)
                .attr("y", i*assumptionStep + assumptionOffsetTop - assumptionImageSize/2 - 8)
                .attr("text-anchor", "end")
                .attr("xlink:href", "images/cross.png")
                .attr("height", assumptionImageSize)
                .attr("width", assumptionImageSize)
                .attr("display", "none")
                .attr("id", assumptions[type][i])
                .attr("class", "crosses");
                
            canvas.append("rect")
                    .attr("x", assumptionImageSize*1.25) 
                    .attr("y", i*assumptionStep + assumptionOffsetTop - assumptionImageSize/2 - 10)
                    .attr("width", sideBarWidth - 2*assumptionImageSize)
                    .attr("height", assumptionImageSize)
                    .attr("rx", "5px")
                    .attr("ry", "5px")
                    .attr("opacity", "0.1")
                    .attr("id", assumptions[type][i])
                    .attr("class", "assumptionsButtonFront");
        }    
    }, 1300);
    
    
}

function drawNormalityPlot(dependentVariable, level, type)
{
    //make histogram with these variables in a separate svg
    removeElementsByClassName("homogeneityPlot")
    
    var mean;
    if(level == "dataset")
        mean = d3.select("#" + dependentVariable + ".means");
    else
        mean = d3.select("#" + getValidId(level) + ".means");
        
    var centerX = mean.attr("cx");   
    
    
    makeHistogramWithDensityCurve(centerX - normalityPlotWidth/2, canvasHeight + normalityPlotOffset, normalityPlotWidth, normalityPlotHeight, dependentVariable, level, type);//left, top, histWidth, histHeight, dependentVariable, level;
}

function drawScales(cx, cy)
{
    //get number of means
    var yMin = Array.min(cy);
    var yMax = Array.max(cy);
    
    var canvas = d3.select("#plotCanvas");    
    var x = canvasWidth/2 + plotWidth/2 + significanceTestScaleOffset;
    
    var variableList = getSelectedVariables();
    var means = [];
    
    var levels = variableList["independent-levels"]; 

    for(var i=0; i<cy.length; i++)
    {
        means.push(getActualValue(cy[i]));
    }
    
    means = means.sort(function(a,b){return a-b});
    cy = cy.sort(function(a,b){return b-a});
    
    var cyMax = Math.max.apply(Math, cy);
    var cyMin = Math.min.apply(Math, cy);            
    
    canvas.append("text")
                .attr("x", x + scaleForWindowSize(35))
                .attr("y", (yMin + yMax)/2)
                .attr("fill", "black")
                .attr("font-size", scaleForWindowSize(14) + "px")
                .attr("id", "tickText")
                .attr("class", "differenceInMeansMain")
                .text(dec2(means[means.length-1] - means[0]));
    
    if(1)
    {    
        var error = parseFloat(testResults["error"]);        
        testResults["CI"] = calculateCI(means[means.length -1] - means[0], error);
        
        console.log(testResults["CI"]);
        
        var BOTTOM = canvasHeight/2 + plotHeight/2;
        //CI for mean
        canvas.append("line")
                .attr("x1", canvasWidth/2 + plotWidth/2 + 10)
                .attr("y1", BOTTOM - getFraction(getActualValue(cyMin) - error)*plotHeight)
                .attr("x2", canvasWidth/2 + plotWidth/2 + 10)
                .attr("y2", BOTTOM - getFraction(getActualValue(cyMin) + error)*plotHeight)
                .attr("stroke", "rosybrown")
                .attr("stroke-width", "4")
                .attr("class", "CI_mean");
            
        canvas.append("line")
                .attr("x1", canvasWidth/2 + plotWidth/2 + 5)
                .attr("y1", BOTTOM - getFraction(getActualValue(cyMin) - error)*plotHeight)
                .attr("x2", canvasWidth/2 + plotWidth/2 + 15)
                .attr("y2", BOTTOM - getFraction(getActualValue(cyMin) - error)*plotHeight)
                .attr("stroke", "rosybrown")
                .attr("stroke-width", "4")
                .attr("class", "CI_bottom");
            
        canvas.append("line")
                .attr("x1", canvasWidth/2 + plotWidth/2 + 5)
                .attr("y1", BOTTOM - getFraction(getActualValue(cyMin) + error)*plotHeight)
                .attr("x2", canvasWidth/2 + plotWidth/2 + 15)
                .attr("y2", BOTTOM - getFraction(getActualValue(cyMin) + error)*plotHeight)
                .attr("stroke", "rosybrown")
                .attr("stroke-width", "4")
                .attr("class", "CI_top");
    }
    if(cy.length >= 2)
    {
        for(var i=0; i<cy.length-1; i++)
        {  
            if(cy.length > 2)
            {
                canvas.append("text")
                    .attr("x", x + scaleForWindowSize(5))
                    .attr("y", (parseFloat(cy[i]) + parseFloat(cy[i+1]))/2 + yAxisTickTextOffset)
                    .attr("fill", "black")
                    .attr("id", "DIM" + i)
                    .attr("class", "differenceInMeansText")
                    .attr("display", "none")
                    .text(dec2(means[i+1] - means[i]));
            }
                
            canvas.append("line")
                .attr("x1", x-5)
                .attr("y1", cy[i])
                .attr("x2", x)
                .attr("y2", cy[i])
                .attr("stroke", "black")
                .attr("stroke-width", scaleForWindowSize(3) + "px")
                .attr("id", "DIM" + i)
                .attr("class", "differenceInMeans");       
            
            canvas.append("line")
                .attr("x1", x-5)
                .attr("y1", cy[i+1])
                .attr("x2", x)
                .attr("y2", cy[i+1])
                .attr("stroke", "black")
                .attr("stroke-width", scaleForWindowSize(3) + "px")
                .attr("id", "DIM" + i)
                .attr("class", "differenceInMeans"); 
            
            canvas.append("line")
                .attr("x1", x)
                .attr("y1", cy[i])
                .attr("x2", x)
                .attr("y2", cy[i+1])
                .attr("stroke", "black")
                .attr("stroke-width", scaleForWindowSize(5) + "px")
                .attr("id", "DIM" + i)
                .attr("class", "differenceInMeans");       
        }           
    }
}

function displayOneSampleTestResults()
{        
    var cx = [];
    var cy = [];

    removeElementsByClassName("significanceTest");
    if(document.getElementById("computingResultsImage") != null)
        removeElementById("computingResultsImage");
    
    var means = document.getElementsByClassName("means");
    var medians = document.getElementsByClassName("medians");
    var meanRefLines = [];
    
    var RIGHT = canvasWidth/2 + plotWidth/2;
    var BOTTOM = canvasHeight/2 + plotHeight/2;
    
    var canvas = d3.select("#plotCanvas");
    
    if(testResults["type"] == "mean")
    {       
        canvas.append("line")
            .attr("x1", RIGHT)
            .attr("y1", BOTTOM - getFraction(testResults["estimate"])*plotHeight)
            .attr("x2", canvasWidth/2-plotWidth/2-axesOffset)
            .attr("y2", BOTTOM - getFraction(testResults["estimate"])*plotHeight)
            .attr("stroke", "green")
            .attr("id", "estimateLine")
            .attr("class", "significanceTest");
        
        canvas.append("line")
            .attr("x1", RIGHT)
            .attr("y1", BOTTOM - getFraction(sessionStorage.popMean)*plotHeight)
            .attr("x2", canvasWidth/2-plotWidth/2-axesOffset)
            .attr("y2", BOTTOM - getFraction(sessionStorage.popMean)*plotHeight)
            .attr("stroke", "red")
            .attr("id", "populationLine")
            .attr("class", "significanceTest");
            
        cy.push(BOTTOM - getFraction(testResults["estimate"])*plotHeight);
        cy.push(BOTTOM - getFraction(sessionStorage.popMean)*plotHeight);
    }
    else
    {
        canvas.append("line")
                .attr("x1", RIGHT)
                .attr("y1", BOTTOM - getFraction(testResults["estimate"])*plotHeight)
                .attr("x2", canvasWidth/2-plotWidth/2-axesOffset)
                .attr("y2", BOTTOM - getFraction(testResults["estimate"])*plotHeight)
                .attr("stroke", "green")
                .attr("id", "estimateLine")
                .attr("class", "significanceTest");
        
        canvas.append("line")
                .attr("x1", RIGHT)
                .attr("y1", BOTTOM - getFraction(sessionStorage.popMedian)*plotHeight)
                .attr("x2", canvasWidth/2-plotWidth/2-axesOffset)
                .attr("y2", BOTTOM - getFraction(sessionStorage.popMedian)*plotHeight)
                .attr("stroke", "red")
                .attr("id", "populationLine")
                .attr("class", "significanceTest");
                
        cy.push(BOTTOM - getFraction(testResults["estimate"])*plotHeight);
        cy.push(BOTTOM - getFraction(sessionStorage.popMedian)*plotHeight);
    }
    
    
    
    var cyMax = Math.max.apply(Math, cy);
    var cyMin = Math.min.apply(Math, cy);            

    var differenceLine = canvas.append("line")
                            .attr("x1", canvasWidth/2 + plotWidth/2)
                            .attr("y1", cyMin)
                            .attr("x2", canvasWidth/2 + plotWidth/2)
                            .attr("y2", cyMax)
                            .attr("stroke", "red")
                            .attr("stroke-width", "2px")
                            .attr("class", "significanceTest");


    var x = canvasWidth/2 + plotWidth/2;
    var y = cyMin;           
    var head = canvas.append("path")
                  .attr("d", "M " + x + " " + y + " L " + (x-5)+ " " + (y+5) + " L " + (x+5) + " " + (y+5) + " z")
                  .attr("stroke", "red")
                  .attr("fill", "red")
                  .attr("class", "significanceTest");

    sideBar = d3.select("#sideBarCanvas");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + 2*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["statistic"])
            .attr("class", "significanceTest");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + 3*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["p"])
            .attr("class", "significanceTest");
    
    
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"]));
//     sideBar.append("text")
//             .attr("x", sideBarWidth/2)
//             .attr("y", canvasHeight/2 - significanceTestResultStep)
//             .attr("text-anchor", "middle")
//             .attr("font-size", "24px")
//             .attr("fill", "orange")
//             .text(testResults["effect-size"])
//             .attr("class", "significanceTest");
}
  
function displaySignificanceTestResults()
{        
    var cx = [];
    var cy = [];
    
    removeElementsByClassName("significanceTest");
    if(document.getElementById("computingResultsImage") != null)
        removeElementById("computingResultsImage");
    
    var means = document.getElementsByClassName("means");

    var meanRefLines = [];
    
    var canvas = d3.select("#plotCanvas");

    for(var i=0; i<means.length; i++)
    {
        if((means[i].getAttribute("fill") == meanColors["click"]) || (means[i].getAttribute("fill") == "#008000"))
        {
            cx.push(means[i].getAttribute("cx"));
            cy.push(means[i].getAttribute("cy"));
        
            meanRefLines[i] = canvas.append("line")
                                 .attr("x1", means[i].getAttribute("cx"))
                                 .attr("y1", means[i].getAttribute("cy"))
                                 .attr("x2", canvasWidth/2 + plotWidth/2)
                                 .attr("y2", means[i].getAttribute("cy"))
                                 .attr("stroke", "black")
                                 .attr("stroke-dasharray","5,5")
                                 .attr("id", "meanrefLine")
                                 .attr("class", "significanceTest");
                                 
                            canvas.append("line")
                                 .attr("x1", means[i].getAttribute("cx"))
                                 .attr("y1", means[i].getAttribute("cy"))
                                 .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                                 .attr("y2", means[i].getAttribute("cy"))
                                 .attr("stroke", "black")
                                 .attr("opacity", "0.25")
                                 .attr("stroke-dasharray","5,5")
                                 .attr("id", "meanrefLine")
                                 .attr("class", "significanceTest");
        }
        else
        {                                   
            cx.splice(i, 1);
            cy.splice(i, 1);                                
        }   
    }

    var cyMax = Math.max.apply(Math, cy);
    var cyMin = Math.min.apply(Math, cy);            

    var differenceLine = canvas.append("line")
                            .attr("x1", canvasWidth/2 + plotWidth/2)
                            .attr("y1", cyMin)
                            .attr("x2", canvasWidth/2 + plotWidth/2)
                            .attr("y2", cyMax)
                            .attr("stroke", "red")
                            .attr("stroke-width", "2px")
                            .attr("class", "significanceTest");


    var x = canvasWidth/2 + plotWidth/2;
    var y = cyMin;           
    var head = canvas.append("path")
                  .attr("d", "M " + x + " " + y + " L " + (x-5)+ " " + (y+5) + " L " + (x+5) + " " + (y+5) + " z")
                  .attr("stroke", "red")
                  .attr("fill", "red")
                  .attr("class", "significanceTest");
    
    drawScales(cx, cy);     
    
    var sideBar = d3.select("#sideBarCanvas");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", significanceTestResultOffsetTop + significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    
    drawParameter(testResults["df"], parseFloat(testResults["parameter"]));
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", significanceTestResultOffsetTop + 3*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text(testResults["p"])
            .attr("class", "significanceTest");
    
    
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"]));
    
    sideBar.append("rect")
                    .attr("x", scaleForWindowSize(10))
                    .attr("y", significanceTestResultOffsetTop - 3.0*significanceTestResultStep)
                    .attr("height", 6.5*significanceTestResultStep)
                    .attr("width", sideBarWidth - scaleForWindowSize(10)*2)
                    .attr("rx", "5px")
                    .attr("ry", "5px")
                    .attr("stroke", "grey")
                    .attr("stroke-dasharray", "5,5")
                    .attr("fill", "none")
                    .attr("id", "border");
}

function displayANOVAResults()
{        
    var cx = [];
    var cy = [];
    
    removeElementsByClassName("significanceTest");
    if(document.getElementById("computingResultsImage") != null)
        removeElementById("computingResultsImage");
    
    var means = document.getElementsByClassName("means");

    var meanRefLines = [];
    
    var canvas = d3.select("#plotCanvas");

    for(var i=0; i<means.length; i++)
    {
        if((means[i].getAttribute("fill") == meanColors["click"]) || (means[i].getAttribute("fill") == "#008000"))
        {
            cx.push(means[i].getAttribute("cx"));
            cy.push(means[i].getAttribute("cy"));
        
            meanRefLines[i] = canvas.append("line")
                                 .attr("x1", means[i].getAttribute("cx"))
                                 .attr("y1", means[i].getAttribute("cy"))
                                 .attr("x2", canvasWidth/2 + plotWidth/2)
                                 .attr("y2", means[i].getAttribute("cy"))
                                 .attr("stroke", "black")
                                 .attr("stroke-dasharray","5,5")
                                 .attr("id", "meanrefLine")
                                 .attr("class", "significanceTest");
                                 
                            canvas.append("line")
                                 .attr("x1", means[i].getAttribute("cx"))
                                 .attr("y1", means[i].getAttribute("cy"))
                                 .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                                 .attr("y2", means[i].getAttribute("cy"))
                                 .attr("stroke", "black")
                                 .attr("opacity", "0.25")
                                 .attr("stroke-dasharray","5,5")
                                 .attr("id", "meanrefLine")
                                 .attr("class", "significanceTest");
        }
        else
        {                                   
            cx.splice(i, 1);
            cy.splice(i, 1);                                
        }   
    }

    var cyMax = Math.max.apply(Math, cy);
    var cyMin = Math.min.apply(Math, cy);            

    var differenceLine = canvas.append("line")
                            .attr("x1", canvasWidth/2 + plotWidth/2)
                            .attr("y1", cyMin)
                            .attr("x2", canvasWidth/2 + plotWidth/2)
                            .attr("y2", cyMax)
                            .attr("stroke", "red")
                            .attr("stroke-width", "2px")
                            .attr("class", "significanceTest");

    var x = canvasWidth/2 + plotWidth/2;
    var y = cyMin;           
    var head = canvas.append("path")
                  .attr("d", "M " + x + " " + y + " L " + (x-5)+ " " + (y+5) + " L " + (x+5) + " " + (y+5) + " z")
                  .attr("stroke", "red")
                  .attr("fill", "red")
                  .attr("class", "significanceTest");
    
    drawScales(cx, cy);     
    
    var sideBar = d3.select("#sideBarCanvas");
   
    var variableList = getSelectedVariables();
    
    var levels = [variableList["independent"][0], variableList["independent"][1], variableList["independent"][0] + "-" + variableList["independent"][1]];
   
    var tabWidth = sideBarWidth/(levels.length);    
    var tabHeight = scaleForWindowSize(25);
    var fontSizeTabText = scaleForWindowSize(12);
    
    var currentX = 0;
    
    //construct the tabs
    for(var i=0; i<levels.length; i++)
    {
        tabWidth = levels[i].length*fontSizeTabText/1.6;
        sideBar.append("rect")
                .attr("x", currentX)
                .attr("y", significanceTestResultOffsetTop - 3.0*significanceTestResultStep - tabHeight)
                .attr("width", tabWidth)
                .attr("height", tabHeight)
                .attr("stroke","black")
                .attr("fill", "url(#buttonFillNormal)")
                .attr("id", levels[i])                
                .attr("data-index", i)
                .attr("class", "effectButtonBack");
        
        sideBar.append("text")
                .attr("x", currentX + tabWidth/2)
                .attr("y", significanceTestResultOffsetTop - 3.0*significanceTestResultStep - tabHeight/2 + yAxisTickTextOffset)
                .attr("text-anchor", "middle")
                .attr("font-size", fontSizeTabText + "px")
                .attr("fill", "black")
                .attr("id", levels[i])
                .text(levels[i])
                .attr("class", "effectButtonText");  
        
        sideBar.append("rect")
                .attr("x", currentX)
                .attr("y", significanceTestResultOffsetTop - 3.0*significanceTestResultStep - tabHeight)
                .attr("width", tabWidth)
                .attr("height", tabHeight)
                .attr("stroke","black")
                .attr("opacity", "0.1")
                .attr("fill", "url(#buttonFillNormal)")
                .attr("id", levels[i])
                .attr("class", "effectButtonFront");
                      
        currentX += tabWidth;
        
        if(i == 0)
        {
            d3.select("#" + levels[i] + ".effectButtonBack")
                .attr("stroke", "none")
                .attr("fill", "url(#buttonFillSelected)");
            
            d3.select("#" + levels[i] + ".effectButtonText")
                .attr("fill", "white");
        }
    }   
    
    sideBar.append("rect")
                    .attr("x", 0)
                    .attr("y", significanceTestResultOffsetTop - 3.0*significanceTestResultStep)
                    .attr("height", 6.5*significanceTestResultStep)
                    .attr("width", sideBarWidth - scaleForWindowSize(10)*2)
                    .attr("rx", "5px")
                    .attr("ry", "5px")
                    .attr("stroke", "grey")
                    .attr("stroke-dasharray", "5,5")
                    .attr("fill", "none")
                    .attr("id", "border");
    
    //drawing
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", significanceTestResultOffsetTop + significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text(testResults["method"])
            .attr("class", "significanceTest");

    
    
    //things that change for each effect
    drawParameter(testResults["df"][0], parseFloat(testResults["parameter"][0]));
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", significanceTestResultOffsetTop + 3*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text(testResults["p"][0])
            .attr("class", "significanceTest");
    
    
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"][0]));
}

function displayCorrelationResults()
{     
    var sideBar = d3.select("#sideBarCanvas");
    
    if(document.getElementById("computingResultsImage") != null)
        removeElementById("computingResultsImage");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", significanceTestResultOffsetTop + significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", significanceTestResultOffsetTop + 2*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["statistic"])
            .attr("class", "significanceTest");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", significanceTestResultOffsetTop + 3*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["p"])
            .attr("class", "significanceTest");
    
    
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"]));
//     sideBar.append("text")
//             .attr("x", sideBarWidth/2)
//             .attr("y", canvasHeight/2 - significanceTestResultStep)
//             .attr("text-anchor", "middle")
//             .attr("font-size", "24px")
//             .attr("fill", "orange")
//             .text(testResults["effect-size"])
//             .attr("class", "significanceTest");
 
}

function displayBiserialCorrelationResults()
{       
    var sideBar = d3.select("#sideBarCanvas");
    
    if(document.getElementById("computingResultsImage") != null)
        removeElementById("computingResultsImage");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", significanceTestResultOffsetTop + significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"])); 
}

function displaySimpleRegressionResults()
{       
    var sideBar = d3.select("#sideBarCanvas");    
    
    if(document.getElementById("computingResultsImage") != null)
        removeElementById("computingResultsImage");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", significanceTestResultOffsetTop + significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"]));
 
    var plot = d3.select("#plotCanvas");
    
    plot.append("text")
            .attr("x", canvasWidth/2)
            .attr("y", canvasHeight + 2*axesOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", scaleForWindowSize(24) + "px")
            .attr("fill", "orange")
            .text(testResults["equation"])
            .attr("id", "equation")
            .attr("class", "significanceTest");
    
    //make div tag at the bottom of the page
    var DIVTag = d3.select("body").append("div").attr("class", "regressionPredictionDiv");
        
    DIVTag.attr("style", "position: absolute; left: " + (width - canvasWidth - sideBarWidth) + "px; top: " + (canvasHeight - bottomDivHeight) + "px; height: " + (bottomDivHeight) + "px; width: " + canvasWidth + "px");    
    var table = DIVTag.append("table").attr("border", "1").attr("id", "regressionPredictionTable").attr("align", "center");
    
    //predictor variable
    var tr = table.append("tr");
    
    tr.append("td").append("label")
                .text(currentVariableSelection[0] + ":");
    tr.append("td").append("input")
                .attr("type", "text")
                .attr("placeholder", "<Enter value here>") 
                .attr("onchange", "calculateOutcome()")
                .attr("id", "value_" + currentVariableSelection[0]);
    
    //outcome variable
    tr = table.append("tr");
    
    tr.append("td").append("label")
                .text(currentVariableSelection[1] + ":");
    tr.append("td").append("label")
                .attr("id", "value_outcome");
}

function displayMultipleRegressionResults()
{       
    var sideBar = d3.select("#sideBarCanvas");    
    
    if(document.getElementById("computingResultsImage") != null)
        removeElementById("computingResultsImage");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", significanceTestResultOffsetTop + significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"]));
 
    var plot = d3.select("#plotCanvas");
    
    plot.append("text")
            .attr("x", canvasWidth/2)
            .attr("y", 3*plotHeight/4)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["equation"])
            .attr("id", "equation")
            .attr("class", "significanceTest"); 
    
    //make div tag at the bottom of the page
    var DIVTag = d3.select("body").append("div").attr("class", "regressionPredictionDiv");
        
    DIVTag.attr("style", "position: absolute; left: " + (width - canvasWidth - sideBarWidth) + "px; top: " + (canvasHeight - bottomDivHeight) + "px; height: " + (bottomDivHeight) + "px; width: " + canvasWidth + "px");    
    var table = DIVTag.append("table").attr("border", "1").attr("id", "regressionPredictionTable").attr("align", "center");
    
    var outcomeVariable = testResults["outcomeVariable"];
    var explanatoryVariables = testResults["explanatoryVariables"];
    
    for(var i=0; i<explanatoryVariables.length; i++)
    {
        //predictor variable
        var tr = table.append("tr");
    
        tr.append("td").append("label")
                    .text(explanatoryVariables[i] + ":");
        tr.append("td").append("input")
                    .attr("type", "text")
                    .attr("placeholder", "<Enter value here>") 
                    .attr("onchange", "calculateOutcome()")
                    .attr("id", "value_" + explanatoryVariables[i]);
    }
    
    //outcome variable
    tr = table.append("tr");
    
    tr.append("td").append("label")
                .text(outcomeVariable + ":");
    tr.append("td").append("label")
                .attr("id", "value_outcome");
}

function meanSelectionHelper()
{
    // var meanCircle = d3.selectAll("#" + target.id + ".means");    
// 
//     if(document.getElementsByClassName("means").length == 1)
//     {
//         //if there is only mean (one sample tests)
//         if(meanCircle.attr("fill") == meanColors["hover"])
//         {
//             meanCircle.attr("fill", meanColors["click"]);
// //                 compareMeans();
//         }
//         else
//         {
//             meanCircle.attr("fill", meanColors["normal"]);
//         }
//     }
//     else if(document.getElementsByClassName("completeLines").length < (document.getElementsByClassName("means").length - 1))
//     {
//         //if there are 2+ means            
//         meanCircle.attr("fill", meanColors["click"]);
// 
//         //check if we are finishing an incomplete line here
//         if(document.getElementsByClassName("incompleteLines").length > 0)
//         {
//             var incompleteLines = d3.selectAll(".incompleteLines");
// 
//             incompleteLines.attr("x2", meanCircle.attr("cx"))
//                            .attr("y2", meanCircle.attr("cy"))
//                            .attr("stroke", meanColors["click"])
//                            .attr("class", "completeLines");
//                        
//             removeElementsByClassName("indicator");
//             var canvas = d3.select("#plotCanvas");                                             
//         }
//         var means = document.getElementsByClassName("means");
//     
//         if(document.getElementsByClassName("completeLines").length < (document.getElementsByClassName("means").length - 1))
//         {
//             var canvas = d3.select("#plotCanvas");
// 
//             canvas.append("line")
//                     .attr("x1", meanCircle.attr("cx"))
//                     .attr("y1", meanCircle.attr("cy"))
//                     .attr("x2", meanCircle.attr("cx"))
//                     .attr("y2", meanCircle.attr("cy"))
//                     .attr("stroke", meanColors["normal"])
//                     .attr("stroke-dasharray", "5,5")
//                     .attr("id", meanCircle.attr("id"))
//                     .attr("class", "incompleteLines");
//         }
//         else
//         {
//             //we are done
// //                 compareMeans();
//         }
//     }   
    setCompareNowButtonText();
}

function drawNavigator(STATES)
{
    var navigatorHeight = scaleForWindowSize(50);
    var arrowHeadLength = scaleForWindowSize(15);
    
    var canvas = d3.select("#plotCanvas");
    var stateWidth = (canvasWidth-sideBarWidth)/(STATES.length - 1);
    
    for(i=0; i<STATES.length; i++)
    {
        var x = i*stateWidth;
        var y = 0;
        
        canvas.append("path")
                .attr("d", "M " + (x) + " " + y + " L " + (x + stateWidth) + " " + y + " L " + (x + stateWidth + arrowHeadLength) + " " + (y + navigatorHeight/2) + " L " + (x + stateWidth) + " " + (y + navigatorHeight) + " L " + (x) + " " + (y + navigatorHeight) + " L " + (x + arrowHeadLength) + " " + (y + navigatorHeight/2) + " L " + (x) + " " + (y) + " z")
                .attr("stroke", "black")
                .attr("fill", "url(#buttonFillNormal)")
                .attr("filter", "url(#Bevel)")
                .attr("id", STATES[i])
                .attr("class", "stateForNavigation");
        
        canvas.append("text")
                .attr("x", x + stateWidth/2)
                .attr("y", navigatorHeight/2 - scaleForWindowSize(5))
                .attr("fill", "black")
                .attr("text-anchor", "middle")
                .text(STATES[i])
                .attr("id", STATES[i])
                .attr("class", "stateForNavigationText");
    }
}

function displayToolTips()
{
    var canvas = d3.select("#variablePanelSVG");

    var variablePanel = d3.select("#variable.panel");                
    var variablePanelWidth = removeAlphabetsFromString(variablePanel.style("width"));
    var variableNameHolderWidth = variablePanelWidth - 2*variableNameHolderPadding;                                        

    console.log((variableNameHolderHeight - variableTypeSelectionButtonWidth + variableNameHolderPadding));
    var variablePanelBorder = canvas.append("rect")
                                    .attr("x", variableNameHolderPadding/2)
                                    .attr("y", variableNameHolderPadding/2)
                                    .attr("width", variableNameHolderWidth - variableTypeSelectionButtonWidth + variableNameHolderPadding)
                                    .attr("height", variableNames.length * (variableNameHolderHeight + variableNameHolderPadding))
                                    .attr("rx", "5px")
                                    .attr("ry", "5px")
                                    .attr("fill","none")
                                    .attr("stroke", "#3957F1")
                                    .attr("stroke-dasharray","3,3")
                                    .attr("class","toolTips");
}

    

var effectSizeTypes = ["d", "eS", "RS", "r", "𝜏"];

var effectSizeMins = new Object();
    effectSizeMins["d"] = 0;
    effectSizeMins["eS"] = 0;
    effectSizeMins["rS"] = 0;
    effectSizeMins["r"] = -1;
    effectSizeMins["𝜏"] = -1;
    
var effectSizeMaxs = new Object();
    effectSizeMaxs["d"] = 3;
    effectSizeMaxs["eS"] = 1;
    effectSizeMaxs["rS"] = 1;
    effectSizeMaxs["r"] = 1;
    effectSizeMaxs["𝜏"] = 1;
    
var effectSizeInterpretations = new Object();
    effectSizeInterpretations["d"] = [0.2, 0.5, 0.8];
    effectSizeInterpretations["eS"] = [0.04, 0.25, 0.64];
    effectSizeInterpretations["rS"] = [0.04, 0.25, 0.64];
    effectSizeInterpretations["r"] = [0.2, 0.5, 0.8];
    effectSizeInterpretations["𝜏"] = [0.2, 0.5, 0.8];
    
var effectSizeColors = new Object();
    effectSizeColors["small"] = "#A60000";
    effectSizeColors["small-medium"] = "#FFFF00";
    effectSizeColors["medium-large"] = "#39E639";
    effectSizeColors["large"] = "#269926";

function getColour(type, value)
{
    var interpretations = effectSizeInterpretations[type];
    
    if(value <= interpretations[0])
        return effectSizeColors["small"];
    else if(value > interpretations[0] && value < interpretations[1])
        return effectSizeColors["small-medium"];
    else if(value >= interpretations[1] && value < interpretations[2])
        return effectSizeColors["medium-large"];
    else if(value >= interpretations[2])
        return effectSizeColors["large"];
}

var variables = new Object();     
var variableRows = new Object(); //dependent, independent, participant
var variableTypes = new Object(); //nominal, ordinal, interval, ratio

var IQR = new Object();   
var MIN = new Object();
var MAX = new Object();
var CI = new Object();
var splitData = new Object();
var variableNames = new Array();
var colourBoxPlotData = new Object();

var homogeneityTestResults = new Object();
var normalityTestResults = new Object();

var states = new Array();

var variableCount = 0;

var currentVariableSelection = [];    
var currentVisualisationSelection;

var fullScreen = false;
var help = false;

// Scatterplot
var outlierValues = [];
var topFringeValues = [];
var bottomFringeValues = [];
    
    
// Mouse events
var _startX = 0;            // mouse starting positions
var _startY = 0;
var _offsetX = 0;           // current element offset
var _offsetY = 0;
var _height = 0;
var _width = 0;
var _dragElement;           // needs to be passed from OnMouseDown to OnMouseMove
var _oldZIndex = 0;         // we temporarily increase the z-index during drag  

var freezeMouseEvents = false;


var stringForNumber = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

//Significance tests
var variableDataType = new Object();
var experimentalDesign;
var significanceTestNames = new Object();
    significanceTestNames["pT"] = "Paired T-test";
    significanceTestNames["uT"] = "Unpaired T-test";
    significanceTestNames["mT"] = "Mann-Whitney U test";    
    significanceTestNames["wT"] = "Wilcoxon Signed-rank test";
    significanceTestNames["a"] = "Analysis of Variance (ANOVA)";
    significanceTestNames["kT"] = "Kruskal-Wallis test";
    significanceTestNames["rA"] = "Repeated-measures ANOVA";
    significanceTestNames["fT"] = "Friedman Test";
var currentTestType;
var testResults = new Object();
var distributions = new Object();
var variances = new Object();
var participants;
var interactions = [];
    var tukeyResults = new Object();
    
var sampleSizesAreEqual = true;
var pairwiseComparisons = false;

var log = new Array();

//transformations
var transformationType;

var boxes = [];
var meanCircles = [];
var medianLines = [];
var topFringes = [];
var bottomFringes = [];
var topFringeConnectors = [];
var bottomFringeConnectors = [];
var CILines = [];
var CITopLines = [];
var CIBottomLines = [];
var yAxisTexts = [];

//histogram curve
var curveX = [];
var curveY = [];
var distributionType;
var densityCurveColors = new Object();
    densityCurveColors["normal"] = "green";
    densityCurveColors["notnormal"] = "red";
    
//animations B-)
var loadingDataAnimation;

//miscellaneous
var factorials = [0, 1, 2, 6, 24, 120];

var STATES = new Object();

//settings
var desc = new Object();
desc["Histogram"] = "A histogram is a graphical representation of the distribution of data. It is an estimate of the probability distribution of a continuous variable and was first introduced by Karl Pearson. A histogram is a representation of tabulated frequencies, shown as adjacent rectangles, erected over discrete intervals (bins), with an area equal to the frequency of the observations in the interval. The height of a rectangle is also equal to the frequency density of the interval, i.e., the frequency divided by the width of the interval. The total area of the histogram is equal to the number of data.";
desc["Boxplot"] = "A box plot or boxplot is a convenient way of graphically depicting groups of numerical data through their quartiles. Box plots have lines extending vertically from the boxes (whiskers) indicating variability outside the upper and lower quartiles, hence the terms box-and-whisker plot and box-and-whisker diagram. Outliers may be plotted as individual points. The means are represented as circles and its confidence interval is drawn as an error bar.";
desc["Scatterplot"] = "A scatter plot, scatterplot, or scattergraph is a type of mathematical diagram using Cartesian coordinates to display values for two variables for a set of data. The data is displayed as a collection of points, each having the value of one variable determining the position on the horizontal axis and the value of the other variable determining the position on the vertical axis. Regression lines are models that are drawn from the regression model.";
desc["Scatterplot-matrix"] = "Given a set of variables X1, X2, ... , Xk, the scatterplot matrix contains all the pairwise scatter plots of the variables on a single page in a matrix format. That is, if there are k variables, the scatterplot matrix will have k rows and k columns and the ith row and jth column of this matrix is a plot of Xi versus Xj. Regression lines are models that are drawn from the regression model.";

desc["regressionLine"] = "A regression line is a model that is fit to the given data so that the sum of squares of errors (distance of points from regression line) is minimal. In multiple regression, the variability for the other causal variable is also taken into account.";
desc["equation"] = "An equation represents the regression model that is fit to the data. This can be used to predict the value of the outcome variable from the explanatory/causal variables.";
desc["p-value"] = "p-value is the probability of obtaining a test statistic at least as extreme as the one that was actually observed, assuming that the null hypothesis is true. A researcher will often \"reject the null hypothesis\" when the p-value turns out to be less than a certain significance level, often 0.05";

desc["parameter"] = new Object();
desc["parameter"]["t"] = "The t-statistic is a ratio of the departure of an estimated parameter from its notional value and its standard error.";
desc["parameter"]["F"] = "The F-statistic is the ratio of variance between treatments to the variance within treatments.";
desc["parameter"]["cS"] = "The chi-square statistic is a normalized sum of squared deviations between observed and theoretical frequencies.";
desc["parameter"]["U"] = "TBD";
desc["parameter"]["V"] = "TBD";
desc["parameter"]["z"] = "TBD";

desc["method"] = new Object();

desc["method"]["WT"] = "Welch's t test is an adaptation of Student's t-test intended for use with two samples having possibly unequal variances (when homogeneity of variances is violated)";
desc["method"]["pT"] = "Paired samples t-tests typically consist of a sample of matched pairs of similar units, or one group of units that has been tested twice";
desc["method"]["upT"] = "The independent samples t-test is used when two separate sets of independent and identically distributed samples are obtained, one from each of the two populations being compared.";
desc["method"]["mwT"] = "The Mann–Whitney U test (also called the Mann–Whitney–Wilcoxon (MWW), Wilcoxon rank-sum test, or Wilcoxon–Mann–Whitney test) is a non-parametric test of the null hypothesis that two populations are the same against an alternative hypothesis, especially that a particular population tends to have larger values than the other. It has greater efficiency than the t-test on non-normal distributions, such as a mixture of normal distributions, and it is nearly as efficient as the t-test on normal distributions";
desc["method"]["wT"] = "Wilcoxon signed-rank test is a non-parametric statistical hypothesis test used when comparing two related samples, matched samples, or repeated measurements on a single sample to assess whether their population mean ranks differ (i.e. it is a paired difference test). It can be used as an alternative to the paired Student's t-test, t-test for matched pairs, or the t-test for dependent samples when the population cannot be assumed to be normally distributed.";

desc["method"]["owA"] = "one-way analysis of variance (abbreviated one-way ANOVA) is a technique used to compare means of two or more samples (using the F distribution). This technique can be used only for numerical data.";
desc["method"]["twA"] = "the two-way analysis of variance (ANOVA) test is an extension of the one-way ANOVA test that examines the influence of different categorical independent variables on one dependent variable. While the one-way ANOVA measures the significant effect of one independent variable, the two-way ANOVA is used when there are more than one independent variable and multiple observations for each independent variable. The two-way ANOVA can not only determine the main effect of contributions of each independent variable but also identifies if there is a significant interaction effect between the independent variables.";
desc["method"]["owrA"] = "Repeated measures analysis of variance (rANOVA) is a commonly used statistical approach to repeated measure designs. With such designs, the repeated-measure factor (the qualitative independent variable) is the within-subjects factor, while the dependent quantitative variable on which each participant is measured is the dependent variable.";
desc["method"]["fA"] = "In a mixed-design analysis of variance model (also known as a split-plot ANOVA) is used to test for differences between two or more independent groups whilst subjecting participants to repeated measures. Thus, in a mixed-design ANOVA model, one factor (a fixed effects factor) is a between-subjects variable and the other (a random effects factor) is a within-subjects variable. Thus, overall, the model is a type of mixed effect model.";
desc["method"]["fT"] = "The Friedman test is a non-parametric statistical test developed by the U.S. economist Milton Friedman. Similar to the parametric repeated measures ANOVA, it is used to detect differences in treatments across multiple test attempts.";
desc["method"]["WA"] = "If the data show a lot of heteroscedasticity (different groups have different variances), the one-way anova can yield an inaccurate P-value; the probability of a false positive may be much higher than 5 percent. In that case, the most common alternative is Welch's anova.";
desc["method"]["kwT"] = "The Kruskal–Wallis one-way analysis of variance by ranks (named after William Kruskal and W. Allen Wallis) is a non-parametric method for testing whether samples originate from the same distribution. It is used for comparing more than two samples that are independent, or not related. The parametric equivalent of the Kruskal-Wallis test is the one-way analysis of variance (ANOVA).";

desc["method"]["pC"] = "The Pearson product-moment correlation coefficient (sometimes referred to as the PPMCC or PCC,[1] or Pearson's r) is a measure of the linear correlation (dependence) between two variables X and Y, giving a value between +1 and −1 inclusive, where 1 is total positive correlation, 0 is no correlation, and −1 is total negative correlation. It is widely used in the sciences as a measure of the degree of linear dependence between two variables.";
desc["method"]["kC"] = "The Kendall rank correlation coefficient, commonly referred to as Kendall's tau (τ) coefficient, is a statistic used to measure the association between two measured quantities. A tau test is a non-parametric hypothesis test for statistical dependence based on the tau coefficient.";
desc["method"]["bC"] = "point biserial correlation coefficient (rpb) is a correlation coefficient used when one variable (e.g. Y) is dichotomous; Y can either be \"naturally\" dichotomous, like gender, or an artificially dichotomized variable. In most situations it is not advisable to artificially dichotomize variables.";

desc["method"]["ptT"] = "Pairwise t-test is a parametric post-hoc comparison test. Typically, pairwise tests use some method like Bonferroni or Holms corrections to adjust the p-value and thereby keep the family-wise type I error at the required significance level.";
desc["method"]["pwT"] = "Pairwise Wilcoxon-test is the non-parametric alternative of pairwise t-test used in post-hoc comparisons. Typically, pairwise tests use some method like Bonferroni or Holms corrections to adjust the p-value and thereby keep the family-wise type I error at the required significance level.";

desc["method"]["linR"] = "In linear regression, the outcome variable is predicted from one causal variable. The user must know if the causality makes sense.";
desc["method"]["mulR"] = "In multiple regression, the outcome variable is predicted from more than one causal variable. The user must know if the causality makes sense.";

desc["effect-size"] = new Object();

desc["effect-size"]["d"] = "Cohen's d is an effect size. It indicates the difference between the means of two distributions in terms of the pooled standard deviation. 0.2, 0.5, and 0.8 are considered as general guidelines for small, medium, and large effect sizes respectively.";
desc["effect-size"]["r"] = "Pearson's correlation coefficient r is the measure of correlation between two distributions. -1 indicates a perfect negative correlation, +1 indicates a perfect positive correlation, and 0 indicates no relation.";
desc["effect-size"]["eS"] = "Eta squared value describes the amount of variance accounted for in the sample.";
desc["effect-size"]["𝜏"] = "It is a measure of rank correlation, i.e., the similarity of the orderings of the data when ranked by each of the quantities. It is named after Maurice Kendall, who developed it in 1938.";
desc["effect-size"]["rS"] = "R squared values describes the amount of variance accounted for in the sample. In case of simple linear regression, it is the square of the pearson's correlation coefficient r.";

desc["assumptions"] = new Object(); 

desc["assumptions"]["normality"] = "This assumption checks if the distributions of the group are normal distributions (i.e., if they follow a Gaussian distribution characteristic of a bell-curve).";
desc["assumptions"]["homogeneity"] = "Homogeneity of variances means that the variances of the distributions are roughly the same.";

desc["variancePlot"] = "This plot compares the variances of the distributions. If the bars are green in color, the distributions have approximately same variance (homogeneity of variance). If the bars are in red, the distributions have different variances (heterogeneity of variances).";
desc["normalityPlot"] = "The shape of the curve indicates the type of distribution. Normal/Gaussian distributions are characterised by a bell-curve. Distributions that are approximately normal are plotted in green, whereas distributions that are not normal are plotted in red.";

desc["compareMean"] = "Click on this to selects means of the distributions you want to compare.";
desc["compareNow"] = "Click on this to compare the means! Make sure at least 2 means are selected!";
desc["tukeyHSD"] = "Click on this to perform a Tukey's HSD test. This pairwise-compares each level of the plot against every other level in the boxplot.";
desc["pairwisePostHoc"] = "Click on this to select means of the two levels you want to perform a pairwise post-hoc test on.";
desc["regression"] = "Click on this to construct a regression model (predicting a variable from other variable(s)).";

desc["variables"] = new Object();

desc["variables"]["participantID"] = "The ID of the participant";
desc["variables"]["keyboardLayout"] = "The keyboard layout used by the participant (\"QWERTY\", \"DVORAK\", \"i10\")";
desc["variables"]["gender"] = "The gender of the participant";
desc["variables"]["typingSpeed"] = "The typing speed of the participant in Words Per Minute (WPM).";
desc["variables"]["errors"] = "The number of errors made by the participant in a minute";
desc["variables"]["userSatisfaction"] = "The rating given by the participant after using the keyboard layout.";

desc["variables"]["phoneOS"] = "The OS used by the participant (iOS, android, or windows)";
desc["variables"]["happScore"] = "The happiness score of the participant (out of 100)";
desc["variables"]["stressScore"] = "The stress score of the participant (out of 100)";
desc["variables"]["satisfaction"] = "The rating given by the participant after using the keyboard layout.";

//d3 dec2s
var dec1 = d3.format(".1f");
var dec2 = d3.format(".2f");
var dec3 = d3.format(".3f");
var dec5 = d3.format(".5f");

//Subset the data based on the different levels of the independent variable
function subsetDataByLevels(independentVariable)
{        
    for(var j=0; j<variableNames.length; j++)
    {
        //for every variable
        var uniqueData = variables[independentVariable]["dataset"].unique();
        for(var k=0; k<uniqueData.length; k++)
        {
            //for every level
            for(var m=0; m<variables[variableNames[j]]["dataset"].length; m++)
            {
                if(variables[independentVariable]["dataset"][m] == uniqueData[k])
                {
                    if(variables[variableNames[j]][uniqueData[k]] == undefined)
                    {
                        variables[variableNames[j]][uniqueData[k]] = new Array();
                        MIN[variableNames[j]][uniqueData[k]] = 999999;
                        MAX[variableNames[j]][uniqueData[k]] = -999999;
                    }
                    
                    variables[variableNames[j]][uniqueData[k]].push(variables[variableNames[j]]["dataset"][m]);                        
                    
                    if(variables[variableNames[j]]["dataset"][m] < MIN[variableNames[j]][uniqueData[k]])
                        MIN[variableNames[j]][uniqueData[k]] = variables[variableNames[j]]["dataset"][m];
                    if(variables[variableNames[j]]["dataset"][m] > MAX[variableNames[j]][uniqueData[k]])
                        MAX[variableNames[j]][uniqueData[k]] = variables[variableNames[j]]["dataset"][m];                        
                }
            }
        }
        for(var k=0; k<uniqueData.length; k++)
        {
            IQR[variableNames[j]][uniqueData[k]] = findIQR(variables[variableNames[j]][uniqueData[k]]);
            CI[variableNames[j]][uniqueData[k]] = findCI(variables[variableNames[j]][uniqueData[k]]);
        }
    }
}

function splitThisLevelBy(independentVariableA, independentVariableB, dependentVariable)
{
    var splitData = new Object();
    var levelsA = variables[independentVariableA]["dataset"].unique();
    var levelsB = variables[independentVariableB]["dataset"].unique();
    
    var indepA = variables[independentVariableA]["dataset"];
    var indepB = variables[independentVariableB]["dataset"];
    var dep = variables[dependentVariable]["dataset"];
    
    for(var i=0; i<levelsA.length; i++)
    {
        splitData[levelsA[i]] = new Object();
        for(var j=0; j<levelsB.length; j++)
        {
            splitData[levelsA[i]][levelsB[j]] = new Array();
        }
    }
    
    for(var i=0; i<dep.length; i++)
    {
        var indexA = indepA[i];
        var indexB = indepB[i];
        
        splitData[indexA][indexB].push(dep[i]);
    }
    
    return splitData;
}

//Initialise the mouse event handlers
function initMouseEventHandlers()
{
    document.onmousedown = OnMouseDown;
    document.onmousemove = OnMouseMove;
    document.onmouseover = OnMouseOver;
    document.onmouseout = OnMouseOut;
}

//Removes a single element with the given ID
function removeElementById(id)
{
    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
}

//Removes all elements with the given classname
function removeElementsByClassName(className)
{
   elements = document.getElementsByClassName(className);
   while(elements.length > 0)
   {
       elements[0].parentNode.removeChild(elements[0]);
   }
}

//Returns the unique elements of the given array
Array.prototype.unique = function() {
    var arr = new Array();
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}

//Returns true if the given array contains a particular element
Array.prototype.contains = function(v) {
   for(var i = 0; i < this.length; i++) {
       if(this[i] === v) return true;
   }
   return false;
};

//returns the length of an object
function getObjectLength(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}

//VARIABLES AND VISUALISATIONS
//Restricts the available selection of visualisations based on the variables selected
function restrictVisualisationSelection()
{
    var variableList = sort(currentVariableSelection);    
    
    switch(variableList["independent"].length)
    {
        case 0:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 1:
                                {                                
                                    currentVisualisationSelection = "Histogram";                    
                                    break;
                                }
                        case 2:
                                {
                                    currentVisualisationSelection = "Scatterplot";
                                    break;
                                }
                        default:
                                {
                                    currentVisualisationSelection = "Scatterplot-matrix";
                                    break;
                                }
                    }
                    break;
                }
        case 1:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 0:
                                {                                 
                                    currentVisualisationSelection = "Histogram";
                                    break;
                                }
                        case 1:
                                {                                 
                                    currentVisualisationSelection = "Boxplot";
                                    break;
                                }
                        case 2:
                                {
                                    currentVisualisationSelection = "Scatterplot";
                                    break;
                                }
                                    
                        default:
                                {                                    
                                    currentVisualisationSelection = "Scatterplot-matrix";
                                }
                    }
                    break;
                }  
        case 2:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 0:
                                {  
                                    currentVisualisationSelection = "Scatterplot";
                                    break;
                                }
                        case 1:
                                {                                 
                                    currentVisualisationSelection = "Boxplot";
                                    break;
                                }
                        default:
                                {                                    
                                    currentVisualisationSelection = "Scatterplot-matrix";
                                }
                    }
                    break;
                }
    }
}

//Adds a given element to an array by maintain unique elements
function setColorsForVariables(array, element)
{   
    var variable = d3.select("#" + element + ".variableNameHolderBack");
    var variableText = d3.select("#" + element + ".variableNameHolderText");    
    
    if(array.indexOf(element) == -1)
    {
        array.push(element);
        
        variable.attr("fill", "url(#buttonFillSelected)")
        variable.attr("filter", "none");
        variable.attr("stroke", "none");
        
        variableText.attr("fill", "white");
    }    
    else
    {     
        array.splice(array.indexOf(element), 1);
        
        variable.attr("fill", "url(#buttonFillNormal)");  
        variable.attr("filter", "url(#Bevel)");
        variable.attr("stroke", "black");
        
        variableText.attr("fill", "black");
    }
    return array;
}

function setColorsForVariablesWithArray(array)
{   
    for(var i=0; i<variableNames.length; i++)
    {
        var variable = d3.select("#" + variableNames[i] + ".variableNameHolderBack");
        var variableText = d3.select("#" + variableNames[i] + ".variableNameHolderText");    
        
        variable.attr("fill", "url(#buttonFillNormal)");  
        variable.attr("filter", "url(#Bevel)");
        variable.attr("stroke", "black");
        
        variableText.attr("fill", "black");
    }
    
    for(var i=0; i<array.length; i++)
    {
        var variable = d3.select("#" + array[i] + ".variableNameHolderBack");
        var variableText = d3.select("#" + array[i] + ".variableNameHolderText");    
        
        variable.attr("fill", "url(#buttonFillSelected)")
        variable.attr("filter", "none");
        variable.attr("stroke", "none");
        
        variableText.attr("fill", "white");
    } 
}

//Manages the fill colors for visualisation-holders
function setColorsForVisualisations()
{
    var variableList = sort(currentVariableSelection);
    
    var visualisations = ["Histogram", "Boxplot", "Scatterplot", "Scatterplot-matrix"];
    validateAll();
    
    switch(variableList["independent"].length)
    {
        case 0:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 0: 
                                invalidate([visualisations[0], visualisations[1], visualisations[2],visualisations[3]]);
                                break;
                        case 1:
                               invalidate([visualisations[2],visualisations[3]]);
                                break;
                        case 2:
                                break;
                        default:
                                invalidate([visualisations]);
                    }
                    
                    break;
                }
        case 1:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 0: 
                                invalidate([visualisations[1],visualisations[2],visualisations[3]]);
                                break;
                        case 1:
                                break;
                        case 2:
                                invalidate([visualisations[0], visualisations[1]]);
                                break;
                        default:
                                invalidate([visualisations[0], visualisations[1], visualisations[2]]);
                                break;
                    }
                    
                    break;
                }
        case 2:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 0: 
                                invalidate([visualisations[0], visualisations[1]]);
                                break;
                        case 1:
                                invalidate([visualisations[0]]);
                                break;
                        default:
                                invalidate([visualisations[0], visualisations[1], visualisations[2]]);
                                break;
                    }
                    
                    break;
                }
                
    }
    var visualisationButtons = document.getElementsByClassName("visualisationHolderBack");
    
    for(var i=0; i<visualisationButtons.length; i++)
    {      
        if(visualisationButtons[i].getAttribute("id") == currentVisualisationSelection)
        {
            visualisationButtons[i].setAttribute("fill", "url(#buttonFillSelected)");
            visualisationButtons[i].setAttribute("filter", "none");
            visualisationButtons[i].setAttribute("stroke", "none");
            
            d3.select("#" + visualisationButtons[i].getAttribute("id") + ".visualisationHolderText").attr("fill", "white");
        }
        else
        {
            visualisationButtons[i].setAttribute("fill", "url(#buttonFillNormal)");
            visualisationButtons[i].setAttribute("filter", "url(#Bevel)");
            visualisationButtons[i].setAttribute("stroke", "black");
            
            d3.select("#" + visualisationButtons[i].getAttribute("id") + ".visualisationHolderText").attr("fill", "black");
        }
    }
}

function validateAll()
{
    var visualizations = d3.selectAll(".invalid");    
    visualizations.attr("fill", "url(#buttonFillNormal)").attr("filter", "url(#Bevel)").attr("opacity", "0.1").attr("class", "visualisationHolderFront");                     
}

function invalidate(list)
{
    var visualizations = document.getElementsByClassName("visualisationHolderFront");
    
    for(var i=0; i<list.length; i++)
    {
        var viz = d3.select("#" + list[i] + ".visualisationHolderFront");
        viz.attr("fill", "grey").attr("opacity", "0.75").attr("class", "invalid");        
    }
}

//STRINGS/NUMBERS PROCESSING
var toString = Object.prototype.toString;

//Checks if a given object is a string
function isString(obj)
{
  return toString.call(obj) == '[object String]';
}

//Removes alphabets in the given string
function removeAlphabetsFromString(string)
{
    return string.replace(/[A-z]/g, '');
}

//Removes numbers in the given string
function removeNumbersFromString(string)
{
    return string.replace(/[0-9]/g, '');
}

//convert numbers to strings
function convertIntegersToStrings(numbers)
{
    var strings = new Array();
    
    for(var i=0; i<numbers.length; i++)
    {        
        var string = "";
        
        for(var j=0; j<numbers[i].toString().length; j++)
        {            
            string = string + stringForNumber[numbers[i].toString().charAt(j)];
        }
        
        strings.push(string);
    }
    
    return strings;
}

function allVariablesAreNumeric()
{
    var yeah=true;
    
    for(var i=0; i<currentVariableSelection.length; i++)
    {
        if(isNaN(variables[currentVariableSelection[i]]["dataset"][0]))
        {
            yeah = false;
        }
    }
    return yeah;
}

//PROCESSING DATASET
function setVariableRow()
{    
    for(var i=0; i<variableNames.length; i++)
    {
        variableRows[variableNames[i]] = sessionStorage.getItem(variableNames[i]);
    }
    
    for(var i=0; i<variableNames.length; i++)
    {
        if(variableRows[variableNames[i]] == "independent")
        {
            var toggleButton = d3.select("#" + variableNames[i] + ".variableTypeToggleButton");
            toggleButton.attr("xlink:href", "images/toggle_down.png");
            
            var independentVariableText = d3.select("#" + variableNames[i] + ".independentVariableText");
            var dependentVariableText = d3.select("#" + variableNames[i] + ".dependentVariableText");

            independentVariableText.attr("fill", "#627bf4");
            dependentVariableText.attr("fill", "#BEC9FC");
            
            subsetDataByLevels(variableNames[i]);
        }
        else if(variableRows[variableNames[i]] == "dependent")
        {
            var toggleButton = d3.select("#" + variableNames[i] + ".variableTypeToggleButton");
            toggleButton.attr("xlink:href", "images/toggle_up.png");
            
            var independentVariableText = d3.select("#" + variableNames[i] + ".independentVariableText");
            var dependentVariableText = d3.select("#" + variableNames[i] + ".dependentVariableText");
            
            dependentVariableText.attr("fill", "#627bf4");
            independentVariableText.attr("fill", "#BEC9FC");
        }
        else if(variableRows[variableNames[i]] == "participant")
        {
            d3.select("#" + variableNames[i] + ".variableTypeToggleButton").remove();
            d3.select("#" + variableNames[i] + ".dependentVariableText").remove();
            d3.select("#" + variableNames[i] + ".independentVariableText").remove();
            
            var variablePanelSVG = d3.select("#variablePanelSVG");
            var variablePanel = d3.select("#variable.panel");                
            var variablePanelWidth = removeAlphabetsFromString(variablePanel.style("width"));
            var variableNameHolderWidth = variablePanelWidth - 2*variableNameHolderPadding;                                     
            
//             variablePanelSVG.append("rect")
//                             .attr("x", variableNameHolderWidth + 2*variableNameHolderPadding - variableTypeSelectionButtonWidth)
//                             .attr("y", variableNameHolderPadding + i*(variableNameHolderHeight + variableNameHolderPadding) + scaleForWindowSize(2))                                                   
//                             .attr("height", variableNameHolderHeight - 2*scaleForWindowSize(2))
//                             .attr("width", variableTypeSelectionButtonWidth)
//                             .attr("rx", "5px")
//                             .attr("ry", "5px")
//                             .attr("fill", variableTypeButtonColors["participant"])
//                             .attr("id", variableNames[i])
//                             .attr("class", "participantVariableButtonBack");
                                    
            variablePanelSVG.append("text")
                            .attr("x", variableNameHolderWidth + 2*variableNameHolderPadding - variableTypeSelectionButtonWidth/2)
                            .attr("y", variableNameHolderPadding + i*(variableNameHolderHeight + variableNameHolderPadding) + (variableNameHolderHeight)/2 + yAxisTickTextOffset/2)                                                   
                            .attr("text-anchor", "middle")
                            .attr("fill", "#627bf4")
                            .text("SUBJECT")
                            .attr("id", variableNames[i])
                            .attr("class", "participantVariableText");
        }
    }
}

function setVariableTypes()
{
    for(var i=0; i<variableNames.length; i++)
    {
        if(variables[variableNames[i]]["dataset"].unique().length == 2)
            variableTypes[variableNames[i]] = "binary";
        else
            variableTypes[variableNames[i]] = variablesInDatasetType[sessionStorage.fileName][i];
    }
    
    for(var i=0; i<variableNames.length; i++)
    {
        switch(variableTypes[variableNames[i]])
        {
            case "nominal":
                            //do something
                            break;
            case "ordinal":
                            //do something
                            break;
            case "interval":
                            //do something
                            break;
            case "ratio":
                            //do something
                            break;
            case "binary":
                            //do something
                            break;
        }
    }
}

function findExperimentalDesign()
{
    var participantData = [];
    
    for(var i=0; i<variableNames.length; i++)
    {
        if(variableRows[variableNames[i]] == "participant")
        {
            participantData = variables[variableNames[i]]["dataset"];
            participants = variableNames[i];
        }
    }
    
    if(participantData.length > participantData.unique().length)
    {
        return "within-groups";
    }
    else
    {
        return "between-groups";
    }
}

function setThisVariableEvil(variable)
{    
    d3.select("#" + variable + ".variableNameHolderFront").attr("class", "disabled");
    d3.select("#" + variable + ".variableNameHolderBack").attr("fill", variablePanelColors["disabled"]);
}

function getNumericVariables()
{
    var numericVariables = [];
    
    for(var i=0; i<variableNames.length; i++)
    {   
        if((variableTypes[variableNames[i]] != "nominal") && (variableTypes[variableNames[i]] != "ordinal"))
        {
            numericVariables.push(variableNames[i]);
        }
    }
    
    return numericVariables;
}

//Returns a set of valid IDs (non-numeric)
function getValidIds(labels)
{
    var validIds = true;
    
    for(var i=0; i<labels.length; i++)
    {
        if(isString(labels[i]) == false)
        {
            validIds = false;
            break;
        }            
    }    
    if(!validIds)
        return convertIntegersToStrings(labels);        
    else
        return labels;
}

function getValidId(label)
{
    var validId = true;
    
    if(isString(label) == false)
    {
        validId = false;    
    }       
    if(!validId)
    {
        var string = "";
        
        for(var j=0; j<label.toString().length; j++)
        {            
            string = string + stringForNumber[label.toString().charAt(j)];
        }
        
        return string;
    }
    else
    {
        return label;
    }
}

//sorts the selected variables and returns the sorted object
function getSelectedVariables()
{
    var means = document.getElementsByClassName("means");
    var variableList = new Object();
    
    variableList["dependent"] = new Array();
    variableList["independent"] = new Array();
    variableList["independent-levels"] = new Array();    
    
    //add the dependent variable
    for(var i=0; i<currentVariableSelection.length; i++)
    {        
        if(variableRows[currentVariableSelection[i]] == "dependent")
            variableList["dependent"].push(currentVariableSelection[i]);
        else if(variableRows[currentVariableSelection[i]] == "independent")
            variableList["independent"].push(currentVariableSelection[i]);
    }    
    
    //add the levels of the independent variable
    if(variableList["independent"].length > 0)
    {
        for(var i=0; i<means.length; i++)
        {
            if((means[i].getAttribute("fill") == meanColors["click"]) || (means[i].getAttribute("fill") == "green") || ((means[i].getAttribute("fill") == "#008000")))
            {
                if(stringForNumber.indexOf(means[i].getAttribute("id")) != -1)
                    variableList["independent-levels"].push(stringForNumber.indexOf(means[i].getAttribute("id")));
                else
                    variableList["independent-levels"].push(means[i].getAttribute("id"));
            }
        }   
    }
    else
    {
        variableList["dependent"] = [];
        for(var i=0; i<means.length; i++)
        {
            if((means[i].getAttribute("fill") == meanColors["click"]) || (means[i].getAttribute("fill") == "green"))
            {
                if(stringForNumber.indexOf(means[i].getAttribute("id")) != -1)
                {                
                    variableList["dependent"].push(stringForNumber.indexOf(means[i].getAttribute("id")));
                }
                else
                {
                    variableList["dependent"].push(means[i].getAttribute("id"));
                }
            }
        }    
    }
    
    return variableList; 
}

//Just the sorting functionality of the above function
function sort(list)
{
    var variableList = new Object();
    
    variableList["dependent"] = new Array();
    variableList["independent"] = new Array();
    variableList["independent-levels"] = new Array();
    
    for(var i=0; i<list.length; i++)
    {
        if(variableRows[list[i]] == "independent")
        {
            variableList["independent"].push(list[i]);
        }
        else
        {
            variableList["dependent"].push(list[i]);
        }
    }
    
    if(variableList["independent"].length > 0)
    {
        if(variableList["independent"].length == 1)
        {
            var uniqueData = variables[variableList["independent"][0]]["dataset"].unique();
        
            for(var i=0; i<uniqueData.length; i++)
            {
                variableList["independent-levels"].push(uniqueData[i]);
            }
        }
        else
        {
            for(var i=0; i<variableList["independent"].length; i++)
            {
                variableList["independent-levels"][i] = new Array();
                
                var uniqueData = variables[variableList["independent"][i]]["dataset"].unique();
        
                for(var k=0; k<uniqueData.length; k++)
                {
                    variableList["independent-levels"][i].push(uniqueData[k]);
                }
            }
        }
    }
    
    return variableList;
}

function scaleForWindowSize(value)
{
    return value*(height/1004);
}

//log the results of the statistical analysis to an object :)
function logResult()
{
    log.push(testResults["method"] + ", " + testResults["formula"]);
}

function getNumberOfSelectedMeans()
{
    var means = document.getElementsByClassName("means");
    
    var count = 0;
    
    for(var i=0; i<means.length; i++)
    {
        if(means[i].getAttribute("fill") == meanColors["click"])
        {
            count++;
        }
    }
    
    return count;
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

    
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
                .attr("font-size", fontSizeLabels + "px")
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
        var levels = level.split("-");
        
        data = colourBoxPlotData[levels[0]][levels[1]];
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
        
        var textAnchor = "end";
        if(i == 0)
            textAnchor = "start";
        
        canvas.append("text")
                    .attr("x", LEFT + i*xStep)
                    .attr("y", BOTTOM + tickTextOffsetXAxis + shortAxesOffset)                    
                    .text(dec2(min + i*(max-min)))
                    .attr("text-anchor", textAnchor)
                    .attr("font-size", scaleForWindowSize(12) + "px")
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

function drawInteractionEffectPlot()
{
    var LEFT = canvasWidth/2 - plotWidth/2;
    var RIGHT = canvasWidth/2 + plotWidth/2;
     
    var TOP = canvasHeight/2 - plotHeight/2;
    var BOTTOM = canvasHeight/2 + plotHeight/2;
    
    var canvas = d3.select("#plotCanvas");
    
    var variableList = sort(currentVariableSelection);
    
    var dependentVariable = variableList["dependent"][0];
    
    var independentVariableXAxis = variableList["independent"][0];
    var independentVariableColor = variableList["independent"][1];
    
    var dependentVariableData = variables[dependentVariable]["dataset"];
    var max = Array.max(dependentVariableData);
    var min = Array.min(dependentVariableData);
    
    var independentVariableXAxisData = variables[independentVariableXAxis]["dataset"];
    var independentVariableColorData = variables[independentVariableColor]["dataset"];
    
    var levelsOfIndependentVariableXAxis = independentVariableXAxisData.unique();
    var levelsOfIndependentVariableColor = independentVariableColorData.unique();
    
    drawInteractionPlotLegends(levelsOfIndependentVariableColor);
    
    
    //Axes
    var xAxis = canvas.append("line")
                        .attr("x1", LEFT)
                        .attr("y1", BOTTOM + axesOffset)
                        .attr("x2", RIGHT)
                        .attr("y2", BOTTOM + axesOffset) 
                        .attr("stroke", "black")
                        .attr("id", "xAxis")
                        .attr("class", "axes");
    
    var yAxis = canvas.append("line")
                        .attr("x1", LEFT - axesOffset)
                        .attr("y1", TOP)
                        .attr("x2", LEFT - axesOffset)
                        .attr("y2", BOTTOM)
                        .attr("stroke", "black")
                        .attr("id", "yAxis")
                        .attr("class", "axes");
    
    //Y-axis label
    canvas.append("text")
                .attr("x", LEFT - axesOffset - 1.5*labelOffset)
                .attr("y", (TOP + BOTTOM)/2)
                .attr("text-anchor", "middle")
                .attr("font-size", fontSizeLabels + "px")
                .attr("transform", "rotate(-90 " + (LEFT - axesOffset - 1.5*labelOffset) + " " + ((TOP + BOTTOM)/2) + ")")
                .text(dependentVariable)
                .attr("fill", "black");
                
    //X-axis grooves
    var numberOfGroovesInXAxis = levelsOfIndependentVariableXAxis.length;
    
    var xStep = plotWidth/(numberOfGroovesInXAxis - 1);   

    for(i=0; i<numberOfGroovesInXAxis; i++)
    {
        canvas.append("line")
                    .attr("x1", LEFT + i*xStep)
                    .attr("y1", BOTTOM  + axesOffset)
                    .attr("x2", LEFT + i*xStep)
                    .attr("y2", BOTTOM + 10 + axesOffset)
                    .attr("class", "xAxisGrooves");

        canvas.append("text")
                    .attr("x", LEFT + i*xStep)
                    .attr("y", BOTTOM + tickTextOffsetXAxis + axesOffset)                    
                    .text(levelsOfIndependentVariableXAxis[i])
                    .attr("fill", "black")
                    .attr("text-anchor", "middle")
                    .attr("class", "xAxisGrooveText");
    }
    
    //Y-axis grooves
    var numberOfGroovesInYAxis = 10;
    var yStep = plotHeight/(numberOfGroovesInYAxis - 1);   
    var ySlice = (max - min)/(numberOfGroovesInYAxis - 1);   

    
    for(i=0; i<numberOfGroovesInYAxis; i++)
    {
        var axisText = dec2(min + i*ySlice);
        var textPosition = BOTTOM - i*yStep;                  
        
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
                    .attr("text-anchor", "end")
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    }   
    
    for(var i=0; i<interactions.length; i++)
    {
        var x,y;
        
        x = LEFT + levelsOfIndependentVariableXAxis.indexOf(levelsOfIndependentVariableXAxis[i%levelsOfIndependentVariableXAxis.length])*xStep;
        y = BOTTOM - getValue1(interactions[i], min, max)*plotHeight;        
        
        var color = colors[Math.floor(i/(interactions.length/levelsOfIndependentVariableColor.length))];
        
        canvas.append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", "5px")
                    .attr("fill", color)
                    .attr("id", "c" + Math.floor(i/(interactions.length/levelsOfIndependentVariableColor.length)) + (i%levelsOfIndependentVariableXAxis.length))
                    .attr("class", "effs");     
    }
    
    for(var i=0; i<levelsOfIndependentVariableColor.length; i++)
    {
        var circles = [];
        
        for(var j=0; j<levelsOfIndependentVariableXAxis.length; j++)
        {
            circles.push(d3.select("#c" + i + j + ".effs"));
            
            if(j != 0)
            {
                canvas.append("line")
                        .attr("x1", circles[j].attr("cx"))
                        .attr("y1", circles[j].attr("cy"))
                        .attr("x2", circles[j-1].attr("cx"))
                        .attr("y2", circles[j-1].attr("cy"))
                        .attr("stroke", colors[i]);
            }
        }        
    }
}

function drawInteractionPlotLegends(varNames)
{
    var canvas = d3.select("#sideBarCanvas");
    
    var yStep = plotHeight/10;
    
    for(var i=0; i<varNames.length; i++)
    {
        canvas.append("rect")
                .attr("x", sideBarWidth/4)
                .attr("y", TOP + histLegendOffsetY + i*yStep - histLegendSize/2)
                .attr("width", histLegendSize)
                .attr("height", histLegendSize)
                .attr("fill", colors[i])
                .attr("stroke", "black")
                .attr("id", "legend" + i)
                .attr("class", "boxplotLegends");
        
        canvas.append("text")
                .attr("x", sideBarWidth/2 + histLegendSize)
                .attr("y", TOP + histLegendOffsetY + i*yStep + 3)
                .attr("text-anchor", "start")
                .attr("fill", "black")
                .attr("font-size", fontSizeTicks + "px")
                .text(varNames[i])
                .attr("id", "legend" + i)
                .attr("class", "boxplotLegends");
            
    }
}

document.addEventListener('keydown', function(event){
    if(event.keyCode == 83)
    {
        var fileName = window.prompt("Enter your name: ");
        
        if(fileName != null)
        {
            writeToFile(fileName);
        }
    }
});

Array.max = function( array )
{
    return Math.max.apply( Math, array );
}

Array.min = function( array )
{
    return Math.min.apply( Math, array );
}   

function mean(values)
{ 
    var total = 0, i;
    for (i = 0; i < values.length; i += 1) {
        total += values[i];
    }
    return total / values.length;
}

function median(values) 
{
    temp = values.slice();
    temp.sort( function(a,b) {return a - b;} );
    
    var half = Math.floor(temp.length/2);

    if(temp.length % 2)
        return temp[half];
    else
        return (temp[half-1] + temp[half]) / 2.0;
    

}

function findNumberOfCombinations(n, y)
{
    return factorials[n]/(factorials[y]*factorials[n-y]);
}

function isPrime(num) 
{
    if(num < 2) return false;
    for (var i = 2; i < num; i++) {
        if(num%i==0)
            return false;
    }
    return true;
}

function findIQR(values)
{
    var temp = values.slice();
    temp.sort( function(a,b) {return a - b;} );
    
    var half1 = new Array();
    var half2 = new Array();
    if(temp.length % 2)
    {
        var x = Math.floor(temp.length/2);
        
        //odd
        for(var i=0; i<Math.floor(temp.length/2); i++)
            half1.push(temp[i]);
            
        for(var i=Math.floor(temp.length/2) + 1; i<temp.length; i++)
            half2.push(temp[i]);
    }
    else
    {
        //even
        for(var i=0; i<Math.floor(temp.length/2); i++)
            half1.push(temp[i]);
            
        for(var i=Math.floor(temp.length/2); i<temp.length; i++)
            half2.push(temp[i]);
    }
    
    var q1, q3;
    q1 = median(half1);
    q3 = median(half2);
    
    if(half1.length == 0)
        return 0;
    return q3 - q1;
} 

function findCI(distribution)
{
    var SE = getStandardError(distribution);
    var m = mean(distribution);
    
    var array = new Array();
    
    array[0] = m - 1.96*SE;
    array[1] = m + 1.96*SE;
    
    return array;
} 

function getStandardError(values)
{   
    var sd = getStandardDeviation(values);
    
    return sd/Math.sqrt(values.length);
}

function getStandardDeviation(values)
{
    var m = mean(values);
    var SS = 0;
    
    for(var i=0; i<values.length; i++)
    {
        SS += Math.pow(values[i] - m,2);
    }
    
    return Math.sqrt(SS/values.length);
}

function sumOf(values)
{
    var sum = 0;
    
    for(var i=0; i<values.length; i++)
    {
        sum += values[i];
    }
    
    return sum;
}

function getPearsonCorrelation(X, Y)
{
    var XY = [];
    var XS = [];
    var YS = [];
    
    for(var i=0; i<X.length; i++)
    {
        XY[i] = X[i]*Y[i];
        XS[i] = X[i]*X[i];
        YS[i] = Y[i]*Y[i];
    }
    
    var n = X.length;
    var numerator = n*sumOf(XY) - sumOf(X)*sumOf(Y);
    var denominator = Math.sqrt((n*sumOf(XS) - sumOf(X)*sumOf(X))*(n*sumOf(YS) - sumOf(Y)*sumOf(Y)));
    var r = numerator/denominator;

    testResults["method"] = "Pearson's correlation coefficient";
                    
    logResult();
    
    return r;
}

function initiateLoadingDatasetAnimation()
{
    freezeMouseEvents = true;
    
    var canvas = d3.select("#plotCanvas");
    
    if(document.getElementsByClassName("loadingAnimation").length > 0)
            removeElementsByClassName("loadingDataset");
            
    canvas.append("text")
        .attr("x", canvasWidth/2)
        .attr("y", canvasHeight/2)
        .attr("text-anchor", "middle")
        .attr("font-size", "32px")
        .text("Loading data")
        .attr("id", "text")
        .attr("class", "loadingAnimation");    
    canvas.append("image")
            .attr("x", canvasWidth/2 - loadingImageSize/2)
            .attr("y", canvasHeight/4)
            .attr("xlink:href", "images/loading.gif")
            .attr("height", loadingImageSize)
            .attr("width", loadingImageSize)
            .attr("id", "image")
            .attr("class", "loadingAnimation");            
}

function OnMouseDown(e)
{
    if (e == null) 
        e = window.event; 

    var target = e.target != null ? e.target : e.srcElement;
   
    if(!freezeMouseEvents)
    {        
        if(help)
        {            
            if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "helpButtonFront"))
            {
                var helpButton = d3.select(".helpButtonBack");
                var helpButtonText = d3.select(".helpButtonText");
                
                help = false;
                
                helpButton.attr("fill", "url(#buttonFillNormal)")
                            .attr("filter", "url(#Bevel)")
                            .attr("stroke", "black");
            
                helpButtonText.attr("fill", "black");
                removeElementById("descriptionPanel");
                
                removeElementsByClassName("plot");
            }
        }
        else
        {
            if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "variableNameHolderFront"))
            {
                setup(e, target);        

                removeElementsByClassName("toolTips")
        
                //add to list of variables selected
                currentVariableSelection = setColorsForVariables(currentVariableSelection, target.id);
        
                //display the current variable selection
                console.log("\n\n\ncurrent variable selection: [" + currentVariableSelection + "]\n");
        
                removeElementsByClassName("displayDataTable");
                removeElementsByClassName("displayDataText");
              
                restrictVisualisationSelection();      
                plotVisualisation(); //checks which plot is selected and draws that plot
                setColorsForVisualisations(); //manages the fill colors of vizualizations (only one at a time)
                
                var rButton = d3.select(".backButtonBack");
                
                rButton.attr("fill", "grey")
                        .attr("filter", "none")
                        .attr("stroke", "none");
                
                states = [];
//                 
//                 var subState = null;
//                 
//                 if(currentVisualisationSelection == "Boxplot")
//                     subState = "base";
//                 
//                 states.push({visualisation: currentVisualisationSelection, variables: currentVariableSelection.slice(), substate: subState});
//                 
//                 console.dir(states);
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "visualisationHolderFront"))
            {
                setup(e, target);    
                currentVisualisationSelection = target.id;        
                setColorsForVisualisations();        
                plotVisualisation();
                
                var rButton = d3.select(".backButtonBack");
                
                rButton.attr("fill", "grey")
                        .attr("filter", "none")
                        .attr("stroke", "none");

                
                states = [];
//                 
//                 states.push({visualisation: currentVisualisationSelection, variables: currentVariableSelection.slice()});               
//                 
//                 console.dir(states);
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "variableTypeToggleButton"))
            {
                setup(e, target);
                
                // 
//                 var variableNameHolderBack = d3.select("#" + target.id + ".variableNameHolderBack");
//                 var toggleButton = d3.select("#" + target.id + ".variableTypeToggleButton");
//                 var dependentVariableText = d3.select("#" + target.id + ".dependentVariableText");
//                 var independentVariableText = d3.select("#" + target.id + ".independentVariableText");
//                 if(toggleButton.attr("xlink:href") == "images/toggle_up.png")
//                 {
//                     toggleButton.attr("xlink:href","images/toggle_down.png");
//             
//                     if(variableNameHolderBack.attr("fill") == "url(#buttonFillNormal)")
//                         independentVariableText.attr("fill", "#627bf4");
//                     else
//                         independentVariableText.attr("fill", "white");
//                 
//                     dependentVariableText.attr("fill", "#BEC9FC");
//                 }
//                 else if(toggleButton.attr("xlink:href") == "images/toggle_down.png")
//                 {
//                     toggleButton.attr("xlink:href","images/toggle_up.png");
//             
//                     if(variableNameHolderBack.attr("fill") == "url(#buttonFillNormal)")
//                         dependentVariableText.attr("fill", "#627bf4");
//                     else
//                         dependentVariableText.attr("fill", "white");
//                     independentVariableText.attr("fill", "#BEC9FC");
//                 }
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "disabled"))
            {
                setup(e, target);
        
                if(document.getElementById("plotCanvas") != null)
                            removeElementById("plotCanvas");
                if(document.getElementById("sideBarCanvas") != null)
                            removeElementById("sideBarCanvas");        
        
                removeElementsByClassName("displayDataTable");
                removeElementsByClassName("displayDataText");
        
                displayDataForVariable(target.id);
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "means")
            {
                setup(e, target);    
        
                //get the selected mean
                var meanCircle = d3.selectAll("#" + target.id + ".means");

                if(meanCircle.attr("r") == engorgedMeanRadius)             
                {
                    if(meanCircle.attr("fill") == meanColors["click"])
                    {
                        //we are cancelling a mean
                        meanCircle.attr("fill", meanColors["normal"]);
            
                        //remove all complete lines associated with this and join the missing ones
                        var completeLines = document.getElementsByClassName("completeLines");
                        var lineBefore, lineAfter;
            
                        for(var i=0; i<completeLines.length; i++)
                        {
                            if(completeLines[i].getAttribute("x1") == meanCircle.attr("cx"))
                            {
                                lineAfter = completeLines[i];
                            }
                            if(completeLines[i].getAttribute("x2") == meanCircle.attr("cx"))
                            {
                                lineBefore = completeLines[i];
                            }
                        }
            
                        if(lineBefore == undefined && lineAfter == undefined)
                        {
                            //it was the only mean selected - just remove the existing incomplete line                    
                            removeElementsByClassName("incompleteLines");
                        }
                        else if(lineAfter == undefined)
                        {                
                            removeElementsByClassName("incompleteLines");
                            var canvas = d3.select("#plotCanvas");
            
                            canvas.append("line")
                                    .attr("x1", lineBefore.getAttribute("x1"))
                                    .attr("y1", lineBefore.getAttribute("y1"))
                                    .attr("x2", lineBefore.getAttribute("x1"))
                                    .attr("y2", lineBefore.getAttribute("y1"))
                                    .attr("stroke", meanColors["normal"])
                                    .attr("stroke-dasharray", "5,5")
                                    .attr("id", meanCircle.attr("id"))
                                    .attr("class", "incompleteLines");
                
                            lineBefore.parentNode.removeChild(lineBefore);
                        }
                        else if(lineBefore == undefined)
                        {                                
                            removeElementsByClassName("incompleteLines");
                            var canvas = d3.select("#plotCanvas");
                    
                            if(document.getElementsByClassName("completeLines").length > 0)
                            {
                                var endingLine = findEndingLine();
                        
                                canvas.append("line")
                                        .attr("x1", endingLine.getAttribute("x2"))
                                        .attr("y1", endingLine.getAttribute("y2"))
                                        .attr("x2", endingLine.getAttribute("x2"))
                                        .attr("y2", endingLine.getAttribute("y2"))
                                        .attr("stroke", meanColors["normal"])
                                        .attr("stroke-dasharray", "5,5")
                                        .attr("id", meanCircle.attr("id"))
                                        .attr("class", "incompleteLines");
                            }
                            else
                            {
                                canvas.append("line")
                                        .attr("x1", lineAfter.getAttribute("x2"))
                                        .attr("y1", lineAfter.getAttribute("y2"))
                                        .attr("x2", lineAfter.getAttribute("x2"))
                                        .attr("y2", lineAfter.getAttribute("y2"))
                                        .attr("stroke", meanColors["normal"])
                                        .attr("stroke-dasharray", "5,5")
                                        .attr("id", meanCircle.attr("id"))
                                        .attr("class", "incompleteLines");
                            }
                
                            lineAfter.parentNode.removeChild(lineAfter);

                        }
                        else
                        {
                            removeElementsByClassName("incompleteLines");
                
                            var canvas = d3.select("#plotCanvas");
            
                            if(document.getElementsByClassName("completeLines").length > 0)
                            {
                                var endingLine = findEndingLine();
                        
                                canvas.append("line")
                                        .attr("x1", endingLine.getAttribute("x2"))
                                        .attr("y1", endingLine.getAttribute("y2"))
                                        .attr("x2", endingLine.getAttribute("x2"))
                                        .attr("y2", endingLine.getAttribute("y2"))
                                        .attr("stroke", meanColors["normal"])
                                        .attr("stroke-dasharray", "5,5")
                                        .attr("id", meanCircle.attr("id"))
                                        .attr("class", "incompleteLines");
                            }
                            else
                            {
                                canvas.append("line")
                                        .attr("x1", lineAfter.getAttribute("x2"))
                                        .attr("y1", lineAfter.getAttribute("y2"))
                                        .attr("x2", lineAfter.getAttribute("x2"))
                                        .attr("y2", lineAfter.getAttribute("y2"))
                                        .attr("stroke", meanColors["normal"])
                                        .attr("stroke-dasharray", "5,5")
                                        .attr("id", meanCircle.attr("id"))
                                        .attr("class", "incompleteLines");
                            }
                        
                            lineBefore.setAttribute("x2", lineAfter.getAttribute("x2"));
                            lineBefore.setAttribute("y2", lineAfter.getAttribute("y2"));
                            lineAfter.parentNode.removeChild(lineAfter);
                        }
                    
                    
                    }
                    else
                    {
                        if(document.getElementsByClassName("means").length == 1)
                        {
                            //if there is only mean (one sample tests)
                            if(meanCircle.attr("fill") == meanColors["hover"])
                            {
                                meanCircle.attr("fill", meanColors["click"]);
                //                 compareMeans();
                            }
                            else
                            {
                                meanCircle.attr("fill", meanColors["normal"]);
                            }
                        }
                        else if(document.getElementsByClassName("completeLines").length < (document.getElementsByClassName("means").length - 1))
                        {
                            //if there are 2+ means            
                            meanCircle.attr("fill", meanColors["click"]);
        
                            //check if we are finishing an incomplete line here
                            if(document.getElementsByClassName("incompleteLines").length > 0)
                            {
                                var incompleteLines = d3.selectAll(".incompleteLines");
                
                                incompleteLines.attr("x2", meanCircle.attr("cx"))
                                               .attr("y2", meanCircle.attr("cy"))
                                               .attr("stroke", meanColors["click"])
                                               .attr("class", "completeLines");
                                       
                                removeElementsByClassName("indicator");
                                var canvas = d3.select("#plotCanvas");                                             
                            }
                            var means = document.getElementsByClassName("means");
                    
                            if(document.getElementsByClassName("completeLines").length < (document.getElementsByClassName("means").length - 1))
                            {
                                var canvas = d3.select("#plotCanvas");
            
                                canvas.append("line")
                                        .attr("x1", meanCircle.attr("cx"))
                                        .attr("y1", meanCircle.attr("cy"))
                                        .attr("x2", meanCircle.attr("cx"))
                                        .attr("y2", meanCircle.attr("cy"))
                                        .attr("stroke", meanColors["normal"])
                                        .attr("stroke-dasharray", "5,5")
                                        .attr("id", meanCircle.attr("id"))
                                        .attr("class", "incompleteLines");
                            }
                            else
                            {
                                //we are done
                //                 compareMeans();
                            }
                        }   
                    }
                
                    setSelectButtons();
                    setCompareNowButtonText();
                }
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "compareNow")
            {
                d3.selectAll(".compareNow").attr("cursor", "pointer");
                
                var rButton = d3.select(".backButtonBack");
                
                rButton.attr("fill", "url(#buttonFillNormal)")
                        .attr("filter", "url(#Bevel)")
                        .attr("stroke", "black");
                    
                states.push({visualisation: currentVisualisationSelection, substate: "significanceTest"});
                
                //get selected means
                var means = document.getElementsByClassName("means");
                var selectedMeans = []; 
                var variableList = getSelectedVariables();
        
                for(var i=0; i<means.length; i++)
                {
                    if(means[i].getAttribute("fill") == meanColors["click"])
                        selectedMeans.push(means[i]);
                }
        
                if(selectedMeans.length == 2 || selectedMeans.length == means.length)
                {
                    compareMeans();
                    removeElementsByClassName("boxplotLegends");
                    removeElementsByClassName("compareNow");
                }
                else 
                {
                    alert("Please select means of two levels (or) select means of all the levels!");                    
                }
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "compareMean")
            {
                setup(e, target);
        
                pairwiseComparisons = false;
                
                states.push({visualisation: currentVisualisationSelection, substate: "base"});
                states.push({visualisation: currentVisualisationSelection, substate: "meanSelection"});
        
                var canvas = d3.select("#plotCanvas");
                var variableList = getSelectedVariables();
        
                var inText = "COMPARE SELECTED MEANS";
    
                drawButtonInSideBar(inText, "compareNow");
            
                var availableWidth = canvasWidth;
            
                canvas.append("rect")
                        .attr("x", availableWidth/3 - selectionButtonWidth/2)
                        .attr("y", selectionButtonOffset)
                        .attr("height", selectionButtonHeight)
                        .attr("width", selectionButtonWidth)
                        .attr("rx", scaleForWindowSize(10) + "px")
                        .attr("ry", scaleForWindowSize(10) + "px")
                        .attr("fill", "url(#buttonFillSelected)")
                        .attr("filter", "none")
                        .attr("stroke", "none")
                        .attr("id", "rect")
                        .attr("class", "selectNone");
                    
                canvas.append("text")
                        .attr("x", availableWidth/3)
                        .attr("y", selectionButtonOffset + selectionButtonHeight/2 + yAxisTickTextOffset)
                        .attr("fill", "white")
                        .attr("text-anchor", "middle")
                        .attr("font-size", fontSizeButtonLabel + "px")
                        .text("SELECT NONE")
                        .attr("id", "text")
                        .attr("class", "selectNone");
            
                canvas.append("rect")
                        .attr("x", 2*availableWidth/3 - selectionButtonWidth/2)
                        .attr("y", selectionButtonOffset)
                        .attr("height", selectionButtonHeight)
                        .attr("width", selectionButtonWidth)
                        .attr("rx", scaleForWindowSize(10) + "px")
                        .attr("ry", scaleForWindowSize(10) + "px")
                        .attr("fill", "url(#buttonFillNormal)")
                        .attr("filter", "url(#Bevel)")
                        .attr("stroke", "black")
                        .attr("id", "rect")
                        .attr("class", "selectAll");
                    
                canvas.append("text")
                        .attr("x", 2*availableWidth/3)
                        .attr("y", selectionButtonOffset + selectionButtonHeight/2 + yAxisTickTextOffset)
                        .attr("fill", "black")
                        .attr("text-anchor", "middle")
                        .attr("font-size", fontSizeButtonLabel + "px")
                        .text("SELECT ALL")
                        .attr("id", "text")
                        .attr("class", "selectAll");
        
                freezeMouseEvents = true;
                d3.selectAll(".IQRs, .medians, .TOPFringes, .BOTTOMFringes, .TOPFringeConnectors, .BOTTOMFringeConnectors, .outliers, .CIs, .CITopFringes, .CIBottomFringes").transition().duration(500).style("opacity", "0.2");
                d3.selectAll(".means").transition().duration(500).attr("r", engorgedMeanRadius);
            
                setTimeout(function()
                {
                    freezeMouseEvents = false;
                }, 500);
        
                removeElementsByClassName("compareMean");
            }
        
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "selectNone")
            {
                setup(e, target);
            
                var selectNoneText = d3.select("#text.selectNone");
                var selectNoneButton = d3.select("#rect.selectNone");
            
                var selectAllText = d3.select("#text.selectAll");
                var selectAllButton = d3.select("#rect.selectAll");
            
                if(selectNoneButton.attr("fill") == "url(#buttonFillNormal)")
                {
                    selectNoneButton.attr("fill", "url(#buttonFillSelected)");
                    selectNoneButton.attr("filter", "none");
                    selectNoneButton.attr("stroke", "none");
                
                    selectNoneText.attr("fill", "white");
                
                    unselectAllMeans();
                
                    selectAllButton.attr("fill", "url(#buttonFillNormal)");
                    selectAllButton.attr("filter", "url(#Bevel)");
                    selectAllButton.attr("stroke", "black");
                
                    selectAllText.attr("fill", "black");
                
                    setTimeout(function()
                    {
                        setCompareNowButtonText();
                    }, 500);
                }
            }
        
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "selectAll")
            {
                setup(e, target);
            
                var selectNoneText = d3.select("#text.selectNone");
                var selectNoneButton = d3.select("#rect.selectNone");
            
                var selectAllText = d3.select("#text.selectAll");
                var selectAllButton = d3.select("#rect.selectAll");
            
                if(selectAllButton.attr("fill") == "url(#buttonFillNormal)")
                {
                    selectAllButton.attr("fill", "url(#buttonFillSelected)");
                    selectAllButton.attr("filter", "none");
                    selectAllButton.attr("stroke", "none");
                
                    selectAllText.attr("fill", "white");
                
                    selectAllMeans();
                
                    selectNoneButton.attr("fill", "url(#buttonFillNormal)");
                    selectNoneButton.attr("filter", "url(#Bevel)");
                    selectNoneButton.attr("stroke", "black");
                
                    selectNoneText.attr("fill", "black");
                
                    setTimeout(function()
                    {
                        setCompareNowButtonText();
                    }, 1000);
                }
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "doPairwiseTest")
            {
                var rButton = d3.select(".backButtonBack");
                
                rButton.attr("fill", "url(#buttonFillNormal)")
                        .attr("filter", "url(#Bevel)")
                        .attr("stroke", "black");
                    
                d3.selectAll(".doPairwiseTest").attr("cursor", "pointer");
        
                //get selected means
                var means = document.getElementsByClassName("means");
                var selectedMeans = []; 
                var variableList = getSelectedVariables();
        
                for(var i=0; i<means.length; i++)
                {
                    if(means[i].getAttribute("fill") == meanColors["click"])
                        selectedMeans.push(means[i]);
                }
        
                if(selectedMeans.length != 2)
                {
                    alert("select two means then press compare");
                }
                else
                {
                    removeElementsByClassName("doPairwiseTest");
                    removeElementsByClassName("boxplotLegends");
                    compareMeans();
                }
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "transformToNormal")
            {
                setup(e, target);
                
                removeElementsByClassName("transformToNormal");
            
                var variableList = sort(currentVariableSelection);
        
                for(var i=0; i<variableList["independent-levels"].length; i++)
                {    
                    applyNormalityTransform(variableList["dependent"][0], variableList["independent-levels"][i], false);
                }
        
                applyNormalityTransform(variableList["dependent"][0], "dataset", true);               
            }
        
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "transformToHomogeneity")
            {
                setup(e, target);
        
                var button = d3.select("#button." + target.className.baseVal);   
                var buttonText = d3.select("#text." + target.className.baseVal);        
        
                removeElementsByClassName("transformToHomogeneity");
            
                var variableList = sort(currentVariableSelection);
            
                applyHomogeneityTransform(variableList["dependent"][0], variableList["independent"][0]);               
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "fullscreen")
            {
                _startX = e.clientX;
                _startY = e.clientY;
        
                _dragElement = target;
        
                document.onmousemove = OnMouseMove;
                document.body.focus();

                document.onselectstart = function () { return false; };

                target.ondragstart = function() { return false; };
        
                var button = d3.select(".fullscreen");
        
                if(button.attr("xlink:href") == "images/fullscreennormal.png")
                {
                    fullScreen = true;
                    button.attr("xlink:href", "images/fullscreenclick.png");
                    d3.select("#variable.panel").attr("style", "width: " + 0 + "px; height: " + height + "px;"); 
                    d3.select("#variablePanelSVG").attr("width", 0);            
                    d3.select("#visualisation.panel").attr("style", "height: " + 0 + "px;"); 
                    d3.select("#visualisationPanelSVG").attr("height", 0);
                    d3.select("#canvas").attr("style", "left: 0px; height: " + height + "px;");
                    d3.select("#plotCanvas").attr("height", height).attr("width", width-sideBarWidth);
                }
                else if(button.attr("xlink:href") == "images/fullscreenclick.png")
                {
                    fullScreen = false;
                    button.attr("xlink:href", "images/fullscreennormal.png");
                    d3.select("#variable.panel").attr("style", "width: " + (width - canvasWidth - sideBarWidth) + "px; height: " + height + "px;"); 
                    d3.select("#variablePanelSVG").attr("width", (width - canvasWidth - sideBarWidth));            
                    d3.select("#visualisation.panel").attr("style", "width: " + (canvasWidth + sideBarWidth) + "px; height: " + height/4 + "px; top: " + canvasHeight + "px; left: " + (width - canvasWidth - sideBarWidth) + "px;");                    
                    d3.select("#visualisationPanelSVG").attr("height", height/4);
                    d3.select("#canvas").attr("style", "position: absolute; width: " + canvasWidth + "px; height: " + canvasHeight + "px; top: 0px; left: " + (width - canvasWidth - sideBarWidth) + "px;");    
                    d3.select("#plotCanvas").attr("height", canvasHeight).attr("width", canvasWidth);
                }
            }
        
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "helpButtonFront")
            {
                setup(e, target);
            
                var helpButton = d3.select(".helpButtonBack");
                var helpButtonText = d3.select(".helpButtonText");
            
                if(helpButton.attr("stroke") == "black")
                {
                    help = true;
                    helpButton.attr("fill", "url(#buttonFillSelected)")
                                .attr("filter", "none")
                                .attr("stroke", "none");
                
                    helpButtonText.attr("fill", "white");
            
                    var description = d3.select("body").append("div");                
                    description.attr("id", "descriptionPanel")
                         .attr("style", "width: " + width + "px; height: " + (height - canvasHeight) + "px; top: " + canvasHeight + "px;");
                    
                    description.append("label")
                                .attr("id", "descriptionLabel")
                                .text("Hover over a visible element to get help");
                    
                    //plotCanvas
                    var plotCanvas = d3.select("#plotCanvas");
                    var sideBar = d3.select("#sideBarCanvas");
                    
                    if(document.getElementById("regressionLine") == null)
                    {
                        plotCanvas.append("rect")
                                    .attr("x", canvasWidth/2 - plotWidth/2)
                                    .attr("y", canvasHeight/2 - plotHeight/2)
                                    .attr("width", plotWidth)
                                    .attr("height", plotHeight)
                                    .attr("rx", "10px")
                                    .attr("ry", "10px")
                                    .attr("fill", "white")
                                    .attr("stroke", "orange")
                                    .attr("opacity", "0.01")
                                    .attr("class", "plotHelp");  
                    }
                    
                    if(document.getElementsByClassName("significanceTest").length > 0)
                    {
                        sideBar.append("rect")
                                    .attr("x", scaleForWindowSize(10))
                                    .attr("y", significanceTestResultOffsetTop + 3*significanceTestResultStep - significanceTestResultStep/2)
                                    .attr("height", significanceTestResultStep)
                                    .attr("width", sideBarWidth - 2*scaleForWindowSize(10))
                                    .attr("rx", "3px")
                                    .attr("ry", "3px")
                                    .attr("stroke", "none")
                                    .attr("opacity", "0.01")
                                    .attr("fill", "white")
                                    .attr("class", "pValueHelp");
                                    
                        sideBar.append("rect")
                                    .attr("x", scaleForWindowSize(10))
                                    .attr("y", significanceTestResultOffsetTop + 2*significanceTestResultStep - significanceTestResultStep/2)
                                    .attr("height", significanceTestResultStep)
                                    .attr("width", sideBarWidth - 2*scaleForWindowSize(10))
                                    .attr("rx", "3px")
                                    .attr("ry", "3px")
                                    .attr("stroke", "none")
                                    .attr("opacity", "0.01")
                                    .attr("fill", "white")
                                    .attr("class", "testStatisticHelp");
                                    
                        sideBar.append("rect")
                                    .attr("x", scaleForWindowSize(10))
                                    .attr("y", significanceTestResultOffsetTop + significanceTestResultStep - significanceTestResultStep/2)
                                    .attr("height", significanceTestResultStep)
                                    .attr("width", sideBarWidth - 2*scaleForWindowSize(10))
                                    .attr("rx", "3px")
                                    .attr("ry", "3px")
                                    .attr("stroke", "none")
                                    .attr("opacity", "0.01")
                                    .attr("fill", "white")
                                    .attr("class", "methodHelp");
                        
                        sideBar.append("rect")
                                    .attr("x", scaleForWindowSize(10))
                                    .attr("y", significanceTestResultOffsetTop - significanceTestResultStep - effectSizeHeight/2 - yAxisTickTextOffset)
                                    .attr("height", effectSizeHeight + yAxisTickTextOffset*2)
                                    .attr("width", sideBarWidth - 2*scaleForWindowSize(10))
                                    .attr("rx", "3px")
                                    .attr("ry", "3px")
                                    .attr("stroke", "none")
                                    .attr("opacity", "0.01")
                                    .attr("fill", "white")
                                    .attr("class", "effectSizeHelp");
                    }
                    
                    
                    if(d3.select("#homogeneity.assumptionsButtonBack").attr("stroke") != "black")
                    {
                        var variancePlotWidth = plotWidth/2;
                        var variancePlotHeight = scaleForWindowSize(250);
                        
                        plotCanvas.append("rect")
                                    .attr("x", canvasWidth/2 - variancePlotWidth/2 - scaleForWindowSize(10))
                                    .attr("y", canvasHeight/2 + plotHeight/2 + 3*axesOffset - scaleForWindowSize(10))
                                    .attr("height", variancePlotHeight + 2*scaleForWindowSize(10))
                                    .attr("width", variancePlotWidth + 2*scaleForWindowSize(10))
                                    .attr("rx", "5px")
                                    .attr("ry", "5px")
                                    .attr("fill", "white")
                                    .attr("stroke", "orange")
                                    .attr("opacity", "0.01")
                                    .attr("class", "variancePlotHelp");
                    }
                    
                    if(d3.select("#normality.assumptionsButtonBack").attr("stroke") != "black")
                    {   
                        plotCanvas.append("rect")
                                    .attr("x", canvasWidth/2 - plotWidth/2)
                                    .attr("y", canvasHeight + normalityPlotOffset - 2*scaleForWindowSize(10))
                                    .attr("height", normalityPlotHeight + 4*scaleForWindowSize(10))
                                    .attr("width", plotWidth)
                                    .attr("rx", "5px")
                                    .attr("ry", "5px")
                                    .attr("fill", "white")
                                    .attr("stroke", "orange")
                                    .attr("opacity", "0.01")
                                    .attr("class", "normalityPlotHelp");
                    }                   
                }                
            }
            
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "backButtonFront")
            {
                setup(e, target);
                
                var rButton = d3.select(".backButtonBack");
                
                if(currentVisualisationSelection == "Boxplot" && rButton.attr("stroke") == "black")
                {
                    plotVisualisation();
                
                    d3.select(".backButtonBack").attr("fill", "grey")
                                                .attr("filter", "none")
                                                .attr("stroke", "none");

                    var canvas = d3.select("#plotCanvas");
                    var variableList = getSelectedVariables();
        
                    var inText = "COMPARE SELECTED MEANS";
    
                    if(pairwiseComparisons)
                        drawButtonInSideBar("DO PAIRWISE TEST", "doPairwiseTest");
                    else
                        drawButtonInSideBar(inText, "compareNow");
            
                    var availableWidth = canvasWidth;
                    
                    if(!pairwiseComparisons)
                    {
                        canvas.append("rect")
                                .attr("x", availableWidth/3 - selectionButtonWidth/2)
                                .attr("y", selectionButtonOffset)
                                .attr("height", selectionButtonHeight)
                                .attr("width", selectionButtonWidth)
                                .attr("rx", scaleForWindowSize(10) + "px")
                                .attr("ry", scaleForWindowSize(10) + "px")
                                .attr("fill", "url(#buttonFillSelected)")
                                .attr("filter", "none")
                                .attr("stroke", "none")
                                .attr("id", "rect")
                                .attr("class", "selectNone");
                    
                        canvas.append("text")
                                .attr("x", availableWidth/3)
                                .attr("y", selectionButtonOffset + selectionButtonHeight/2 + yAxisTickTextOffset)
                                .attr("fill", "white")
                                .attr("text-anchor", "middle")
                                .attr("font-size", fontSizeButtonLabel + "px")
                                .text("SELECT NONE")
                                .attr("id", "text")
                                .attr("class", "selectNone");
            
                        canvas.append("rect")
                                .attr("x", 2*availableWidth/3 - selectionButtonWidth/2)
                                .attr("y", selectionButtonOffset)
                                .attr("height", selectionButtonHeight)
                                .attr("width", selectionButtonWidth)
                                .attr("rx", scaleForWindowSize(10) + "px")
                                .attr("ry", scaleForWindowSize(10) + "px")
                                .attr("fill", "url(#buttonFillNormal)")
                                .attr("filter", "url(#Bevel)")
                                .attr("stroke", "black")
                                .attr("id", "rect")
                                .attr("class", "selectAll");
                    
                        canvas.append("text")
                                .attr("x", 2*availableWidth/3)
                                .attr("y", selectionButtonOffset + selectionButtonHeight/2 + yAxisTickTextOffset)
                                .attr("fill", "black")
                                .attr("text-anchor", "middle")
                                .attr("font-size", fontSizeButtonLabel + "px")
                                .text("SELECT ALL")
                                .attr("id", "text")
                                .attr("class", "selectAll");
                    }
        
                    freezeMouseEvents = true;
                    d3.selectAll(".IQRs, .medians, .TOPFringes, .BOTTOMFringes, .TOPFringeConnectors, .BOTTOMFringeConnectors, .outliers, .CIs, .CITopFringes, .CIBottomFringes").transition().duration(500).style("opacity", "0.2");
                    d3.selectAll(".means").transition().duration(500).attr("r", engorgedMeanRadius);
            
                    setTimeout(function()
                    {
                        freezeMouseEvents = false;
                    }, 500);
        
                    removeElementsByClassName("compareMean");
                }
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "regression")
            {
                setup(e, target);
                removeElementsByClassName("regression");
        
                drawDialogBoxToGetOutcomeVariable();
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "outcomeVariable")
            {
                setup(e, target);
        
                var outcomeVariableButton = d3.select("#" + target.id + ".outcomeVariable");
        
                var choice = target.id;
        
                if(currentVisualisationSelection == "Scatterplot")
                {
                    if(choice != currentVariableSelection[1])
                    {   
                        var temp = currentVariableSelection[1];
                        currentVariableSelection[1] = currentVariableSelection[0];
                        currentVariableSelection[0] = temp;
                
                        plotVisualisation();  
                    }
        
                    var variableList = sort(currentVariableSelection);
        
                        console.log("\n\t\tFinding the regression model to predict the outcome variable (" + currentVariableSelection[1] + ") from the explanatory variable (" + currentVariableSelection[0] + ")");
        
                        //some interaction to get the variables :)
        
                        removeElementsByClassName("outcomeVariable");
                        removeElementsByClassName("dialogBox");
        
                    setTimeout(function(){            
                        removeElementsByClassName("regression");
                        removeElementsByClassName("significanceTest");
                        removeElementsByClassName("effectSize");
                        getLinearModelCoefficients(currentVariableSelection[1], currentVariableSelection[0]);
                    }, 300);  
                }
                else if(currentVisualisationSelection == "Scatterplot-matrix")
                {
                    resetSVGCanvas();
                    drawFullScreenButton();
            
                    var explanatoryVariables = [];
                    var outcomeVariable = choice;
            
                    for(var i=0; i<currentVariableSelection.length; i++)
                    {
                        if(currentVariableSelection[i] != outcomeVariable)
                        {
                            explanatoryVariables.push(currentVariableSelection[i]);
                        }
                    }
                    if(explanatoryVariables.length == 1)
                    {
                        getLinearModelCoefficients(outcomeVariable, explanatoryVariables[0]);
                        currentVisualisationSelection = "Scatterplot";
                        plotVisualisation();
                    }
                    else
                        performMultipleRegression(outcomeVariable, explanatoryVariables);
                }
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "interactionEffect")
            {
                setup(e, target);
        
                var button = d3.select("#button.interactionEffect");
                removeElementsByClassName("interactionEffect");
                
                var variableList = getSelectedVariables();
                
                states.push({variables: currentVariableSelection, substate: "other"});
                console.dir(states);
                
                findEffect(variableList["dependent"][0], variableList["independent"]);
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "pairwisePostHoc")
            {
                setup(e, target);
        
                removeElementsByClassName("effectSize");
                removeElementsByClassName("parameter");
                removeElementsByClassName("significanceTest");
                removeElementsByClassName("differenceInMeans");
                removeElementsByClassName("checkingAssumptions");
                removeElementsByClassName("assumptions");
                removeElementsByClassName("assumptionsButtonFront");
                removeElementsByClassName("assumptionsButtonBack");
                removeElementsByClassName("ticks");
                removeElementsByClassName("crosses");
                removeElementsByClassName("pairwisePostHoc");
                removeElementsByClassName("loading");
                removeElementsByClassName("selectNone");
                removeElementsByClassName("selectAll");
                removeElementsByClassName("effectSizeInterpretationIndicators");
                removeElementsByClassName("differenceInMeans");
                removeElementsByClassName("differenceInMeansText");
                removeElementsByClassName("differenceInMeansMain");
                removeElementsByClassName("densityCurve");
                
                removeElementById("border");
        
                pairwiseComparisons = true;
                
                states.push({variables: currentVariableSelection, substate: "pairwise"});
                console.dir(states);
        
                var variableList = getSelectedVariables();
                var canvas = d3.select("#plotCanvas");
                
                resetMeans();
    
                drawButtonInSideBar("COMPARE MEANS", "doPairwiseTest");
        
                d3.selectAll(".IQRs, .medians, .TOPFringes, .BOTTOMFringes, .TOPFringeConnectors, .BOTTOMFringeConnectors, .outliers, .CIs, .CITopFringes, .CIBottomFringes").transition().duration(500).style("opacity", "0.2");
                d3.selectAll(".means").transition().duration(500).attr("r", engorgedMeanRadius);
        
                removeElementsByClassName("compareMean");
            }
            
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "tukeyHSD")
            {
                setup(e, target);        
                var variableList = sort(currentVariableSelection);
                
                states.push({variables: currentVariableSelection, substate: "other"});
                console.dir(states);
        
                if(variableList["independent"].length == 1)
                {
                    performTukeyHSDTestOneIndependentVariable(variableList["dependent"][0], variableList["independent"][0]);
                }
                else if(variableList["independent"].length == 2)
                {
                    performTukeyHSDTestTwoIndependentVariables(variableList["dependent"][0], variableList["independent"][0], variableList["independent"][1]);
                }
            }
        
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "assumptionsButtonFront")
            {
                setup(e, target);
        
                var assumptionText = d3.select("#" + target.id + ".assumptions");
                var assumptionButton = d3.select("#" + target.id + ".assumptionsButtonBack");
            
                if(assumptionButton.attr("stroke") == "black")
                {
                    assumptionButton.attr("fill", "url(#buttonFillSelected)")
                                    .attr("filter", "none")
                                    .attr("stroke", "none");
            
                    assumptionText.attr("fill", "white");
            
                    switch(target.id)
                    {
                        case "normality":
                                        {
                                            removeElementsByClassName("densityCurve");
                                            var homogeneityText = d3.select("#homogeneity.assumptions");
                                            var homogeneityButton = d3.select("#homogeneity.assumptionsButtonBack");
                                            
                                            homogeneityText.attr("fill", "black");
                                            homogeneityButton.attr("fill", "url(#buttonFillNormal)")
                                                                .attr("filter", "url(#Bevel)")
                                                                .attr("stroke", "black");
                                                                
                                            var variableList = getSelectedVariables();
                                    
                                            var dependentVariable = variableList["dependent"][0];
        
                                            for(var i=0; i<variableList["independent-levels"].length; i++)
                                            {   
                                                if(distributions[dependentVariable][variableList["independent-levels"][i]] == false)
                                                {                                
                                                    d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight*1.5);
                
                                                    //draw boxplots in red 
                                                    drawBoxPlotInRed(variableList["independent-levels"][i]);
                                                    drawNormalityPlot(dependentVariable, variableList["independent-levels"][i], "notnormal");
                                                }
                                                else
                                                {
                                                    d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight*1.5);
                 
                                                    drawNormalityPlot(dependentVariable, variableList["independent-levels"][i], "normal");
                                                }
                                            }
                                    
                                            break;
                                        }
                        case "homogeneity":
                                        {
                                            var normalityText = d3.select("#normality.assumptions");
                                            var normalityButton = d3.select("#normality.assumptionsButtonBack");
                                            
                                            normalityText.attr("fill", "black");
                                            normalityButton.attr("fill", "url(#buttonFillNormal)")
                                                                .attr("filter", "url(#Bevel)")
                                                                .attr("stroke", "black");
                                                                
                                            var variableList = sort(currentVariableSelection);
                                    
                                            var dependentVariable = variableList["dependent"][0];
                                            
                                            var homogeneity = d3.select("#homogeneity.ticks").attr("display") == "inline" ? true : false;
        
                                            for(var i=0; i<variableList["independent"].length; i++)
                                            {                   
                                                d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight*1.5);
        
                                                drawHomogeneityPlot(homogeneity);                                           
                                            }
                                            break;
                                        }
                        case "sphericity":
                                        {                                    
                                            break;
                                        }
                        default: 
                                alert("this is not supposed to happen!");
                    }
                }
                else
                {
                    assumptionButton.attr("fill", "url(#buttonFillNormal)")
                                    .attr("filter", "url(#Bevel)")
                                    .attr("stroke", "black");
            
                    assumptionText.attr("fill", "black");
            
                    switch(target.id)
                    {
                        case "normality":
                                        {
                                            d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
                                    
                                            break;
                                        }
                        case "homogeneity":
                                        {
                                            d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
                                        
                                            break;
                                        }
                        case "sphericity":
                                        {
                                            console.log("To be done!");
                                    
                                            break;
                                        }
                        default: 
                                alert("this is not supposed to happen!");
                    }
                }
            }
            
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "effectButtonFront")
            {
                setup(e, target);
                
                var effectButton = d3.select("#" + target.id + ".effectButtonBack");
                var effectButtonText = d3.select("#" + target.id + ".effectButtonText");
                
                var sideBar = d3.select("#sideBarCanvas");
                var index = parseFloat(effectButton.attr("data-index"));
                
                if(effectButton.attr("stroke") == "black")
                {
                    d3.selectAll(".effectButtonBack").attr("fill", "url(#buttonFillNormal)").attr("stroke", "black");
                    d3.selectAll(".effectButtonText").attr("fill", "black");
                    
                    effectButton.attr("fill", "url(#buttonFillSelected)")
                                .attr("stroke", "none");
                    
                    effectButtonText.attr("fill", "white");
                    
                    removeElementsByClassName("significanceTest");
                    removeElementsByClassName("effectSize");
                    removeElementsByClassName("parameter");
                    
                    sideBar.append("text")
                            .attr("x", sideBarWidth/2)
                            .attr("y", significanceTestResultOffsetTop + significanceTestResultStep)
                            .attr("text-anchor", "middle")
                            .attr("font-size", fontSizeSignificanceTestResults + "px")
                            .attr("fill", "#627bf4")
                            .text(testResults["method"])
                            .attr("class", "significanceTest");
                    
                    drawParameter(testResults["df"][index], parseFloat(testResults["parameter"][index]));
    
                    sideBar.append("text")
                            .attr("x", sideBarWidth/2)
                            .attr("y", significanceTestResultOffsetTop + 3*significanceTestResultStep)
                            .attr("text-anchor", "middle")
                            .attr("font-size", fontSizeSignificanceTestResults + "px")
                            .attr("fill", "#627bf4")
                            .text(testResults["p"][index])
                            .attr("class", "significanceTest");
    
    
                    //Effect sizes
                    drawEffectSize(parseFloat(testResults["effect-size"][index]));
                }
            }
            
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "stateForNavigation")
            {
                setup(e, target);
                
                d3.selectAll(".stateForNavigation").attr("fill", "url(#buttonFillNormal)").attr("filter", "url(#Bevel)").attr("stroke", "black");
                d3.selectAll(".stateForNavigationText").attr("fill", "black");                
                
                var button = d3.select("#" + target.id + ".stateForNavigation");
                var buttonText = d3.select("#" + target.id + ".stateForNavigationText");
                
                if(button.attr("stroke") == "black")
                {
                    button.attr("fill", "url(#buttonFillSelected)")
                            .attr("filter", "none")
                            .attr("stroke", "none");
                    
                    buttonText.attr("fill", "white");
                    
                    switch(currentVisualisationSelection)
                    {
                        case "Boxplot":
                                        {
                                            switch(target.id)
                                            {
                                                case "significance test":
                                                                        {
                                                                            var canvas = d3.select("#plotCanvas");
                                                                            var variableList = getSelectedVariables();
        
                                                                            var inText = "COMPARE NOW";
    
                                                                            drawButtonInSideBar(inText, "compareNow");
            
                                                                            var availableWidth = canvasWidth;
            
                                                                            canvas.append("rect")
                                                                                    .attr("x", availableWidth/3 - selectionButtonWidth/2)
                                                                                    .attr("y", selectionButtonOffset)
                                                                                    .attr("height", selectionButtonHeight)
                                                                                    .attr("width", selectionButtonWidth)
                                                                                    .attr("rx", scaleForWindowSize(10) + "px")
                                                                                    .attr("ry", scaleForWindowSize(10) + "px")
                                                                                    .attr("fill", "url(#buttonFillSelected)")
                                                                                    .attr("filter", "none")
                                                                                    .attr("stroke", "none")
                                                                                    .attr("id", "rect")
                                                                                    .attr("class", "selectNone");
                    
                                                                            canvas.append("text")
                                                                                    .attr("x", availableWidth/3)
                                                                                    .attr("y", selectionButtonOffset + selectionButtonHeight/2 + yAxisTickTextOffset)
                                                                                    .attr("fill", "white")
                                                                                    .attr("text-anchor", "middle")
                                                                                    .attr("font-size", fontSizeButtonLabel + "px")
                                                                                    .text("SELECT NONE")
                                                                                    .attr("id", "text")
                                                                                    .attr("class", "selectNone");
            
                                                                            canvas.append("rect")
                                                                                    .attr("x", 2*availableWidth/3 - selectionButtonWidth/2)
                                                                                    .attr("y", selectionButtonOffset)
                                                                                    .attr("height", selectionButtonHeight)
                                                                                    .attr("width", selectionButtonWidth)
                                                                                    .attr("rx", scaleForWindowSize(10) + "px")
                                                                                    .attr("ry", scaleForWindowSize(10) + "px")
                                                                                    .attr("fill", "url(#buttonFillNormal)")
                                                                                    .attr("filter", "url(#Bevel)")
                                                                                    .attr("stroke", "black")
                                                                                    .attr("id", "rect")
                                                                                    .attr("class", "selectAll");
                    
                                                                            canvas.append("text")
                                                                                    .attr("x", 2*availableWidth/3)
                                                                                    .attr("y", selectionButtonOffset + selectionButtonHeight/2 + yAxisTickTextOffset)
                                                                                    .attr("fill", "black")
                                                                                    .attr("text-anchor", "middle")
                                                                                    .attr("font-size", fontSizeButtonLabel + "px")
                                                                                    .text("SELECT ALL")
                                                                                    .attr("id", "text")
                                                                                    .attr("class", "selectAll");
        
                                                                            freezeMouseEvents = true;
                                                                            d3.selectAll(".IQRs, .medians, .TOPFringes, .BOTTOMFringes, .TOPFringeConnectors, .BOTTOMFringeConnectors, .outliers, .CIs, .CITopFringes, .CIBottomFringes").transition().duration(500).style("opacity", "0.2");
                                                                            d3.selectAll(".means").transition().duration(500).attr("r", engorgedMeanRadius);
            
                                                                            setTimeout(function()
                                                                            {
                                                                                freezeMouseEvents = false;
                                                                            }, 500);
        
                                                                            removeElementsByClassName("compareMean");
                                                                            
                                                                            break;
                                                                        }
                                            }
                                            
                                            break;                                            
                                        }
                        
                    }
                }
            }
    
            else
            {
                //the user clicked outside
                removeElementsByClassName("regressionPrediction");   
            }
        }
    }
}

function OnMouseMove(e)
{
    if (e == null) 
    var e = window.event; 

    // this is the actual "drag code"
    
    
    if(_dragElement != undefined)
    {
        var incompleteLines = d3.selectAll(".incompleteLines");
        // if((_dragElement.className.baseVal == 'means') && (document.getElementsByClassName("incompleteLines").length > 0) && incompleteLines.attr("stroke") == meanColors["normal"])
//         {
//             if(!fullScreen)
//             {
//                 incompleteLines.attr("x2", e.pageX - (width - canvasWidth - sideBarWidth))
//                         .attr("y2", e.pageY);
//             }
//             else
//             {
//                 incompleteLines.attr("x2", (e.pageX/(width - sideBarWidth)) * canvasWidth)
//                         .attr("y2", (e.pageY/height) * canvasHeight);
//             }
//         }
        if(_dragElement.id == "regressionLine")
        {
//             var regressionPoint = d3.select(".regressionPrediction");
//             
//             var xLine = d3.select("#x.lineToAxis");
//             var yLine = d3.select("#y.lineToAxis");
//             
//             var mouseX = toModifiedViewBoxForRegressionLineXCoordinate(e.pageX);
//             var mouseY = toModifiedViewBoxForRegressionLineYCoordinate(e.pageY);
//             
// //             xLine.attr("x1", ((height - mouseY) + testResults["intercept"])/testResults["slope"])
// //                                  .attr("y1", mouseY)                                                 
// //                                  .attr("y2", mouseY);
// //                          
// //             mouseX = ((canvasHeight - mouseY) + testResults["intercept"])/testResults["slope"];
// //             
// //     
// //             yLine.attr("x1", mouseX)
// //                  .attr("y1", height - (testResults["slope"]*mouseX - testResults["intercept"]))
// //                  .attr("x2", mouseX);
// 
// //             mouseY = toModifiedViewBoxForRegressionLineYCoordinate(testResults["slope"]*mouseX + testResults["intercept"]);
//             
//             mouseX = toModifiedViewBoxForRegressionLineXCoordinate(LEFT + getValue1(testResults["slope"]*(canvasHeight - mouseY) + testResults["intercept"], mins["X"], maxs["X"])*plotWidth);
//             
//             var canvas = d3.select("#plotCanvas");
//             
//             var dT = d3.select("#dummyText");
//             dT.text("X = " + mouseX + " , Y = " + mouseY);
//             
//             
//             regressionPoint.attr("cx", mouseX)
//                            .attr("cy", mouseY);
        }
        
    }

}

function OnMouseOver(e)         
{
    // IE is retarded and doesn't pass the event object
    if (e == null) 
            e = window.event; 

    // IE uses srcElement, others use target
    var target = e.target != null ? e.target : e.srcElement;
    // for IE, left click == 1
    // for Firefox, left click == 0
    
    if(!freezeMouseEvents)
    {
        if(help)
        {
            if(target.className.baseVal == "plotHelp")
            {
                setup(e, target);
                
                var visualisation = currentVisualisationSelection;
                var helpText = d3.select("#descriptionLabel");
                
                
                if(visualisation == null || visualisation == undefined)
                {
                    helpText.text("Please select a variable to get started");
                }
                else
                {   
                    d3.select(".plotHelp").attr("opacity","0.3").attr("cursor", "help");
                    helpText.text(desc[visualisation]);                
                }
            }
            
            if(target.className.baseVal == "pValueHelp")
            {
                setup(e, target);
                var helpText = d3.select("#descriptionLabel");
                
                d3.select(".pValueHelp").attr("opacity","0.3").attr("cursor", "help");
                
                helpText.text(desc["p-value"]);                
            }
            
            if(target.className.baseVal == "testStatisticHelp")
            {
                setup(e, target);
                var helpText = d3.select("#descriptionLabel");
                
                d3.select(".testStatisticHelp").attr("opacity","0.3").attr("cursor", "help");
                
                helpText.text(desc["parameter"][testResults["parameter-type"]]);                
            }
            
            if(target.className.baseVal == "methodHelp")
            {
                setup(e, target);
                var helpText = d3.select("#descriptionLabel");
                
                d3.select(".methodHelp").attr("opacity","0.3").attr("cursor", "help");
                console.log(testResults["test-type"]);                
                
                helpText.text(desc["method"][testResults["test-type"]]);
            }
            
            if(target.className.baseVal == "effectSizeHelp")
            {
                setup(e, target);
                var helpText = d3.select("#descriptionLabel");
                
                d3.select(".effectSizeHelp").attr("opacity","0.3").attr("cursor", "help");
                helpText.text(desc["effect-size"][testResults["effect-size-type"]]);
            }
            
            if(target.className.baseVal == "variancePlotHelp")
            {
                setup(e, target);
                
                var visualisation = currentVisualisationSelection;
                var helpText = d3.select("#descriptionLabel");
                
                d3.select(".variancePlotHelp").attr("opacity","0.3").attr("cursor", "help");

                helpText.text(desc["variancePlot"]);                
            }
            
            if(target.className.baseVal == "normalityPlotHelp")
            {
                setup(e, target);
                
                var visualisation = currentVisualisationSelection;
                var helpText = d3.select("#descriptionLabel");
                
                d3.select(".normalityPlotHelp").attr("opacity","0.3").attr("cursor", "help");

                helpText.text(desc["normalityPlot"]);                
            }
            
            if(target.className.baseVal == "assumptionsButtonFront")
            {
                setup(e, target);
                var assumptionType = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#" + assumptionType + ".assumptionsButtonBack").attr("stroke-width","2px");
                d3.select("#" + assumptionType + ".assumptionsButtonFront").attr("cursor", "help");
                
                helpText.text(desc["assumptions"][assumptionType]);
            }
            
            if(target.className.baseVal == "compareMean")
            {
                setup(e, target);
                var assumptionType = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#button.compareMean").attr("stroke-width","2px").attr("cursor", "help");
                d3.select("#text.compareMean").attr("cursor", "help");
                
                helpText.text(desc["compareMean"]);   
            }
            
            if(target.className.baseVal == "compareNow")
            {
                setup(e, target);
                var assumptionType = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#button.compareNow").attr("stroke-width","2px").attr("cursor", "help");
                d3.select("#text.compareNow").attr("cursor", "help");
                
                helpText.text(desc["compareNow"]);   
            }
            
            if(target.className.baseVal == "pairwisePostHoc")
            {
                setup(e, target);
                var assumptionType = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#button.pairwisePostHoc").attr("stroke-width","2px").attr("cursor", "help");
                d3.select("#text.pairwisePostHoc").attr("cursor", "help");
                
                helpText.text(desc["pairwisePostHoc"]);   
            }
            
            if(target.className.baseVal == "tukeyHSD")
            {
                setup(e, target);
                var assumptionType = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#button.tukeyHSD").attr("stroke-width","2px").attr("cursor", "help");
                d3.select("#text.tukeyHSD").attr("cursor", "help");
                
                helpText.text(desc["tukeyHSD"]);   
            }
            
            if(target.className.baseVal == "regression")
            {
                setup(e, target);
                var assumptionType = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#button.regression").attr("stroke-width","2px").attr("cursor", "help");
                d3.select("#text.regression").attr("cursor", "help");
                
                helpText.text(desc["regression"]);   
            }
            
            if(target.id == "regressionLine")
            {
                setup(e, target);
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.selectAll("#regressionLine").attr("stroke-width", "12px").attr("cursor", "help");
                
                helpText.text(desc["regressionLine"]);
            }
            
            if(target.id == "equation")
            {
                setup(e, target);
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.selectAll("#equation").attr("fill", "lightorange").attr("cursor", "help");
                
                helpText.text(desc["equation"]);
            }
            
            if(target.className.baseVal == "interactionEffect")
            {
                setup(e, target);
                var assumptionType = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#button.interactionEffect").attr("stroke-width","2px").attr("cursor", "help");
                d3.select("#text.interactionEffect").attr("cursor", "help");
                
                helpText.text(desc["interactionEffect"]);   
            }
            
            if(target.className.baseVal == "variableNameHolderFront")
            {
                setup(e, target);
                var varName = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#" + varName + ".variableNameHolderBack").attr("stroke-width","2px");
                d3.select("#" + varName + ".variableNameHolderFront").attr("cursor", "help");
                
                helpText.text(desc["variables"][varName]);                
            }
        }
        else
        {
            if(target.className.baseVal == "variableNameHolderFront")
            {       
                setup(e, target);
        
                var variableNameHolder = d3.selectAll("#" + target.id + ".variableNameHolderFront");
                variableNameHolder.attr("cursor","pointer");
            }
    
            else if(target.className.baseVal == "visualisationHolderFront")
            {       
                setup(e, target);
        
                var visualisationHolder = d3.selectAll("#" + target.id + ".visualisationHolderFront");
                visualisationHolder.attr("cursor","pointer");
            }
    
            else if(target.className.baseVal == "variableTypeToggleButton")
            {
                // setup(e, target);
        
                // var toggleButton = d3.select("#" + target.id + ".variableTypeToggleButton");
        
                // toggleButton.attr("cursor", "pointer");
            }
    
            else if(target.className.baseVal == "dependentVariableButtonFront")
            {
                setup(e, target);
        
                var variableButton = d3.select("#" + target.id + ".dependentVariableButtonBack");
                //if not selected
                if(variableButton.attr("fill") != variableTypeButtonColors["dependent"]["selected"])
                {
                    d3.select("#" + target.id + "." + target.className.baseVal).attr("cursor", "pointer");
                }
                else
                {
                    d3.select("#" + target.id + "." + target.className.baseVal).attr("cursor", "default");
                }
            }
    
            else if(target.className.baseVal == "independentVariableButtonFront")
            {
                setup(e, target);
        
                var variableButton = d3.select("#" + target.id + ".independentVariableButtonBack");
                //if not selected
                if(variableButton.attr("fill") != variableTypeButtonColors["independent"]["selected"])
                {
                    d3.select("#" + target.id + "." + target.className.baseVal).attr("cursor", "pointer");
                }
                else
                {
                    d3.select("#" + target.id + "." + target.className.baseVal).attr("cursor", "default");
                }
            }
    
            else if(target.className.baseVal == "disabled")
            {
                setup(e, target);
        
                var variableHolder = d3.select("#" + target.id + ".disabled");
                variableHolder.attr("cursor", "pointer");
            }
    
            else if(target.className.baseVal == "means")
            {       
                setup(e, target);
        
                var meanCircle = d3.select("#" + target.id + ".means");                
        
                if(meanCircle.attr("r") == meanRadius)
                {                
                    meanCircle.attr("cursor", "default");
            
                    var plotCanvas = d3.select("#plotCanvas");
                    var L = canvasWidth/2 - plotWidth/2 - axesOffset;
            
                    var mouseX = e.pageX - (width - canvasWidth - sideBarWidth);
                    var mouseY = e.pageY;
            
                    plotCanvas.append("line")
                                .attr("x1", meanCircle.attr("cx"))
                                .attr("y1", meanCircle.attr("cy"))
                                .attr("x2", L)
                                .attr("y2", meanCircle.attr("cy"))
                                .attr("stroke-dasharray", "5,5")
                                .attr("stroke", meanColors["normal"])
                                .attr("class", "hover");
            
                    plotCanvas.append("text")
                                .attr("x", mouseX + 10)
                                .attr("y", mouseY + 15)
                                .attr("text-anchor", "start")
                                .text(dec2(getActualValue(meanCircle.attr("cy"))))
                                .attr("fill", meanColors["normal"])
                                .attr("class", "hover");
                        
                }   
                else
                {                
                    if((document.getElementsByClassName("completeLines").length+1 <= (document.getElementsByClassName("means").length)) || (document.getElementsByClassName("means").length == 1))
                    {      
                        meanCircle.attr("cursor","pointer");
                    
                        //change color of the mean circle
                        if(meanCircle.attr("fill") == meanColors["normal"])
                        {
                            startLoopAnimation(meanCircle);
                            meanCircle.attr("fill", meanColors["hover"]);
            
                            // startLoopAnimation(meanCircle);
            
                            var incompleteLines = d3.selectAll(".incompleteLines");
            
                            if(document.getElementsByClassName("incompleteLines").length > 0)
                            {
                                incompleteLines.attr("x2", meanCircle.attr("cx"))
                                                .attr("y2", meanCircle.attr("cy"))
                                                .attr("display", "inline")
                                                .attr("stroke", meanColors["hover"]);
                            }
                        }
                    }
                }
            }
    
            else if(target.className.baseVal == "compareNow")
            {
                setup(e, target);
            
                d3.selectAll(".compareNow").attr("cursor", "pointer");
            }    
    
            else if(target.className.baseVal == "compareMean")
            {
                setup(e, target);
            
                d3.selectAll(".compareMean").attr("cursor", "pointer");
            }    
        
            else if(target.className.baseVal == "selectAll")
            {
                setup(e, target);
            
                d3.selectAll(".selectAll").attr("cursor", "pointer");
            }
        
            else if(target.className.baseVal == "selectNone")
            {
                setup(e, target);
            
                d3.selectAll(".selectNone").attr("cursor", "pointer");
            }
        
            else if(target.className.baseVal == "assumptionsButtonFront")
            {
                setup(e, target);
            
                d3.selectAll("#" + target.id + ".assumptionsButtonFront").attr("cursor", "pointer");
            }
    
            else if(target.className.baseVal == "bins")
            {       
                setup(e, target);
        
                highlightBinWithId(target.id);
            }   
    
            else if(target.className.baseVal == "datapoints")
            {       
                setup(e, target);
    
                var datapoint = d3.select("#" + target.id + ".datapoints");
        
                datapoint.transition().duration(300).attr("r", "5px");
        
                var altScatterPlot = false;
                var text = new Array();
        
                //Get data, minimums and maximums for each selected variable
                for(var i=0; i<currentVariableSelection.length; i++)
                {   
                    if(variableRows[currentVariableSelection[i]] == false && currentVariableSelection.length > 1)
                    {
                        // Levels are needed when we have a independent variable and one or more dependent variables
                        levels = variables[currentVariableSelection[i]]["dataset"].unique();            
                        altScatterPlot = true;
                    }
                }
    
                for(var i=0; i<currentVariableSelection.length; i++)
                {        
                    if(altScatterPlot)
                    {
                        if(variableRows[currentVariableSelection[i]] != false)
                        {
                            //for the dependent variable(s)
                
                            for(var j=0; j<levels.length; j++)
                            {
                                // for each level of the independent variable, find the dependent variables                    
                    
                                text[j] = variables[currentVariableSelection[i]][levels[j]];
                            }
                        }  
                    }
                    else 
                    {               
                        text[i] = variables[currentVariableSelection[i]]["dataset"];                
                    }             
                }
        
                var mouseX = e.pageX - (width - canvasWidth - sideBarWidth);
                var mouseY = e.pageY;
        
                var canvas = d3.select("#plotCanvas");
                canvas.append("text")
                        .attr("x", mouseX + 10)
                        .attr("y", mouseY + 15)
                        .attr("fill", meanColors["normal"])
                        .text(text[0][removeAlphabetsFromString(datapoint.attr("id"))] + ", " + text[1][removeAlphabetsFromString(datapoint.attr("id"))])
                        .attr("class", "hoverText");
                
                var xLine = canvas.append("line")
                        .attr("x1", datapoint.attr("cx"))
                        .attr("y1", datapoint.attr("cy"))
                        .attr("x2", datapoint.attr("cx"))
                        .attr("y2", datapoint.attr("cy"))
                        .attr("stroke", meanColors["normal"])
                        .attr("stroke-dasharray", "5,5")
                        .attr("id", "x")
                        .attr("class", "hoverText");
        
                xLine.transition().duration(500).attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset);
        
                var yLine = canvas.append("line")
                        .attr("x1", datapoint.attr("cx"))
                        .attr("y1", datapoint.attr("cy"))
                        .attr("x2", datapoint.attr("cx"))
                        .attr("y2", datapoint.attr("cy"))
                        .attr("stroke", meanColors["normal"])
                        .attr("stroke-dasharray", "5,5")
                        .attr("id", "y")
                        .attr("class", "hoverText");
        
                yLine.transition().duration(500).attr("y2", canvasHeight/2 + plotHeight/2 - topOffset + axesOffset);
                
        
            }   
    
            else if(target.className.baseVal == "transformToNormal")
            {
                setup(e, target);
                d3.selectAll(".transformToNormal").attr("cursor", "pointer");
            }
        
            else if(target.className.baseVal == "transformToHomogeneity")
            {
                setup(e, target);
                d3.selectAll(".transformToHomogeneity").attr("cursor", "pointer");
            }
    
            else if(target.className.baseVal == "fullscreen")
            {
                // grab the mouse position
                _startX = e.clientX;
                _startY = e.clientY;
                // we need to access the element in OnMouseMove
                _dragElement = target;

                // tell our code to start moving the element with the mouse
            //     document.onmousemove = OnMouseMove;

                // cancel out any text selections
                document.body.focus();

                // prevent text selection in IE
                document.onselectstart = function () { return false; };
                // prevent IE from trying to drag an image
                target.ondragstart = function() { return false; };
        
                var button = d3.select(".fullscreen");
                button.attr("cursor", "pointer");
            }
        
            else if(target.className.baseVal == "helpButtonFront")
            {
                setup(e, target);
            
                var helpButton = d3.select(".helpButtonFront");
                var helpButtonText = d3.select(".helpButtonText");
                
//                 if(currentState().substate = "base"
            
                helpButton.attr("cursor", "pointer");
                helpButtonText.attr("cursor", "pointer");
            } 
            
            else if(target.className.baseVal == "backButtonFront")
            {
                setup(e, target);
            
                var backButton = d3.select(".backButtonFront");
                var backButtonText = d3.select(".backButtonText");
            
                if(d3.select(".backButtonBack").attr("stroke") == "black")
                {
                    backButton.attr("cursor", "pointer");
                    backButtonText.attr("cursor", "pointer");
                }
                else
                {
                    backButton.attr("cursor", "default");
                    backButtonText.attr("cursor", "default");
                }
            } 
    
            else if(target.className.baseVal == "outliers")
            {
                setup(e, target);
                var canvas = d3.select("#plotCanvas");
                var outlier = d3.select("#" + target.id + ".outliers");
        
                var mouseX = e.pageX - (width - canvasWidth - sideBarWidth);
                var mouseY = e.pageY;
        
                outlier.attr("r", outlierRadius*2).attr("stroke", "yellow").attr("stroke-width", "2px");
                canvas.append("line")       
                        .attr("x1", outlier.attr("cx"))
                        .attr("y1", outlier.attr("cy"))
                        .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                        .attr("y2", outlier.attr("cy"))
                        .attr("stroke-dasharray", "5,5")
                        .attr("stroke", "black")
                        .attr("class", "hover");    
        
                canvas.append("text")
                        .attr("x", mouseX + scaleForWindowSize(45))
                        .attr("y", mouseY + scaleForWindowSize(25))
                        .attr("text-anchor", "middle")
                        .text(dec2(getActualValue(outlier.attr("cy"))))
                        .attr("class", "hover");                
            }
    
            else if((target.className.baseVal == "TOPFringes") || (target.className.baseVal == "BOTTOMFringes"))
            {
                setup(e, target);
                var canvas = d3.select("#plotCanvas");
                var tFringe = d3.select("#" + target.id + ".TOPFringes");
                var bFringe = d3.select("#" + target.id + ".BOTTOMFringes");
        
                tFringe.attr("stroke-width", 4);
                bFringe.attr("stroke-width", 4);
        
                canvas.append("line")       
                        .attr("x1", tFringe.attr("x1"))
                        .attr("y1", tFringe.attr("y1"))
                        .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                        .attr("y2", tFringe.attr("y1"))
                        .attr("stroke-dasharray", "5,5")
                        .attr("stroke", "black")
                        .attr("class", "hover");    
        
                 canvas.append("line")       
                        .attr("x1", bFringe.attr("x1"))
                        .attr("y1", bFringe.attr("y1"))
                        .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                        .attr("y2", bFringe.attr("y1"))
                        .attr("stroke-dasharray", "5,5")
                        .attr("stroke", "black")
                        .attr("class", "hover");    
    
                canvas.append("text")
                        .attr("x", (parseFloat(tFringe.attr("x1")) + parseFloat(tFringe.attr("x2")))/2)
                        .attr("y", parseFloat(tFringe.attr("y1")) - displayOffsetTop)
                        .attr("text-anchor", "middle")
                        .text(dec2(getActualValue(tFringe.attr("y1"))))
                        .attr("class", "hover");
        
                canvas.append("text")
                        .attr("x", (parseFloat(bFringe.attr("x1")) + parseFloat(bFringe.attr("x2")))/2)
                        .attr("y", parseFloat(bFringe.attr("y1")) + displayOffsetBottom)
                        .attr("text-anchor", "middle")
                        .text(dec2(getActualValue(bFringe.attr("y1"))))
                        .attr("class", "hover");
                
            }
    
            else if((target.className.baseVal == "CIs") || (target.className.baseVal == "CITopFringes") || (target.className.baseVal == "CIBottomFringes"))
            {
                var canvas = d3.select("#plotCanvas");
        
                var topFringe = d3.select("#" + target.id + ".CITopFringes");
                var bottomFringe = d3.select("#" + target.id + ".CIBottomFringes");
    
                var variableList = sort(currentVariableSelection);        
                var topLine = canvas.append("line")
                        .attr("x1", (parseFloat(topFringe.attr("x1")) + parseFloat(topFringe.attr("x2")))/2)
                        .attr("y1", topFringe.attr("y1"))
                        .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                        .attr("y2", topFringe.attr("y1"))
                        .attr("stroke", "black")
                        .attr("stroke-dasharray", "5,5")
                        .attr("class", "hover");
                
                var bottomLine = canvas.append("line")
                        .attr("x1", (parseFloat(bottomFringe.attr("x1")) + parseFloat(bottomFringe.attr("x2")))/2)
                        .attr("y1", bottomFringe.attr("y1"))
                        .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                        .attr("y2", bottomFringe.attr("y1"))
                        .attr("stroke", "black")
                        .attr("stroke-dasharray", "5,5")
                        .attr("class", "hover");
                   
                canvas.append("text")
                        .attr("x",parseFloat(topFringe.attr("x1")))
                        .attr("y", parseFloat(topFringe.attr("y1")) - displayOffsetTop)
                        .attr("text-anchor", "middle")
                        .text(dec2(getActualValue(parseFloat(topFringe.attr("y1")))))
                        .attr("class", "hover");
                
                canvas.append("text")
                        .attr("x",parseFloat(bottomFringe.attr("x1")))
                        .attr("y", parseFloat(bottomFringe.attr("y1")) + displayOffsetBottom)
                        .attr("text-anchor", "middle")
                        .text(dec2(getActualValue(parseFloat(bottomFringe.attr("y1")))))
                        .attr("class", "hover");
            }
            
            else if((target.className.baseVal == "CI_mean") || (target.className.baseVal == "CI_top") || (target.className.baseVal == "CI_bottom"))
            {
                var canvas = d3.select("#plotCanvas");
        
                var topFringe = d3.select(".CI_top");
                var bottomFringe = d3.select(".CI_bottom");
    
                var variableList = sort(currentVariableSelection);       
                
                var top = dec2(testResults["CI"][1]);
                var bottom = dec2(testResults["CI"][0]);
                   
                canvas.append("text")
                        .attr("x",parseFloat(topFringe.attr("x1")))
                        .attr("y", parseFloat(topFringe.attr("y1")) - displayOffsetTop)
                        .attr("text-anchor", "middle")
                        .text(top)
                        .attr("class", "hover");
                
                canvas.append("text")
                        .attr("x",parseFloat(bottomFringe.attr("x1")))
                        .attr("y", parseFloat(bottomFringe.attr("y1")) + displayOffsetBottom)
                        .attr("text-anchor", "middle")
                        .text(bottom)
                        .attr("class", "hover");
            }
    
            else if(target.className.baseVal == "regression")
            {
                var regressionElements = d3.selectAll(".regression").attr("cursor", "pointer");
            }
    
            else if(target.className.baseVal == "outcomeVariable")
            {
                setup(e, target);
        
                var outcomeVariableButton = d3.select("#button.outcomeVariable");
                var outcomeVariableText = d3.select("#text.outcomeVariable");
        
                d3.selectAll(".outcomeVariable").attr("cursor", "pointer");
            }
    
            else if(target.className.baseVal == "tukeyMean")
            {
                setup(e, target);
        
                var mean = d3.select("#" + target.id + ".tukeyMean");
                var canvas = d3.select("#plotCanvas");
        
                canvas.append("line")
                        .attr("x1", mean.attr("cx"))
                        .attr("y1", mean.attr("cy"))
                        .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                        .attr("y2", mean.attr("cy"))
                        .attr("stroke", mean.attr("fill"))
                        .attr("stroke-dasharray", "5,5")
                        .attr("class", "hover");
        
                canvas.append("text")
                        .attr("x", e.pageX - (width - canvasWidth - sideBarWidth) + 9)
                        .attr("y", e.pageY + 9)
                        .attr("fill", "black")
                        .text(tukeyResults[mean.attr("data-index1")][mean.attr("data-index2")]["difference"])
                        .attr("class", "hover");
            }
    
            else if((target.className.baseVal == "tukeyCI") || (target.className.baseVal == "tukeyCITop") || (target.className.baseVal == "tukeyCIBottom"))
            {
                setup(e, target);
        
                var tCI = d3.select("#" + target.id + ".tukeyCI");
                var tCITop = d3.select("#" + target.id + ".tukeyCITop");
                var tCIBottom = d3.select("#" + target.id + ".tukeyCIBottom");
        
                var canvas = d3.select("#plotCanvas");
                
                canvas.append("text")
                        .attr("x", tCITop.attr("x1"))
                        .attr("y", tCITop.attr("y1") - displayOffsetTop)
                        .attr("text-anchor", "middle")
                        .attr("fill", "black")
                        .text(tukeyResults[tCITop.attr("data-index1")][tCITop.attr("data-index2")]["upper"])
                        .attr("class", "hover");
        
                canvas.append("text")
                        .attr("x", tCIBottom.attr("x1"))
                        .attr("y", parseFloat(tCIBottom.attr("y1")) + displayOffsetBottom)
                        .attr("text-anchor", "middle")
                        .attr("fill", "black")
                        .text(tukeyResults[tCIBottom.attr("data-index1")][tCIBottom.attr("data-index2")]["lower"])
                        .attr("class", "hover");
        
                canvas.append("line")
                        .attr("x1", tCITop.attr("x1"))
                        .attr("y1", tCITop.attr("y1"))
                        .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                        .attr("y2", tCITop.attr("y1"))
                        .attr("stroke", tCITop.attr("stroke"))
                        .attr("stroke-dasharray", "5,5")
                        .attr("class", "hover");
                canvas.append("line")
                        .attr("x1", tCIBottom.attr("x1"))
                        .attr("y1", tCIBottom.attr("y1"))
                        .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                        .attr("y2", tCIBottom.attr("y1"))
                        .attr("stroke", tCIBottom.attr("stroke"))
                        .attr("stroke-dasharray", "5,5")
                        .attr("class", "hover");
            }
    
            else if(target.className.baseVal == "differenceInMeans")
            {
                var differenceInMeansText = d3.select("#" + target.id + ".differenceInMeansText");
        
                differenceInMeansText.attr("display", "inline");
        
                var differenceInMeansLines = document.getElementsByClassName("differenceInMeans");
        
                for(var i=0; i<differenceInMeansLines.length; i++)
                {
                    if(differenceInMeansLines[i].getAttribute("id") != target.id)
                    {
                        differenceInMeansLines[i].setAttribute("opacity", "0.2");
                    }
                }
            }
    
            else if(target.className.baseVal == "interactionEffect")
            {
                setup(e, target);
        
                d3.selectAll(".interactionEffect").attr("cursor", "pointer");
            }
    
            else if(target.className.baseVal == "pairwisePostHoc")
            {
                setup(e, target);
        
                d3.selectAll(".pairwisePostHoc").attr("cursor", "pointer");
            }
            
            else if(target.className.baseVal == "tukeyHSD")
            {
                setup(e, target);
        
                d3.selectAll(".tukeyHSD").attr("cursor", "pointer");
            }
    
            else if(target.className.baseVal == "doPairwiseTest")
            {
                setup(e, target);
        
                d3.selectAll(".doPairwiseTest").attr("cursor", "pointer");
            }
            
            else if(target.className.baseVal == "effectButtonFront")
            {
                setup(e, target);
                
                var effectButton = d3.select("#" + target.id + ".effectButtonFront");
                
                if(d3.select("#" + target.id + ".effectButtonBack").attr("stroke") == "black")
                    effectButton.attr("cursor", "pointer");
            }
            
            else if((target.className.baseVal == "stateForNavigation") || (target.className.baseVal == "stateForNavigationText"))
            {
                setup(e, target);
                
                var button = d3.select("#" + target.id + ".stateForNavigation");
                var buttonText = d3.select("#" + target.id + ".stateForNavigationText");
                
                if(button.attr("stroke") == "black")
                {
                    button.attr("cursor", "pointer");
                    buttonText.attr("cursor", "pointer");
                }
                else
                {
                    button.attr("cursor", "default");
                    buttonText.attr("cursor", "pointer");
                }
            }
            
            else if(target.id == "effectSizeFront")
            {
                setup(e, target);
                
                d3.selectAll("#effectSizeText, #effectSizeValue").attr("display", "none");
                d3.selectAll(".effectSizeInterpretationIndicators").attr("display", "inline");
            } 
        }
    }
}

function OnMouseOut(e)
{    
    var target = e.target != null ? e.target : e.srcElement;
    
    if(help)
    {
        if(target.className.baseVal == "plotHelp")
        {
            d3.select(".plotHelp").attr("fill", "white").attr("opacity","0.01").attr("cursor", "default");        
        }
        
        if(target.className.baseVal == "variancePlotHelp")
        {
            d3.select(".variancePlotHelp").attr("fill", "white").attr("opacity","0.01").attr("cursor", "default");        
        }
        
        if(target.className.baseVal == "normalityPlotHelp")
        {
            d3.select(".normalityPlotHelp").attr("fill", "white").attr("opacity","0.01").attr("cursor", "default");        
        }
        
        if(target.className.baseVal == "pValueHelp")
        {
            d3.select(".pValueHelp").attr("fill", "white").attr("opacity","0.01").attr("cursor", "default");        
        }
        
        if(target.className.baseVal == "testStatisticHelp")
        {
            d3.select(".testStatisticHelp").attr("fill", "white").attr("opacity","0.01").attr("cursor", "default");        
        }
        
        if(target.className.baseVal == "methodHelp")
        {
            d3.select(".methodHelp").attr("fill", "white").attr("opacity","0.01").attr("cursor", "default");        
        }
        
        if(target.className.baseVal == "effectSizeHelp")
        {
            d3.select(".effectSizeHelp").attr("fill", "white").attr("opacity","0.01").attr("cursor", "default");        
        }
        
        if(target.className.baseVal == "assumptionsButtonFront")
        {
            d3.select("#" + target.id + ".assumptionsButtonBack").attr("stroke-width", "1px");
            d3.select("#" + target.id + ".assumptionsButtonFront").attr("cursor", "pointer");
        }
        
        if(target.className.baseVal == "compareMean")
        {
            d3.select("#button.compareMean").attr("stroke-width", "1px").attr("cursor", "pointer");
            d3.select("#text.compareMean").attr("cursor", "pointer");
        }
        
        if(target.className.baseVal == "compareNow")
        {
            d3.select("#button.compareNow").attr("stroke-width", "1px").attr("cursor", "pointer");
            d3.select("#text.compareNow").attr("cursor", "pointer");
        }
        
        if(target.className.baseVal == "pairwisePostHoc")
        {
            d3.select("#button.pairwisePostHoc").attr("stroke-width", "1px").attr("cursor", "pointer");
            d3.select("#text.pairwisePostHoc").attr("cursor", "pointer");
        }
        
        if(target.className.baseVal == "tukeyHSD")
        {
            d3.select("#button.tukeyHSD").attr("stroke-width", "1px").attr("cursor", "pointer");
            d3.select("#text.tukeyHSD").attr("cursor", "pointer");
        }
        
        if(target.className.baseVal == "regression")
        {
            d3.select("#button.regression").attr("stroke-width", "1px").attr("cursor", "pointer");
            d3.select("#text.regression").attr("cursor", "pointer");
        }
        
        if(target.className.baseVal == "interactionEffect")
        {
            d3.select("#button.interactionEffect").attr("stroke-width", "1px").attr("cursor", "pointer");
            d3.select("#text.interactionEffect").attr("cursor", "pointer");
        }
        
        if(target.className.baseVal == "variableNameHolderFront")
        {
            var varName = target.id;
            
            d3.select("#" + varName + ".variableNameHolderBack").attr("stroke-width","1px");
            d3.select("#" + varName + ".variableNameHolderFront").attr("cursor", "pointer");
        }
        
        if(target.id == "regressionLine")
        {
            d3.selectAll("#regressionLine").attr("stroke-width", "10px").attr("cursor", "default");
        }
        
        if(target.id == "equation")
        {
            d3.selectAll("#equation").attr("fill", "orange").attr("cursor", "default");
        }
        
    }
    else
    {                
        if(target.className.baseVal == "variableNameHolder")                
        {
            var variableNameHolder = d3.selectAll("#" + target.id + ".variableNameHolder");
        }
    
        else if(target.className.baseVal == "visualisationHolder")                
        {
            var visualisationHolder = d3.selectAll("#" + target.id + ".visualisationHolder");
        }
    
        else if(target.className.baseVal == "means")                
        {
            var meanCircle = d3.selectAll("#" + target.id + ".means");
        
            if(meanCircle.attr("r") == engorgedMeanRadius)
            {
                if(meanCircle.attr("fill") != meanColors["click"])
                {
                    meanCircle.attr("fill", meanColors["normal"]);
                    var incompleteLine = d3.select(".incompleteLines").attr("display", "none");
                }
            }
            else
            {
                removeElementsByClassName("hover");
            }
        
            removeElementsByClassName("loops");
            clearInterval(intervals[meanCircle.attr("id")]);
        
    //         var incompleteLines = d3.selectAll(".incompleteLines");
    //             
    //         if(document.getElementsByClassName("incompleteLines").length > 0)
    //         {
    //             incompleteLines.attr("stroke", meanColors["normal"]);
    //         }   
        }
    
        else if(target.className.baseVal == "bins")                
        {
            var bins = d3.selectAll(".bins");
        
            unhighlightBins();
        }
    
        else if(target.className.baseVal == "datapoints")                
        {
            var datapoint = d3.select("#" + target.id + ".datapoints");
        
            datapoint.transition().duration(300).attr("r", datapointRadius);
            removeElementsByClassName("hoverText");
        }
    
        else if(target.className.baseVal == "outliers")
        {
            var canvas = d3.select("#plotCanvas");
            var outlier = d3.select("#" + target.id + ".outliers");
        
            outlier.attr("r", outlierRadius).attr("stroke", "none");
            removeElementsByClassName("hover");
        }
    
        else if((target.className.baseVal == "TOPFringes") || (target.className.baseVal == "BOTTOMFringes"))
        {
            var canvas = d3.select("#plotCanvas");
        
            var tFringe = d3.select("#" + target.id + ".TOPFringes");
            var bFringe = d3.select("#" + target.id + ".BOTTOMFringes");
        
            tFringe.attr("stroke-width", 2);
            bFringe.attr("stroke-width", 2);
        
            removeElementsByClassName("hover");
        }
    
        else if((target.className.baseVal == "CIs") || (target.className.baseVal == "CITopFringes") || (target.className.baseVal == "CIBottomFringes"))
        {
            removeElementsByClassName("hover");
        }
        
        else if((target.className.baseVal == "CI_mean") || (target.className.baseVal == "CI_top") || (target.className.baseVal == "CI_bottom"))
        {
            removeElementsByClassName("hover");
        }
    
        else if((target.id == "regressionLine"))
        {
    //         removeElementsByClassName("regressionPrediction");
    //         removeElementsByClassName("lineToAxis")
        }
    
        else if((target.className.baseVal == "tukeyMean") || (target.className.baseVal == "tukeyCI") || (target.className.baseVal == "tukeyCITop") || (target.className.baseVal == "tukeyCIBottom"))
        {
            removeElementsByClassName("hover");
        }
    
        else if(target.className.baseVal == "differenceInMeans")
        {
            var differenceInMeansText = d3.select("#" + target.id + ".differenceInMeansText");
        
            differenceInMeansText.attr("display", "none");
        
            var differenceInMeansLines = document.getElementsByClassName("differenceInMeans");
        
            for(var i=0; i<differenceInMeansLines.length; i++)
            {
                if(differenceInMeansLines[i].getAttribute("id") != target.id)
                {
                    differenceInMeansLines[i].setAttribute("opacity", "1.0");
                }
            }
        }
        
        else if(target.id == "effectSizeFront")
        {
            d3.selectAll("#effectSizeText, #effectSizeValue").attr("display", "inline");
            d3.selectAll(".effectSizeInterpretationIndicators").attr("display", "none");
        }
    }
}   

function setup(e, target)
{
    // grab the mouse position
    _startX = e.clientX;
    _startY = e.clientY;

    // grab the clicked element's position
    _offsetX = removeAlphabetsFromString(target.style.left);
    _offsetY = removeAlphabetsFromString(target.style.top);      

    // bring the clicked element to the front while it is being dragged
    _oldZIndex = target.style.zIndex;
    target.style.zIndex = +1;

    // we need to access the element in OnMouseMove
    _dragElement = target;

    // tell our code to start moving the element with the mouse
    document.onmousemove = OnMouseMove;

    // cancel out any text selections
    document.body.focus();

    // prevent text selection in IE
    document.onselectstart = function () { return false; };
    // prevent IE from trying to drag an image
    target.ondragstart = function() { return false; };      
}

//load the file to a JS object
function loadFile(filePath)
{
    var timeBefore = new Date().getTime();
    //loads the file and returns the dataset and variable names
    var req = ocpu.rpc("loadFile", 
    {
        filePath: filePath
    }, function(output) 
    {     
        var timeAfter = new Date().getTime();

        console.log("Latency for loadFile() = " + (timeAfter - timeBefore)/1000 + "seconds");

        dataset = output.dataset;

        //render the variable names
        renderVariableNames(output.variableNames);    

        //we now have the variable names. let the dogs out!
        variableNames = output.variableNames;

        //for each variable, get the data and the IQR
        for(var i=0; i<output.variableNames.length; i++)
        {      
            variables[output.variableNames[i]] = new Object();
            MIN[output.variableNames[i]] = new Object();
            MAX[output.variableNames[i]] = new Object();
            IQR[output.variableNames[i]] = new Object();
            CI[output.variableNames[i]] = new Object();

            getData(dataset, output.variableNames[i]);                 
        }
    });
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}    

//get data by each variable name into JS object-value pairs
function getData(dataset, variableName, level)
{
    if(level === undefined)  
        level = "dataset";
    
    variables[variableName][level] = [];
    
    for(var i=0; i<dataset.length; i++)
        variables[variableName][level].push(dataset[i][variableName]);  
        
    MIN[variableName][level] = Array.min(variables[variableName][level]);
    MAX[variableName][level] = Array.max(variables[variableName][level]);
    
    IQR[variableName][level] = findIQR(variables[variableName][level]);
    CI[variableName][level] = findCI(variables[variableName][level]);   
    
    if(++variableCount == getObjectLength(variableNames))
    {
        setVariableRow();
        setVariableTypes();
        
        testForEvilVariables();
        
        removeElementsByClassName("loadingAnimation");
        freezeMouseEvents = false;
        
        experimentalDesign = findExperimentalDesign();            
        console.log("\n\tExperimental-design of the dataset is \"" + experimentalDesign + "\"");

        displayToolTips();
    }
}

//perform levene's test, p < 0.05 => not homogeneous
function performHomoscedasticityTest(dependent, independent)
{ 
    console.log("yes, it's working...");  
    var variableList = getSelectedVariables(); 
                
    //get variable names and their data type
    var req = ocpu.rpc("performHomoscedasticityTest", 
    {
       dependentVariable: dependent,
       independentVariable: independent,
       dataset: dataset                    
    }, function(output) 
    {                                                
       if(output.p < 0.05)
       {   
           //not normal
           if(variableList["independent"].length == 0)
           {
               //one sample t-test
               d3.select("#homogeneity.crosses").attr("display", "inline");
               d3.select("#homogeneity.loading").attr("display", "none");
           
               d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight*1.5);
   
               //draw boxplots in red 
               drawBoxPlotInRed(variableList["dependent"][0]);
               drawNormalityPlot(variableList["dependent"][0], "dataset", "notnormal");
   
               findTransformForNormalityForDependentVariables(getNumericVariables());
           }
           else
           {
               setHomogeneity(dependent, independent, false);
           }
       }
       else
       {   
           //normal
           if(variableList["independent"].length == 0)
           {
               d3.select("#homogeneity.ticks").attr("display", "inline");
               d3.select("#homogeneity.loading").attr("display", "none");
           
               drawDialogBoxToGetPopulationMean();
           }
           else
           {
               setHomogeneity(dependent, independent, true);
           }
       }
       
    });

    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//perform shapiro-wilk test, p < 0.05 => not normal
function performNormalityTest(distribution, dependentVariable, level)
{     
    // Get variable names and their data type
    var req = ocpu.rpc("performShapiroWilkTest", 
    {
        distribution: distribution                                                           
    }, function(output) 
    {                                                   
        var variableList = getSelectedVariables(); 
        
        if(output.p < 0.05)
        {   
            //not normal
            if(variableList["independent"].length == 0)
            {
                //one sample t-test
                d3.select("#normality.crosses").attr("display", "inline");
                d3.select("#normality.loading").attr("display", "none");
        
                d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight*1.5);

                //draw boxplots in red 
                drawBoxPlotInRed(variableList["dependent"][0]);
                drawNormalityPlot(variableList["dependent"][0], "dataset", "notnormal");

                findTransformForNormalityForDependentVariables(getNumericVariables());
            }
            else
            {
                setDistribution(dependentVariable, level, false);
            }
        }
        else
        {   
            //normal
            if(variableList["independent"].length == 0)
            {
                d3.select("#normality.ticks").attr("display", "inline");
                d3.select("#normality.loading").attr("display", "none");
        
                drawDialogBoxToGetPopulationMean();
            }
            else
            {
                setDistribution(dependentVariable, level, true);
            }
        }
    });
        

    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//perform shapiro-wilk test (we combine all distributions here for efficiency)
function performNormalityTestForMultipleDistributions(distributions, n)
{
    // Get variable names and their data type        
    var variableList = getSelectedVariables();
    var dependentVariable = variableList["dependent"][0];
    var levels = variableList["independent-levels"];
        
    var req = ocpu.rpc("performShapiroWilkTestForMultipleDistributions", 
    {
        distributions: distributions,
        n: n
    }, function(output) 
    {                                                                     
        var pValues = output.p;

        for(var i=0; i<pValues.length; i++)
        {    
            if(pValues[i] < 0.05)
            {   
                //not normal
                if(variableList["independent"].length == 0)
                {
                    //one sample t-test
                    d3.select("#normality.crosses").attr("display", "inline");
                    d3.select("#normality.loading").attr("display", "none");
        
                    d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight*1.5);

                    //draw boxplots in red 
                    drawBoxPlotInRed(variableList["dependent"][0]);
                    drawNormalityPlot(variableList["dependent"][0], "dataset", "notnormal");

                    findTransformForNormalityForDependentVariables(getNumericVariables());
                }
                else
                {
                    setDistribution(dependentVariable, levels[i], false);
                }
            }
            else
            {   
                //normal
                if(variableList["independent"].length == 0)
                {
                    d3.select("#normality.ticks").attr("display", "inline");
                    d3.select("#normality.loading").attr("display", "none");
        
                    drawDialogBoxToGetPopulationMean();
                }
                else
                {
                    setDistribution(dependentVariable, levels[i], true);
                }
            }
        }
    });        

    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}    

//TODO: mauchly's test for sphericity, p < 0.05 => not spheric.
function performSphericityTest()
{
    var variableList = getSelectedVariables();
    
    // Get variable names and their data type
    var req = ocpu.rpc("performSphericityTest", 
    {
        dependentVariable: variableList["dependent"][0],
        withinGroupVariable: getWithinGroupVariable(variableList),
        betweenGroupVariable: getBetweenGroupVariable(variableList),
        participantVariable: participants,
        dataset: dataset
    }, function(output)
    {                                                   
                  
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
      alert("Server error: " + req.responseText);
    });    
}

//finds if there is a possible transformation to normality distributions
function findTransformForNormality(dependentVariable, independentVariable)
{       
    // Get variable names and their data type
    var req = ocpu.rpc("findTransformForNormality", 
    {
        dependentVariable: dependentVariable,
        independentVariable: independentVariable,
        dataset: dataset
    }, function(output) 
    {                                                       
        var variableList = getSelectedVariables();
    
        if(output.type == "none")
        {
            console.log("Transformation to normality is not possible!");
            d3.select("#plotCanvas").transition().delay(2500).duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
            
            if(variableList["independent"].length == 1)
            {
                if((experimentalDesign == "within-groups") && (variableList["independent"][0] == getWithinGroupVariable(variableList)))
                {
                    //within-group design
                    if(variableList["independent-levels"].length == 2)
                    {
                        //wilcoxon signed-rank
                        if(pairwiseComparisons)
                            performPairwiseWilcoxTest("TRUE", "TRUE");
                        else
                            performWilcoxonTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]]);
                    }
                    else
                    {   
                        //Friedman's test
                        performFriedmanTest(dependentVariable, independentVariable);
                    }
                }                       
                else if(d3.select("#homogeneity.ticks").attr("display") == "inline")
                {
                    //between-groups design
                    if(variableList["independent-levels"].length == 2)
                    {
                        //Mann-Whitney U test
                        if(pairwiseComparisons)
                            performPairwiseWilcoxTest("TRUE", "FALSE");
                        else
                            performMannWhitneyTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]]);
                    }
                    else
                    {   
                        //Kruskal-Wallis test
                        performKruskalWallisTest(dependentVariable, independentVariable);
                    }
                }
            }      
            else if(variableList["independent"].length == 2)
            {
                if((experimentalDesign == "within-groups") && (variableList["independent"][0] == getWithinGroupVariable(variableList)))
                {
                    //within-group design
                
                }                       
                else if(d3.select("#homogeneity.ticks").attr("display") == "inline")
                {
                    //between-groups design
                    if(variableList["independent-levels"].length == 2)
                    {
                        var groups = getGroupsForColourBoxPlotData();
                        //Mann-Whitney U test
                        if(pairwiseComparisons)
                            performPairwiseWilcoxTest("TRUE", "FALSE");
                        else
                            performMannWhitneyTest(groups[0], groups[1]);
                    }                            
                }
            }
            d3.select("#plotCanvas").transition().delay(3000).duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
        }
        else
        {
            console.log("Transformation type = " + output.type);
            transformationType = output.type;
        
            //offer choice
            drawButtonInSideBar("TRANSFORM TO NORMAL DISTRIBUTIONS", "transformToNormal");
        }                  
    })
      
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}
    
//finds if there is a possible transformation to homogeneity of distributions    
function findTransformForHomogeneity(dependentVariable, independentVariable)
{ 
    // Get variable names and their data type
    var req = ocpu.rpc("findTransformForHomogeneity", 
    {
        dependentVariable: dependentVariable,
        independentVariable: independentVariable,
        dataset: dataset
    }, function(output) 
    {                                                   
        var variableList = getSelectedVariables();
    
        if(output.type == "none")
        {
            console.log("Transformation to homogeneity is not possible!");
        
            d3.select("#homogeneity.crosses").attr("display", "inline"); 
            d3.select("#homogeneity.loading").attr("display", "none"); 
        
            d3.select("#plotCanvas").transition().delay(3000).duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
                            
            if(variableList["independent"].length == 1)
            {
                if(experimentalDesign == "between-groups")
                {
                    performNormalityTests();
            
                    //between-groups design
                    if(variableList["independent-levels"].length == 2)
                    {
                        //2 variables
                        if(pairwiseComparisons)
                            performPairwiseTTest("FALSE", "FALSE");
                        else
                            performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "FALSE", "FALSE");
                    }
                    else
                    {
                        //> 2 variables
                        performWelchANOVA(variableList["dependent"][0], variableList["independent"][0]);
                    }                
                }
            }
            else
            {
                if(experimentalDesign == "between-groups")
                {
                    performNormalityTests();
                    
                    //between-groups design
                    if(variableList["independent-levels"].length == 2)
                    {
                        //2 variables
                        var groups = getGroupsForColourBoxPlotData();
                    
                        if(pairwiseComparisons)
                            performPairwiseTTest("FALSE", "FALSE");
                        else
                            performTTest(groups[0], groups[1], "FALSE", "FALSE");
                    }
                    
                }
            }
        }                
        else
        {
            console.log("Transformation type = " + output.type);
            transformationType = output.type;
        
            //offer choice
            drawButtonInSideBar("TRANSFORM TO HOMOGENEOUS DISTRIBUTIONS", "transformToHomogeneity");
        }                  
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//applies a transform to distributions
function applyNormalityTransform(dependentVariable, level, finalVariable)
{    
    var req = ocpu.rpc("applyTransform", 
    {
        distribution: variables[dependentVariable][level],
        type: transformationType
    }, function(output) 
    {
        variables[dependentVariable][level] = output.transformedData;

        MIN[dependentVariable][level] = Array.min(output.transformedData);
        MAX[dependentVariable][level] = Array.max(output.transformedData);
        IQR[dependentVariable][level] = findIQR(output.transformedData);
        CI[dependentVariable][level] = findCI(output.transformedData);
    })    
    if(finalVariable)
    {
        //if this is the last variable, then redraw boxplots and display the significance test results
        redrawBoxPlot();
        
        removeElementsByClassName("densityCurve");
        
        var variableList = getSelectedVariables();
        
        if(variableList["independent"].length > 0)
        {
            for(var i=0; i<variableList["independent-levels"].length; i++)
            {                   
                var centerX = d3.select("#" + variableList["independent-levels"][i] + ".means").attr("cx");                
                makeHistogramWithDensityCurve(centerX - normalityPlotWidth/2, canvasHeight + normalityPlotOffset, normalityPlotWidth, normalityPlotHeight, variableList["dependent"][0], variableList["independent-levels"][i], "normal");//left, top, histWidth, histHeight, dependentVariable, level;                                
            }                 
        }
        else
        {
            makeHistogramWithDensityCurve(centerX - normalityPlotWidth/2, canvasHeight + normalityPlotOffset, normalityPlotWidth, normalityPlotHeight, variableList["dependent"][0], "dataset", "normal");
        }
        
        removeElementsByClassName("transformToNormal");
        removeElementsByClassName("completeLines");
        
        //change the labels to normal color
        var text = d3.select("#" + level + ".xAxisGrooveText");
        text.attr("fill", boxColors["normal"]);
        
        //modify the assumptions checklist icons
        d3.select("#normality.crosses").attr("display", "none");  
        d3.select("#normality.ticks").attr("display", "inline");  
        d3.select("#normality.loading").attr("display", "none");                                        
        
        d3.select("#plotCanvas").transition().delay(2000).duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
        
        setTimeout(function()
        {
            if(variableList["independent"].length == 1)
            {
                if((experimentalDesign == "within-groups") && (variableList["independent"][0] == getWithinGroupVariable(variableList)))
                {
                    //within-group design
                    if(variableList["independent-levels"].length == 2)
                    {
                        //Paired T-test
                        performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "TRUE", "TRUE");
                    }
                    else
                    {   
                        //One-way repeated measures ANOVA
                        performOneWayRepeatedMeasuresANOVA(variableList["dependent"][0], variableList["independent"][0]);
                    }
                }
                else
                {
                    //between-group design
                    if(d3.select("#homogeneity.ticks").attr("display") == "inline")
                    {
                        //only if homogeneous
                        if(variableList["independent-levels"].length == 2)
                        {
                            //2 variables
                            performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "TRUE", "FALSE");
                        }
                        else
                        {
                            //> 2 variables
                            performOneWayRepeatedMeasuresANOVA(variableList["dependent"][0], variableList["independent"][0]);
                        }
                    }
                }
            }
            else if(variableList["independent"].length == 2)
            {
                if((experimentalDesign == "within-groups") && (variableList["independent"][0] == getWithinGroupVariable(variableList)))
                {
                    //within-group design
                    
                }
                else
                {
                    //between-group design
                    if(d3.select("#homogeneity.ticks").attr("display") == "inline")
                    {
                        //only if homogeneous
                        if(variableList["independent-levels"].length == 2)
                        {
                            var groups = getGroupsForColourBoxPlotData();
                            //Unpaired T-test 
                            
                            if(pairwiseComparisons)
                                performPairwiseTTest("TRUE", "FALSE");
                            else
                                performTTest(groups[0], groups[1], "TRUE", "FALSE");
                        }                                    
                    }
                }
            }
        }, 3000);
                
}

    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//applies a transform to distributions
function applyHomogeneityTransform(dependentVariable, independentVariable)
{
    // Get variable names and their data type
    var req = ocpu.rpc("applyTransform", 
    {
        distribution: variables[dependentVariable]["dataset"],
        type: transformationType
    }, function(output) 
    {                 
        variables[dependentVariable]["dataset"] = output.transformedData;            
    
        MIN[dependentVariable]["dataset"] = Array.min(output.transformedData);
        MAX[dependentVariable]["dataset"] = Array.max(output.transformedData);
        IQR[dependentVariable]["dataset"] = findIQR(output.transformedData);
        CI[dependentVariable]["dataset"] = findCI(output.transformedData);
    
        var levels = variables[independentVariable]["dataset"].unique();
    
        for(i=0; i<levels.length; i++)
        {
            variables[dependentVariable][levels[i]] = [];
            MIN[dependentVariable][levels[i]] = 999999;
            MAX[dependentVariable][levels[i]] = -999999;
        }
        
        subsetDataByLevels(independentVariable);
    
        //if this is the last variable, then redraw boxplots and display the significance test results
        redrawBoxPlot();

        removeElementsByClassName("homogeneityPlot");
        var variableList = getSelectedVariables();

        removeElementsByClassName("transformToHomogeneity");
        removeElementsByClassName("completeLines");

        //modify the assumptions checklist icons
        d3.select("#homogeneity.crosses").attr("display", "none");  
        d3.select("#homogeneity.ticks").attr("display", "inline");  
        d3.select("#homogeneity.loading").attr("display", "none");                                        

        d3.select("#plotCanvas").transition().delay(2000).duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);

        setTimeout(function()
        {
            if(variableList["independent"].length == 1)
            {
                if((experimentalDesign == "within-groups") && (variableList["independent"][0] == getWithinGroupVariable(variableList)))
                {
            
                }
                else
                {
                    //between-group design
                    performNormalityTests();       
                }
            }                            
        }, 3000);
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });      
}

//TODO: writes the list of tasks done to a file
function writeToFile(fileName)
{
    var req = ocpu.rpc("writeToFile", 
    {
        object: log,
        fileName: fileName
    }, function(output) 
    {
    
    })
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

var minX, maxX, minY, maxY;

// Scatterplot matrix
var shortAxesOffset, shortTickLength, shortDataPointRadius, shortNumberOfGrooves, shortTickTextOffsetXAxis, shortTickTextOffsetYAxis, shortYAxisTickTextOffset, shortFontSize;

function makeScatterplotMatrix()
{
    var variableList = sort(currentVariableSelection);
    
    removeElementsByClassName("regression");
    
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
        else
            removeElementsByClassName("regression");
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
    
    var uniqueDataX = dataX.unique().sort();
    var uniqueDataY = dataY.unique().sort();  

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
        Y1 = (slope*X1 + intercept) > maxY ? maxY : (parseFloat(slope*X1) + parseFloat(intercept));
        Y1 = (slope*X1 + intercept) < minY ? minY : (parseFloat(slope*X1) + parseFloat(intercept));
        Y2 = (slope*X2 + intercept) > maxY ? maxY : (parseFloat(slope*X2) + parseFloat(intercept));
        Y2 = (slope*X2 + intercept) < minY ? minY : (parseFloat(slope*X2) + parseFloat(intercept));
        
        x1 = x + convertToRange(X1, minX, maxX)*shortWidth;
        y1 = y - convertToRange(Y1, minY, maxY)*shortHeight;
    
        x2 = x + convertToRange(X2, minX, maxX)*shortWidth;
        y2 = y - convertToRange(Y2, minY, maxY)*shortHeight;    
    
        canvas.append("line")
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr("y2", y2)
                .attr("stroke", "#627bf4")
                .attr("stroke-width", "10px")
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
        axisText = dec2(minX + i*xSlice);
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
        axisText = dec2(minY + i*ySlice);
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
            X = x + convertToRange(dataX[i], minX, maxX)*shortWidth;
            
        if(isNaN(dataY[0]))
            Y = y - uniqueDataY.indexOf(dataY[i])*yStep - yStep/2;
        else
            Y = y - convertToRange(dataY[i], minY, maxY)*shortHeight;
            
        var color = "black";
        
        canvas.append("circle")
                    .attr("cx", X)
                    .attr("cy", Y)
                    .attr("r", shortDataPointRadius)
                    .attr("fill", color)                    
                    .attr("class", "points");     
    }
}

function convertToRange(number, min, max)
{
    return (number - min)/(max - min);
}
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
    // graphics
    LEFT = canvasWidth/2 - plotWidth/2;
    RIGHT = canvasWidth/2 + plotWidth/2;

    TOP = canvasHeight/2 - plotHeight/2 - topOffset;
    BOTTOM = canvasHeight/2 + plotHeight/2 - topOffset;

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

function getValue1(number, min, max)
{
    return (number - min)/(max - min);
}

function drawScatterPlotLegends(varNames)
{
    var canvas = d3.select("#sideBarCanvas");
    
    var yStep = plotHeight/10;
    
    for(var i=0; i<varNames.length; i++)
    {
        canvas.append("circle")
                .attr("cx", sideBarWidth/2)
                .attr("cy", TOP + histLegendOffsetY + i*yStep)
                .attr("r", datapointRadius)
                .attr("fill", colors[i])
                .attr("id", "legend" + i)
                .attr("class", "circles");
        
        canvas.append("text")
                .attr("x", sideBarWidth/2 + histLegendSize)
                .attr("y", TOP + histLegendOffsetY + i*yStep + 3)
                .attr("fill", "black")
                .attr("font-size", fontSizeTicks + "px")
                .attr("text-anchor", "start")
                .text(varNames[i])
                .attr("id", "legend" + i)
                .attr("class", "text");
            
    }
}

function drawRegressionLine(intercept, slope)
{
    var canvas = d3.select("#plotCanvas");
    canvas.attr("viewBox", "0 0 " + canvasWidth + " " + parseFloat(canvasHeight+scaleForWindowSize(400)));    
    
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

// Data
    var wd = "http://hci.rwth-aachen.de/~subramanian/datasets/" + sessionStorage.fileName + ".csv";
    var pathToFile =  wd;

// Skeleton
    var width = getWidth();
    var height = getHeight();  

    var panelColors = new Object();
        panelColors.normal = "#F5F5F5";
        panelColors.active = "#3957F1";

    var canvasHeight = height*(3/4);
    var canvasWidth = width*0.60; 
    
    var sideBarWidth = width*0.20;
    var bottomDivHeight = height/7;
    
    var loadingImageSize = scaleForWindowSize(100);

    // Variable panel
        var variableNameHolderPadding = scaleForWindowSize(15);
        var radius = variableNameHolderPadding + "px";
        var variableNameHolderHeight = scaleForWindowSize(60); // TODO: Find this dynamically based on number of variable names (50 is the maximum), do this for font-size as well
        var variableSelectionButtonWidth = scaleForWindowSize(60);
        var variableTypeSelectionButtonWidth = scaleForWindowSize(135);
        
        var flagImageSize = scaleForWindowSize(45);
        
        var variablePanelColors = new Object();
            variablePanelColors["active"] = "lightgrey";
            variablePanelColors["disabled"] = "darkgrey";
        
        var variableTypeButtonColors = new Object();
            variableTypeButtonColors["dependent"] = new Object();
                variableTypeButtonColors["dependent"]["normal"] = "Linen";
                variableTypeButtonColors["dependent"]["selected"] = "SaddleBrown";
            
            variableTypeButtonColors["independent"] = new Object();
                variableTypeButtonColors["independent"]["normal"] = "Linen";
                variableTypeButtonColors["independent"]["selected"] = "CornflowerBlue";
            
            variableTypeButtonColors["participant"] = "SaddleBrown";
        
        var variableTypeTextColors = new Object();
            variableTypeTextColors["dependent"] = new Object();
                variableTypeTextColors["dependent"]["normal"] = "black";
                variableTypeTextColors["dependent"]["selected"] = "white";
            
            variableTypeTextColors["independent"] = new Object();
                variableTypeTextColors["independent"]["normal"] = "black";
                variableTypeTextColors["independent"]["selected"] = "white";
            
            variableTypeTextColors["participant"] = "white";

    // Visualisation panel
        var visualisationImageSize = scaleForWindowSize(200);  

// Displaying Data
    var displayDataLimit = 20;
    var rangeToFade = 3*displayDataLimit/5;
    var fontSizeForDisplayDataTitle = scaleForWindowSize(36);
    var fontSizeForDisplayDataTableElements = scaleForWindowSize(20);
    var fontSizeLabels = scaleForWindowSize(16);
    var fontSizeTicks = scaleForWindowSize(12);
    var fontSizeAssumptions = scaleForWindowSize(20);
    var fontSizeAssumptionsTitle = scaleForWindowSize(26);
    var fontSizeVariablePanel = scaleForWindowSize(20);
    var fontSizeVisualisationPanel = scaleForWindowSize(32);
    var fontSizeSignificanceTestResults = scaleForWindowSize(18);    
    var fontSizeButtonLabel = scaleForWindowSize(12);
    
// Plots (general)
    var axesOffset = scaleForWindowSize(25); //distance from plots to axes (for an R-like appearance)
    var tickTextOffsetXAxis = 25;
    var tickTextOffsetYAxis = 10;
    var yAxisTickTextOffset = 6;
    var fontSize = scaleForWindowSize(14);
    var tickLength = scaleForWindowSize(10);
    var border = scaleForWindowSize(20);

    var plotHeight = canvasHeight - 2*(axesOffset + tickTextOffsetXAxis + border);
    var plotWidth = 4*plotHeight/3;
    
    var displayOffsetTop = scaleForWindowSize(10);
    var displayOffsetBottom = scaleForWindowSize(25);

// Buttons
var buttonColors = new Object();   
//     "url(#buttonFillNormal)" = "LightSkyBlue";
    buttonColors["hover"] = "lightgrey";
    buttonColors["click"] = "BlanchedAlmond";

//Define colors for histogram bars, color scatterplot
var colors = ["#E6A960", "#D3E55F", "#5EA9D1", "#664E33", "#C45AD2", "#211F7C", "#479ED6", "#710012", "#F0DE4F", "#A5A5F6"];

var meanColors = new Object(); //Colors for mean, and ?
    meanColors["normal"] = "#374593";
    meanColors["hover"] = "#99ff33";
    meanColors["click"] = "#729e38";

// Histogram
var nBins = 6; 
var binCountFontSize = "16px";
var histLegendOffsetX = scaleForWindowSize(45);
var histLegendOffsetY = scaleForWindowSize(45);
var histLegendSize = scaleForWindowSize(35);
var histDistanceBetweenLegendAndText = scaleForWindowSize(15);


// Boxplots
    var boxWidth = scaleForWindowSize(75);
    var intervals = new Object(); //for keeping track of animations
    var meanRadius = scaleForWindowSize(5) < 5 ? 5 : scaleForWindowSize(5);
    var engorgedMeanRadius = scaleForWindowSize(10) < 7 ? 7 : scaleForWindowSize(10);
    var outlierRadius = 2;

    var boxColors = new Object();
        boxColors["normal"] = "#fff7e7";
        boxColors["notnormal"] = "#ff3d00";

    var CIFringeLength = scaleForWindowSize(5);

// Scatterplot
var datapointRadius = scaleForWindowSize(4);
var numberOfGrooves = 10;
var topOffset = scaleForWindowSize(25);
var labelOffset = scaleForWindowSize(45);

// Significance test
var significanceTestScaleOffset = scaleForWindowSize(25);

var assumptionStep = scaleForWindowSize(55);
var assumptionOffsetTop = assumptionStep*3.5;
var assumptionImageSize = scaleForWindowSize(35);

var assumptionsText = new Object();
    assumptionsText["normality"] = "Normality of distributions";
    assumptionsText["homogeneity"] = "Homogeneity of variances";
    assumptionsText["sphericity"] = "Sphericity of distributions";
    
var helpButtonHeight = scaleForWindowSize(60);
    var helpButtonWidth = scaleForWindowSize(60);
    
    var helpButtonOffset = assumptionImageSize;
    
var assumptions = new Object();
assumptions["one-sample tests"] = ["normality"];
assumptions["normal"] = ["normality", "homogeneity"];
assumptions["repeated measures"] = ["normality", "homogeneity"];//["normality", "homogeneity", "sphericity"];

var significanceTestResultStep = scaleForWindowSize(37);
var significanceTestResultOffsetTop = canvasHeight/2 + scaleForWindowSize(40);

var effectSizeWidth = sideBarWidth*0.8;
var effectSizeHeight = scaleForWindowSize(30);
var effectSizeFontSize = scaleForWindowSize(16) + "px";

var computingResultsImageSize = scaleForWindowSize(75);

var selectionButtonWidth = scaleForWindowSize(200);
var selectionButtonHeight = scaleForWindowSize(50);
var selectionButtonOffset = scaleForWindowSize(15);

//transformation
var normalityPlotWidth = scaleForWindowSize(125);
var normalityPlotHeight = normalityPlotWidth*(3/4);
var normalityPlotOffset = scaleForWindowSize(75); //from canvasHeight
var boxPlotTransformationDuration = 700;

var sampleSizeCutoff = 20;

//buttons
var buttonOffset = scaleForWindowSize(150);//assumptionOffsetTop + 2*assumptionStep;
var buttonHeight = scaleForWindowSize(50);
var buttonWidth = sideBarWidth;
var buttonPadding = assumptionStep;

//full screen button
var fullScreenButtonSize = scaleForWindowSize(75);
var fullScreenButtonOffset = scaleForWindowSize(10);

//Regression
var viewBoxXForRegressionLine = -scaleForWindowSize(300);
var viewBoxYForRegressionLine = -scaleForWindowSize(200);

var viewBoxWidthForRegressionLine = canvasWidth+scaleForWindowSize(750);
var viewBoxHeightForRegressionLine = viewBoxWidthForRegressionLine/2;


//unpaired t-test, paired t-test, and welch's t-test
function performTTest(groupA, groupB, varianceEqual, paired) 
{
    console.log("t-test :)");
    var variableList = getSelectedVariables();    
    
    // Get variable names and their data type
    var req = ocpu.rpc("performTTest", 
    {
        groupA: groupA,
        groupB: groupB,
        variance: varianceEqual,
        paired: paired
    }, function(output) 
    {
        testResults["df"] = output.DOF;

        testResults["parameter"] = output.t;
        testResults["parameter-type"] = "t";

        testResults["error"] = output.error;

        if(varianceEqual == "FALSE")
        {
            testResults["test-type"] = "WT";
        }
        else
        {
            if(paired == "TRUE")
                testResults["test-type"] = "pT";
            else
                testResults["test-type"] = "upT";
        }


        testResults["p"] = changePValueNotation(output.p); 

        var method = "";
        if(paired == "TRUE")
        {
            method = "Paired T-test";  
        }
        else
        {
            if(varianceEqual == "TRUE")
            {
                method = "Unpaired T-test";
            }
            else
            {
                method = "Welch's T-test";
            }
        }
        console.log("\n Method = \"" + method + "\"");

        testResults["method"] = method;

        testResults["effect-size"] = output.d;
        testResults["effect-size-type"] = "d";
        testResults["formula"] = variableList["independent-levels"][0] + "." + variableList["dependent"][0] + " vs " + variableList["independent-levels"][1] + "." + variableList["dependent"][0];
        //add to log
        logResult();

        //drawing stuff
        removeElementsByClassName("completeLines");

        displaySignificanceTestResults();
        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//perform mann-whitney test (unpaired t-test's alternative)
function performMannWhitneyTest(groupA, groupB)
{
    var variableList = getSelectedVariables();
    
    var req = ocpu.rpc("performMannWhitneyTest", 
    {
        groupA: groupA,
        groupB: groupB
    }, function(output) 
    {                                                   
        testResults["parameter"] = output.U;
        testResults["parameter-type"] = "U";

        testResults["test-type"] = "mwT";
        testResults["error"] = output.error;
        testResults["p"] = changePValueNotation(output.p);                  
        testResults["effect-size"] = output.r;
        testResults["method"] = "Mann-Whitney U test";
        testResults["effect-size-type"] = "r";
        testResults["formula"] = variableList["independent-levels"][0] + "." + variableList["dependent"][0] + " vs " + variableList["independent-levels"][1] + "." + variableList["dependent"][0];

        logResult();

        //drawing stuff
        removeElementsByClassName("completeLines");           

        displaySignificanceTestResults();                      
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

function performWilcoxonTest(groupA, groupB)
{
    var variableList = getSelectedVariables();
   
    // Get variable names and their data type
    var req = ocpu.rpc("performWilcoxonTest", 
    {
        groupA: groupA,
        groupB: groupB
    }, function(output) 
    {                       
        testResults["parameter"] = output.V;
        testResults["parameter-type"] = "V";
    
        testResults["test-type"] = "wT";
        testResults["error"] = output.error;
        
        
        testResults["p"] = changePValueNotation(output.p);                  
        testResults["effect-size"] = output.r;
        testResults["method"] = "Wilcoxon Signed-rank test";
        testResults["effect-size-type"] = "r";
        testResults["formula"] = variableList["independent-levels"][0] + "." + variableList["dependent"][0] + " vs " + variableList["independent-levels"][1] + "." + variableList["dependent"][0];
        
        logResult();                  
      
        //drawing stuff
        removeElementsByClassName("completeLines");           

        displaySignificanceTestResults();                     
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//perform one-way ANOVA
function performOneWayANOVA(dependentVariable, independentVariable)
{
    var variableList = getSelectedVariables();  
    
    // Get variable names and their data type
    var req = ocpu.rpc("performOneWayANOVA", 
    {                    
        dependentVariable: dependentVariable,
        independentVariable: independentVariable,
        participantVariable: participants,
        dataset: dataset,
    }, function(output) 
    {                                                                                        
        testResults["df"] = output.numDF + ", " + output.denomDF;

        testResults["test-type"] = "owA";

        testResults["parameter"] = output.F;
        testResults["parameter-type"] = "F";
        testResults["error"] = output.error;

        testResults["p"] = changePValueNotation(output.p);   
        testResults["method"] = "1-way ANOVA"; //todo
        testResults["effect-size"] = output.etaSquared;
        testResults["effect-size-type"] = "eS";
        testResults["formula"] = variableList["dependent"][0] + " ~ " + variableList["independent"][0] + "(" + variableList["independent-levels"] + ")";
    
        logResult();                           
    
        //drawing stuff
        removeElementsByClassName("completeLines");           

        displaySignificanceTestResults();      
        drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc");
        drawButtonInSideBar("TUKEY'S HSD", "tukeyHSD",1);        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//perform Welch's ANOVA(non-parametric alternative for one-way ANOVA)
function performWelchANOVA(dependentVariable, independentVariable)
{
    // Get variable names and their data type
    var req = ocpu.rpc("performWelchANOVA", 
    {
        dependentVariable: dependentVariable,
        independentVariable: independentVariable,
        dataset: dataset                   
    }, function(output) 
    {                                                   
        testResults["df"] = output.numeratorDF + "," + output.denominatorDF;
    
        testResults["parameter"] = output.F;
        testResults["parameter-type"] = "F";
        testResults["test-type"] = "WA";

        testResults["error"] = output.error;
    
        testResults["p"] = changePValueNotation(output.p);
        testResults["method"] = "Welch's ANOVA"; 
        testResults["effect-size"] = output.etaSquared;
        testResults["effect-size-type"] = "eS";
        testResults["formula"] = dependentVariable + " ~ " + independentVariable;
        
        logResult();       
      
        //drawing stuff
        removeElementsByClassName("completeLines"); 
    
        displaySignificanceTestResults();
        drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc");          
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//perform Kruskal-Wallis test(non-parametric alternative for one-way ANOVA)
function performKruskalWallisTest(dependentVariable, independentVariable)
{
    console.log("dependentVariable: " + dependentVariable + ", independentVariable: " + independentVariable);
    // Get variable names and their data type
    var req = ocpu.rpc("performKruskalWallisTest", 
    {
        dependentVariable: dependentVariable,
        independentVariable: independentVariable,
        dataset: dataset                   
    }, function(output) 
    {                                                                      
        testResults["df"] = output.DF; 

        testResults["parameter"] = output.ChiSquared;
        testResults["parameter-type"] = "cS";
        testResults["test-type"] = "kwT";

        testResults["error"] = output.error;

        testResults["p"] = changePValueNotation(output.p);                  
        testResults["method"] = "Kruskal-Wallis test"; 
        testResults["effect-size"] = output.etaSquared;         
        testResults["effect-size-type"] = "eS";
        testResults["formula"] = dependentVariable + " ~ " + independentVariable;

        logResult();
        //drawing stuff
        removeElementsByClassName("completeLines");   

        displaySignificanceTestResults();
        drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc");
        drawButtonInSideBar("TUKEY'S HSD", "tukeyHSD",1);        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//perform two-way ANOVA
function performTwoWayANOVA(dependentVariable, betweenGroupVariableA, betweenGroupVariableB)
{
    var variableList = getSelectedVariables();
    
    // Get variable names and their data type
    var req = ocpu.rpc("performTwoWayANOVA", 
    {   
        dataset: dataset, 
        dependentVariable: dependentVariable,
        participantVariable: participants,
        betweenGroupVariableA: betweenGroupVariableA,
        betweenGroupVariableB: betweenGroupVariableB
    }, function(output) 
    {                                                   
        testResults["df"] = [];
        testResults["p"] = output.p;   
  
        for(var i=0; i<(output.numDF).length; i++)
        {
          testResults["df"].push((output.numDF)[i] + ", " + (output.denomDF)[i]);
          testResults["p"][i] = changePValueNotation(testResults["p"][i]);
        }
  
        testResults["parameter"] = output.F;
        testResults["parameter-type"] = "F";                 
        
        testResults["error"] = output.error;
                 
        testResults["test-type"] = "twA";
    
        testResults["method"] = "2-way ANOVA"; //todo
        testResults["effect-size"] = output.etaSquared;
        testResults["effect-size-type"] = "eS";
        testResults["formula"] = dependentVariable + " ~ " + betweenGroupVariableA + " + " + betweenGroupVariableB + " +  " + betweenGroupVariableA + "*" + betweenGroupVariableB;
  
        logResult();
           
        drawButtonInSideBar("INTERACTION EFFECT", "interactionEffect");               
        removeElementsByClassName("completeLines");           
    
        displayANOVAResults();  
        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//perform one-way repeated-measures ANOVA
function performOneWayRepeatedMeasuresANOVA(dependentVariable, independentVariable)
{
    var variableList = getSelectedVariables();
    
    var req = ocpu.rpc("performOneWayRepeatedMeasuresANOVA", 
    {
        dependentVariable: dependentVariable,
        independentVariable: independentVariable,
        participantVariable: participants,
        dataset: dataset
    }, function(output) 
    {                                                   
        testResults["df"] = output.numDF + ", " + output.denomDF;

        testResults["parameter"] = output.F;
        testResults["parameter-type"] = "F";
    
        testResults["error"] = output.error;

        testResults["test-type"] = "owrA";

        testResults["method"] = "Repeated-measures ANOVA"; //todo
        testResults["effect-size"] = output.etaSquared;
        testResults["p"] = changePValueNotation(output.p);
        testResults["effect-size-type"] = "eS";
        testResults["formula"] = dependentVariable + " ~ " + independentVariable + " + Error(" + participants + "/" + independentVariable;
    
        logResult();
  
        //drawing stuff
        removeElementsByClassName("completeLines");

        displaySignificanceTestResults();               
        drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc");
        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//perform Friedman's test (non-parametric alternative for one-way repeated-measures ANOVA)
function performFriedmanTest(dependentVariable, independentVariable)
{
    var req = ocpu.rpc("performFriedmanTest", 
    {
        dependentVariable: dependentVariable,
        independentVariable: independentVariable,
        participantVariable: participants,
        filePath: pathToFile
    }, function(output) 
    {                                                   
        testResults["df"] = output.df;

        testResults["parameter"] = output.chiSquared;
        testResults["parameter-type"] = "cS";

        testResults["test-type"] = "fT";
        testResults["error"] = output.error;

        testResults["method"] = "Friedman's Analysis";
        testResults["p"] = changePValueNotation(output.p);
        testResults["effect-size"] = output.etaSquared;
        testResults["effect-size-type"] = "eS";       
        testResults["formula"] = dependentVariable + " ~ " + independentVariable + " + Error(" + participants + "/" + independentVariable;

        logResult();

        //drawing stuff
        removeElementsByClassName("completeLines");           

        displaySignificanceTestResults();   
        drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc");  
        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//perform mixed-design ANOVA
function performMixedDesignANOVA(dependentVariable, withinGroupVariable, betweenGroupVariable)
{  
    var req = ocpu.rpc("performMixedDesignANOVA", 
    {
        dependentVariable: dependentVariable,
        withinGroupVariable: withinGroupVariable,
        betweenGroupVariable: betweenGroupVariable,
        participantVariable: participants,
        dataset: dataset
    }, function(output) 
    {                                                   
        testResults["df"] = [];
        testResults["p"] = output.p;
        testResults["error"] = output.error;

        for(var i=0; i<(output.numDF).length; i++)
        {
        testResults["df"].push((output.numDF)[i] + ", " + (output.denomDF)[i]);
        testResults["p"][i] = changePValueNotation(testResults["p"][i]);
        }

        testResults["parameter"] = output.F;
        testResults["parameter-type"] = "F";

        testResults["test-type"] = "fA";

        testResults["method"] = "Mixed-design ANOVA"; //todo
        testResults["effect-size"] = output.etaSquared;

        testResults["effect-size-type"] = "eS";
        testResults["formula"] = dependentVariable + " ~ " + betweenGroupVariable + " + Error(" + participants + "/" + withinGroupVariable;

        logResult();

        drawButtonInSideBar("INTERACTION EFFECT", "interactionEffect");               

        //drawing stuff
        removeElementsByClassName("completeLines");
        displayANOVAResults();                 
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//find interaction effect (two-way ANOVA, mixed-design ANOVA)
function findInteractionEffect(dependentVariable, independentVariables)
{   
    independentVariables = independentVariables.sort();
    
    var req = ocpu.rpc("findInteractionEffect", 
    {
        dependentVariable: dependentVariable,
        independentVariables: independentVariables,                    
        dataset: dataset
    }, function(output) 
    {                                                   
        var variableList = getSelectedVariables();
    
        var levelsA = variables[variableList["independent"][0]]["dataset"].unique().slice().sort();
        var levelsB = variables[variableList["independent"][1]]["dataset"].unique().slice().sort();

        interactions = output.fit;
        resetSVGCanvas();
        drawFullScreenButton();

        drawInteractionEffectPlot();
        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

function performTukeyHSDTestOneIndependentVariable(dependentVariable, independentVariable)
{ 
    var req = ocpu.rpc("performTukeyHSDTestOneIndependentVariable", 
    {
        dependentVariable: dependentVariable,
        independentVariable: independentVariable,
        dataset: dataset
    }, function(output) 
    {                                                   
        localStorage.setItem((label + "tkMin"), Array.min(output.lower));
        localStorage.setItem((label + "tkMax"), Array.max(output.upper));
        
        //get levels of the independent variable
        var levels = variables[independentVariable]["dataset"].unique().slice();
        //sort it
        levels = levels.sort();
        var index = 0;
    
        for(i=0; i<levels.length; i++)
        {
            tukeyResults[levels[i]] = new Object();
            for(j=i+1; j<levels.length; j++)
            {
                if(tukeyResults[levels[j]] == undefined)
                    tukeyResults[levels[j]] = new Object();
                if(i != j)
                {
                    tukeyResults[levels[i]][levels[j]] = new Object();                                
                    tukeyResults[levels[j]][levels[i]] = new Object();
                
                    tukeyResults[levels[j]][levels[i]]["difference"] = output.difference[index];
                    tukeyResults[levels[j]][levels[i]]["lower"] = output.lower[index];
                    tukeyResults[levels[j]][levels[i]]["upper"] = output.upper[index];
                    tukeyResults[levels[j]][levels[i]]["p"] = output.adjustedP[index];
                
                    tukeyResults[levels[i]][levels[j]]["difference"] = output.difference[index];
                    tukeyResults[levels[i]][levels[j]]["lower"] = output.lower[index];
                    tukeyResults[levels[i]][levels[j]]["upper"] = output.upper[index];
                    tukeyResults[levels[i]][levels[j]]["p"] = output.adjustedP[index++];
                }
            }
        }
    
        resetSVGCanvas();
        drawFullScreenButton();

        drawTukeyHSDPlot();        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

// function performTukeyHSDTestTwoIndependentVariables(dependentVariable, independentVariableA, independentVariableB)
// { 
//     var req = ocpu.rpc("performTukeyHSDTestTwoIndependentVariables", {
//                     dependentVariable: dependentVariable,
//                     independentVariableA: independentVariableA,
//                     independentVariableB: independentVariableB,
//                     dataset: dataset
//                   }, function(output) {   
//                     console.log("TukeyHSD test for " + dependentVariable + " ~ " + independentVariableA + " + " + independentVariableB);
//                     
//                     console.log(output.difference);
//                     console.log(output.lower);
//                     console.log(output.upper);
//                     console.log(output.adjustedP);
//             
//                 //drawing stuff
//                 removeElementsByClassName("completeLines");   
//                 
//                 resetSVGCanvas();
// //                 drawTukeyHSDPlot();
//                 
// //                 displaySignificanceTestResults();
//         
//       }).fail(function(){
//           alert("Failure: " + req.responseText);
//     });
// 
//     //if R returns an error, alert the error message
//     req.fail(function(){
//       alert("Server error: " + req.responseText);
//     });
//     req.complete(function(){
//         
//     });
// }

//POST-HOC TESTS

//perform pairwise t-tests
function performPairwiseTTest(varianceEqual, paired) 
{    
    var variableList = getSelectedVariables();
    
    var req = ocpu.rpc("performPairwiseTTest", 
    {
        dependentVariable: variables[variableList["dependent"][0]]["dataset"],
        independentVariable: variables[variableList["independent"][0]]["dataset"],                    
        dataset: dataset,
        varianceEqual: varianceEqual,
        paired: paired,
        independentVariableName: variableList["independent"][0], 
        dependentVariableName: variableList["dependent"][0], 
        levelA: variableList["independent-levels"][0],
        levelB: variableList["independent-levels"][1]
    }, function(output) 
    {     
        testResults["parameter"] = output.t;
        testResults["parameter-type"] = "t";

        testResults["p"] = changePValueNotation(output.p); 
        testResults["method"] = "Pairwise T-test (Bonf.)";
        testResults["effect-size"] = output.d;
        testResults["effect-size-type"] = "d";
        testResults["test-type"] = "ptT";
    
        testResults["error"] = output.error;
    
        logResult();
        //drawing stuff
        removeElementsByClassName("completeLines");

        displaySignificanceTestResults();
        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//perform pairwise wilcox-tests (non-parametric alternative for pairwise t-tests)
function performPairwiseWilcoxTest(varianceEqual, paired) //groupA, groupB, paired = "FALSE", alternative = "two.sided", alpha = 0.95, var = "FALSE"
{
    var variableList = getSelectedVariables();
    
    var req = ocpu.rpc("performPairwiseWilcoxTest", 
    {
        dependentVariable: variables[variableList["dependent"][0]]["dataset"],
        independentVariable: variables[variableList["independent"][0]]["dataset"],                    
        dataset: dataset,
        varianceEqual: varianceEqual,
        paired: paired,
        independentVariableName: variableList["independent"][0], 
        dependentVariableName: variableList["dependent"][0], 
        levelA: variableList["independent-levels"][0],
        levelB: variableList["independent-levels"][1]
    }, function(output) 
    {         
        testResults["parameter"] = output.U;
        testResults["parameter-type"] = paired == "FALSE" ? "U" : "W";

        testResults["p"] = changePValueNotation(output.p);                  
        testResults["effect-size"] = output.r;
        testResults["method"] = "Pairwise Wilcoxon-test (Bonf.)";
        testResults["test-type"] = "pwT";
        testResults["effect-size-type"] = "r";                  

        testResults["error"] = output.error;
        
        logResult();
        //drawing stuff
        removeElementsByClassName("completeLines");           

        displaySignificanceTestResults(); 
        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

var parameterTypes = ["t", "V", "U", "F", "cS"];

var hasDF = new Object();
    hasDF["t"] = true;
    hasDF["V"] = false;
    hasDF["U"] = false;
    hasDF["F"] = true;
    hasDF["cS"] = true;

    function compareMeans()
{    
    var completeLines = d3.selectAll(".completeLines");
    var variableList = getSelectedVariables();  
    
    removeElementsByClassName("selectAll");
    removeElementsByClassName("selectNone");
    
    drawComputingResultsImage();
    
    switch(document.getElementsByClassName("completeLines").length)
    {

        case 0:
                //One sample t-test
                if(variableList["dependent"].length == 1)
                {
                    loadAssumptionCheckList("one-sample tests");
                    
                    setTimeout(function(){                    
                        performNormalityTest(variables[variableList["dependent"][0]]["dataset"], variableList["dependent"][0], "dataset");                    
                    }, 1300);
                }
                
                break;
        case 1:
                //T-test
                {
                    console.log("\t Significance test for 2 variables\n\n");

                    //homoscedasticity
                    loadAssumptionCheckList("normal");
                    
                    switch(variableList["independent"].length)
                    {
                        case 0:
                                {                            
                                    break;
                                }
                        case 1:
                                {
                                    if((experimentalDesign == "within-groups") && (getWithinGroupVariable(variableList) == variableList["independent"][0]))
                                    {
                                        //within-groups design
                                        performNormalityTests();
                                    }
                                    else
                                    {
                                        //between-groups design
                                        performHomoscedasticityTest(variableList["dependent"][0], variableList["independent"][0]);
                                    }            
                                    break;    
                                }
                        case 2:
                                {  
                                    //get distributions            
                                    performHomoscedasticityTests();
                                }
                    }
                    break;
                }
        
        default:
                //ANOVA
                {
                    console.log("\t Significance test for more than 2 variables\n\n");
                    
                    switch(variableList["independent"].length)
                    {
                        case 0:
                                {
                            
                                    break;
                                }
                        case 1:
                                {
                                    if((experimentalDesign == "within-groups") && (getWithinGroupVariable(variableList) == variableList["independent"][0]))
                                    {
                                        loadAssumptionCheckList("repeated measures");
                                        //within-groups design
                                        performNormalityTests();
                                    }
                                    else
                                    {
                                        loadAssumptionCheckList("normal");
                                        //between-groups design
                                        performHomoscedasticityTest(variableList["dependent"][0], variableList["independent"][0]);
                                    }            
                                    break;    
                                }
                        case 2:
                                {
                                    var selectedMeans = getSelectedMeansForColourBoxPlotData();
                                    var selectedMeanLevels = getSelectedMeanLevelsForColourBoxPlotData();
                
                                    var variableList = getSelectedVariables();                    
                                    var totalNumberOfLevels = variables[variableList["independent"][0]]["dataset"].unique().length * variables[variableList["independent"][1]]["dataset"].unique().length;
                
                                    if(selectedMeans.length < totalNumberOfLevels && selectedMeans.length != 2)
                                    {
                                        var unSelectedMeans = getUnselectedMeansForColourBoxPlotData();
                                        selectAllMeans();
                                        setTimeout(function()
                                        {
                                            performNormalityTests();
                                            performHomoscedasticityTests();
                                            
                                            if(isFactorialANOVA(variableList))
                                            {
                                                loadAssumptionCheckList("repeated measures");
                                                
                                                performMixedDesignANOVA(variableList["dependent"][0], getWithinGroupVariable(variableList), getBetweenGroupVariable(variableList));
                                            }
                                            else
                                            {
                                                loadAssumptionCheckList("normal");                    
                                                
                                                performTwoWayANOVA(variableList["dependent"][0], variableList["independent"][0], variableList["independent"][1]);
                                            }
                                        }, (unSelectedMeans.length+1)*1000);
                                    }
                                    else
                                    {
                                        performNormalityTests();
                                        performHomoscedasticityTests();
                                        
                                        if(isFactorialANOVA(variableList))
                                        {
                                            loadAssumptionCheckList("repeated measures");
                                            
                                            performMixedDesignANOVA(variableList["dependent"][0], getWithinGroupVariable(variableList), getBetweenGroupVariable(variableList));
                                        }
                                        else
                                        {
                                            loadAssumptionCheckList("normal");                    
                                            
                                            performTwoWayANOVA(variableList["dependent"][0], variableList["independent"][0], variableList["independent"][1]);
                                        }
                                    }
                                }
                    }
                        
                    break;
                }
    }
}

function populationMeanEntered()
{
    var populationValue = document.getElementById("populationValue").value;
    var variableList = getSelectedVariables();
    
    if(d3.select("#normality.crosses").attr("display") == "inline")
    {    
        sessionStorage.popMedian = parseFloat(populationValue);
        
        removeElementsByClassName("dialogBox");
        
        performOneSampleWilcoxonTest(variableList["dependent"][0]);
    }
    else
    {
        sessionStorage.popMean = parseFloat(populationValue);
        
        removeElementsByClassName("dialogBox");
        
        performOneSampleTTest(variableList["dependent"][0]);
    }
}

function doPairwiseTests()
{
    var completeLines = d3.selectAll(".completeLines");
    var variableList = getSelectedVariables();  
    
    //homoscedasticity
    loadAssumptionCheckList();
    
    var sampleSize;
    sampleSizesAreEqual = true;
    
    if(variableList["independent"].length == 2)
    {
        var levelsA = variableList["independent-levels"][0];
        var levelsB = variableList["independent-levels"][1];
        
        sampleSize = colourBoxPlotData[levelsA[0]][levelsB[0]].length;
    }
    else
    {
        sampleSize = variables[variableList["dependent"][0]][variableList["independent-levels"][0]].length;
        
        sampleSizesAreEqual = variables[variableList["dependent"][0]][variableList["independent-levels"][1]].length == variables[variableList["dependent"][0]][variableList["independent-levels"][0]].length ? true : false;
    }
    
    if(!sampleSizesAreEqual && experimentalDesign=="Between-groups")
    {
        alert("Between-groups design was detected but number of samples are different!");
        return;
    }                    
    else
    {
        performNormalityTests(); 
    }                   
}

function performNormalityTests()
{
//     var variableList = getSelectedVariables();  
//     
//     //normality
//     distributions[variableList["dependent"][0]] = {};
//     
//     if(variableList["independent"].length == 2)
//     {
//         variableList = sort(currentVariableSelection);
//         for(var i=0; i<variableList["independent-levels"][0].length; i++)
//         {
//             for(var j=0; j<variableList["independent-levels"][1].length; j++)
//             {
//                 performNormalityTest(colourBoxPlotData[variableList["independent-levels"][0][i]][variableList["independent-levels"][1][j]], variableList["dependent"][0], (variableList["independent-levels"][0][i] + "-" + variableList["independent-levels"][1][j]));
//             }
//         }
//     }
//     else
//     {
//         for(i=0; i<variableList["dependent"].length; i++)                        
//         {
//             for(j=0; j<variableList["independent-levels"].length; j++)
//             {                   
//                 performNormalityTest(variables[variableList["dependent"][i]][variableList["independent-levels"][j]], variableList["dependent"][i], variableList["independent-levels"][j]);
//             }
//         }
//     }
    var variableList = getSelectedVariables();    
    
    //initialise distributions
    distributions[variableList["dependent"][0]] = {};
    
    if(variableList["independent"].length == 2)
    {
        var allDistributions = new Array();
        var numberOfElements = new Array();
        
        var groups = getGroupsForColourBoxPlotData();        
        
        for(var i=0; i<groups.length; i++)
        {  
            numberOfElements.push(groups[i].length);            
            
            for(var j=0; j<groups[i].length; j++)
            {
                allDistributions.push(groups[i][j]);
            }
        }
        
        performNormalityTestForMultipleDistributions(allDistributions, numberOfElements);       
    }
    else
    {
        var allDistributions = new Array();
        var numberOfElements = new Array();
        //for each level corresponding to the dependent variable, perform normality test.
        for(i=0; i<variableList["dependent"].length; i++)                        
        {
            for(j=0; j<variableList["independent-levels"].length; j++)
            {               
                for(k=0; k<variables[variableList["dependent"][i]][variableList["independent-levels"][j]].length; k++)
                {
                    allDistributions.push(variables[variableList["dependent"][i]][variableList["independent-levels"][j]][k]);
                }
                
                numberOfElements.push(variables[variableList["dependent"][i]][variableList["independent-levels"][j]].length);
            }
        }
        
        performNormalityTestForMultipleDistributions(allDistributions, numberOfElements);
    }
}

function performHomoscedasticityTests()
{  
    console.log(new Date().getTime());
    var variableList = getSelectedVariables();    
    
    //initialise distributions
    variances[variableList["dependent"][0]] = {};
    
    for(i=0; i<variableList["independent"].length; i++)
        performHomoscedasticityTest(variableList["dependent"][0], variableList["independent"][i]);
}

function setDistribution(dependentVariable, level, normal)
{    
    if(distributions[dependentVariable] == undefined)
        distributions[dependentVariable] = new Object();
    
    distributions[dependentVariable][level] = normal;    
    
    if(getObjectLength(distributions[dependentVariable]) == getNumberOfSelectedMeans())
    {       
        //i.e., when all distributions are tested
        var variableList = getSelectedVariables();
        var normal = true;
        
        for(var i=0; i<variableList["independent-levels"].length; i++)
        {   
            if(distributions[dependentVariable][variableList["independent-levels"][i]] == false)
            {
                d3.select("#normality.crosses").attr("display", "inline"); 
                d3.select("#normality.loading").attr("display", "none"); 
                
                normal = false;
                
                d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight*1.5);
                
                //draw boxplots in red 
                drawBoxPlotInRed(variableList["independent-levels"][i]);
                drawNormalityPlot(dependentVariable, variableList["independent-levels"][i], "notnormal");
            }
            else
            {
                drawNormalityPlot(dependentVariable, variableList["independent-levels"][i], "normal");
            }
        }
        
        if(normal)
        {   
            // d3.select("#plotCanvas").transition().delay(2500).duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
            
            console.log("\n\tAll distributions are normal!");
            
            d3.select("#normality.ticks").attr("display", "inline");  
            d3.select("#normality.loading").attr("display", "none"); 
            
            if(variableList["independent"].length == 1)
            {
                if((experimentalDesign == "within-groups") && (variableList["independent"][0] == getWithinGroupVariable(variableList)))
                {
                    //within-group design
                    performHomoscedasticityTest(variableList["dependent"][0], variableList["independent"][0]);
                    
                    //do test
                    if(variableList["independent-levels"].length == 2)
                    {
                        //2 variables
                        if(pairwiseComparisons)
                            performPairwiseTTest("TRUE", "TRUE");
                        else
                            performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "TRUE", "TRUE");
                    }
                    else
                    {
                        //> 2 variables
                        performOneWayRepeatedMeasuresANOVA(variableList["dependent"][0], variableList["independent"][0]);
                    }
                }
                else
                {
                    //between-group design
                    
                    console.log(d3.select("#homogeneity.ticks").attr("display"));

                    //homoscedasticity test is already done (and no case is handled)
                    if(d3.select("#homogeneity.ticks").attr("display") == "inline")
                    {
                        if(variableList["independent-levels"].length == 2)
                        {
                            //2 variables
                            if(pairwiseComparisons)
                                performPairwiseTTest("TRUE", "FALSE");
                            else
                                performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "TRUE", "FALSE");
                        }
                        else
                        {
                            //> 2 variables
                            performOneWayANOVA(variableList["dependent"][0], variableList["independent"][0]);
                        }                    
                    }
                }
            }   
            else if(variableList["independent"].length == 2)
            {
                if((experimentalDesign == "within-groups") && (variableList["independent"][0] == getWithinGroupVariable(variableList)))
                {
                    //within-group design
                }
                else
                {
                    //between-group design
                    
                    //homoscedasticity test is already done (and no case is handled)
                    if(d3.select("#homogeneity.ticks").attr("display") == "inline")
                    {
                        if(variableList["independent-levels"].length == 2)
                        {
                            //2 variables
                            var groups = getGroupsForColourBoxPlotData();
                            
                            if(pairwiseComparisons)
                                performPairwiseTTest("TRUE", "FALSE");
                            else
                                performTTest(groups[0], groups[1], "TRUE", "FALSE");
                        }                    
                    }
                }
                
                if(variableList["independent"].length == 2 && getNumberOfSelectedMeans() == 2)
                {
                    console.log("hi");
                    if(d3.select("#homogeneity.ticks").attr("display") == "inline")
                    {
                        //2 variables
                        var groups = getGroupsForColourBoxPlotData();
                        
                        if(pairwiseComparisons)
                            performPairwiseTTest("TRUE", "FALSE");
                        else
                            performTTest(groups[0], groups[1], "TRUE", "FALSE");
                    }   
                }                
            }            
        }
        else
        {
            console.log("\n\tNormality of distributions is not satisfied!");            
            console.log("\n\tChecking if transformation is possible...");     
            
            if((experimentalDesign == "within-groups") && (variableList["independent"][0] == getWithinGroupVariable(variableList)))
            {
                //within-group design
                if(variableList["independent-levels"].length == 2 && variableList["independent"].length == 2)
                {
                    var groups = getGroupsForColourBoxPlotData();
                    
                    //Mann-Whitney U test
                    if(pairwiseComparisons)
                        performPairwiseWilcoxTest("TRUE", "FALSE");
                    else
                        performMannWhitneyTest(groups[0], groups[1]);
                }
                else
                {
                    performHomoscedasticityTest(variableList["dependent"][0], variableList["independent"][0]);
                }
            }
            
            findTransformForNormality(variableList["dependent"][0], variableList["independent"][0]);
        }
    }    
}

function setHomogeneity(dependentVariable, independentVariable, homogeneous)
{    
    if(variances[dependentVariable] == undefined)
        variances[dependentVariable] = new Object();
    
    variances[dependentVariable][independentVariable] = homogeneous;
    
    if(getObjectLength(variances[dependentVariable]) == (currentVariableSelection.length - 1))
    {       
        var variableList = sort(currentVariableSelection);
        var homogeneity = true;
        
        for(var i=0; i<variableList["independent"].length; i++)
        {   
            if(variances[dependentVariable][variableList["independent"][i]] == false)
            {
                d3.select("#homogeneity.crosses").attr("display", "inline");
                d3.select("#homogeneity.loading").attr("display", "none"); 
                homogeneity = false;
            
                drawHomogeneityPlot(homogeneity);
            }
        }
        
        var selectedMeans = getSelectedMeansForColourBoxPlotData();
        var selectedMeanLevels = getSelectedMeanLevelsForColourBoxPlotData();
        
        if(homogeneity)
        {         
            console.log("\n\tHomogeneous requirement satisfied!");
            
            d3.select("#homogeneity.ticks").attr("display", "inline"); 
            d3.select("#homogeneity.loading").attr("display", "none"); 
            
            if(experimentalDesign == "between-groups" || getWithinGroupVariable(variableList) != variableList["independent"][0])
            {
                //between-groups design
                if(pairwiseComparisons)
                {
                    performNormalityTests();                    
                }
                else
                    performNormalityTests();                
            }
            else if(variableList["independent"].length == 2 && getNumberOfSelectedMeans() == 2)
            {
                performNormalityTests();
            }
        }
        else
        {
            console.log("\n\tHomogeneity of distributions is not satisfied!");
            console.log("\n\tChecking if transformation is possible...");
            //check if transformation is possible
            findTransformForHomogeneity(variableList["dependent"][0], variableList["independent"][0]);                
        }
    }    
}


function findCorrelationCoefficient(variableA, variableB)
{    
    testResults["formula"] = variableA + " : " + variableB;
    
    var isScatterPlotMatrix = currentVisualisationSelection == "Scatterplot-matrix" ? true : false;
    
    
    if((variableTypes[variableA] == "binary") && (variableTypes[variableB] == "binary"))
    {
        //both are binary 
        
        //2x2 => Phi; Cramer's V otherwise
        console.log("\t\t\tCramer's V");
        return null;
    }
    else if(((variableTypes[variableA] == "binary") || (variableTypes[variableB] == "binary")) && ((variableTypes[variableA] != "binary") || (variableTypes[variableB] != "binary")))
    {
        //one is binary
    
        if(variableTypes[variableA] == "binary")
        {
            if(!isNaN(variables[variableB]["dataset"][0]))
            {
                console.log("\t\t\tBiserial Correlation Coefficient");
                if(!isScatterPlotMatrix)
                    getBiserialCorrelationCoefficient(variableB, variableA);
                else
                    return null;
            }
            else
            {   
//                 drawButtonInSideBar("CONSTRUCT MODEL", "regression");
                console.log("\t\t\tDoing nothing");
                return null;
            }
        }
        else
        {
            if(!isNaN(variables[variableA]["dataset"][0]))
            {
                console.log("\t\t\tBiserial Correlation Coefficient");
                if(!isScatterPlotMatrix)
                    getBiserialCorrelationCoefficient(variableA, variableB);
                else
                    return null
            }
            else
            {
//                 drawButtonInSideBar("CONSTRUCT MODEL", "regression");
                console.log("\t\t\tDoing nothing");
                return null;
            }            
        }
    }
    else
    {
        //both are not binary
        
        if(((variableTypes[variableA] == "ordinal") || (variableTypes[variableB] == "ordinal")) && ((variableTypes[variableA] != "nominal") && (variableTypes[variableB] != "nominal")))
        {
            console.log("\t\t\tKendall's Tau");            
            if(!isScatterPlotMatrix)
                getCorrelationCoefficient(variableA, variableB, "kendall");
            else
                return getPearsonCorrelation(variables[variableA]["dataset"], variables[variableB]["dataset"]);
        }
        else if((variableTypes[variableA] == "nominal") || (variableTypes[variableB] == "nominal"))
        {
            //do nothing
//             drawButtonInSideBar("CONSTRUCT MODEL", "regression");
            console.log("\t\t\tDoing nothing");
            return null;
        }
        else
        {
            console.log("\t\t\tPearson's correlation");
            if(!isScatterPlotMatrix)
                getCorrelationCoefficient(variableA, variableB, "pearson");
            else
                return getPearsonCorrelation(variables[variableA]["dataset"], variables[variableB]["dataset"]);
        }
    }
}

function testForEvilVariables()
{  
    for(var i=0; i<variableNames.length; i++)
    {
        var variable = variableNames[i];
        var variableData = variables[variable]["dataset"];
        var uniqueVariableData = variableData.unique();

        if(isNaN(variableData[0]) || variableRows[variable]=="participant")
        {            
            if(uniqueVariableData.length >= 10)
            {
                setThisVariableEvil(variableNames[i]);
            }
        }
    }
}

function changePValueNotation(p)
{
    if(p<0.001)
        return "p < 0.001";
    else
        return "p = " + p;
}

function getGroupsForColourBoxPlotData()
{
    var variableList = getSelectedVariables();
    
    var groups = [];
    for(var i=0; i<variableList["independent-levels"].length; i++)
    {
        var meanOfDist = variableList["independent-levels"][i].split("-");
        var groupOfDist = colourBoxPlotData[meanOfDist[0]][meanOfDist[1]];
        
        groups[i] = [];
        groups[i] = groupOfDist;
    }
    
    return groups;
}
      
function getSelectedMeansForColourBoxPlotData()
{
    var means = document.getElementsByClassName("means");
    var selectedMeans = [];
    
    for(var i=0; i<means.length; i++)
    {
        if((means[i].getAttribute("fill") == meanColors["click"]) || (means[i].getAttribute("fill") == "green"))
        {   
            selectedMeans.push(means[i]);
        }
    }
    
    return selectedMeans;
}

function getUnselectedMeansForColourBoxPlotData()
{
    var means = document.getElementsByClassName("means");
    var selectedMeans = [];
    
    for(var i=0; i<means.length; i++)
    {
        if(means[i].getAttribute("fill") != meanColors["click"])
        {   
            selectedMeans.push(means[i]);
        }
    }
    
    return selectedMeans;
}

function getSelectedMeanLevelsForColourBoxPlotData()
{
    var means = document.getElementsByClassName("means");
    var selectedMeans = [];
    
    for(var i=0; i<means.length; i++)
    {
        if(means[i].getAttribute("fill") == meanColors["click"])
        {   
            selectedMeans.push(means[i]);
        }
    }
    
    var selectedMeanLevels = [];
    
    for(var i=0; i<selectedMeans.length; i++)
    {
        if(selectedMeanLevels[i] == undefined)
            selectedMeanLevels[i] = []; 
            
        selectedMeanLevels[i].push(selectedMeans[i].getAttribute("data-levelA"));
        selectedMeanLevels[i].push(selectedMeans[i].getAttribute("data-levelB"));
    }
    
    return selectedMeanLevels;
}

function findEndingLine()
{
    var completeLines = document.getElementsByClassName("completeLines");
    var means = document.getElementsByClassName("means");
    
    var START = [];
    var END = [];
    
    for(var j=0; j<completeLines.length; j++)
    {
        for(var i=0; i<means.length; i++)
        {        
            if(completeLines[j].getAttribute("x2") == means[i].getAttribute("cx"))
            {
                END.push(i);
            }
            if(completeLines[j].getAttribute("x1") == means[i].getAttribute("cx"))
            {
                START.push(i);
            }
        }
    }
    
    for(var i=0; i<means.length; i++)
    {
        if(START.indexOf(i) == -1 && END.indexOf(i) != -1)
        {
            for(var j=0; j<completeLines.length; j++)
            {
                if(completeLines[j].getAttribute("x2") == means[i].getAttribute("cx"))
                    return completeLines[j];
            }
        }
    }
    
    return 0;
}

function findEndingMean()
{
    var completeLines = document.getElementsByClassName("completeLines");
    var means = document.getElementsByClassName("means");
    
    var START = [];
    var END = [];
    
    for(var j=0; j<completeLines.length; j++)
    {
        for(var i=0; i<means.length; i++)
        {        
            if(completeLines[j].getAttribute("x2") == means[i].getAttribute("cx"))
            {
                END.push(i);
            }
            if(completeLines[j].getAttribute("x1") == means[i].getAttribute("cx"))
            {
                START.push(i);
            }
        }
    }
    
    for(var i=0; i<means.length; i++)
    {
        if(START.indexOf(i) == -1 && END.indexOf(i) != -1)
        {
            for(var j=0; j<completeLines.length; j++)
            {
                if(completeLines[j].getAttribute("x2") == means[i].getAttribute("cx"))
                    return means[i];
            }
        }
    }
    
    return 0;
}

function resetMeans()
{
    var means = d3.selectAll(".means").attr("fill", meanColors["normal"]);
}

function setCompareNowButtonText()
{
    // if(document.getElementById("#text.doPairwiseTest") == null)
//     {
//         var compareNowText = d3.select("#text.compareNow");
//     
//         var variableList = getSelectedVariables();
//     
//         if(variableList["independent"].length == 0)
//         {  
//             if(variableList["dependent"].length == 0)
//                 compareNowText.text("SELECT ONE OR MORE MEANS");    
//             else
//                 compareNowText.text("TEST AGAINST POPULATION MEAN");    
//         }
//         else
//         {
//             switch(variableList["independent-levels"].length)
//             {
//                 case 0:
//                         compareNowText.text("SELECT TWO OR MORE MEANS");    
//                         break
//                 case 1:
//                         compareNowText.text("SELECT TWO OR MORE MEANS");    
//                         break;
//             
//                 default:
//                         compareNowText.text("COMPARE MEANS");
//                         break;
//             }
//         }
//     }
//     else
//     {
//         var compareNowText = d3.select("#text.doPairwiseTest");    
//         var variableList = getSelectedVariables();    
// 
//         switch(variableList["independent-levels"].length)
//         {
//             case 0:
//                     compareNowText.text("SELECT TWO OR MORE MEANS");    
//                     break
//             case 1:
//                     compareNowText.text("SELECT TWO OR MORE MEANS");    
//                     break;
//         
//             default:
//                     compareNowText.text("COMPARE MEANS");
//                     break;
//         }
//     }
}

function calculateOutcome()
{    
    if(currentVariableSelection.length == 2)
    {    
        var outcomeVariable = document.getElementById("value_outcome");
        var predictorVariable = document.getElementById("value_" + currentVariableSelection[0]);
        
        testResults["coefficients"] = parseFloat(testResults["coefficients"]);
        testResults["intercept"] = parseFloat(testResults["intercept"]);
        
        outcomeVariable.innerHTML = dec5(testResults["coefficients"]*predictorVariable.value + testResults["intercept"]);
    }
    else
    {
        var outcomeVariable = testResults["outcomeVariable"];
        var explanatoryVariables = testResults["explanatoryVariables"];
        
        var outcomeVariableLabel = document.getElementById("value_outcome");
        
        var outcomeVariableValue = testResults["intercept"];
        
        for(var i=0; i<explanatoryVariables.length; i++)
        {
            var valueEnteredForExplanatoryVariable = isNaN(document.getElementById("value_" + explanatoryVariables[i]).value) ? 0 : document.getElementById("value_" + explanatoryVariables[i]).value;
            var coefficient = testResults["coefficients"][i];
            
            outcomeVariableValue += coefficient*valueEnteredForExplanatoryVariable;
        }
        
        outcomeVariableLabel.innerHTML = dec25(outcomeVariableValue);
    }
}

function isFactorialANOVA(variableList)
{
    if(experimentalDesign == "between-groups")
        return false;
        
    var withinGroupVariableExists = false;
    var betweenGroupVariableExists = false;
        
    for(i=0; i<variableList["independent"].length; i++)
    {
        //for each independent variable
        var levels = variables[variableList["independent"][i]]["dataset"].unique();
        
        var prev = 0, curr = 0;
        for(j=0; j<levels.length; j++)
        {
            //for each level
            if(j == 0)
            {
                prev = variables[variableList["dependent"][0]][levels[j]].length;               
            }
            
            else
            {
                curr = variables[variableList["dependent"][0]][levels[j]].length;
               
                if(curr != prev)
                {
                    betweenGroupVariableExists = true;
                    break;
                }
                else
                {
                    prev = curr; 
                    if(j == (levels.length-1))
                        withinGroupVariableExists = true;                    
                }                
            }
        }
    }    
    
    if(betweenGroupVariableExists && withinGroupVariableExists)
        return true;
}

function getBetweenGroupVariable(variableList)
{
    var withinGroupVariableExists = false;
    var betweenGroupVariableExists = false;
    
    for(i=0; i<variableList["independent"].length; i++)
    {
        //for each independent variable
        var levels = variables[variableList["independent"][i]]["dataset"].unique();
        
        var prev = 0, curr = 0;
        for(j=0; j<levels.length; j++)
        {
            //for each level
            if(j == 0)
            {
                prev = variables[variableList["dependent"][0]][levels[j]].length;
            }
            
            else
            {
                curr = variables[variableList["dependent"][0]][levels[j]].length;                
                
                if(curr != prev)
                {
                    return variableList["independent"][i];
                }
                else
                {                    
                    prev = curr; 
                    if(j == (levels.length-1))
                        betweenGroupVariableExists = true;                    
                }                
            }
        }
    }    
}

function getWithinGroupVariable(variableList)
{
    var withinGroupVariableExists = false;
    var betweenGroupVariableExists = false;
    
    for(i=0; i<variableList["independent"].length; i++)
    {
        //for each independent variable
        var levels = variables[variableList["independent"][i]]["dataset"].unique();
        
        var prev = 0, curr = 0;
        for(j=0; j<levels.length; j++)
        {
            //for each level
            if(j == 0)
            {
                prev = variables[variableList["dependent"][0]][levels[j]].length;
            }
            
            else
            {
                curr = variables[variableList["dependent"][0]][levels[j]].length;                
                
                if(curr != prev)
                {
                    withinGroupVariableExists = true;
                }
                else
                {                    
                    prev = curr; 
                    if(j == (levels.length-1))
                        return variableList["independent"][i];
                }                
            }
        }
    } 
    
    return 0;
}

function setSelectButtons()
{
    var selectNoneText = d3.select("#text.selectNone");
    var selectNoneButton = d3.select("#rect.selectNone");
    
    var selectAllText = d3.select("#text.selectAll");
    var selectAllButton = d3.select("#rect.selectAll");
    
    var means = document.getElementsByClassName("means");
    var selectedMeans = [];
    
    for(var i=0; i<means.length; i++)
    {
        if(means[i].getAttribute("fill") == meanColors["click"])
            selectedMeans.push(means[i]);
    }    
    
    if(selectedMeans.length == 0)
    {           
        selectNoneButton.attr("fill", "url(#buttonFillSelected)");
        selectNoneButton.attr("filter", "none");
        selectNoneButton.attr("stroke", "none");
        
        selectNoneText.attr("fill", "white");
        
        selectAllButton.attr("fill", "url(#buttonFillNormal)");
        selectAllButton.attr("filter", "url(#Bevel)");
        selectAllButton.attr("stroke", "black");
        
        selectAllText.attr("fill", "black");
    }
    else if(selectedMeans.length == means.length)
    {
        selectAllButton.attr("fill", "url(#buttonFillSelected)");
        selectAllButton.attr("filter", "none");
        selectAllButton.attr("stroke", "none");
        
        selectAllText.attr("fill", "white");
        
        selectNoneButton.attr("fill", "url(#buttonFillNormal)");
        selectNoneButton.attr("filter", "url(#Bevel)");
        selectNoneButton.attr("stroke", "black");
        
        selectNoneText.attr("fill", "black");
    }
    else
    {        
        selectNoneButton.attr("fill", "url(#buttonFillNormal)");
        selectNoneButton.attr("filter", "url(#Bevel)");
        selectNoneButton.attr("stroke", "black");
        
        selectNoneText.attr("fill", "black");
        
        selectAllButton.attr("fill", "url(#buttonFillNormal)");
        selectAllButton.attr("filter", "url(#Bevel)");
        selectAllButton.attr("stroke", "black");
        
        selectAllText.attr("fill", "black");
    }
}  

function calculateCI(mean, error)
{
    return([mean - error, mean + error]);
}

function drawTukeyHSDPlot()
{
    //graphics
    var LEFT = canvasWidth/2 - plotWidth/2;
    var RIGHT = canvasWidth/2 + plotWidth/2;
     
    var TOP = canvasHeight/2 - plotHeight/2;
    var BOTTOM = canvasHeight/2 + plotHeight/2;
    
    var canvas = d3.select("#plotCanvas");
    
    //data - we have already sorted them into "tukeyResults" object 
    var variableList = sort(currentVariableSelection);    
    var levels = variables[variableList["independent"][0]]["dataset"].unique().sort();    
    
    var label = "tukeyHSD(" + variableList["dependent"][0] + "~" + variableList["independent"][0] + ")";
    
    var min = parseFloat(localStorage.getItem((label+"tkMin")));
    var max = parseFloat(localStorage.getItem((label+"tkMax")));
    
    //Axes
    var xAxis = canvas.append("line")
                        .attr("x1", LEFT)
                        .attr("y1", BOTTOM + axesOffset)
                        .attr("x2", RIGHT)
                        .attr("y2", BOTTOM + axesOffset) 
                        .attr("stroke", "black")
                        .attr("id", "xAxis")
                        .attr("class", "axes");
    
    var yAxis = canvas.append("line")
                        .attr("x1", LEFT - axesOffset)
                        .attr("y1", TOP)
                        .attr("x2", LEFT - axesOffset)
                        .attr("y2", BOTTOM)
                        .attr("stroke", "black")
                        .attr("id", "yAxis")
                        .attr("class", "axes");
    
    //Y-axis label
    canvas.append("text")
                .attr("x", LEFT - axesOffset - 1.5*labelOffset)
                .attr("y", (TOP + BOTTOM)/2)
                .attr("text-anchor", "middle")
                .attr("font-size", fontSizeLabels + "px")
                .text("Mean difference in " + variableList["dependent"][0])
                .attr("transform", "rotate(-90 " + (LEFT - axesOffset - 1.5*labelOffset) + " " + ((TOP + BOTTOM)/2 + 6) + ")");
                
    //X-axis grooves
    var numberOfGroovesInXAxis = findNumberOfCombinations(levels.length,2);    
    var xStep = plotWidth/(numberOfGroovesInXAxis - 1);   

    var index = 0;   
        
    for(var i=0; i<levels.length; i++)
    {
        for(var j=i+1; j<levels.length; j++)
        {
            if(i != j)
            {  
                canvas.append("line")
                            .attr("x1", LEFT + (index)*xStep)
                            .attr("y1", BOTTOM  + axesOffset)
                            .attr("x2", LEFT + (index)*xStep)
                            .attr("y2", BOTTOM + 10 + axesOffset)
                            .attr("class", "xAxisGrooves");

                canvas.append("text")
                            .attr("x", LEFT + (index++)*xStep)
                            .attr("y", BOTTOM + tickTextOffsetXAxis + axesOffset)                    
                            .text(levels[i] + "-" + levels[j])
                            .attr("fill", "black")
                            .attr("font-size", fontSizeTicks + "px")
                            .attr("text-anchor", "middle")
                            .attr("class", "xAxisGrooveText");
            }
        }
    }
    
    //Y-axis grooves
    var numberOfGroovesInYAxis = 10;
    var yStep = plotHeight/(numberOfGroovesInYAxis - 1);   
    var ySlice = (max - min)/(numberOfGroovesInYAxis - 1);  

    
    for(i=0; i<numberOfGroovesInYAxis; i++)
    {  
        var axisText = dec2(min + i*ySlice);
        var textPosition = BOTTOM - i*yStep;                  
        
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
                    .attr("text-anchor", "end")
                    .attr("font-size", fontSizeTicks + "px")
                    .attr("id", "groove" + i)
                    .attr("class", "yAxisGrooveText");
    } 
    
    //zero line
    canvas.append("line")
            .attr("x1", LEFT-axesOffset)
            .attr("y1", BOTTOM - getValue1(0, min, max)*plotHeight)
            .attr("x2", RIGHT)
            .attr("y2", BOTTOM - getValue1(0, min, max)*plotHeight)
            .attr("stroke", "gold")
            .attr("class", "zeroLine");
    
    index = 0;
    for(var i=0; i<levels.length; i++)
    {
        for(var j=i+1; j<levels.length; j++)
        {
            if(i != j)
            {                            
                var x1, y1, x2, y2;
                
                x1 = LEFT + (index)*xStep;
                x2 = LEFT + (index)*xStep;
                y1 = BOTTOM - getValue1(tukeyResults[levels[i]][levels[j]]["lower"], min, max)*plotHeight;        
                y2 = BOTTOM - getValue1(tukeyResults[levels[i]][levels[j]]["upper"], min, max)*plotHeight;        
                
                var color = (tukeyResults[levels[i]][levels[j]]["lower"]*tukeyResults[levels[i]][levels[j]]["upper"] > 0 ? "green" : "red");

                canvas.append("line")
                            .attr("x1", x1)
                            .attr("y1", y1)
                            .attr("x2", x2)
                            .attr("y2", y2)
                            .attr("stroke", color)
                            .attr("stroke-width", "3")
                            .attr("data-index1", levels[i])
                            .attr("data-index2", levels[j])
                            .attr("id", levels[i] + levels[j])
                            .attr("class", "tukeyCI");
                canvas.append("line")
                            .attr("x1", x1 - 5)
                            .attr("y1", y1)
                            .attr("x2", x1 + 5)
                            .attr("y2", y1)
                            .attr("stroke", color)
                            .attr("stroke-width", "4")
                            .attr("data-index1", levels[i])
                            .attr("data-index2", levels[j])
                            .attr("id", levels[i] + levels[j])
                            .attr("class", "tukeyCIBottom");
                 canvas.append("line")
                            .attr("x1", x2 - 5)
                            .attr("y1", y2)
                            .attr("x2", x2 + 5)
                            .attr("y2", y2)
                            .attr("stroke", color)
                            .attr("stroke-width", "4")
                            .attr("data-index1", levels[i])
                            .attr("data-index2", levels[j])
                            .attr("id", levels[i] + levels[j])
                            .attr("class", "tukeyCITop");
                
                var x,y;

                x = LEFT + (index++)*xStep;
                y = BOTTOM - getValue1(tukeyResults[levels[i]][levels[j]]["difference"], min, max)*plotHeight;        

                canvas.append("circle")
                            .attr("cx", x)
                            .attr("cy", y)
                            .attr("r", "5px")
                            .attr("fill", "DeepSkyBlue")
                            .attr("data-index1", levels[i])
                            .attr("data-index2", levels[j])
                            .attr("id", levels[i] + levels[j])
                            .attr("class", "tukeyMean");
            }
        }
    }
}