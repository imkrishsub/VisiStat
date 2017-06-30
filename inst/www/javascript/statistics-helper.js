function findCorrelationCoefficient(variableA, variableB)
{    
    multiVariateTestResults["formula"] = variableA + " : " + variableB;
    
    var isScatterPlotMatrix = selectedVisualisation == "Scatterplot matrix" ? true : false;
    
    
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
    for(var i=0; i<variableNames.length; i++)
    {
        var variable = variableNames[i];
        var variableData = variables[variable]["dataset"];
        var uniqueVariableData = variableData.unique();

        if(isNaN(variableData[0]) || variableRoles[variable]=="subject")
        {            
            if(uniqueVariableData.length >= 10)
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
    for(var i=0; i<variableList["independent-levels"].length; i++)
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
    
    for(var i=0; i<means.length; i++)
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
    
    for(var i=0; i<means.length; i++)
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
    
    for(var i=0; i<means.length; i++)
    {
        if(means[i].getAttribute("fill") == meanColors["click"])
        {   
            selectedMeans.push(means[i]);
        }
    }
    
    var selectedMeanLevels = [];
    
    for(var i=0; i<selectedMeans.length; i++)
    {       
        selectedMeanLevels.push(selectedMeans[i].getAttribute("data-levelA")+"-"+selectedMeans[i].getAttribute("data-levelB"));
    }
    
    return selectedMeanLevels;
}

function findEndingLine()
{
    var completeLines = document.getElementsByClassName("completeLines");
    var means = document.getElementsByClassName("means");
    
    var START = [];
    var END = [];
    
    for(var j=0; j<completeLines.length; j++)
    {
        for(var i=0; i<means.length; i++)
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
    
    for(var i=0; i<means.length; i++)
    {
        if(START.indexOf(i) == -1 && END.indexOf(i) != -1)
        {
            for(var j=0; j<completeLines.length; j++)
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
    
    for(var j=0; j<completeLines.length; j++)
    {
        for(var i=0; i<means.length; i++)
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
    
    for(var i=0; i<means.length; i++)
    {
        if(START.indexOf(i) == -1 && END.indexOf(i) != -1)
        {
            for(var j=0; j<completeLines.length; j++)
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
    
        if(variableList["independent"].length == 0)
        {  
            if(variableList["dependent"].length == 0)
                compareNowText.text("SELECT ONE OR MORE MEANS");    
            else
                compareNowText.text("TEST AGAINST POPULATION MEAN");    
        }
        else
        {
            switch(variableList["independent-levels"].length)
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

        switch(variableList["independent-levels"].length)
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
    if(selectedVariables.length == 2)
    {    
        var outcomeVariable = document.getElementById("value_outcome");
        var predictorVariable = document.getElementById("value_" + selectedVariables[0]);
        
        multiVariateTestResults["coefficients"] = parseFloat(multiVariateTestResults["coefficients"]);
        multiVariateTestResults["intercept"] = parseFloat(multiVariateTestResults["intercept"]);
        
        outcomeVariable.innerHTML = dec5(multiVariateTestResults["coefficients"]*predictorVariable.value + multiVariateTestResults["intercept"]);
    }
    else
    {
        var outcomeVariable = multiVariateTestResults["outcomeVariable"];
        var explanatoryVariables = multiVariateTestResults["explanatoryVariables"];
        
        var outcomeVariableLabel = document.getElementById("value_outcome");
        
        var outcomeVariableValue = multiVariateTestResults["intercept"];
        
        for(var i=0; i<explanatoryVariables.length; i++)
        {
            var valueEnteredForExplanatoryVariable = isNaN(document.getElementById("value_" + explanatoryVariables[i]).value) ? 0 : document.getElementById("value_" + explanatoryVariables[i]).value;
            var coefficient = multiVariateTestResults["coefficients"][i];
            
            outcomeVariableValue += coefficient*valueEnteredForExplanatoryVariable;
        }
        
        outcomeVariableLabel.innerHTML = dec25(outcomeVariableValue);
    }
}

function isMixedDesign(variableList)
{
    if(experimentalDesign == "between-groups")
        return false;
        
    var withinGroupVariableExists = false;
    var betweenGroupVariableExists = false;
        
    for(i=0; i<variableList["independent"].length; i++)
    {
        //for each independent variable
        var levels = variables[variableList["independent"][i]]["dataset"].unique();
        
        var prev = 0, curr = 0;
        for(j=0; j<levels.length; j++)
        {
            //for each level
            if(j == 0)
            {
                prev = variables[variableList["dependent"][0]][levels[j]].length;               
            }
            
            else
            {
                curr = variables[variableList["dependent"][0]][levels[j]].length;
               
                if(curr != prev)
                {
                    betweenGroupVariableExists = true;
                    break;
                }
                else
                {
                    prev = curr; 
                    if(j == (levels.length-1))
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
    
    for(i=0; i<variableList["independent"].length; i++)
    {
        //for each independent variable
        var levels = variables[variableList["independent"][i]]["dataset"].unique();
        
        var prev = 0, curr = 0;
        for(j=0; j<levels.length; j++)
        {
            //for each level
            if(j == 0)
            {
                prev = variables[variableList["dependent"][0]][levels[j]].length;
            }
            
            else
            {
                curr = variables[variableList["dependent"][0]][levels[j]].length;                
                
                if(curr != prev)
                {
                    return variableList["independent"][i];
                }
                else
                {                    
                    prev = curr; 
                    if(j == (levels.length-1))
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
    
    for(i=0; i<variableList["independent"].length; i++)
    {
        //for each independent variable
        var levels = variables[variableList["independent"][i]]["dataset"].unique();
        
        var prev = 0, curr = 0;
        for(j=0; j<levels.length; j++)
        {
            //for each level
            if(j == 0)
            {
                prev = variables[variableList["dependent"][0]][levels[j]].length;
            }
            
            else
            {
                curr = variables[variableList["dependent"][0]][levels[j]].length;                
                
                if(curr != prev)
                {
                    withinGroupVariableExists = true;
                }
                else
                {                    
                    prev = curr; 
                    if(j == (levels.length-1))
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
    
    for(var i=0; i<means.length; i++)
    {
        if(means[i].getAttribute("fill") == meanColors["click"])
            selectedMeans.push(means[i]);
    }    
    
    if(selectedMeans.length == 0)
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
    else if(selectedMeans.length == means.length)
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
        var newP = p.toString();
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
   
   for (var i=0; i<variableList["independent-levels"].length; i++)
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

function doPostHocTests()
{
    // ToDo: find post-hoc test when not all pairs are selected

    // Factors needed to make decision: experimental-design, homogeneity, and normality. 
    var homogeneity = d3.select("#homogeneity.assumptionNodes").attr("fill") == "green" ? true : false;
    var normality = d3.select("#normality.assumptionNodes").attr("fill") == "green" ? true : false;

    var testType;

    if(experimentalDesign == "between-groups")
    {
        if(homogeneity)
        {            
            if(normality)
            {
                testType = "TukeyHSD";  
                usedPostHocTestType = "proper";

                performTukeyHSDTest();          
            }
            else
            {
                testType = "PairwiseUnpairedWilcoxTest";
                usedPostHocTestType = "proper";

                performPairwiseWilcoxTestsWithBonferroniCorrection("F");
            }
        }
        else
        {
            if(normality)
            {
                testType = "PairwiseWelchTTest";
                usedPostHocTestType = "proper";

                performPairwiseTTestsWithBonferroniCorrection("F", "F");
            }
            else
            {
                testType = undefined;
                usedPostHocTestType = "error";

                performTukeyHSDTest();          
            }
        }
    }
    else
    {
        if(homogeneity)
        {
            if(normality)   
            {        
                testType = "PairwisePairedTTest";
                usedPostHocTestType = "proper";

                performPairwiseTTestsWithBonferroniCorrection("T", "T");
            }
            else
            {
                testType = "PairwisePairedWilcoxTest";
                usedPostHocTestType = "proper";

                performPairwiseWilcoxTestsWithBonferroniCorrection("T");
            }
        }
        else
        {
            testType = undefined;
            performPairwiseTTestsWithBonferroniCorrection("T", "T");

            usedPostHocTestType = "error";
        }
    }

    // render the results (after getting the R object) in a tabular format and in the results panel
}

function createEffectsObject()
{
    // entities of each element of the effects object: p-value (raw), p-value (dressed), parameter (dressed with df), and effect-size (raw)

    var variableList = sort(selectedVariables);
    var labels = multiVariateTestResults["labels"];

    for(var i=0; i<labels.length; i++)
    {
        // For each label (e.g., A, B, A:B)

        // Find the effectType

        var numberOfColonsInLabel = (labels[i]).split(":").length - 1;
        var effectType = (numberOfColonsInLabel == 0) ? "main" : ((numberOfColonsInLabel == 1) ? "2-way interaction" : "3-way interaction");

        // Check if property exists

        if(!effects.hasOwnProperty(effectType))
        {
            // We are adding the first element of this property

            effects[effectType] = new Array();

        }

        effects[effectType].push({
                                            rawP: multiVariateTestResults["rawP"][i],
                                            dressedP: multiVariateTestResults["p"][i],
                                            df: multiVariateTestResults["df"][i],
                                            rawEffectSize: multiVariateTestResults["effect-size"][i],
                                            label: labels[i],
                                            parameter: multiVariateTestResults["parameter"][i]
                                        });     
    }


}

/**
 * Returns true if the statistical test has already been done for the selected distributions
 * @return {Boolean} flag that indicates if VisiStat displays result without delay
 */
function isTestInHistory()
{    
    var currentResearchQuestion = getCurrentResearchQuestion(); // Get the current research question

    if(listOfResearchQuestions.indexOf(currentResearchQuestion) != -1) // If research question already in history...
        return true;

    return false; 
}

/**
 * Returns the current research question (as formula)
 * @return {string} The current research question (as formula)
 */
function getCurrentResearchQuestion()
{
    var variableList = getSelectedVariables(); // Get the selected variables
    var DV = variableList["dependent"][0];
    var IVs = variableList["independent"];
    var levels = variableList["independent-levels"];

    var researchQuestion = "";

    if(IVs.length == 1)
    {
        researchQuestion = DV + " ~ " + IVs[0] + "(" + levels + ")";    
    }
    else
    {
        researchQuestion = DV + " ~ " + IVs[0];

        for(var i=1; i<IVs.length; i++)
        {
            researchQuestion +=  " * " + IVs[i];
        }    
    }

    return researchQuestion; 
}