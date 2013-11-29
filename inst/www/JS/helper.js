var format = d3.format(".1f");
var format2 = d3.format(".2f");
var format3 = d3.format(".3f");
var format5 = d3.format(".5f");

function splitTheData(independentVariable)
{        
    for(var j=0; j<variableNames.length; j++)
    {
        //for every variable
        var uniqueData = variables[independentVariable]["dataset"].unique();
        for(var k=0; k<uniqueData.length; k++)
        {
            //for every level
            for(var m=0; m<variables[variableNames[j]]["dataset"].length; m++)
            {
                if(variables[independentVariable]["dataset"][m] == uniqueData[k])
                {
                    if(variables[variableNames[j]][uniqueData[k]] == undefined)
                    {
                        variables[variableNames[j]][uniqueData[k]] = new Array();
                        MIN[variableNames[j]][uniqueData[k]] = 999999;
                        MAX[variableNames[j]][uniqueData[k]] = -999999;
                    }
                    
                    variables[variableNames[j]][uniqueData[k]].push(variables[variableNames[j]]["dataset"][m]);                        
                    
                    if(variables[variableNames[j]]["dataset"][m] < MIN[variableNames[j]][uniqueData[k]])
                        MIN[variableNames[j]][uniqueData[k]] = variables[variableNames[j]]["dataset"][m];
                    if(variables[variableNames[j]]["dataset"][m] > MAX[variableNames[j]][uniqueData[k]])
                        MAX[variableNames[j]][uniqueData[k]] = variables[variableNames[j]]["dataset"][m];                        
                }
            }
        }
        for(var k=0; k<uniqueData.length; k++)
        {
            IQR[variableNames[j]][uniqueData[k]] = findIQR(variables[variableNames[j]][uniqueData[k]]);
            CI[variableNames[j]][uniqueData[k]] = findCI(variables[variableNames[j]][uniqueData[k]]);
        }
    }
}

function splitThisLevelBy(independentVariableA, independentVariableB, dependentVariable)
{
    var splitData = new Object();
    var levelsA = variables[independentVariableA]["dataset"].unique();
    var levelsB = variables[independentVariableB]["dataset"].unique();
    
    var indepA = variables[independentVariableA]["dataset"];
    var indepB = variables[independentVariableB]["dataset"];
    var dep = variables[dependentVariable]["dataset"];
    
    for(var i=0; i<levelsA.length; i++)
    {
        splitData[levelsA[i]] = new Object();
        for(var j=0; j<levelsB.length; j++)
        {
            splitData[levelsA[i]][levelsB[j]] = new Array();
        }
    }
    
    for(var i=0; i<dep.length; i++)
    {
        var indexA = indepA[i];
        var indexB = indepB[i];
        
        splitData[indexA][indexB].push(dep[i]);
    }
    
    console.dir(splitData);
    
    return splitData;
}

//Initialise the mouse event handlers
function initMouseEventHandlers()
{
    document.onmousedown = OnMouseDown;
    document.onmousemove = OnMouseMove;
    document.onmouseover = OnMouseOver;
    document.onmouseout = OnMouseOut;
}

function pickOutVisualizations()
{
    var variableList = sort(currentVariableSelection);    
    
    switch(variableList["independent"].length)
    {
        case 0:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 1:
                                {                                
                                    currentVisualizationSelection = "Histogram";                    
                                    break;
                                }
                        case 2:
                                {
                                    currentVisualizationSelection = "Scatterplot";
                                    break;
                                }
                        default:
                                {
                                    currentVisualizationSelection = "Scatterplot-matrix";
                                    break;
                                }
                    }
                    break;
                }
        case 1:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 0:
                                {                                 
                                    currentVisualizationSelection = "Histogram";
                                    break;
                                }
                        case 1:
                                {                                 
                                    currentVisualizationSelection = "Boxplot";
                                    break;
                                }
                        case 2:
                                {
                                    currentVisualizationSelection = "Scatterplot";
                                    break;
                                }
                                    
                        default:
                                {                                    
                                    currentVisualizationSelection = "Scatterplot-matrix";
                                }
                    }
                    break;
                }  
        case 2:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 0:
                                {  
                                    currentVisualizationSelection = "Scatterplot";
                                    break;
                                }
                        case 1:
                                {                                 
                                    currentVisualizationSelection = "Boxplot";
                                    break;
                                }
                        default:
                                {                                    
                                    currentVisualizationSelection = "Scatterplot-matrix";
                                }
                    }
                    break;
                }
    }
}

