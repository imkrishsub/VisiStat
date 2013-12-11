//to load a file on local disk
function loadFile(filePath)
{
    //loads the file and returns the dataset and variable names
    var req = opencpu.r_fun_json("loadFile", {
                    filePath: filePath
                  }, function(output) {                   
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
     }).fail(function(){
          alert("Failure: " + req.responseText);
    });

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
    req.complete(function(){
    });
}

function getData(dataset, variableName, level)
{
//     Get variable names and their data type
        var req = opencpu.r_fun_json("getData", {
                    dataset: dataset,
                    columnName: variableName
                  }, function(output) {    
        
        if(level === undefined)
        {   
            level = "dataset";
        } 
        
        variables[variableName][level] = output.data;
        MIN[variableName][level] = Array.min(variables[variableName][level]);
        MAX[variableName][level] = Array.max(variables[variableName][level]);
        
        console.log("\n\tvariables[" + variableName + "][" + level + "] = " + variables[variableName][level]);
        console.log("\tMIN[" + variableName + "][" + level + "] = " + MIN[variableName][level]);
        console.log("\tMAX[" + variableName + "][" + level + "] = " + MAX[variableName][level]);   
    
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
            console.log("\n\tEXPERIMENTAL DESIGN = " + experimentalDesign);
        }    
        
      }).fail(function(){
          alert("Failure: " + req.responseText);
    });

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
    req.complete(function(){
        
    });
}

//Assumption-checking
function performHomoscedasticityTestNotNormal(dependent, independent)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performHomoscedasticityTest", {
                    dependentVariable: dependent,
                    independentVariable: independent,
                    dataset: dataset                    
                }, function(output) {                                 
                  
                console.log("\t\t Levene's test for (" + dependent + " ~ " + independent + ")");
                console.log("\t\t\t p-value = " + output.p);
                
                variableList = getSelectedVariables();
                
                if(variableList["independent-levels"].length > 2)
                {
                    if(output.p < 0.05)
                    {
                        d3.select("#homogeneity.crosses").attr("display", "inline");                  
                        d3.select("#homogeneity.loading").attr("display", "none");                  
                        
                        drawComputingResultsImage();
                        
                        if((experimentalDesign == "within-groups") && sampleSizesAreEqual)
                        {
                            performFriedmanTest(variableList["dependent"][0], variableList["independent"][0]);
                        }
                        else
                        {
                            performWelchANOVA(variableList["dependent"][0], variableList["independent"][0]);
                        }                      
                    }
                    else
                    {   
                        //equal variances
                        d3.select("#homogeneity.ticks").attr("display","inline");
                        d3.select("#homogeneity.loading").attr("display", "none"); 
                        
                        drawComputingResultsImage();
                    
                        if((experimentalDesign == "within-groups") && sampleSizesAreEqual)
                        {
                            performFriedmanTest(variableList["dependent"][0], variableList["independent"][0]);
                        }
                        else
                        {
                            performKruskalWallisTest(variableList["dependent"][0], variableList["independent"][0]);
                        }                                        
                    }
                }
                else
                {  
                    if(output.p < 0.05)
                    {
                        d3.select("#homogeneity.crosses").attr("display", "inline"); 
                        d3.select("#homogeneity.loading").attr("display", "none"); 
                        
                        drawComputingResultsImage();
                        
                        if((experimentalDesign == "within-groups") && sampleSizesAreEqual)
                        {   
                            if(!pairwiseComparisons)
                                performWilcoxonTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]]);
                            else
                                performPairwiseWilcoxTest("FALSE", "TRUE");
                        }
                        else
                        {
                            if(!pairwiseComparisons)
                                performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "FALSE");
                            else
                                performPairwiseWilcoxTest("FALSE", "FALSE");
                        }                         
                    }
                    else
                    {   
                        //equal variances
                        d3.select("#homogeneity.ticks").attr("display","inline");
                        d3.select("#homogeneity.loading").attr("display", "none");                     
                        
                        drawComputingResultsImage();
                    
                        if((experimentalDesign == "within-groups") && sampleSizesAreEqual)
                        {      
                            if(!pairwiseComparisons)
                                performWilcoxonTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]]);
                            else
                                performPairwiseWilcoxTest("TRUE", "TRUE");
                        }
                        else
                        {
                            if(!pairwiseComparisons)
                                performMannWhitneyTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]]);
                            else
                                performPairwiseWilcoxTest("TRUE", "FALSE");
                        }                                        
                    }
                }
        
      }).fail(function(){
          alert("Failure: " + req.responseText);
    });

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
    req.complete(function(){
        
    });
}

