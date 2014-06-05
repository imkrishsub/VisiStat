function checkForOverTesting()
{
    var overtesting = detectOverTesting(testTypesSelectedForReport, researchQuestionsSelectedForReport, variablesSelectedForReport);  // Check for over-testing    
    var reportPanel = d3.select("#reportPanel");
    
    // console.log("BOOL.overtesting = " + overtesting);

    if(overtesting && document.getElementById("warningPanel") == null)
    {
        // If we have overtesting, append a div tag right on top of the reports that have errors. 
        var warningPanel = reportPanel.insert("div", ":first-child")
                    .attr("style", "position: relative; left: 0px; top: 0px; width: " + (width - sidePanelWidth) + "px; height: " + scaleForWindowSize(175) + "px; background-color: #dd0000;")
                    .attr("id", "warningPanel");

        warningPanel.append("label")
                        .text("Overtesting detected: you tried to use multiple pairwise comparisons (e.g., t-test), when a single overall test is possible (e.g., ANOVA). It is wrong to use multiple pairwise comparisons since the more significance tests you do, the more chances you have of finding a significance effect and you will eventually get a p-value less than 0.05 (this is called overtesting).")
                        .attr("style", "position: relative; display: block; margin: auto; text-align: center; width: " + 0.75*reportPanelWidth + "px; color: white;")

        warningPanel.append("br");

        warningPanel.append("input")
                        .attr("type", "button")
                        .attr("value", "Resolve this issue by doing a single overall test")
                        .attr("id", "doANOVAButton")
                        .attr("style", "position: relative; display: block; margin: auto; text-align: center; width: " + 0.35*reportPanelWidth + "px; padding:15px; font-family: Verdana; cursor: pointer; border-radius: " + scaleForWindowSize(25) + "px; background-color:#f8f9f7;");
    }
}

function detectOverTesting(testTypes, researchQuestions, variables)
{
    // console.log("testTypes = [" + testTypes + "]");
    // console.log("researchQuestions = [" + researchQuestions + "]");
    // console.log("variables = [" + variables + "]");

    var numberOfPairwiseComparisons = new Array();
    var independentVariables = getAllIndependentVariables();

    // console.log("independentVariables = [" + independentVariables + "]");

    var numberOfPairwiseComparisonsForOverTesting = getNumberOfComparisonsForOverTesting(independentVariables);

    // console.log("numberOfPairwiseComparisonsForOverTesting = [" + numberOfPairwiseComparisonsForOverTesting + "]");

    for(var i=0; i<independentVariables.length(); i++)
        numberOfPairwiseComparisons[i] = 0;

    for(var i=0; i<testTypes.length(); i++)
    {
        var independentVariable = (variables[i])["independent"];
        // console.log("independentVariable = " + independentVariable);

        if((testTypes[i] == 'wT') || (testTypes[i] == 'upT') || (testTypes[i] == 'pT') || (testTypes[i] == 'WT') || (testTypes[i] == 'mwT'))
            numberOfPairwiseComparisons[independentVariables.indexOf(String(independentVariable))]++;        
    }

    // console.log("numberOfPairwiseComparisons = [" + numberOfPairwiseComparisons + "]");

    for(var i=0; i<independentVariables.length(); i++)
    {
        if(numberOfPairwiseComparisons[i] >= numberOfPairwiseComparisonsForOverTesting[i])
        {
            for(var j=0; j<testTypes.length(); j++)
            {
                var independentVariable = (variables[j])["independent"];

                if((independentVariables[i] == independentVariable) && ((testTypes[j] == 'wT') || (testTypes[j] == 'upT') || (testTypes[j] == 'pT') || (testTypes[j] == 'WT') || (testTypes[j] == 'mwT')))   
                {
                    d3.select("#entry" + listOfResearchQuestions.indexOf(researchQuestions[j]) + ".historyEntry").attr("fill", "red").attr("opacity", "0.6");
                }
            }

            return true;
            // ToDo: highlight the corresponding history entries in red
        }   
    }    

    return false;
}

function getNumberOfComparisonsForOverTesting(independentVariables)
{
    var numberOfComparisonsForOverTesting = new Array();    

    for(var i=0; i<independentVariables.length(); i++)
    {
        numberOfComparisonsForOverTesting[i] = variables[independentVariables[i]]["dataset"].unique().length() != 2 ? getSumUpTo(variables[independentVariables[i]]["dataset"].unique().length() - 1) : 99999;
    }

    return numberOfComparisonsForOverTesting;
}