//Resets SVG canvas, draws plot based on the visualisation selected
function makePlot()
{   
    resetSVGCanvas();
    drawFullScreenButton();
    
    switch(currentVisualizationSelection)
    {
        case "Histogram":
                                    {
                                        curveX = [];
                                        curveY = [];
                                        makeHistogram();
                                        break;
                                    }
        case "Boxplot":
                                    { 
                                        boxes = [];
                                        meanCircles = [];
                                        medianLines = [];
                                        topFringes = [];
                                        bottomFringes = [];
                                        topFringeConnectors = [];
                                        bottomFringeConnectors = [];
                                        CILines = [];
                                        CITopLines = [];
                                        CIBottomLines = [];
                                        yAxisTexts = [];
                                        outlierValues = [];
                                        topFringeValues = [];
                                        bottomFringeValues = [];
                                        
                                        makeBoxplot();
                                        break;
                                    }
        case "Scatterplot":
                                    {
                                        makeScatterplot();
                                        break;
                                    }
        case "Scatterplot-matrix":
                                    {
                                        makeScatterplotMatrix();
                                        break;
                                    }
    }
}

//Deletes the current SVG canvas and draws an empty canvas 

//Removes a single element with the given ID
function removeElementById(id)
{
    var element = document.getElementById(id);
    element.parentNode.removeChild(element);
}

//Removes all elements with the given classname
function removeElementsByClassName(className)
{
   elements = document.getElementsByClassName(className);
   while(elements.length > 0)
   {
       elements[0].parentNode.removeChild(elements[0]);
   }
}

//Adds a given element to an array by maintain unique elements
function toggleFillColorsForVariables(array, element)
{   
    var variable = d3.select("#" + element + ".variableNameHolderBack");
    var variableText = d3.select("#" + element + ".variableNameHolderText");
    
    if(array.indexOf(element) == -1)
    {
        array.push(element);
        variable.attr("fill", "url(#buttonFillSelected)")
        variable.attr("filter", "none");
        variableText.attr("fill", "white");
    }
    
    else
    {     
        array.splice(array.indexOf(element), 1);
        variable.attr("fill", "url(#buttonFillNormal)");  
        variable.attr("filter", "url(#buttonFilterNormal)");
        variableText.attr("fill", "black");
    }

    return array;
}

