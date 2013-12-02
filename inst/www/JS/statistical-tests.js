function compareMeans()
{
    var completeLines = d3.selectAll(".completeLines");
    var variableList = getSelectedVariables();  
    
    console.log("variableList:");
    console.dir(variableList);
    
    switch(document.getElementsByClassName("completeLines").length)
    {

        case 0:
                //One sample t-test
                if(variableList["dependent"].length == 1)
                {
                    loadAssumptionCheckList();
                    performNormalityTest(variables[variableList["dependent"][0]]["dataset"], variableList["dependent"][0], "dataset");                    
                }
                
                break;
        case 1:
                //T-test
                {
                    console.log("\t Significance test for 2 variables...\n\n");

                    //homoscedasticity
                    loadAssumptionCheckList();
                    
                    var sampleSize;
                    sampleSizesAreEqual = true;
                    
                    if(variableList["independent"].length == 2)
                    {                        
                        console.log("colourBoxPlotData=");
                        console.dir(colourBoxPlotData);
                        
                        var selectedMeans = getSelectedMeansForColourBoxPlotData();
                        
                        var levelA = selectedMeans[0].getAttribute("data-levelA");
                        var levelB = selectedMeans[0].getAttribute("data-levelB");
                        
                        sampleSize = colourBoxPlotData[levelA][levelB].length;
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
                    
                    break;
                }
        
        default:
                //ANOVA
                {
                    console.log("\t Significance test for more than 2 variables...\n\n");
                    
                    loadAssumptionCheckList();                    
                    performNormalityTests();
        
                    break;
                }
    }
}

function doPairwiseTests()
{
    var completeLines = d3.selectAll(".completeLines");
    var variableList = getSelectedVariables();  
    
    console.log("variableList:");
    console.dir(variableList);    
    
    console.log("\t Pairwise comparisons!");

    //homoscedasticity
    loadAssumptionCheckList();
    
    var sampleSize;
    sampleSizesAreEqual = true;
    
    if(variableList["independent"].length == 2)
    {
        var levelsA = variableList["independent-levels"][0];
        var levelsB = variableList["independent-levels"][1];
        
        console.log("colourBoxPlotData=");
        console.dir(colourBoxPlotData);
        
        console.log(levelsA[0]);
        console.log(levelsB[0]);
        
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

function loadAssumptionCheckList()
{
    var canvas = d3.select("#sideBarCanvas");
    
    var title = canvas.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", 30 + assumptionOffsetTop)
            .attr("font-size", fontSizeAssumptionsTitle + "px")
            .attr("text-anchor", "middle")
            .attr("fill", "#627bf4")
            .text("CHECKING ASSUMPTIONS")
            .attr("class", "checkingAssumptions");
    
    title.transition().delay(500).duration(800).attr("y", assumptionOffsetTop - 50);
    
    //timer for 500 ms
    window.setTimeout(function(){
        for(var i=0; i<assumptions.length; i++)
        {
            canvas.append("text")
                .attr("x", assumptionImageSize*1.25)
                .attr("y", i*assumptionStep + assumptionOffsetTop)
                .attr("font-size", fontSizeAssumptions + "px")
                .attr("fill", "black")
                .text(assumptionsText[assumptions[i]])
                .attr("id", assumptions[i])
                .attr("class", "assumptions");
            canvas.append("image")
                .attr("x", 0)
                .attr("y", i*assumptionStep + assumptionOffsetTop - assumptionImageSize/2 - 10)
                .attr("text-anchor", "end")
                .attr("xlink:href", "images/checkingAssumptions.gif")
                .attr("height", assumptionImageSize)            
                .attr("width", assumptionImageSize)
                .attr("id", assumptions[i])
                .attr("class", "loading");
                
            canvas.append("image")
                .attr("x", 0)
                .attr("y", i*assumptionStep + assumptionOffsetTop - assumptionImageSize/2 - 10)
                .attr("text-anchor", "end")
                .attr("xlink:href", "images/tick.png")
                .attr("height", assumptionImageSize)            
                .attr("width", assumptionImageSize)
                .attr("display", "none")
                .attr("id", assumptions[i])
                .attr("class", "ticks");
                         
            canvas.append("image")
                .attr("x", 0)
                .attr("y", i*assumptionStep + assumptionOffsetTop - assumptionImageSize/2)
                .attr("text-anchor", "end")
                .attr("xlink:href", "images/cross.png")
                .attr("height", assumptionImageSize)
                .attr("width", assumptionImageSize)
                .attr("display", "none")
                .attr("id", assumptions[i])
                .attr("class", "crosses");
        }    
    }, 1300);
    
    
}

function performNormalityTests()
{
    var variableList = getSelectedVariables();    
    //normality
    distributions[variableList["dependent"][0]] = {};
    
    if(variableList["independent"].length == 2)
    {
        variableList = sort(currentVariableSelection);
        for(var i=0; i<variableList["independent-levels"][0].length; i++)
        {
            for(var j=0; j<variableList["independent-levels"][1].length; j++)
            {
                performNormalityTest(colourBoxPlotData[variableList["independent-levels"][0][i]][variableList["independent-levels"][1][j]], variableList["dependent"][0], (variableList["independent-levels"][0][i] + "-" + variableList["independent-levels"][1][j]));
            }
        }
    }
    else
    {
        for(var i=0; i<variableList["dependent"].length; i++)                        
        {
            for(var j=0; j<variableList["independent-levels"].length; j++)
            {   
                //performNormalityTest(dist, dependentVariable, level)
                performNormalityTest(variables[variableList["dependent"][i]][variableList["independent-levels"][j]], variableList["dependent"][i], variableList["independent-levels"][j]);
            }
        }
    }
}

function setDistribution(dependentVariable, level, normal)
{    
    if(distributions[dependentVariable] == undefined)
        distributions[dependentVariable] = new Object();
    
    distributions[dependentVariable][level] = normal;

    
    if(getObjectLength(distributions[dependentVariable]) == (document.getElementsByClassName("completeLines").length + 1))
    {       
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
        }
        
        if(normal)
        {         
            console.log("\n\tall distributions are normal!");
            
            d3.select("#normality.ticks").attr("display", "inline");  
            d3.select("#normality.loading").attr("display", "none"); 
            
            for(var i=0; i<variableList["independent"].length; i++)
            {
                performHomoscedasticityTestNormal(variableList["dependent"][0], variableList["independent"][i]);
            }
        }
        else
        {
            console.log("\n\tchecking if normality transform is possible...");            
            findTransform(variableList["dependent"][0], variableList["independent"][0]);
        }
    }    
}

function setHomogeneityOfVariances(dependentVariable, independentVariable, homogeneous)
{    
    if(variances[dependentVariable] == undefined)
        variances[dependentVariable] = new Object();
    
    variances[dependentVariable][independentVariable] = homogeneous;
    
    if(getObjectLength(variances[dependentVariable]) == (currentVariableSelection.length - 1))
    {       
        var variableList = sort(currentVariableSelection);
        var homogeneous = true;
        
        for(var i=0; i<variableList["independent"].length; i++)
        {   
            if(variances[dependentVariable][variableList["independent"][i]] == false)
            {
                d3.select("#homogeneity.crosses").attr("display", "inline");
                d3.select("#homogeneity.loading").attr("display", "none"); 
                homogeneity = false;
            }
        }
        
        var selectedMeans = getSelectedMeansForColourBoxPlotData();
        var selectedMeanLevels = getSelectedMeanLevelsForColourBoxPlotData();
        
        if(homogeneity)
        {         
            console.log("\n\tHomogeneous requirement satisfied!");
            
            d3.select("#homogeneity.ticks").attr("display", "inline"); 
            d3.select("#homogeneity.loading").attr("display", "none"); 
            
            drawComputingResultsImage();
            
            performTwoWayANOVA(variableList["dependent"][0], variableList["independent"][0], variableList["independent"][1]);
        }
        else
        {
            if(selectedMeans.length > 2)
                console.log("Friedman's test");
            else
            {
                var levelsOfDistributionA = selectedMeanLevels[0];
                var levelsOfDistributionB = selectedMeanLevels[1];
                
                console.log(levelsOfDistributionA);
                console.log(levelsOfDistributionB);
                
                drawComputingResultsImage();
                            
                if((experimentalDesign == "between-groups") && sampleSizesAreEqual)
                {
                    if(!pairwiseComparisons)
                        performTTest(colourBoxPlotData[levelsOfDistributionA[0]][levelsOfDistributionA[1]], colourBoxPlotData[levelsOfDistributionB[0]][levelsOfDistributionB[1]], "FALSE", "TRUE");
                    else
                        performPairwiseTTest("FALSE", "TRUE");
                }
                else
                {
                    if(!pairwiseComparisons)
                        performTTest(colourBoxPlotData[levelsOfDistributionA[0]][levelsOfDistributionA[1]], colourBoxPlotData[levelsOfDistributionB[0]][levelsOfDistributionB[1]], "FALSE", "FALSE");
                    else
                        performPairwiseTTest("FALSE", "FALSE");
                }
            }                   
        }
    }    
}

function drawNormalityPlot(dependentVariable, level, type)
{
    //9make histogram with these variables in a separate svg
    
    var mean;
    if(level == "dataset")
        mean = d3.select("#" + dependentVariable + ".means");
    else
        mean = d3.select("#" + getValidId(level) + ".means");
        
    var centerX = mean.attr("cx");   
    
    
    makeHistogramWithDensityCurve(centerX - normalityPlotWidth/2, canvasHeight + normalityPlotOffset, normalityPlotWidth, normalityPlotHeight, dependentVariable, level, type);//left, top, histWidth, histHeight, dependentVariable, level;
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
        console.log("BOTTOM=" + BOTTOM);
        console.log("median=" + sessionStorage.popMedian);
        console.log("plotHeight=" + plotHeight);
    
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
            .attr("y", canvasHeight/2 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("fill", "orange")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + 2*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "22px")
            .attr("fill", "orange")
            .text(testResults["statistic"])
            .attr("class", "significanceTest");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + 3*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("fill", "orange")
            .text(testResults["p"])
            .attr("class", "significanceTest");
    
    
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"]));
//     sideBar.append("text")
//             .attr("x", sideBarWidth/2)
//             .attr("y", canvasHeight/2 - significanceTestResultOffset)
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
        if(means[i].getAttribute("fill") == meanColors["click"])
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
            .attr("y", canvasHeight/2 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    
    drawParameter(parseFloat(testResults["parameter"]));
    
    // sideBar.append("text")
//             .attr("x", sideBarWidth/2)
//             .attr("y", canvasHeight/2 + 2*significanceTestResultOffset)
//             .attr("text-anchor", "middle")
//             .attr("font-size", "22px")
//             .attr("fill", "orange")
//             .text(testResults["statistic"])
//             .attr("class", "significanceTest");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + 3*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text(testResults["p"])
            .attr("class", "significanceTest");
    
    
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"]));
//     sideBar.append("text")
//             .attr("x", sideBarWidth/2)
//             .attr("y", canvasHeight/2 - significanceTestResultOffset)
//             .attr("text-anchor", "middle")
//             .attr("font-size", "24px")
//             .attr("fill", "orange")
//             .text(testResults["effect-size"])
//             .attr("class", "significanceTest");
    
    
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
    
//     for(var i=0; i<variableList["dependent"].length; i++)
//     {
//         for(var j=0; j<levels.length; j++)
//         {
//             means.push(mean(variables[variableList["dependent"][i]][levels[j]]));
//         }
//     }   

    for(var i=0; i<cy.length; i++)
    {
        means.push(getActualValue(cy[i]));
    }
    
    means = means.sort(function(a,b){return a-b});
    cy = cy.sort(function(a,b){return b-a});
    
    
    canvas.append("text")
                .attr("x", x + scaleForWindowSize(35))
                .attr("y", (yMin + yMax)/2)
                .attr("fill", "black")
                .attr("font-size", scaleForWindowSize(20) + "px")
                .attr("id", "tickText")
                .attr("class", "significanceTest")
                .text(format(means[means.length-1] - means[0]));
    
    if(cy.length >= 2)
    {
        for(var i=0; i<cy.length-1; i++)
        {  
            canvas.append("text")
                .attr("x", x + scaleForWindowSize(5))
                .attr("y", (parseFloat(cy[i]) + parseFloat(cy[i+1]))/2 + yAxisTickTextOffset)
                .attr("fill", "black")
                .attr("id", "DIM" + i)
                .attr("class", "differenceInMeansText")
                .attr("display", "none")
                .text(format(means[i+1] - means[i]));
                
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

function displayCorrelationResults()
{ 
    var sideBar = d3.select("#sideBarCanvas");
    
    if(document.getElementById("computingResultsImage") != null)
        removeElementById("computingResultsImage");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "22px")
            .attr("fill", "orange")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + 2*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "22px")
            .attr("fill", "orange")
            .text(testResults["statistic"])
            .attr("class", "significanceTest");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + 3*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "16px")
            .attr("fill", "orange")
            .text(testResults["p"])
            .attr("class", "significanceTest");
    
    
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"]));
//     sideBar.append("text")
//             .attr("x", sideBarWidth/2)
//             .attr("y", canvasHeight/2 - significanceTestResultOffset)
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
            .attr("y", canvasHeight/2 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "22px")
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
            .attr("y", canvasHeight/2 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "22px")
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
            .attr("font-size", "32px")
            .attr("fill", "orange")
            .text(testResults["equation"])
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
            .attr("y", canvasHeight/2 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", "22px")
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
            .attr("font-size", "26px")
            .attr("fill", "orange")
            .text(testResults["equation"])
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