function performHomoscedasticityTestNormal(dependent, independent)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performHomoscedasticityTest", {
                    dependentVariable: dependent,
                    independentVariable: independent,
                    dataset: dataset                    
                  }, function(output) {                                 
                  
                console.log("\t\t Levene's test for (" + dependent + " ~ " + independent + ")");
                console.log("\t\t\t p = " + output.p);
                
                variableList = getSelectedVariables();
                
                if(variableList["independent"].length == 2)
                {
                    if(output.p < 0.05)
                    {        
                        setHomogeneityOfVariances(dependent, independent, false);
                    }
                    else
                    {   
                        setHomogeneityOfVariances(dependent, independent, true);
                    }
                }                
                
                else
                {                                
                    if(variableList["independent-levels"].length > 2)
                    {
                        if(output.p < 0.05)
                        {
                            d3.select("#homogeneity.crosses").attr("display", "inline");
                            d3.select("#homogeneity.loading").attr("display", "none"); 
                            
                            drawComputingResultsImage();
                            
                            if((experimentalDesign == "within-groups") && sampleSizesAreEqual)
                            {
                                performOneWayRepeatedMeasuresANOVA(variableList["dependent"][0], variableList["independent"][0]);
                            }
                            else
                            {
                                performWelchANOVA(variableList["dependent"][0], variableList["independent"][0]);
                            }  
                        }
                        else
                        {   
                            //equal variances
                            d3.select("#homogeneity.ticks").attr("display","inline");
                            d3.select("#homogeneity.loading").attr("display", "none"); 
                    
                            drawComputingResultsImage();
                            
                            if((experimentalDesign == "within-groups") && sampleSizesAreEqual)
                            {
                                performOneWayRepeatedMeasuresANOVA(variableList["dependent"][0], variableList["independent"][0]);
                            }
                            else
                            {
                                performANOVA(variableList["dependent"][0], variableList["independent"][0]);
                            }                                        
                        }
                    }
                    else
                    {               
                        if(output.p < 0.05)
                        {
                            d3.select("#homogeneity.crosses").attr("display", "inline");  
                            d3.select("#homogeneity.loading").attr("display", "none"); 
                        
                            d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight*1.5);
                            
                            //draw boxplots in red 
                            drawHomogeneityPlot(variableList["dependent"][0], "dataset", "notnormal");
                            console.log("checkpoint 2");
                
                            findTransformForHomogeneity(variableList["dependent"][0], variableList["independent"][0]);
                        }
                        else
                        {   
                            //equal variances
                            d3.select("#homogeneity.ticks").attr("display","inline");
                            d3.select("#homogeneity.loading").attr("display", "none"); 
                    
                            drawComputingResultsImage();
                            
                            if((experimentalDesign == "within-groups") && sampleSizesAreEqual)
                            {
                                if(!pairwiseComparisons)
                                    performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "TRUE", "TRUE");
                                else
                                    performPairwiseTTest("TRUE", "TRUE");
                            }
                            else
                            {
                                if(!pairwiseComparisons)
                                    performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "TRUE", "FALSE");
                                else
                                    performPairwiseTTest("TRUE", "FALSE");
                            }                                        
                        }
                    }
                }
        
      }).fail(function(){
          alert("Failure: " + req.responseText);
    });

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
    req.complete(function(){
        
    });
}

function performNormalityTest(distribution, dependentVariable, level)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performShapiroWilkTest", {
                    distribution: distribution                                                           
                  }, function(output) {                                                   
                  
                console.log("\t\t Shapiro-wilk test for (" + dependentVariable + "." + level + ")");
                console.log("\t\t\t p = " + output.p);
                
                var variableList = getSelectedVariables(); 
                
                if(output.p < 0.05)
                {   
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
                  
      }).fail(function(){
          alert("Failure: " + req.responseText);
    });
        

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
    req.complete(function(){
        
    });
}

