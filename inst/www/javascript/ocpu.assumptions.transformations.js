//perform levene's test, p < 0.05 => not homogeneous
function performHomoscedasticityTest(dependent, independent)
{   
    var variableList = getSelectedVariables(); 
    var formula = "levene(" + dependent + "," + independent + ")";
    
    //get variable names and their data type
    if(sessionStorage.getObject(formula) == null)
    {
        var req = ocpu.rpc("performHomoscedasticityTest", 
        {
           dependentVariable: dependent,
           independentVariable: independent,
           dataset: dataset                    
        }, function(output) 
        { 
           sessionStorage.setObject(formula, output.p);
           if(output.p < 0.05)
           {   
               //not normal
               if(variableList["independent"].length() == 0)
               {
                   //one sample t-test
                    d3.select("#homogeneity.crosses").attr("display", "inline");
                    d3.select("#homogeneity.assumptionsViolationText").attr("display", "inline");

                    if(d3.select("#normality.assumptionsViolationText").attr("display") == "inline")
                    {
                        d3.selectAll(".assumptionsViolationText").attr("display", "none");
                        d3.select("#bothAssumptions.assumptionsViolationText").attr("display", "inline");
                    }

                    d3.select("#homogeneity.loading").attr("display", "none");
                
                    if(sessionStorage.plotWithNoInteraction == "false")
                       d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight*1.5);
       
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
               if(variableList["independent"].length() == 0)
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
    else
    {
        var p = sessionStorage.getObject(formula);

        if(p < 0.05)
        {   
            //not normal
            if(variableList["independent"].length() == 0)
            {
               //one sample t-test
               d3.select("#homogeneity.crosses").attr("display", "inline");
if(d3.select("#normality.assumptionsViolationText").attr("display") == "inline")
{
    d3.selectAll(".assumptionsViolationText").attr("display", "none");
    d3.select("#bothAssumptions.assumptionsViolationText").attr("display", "inline");
}
               d3.select("#homogeneity.loading").attr("display", "none");
                
                if(sessionStorage.plotWithNoInteraction == "false")
                   d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight*1.5);
   
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
           if(variableList["independent"].length() == 0)
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
    }
}

//perform shapiro-wilk test, p < 0.05 => not normal
function performNormalityTest(distribution, dependentVariable, level)
{     
    var variableList = getSelectedVariables(); 
    var formula = "shapiro(" + dependentVariable + "," + level +")";
    // Get variable names and their data type

    if(sessionStorage.getObject(formula) == null)
    {
        var req = ocpu.rpc("performShapiroWi lkTest", 
        {
            distribution: distribution                                                           
        }, function(output) 
        {                                                   
            
            sessionStorage.setObject(formula, output.p);
            
            if(output.p < 0.05)
            {   
                //not normal
                if(variableList["independent"].length() == 0)
                {
                    //one sample t-test
                    d3.select("#normality.crosses").attr("display", "inline");
                    d3.select("#normality.assumptionsViolationText").attr("display", "inline");
                    d3.select("#loadingnormality").attr("display", "none");
                    
                    if(sessionStorage.plotWithNoInteraction == "false")                
                        d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight*1.5);

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
                if(variableList["independent"].length() == 0)
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
    else
    {
        var p = sessionStorage.getObject(formula);

        if(p < 0.05)
        {   
            //not normal
            if(variableList["independent"].length() == 0)
            {
                //one sample t-test
                d3.select("#normality.crosses").attr("display", "inline");
d3.select("#normality.assumptionsViolationText").attr("display", "inline");
                d3.select("#loadingnormality").attr("display", "none");
                
                if(sessionStorage.plotWithNoInteraction == "false")
                    d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight*1.5);

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
            if(variableList["independent"].length() == 0)
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
    }
}

//perform shapiro-wilk test (we combine all distributions here for efficiency)
function performNormalityTestForMultipleDistributions(distributions, n)
{
    // Get variable names and their data type        
    var variableList = getSelectedVariables();
    var dependentVariable = variableList["dependent"][0];
    var levels = variableList["independent-levels"];
    var formula = "shapiro(" + n + "," + mean(distributions) + ")"; //TODO: calculate checksum of distributions

    if(sessionStorage.getObject(formula) == null)
    {        
        var req = ocpu.rpc("performShapiroWilkTestForMultipleDistributions", 
        {
            distributions: distributions,
            n: n
        }, function(output) 
        {                                                                     
            var pValues = output.p;
            sessionStorage.setObject(formula, pValues);

            for(var i=0; i<pValues.length(); i++)
            {    
                if(pValues[i] < 0.05)
                {   
                    //not normal
                    if(variableList["independent"].length() == 0)
                    {
                        //one sample t-test
                        d3.select("#normality.crosses").attr("display", "inline");
d3.select("#normality.assumptionsViolationText").attr("display", "inline");
                        d3.select("#loadingnormality").attr("display", "none");
                        
                        if(sessionStorage.plotWithNoInteraction == "false")
                            d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight*1.5);

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
                    if(variableList["independent"].length() == 0)
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
    else
    {
        var pValues = sessionStorage.getObject(formula);

        for(var i=0; i<pValues.length(); i++)
        {    
            if(pValues[i] < 0.05)
            {   
                //not normal
                if(variableList["independent"].length() == 0)
                {
                    //one sample t-test
                    d3.select("#normality.crosses").attr("display", "inline");
d3.select("#normality.assumptionsViolationText").attr("display", "inline");
                    d3.select("#loadingnormality").attr("display", "none");
                    
                    if(sessionStorage.plotWithNoInteraction == "false")
                        d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight*1.5);

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
                if(variableList["independent"].length() == 0)
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
    }
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
    var variableList = getSelectedVariables();
    var formula = "findNormalityTransform(" + dependentVariable + "," + independentVariable + ")";

    if(sessionStorage.getObject(formula) == null)
    {
        // Get variable names and their data type
        var req = ocpu.rpc("findTransformForNormality", 
        {
            dependentVariable: dependentVariable,
            independentVariable: independentVariable,
            dataset: dataset
        }, function(output) 
        {   
            sessionStorage.setObject(formula, output);

            if(output.type == "none")
            {
                console.log("Transformation to normality is not possible!");

                if(sessionStorage.plotWithNoInteraction == "false")
                    d3.select("#plotCanvas").transition().delay(3000).duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight);
                
                if(variableList["independent"].length() == 1)
                {
                    if((experimentalDesign == "within-groups") && (variableList["independent"][0] == getWithinGroupVariable(variableList)))
                    {
                        //within-group design
                        if(variableList["independent-levels"].length() == 2)
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
                        if(variableList["independent-levels"].length() == 2)
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
                else if(variableList["independent"].length() == 2)
                {
                    if((experimentalDesign == "within-groups") && (variableList["independent"][0] == getWithinGroupVariable(variableList)))
                    {
                        //within-group design
                    
                    }                       
                    else if(d3.select("#homogeneity.ticks").attr("display") == "inline")
                    {
                        //between-groups design
                        if(variableList["independent-levels"].length() == 2)
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
                drawButtonInSideBar("Transform to Normal Distributions", "transformToNormal");
                drawButtonInSideBar("Do not Transform", "dontTransformToNormal", 1);
            }                  
        })
          
        //if R returns an error, alert the error message
        req.fail(function()
        {
            alert("Server error: " + req.responseText);
        });
    }
    else
    {
        var output = sessionStorage.getObject(formula);

        if(output.type == "none")
        {
            console.log("Transformation to normality is not possible!");

            if(sessionStorage.plotWithNoInteraction == "false")
                d3.select("#plotCanvas").transition().delay(3000).duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight);
            
            if(variableList["independent"].length() == 1)
            {
                if((experimentalDesign == "within-groups") && (variableList["independent"][0] == getWithinGroupVariable(variableList)))
                {
                    //within-group design
                    if(variableList["independent-levels"].length() == 2)
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
                    if(variableList["independent-levels"].length() == 2)
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
            else if(variableList["independent"].length() == 2)
            {
                if((experimentalDesign == "within-groups") && (variableList["independent"][0] == getWithinGroupVariable(variableList)))
                {
                    //within-group design
                
                }                       
                else if(d3.select("#homogeneity.ticks").attr("display") == "inline")
                {
                    //between-groups design
                    if(variableList["independent-levels"].length() == 2)
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
            drawButtonInSideBar("Transform to Normal Distributions", "transformToNormal");
            drawButtonInSideBar("Do not Transform", "dontTransformToNormal", 1);
        } 
    }
}
    
//finds if there is a possible transformation to homogeneity of distributions    
function findTransformForHomogeneity(dependentVariable, independentVariable)
{ 
    var variableList = getSelectedVariables();
    var formula = "findHomogeneityTransform(" + dependentVariable + "," + independentVariable + ")";

    if(sessionStorage.getObject(formula) == null)
    {
        // Get variable names and their data type
        var req = ocpu.rpc("findTransformForHomogeneity", 
        {
            dependentVariable: dependentVariable,
            independentVariable: independentVariable,
            dataset: dataset
        }, function(output) 
        {   
            sessionStorage.setObject(formula, output);

            if(output.type == "none")
            {
                console.log("Transformation to homogeneity is not possible!");
                
                if(sessionStorage.plotWithNoInteraction == "false")
                    d3.select("#plotCanvas").transition().delay(3000).duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight);
                                
                if(variableList["independent"].length() == 1)
                {
                    if(experimentalDesign == "between-groups")
                    {
                        performNormalityTests();
                
                        //between-groups design
                        if(variableList["independent-levels"].length() == 2)
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
                    if(experimentalDesign == "between-groups" && variableList["independent-levels"].length() == 2)
                    {
                        performNormalityTests();
                        
                        //2 variables
                        var groups = getGroupsForColourBoxPlotData();
                    
                        if(pairwiseComparisons)
                            performPairwiseTTest("FALSE", "FALSE");
                        else
                            performTTest(groups[0], groups[1], "FALSE", "FALSE");
                    }
                }
            }                
            else
            {
                console.log("Transformation type = " + output.type);
                transformationType = output.type;
            
                //offer choice
                drawButtonInSideBar("Transform to Homogeneous Distributions", "transformToHomogeneity");
                drawButtonInSideBar("Do not Transform", "dontTransformToHomogeneity", 1);
            }                  
        });
        
        //if R returns an error, alert the error message
        req.fail(function()
        {
            alert("Server error: " + req.responseText);
        });
    }
    else
    {
        var output = sessionStorage.getObject(formula);

        if(output.type == "none")
        {
            console.log("Transformation to homogeneity is not possible!");
        
            if(sessionStorage.plotWithNoInteraction == "false")
                d3.select("#plotCanvas").transition().delay(3000).duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight);
                            
            if(variableList["independent"].length() == 1)
            {
                if(experimentalDesign == "between-groups")
                {
                    performNormalityTests();
            
                    //between-groups design
                    if(variableList["independent-levels"].length() == 2)
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
                if(experimentalDesign == "between-groups" && variableList["independent-levels"].length() == 2)
                {
                    performNormalityTests();
                    
                    //2 variables
                    var groups = getGroupsForColourBoxPlotData();
                
                    if(pairwiseComparisons)
                        performPairwiseTTest("FALSE", "FALSE");
                    else
                        performTTest(groups[0], groups[1], "FALSE", "FALSE");
                }
            }
        }                
        else
        {
            console.log("Transformation type = " + output.type);
            transformationType = output.type;
        
            //offer choice
            drawButtonInSideBar("Transform to Homogeneous Distributions", "transformToHomogeneity");
            drawButtonInSideBar("Do not Transform", "dontTransformToHomogeneity", 1);
        } 
    }
}

//applies a transform to distributions
function applyNormalityTransform(dependentVariable, level, finalVariable)
{   
    var variableList = getSelectedVariables();
    var formula = "applyNormalityTransform(" + dependentVariable + "," + level + "," + finalVariable + ")";

    if(sessionStorage.getObject(formula) == null)
    { 
        var req = ocpu.rpc("applyTransform", 
        {
            distribution: variables[dependentVariable][level],
            type: transformationType
        }, function(output) 
        {
            sessionStorage.setObject(formula, output);

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
                
                if(variableList["independent"].length() > 0)
                {
                    for(var i=0; i<variableList["independent-levels"].length(); i++)
                    {                   
                        var centerX = d3.select("#" + variableList["independent-levels"][i] + ".means").attr("cx");                
                        makeHistogramWithDensityCurve(centerX - normalityPlotWidth/2, plotPanelHeight + normalityPlotOffset, normalityPlotWidth, normalityPlotHeight, variableList["dependent"][0], variableList["independent-levels"][i], "normal");//left, top, histWidth, histHeight, dependentVariable, level;                                
                    }                 
                }
                else
                {
                    makeHistogramWithDensityCurve(centerX - normalityPlotWidth/2, plotPanelHeight + normalityPlotOffset, normalityPlotWidth, normalityPlotHeight, variableList["dependent"][0], "dataset", "normal");
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
                
                if(sessionStorage.plotWithNoInteraction == "false")
                    d3.select("#plotCanvas").transition().delay(2000).duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight);
                
                setTimeout(function()
                {
                    if(variableList["independent"].length() == 1)
                    {
                        if((experimentalDesign == "within-groups") && (variableList["independent"][0] == getWithinGroupVariable(variableList)))
                        {
                            //within-group design
                            if(variableList["independent-levels"].length() == 2)
                            {
                                //Paired t-test
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
                                if(variableList["independent-levels"].length() == 2)
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
                    else if(variableList["independent"].length() == 2)
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
                                if(variableList["independent-levels"].length() == 2)
                                {
                                    var groups = getGroupsForColourBoxPlotData();
                                    //Unpaired t-test 
                                    
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
        });
        //if R returns an error, alert the error message
        req.fail(function()
        {
            alert("Server error: " + req.responseText);
        });  
    }
    else
    {
        var output = sessionStorage.getObject(formula);

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
            
            if(variableList["independent"].length() > 0)
            {
                for(var i=0; i<variableList["independent-levels"].length(); i++)
                {                   
                    var centerX = d3.select("#" + variableList["independent-levels"][i] + ".means").attr("cx");                
                    makeHistogramWithDensityCurve(centerX - normalityPlotWidth/2, plotPanelHeight + normalityPlotOffset, normalityPlotWidth, normalityPlotHeight, variableList["dependent"][0], variableList["independent-levels"][i], "normal");//left, top, histWidth, histHeight, dependentVariable, level;                                
                }                 
            }
            else
            {
                makeHistogramWithDensityCurve(centerX - normalityPlotWidth/2, plotPanelHeight + normalityPlotOffset, normalityPlotWidth, normalityPlotHeight, variableList["dependent"][0], "dataset", "normal");
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
            
            if(sessionStorage.plotWithNoInteraction == "false")
                d3.select("#plotCanvas").transition().delay(2000).duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight);
            
            setTimeout(function()
            {
                if(variableList["independent"].length() == 1)
                {
                    if((experimentalDesign == "within-groups") && (variableList["independent"][0] == getWithinGroupVariable(variableList)))
                    {
                        //within-group design
                        if(variableList["independent-levels"].length() == 2)
                        {
                            //Paired t-test
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
                            if(variableList["independent-levels"].length() == 2)
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
                else if(variableList["independent"].length() == 2)
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
                            if(variableList["independent-levels"].length() == 2)
                            {
                                var groups = getGroupsForColourBoxPlotData();
                                //Unpaired t-test 
                                
                                if(pairwiseComparisons)
                                    performPairwiseTTest("TRUE", "FALSE");
                                else
                                    performTTest(groups[0], groups[1], "TRUE", "FALSE");
                            }                                    
                        }
                    }
                }
            }, 0);
                    
        } 
    }  
}

//applies a transform to distributions
function applyHomogeneityTransform(dependentVariable, independentVariable)
{
    var variableList = getSelectedVariables();
    var formula = "applyHomogeneityTransform(" + dependentVariable + "," + independentVariable + ")";

    if(sessionStorage.getObject(formula) == null)
    {
        // Get variable names and their data type
        var req = ocpu.rpc("applyTransform", 
        {
            distribution: variables[dependentVariable]["dataset"],
            type: transformationType
        }, function(output) 
        {                 
            sessionStorage.setObject(formula, output);

            variables[dependentVariable]["dataset"] = output.transformedData;            
        
            MIN[dependentVariable]["dataset"] = Array.min(output.transformedData);
            MAX[dependentVariable]["dataset"] = Array.max(output.transformedData);
            IQR[dependentVariable]["dataset"] = findIQR(output.transformedData);
            CI[dependentVariable]["dataset"] = findCI(output.transformedData);
        
            var levels = variables[independentVariable]["dataset"].unique();
        
            for(i=0; i<levels.length(); i++)
            {
                variables[dependentVariable][levels[i]] = [];
                MIN[dependentVariable][levels[i]] = 999999;
                MAX[dependentVariable][levels[i]] = -999999;
            }
            
            subsetDataByLevels(independentVariable);
        
            //if this is the last variable, then redraw boxplots and display the significance test results
            redrawBoxPlot();

            removeElementsByClassName("homogeneityPlot");
            removeElementsByClassName("transformToHomogeneity");
            removeElementsByClassName("completeLines");

            //modify the assumptions checklist icons
            d3.select("#homogeneity.ticks").attr("display", "none");  
            d3.select("#homogeneity.ticks").attr("display", "inline");  
            d3.select("#homogeneity.loading").attr("display", "none");                                        

            if(sessionStorage.plotWithNoInteraction == "false")
                d3.select("#plotCanvas").transition().delay(2000).duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight);

            setTimeout(function()
            {
                if(variableList["independent"].length() == 1)
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
    else
    {
        var output = sessionStorage.getObject(formula);

        variables[dependentVariable]["dataset"] = output.transformedData;            
        
        MIN[dependentVariable]["dataset"] = Array.min(output.transformedData);
        MAX[dependentVariable]["dataset"] = Array.max(output.transformedData);
        IQR[dependentVariable]["dataset"] = findIQR(output.transformedData);
        CI[dependentVariable]["dataset"] = findCI(output.transformedData);
    
        var levels = variables[independentVariable]["dataset"].unique();
    
        for(i=0; i<levels.length(); i++)
        {
            variables[dependentVariable][levels[i]] = [];
            MIN[dependentVariable][levels[i]] = 999999;
            MAX[dependentVariable][levels[i]] = -999999;
        }
        
        subsetDataByLevels(independentVariable);
    
        //if this is the last variable, then redraw boxplots and display the significance test results
        redrawBoxPlot();

        removeElementsByClassName("homogeneityPlot");
        removeElementsByClassName("transformToHomogeneity");
        removeElementsByClassName("completeLines");

        //modify the assumptions checklist icons
        d3.select("#homogeneity.ticks").attr("display", "none");  
        d3.select("#homogeneity.ticks").attr("display", "inline");  
        d3.select("#homogeneity.loading").attr("display", "none");                                        

        if(sessionStorage.plotWithNoInteraction == "false")
            d3.select("#plotCanvas").transition().delay(2000).duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight);

        setTimeout(function()
        {
            if(variableList["independent"].length() == 1)
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
        }, 0);
    }     
}