function findCorrelationCoefficient(variableA, variableB)
{    
    testResults["formula"] = variableA + " : " + variableB;
    
    var isScatterPlotMatrix = currentVisualisationSelection == "Scatterplot-matrix" ? true : false;
    
    
    if((variableTypes[variableA] == "binary") && (variableTypes[variableB] == "binary"))
    {
        //both are binary 
        
        //2x2 => Phi; Cramer's V otherwise
        // console.log("\t\t\tCramer's V");
        return null;
    }
    else if(((variableTypes[variableA] == "binary") || (variableTypes[variableB] == "binary")) && ((variableTypes[variableA] != "binary") || (variableTypes[variableB] != "binary")))
    {
        //one is binary
    
        if(variableTypes[variableA] == "binary")
        {
            if(!isNaN(variables[variableB]["dataset"][0]))
            {
                // console.log("\t\t\tBiserial Correlation Coefficient");
                if(!isScatterPlotMatrix)
                    getBiserialCorrelationCoefficient(variableB, variableA);
                else
                    return null;
            }
            else
            {   
                // console.log("\t\t\tDoing nothing");
                return null;
            }
        }
        else
        {
            if(!isNaN(variables[variableA]["dataset"][0]))
            {
                // console.log("\t\t\tBiserial Correlation Coefficient");
                if(!isScatterPlotMatrix)
                    getBiserialCorrelationCoefficient(variableA, variableB);
                else
                    return null
            }
            else
            {
                return null;
            }            
        }
    }
    else
    {
        //both are not binary
        
        if(((variableTypes[variableA] == "ordinal") || (variableTypes[variableB] == "ordinal")) && ((variableTypes[variableA] != "nominal") && (variableTypes[variableB] != "nominal")))
        {
            // console.log("\t\t\tKendall's Tau");            
            if(!isScatterPlotMatrix)
                getCorrelationCoefficient(variableA, variableB, "kendall");
            else
                return getPearsonCorrelation(variables[variableA]["dataset"], variables[variableB]["dataset"]);
        }
        else if((variableTypes[variableA] == "nominal") || (variableTypes[variableB] == "nominal"))
        {
            //do nothing
            // console.log("\t\t\tDoing nothing");
            return null;
        }
        else
        {
            // console.log("\t\t\tPearson's correlation");
            if(!isScatterPlotMatrix)
                getCorrelationCoefficient(variableA, variableB, "pearson");
            else
                return getPearsonCorrelation(variables[variableA]["dataset"], variables[variableB]["dataset"]);
        }
    }
}

