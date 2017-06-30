// need to move the contents of this page to relevant pages

//d3 dec2s
var dec1 = d3.format(".1f");
var dec2 = d3.format(".2f");
var dec3 = d3.format(".3f");
var dec5 = d3.format(".5f");

// Converts canvas to an image
function convertCanvasToImage(canvas) 
{
  var image = new Image();
  image.onload = function()
  {
    image.src = canvas.toDataURL("image/png");
    d3.select("body").append(image);
  }  
}

function download(canvas, filename) {

    /// create an "off-screen" anchor tag
    var lnk = document.createElement('a'),
        e;

    /// the key here is to set the download attribute of the a tag
    lnk.download = filename;

    /// convert canvas content to data-uri for link. When download
    /// attribute is set the content pointed to by link will be
    /// pushed as "download" in HTML5 capable browsers
    lnk.href = canvas.toDataURL();

    /// create a "fake" click-event to trigger the download
    if (document.createEvent) {

        e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, true, window,
                         0, 0, 0, 0, 0, false, false, false,
                         false, 0, null);

        lnk.dispatchEvent(e);

    } else if (lnk.fireEvent) {

        lnk.fireEvent("onclick");
    }
}

function getStarredHistoryEntryIndices()
{
    var starImages = document.getElementsByClassName("starImage");
    var starredHistoryEntryIndices = new Array();

    for(var i=0; i<starImages.length; i++)
    {
        if(starImages[i].getAttribute("href") == "images/star_fill.png")
            starredHistoryEntryIndices.push(i);
    }

    return starredHistoryEntryIndices;
}

function scaleToHistoryEntry(number)
{
    return (number/plotWidth)*entryWidth;
}

//Subset the data based on the different levels of the independent variable
function subsetDataByLevels(independentVariable)
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

function subsetData2Levels(DV, IVs) // ToDo: do it for all DVs
{
    var levels = new Object();

    for(var i=0; i<IVs.length; i++)
    {
        // For each IV

        // Get levels 
        levels[IVs[i]] = variables[IVs[i]]["dataset"].unique();
    }

    for(var i=0; i<IVs.length; i++)
    {
        for(var j=i+1; j<IVs.length; j++)
        {
            if(i != j)
            {
                for(var l1 = 0; l1<levels[IVs[i]].length; l1++)
                {
                    for(var l2 = 0; l2<levels[IVs[j]].length; l2++)
                    {                     

                        variables[DV][levels[IVs[i]][l1] + "-" + levels[IVs[j]][l2]] = new Array();
                        for(var index = 0; index<variables[DV]["dataset"].length; index++)
                        {
                            if((variables[IVs[i]]["dataset"][index] == levels[IVs[i]][l1]) && (variables[IVs[j]]["dataset"][index] == levels[IVs[j]][l2]))
                            {
                                variables[DV][levels[IVs[i]][l1] + "-" + levels[IVs[j]][l2]].push(variables[DV]["dataset"][index]);
                            }
                        }
                    }
                }                
            }
        }
    }
}

