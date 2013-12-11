function findCorrelationCoefficient(variableA, variableB)
{
    console.log("\nCORRELATION");
    console.log("\t\ttypeOf(" + variableA + ")=" + variableTypes[variableA] + ", typeOf(" + variableB + ")=" + variableTypes[variableB]);
    
    testResults["formula"] = variableA + " : " + variableB;
    
    var isScatterPlotMatrix = currentVisualisationSelection == "Scatterplot-matrix" ? true : false;
    
    
    if((variableTypes[variableA] == "binary") && (variableTypes[variableB] == "binary"))
    {
        //both are binary 
        
        //2x2 => Phi; Cramer's V otherwise
        console.log("\t\t\tCramer's V");
        return null;
    }
    else if(((variableTypes[variableA] == "binary") || (variableTypes[variableB] == "binary")) && ((variableTypes[variableA] != "binary") || (variableTypes[variableB] != "binary")))
    {
        //one is binary
    
        if(variableTypes[variableA] == "binary")
        {
            if(!isNaN(variables[variableB]["dataset"][0]))
            {
                console.log("\t\t\tBiserial Correlation Coefficient");
                if(!isScatterPlotMatrix)
                    getBiserialCorrelationCoefficient(variableB, variableA);
                else
                    return null;
            }
            else
            {   
//                 drawButtonInSideBar("CONSTRUCT MODEL", "regression");
                console.log("\t\t\tDoing nothing");
                return null;
            }
        }
        else
        {
            if(!isNaN(variables[variableA]["dataset"][0]))
            {
                console.log("\t\t\tBiserial Correlation Coefficient");
                if(!isScatterPlotMatrix)
                    getBiserialCorrelationCoefficient(variableA, variableB);
                else
                    return null
            }
            else
            {
//                 drawButtonInSideBar("CONSTRUCT MODEL", "regression");
                console.log("\t\t\tDoing nothing");
                return null;
            }            
        }
    }
    else
    {
        //both are not binary
        
        if(((variableTypes[variableA] == "ordinal") || (variableTypes[variableB] == "ordinal")) && ((variableTypes[variableA] != "nominal") && (variableTypes[variableB] != "nominal")))
        {
            console.log("\t\t\tKendall's Tau");            
            if(!isScatterPlotMatrix)
                getCorrelationCoefficient(variableA, variableB, "kendall");
            else
                return getPearsonCorrelation(variables[variableA]["dataset"], variables[variableB]["dataset"]);
        }
        else if((variableTypes[variableA] == "nominal") || (variableTypes[variableB] == "nominal"))
        {
            //do nothing
//             drawButtonInSideBar("CONSTRUCT MODEL", "regression");
            console.log("\t\t\tDoing nothing");
            return null;
        }
        else
        {
            console.log("\t\t\tPearson's correlation");
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

        if(isNaN(variableData[0]) || variableRows[variable]=="participant")
        {            
            if(uniqueVariableData.length >= 10)
            {
                console.log("\n\tmaking " + variable + " as an evil variable");
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
    var compareNowText = d3.select("#text.compareNow");
    
    var variableList = getSelectedVariables();
    console.dir(variableList);
    
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

function calculateOutcome()
{    
    if(currentVariableSelection.length == 2)
    {    
        var outcomeVariable = document.getElementById("value_outcome");
        var predictorVariable = document.getElementById("value_" + currentVariableSelection[0]);
        
        console.log(outcomeVariable.innerHTML + " = " + testResults["coefficients"] + "*" + predictorVariable.value + " + " + testResults["intercept"]);
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
        
        for(var i=0; i<explanatoryVariables.length; i++)
        {
            var valueEnteredForExplanatoryVariable = isNaN(document.getElementById("value_" + explanatoryVariables[i]).value) ? 0 : document.getElementById("value_" + explanatoryVariables[i]).value;
            var coefficient = testResults["coefficients"][i];
            
            console.log(coefficient + "*" + valueEnteredForExplanatoryVariable);
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
    
    console.log("participants: " + participants);
    
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
                console.log("level: " + levels[j] + ", prev = " + prev + ", curr = " + curr);
            }
            
            else
            {
                curr = variables[variableList["dependent"][0]][levels[j]].length;
               
                console.log("level: " + levels[j] + ", prev = " + prev + ", curr = " + curr);
                
                if(curr != prev)
                {
                    betweenGroupVariableExists = true;
                    break;
                }
                else
                {
                    console.log("j=" + j + ", levels.length = " + levels.length);
                    prev = curr; 
                    if(j == (levels.length-1))
                        withinGroupVariableExists = true;                    
                }                
            }
        }
    }
    
    console.log("betweenGroupVariableExists = " + betweenGroupVariableExists);
    console.log("withinGroupVariableExists = " + withinGroupVariableExists);
    
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
}

function setSelectButtons()
{
    var selectNoneText = d3.select("#text.selectNone");
    var selectNoneButton = d3.select("#rect.selectNone");
    
    var selectAllText = d3.select("#text.selectAll");
    var selectAllButton = d3.select("#rect.selectAll");
    
    var means = document.getElementsByClassName(".means");
    var selectedMeans = [];
    
    for(var i=0; i<means.length; i++)
    {
        console.log("means[i].getAttribute(\"fill\")=" + means[i].getAttribute("fill"));
        console.log("meanColors[\"click\"]=" + meanColors["click"]);
        
        if(means[i].getAttribute("fill") == meanColors["click"])
            selectedMeans.push(means[i]);
    }    
    
    if(selectedMeans.length == 0)
    {   
        console.log("no means are selected");
        
        selectNoneButton.attr("fill", "url(#buttonFillSelected)");
        selectNoneButton.attr("filter", "none");
        selectNoneButton.attr("stroke", "none");
        
        selectNoneText.attr("fill", "white");
        
        selectAllButton.attr("fill", "url(#buttonFillNormal)");
        selectAllButton.attr("filter", "url(#Bevel)");
        selectAllButton.attr("stroke", "black");
        
        selectNoneText.attr("fill", "black");
    }
    else if(selectedMeans.length == means.length)
    {
        console.log("all means are selected");
        
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
        console.log("in-between");
        
        selectNoneButton.attr("fill", "url(#buttonFillNormal)");
        selectNoneButton.attr("filter", "url(#Bevel)");
        selectNoneButton.attr("stroke", "black");
        
        selectNoneText.attr("fill", "black");
        
        selectAllButton.attr("fill", "url(#buttonFillNormal)");
        selectAllButton.attr("filter", "url(#Bevel)");
        selectAllButton.attr("stroke", "black");
        
        selectNoneText.attr("fill", "black");
    }
}    