function testForEvilVariables()
{  
    for(var i=0; i<variableNames.length(); i++)
    {
        var variable = variableNames[i];
        var variableData = variables[variable]["dataset"];
        var uniqueVariableData = variableData.unique();

        if(isNaN(variableData[0]) || variableRoles[variable]=="participant")
        {            
            if(uniqueVariableData.length() >= 10)
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
    for(var i=0; i<variableList["independent-levels"].length(); i++)
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
    
    for(var i=0; i<means.length(); i++)
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
    
    for(var i=0; i<means.length(); i++)
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
    
    for(var i=0; i<means.length(); i++)
    {
        if(means[i].getAttribute("fill") == meanColors["click"])
        {   
            selectedMeans.push(means[i]);
        }
    }
    
    var selectedMeanLevels = [];
    
    for(var i=0; i<selectedMeans.length(); i++)
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
    
    for(var j=0; j<completeLines.length(); j++)
    {
        for(var i=0; i<means.length(); i++)
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
    
    for(var i=0; i<means.length(); i++)
    {
        if(START.indexOf(i) == -1 && END.indexOf(i) != -1)
        {
            for(var j=0; j<completeLines.length(); j++)
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
    
    for(var j=0; j<completeLines.length(); j++)
    {
        for(var i=0; i<means.length(); i++)
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
    
    for(var i=0; i<means.length(); i++)
    {
        if(START.indexOf(i) == -1 && END.indexOf(i) != -1)
        {
            for(var j=0; j<completeLines.length(); j++)
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
    return;
    
    if(document.getElementById("#text.doPairwiseTest") == null)
    {
        var compareNowText = d3.select("#text.compareNow");
    
        var variableList = getSelectedVariables();
    
        if(variableList["independent"].length() == 0)
        {  
            if(variableList["dependent"].length() == 0)
                compareNowText.text("SELECT ONE OR MORE MEANS");    
            else
                compareNowText.text("TEST AGAINST POPULATION MEAN");    
        }
        else
        {
            switch(variableList["independent-levels"].length())
            {
                case 0:
                        compareNowText.text("SELECT TWO OR MORE MEANS");    
                        break
                case 1:
                        compareNowText.text("SELECT TWO OR MORE MEANS");    
                        break;
            
                default:
                        compareNowText.text("COMPARE MEANS");
                        break;
            }
        }
    }
    else
    {
        var compareNowText = d3.select("#text.doPairwiseTest");    
        var variableList = getSelectedVariables();    

        switch(variableList["independent-levels"].length())
        {
            case 0:
                    compareNowText.text("SELECT TWO OR MORE MEANS");    
                    break
            case 1:
                    compareNowText.text("SELECT TWO OR MORE MEANS");    
                    break;
        
            default:
                    compareNowText.text("COMPARE MEANS");
                    break;
        }
    }
}

function calculateOutcome()
{    
    if(currentVariableSelection.length() == 2)
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
        
        for(var i=0; i<explanatoryVariables.length(); i++)
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
        
    for(i=0; i<variableList["independent"].length(); i++)
    {
        //for each independent variable
        var levels = variables[variableList["independent"][i]]["dataset"].unique();
        
        var prev = 0, curr = 0;
        for(j=0; j<levels.length(); j++)
        {
            //for each level
            if(j == 0)
            {
                prev = variables[variableList["dependent"][0]][levels[j]].length();               
            }
            
            else
            {
                curr = variables[variableList["dependent"][0]][levels[j]].length();
               
                if(curr != prev)
                {
                    betweenGroupVariableExists = true;
                    break;
                }
                else
                {
                    prev = curr; 
                    if(j == (levels.length()-1))
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
    
    for(i=0; i<variableList["independent"].length(); i++)
    {
        //for each independent variable
        var levels = variables[variableList["independent"][i]]["dataset"].unique();
        
        var prev = 0, curr = 0;
        for(j=0; j<levels.length(); j++)
        {
            //for each level
            if(j == 0)
            {
                prev = variables[variableList["dependent"][0]][levels[j]].length();
            }
            
            else
            {
                curr = variables[variableList["dependent"][0]][levels[j]].length();                
                
                if(curr != prev)
                {
                    return variableList["independent"][i];
                }
                else
                {                    
                    prev = curr; 
                    if(j == (levels.length()-1))
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
    
    for(i=0; i<variableList["independent"].length(); i++)
    {
        //for each independent variable
        var levels = variables[variableList["independent"][i]]["dataset"].unique();
        
        var prev = 0, curr = 0;
        for(j=0; j<levels.length(); j++)
        {
            //for each level
            if(j == 0)
            {
                prev = variables[variableList["dependent"][0]][levels[j]].length();
            }
            
            else
            {
                curr = variables[variableList["dependent"][0]][levels[j]].length();                
                
                if(curr != prev)
                {
                    withinGroupVariableExists = true;
                }
                else
                {                    
                    prev = curr; 
                    if(j == (levels.length()-1))
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
    
    for(var i=0; i<means.length(); i++)
    {
        if(means[i].getAttribute("fill") == meanColors["click"])
            selectedMeans.push(means[i]);
    }    
    
    if(selectedMeans.length() == 0)
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
    else if(selectedMeans.length() == means.length())
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
    var CI = [mean - error, mean + error];
    // var variableList = getSelectedVariables();
    // var dependentVariable = variables[variableList["dependent"][0]]["dataset"];
    // console.log("variableList[\"dependent\"][0] = " + variableList["dependent"][0]);
    // console.log("dependentVariable = [" + dependentVariable + "]");

    // var min = Array.min(dependentVariable);
    // var max = Array.max(dependentVariable);

    // console.log("min = " + min + ", max = " + max);

    // if(CI[0] < min)
    // {
    //     CI[0] = min;
    // }

    // if(CI[1] > max)
    // {
    //     CI[1] = max;
    // }

    // console.log("CI = [" + CI + "]");

    return CI;
}

//--------COPY THIS
//returns p-text but with omitted first zero
function omitZeroPValueNotation(p)
{
    //only in case that p is one, first digit shouldn't be omitted
    if (p == 1)
        return p;
    else
    {
        var newP = p;
        newP = newP.replace("0", '');
        return newP;
    }
}

//--------COPY THIS
//returns the pure p value without p or operators
function getPurePValue(presult)
{
    var pValue =  removeAlphabetsFromString(presult);
    pValue = pValue.replace(/</g, '');
    pValue = pValue.replace(/>/g, '');
    pValue = pValue.replace(/=/g, '');
    return pValue;
}

//--------COPY THIS
//returns the amount of an effect size depending on its type 
//0 = no; 1 = small; 2 = medium; 3: large effect; 99 = error
function getEffectSizeAmount(effectSizeType, effectSize)
{
    var interpretations = effectSizeInterpretations[effectSizeType];
    if(effectSize < interpretations[0])
        return 0;
    else if(effectSize >= interpretations[0] && effectSize < interpretations[1])
        return 1;
    else if(effectSize >= interpretations[1] && effectSize < interpretations[2])
        return 2;
    else if(effectSize >= interpretations[2])
        return 3; 
    return 99;
}

//--------COPY THIS
//returns the index of the highest mean for levels of independenvt variable for one way significance tests
function getHighestMean()
{
   var index = 0;
   var highestMean = 0;
   var currentMean = 0;
   
   var variableList = getSelectedVariables();
   
   for (var i=0; i<variableList["independent-levels"].length(); i++)
   {
      currentMean = mean(variables[variableList["dependent"]][variableList["independent-levels"][i]]);
      if (currentMean > highestMean)
      {
         index = i;
         currentMean = highestMean;
      }
   }
   return index;
}