function drawTukeyHSDPlot()
{
    logListVisualizations.push(
        {
            time: new Date().getTime(), 
            dataset: sessionStorage.fileName,
            variables: currentVariableSelection.slice(0).join("|"),
            visualization: "tukey_hsd_plot"
        }
    );

    writeToFileVisualizations(sessionStorage.logFileName + "_visualizations");

    //graphics
    currentVisualisationSelection = "tukeyHSDPlot";

    var LEFT = plotPanelWidth/2 - plotWidth/2;
    var RIGHT = plotPanelWidth/2 + plotWidth/2;
     
    var TOP = plotPanelHeight/2 - plotHeight/2;
    var BOTTOM = plotPanelHeight/2 + plotHeight/2;
    
    var canvas = d3.select("#plotCanvas");
    
    //data - we have already sorted them into "tukeyResults" object 
    var variableList = sort(currentVariableSelection);    
    var levels = variables[variableList["independent"][0]]["dataset"].unique().sort();    
    
    var min = parseFloat(localStorage.getItem(("tkMin")));
    var max = parseFloat(localStorage.getItem(("tkMax")));
    
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
    var numberOfGroovesInXAxis = findNumberOfCombinations(levels.length(),2);    
    var xStep = plotWidth/(numberOfGroovesInXAxis - 1);   

    var index = 0;   
        
    for(var i=0; i<levels.length(); i++)
    {
        for(var j=i+1; j<levels.length(); j++)
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
    for(var i=0; i<levels.length(); i++)
    {
        for(var j=i+1; j<levels.length(); j++)
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