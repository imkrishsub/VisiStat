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
                d3.select("#loadingnormality").attr("display", "none");
        
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
                d3.select("#loadingnormality").attr("display", "none");
        
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
                    d3.select("#loadingnormality").attr("display", "none");
        
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
                    d3.select("#loadingnormality").attr("display", "none");
        
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
            d3.select("#plotCanvas").transition().delay(3000).duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
            
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
        d3.select("#loadingnormality").attr("display", "none");                                        
        
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
        d3.select("#homogeneity.ticks").attr("display", "none");  
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