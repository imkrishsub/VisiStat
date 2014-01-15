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
                    }, 1200);
                }
                
                break;
        case 1:
                //T-test
                {
                    console.log("\t Significance test for 2 variables\n\n");

                    //homoscedasticity
                    loadAssumptionCheckList("normal");
                    console.log("variableList[\"independent\"] = [" + variableList["independent"] + "]");
                    
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
                                        console.log("within-groups :)");
                                        //within-groups design
                                        setTimeout(function(){                    
                                            performNormalityTests();
                                        }, 1200);
                                        
                                    }
                                    else
                                    {
                                        console.log("between-groups :)");
                                        //between-groups design
                                        setTimeout(function(){                    
                                            performHomoscedasticityTest(variableList["dependent"][0], variableList["independent"][0]);
                                        }, 1200);
                                        
                                    }            
                                    break;    
                                }
                        case 2:
                                {  
                                    //get distributions     
                                    setTimeout(function(){                    
                                        performHomoscedasticityTests();
                                    }, 1200);       
                                    
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

                                        setTimeout(function(){                    
                                            performNormalityTests();
                                        }, 1200);                                
                                    }
                                    else
                                    {
                                        loadAssumptionCheckList("normal");
                                        //between-groups design
                                        setTimeout(function(){                    
                                            performHomoscedasticityTest(variableList["dependent"][0], variableList["independent"][0]);
                                        }, 1200);
                                        
                                    }            
                                    break;    
                                }
                        case 2:
                                {
                                    var selectedMeans = getSelectedMeansForColourBoxPlotData();
                                    var selectedMeanLevels = getSelectedMeanLevelsForColourBoxPlotData();
                
                                    var variableList = getSelectedVariables();                    
                                    var totalNumberOfLevels = variables[variableList["independent"][0]]["dataset"].unique().length * variables[variableList["independent"][1]]["dataset"].unique().length;
                
                                    if(isFactorialANOVA(variableList))
                                    {
                                        loadAssumptionCheckList("repeated measures");
                                        
                                        setTimeout(function(){                    
                                                performNormalityTests();
                                                performHomoscedasticityTests();
                                                setTimeout(function(){
                                                    performMixedDesignANOVA(variableList["dependent"][0], getWithinGroupVariable(variableList), getBetweenGroupVariable(variableList));
                                                }, 2000);                                                    
                                            }, 1200);
                                        
                                    }
                                    else
                                    {
                                        loadAssumptionCheckList("normal");                             

                                        setTimeout(function(){
                      
                                            performNormalityTests();
                                        }, 1200);                          

                                        // setTimeout(function(){
                                        //     
                                        // }, 3200);                                             
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
        }
        
        if(normal)
        {   
            // d3.select("#plotCanvas").transition().delay(2500).duration(1000).attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
                        
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
            else if(variableList["independent"].length == 2 && getSelectedMeansForColourBoxPlotData().length == 2) 
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

        if(variableList["independent"].length == 2)
        {
            //Factorial/2-way ANOVA
            var selectedMeans = getSelectedMeansForColourBoxPlotData();

            if(selectedMeans.length > 2)
            {
                if(isFactorialANOVA(variableList))
                {
                                           
                }
                else
                {
                    //2-way ANOVA
                    performHomoscedasticityTests();
                }    
            }            
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
            
            if((experimentalDesign == "between-groups" || getWithinGroupVariable(variableList) != variableList["independent"][0]) && variableList["independent"].length != 2)
            {
                //between-groups design
                if(pairwiseComparisons)
                    performNormalityTests();                    
                else
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

        if(variableList["independent"].length == 2)
        {
            var selectedMeans = getSelectedMeansForColourBoxPlotData();

            if(selectedMeans.length > 2)
            {
                if(isFactorialANOVA(variableList))
                {

                }
                else
                {
                    performTwoWayANOVA(variableList["dependent"][0], variableList["independent"][0], variableList["independent"][1]);                
                }
            }            
                                       
        }
    }    
}