function subsetData3Levels(DV, IVs) // ToDo: do it for all DVs
{
    var levels = new Object();

    for(var i=0; i<IVs.length; i++)
    {
        // For each IV

        // Get levels 
        levels[IVs[i]] = variables[IVs[i]]["dataset"].unique();
    }

    for(var i=0; i<IVs.length; i++)
    {
        for(var j=i+1; j<IVs.length; j++)
        {
            for(var k=j+1; k<IVs.length; k++)
            {            
                for(var l1 = 0; l1<levels[IVs[i]].length; l1++)
                {
                    for(var l2 = 0; l2<levels[IVs[j]].length; l2++)
                    {
                        for(var l3 = 0; l3<levels[IVs[k]].length; l3++)
                        {   
                            // console.log(levels[IVs[i]][l1] + "-" + levels[IVs[j]][l2] + "-" + levels[IVs[k]][l3]);

                            variables[DV][levels[IVs[i]][l1] + "-" + levels[IVs[j]][l2] + "-" + levels[IVs[k]][l3]] = new Array();

                            for(var index = 0; index<variables[DV]["dataset"].length; index++)
                            {
                                if((variables[IVs[i]]["dataset"][index] == levels[IVs[i]][l1]) && (variables[IVs[j]]["dataset"][index] == levels[IVs[j]][l2]) && (variables[IVs[k]]["dataset"][index] == levels[IVs[k]][l3]))
                                {
                                    variables[DV][levels[IVs[i]][l1] + "-" + levels[IVs[j]][l2] + "-" + levels[IVs[k]][l3]].push(variables[DV]["dataset"][index]);
                                }
                            }
                        }
                    }
                }                
            }
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

//returns the length of an object
function getObjectLength(obj) {
    return Object.keys(obj).length;
}

// Selects the default visualisation for the given selection of variables

function selectDefaultVisualisation()
{
    var variableList = sort(selectedVariables);   

    switch(variableList["independent"].length)
    {
        case 0:             
                    switch(variableList["dependent"].length)
                    {
                        case 0:                                    
                                    selectedVisualisation = "";
                                    break;                         

                        case 1:                                
                                    selectedVisualisation = "Histogram";                    
                                    break;

                        case 2:                                
                                    selectedVisualisation = "Scatterplot";
                                    break;
                                   
                        case 3:                                
                                    selectedVisualisation = "Scatterplot matrix";
                                    break;
                                   
                        default:
                                    selectedVisualisation = undefined;                                    
                    }                    
                    break;
                
        case 1:                
                    switch(variableList["dependent"].length)
                    {
                        case 0:                    
                                    selectedVisualisation = "Histogram";
                                    break;
                                   
                        case 1:                               
                                    selectedVisualisation = "Boxplot";
                                    break;
                                   
                        case 2:
                                    selectedVisualisation = "Scatterplot";
                                    break;
                                                                       
                        default:
                                    selectedVisualisation = "Scatterplot matrix";                                    
                    }
                    break;
                
        case 2:
                    switch(variableList["dependent"].length)
                    {
                        case 0:
                                    selectedVisualisation = "Scatterplot";
                                    break;

                        case 1:                              
                                    selectedVisualisation = "Boxplot";
                                    break;

                        default:                                
                                    selectedVisualisation = "Scatterplot matrix";
                    }
                    break;

        case 3:                
                    switch(variableList["dependent"].length)   
                    {
                        case 0:
                                    selectedVisualisation = "Scatterplot matrix";
                                    break;

                        case 1:
                                    selectedVisualisation = "DoSignificanceTest";
                                    break;

                        default:
                                    selectedVisualisation = undefined;

                    }
                    break;
        default:
                    selectedVisualisation = undefined;
    }

    if(selectedVariables.indexOf(participants) != -1)     
        selectedVisualisation = undefined;
    
    if(selectedVisualisation == undefined || selectedVisualisation == "DoSignificanceTest")
        window.VisiStat.UI.leftPane.disableGraphs(["Histogram", "Boxplot", "Scatterplot", "Scatterplot matrix"]);
    else
        window.VisiStat.UI.leftPane.selectGraph(selectedVisualisation, isSelected = true);
}

// Adds a given element to an array by maintain unique elements

function addToArrayWithoutDuplicates(array, element)
{   
    if(array.indexOf(element) == -1)
    {
        array.push(element);    
    }    
    else
    {     
        array.splice(array.indexOf(element), 1);
    }
    
    return array;
}

function addToArrayWithoutDuplicatesWithArray(array)
{   
    for(var i=0; i<variableNames.length; i++)
    {
        var variable = d3.select("#" + variableNames[i] + ".variableNameHolderBack");
        var variableText = d3.select("#" + variableNames[i] + ".variableNameHolderText");    
        
        variable.attr("fill", "url(#buttonFillNormal)");  
        variable.attr("filter", "url(#Bevel)");
        variable.attr("stroke", "black");
        
        variableText.attr("fill", "black");
    }
    
    for(var i=0; i<array.length; i++)
    {
        var variable = d3.select("#" + array[i] + ".variableNameHolderBack");
        var variableText = d3.select("#" + array[i] + ".variableNameHolderText");    
        
        variable.attr("fill", "url(#buttonFillSelected)")
        variable.attr("filter", "none");
        variable.attr("stroke", "none");
        
        variableText.attr("fill", "white");
    } 
}

//Manages the fill colors for visualisation-holders
function setVisibilityOfVisualisations()
{
    var variableList = sort(selectedVariables);    
    var visualisations = ["Histogram", "Boxplot", "Scatterplot", "Scatterplot matrix"];    
    
    switch(variableList["independent"].length)
    {
        case 0:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 0: 
                                window.VisiStat.UI.leftPane.disableGraphs([visualisations[0], visualisations[1], visualisations[2],visualisations[3]]);
                                break;
                        case 1:
                                window.VisiStat.UI.leftPane.disableGraphs([visualisations[2],visualisations[3]]);
                                break;
                        case 2:
                                window.VisiStat.UI.leftPane.disableGraphs([]);
                                break;
                        default:
                                window.VisiStat.UI.leftPane.disableGraphs([visualisations]);
                    }
                    
                    break;
                }
        case 1:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 0: 
                                window.VisiStat.UI.leftPane.disableGraphs([visualisations[1],visualisations[2],visualisations[3]]);
                                break;
                        case 1:
                                window.VisiStat.UI.leftPane.disableGraphs([]);
                                break;
                        case 2:
                                window.VisiStat.UI.leftPane.disableGraphs([visualisations[0], visualisations[1]]);
                                break;
                        default:
                                window.VisiStat.UI.leftPane.disableGraphs([visualisations[0], visualisations[1], visualisations[2]]);
                                break;
                    }
                    
                    break;
                }
        case 2:
                {
                    switch(variableList["dependent"].length)
                    {
                        case 0: 
                                window.VisiStat.UI.leftPane.disableGraphs([visualisations[0], visualisations[1]]);
                                break;
                        case 1:
                                window.VisiStat.UI.leftPane.disableGraphs([visualisations[0]]);
                                break;
                        default:
                                window.VisiStat.UI.leftPane.disableGraphs([visualisations[0], visualisations[1], visualisations[2]]);
                                break;
                    }
                    
                    break;
                }                
    }
}

