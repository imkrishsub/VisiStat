//to load a file on local disk
function loadFile(filePath)
{
    label = "file:" + sessionStorage.fileName;
    
    if(localStorage.getObject(label) == null)
    {
        //loads the file and returns the dataset and variable names
        var req = ocpu.rpc("loadFile", {
                        filePath: filePath
                      }, function(output) {                   
            localStorage.setObject(label, output);          
            
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
        req.fail(function(){
          alert("Server error: " + req.responseText);
        });
    }
    else
    {
        var output = localStorage.getObject(label);
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
    }
}

function getData(dataset, variableName, level)
{
    if(level === undefined)
    {   
        level = "dataset";
    }
    
    variables[variableName][level] = [];
    
    for(var i=0; i<dataset.length; i++)
    {
        variables[variableName][level].push(dataset[i][variableName]);  
    }
    
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
        console.log("\n\tEXPERIMENTAL DESIGN = " + experimentalDesign);
    }
}

function performHomoscedasticityTest(dependent, independent)
{   
    var variableList = getSelectedVariables(); 
    var label = "levene(" + dependent + "~" + independent + ")";
        
    if(localStorage.getItem(label) == null)
    {
        // Get variable names and their data type
        var req = ocpu.rpc("performHomoscedasticityTest", {
                        dependentVariable: dependent,
                        independentVariable: independent,
                        dataset: dataset                    
                      }, function(output) {                                 
                  
                    localStorage.setItem(label, output.p);
                
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
                            setHomogeneity(dependent, independent, false);
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
                            setHomogeneity(dependent, independent, true);
                        }
                    }
        
          });

        //if R returns an error, alert the error message
        req.fail(function(){
          alert("Server error: " + req.responseText);
        });
    }
    else
    {  
        setTimeout(function()
        {
            if(localStorage.getItem(label) < 0.05)
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
                    setHomogeneity(dependent, independent, false);
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
                    setHomogeneity(dependent, independent, true);
                }
            }
        
        }, 1500);        
    }   
}