//Manages the fill colors for visualisation-holders
function toggleFillColorsForVisualizations()
{
    var variableList = sort(currentVariableSelection);
    var viz = ["Histogram", "Boxplot", "Scatterplot", "Scatterplot-matrix"];
    validateAll();
    
    switch(variableList["independent"].length)
    {
        case 0:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 0: 
                                invalidate([viz[0], viz[1], viz[2],viz[3]]);
                                break;
                        case 1:
                               invalidate([viz[2],viz[3]]);
                                break;
                        case 2:
                                break;
                        default:
                                invalidate([viz[2]]);
                    }
                    
                    break;
                }
        case 1:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 0: 
                                invalidate([ viz[1],viz[2],viz[3]]);
                                break;
                        case 1:
                                break;
                        case 2:
                                invalidate([viz[0], viz[1]]);
                                break;
                        default:
                                invalidate([viz[0], viz[1], viz[2]]);
                                break;
                    }
                    
                    break;
                }
        case 2:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 0: 
                                invalidate([viz[0], viz[1]]);
                                break;
                        case 1:
                                invalidate([viz[0]]);
                                break;
                        default:
                                invalidate([viz[0], viz[1], viz[2]]);
                                break;
                    }
                    
                    break;
                }
                
    }
    
    
    var visualizations = document.getElementsByClassName("visualizationHolderBack");
    
    for(var i=0; i<visualizations.length; i++)
    {      
        if(visualizations[i].getAttribute("id") == currentVisualizationSelection)
        {
            visualizations[i].setAttribute("fill", "url(#buttonFillSelected)");
            visualizations[i].setAttribute("filter", "none");
            d3.select("#" + visualizations[i].getAttribute("id") + ".visualizationHolderText").attr("fill", "white");
        }
        else
        {
            visualizations[i].setAttribute("fill", "url(#buttonFillNormal)");
            visualizations[i].setAttribute("filter", "url(#buttonFilterNormal)");
            d3.select("#" + visualizations[i].getAttribute("id") + ".visualizationHolderText").attr("fill", "black");
        }
    }
}

function validateAll()
{
    var visualizations = d3.selectAll(".invalid");    
    visualizations.attr("fill", "url(#buttonFillNormal)").attr("filter", "url(#buttonFilterNormal)").attr("opacity", "0.1").attr("class", "visualizationHolderFront");                     
}

function invalidate(list)
{
    var visualizations = document.getElementsByClassName("visualizationHolderFront");
    
    for(var i=0; i<list.length; i++)
    {
        var viz = d3.select("#" + list[i] + ".visualizationHolderFront");
        viz.attr("fill", "grey").attr("opacity", "0.75").attr("class", "invalid");        
    }
}
//Strings/numbers processing

var toString = Object.prototype.toString;

//Checks if a given object is a string
function isString(obj)
{
  return toString.call(obj) == '[object String]';
}

//Removes alphabets in the given string
function removeAlphabetsFromString(string)
{
    return string.replace(/[A-z]/g, '');
}

//Removes numbers in the given string
function removeNumbersFromString(string)
{
    return string.replace(/[0-9]/g, '');
}

//Returns the unique elements of the given array
Array.prototype.unique = function() {
    var arr = new Array();
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}

//Returns true if the given array contains a particular element
Array.prototype.contains = function(v) {
   for(var i = 0; i < this.length; i++) {
       if(this[i] === v) return true;
   }
   return false;
};

//Returns a set of valid IDs (non-numeric)
function getValidIds(labels)
{
    var validIds = true;
    
    for(var i=0; i<labels.length; i++)
    {
        if(isString(labels[i]) == false)
        {
            validIds = false;
            break;
        }            
    }    
    if(!validIds)
    {
        return convertIntegersToStrings(labels);        
    }
    else
    {
        return labels;
    }
}

function getValidId(label)
{
    var validId = true;
    

    if(isString(label) == false)
    {
        validId = false;    
    }       
    if(!validId)
    {
        var string = "";
        
        for(var j=0; j<label.toString().length; j++)
        {            
            string = string + stringForNumber[label.toString().charAt(j)];
        }
        
        return string;
    }
    else
    {
        return label;
    }
}

//convert numbers to strings
function convertIntegersToStrings(numbers)
{
    var strings = new Array();
    
    for(var i=0; i<numbers.length; i++)
    {        
        var string = "";
        
        for(var j=0; j<numbers[i].toString().length; j++)
        {            
            string = string + stringForNumber[numbers[i].toString().charAt(j)];
        }
        
        strings.push(string);
    }
    
    return strings;
}

//returns the length of an object
function getObjectLength(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}