function validateAll()
{
    var visualizations = d3.selectAll(".invalid");    
    visualizations.attr("fill", "url(#buttonFillNormal)").attr("filter", "url(#Bevel)").attr("opacity", "0.1").attr("class", "visualisationHolderFront");                     
}

function invalidate(list)
{
    var visualizations = document.getElementsByClassName("visualisationHolderFront");
    
    for(var i=0; i<list.length; i++)
    {
        var viz = d3.select("#" + list[i] + ".visualisationHolderFront");
        viz.attr("fill", "grey").attr("opacity", "0.75").attr("class", "invalid");        
    }
}

//STRINGS/NUMBERS PROCESSING
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

//  Convert the numbers in a given string to string (e.g,. "1" becomes "one")

function convertNumbersInInvalidIDToStrings(invalidID)
{
    var validID = "";
    
    for(var i=0; i<invalidID.toString().length; i++)
    {               
        var validChar = isNaN(invalidID.toString().charAt(i)) ? invalidID.toString().charAt(i) : stringForNumber[invalidID.toString().charAt(i)]
        
        validID = validID + validChar;        
    }
    
    return validID;
}

function allVariablesAreNumeric()
{
    var yeah=true;
    
    for(var i=0; i<selectedVariables.length; i++)
    {
        if(isNaN(variables[selectedVariables[i]]["dataset"][0]))
        {
            yeah = false;
        }
    }
    return yeah;
}