function findTransformForNormality(dependentVariable, independentVariable)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("findTransformForNormality", {
                    dependentVariable: dependentVariable,
                    independentVariable: independentVariable,
                    dataset: dataset
                  }, function(output) {                                                   
                
                var variableList = getSelectedVariables();
                
                if(output.type == "none")
                {
                    console.log("Transformation to normality is not possible!");
                    performHomoscedasticityTestNotNormal(variableList["dependent"][0], variableList["independent"][0]);
                    d3.select("#plotCanvas").transition().delay(3000).duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
                }
                else
                {
                    console.log("Transformation type = " + output.type);
                    transformationType = output.type;
                    
                    //offer choice
                    drawButtonInSideBar("TRANSFORM TO NORMAL DISTRIBUTIONS", "transformToNormal");
                }                  
      }).fail(function(){
          alert("Failure: " + req.responseText);
    });       

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
    req.complete(function(){
        
    });
}

function findTransformForHomogeneity(dependentVariable, independentVariable)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("findTransformForHomogeneity", {
                    dependentVariable: dependentVariable,
                    independentVariable: independentVariable,
                    dataset: dataset
                  }, function(output) {                                                   
                
                var variableList = getSelectedVariables();
                
                if(output.type == "none")
                {
                    console.log("Transformation to homogeneity is not possible!");
                    
                    d3.select("#homogeneity.crosses").attr("display", "inline"); 
                    d3.select("#homogeneity.loading").attr("display", "none"); 
                    
                    d3.select("#plotCanvas").transition().delay(3000).duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
                    
                    drawComputingResultsImage();
                    var normal = d3.select("#normality.crosses").attr("display") == "inline" ? false : true;
                    
                    console.log("normality:" + normal);
                    
                    if(!normal)
                    {
                        if((experimentalDesign == "within-groups") && sampleSizesAreEqual)
                        {   
                            if(!pairwiseComparisons)
                                performWilcoxonTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]]);
                            else
                                performPairwiseWilcoxTest("FALSE", "TRUE");
                        }
                        else
                        {
                            if(!pairwiseComparisons)
                                performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "FALSE");
                            else
                                performPairwiseWilcoxTest("FALSE", "FALSE");
                        } 
                    }
                    else
                    {
                        if((experimentalDesign == "within-groups") && sampleSizesAreEqual)
                        {
                            if(!pairwiseComparisons)
                                performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "FALSE", "TRUE");
                            else
                                performPairwiseTTest("TRUE", "TRUE");
                        }
                        else
                        {
                            if(!pairwiseComparisons)
                                performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "FALSE", "FALSE");
                            else
                                performPairwiseTTest("TRUE", "FALSE");
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
      }).fail(function(){
          alert("Failure: " + req.responseText);
    });       

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
    req.complete(function(){
        
    });
}

function findTransformForNormalityForDependentVariables(numericVariables)
{
    console.log("numeric variables = [" + numericVariables + "]");
    // Get variable names and their data type
    var req = opencpu.r_fun_json("findTransformForNormalityForDependentVariables", {                    
                    dataset: dataset,
                    numericVariables: numericVariables
                  }, function(output) {                                                   
                                  
                var variableList = getSelectedVariables();
                
                if(output.type == "none")
                {
                    console.log("Transformation to normality is not possible!");
                    d3.select("#plotCanvas").transition().delay(3000).duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);                    
                    setTimeout(
                    function(){
                                  drawDialogBoxToGetPopulationMean();
                              }, 4000);
                }
                else
                {
                    console.log("Transformation type = " + output.type);                    
                    transformationType = output.type;
                    
                    //offer choice
                    drawButtonInSideBar("TRANSFORM TO NORMAL DISTRIBUTIONS", "transformToNormal");                         
                }
                  
      }).fail(function(){
          alert("Failure: " + req.responseText);
    });
        

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
    req.complete(function(){
        
    });
}

function applyNormalityTransform(dependentVariable, level, finalVariable)
{
    // Get variable names and their data type
    
    var req = opencpu.r_fun_json("applyTransform", {
                    distribution: variables[dependentVariable][level],
                    type: transformationType
                  }, function(output) {                                                                  
                variables[dependentVariable][level] = output.transformedData;
                
                MIN[dependentVariable][level] = Array.min(output.transformedData);
                MAX[dependentVariable][level] = Array.max(output.transformedData);
                IQR[dependentVariable][level] = findIQR(output.transformedData);
                CI[dependentVariable][level] = findCI(output.transformedData);
                
                if(finalVariable)
                {
                    //if this is the last variable, then redraw boxplots and display the significance test results
                    redrawBoxPlot();
                    
                    removeElementsByClassName("densityCurve");
                    var variableList = getSelectedVariables();
                    
                    var mean = d3.select("#" + variableList["dependent"][0] + ".means");
                    var centerX = mean.attr("cx");   
                    
                    if(variableList["independent"].length > 0)
                    {
                        for(var i=0; i<variableList["independent-levels"].length; i++)
                        {   
                            if(distributions[dependentVariable][variableList["independent-levels"][i]] == false)
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
                        if(variableList["independent"].length > 0)
                            performHomoscedasticityTestNormal(dependentVariable, variableList["independent"][0]);
                        else
                            drawDialogBoxToGetPopulationMean();
                    }, 3000);
                }            
                  
      }).fail(function(){
          alert("Failure: " + req.responseText);
    });
        

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
    req.complete(function(){
        
    });
}