//sorts the selected variables and returns the sorted object
function getSelectedVariables()
{
    var means = document.getElementsByClassName("means");
    var variableList = new Object();
    
    variableList["dependent"] = new Array();
    variableList["independent"] = new Array();
    variableList["independent-levels"] = new Array();    
    
    //add the dependent variable
    for(var i=0; i<currentVariableSelection.length; i++)
    {        
        if(variableTypes[currentVariableSelection[i]] == "dependent")
        {
            variableList["dependent"].push(currentVariableSelection[i]);
        }
        else if(variableTypes[currentVariableSelection[i]] == "independent")
        {
            variableList["independent"].push(currentVariableSelection[i]);
        }
    }    
    
    
    
    //add the levels of the independent variable
    if(variableList["independent"].length > 0)
    {
        for(var i=0; i<means.length; i++)
        {
            if(means[i].getAttribute("fill") == meanColors["click"])
            {
                if(stringForNumber.indexOf(means[i].getAttribute("id")) != -1)
                {                
                    variableList["independent-levels"].push(stringForNumber.indexOf(means[i].getAttribute("id")));
                }
                else
                {
                    variableList["independent-levels"].push(means[i].getAttribute("id"));
                }
            }
        }   
    }
    else
    {
        variableList["dependent"] = [];
        for(var i=0; i<means.length; i++)
        {
            if(means[i].getAttribute("fill") == meanColors["click"])
            {
                if(stringForNumber.indexOf(means[i].getAttribute("id")) != -1)
                {                
                    variableList["dependent"].push(stringForNumber.indexOf(means[i].getAttribute("id")));
                }
                else
                {
                    variableList["dependent"].push(means[i].getAttribute("id"));
                }
            }
        }    
    }
    
    return variableList; 
}

//Just the sorting functionality of the above function
function sort(list)
{
    var variableList = new Object();
    
    variableList["dependent"] = new Array();
    variableList["independent"] = new Array();
    variableList["independent-levels"] = new Array();
    
    for(var i=0; i<list.length; i++)
    {
        if(variableTypes[list[i]] == "independent")
        {
            variableList["independent"].push(list[i]);
        }
        else
        {
            variableList["dependent"].push(list[i]);
        }
    }
    
    if(variableList["independent"].length > 0)
    {
        if(variableList["independent"].length == 1)
        {
            var uniqueData = variables[variableList["independent"][0]]["dataset"].unique();
        
            for(var i=0; i<uniqueData.length; i++)
            {
                variableList["independent-levels"].push(uniqueData[i]);
            }
        }
        else
        {
            for(var i=0; i<variableList["independent"].length; i++)
            {
                variableList["independent-levels"][i] = new Array();
                
                var uniqueData = variables[variableList["independent"][i]]["dataset"].unique();
        
                for(var k=0; k<uniqueData.length; k++)
                {
                    variableList["independent-levels"][i].push(uniqueData[k]);
                }
            }
        }
    }
    
    return variableList;
}