function performNormalityTest(distribution, dependentVariable, level)
{
    var label = "shapiroWilk(" + dependentVariable + "~" + level + ")";
    
    if(localStorage.getItem(label) == null)
    {
        // Get variable names and their data type
        var req = ocpu.rpc("performShapiroWilkTest", {
                        distribution: distribution                                                           
                      }, function(output) {                                                   
                    
                    localStorage.setItem(label, output.p);
                
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
        req.fail(function(){
          alert("Server error: " + req.responseText);
        });
    }
    else
    {
        var variableList = getSelectedVariables(); 
        
        setTimeout(function()
        {
            if(localStorage.getItem(label) < 0.05)
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
        }, 1500);
    }
}

function performNormalityTestForMultipleDistributions(distributions, n)
{
    // Get variable names and their data type        
    var variableList = getSelectedVariables();
    var dependentVariable = variableList["dependent"][0];
    var levels = variableList["independent-levels"];
    
    var label = "norm" + dependentVariable + "~" + findIQR(distributions) + "~" + mean(n);
    
    if(localStorage.getObject(label) == null)
    {
        var req = ocpu.rpc("performShapiroWilkTestForMultipleDistributions", {
                        distributions: distributions,
                        n: n
                      }, function(output) {                                                                     
                        var pValues = output.p;
          
                        for(var i=0; i<pValues.length; i++)
                        {
                            localStorage.setObject(label, pValues[i]);
                    
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
        req.fail(function(){
          alert("Server error: " + req.responseText);
        });
    }
    else
    {
        setTimeout(function(){
            var pValues = [];
            for(var i=0; i<levels.length; i++)
            {
                pValues[i] = localStorage.getObject(label);
                    
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
        
        }, 1500);
        
        
    }
}

function performSphericityTest()
{
    var variableList = getSelectedVariables();
    
    // Get variable names and their data type
    var req = ocpu.rpc("performSphericityTest", {
                    dependentVariable: variableList["dependent"][0],
                    withinGroupVariable: getWithinGroupVariable(variableList),
                    betweenGroupVariable: getBetweenGroupVariable(variableList),
                    participantVariable: participants,
                    dataset: dataset
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

function findTransformForNormality(dependentVariable, independentVariable)
{
    var label = "findTNorm(" + dependentVariable + "~" + independentVariable + ")";
    
    if(localStorage.getObject(label) == null)
    {
        // Get variable names and their data type
        var req = ocpu.rpc("findTransformForNormality", {
                        dependentVariable: dependentVariable,
                        independentVariable: independentVariable,
                        dataset: dataset
                      }, function(output) {                                                   
                    localStorage.getObject(label, output);
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
    else
    {
        var output = localStorage.getObject(label);
        
        var variableList = getSelectedVariables();
                
        if(output.type == "none")
        {
            console.log("Transformation to normality is not possible!");
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
    }
}

function findTransformForHomogeneity(dependentVariable, independentVariable)
{
    var label = "findTHomo(" + dependentVariable + "~" + independentVariable + ")";
    
    if(localStorage.getObject(label) == null)
    {
        // Get variable names and their data type
        var req = ocpu.rpc("findTransformForHomogeneity", {
                        dependentVariable: dependentVariable,
                        independentVariable: independentVariable,
                        dataset: dataset
                      }, function(output) {                                                   
                    localStorage.setObject(label, output);
                    
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
    else
    {
        var output = localStorage.getObject(label);
        
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
    }
}

function findTransformForNormalityForDependentVariables(numericVariables)
{
    // Get variable names and their data type
    var req = ocpu.rpc("findTransformForNormalityForDependentVariables", {                    
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
    
    var label = "aNT " + dependentVariable + "." + level;
    
    if(localStorage.getObject(label) == null)
    {
        var req = ocpu.rpc("applyTransform", {
                        distribution: variables[dependentVariable][level],
                        type: transformationType
                      }, function(output) 
                    {
                        variables[dependentVariable][level] = output.transformedData;
                
                        MIN[dependentVariable][level] = Array.min(output.transformedData);
                        MAX[dependentVariable][level] = Array.max(output.transformedData);
                        IQR[dependentVariable][level] = findIQR(output.transformedData);
                        CI[dependentVariable][level] = findCI(output.transformedData);
                    
                        localStorage.setObject(label, output.transformedData);
                   }).fail(function(){
                   alert("Failure: " + req.responseText);
             });
    }
    else
    {
        variables[dependentVariable][level] = localStorage.getObject(label);
        
        MIN[dependentVariable][level] = Array.min(localStorage.getObject(label));
        MAX[dependentVariable][level] = Array.max(localStorage.getObject(label));
        IQR[dependentVariable][level] = findIQR(localStorage.getObject(label));
        CI[dependentVariable][level] = findCI(localStorage.getObject(label));
    }
    
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
                if(distributions[dependentVariable][variableList["independent-levels"][i]] == false)
                {
                    var centerX = d3.select("#" + variableList["independent-levels"][i] + ".means");
                    
                    console.log("centerX = " + centerX);
                    
                    makeHistogramWithDensityCurve(centerX - normalityPlotWidth/2, canvasHeight + normalityPlotOffset, normalityPlotWidth, normalityPlotHeight, variableList["dependent"][0], variableList["independent-levels"][i], "normal");//left, top, histWidth, histHeight, dependentVariable, level;                
                }
            }                 
        }
        else
        {
            makeHistogramWithDensityCurve(centerX - normalityPlotWidth/2, canvasHeight + normalityPlotOffset, normalityPlotWidth, normalityPlotHeight, variableList["dependent"][0], "dataset", "normal");
        }
        
        removeElementsByClassName("transformToNormal");
        removeElementsByClassName("completeLines");
        
        return; 
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
                            performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "TRUE", "TRUE");
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
}
function applyHomogeneityTransform(dependentVariable, independentVariable)
{
    level = "dataset";
    // Get variable names and their data type
    var req = ocpu.rpc("applyTransform", {
                    distribution: variables[dependentVariable][level],
                    type: transformationType
                  }, function(output) {                 
                variables[dependentVariable][level] = output.transformedData;            
                
                MIN[dependentVariable][level] = Array.min(output.transformedData);
                MAX[dependentVariable][level] = Array.max(output.transformedData);
                IQR[dependentVariable][level] = findIQR(output.transformedData);
                CI[dependentVariable][level] = findCI(output.transformedData);
                
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
    var req = ocpu.rpc("writeToFile", {
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