function setVariableRoles()
{    
    var IVs = new Array();
    var DVs = new Array();

    for(var i=0; i<variableNames.length; i++)
    {
        variableRoles[variableNames[i]] = sessionStorage.getItem(variableNames[i]);        

        if(variableRoles[variableNames[i]] == "IV")                    
        {
            IVs.push(variableNames[i]);
            subsetDataByLevels(variableNames[i]);
        }
        else if(variableRoles[variableNames[i]] == "DV")
            DVs.push(variableNames[i]);
    }      

    if(IVs.length == 2)
    {
        for(var i=0; i<DVs.length; i++)
            subsetData2Levels(DVs[i], IVs);
    }
    if(IVs.length > 2)
    {
        // Select IVs 3 at a time
        var IVSelections= new Array();

        for(var i=0; i<IVs.length; i++)
        {
            for(var j=i+1; j<IVs.length; j++)
            {
                for(var k=j+1; k<IVs.length; k++)
                {
                    IVSelections.push([IVs[i], IVs[j], IVs[k]]);
                }
            }
        }

        for(var index=0; index<IVSelections.length; index++)
        {
            for(var i=0; i<DVs.length; i++)
                subsetData3Levels(DVs[i], IVSelections[index]);

            // Also subset the data for every two IV combinations

            for(var i=0; i<DVs.length; i++)
            {
                for(var j=0; j<IVSelections[index].length; j++)
                {
                    for(var k=j+1; k<IVSelections[index].length; k++)
                    {         
                        subsetData2Levels(DVs[i], [IVSelections[index][j], IVSelections[index][k]]);
                    }
                }
            }
        }
    }
}

function setVariableTypes()
{
    for(var i=0; i<variableNames.length; i++)
    {
        if(variables[variableNames[i]]["dataset"].unique().length == 2)
            variableTypes[variableNames[i]] = "binary";
        else
            variableTypes[variableNames[i]] = variableTypesInDataset[i];
    }
    
    for(var i=0; i<variableNames.length; i++)
    {
        switch(variableTypes[variableNames[i]])
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
        if(variableRoles[variableNames[i]] == "ID")
        {
            participantData = variables[variableNames[i]]["dataset"];
            participants = variableNames[i];
        }
    }
    
    if(participantData.length > participantData.unique().length)
        return "within-groups";
    else
        return "between-groups";
}

function setThisVariableEvil(variable)
{    
    d3.select("#" + variable + ".variableNameHolderFront").attr("class", "disabled");
    d3.select("#" + variable + ".variableNameHolderBack").attr("fill", variablePanelColors["disabled"]).attr("filter", "none").attr("stroke", "none");
}

function getNumericVariables()
{
    var numericVariables = [];
    
    for(var i=0; i<variableNames.length; i++)
    {   
        if((variableTypes[variableNames[i]] != "nominal") && (variableTypes[variableNames[i]] != "ordinal"))
        {
            numericVariables.push(variableNames[i]);
        }
    }
    
    return numericVariables;
}

// Returns a set of valid IDs (non-numeric)
function getValidIds(IDs)
{    
    for(var i=0; i<IDs.length; i++)
    {
        if(!isNaN(IDs[i])) // If it is a number
        {
            IDIsValid = false;
            IDs[i] = "ValidNow_" + IDs[i];
        }   
        if(!isNaN(IDs[i].toString().charAt(0))) // If the first character is a number
        {
            IDIsValid = false;
            IDs[i] = "ValidNow_" + IDs[i];
        }
        IDs[i] = toValidId(IDs[i]);
    }    
    
    return IDs;
}

function getValidId(ID)
{
    var IDIsValid = true;
        
    if(!isNaN(ID)) // If it is a number
    {
        IDIsValid = false;
        ID = "ValidNow_" + ID;
    }            
    else if(!isNaN(ID.toString().charAt(0))) // If the first character is a number
    {
        IDIsValid = false;
        ID = "ValidNow_" + ID;
    }  
      
    ID = toValidId(ID);
    
    return ID;
}

// Sorts the variables selected for comparison (in the box plot)