function applyHomogeneityTransform(dependentVariable, level, finalVariable)
{
    // Get variable names and their data type
    console.log("level = " + level);
    var req = opencpu.r_fun_json("applyTransform", {
                    distribution: variables[dependentVariable][level],
                    type: transformationType
                  }, function(output) {                                                                  
                variables[dependentVariable][level] = output.transformedData;
                
                MIN[dependentVariable][level] = Array.min(output.transformedData);
                MAX[dependentVariable][level] = Array.max(output.transformedData);
                IQR[dependentVariable][level] = findIQR(output.transformedData);
                CI[dependentVariable][level] = findCI(output.transformedData);
                
                //if this is the last variable, then redraw boxplots and display the significance test results
                if(finalVariable)
                {
                    redrawBoxPlot();
                
                    removeElementsByClassName("homogeneityPlot");
                    var variableList = getSelectedVariables();
                
                    var mean = d3.select("#" + variableList["dependent"][0] + ".means");
                    var centerX = mean.attr("cx");   
                
                    // if(variableList["independent"].length > 0)
    //                 {
    //                     for(var i=0; i<variableList["independent-levels"].length; i++)
    //                     {   
    //                         if(distributions[dependentVariable][variableList["independent-levels"][i]] == false)
    //                             makeHistogramWithDensityCurve(centerX - normalityPlotWidth/2, canvasHeight + normalityPlotOffset, normalityPlotWidth, normalityPlotHeight, variableList["dependent"][0], variableList["independent-levels"][i], "normal");//left, top, histWidth, histHeight, dependentVariable, level;
    //                     }                 
    //                 }
    //                 else
    //                 {
    //                     makeHistogramWithDensityCurve(centerX - normalityPlotWidth/2, canvasHeight + normalityPlotOffset, normalityPlotWidth, normalityPlotHeight, variableList["dependent"][0], "dataset", "normal");
    //                 }
                
                    removeElementsByClassName("transformToHomogeneity");
                    removeElementsByClassName("completeLines");
                
                    //change the labels to normal color
    //                 var text = d3.select("#" + level + ".xAxisGrooveText");
    //                 text.attr("fill", boxColors["normal"]);
                
                    //modify the assumptions checklist icons
                    d3.select("#homogeneity.crosses").attr("display", "none");  
                    d3.select("#homogeneity.ticks").attr("display", "inline");  
                    d3.select("#homogeneity.loading").attr("display", "none");                                        
                
                    d3.select("#plotCanvas").transition().delay(2000).duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
                
                    setTimeout(function()
                    {
                        if(variableList["independent"].length > 0)
                        {
                            if((experimentalDesign == "within-groups") && sampleSizesAreEqual)
                            {
                                if(!pairwiseComparisons)
                                    performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "FALSE", "TRUE");
                                else
                                    performPairwiseTTest("FALSE", "TRUE");
                            }
                            else
                            {
                                if(!pairwiseComparisons)
                                    performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "FALSE", "FALSE");
                                else
                                    performPairwiseTTest("FALSE", "FALSE");
                            }
                        }
                        else
                            drawDialogBoxToGetPopulationMean();
                    }, 3000);
                }
                           
                  
      }).fail(function(){
          alert("Failure: " + req.responseText);
    });
        

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
    req.complete(function(){
        
    });
}

function writeToFile(fileName)
{
    //loads the file and returns the dataset and variable names
    console.dir(log);
    var req = opencpu.r_fun_json("writeToFile", {
                    object: log,
                    fileName: fileName
                  }, function(output) {
    
     }).fail(function(){
          alert("Failure: " + req.responseText);
    });

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
    req.complete(function(){
    });
}