function setVariableTypes()
{    
    for(var i=0; i<variableNames.length; i++)
    {
        variableTypes[variableNames[i]] = sessionStorage.getItem(variableNames[i]);
    }
    
    for(var i=0; i<variableNames.length; i++)
    {
        if(variableTypes[variableNames[i]] == "independent")
        {
            var toggleButton = d3.select("#" + variableNames[i] + "variableTypeToggleButton");
            toggleButton.attr("href", "images/toggle_down.png");
            
            console.log("hola");
            
            var independentVariableText = d3.select("#" + variableNames[i] + ".independentVariableText");
            var dependentVariableText = d3.select("#" + variableNames[i] + ".dependentVariableText");

            independentVariableText.attr("fill", "#627bf4");
            dependentVariableText.attr("fill", "none");
            
            splitTheData(variableNames[i]);
        }
        else if(variableTypes[variableNames[i]] == "dependent")
        {
            var toggleButton = d3.select("#" + variableNames[i] + "variableTypeToggleButton");
            toggleButton.attr("href", "images/toggle_up.png");
            
            var independentVariableText = d3.select("#" + variableNames[i] + ".independentVariableText");
            var dependentVariableText = d3.select("#" + variableNames[i] + ".dependentVariableText");
            
            dependentVariableText.attr("fill", "#627bf4");
            independentVariableText.attr("fill", "none");
        }
        else if(variableTypes[variableNames[i]] == "participant")
        {
            d3.select("#" + variableNames[i] + ".dependentVariableButtonFront").remove();
            d3.select("#" + variableNames[i] + ".dependentVariableButtonBack").remove();
            d3.select("#" + variableNames[i] + ".dependentVariableText").remove();
            
            d3.select("#" + variableNames[i] + ".independentVariableButtonFront").remove();
            d3.select("#" + variableNames[i] + ".independentVariableButtonBack").remove();
            d3.select("#" + variableNames[i] + ".independentVariableText").remove();
            
            var variablePanelSVG = d3.select("#variablePanelSVG");
            var variablePanel = d3.select("#variable.panel");                
            var variablePanelWidth = removeAlphabetsFromString(variablePanel.style("width"));
            var variableNameHolderWidth = variablePanelWidth - 2*variableNameHolderPadding;                                     
            
            variablePanelSVG.append("rect")
                            .attr("x", variableNameHolderWidth - variableNameHolderPadding/4 - variableTypeSelectionButtonWidth)
                            .attr("y", variableNameHolderPadding + i*(variableNameHolderHeight + variableNameHolderPadding) + scaleForWindowSize(2))                                                   
                            .attr("height", variableNameHolderHeight - 2*scaleForWindowSize(2))
                            .attr("width", variableTypeSelectionButtonWidth)
                            .attr("rx", "5px")
                            .attr("ry", "5px")
                            .attr("fill", variableTypeButtonColors["participant"])
                            .attr("id", variableNames[i])
                            .attr("class", "participantVariableButtonBack");
                                    
            variablePanelSVG.append("text")
                            .attr("x", variableNameHolderWidth - variableNameHolderPadding/4 - variableTypeSelectionButtonWidth/2)
                            .attr("y", variableNameHolderPadding + i*(variableNameHolderHeight + variableNameHolderPadding) + (variableNameHolderHeight)/2 + yAxisTickTextOffset/2)                                                   
                            .attr("text-anchor", "middle")
                            .attr("fill", variableTypeTextColors["participant"])
                            .text("SUBJECT")
                            .attr("id", variableNames[i])
                            .attr("class", "participantVariableText");
        }
    }
}

function setVariableDataTypes()
{
    for(var i=0; i<variableNames.length; i++)
    {
        if(variables[variableNames[i]]["dataset"].unique().length == 2)
            variableDataTypes[variableNames[i]] = "binary";
        else
            variableDataTypes[variableNames[i]] = variablesInDatasetDataType[sessionStorage.fileName][i];
    }
    
    for(var i=0; i<variableNames.length; i++)
    {
        switch(variableDataTypes[variableNames[i]])
        {
            case "nominal":
                            //do something
                            break;
            case "ordinal":
                            //do something
                            break;
            case "interval":
                            //do something
                            break;
            case "ratio":
                            //do something
                            break;
            case "binary":
                            //do something
                            break;
        }
    }
}

function findExperimentalDesign()
{
    var participantData = [];
    
    for(var i=0; i<variableNames.length; i++)
    {
        if(variableTypes[variableNames[i]] == "participant")
        {
            participantData = variables[variableNames[i]]["dataset"];
            participants = variableNames[i];
        }
    }
    
    if(participantData.length > participantData.unique().length)
    {
        return "between-groups";
    }
    else
    {
        return "within-groups";
    }
}

function scaleForWindowSize(value)
{
    return value*(height/1105);
}


function toX(x)
{
    return toModifiedViewBoxForRegressionLineXCoordinate(x + (width - canvasWidth))
}

function toY(y)
{
    return toModifiedViewBoxForRegressionLineYCoordinate(canvasHeight - y)
}