function getSelectedVariables()
{
    var means = document.getElementsByClassName("means");
    
    var variableList = new Object();
    
    variableList["dependent"] = new Array();
    variableList["independent"] = new Array();
    variableList["independent-levels"] = new Array();    
    
    // Add DV
    for(var i=0; i<selectedVariables.length; i++)
    {        
        if(variableRoles[selectedVariables[i]] == "DV")
            variableList["dependent"].push(selectedVariables[i]);
        else if(variableRoles[selectedVariables[i]] == "IV")
            variableList["independent"].push(selectedVariables[i]);
    }    
    
    // Add the levels of the independent variable
    if(variableList["independent"].length > 0)
    {
        for(var i=0; i<means.length; i++)
        {
            // For each mean
            if((means[i].getAttribute("fill") == meanColors["click"]) || (means[i].getAttribute("fill") == "green") || ((means[i].getAttribute("fill") == "#008000")))
            {
                // If the mean is selected

                var ID = means[i].getAttribute("id");

                if(ID.split("_")[0] == "ValidNow")
                {
                    // This was an invalid ID that was tampered with. Get the original ID

                    ID = ID.slice(ID.indexOf("_")+1);
                }                

                variableList["independent-levels"].push(ID);                
            }
        }   
    }
    else
    {
        variableList["dependent"] = [];
        for(var i=0; i<means.length; i++)
        {
            if((means[i].getAttribute("fill") == meanColors["click"]) || (means[i].getAttribute("fill") == "green"))
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
        if(variableRoles[list[i]] == "IV")
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

function scaleForWindowSize(value)
{  
    return value*(height/1004);
}

//log the results of the statistical analysis to an object :)
function logResult()
{
    d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight);

    d3.select("#statisticalTestName.assumptionNodes").text(multiVariateTestResults["method"]);
    
    var fillColor = usedMultiVariateTestType == "proper" ? "green" : (usedMultiVariateTestType == "warning") ? "yellow" : "red";
    var displayText = usedMultiVariateTestType == "error" ? "The appropriate test is unavailable in VisiStat. The chosen test should not be reported!" : (usedMultiVariateTestType == "warning") ? "This test does not have the best power for the given data. The appropriate test can be selected from the decision tree." : "The appropriate test has been chosen based on the assumptions";

    if(getToolTip({"id": "statisticalTest", "className": "assumptionNodes"}) != -1)        
        removeToolTip({"id": "statisticalTest", "className": "assumptionNodes"});

    addToolTip("statisticalTest", "assumptionNodes", displayText);
    d3.select("#statisticalTest.assumptionNodes").attr("fill", fillColor);

    if(sessionStorage.getObject("variables.backup") != null)
    {
        variables = sessionStorage.getObject("variables.backup");
        dataset = sessionStorage.getObject("dataset.backup");
        MIN = sessionStorage.getObject("MIN.backup");
        MAX = sessionStorage.getObject("MAX.backup");
        IQR = sessionStorage.getObject("IQR.backup");
        CI = sessionStorage.getObject("CI.backup");
    }
    
    if(global.flags.isTestWithoutTimeout)
        return;

    logListTests.push(
        {
            time: new Date().getTime(), 
            dataset: sessionStorage.fileName,
            formula: multiVariateTestResults["formula"].slice(0),
            test: multiVariateTestResults["test-type"].slice(0)
        }
    );

    // printLogList();
    writeToFileTests(sessionStorage.logFileName + "_significance_tests");
    //writeToFile(String(new Date().getTime()));

    log.push(multiVariateTestResults["method"] + ", " + multiVariateTestResults["formula"]);

    if(listOfResearchQuestions.indexOf(multiVariateTestResults["formula"]) != -1)
        return;
    
    listOfResearchQuestions.push(multiVariateTestResults["formula"]);
    listOfVariableSelections.push((selectedVariables.clone()).clone());
    listOfVisualizationSelections.push(selectedVisualisation);
    listOfTestTypes.push(multiVariateTestResults["test-type"].slice(0));
    listOfLevelsCompared.push(getSelectedVariables());

    var levels = (getSelectedVariables())["independent-levels"];
    variableLists.push(levels.slice(0));   
    
    updateHistory(multiVariateTestResults["formula"]);    
}

function printLogList()
{
    console.log(" - - - - - - - - - - - - - LOG - - - - - - - - - - - - - ");

    for(var i=0; i<logList.length; i++)
    {
        console.log("\n");
        console.dir(logList[i]);
    }
}

function getNumberOfSelectedMeans()
{
    var means = document.getElementsByClassName("means");
    
    var count = 0;
    
    for(var i=0; i<means.length; i++)
    {
        if(means[i].getAttribute("fill") == meanColors["click"])
        {
            count++;
        }
    }
    
    return count;
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

Array.prototype.clone = function() {
    return this.slice(0);
};


function getAllIndependentVariables()
{
    var IV = new Array();

    for(var i=0; i<variableNames.length; i++)
    {
        // console.log("variableRoles[" + variableNames[i] + "] = " + variableRoles[variableNames[i]]);

        if(variableRoles[variableNames[i]] == "independent")
            IV.push(variableNames[i].slice(0));
    }

    return IV;
}

function eliminateDuplicates(arr) {
  var i,
      len=arr.length,
      out=[],
      obj={};
 
  for (i=0;i<len;i++) {
    obj[arr[i]]=0;
  }
  for (i in obj) {
    out.push(i);
  }
  return out;
}

function getBoundingBoxForText(cx, cy, buttonText, canvas, padding)
{    
    if(typeof(padding) === 'undefined') padding = 10;

    canvas.append("text")
                .attr("x", cx)
                .attr("y", cy)
                .text(buttonText)
                .attr("fill", "black")
                .attr("font-size", fontSizes["button label"])
                .attr("text-anchor", "middle")
                .attr("id", "temporaryText");

    var text = d3.select("#temporaryText");         
    var bbox = text.node().getBBox();

    removeElementById("temporaryText");

    bbox.x -= padding;
    bbox.y -= padding;
    bbox.width += 2*padding;
    bbox.height += 2*padding;

    return bbox;
}

function setOpacityForElementsWithClassNames(classNames, opacity)
{
    for(var i=0; i<classNames.length; i++)
    {
        d3.selectAll("." + classNames[i]).transition().duration(1000).delay(500).attr("opacity", opacity);
    }
}

function getNumberOfTicks(aHeight)
{
    return Math.round((30/(height - assumptionsPanelHeight)) * aHeight * 0.95);
}
    
function addToolTip(id, className, displayText, displaySubText, targetID, targetClassName, jointDirection, toolTipType)
{
    if(typeof(toolTipType) === "undefined") toolTipType = "dark";
    if(typeof(jointDirection) === "undefined") jointDirection = "top left";
    
    displayText += (typeof(displaySubText) === "undefined") ? "" : "<br><span class='outlierTooltip'>" + displaySubText + "</span>";

    var key = "#" + id;
    
    if(className != null)
        key = key + "." + className;

    // if(getToolTip({id: id, className: className}) != -1)
    //     removeToolTip({id: id, className: className});

    if(typeof(targetID) === "undefined")
    {
        toolTips[key] = new Opentip($(key), {style: "dark", tipJoint: jointDirection});    
    }
    else
    {
        toolTips[key] = new Opentip($(key), {style: "dark",  tipJoint: jointDirection, target: "#" + targetID + "." + targetClassName, fixed: true});
    }

    toolTips[key].setContent(displayText);
}

function getToolTip(element)
{
    var key = "#" + element.id;

    if(element.className != null) 
        key += "." + element.className;    

    if(toolTips.hasOwnProperty(key))
        return toolTips[key];
    else
        return -1;
}

function showToolTip(element)
{    
    var toolTip = getToolTip(element);    

    if(toolTip != -1)
        toolTip.show();
}

function hideToolTip(element)
{
    var toolTip = getToolTip(element);

    if(toolTip != -1)
        toolTip.hide();
}

function removeToolTip(element)
{
    var toolTip = getToolTip(element);    
    var key = "#" + element.id;

    if(element.className != null) 
        key += "." + element.className;

    if(toolTip != -1)
    {
        toolTip.deactivate();
        delete toolTips.key;
    }
}

/**
 * Returns all possible distributions for 1 IV, 2 IV, or 3 IV
 * @return {array} An array of distributions (unlabelled)
 */
function getAllDistributions()
{
    var distributions = {};
    var variableList = sort(selectedVariables);

    var DV = variableList["dependent"][0];
    var IVs = variableList["independent"];

    switch(IVs.length)
    {
        case 1:
                    var levels = variables[IVs[0]]["dataset"].unique();

                    for(var i=0; i<levels.length; i++)
                        distributions[levels[i]] = variables[DV][levels[i]];

                    break;
        case 2:
                    var levelsA = variables[IVs[0]]["dataset"].unique();
                    var levelsB = variables[IVs[1]]["dataset"].unique();

                    for(var i=0; i<levelsA.length; i++)
                    {
                        for(var j=0; j<levelsB.length; j++)
                        {
                            if(variables[DV].hasOwnProperty(levelsA[i] + "-" + levelsB[j]))
                                distributions[levelsA[i] + "-" + levelsB[j]] = variables[DV][levelsA[i] + "-" + levelsB[j]];
                            else                                
                                distributions[levelsB[j] + "-" + levelsA[i]] = variables[DV][levelsB[j] + "-" + levelsA[i]];
                        }
                    }

                    break;
        case 3:
                    var levelsA = variables[IVs[0]]["dataset"].unique();
                    var levelsB = variables[IVs[1]]["dataset"].unique();
                    var levelsC = variables[IVs[2]]["dataset"].unique();

                    for(var i=0; i<levelsA.length; i++)
                    {
                        for(var j=0; j<levelsB.length; j++)
                        {
                            for(var k=0; k<levelsC.length; k++)
                            {                                
                                if(variables[DV].hasOwnProperty(levelsA[i] + "-" + levelsB[j] + "-" + levelsC[k]))
                                    distributions[levelsA[i] + "-" + levelsB[j] + "-" + levelsC[k]] = variables[DV][levelsA[i] + "-" + levelsB[j] + "-" + levelsC[k]];
                                if(variables[DV].hasOwnProperty(levelsA[i] + "-" + levelsC[k] + "-" + levelsB[j]))
                                    distributions[levelsA[i] + "-" + levelsC[k] + "-" + levelsB[j]] = variables[DV][levelsA[i] + "-" + levelsC[k] + "-" + levelsB[j]];
                                if(variables[DV].hasOwnProperty(levelsB[j] + "-" + levelsA[i] + "-" + levelsC[k]))
                                    distributions[levelsB[j] + "-" + levelsA[i] + "-" + levelsC[k]] = variables[DV][levelsB[j] + "-" + levelsA[i] + "-" + levelsC[k]];
                                if(variables[DV].hasOwnProperty(levelsB[j] + "-" + levelsC[k] + "-" + levelsA[i]))
                                    distributions[levelsB[j] + "-" + levelsC[k] + "-" + levelsA[i]] = variables[DV][levelsB[j] + "-" + levelsC[k] + "-" + levelsA[i]];
                                if(variables[DV].hasOwnProperty(levelsC[k] + "-" + levelsA[i] + "-" + levelsB[j]))
                                    distributions[levelsC[k] + "-" + levelsA[i] + "-" + levelsB[j]] = variables[DV][levelsC[k] + "-" + levelsA[i] + "-" + levelsB[j]];
                                if(variables[DV].hasOwnProperty(levelsC[k] + "-" + levelsB[j] + "-" + levelsA[i]))
                                    distributions[levelsC[k] + "-" + levelsB[j] + "-" + levelsA[i]] = variables[DV][levelsC[k] + "-" + levelsB[j] + "-" + levelsA[i]];               
                            }
                        }
                    }

                    break;
        default:
                    console.log("Error: unhandled case");
                    break

    }

    return distributions;
}
