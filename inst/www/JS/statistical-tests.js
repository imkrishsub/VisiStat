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
                    console.log("\t Significance test for more than 2 variables...\n\n nana");
                    
                    //check if all means needs to be selected
                    var selectedMeans = getSelectedMeansForColourBoxPlotData();
                    var selectedMeanLevels = getSelectedMeanLevelsForColourBoxPlotData();
                    
                    console.log(selectedMeans.length);
                    
                    var variableList = getSelectedVariables();                    
                    var totalNumberOfLevels = variables[variableList["independent"][0]]["dataset"].unique().length * variables[variableList["independent"][1]]["dataset"].unique().length;
                    
                    console.log("selected=" + selectedMeans.length + ", total=" + totalNumberOfLevels);
                    
                    if(selectedMeans.length < totalNumberOfLevels && selectedMeans.length != 2)
                    {
                        var unSelectedMeans = getUnselectedMeansForColourBoxPlotData();
                        selectAllMeans();
                        setTimeout(function()
                        {
                            loadAssumptionCheckList();                    
                            performNormalityTests();
                        }, (unSelectedMeans.length+1)*1000);
                    }
                    else
                    {
                        loadAssumptionCheckList();                    
                        performNormalityTests();
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
        console.log("population median=" + populationValue);
        sessionStorage.popMedian = parseFloat(populationValue);
        
        removeElementsByClassName("dialogBox");
        
        performOneSampleWilcoxonTest(variableList["dependent"][0]);
    }
    else
    {
        console.log("population mean=" + populationValue);
        sessionStorage.popMean = parseFloat(populationValue);
        
        removeElementsByClassName("dialogBox");
        
        performOneSampleTTest(variableList["dependent"][0]);
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
        for(i=0; i<variableList["dependent"].length; i++)                        
        {
            for(j=0; j<variableList["independent-levels"].length; j++)
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
            
            if(selectedMeans.length > 2)
            {
                drawComputingResultsImage();
                
                setTimeout(function(){
                performTwoWayANOVA(variableList["dependent"][0], variableList["independent"][0], variableList["independent"][1]);
                }, 1500);
            }                
            else
            {
                var levelsOfDistributionA = selectedMeanLevels[0];
                var levelsOfDistributionB = selectedMeanLevels[1];
                
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
        else
        {
            if(selectedMeans.length > 2)
            {
                drawComputingResultsImage();
                selectAllMeans();
            
                setTimeout(function(){
                performTwoWayANOVA(variableList["dependent"][0], variableList["independent"][0], variableList["independent"][1]);
                }, 1500);
            }                
            else
            {
                var levelsOfDistributionA = selectedMeanLevels[0];
                var levelsOfDistributionB = selectedMeanLevels[1];
                
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