function toModifiedViewBoxForRegressionLineXCoordinate(value)
{
    return (value - (width - canvasWidth) + viewBoxXForRegressionLine*(canvasWidth/viewBoxWidthForRegressionLine))*(viewBoxWidthForRegressionLine/canvasWidth);
}

function toModifiedViewBoxForRegressionLineYCoordinate(value)
{
    return (value + viewBoxYForRegressionLine*(canvasHeight/viewBoxHeightForRegressionLine))*(viewBoxHeightForRegressionLine/canvasHeight)
}


//Used to get the normal x,y coordinates from a scaled view box coordinate
function getNormalXAxisCoordinateFromScaledViewBoxCoordinate(value)
{
    return (value*viewBoxWidthForRegressionLine/canvasWidth - viewBoxXForRegressionLine);
}

function getNormalYAxisCoordinateFromScaledViewBoxCoordinate(value)
{
    return viewBoxHeightForRegressionLine - (value*viewBoxHeightForRegressionLine/canvasHeight + viewBoxYForRegressionLine);
}

function setThisVariableEvil(variable)
{    
    d3.select("#" + variable + ".variableNameHolderFront").attr("class", "disabled");
    d3.select("#" + variable + ".variableNameHolderBack").attr("fill", variablePanelColors["disabled"]);
}

function getNumericVariables()
{
    var numericVariables = [];
    
    for(var i=0; i<variableNames.length; i++)
    {   
        if((variableDataTypes[variableNames[i]] != "nominal") && (variableDataTypes[variableNames[i]] != "ordinal"))
        {
            numericVariables.push(variableNames[i]);
        }
    }
    
    return numericVariables;
}

function setOpacityForElementsWithClassNames(classNames, opacity)
{
    for(var i=0; i<classNames.length; i++)
    {
        d3.selectAll("." + classNames[i]).attr("opacity", opacity);
    }
}

function setCompareNowButtonText()
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

function getWidth()
{
      var x = 0;
      if (self.innerHeight)
      {
              x = self.innerWidth;
      }
      else if (document.documentElement && document.documentElement.clientHeight)
      {
              x = document.documentElement.clientWidth;
      }
      else if (document.body)
      {
              x = document.body.clientWidth;
      }
      return x;
}

function getHeight()
{
      var y = 0;
      if (self.innerHeight)
      {
              y = self.innerHeight;
      }
      else if (document.documentElement && document.documentElement.clientHeight)
      {
              y = document.documentElement.clientHeight;
      }
      else if (document.body)
      {
              y = document.body.clientHeight;
      }
      return y;
}

function allVariablesAreNumeric()
{
    var yeah=true;
    
    for(var i=0; i<currentVariableSelection.length; i++)
    {
        if(isNaN(variables[currentVariableSelection[i]]["dataset"][0]))
        {
            yeah = false;
        }
    }
    
    return yeah;
}

function calculateOutcome()
{    
    if(currentVariableSelection.length == 2)
    {    
        var outcomeVariable = document.getElementById("value_outcome");
        var predictorVariable = document.getElementById("value_" + currentVariableSelection[0]);
        
        console.log(outcomeVariable.innerHTML + " = " + testResults["coefficients"] + "*" + predictorVariable.value + " + " + testResults["intercept"]);
        
        outcomeVariable.innerHTML = format5(testResults["coefficients"]*predictorVariable.value + testResults["intercept"]);
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
        
        outcomeVariableLabel.innerHTML = format5(outcomeVariableValue);
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

function getColour(type, value)
{
    var interpretations = effectSizeInterpretations[type];
    
    if(value < interpretations[0])
        return effectSizeColors["small"];
    else if(value >= interpretations[0] && value < interpretations[1])
        return effectSizeColors["small-medium"];
    else if(value >= interpretations[1] && value < interpretations[2])
        return effectSizeColors["medium-large"];
    else if(value >= interpretations[2])
        return effectSizeColors["large"];
}
        
            

      
            
        
        