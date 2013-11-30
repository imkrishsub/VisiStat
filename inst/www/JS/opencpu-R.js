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
        getIQR(dataset, output.variableNames[i]);  
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

//to get the variable names    
function getVariables(dataset)
{   
    // Get variable names and their data type
    var req = opencpu.r_fun_json("getVariableNames", {
                    dataset: dataset
                  }, function(output) {                   
    renderVariableNames(output.varNames);
    
    variableNames = output.varNames;
    
    
    for(var i=0; i<output.varNames.length; i++)
    {
        getData(dataset, output.varNames[i]);                 
        getIQR(dataset, output.varNames[i]);                    
    }
    
    console.log("\n\n*********************************************************************************\n\n") 
    
    }).fail(function(){
          alert("Failure: " + req.responseText);
    });

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
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
        
        if(++ticker == getObjectLength(variableNames))
        {
            setVariableTypes();
            setVariableDataTypes();
            
            for(var i=0; i<variableNames.length; i++)
            {
                CI[variableNames[i]]["dataset"] = findCI(variables[variableNames[i]]["dataset"]);   
            }
            
            testForEvilVariables();
            
//             clearInterval(loadingDataAnimation);
            
            removeElementsByClassName("loadingAnimation");
            removeElementById("loadingImage");
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

function getIQR(dataset, variableName, level)
{
    if(level === undefined)
    {   
        level = "dataset";
    }         
    IQR[variableName][level] = findIQR(dataset[variableName]);      
}

function getCI(dataset, variableName, level)
{
    if(level == undefined)
        level = "dataset";
        
    var req = opencpu.r_fun_json("getCI", {
                    dataset: dataset,
                    variableName: variableName
                  }, function(output) {                    
        
        CI[variableName][level] = new Array();
        
        CI[variableName][level][0] = output.min;
        CI[variableName][level][1] = output.max;
                
     }).fail(function(){
          alert("Failure: " + req.responseText);
    });

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
}  

//Split data - R based   
// function subsetDataByLevelsOfVariable(dataset, variableName, level)
// {   
//     console.log("dataset=" + dataset + ", variableName=" + variableName);
//     // Get variable names and their data type
//     var req = opencpu.r_fun_json("subsetDataByLevelsOfVariable", {
//                     dataset: dataset,
//                     variable: variableName,
//                     level: level
//                   }, function(output) {                  
//                 
//       console.log("split data: \t");
//       console.dir(output.splitData);
//       
// //            getIQR(splitData[value], variableNames[i],value);                
//       
//                 
//      });  
// }

//Statistics

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
                console.log("\t\t\t p = " + output.p);
                
                variableList = getSelectedVariables();
                
                if(variableList["independent-levels"].length > 2)
                {
                    if(output.p < 0.05)
                    {
                        d3.select("#homogeneity.crosses").attr("display", "inline");                  
                        d3.select("#homogeneity.loading").attr("display", "none");                  
                        
                        drawComputingResultsImage();
                        
                        if((experimentalDesign == "between-groups") && sampleSizesAreEqual)
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
                    
                        if((experimentalDesign == "between-groups") && sampleSizesAreEqual)
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
                        
                        if((experimentalDesign == "between-groups") && sampleSizesAreEqual)
                        {                        
                            performWilcoxonTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]]);
                        }
                        else
                        {
                            performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "FALSE");
                        }                         
                    }
                    else
                    {   
                        //equal variances
                        d3.select("#homogeneity.ticks").attr("display","inline");
                        d3.select("#homogeneity.loading").attr("display", "none");                     
                        
                        drawComputingResultsImage();
                    
                        if((experimentalDesign == "between-groups") && sampleSizesAreEqual)
                        {                        
                            performWilcoxonTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]]);
                        }
                        else
                        {
                            performMannWhitneyTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]]);
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
    console.log("dependent = " + dependent + ", independent = " + independent);
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performHomoscedasticityTest", {
                    dependentVariable: dependent,
                    independentVariable: independent,
                    dataset: dataset                    
                  }, function(output) {                                 
                  
                console.log("\t\t Levene's test for (" + dependent + " ~ " + independent + ")");
                console.log("\t\t\t p = " + output.p);
                
                
                
                variableList = sort(currentVariableSelection);
                
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
                
                    variableList = getSelectedVariables();
                    console.log("number of levels: " + variableList["independent-levels"].length);
                
                    if(variableList["independent-levels"].length > 2)
                    {
                        if(output.p < 0.05)
                        {
                            d3.select("#homogeneity.crosses").attr("display", "inline");
                            d3.select("#homogeneity.loading").attr("display", "none"); 
                            
                            drawComputingResultsImage();
                            
                            if((experimentalDesign == "between-groups") && sampleSizesAreEqual)
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
                            
                            if((experimentalDesign == "between-groups") && sampleSizesAreEqual)
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
                            
                            drawComputingResultsImage();
                            
                            if((experimentalDesign == "between-groups") && sampleSizesAreEqual)
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
                        {   
                            //equal variances
                            d3.select("#homogeneity.ticks").attr("display","inline");
                            d3.select("#homogeneity.loading").attr("display", "none"); 
                    
                            drawComputingResultsImage();
                            
                            if((experimentalDesign == "between-groups") && sampleSizesAreEqual)
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

function performNormalityTest(dist, dependentVariable, level)
{
    // Get variable names and their data type
    
    
    var req = opencpu.r_fun_json("performShapiroWilkTest", {
                    distribution: dist                                                           
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
                
                        findTransformForDependentVariables(getNumericVariables());
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

function findTransform(dependentVariable, independentVariable)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("findTransform", {
                    dependentVariable: dependentVariable,
                    independentVariable: independentVariable,
                    dataset: dataset
                  }, function(output) {                                                   
                  
                console.log("type=" + output.type);
                
                if(output.type == "none")
                {
                    var variableList = getSelectedVariables();
                    performHomoscedasticityTestNotNormal(variableList["dependent"][0], variableList["independent"][0]);
                    d3.select("#plotCanvas").transition().delay(3000).duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
                }
                else
                {
                    console.log("type=" + output.type);
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

function findTransformForDependentVariables(numericVariables)
{
    console.log("numeric variables = [" + numericVariables + "]");
    // Get variable names and their data type
    var req = opencpu.r_fun_json("findTransformForDependentVariables", {                    
                    dataset: dataset,
                    numericVariables: numericVariables
                  }, function(output) {                                                   
                  
                console.log("type=" + output.type);
                
                var variableList = getSelectedVariables();
                
                if(output.type == "none")
                {
                    d3.select("#plotCanvas").transition().delay(3000).duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
                    
                    setTimeout(
                    function(){
                    drawDialogBoxToGetPopulationMean();
                    }, 3800);
                }
                else
                {
                    console.log("type=" + output.type);
                    
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
function applyTransform(dependentVariable, level, last)
{
    // Get variable names and their data type
    
    var req = opencpu.r_fun_json("applyTransform", {
                    distribution: variables[dependentVariable][level],
                    type: transformationType
                  }, function(output) {                                                   
                
                console.log("\nvariables[dependentVariable][level]: " + variables[dependentVariable][level]);
                console.log("output.transformedData: " + output.transformedData);
                variables[dependentVariable][level] = output.transformedData;
                MIN[dependentVariable][level] = Array.min(output.transformedData);
                MAX[dependentVariable][level] = Array.max(output.transformedData);
                IQR[dependentVariable][level] = findIQR(output.transformedData);
                CI[dependentVariable][level] = findCI(output.transformedData);
                
                if(last)
                {
                    redrawBoxPlot();
                    
                    removeElementsByClassName("densityCurve");
                    var variableList = getSelectedVariables();
                    
                    if(variableList["independent"].length > 0)
                    {
                        for(var i=0; i<variableList["independent-levels"].length; i++)
                        {   
                            if(distributions[dependentVariable][variableList["independent-levels"][i]] == false)
                            {
                                var mean = d3.select("#" + variableList["independent-levels"][i] + ".means");
                                var centerX = mean.attr("cx");   
                                makeHistogramWithDensityCurve(centerX - normalityPlotWidth/2, canvasHeight + normalityPlotOffset, normalityPlotWidth, normalityPlotHeight, variableList["dependent"][0], variableList["independent-levels"][i], "normal");//left, top, histWidth, histHeight, dependentVariable, level;
                            }
                        }                 
                    }
                    else
                    {
                        var mean = d3.select("#" + variableList["dependent"][0] + ".means");
                        var centerX = mean.attr("cx");   
                        makeHistogramWithDensityCurve(centerX - normalityPlotWidth/2, canvasHeight + normalityPlotOffset, normalityPlotWidth, normalityPlotHeight, variableList["dependent"][0], "dataset", "normal");
                    }
                    
                    removeElementsByClassName("transformToNormal");
                    removeElementsByClassName("completeLines");
                    
                    var text = d3.select("#" + level + ".xAxisGrooveText");
                    text.attr("fill", boxColors["normal"]);
                    
                    d3.select("#normality.crosses").attr("display", "none");  
                    d3.select("#normality.ticks").attr("display", "inline");  
                    d3.select("#normality.loading").attr("display", "none");
                    var variableList = sort(currentVariableSelection);                                        
                    
                    d3.select("#plotCanvas").transition().delay(2000).duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
                    
                    setTimeout(function()
                    {
                        if(variableList["independent"].length > 0)
                            performHomoscedasticityTestNormal(dependentVariable, variableList["independent"][0]);
                        else
                            drawDialogBoxToGetPopulationMean();
                    }, 1500);
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