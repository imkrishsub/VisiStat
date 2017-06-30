function displayDataForVariable(variable)
{
    var variableData = variables[variable]["dataset"];
    
    var LEFT = plotPanelWidth/2 - plotWidth/2;
    var RIGHT = plotPanelWidth/2 + plotWidth/2;
    
    var TOP = plotPanelHeight/2 - plotHeight/2;
    var BOTTOM = plotPanelHeight/2 + plotHeight/2;
    
    var canvas = d3.select("#canvas");
    
    canvas.append("p")
            .text("Unfortunately, this variable has too many levels and does not have a meaningful visualisation!")
            .attr("align", "center")
            .attr("style", "font-size: " + fontSizeForDisplayDataTitle )
            .attr("class", "displayDataText");
    
    var table = canvas.append("table")
            .attr("border", "1")
            .attr("class", "displayDataTable")
            .attr("style", "font-size: " + fontSizeForDisplayDataTableElements + "px; position: relative; width: 30%; top: " + scaleForWindowSize(45) + "px; margin: 0 auto; border-spacing: 0; border-collapse: collapse;");
            
    table.append("tr").append("th").text(variable).attr("style", "font-size: " + 1.3*fontSizeForDisplayDataTableElements + "px;");      
            
    for(var i=0; i<variableData.length; i++)
    {
        if(i < displayDataLimit)
        {
            if(i > rangeToFade)
            {
                table.append("tr").append("td").text(variableData[i]).attr("align", "center").attr("style", "color: rgba(0, 0, 0, " + ((displayDataLimit - i)/(displayDataLimit - rangeToFade))*1 + ")");
            }
            else
            {
                table.append("tr").append("td").attr("align", "center").text(variableData[i]);            
            }
        }
    }
}

//drawing
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

function generateReport(researchQuestion, type, withDownloadButton)
{
    var reportPanel = d3.select("#reportPanel");
    var table;

    if(document.getElementById("reportTable") == null)
    {
        table = reportPanel.append("table").attr("id", "reportTable");
    }
    else
    {
        table = d3.select("#reportTable");
    }
    
    var tr = table.append("tr");

    tr.append("td")
                .html(getReportingText(researchQuestion))
                .attr("id", "report")
                .attr("style", "width: " + (reportPanelWidth - plotPanelWidth) + "px; height: " + plotPanelHeight + "px; display: table-cell; vertical-align: middle; font-family: \"Verdana\", sans-serif;");

    var id = listOfResearchQuestions.indexOf(researchQuestion);

    var altCanvas = tr.append("td").append("svg")
                            .attr("x", reportPanelWidth/2 - plotPanelWidth/2)
                            .attr("y", scaleForWindowSize(25))
                            .attr("width", plotPanelWidth)
                            .attr("height", plotPanelHeight)
                            .attr("id", "reportCanvas" + researchQuestionsSelectedForReport.indexOf(researchQuestion))
                            .attr("style", "float: right");

    altCanvas.append("use")
            .attr("xlink:href", "#plotCanvas");

    altCanvas.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width - sidePanelWidth)
            .attr("height", plotPanelHeight)
            .attr("fill", "white")
            .attr("opacity", "0.01")
            .attr("style", "z-index: +1");
}

function renderSidePanel()
{
    return; 

    var sideCanvas = d3.select("#sideCanvas");
    var reportButtonCanvas = d3.select("#reportButtonCanvas");
    var modeButtonCanvas = d3.select("#modeButtonCanvas");

    var buttonOffsetLeft = scaleForWindowSize(10);
    var advancedPlotButtonWidth = (sidePanelWidth - 3*buttonOffsetLeft)/2;
    var advancedPlotButtonHeight = parseFloat(sideCanvasButtonHeight) + parseFloat(visualizationHolderRadius);

    // History button
    
    modeButtonCanvas.append("rect") 
                .attr("x", buttonOffsetLeft)
                .attr("y", tabTopSelected)           
                .attr("width", advancedPlotButtonWidth)
                .attr("height", advancedPlotButtonHeight)
                .attr("rx", parseFloat(visualizationHolderRadius))
                .attr("ry", parseFloat(visualizationHolderRadius))
                .attr("fill", "#627bf4")                
                .attr("id", "historyButtonBack")                
                .attr("class", "sideCanvasButtons");   

    modeButtonCanvas.append("text")
                .attr("x", sidePanelWidth/4)
                .attr("y", parseFloat(sideCanvasButtonHeight/2) + parseFloat(tabTopSelected)/2)            
                .attr("fill", "white")
                .attr("text-anchor", "middle")
                .attr("font-size", historyButtonTextSize)
                .attr("id", "historyButtonText")
                .attr("class", "sideCanvasButtonTexts")
                .text("History");

    modeButtonCanvas.append("rect")
                .attr("x", buttonOffsetLeft)
                .attr("y", tabTopSelected)   
                .attr("width", advancedPlotButtonWidth)
                .attr("height", advancedPlotButtonHeight)
                .attr("rx", parseFloat(visualizationHolderRadius))
                .attr("ry", parseFloat(visualizationHolderRadius))
                .attr("fill", "#627bf4")                
                .attr("opacity", "0.01")           
                .attr("id", "historyButtonFront")
                .attr("class", "sideCanvasButtons");    

    // Help button

    modeButtonCanvas.append("rect")
                .attr("x", (sidePanelWidth + buttonOffsetLeft)/2)
                .attr("y", tabTopUnselected)
                .attr("width", advancedPlotButtonWidth)
                .attr("height", advancedPlotButtonHeight)
                .attr("rx", parseFloat(visualizationHolderRadius))
                .attr("ry", parseFloat(visualizationHolderRadius))
                .attr("stroke", "black")
                .attr("fill", "#f8f9f7")                
                .attr("id", "helpButtonBack")
                .attr("class", "sideCanvasButtons");  

    modeButtonCanvas.append("text")
                .attr("x", 3*sidePanelWidth/4)
                .attr("y", (sideCanvasButtonHeight + tabTopUnselected)/2)
                .attr("fill", "black")
                .attr("text-anchor", "middle")
                .attr("font-size", historyButtonTextSize)
                .attr("id", "helpButtonText")
                .attr("class", "sideCanvasButtonTexts")
                .text("Help"); 

    modeButtonCanvas.append("rect")
                .attr("x", (sidePanelWidth + buttonOffsetLeft)/2)
                .attr("y", tabTopUnselected)
                .attr("width", advancedPlotButtonWidth)
                .attr("height", advancedPlotButtonHeight)
                .attr("rx", parseFloat(visualizationHolderRadius))
                .attr("ry", parseFloat(visualizationHolderRadius))
                .attr("stroke", "black")
                .attr("fill", "#f8f9f7")                
                .attr("opacity", "0.01")
                .attr("id", "helpButtonFront")
                .attr("class", "sideCanvasButtons");    

    // - - - - - - - - - - - - - 

    // Generate button report

    var reportButtonOffset = scaleForWindowSize(10);

    reportButtonCanvas.append("rect")
                .attr("x", reportButtonOffset)
                .attr("y", reportButtonOffset)
                .attr("width", sidePanelWidth - 2*reportButtonOffset)
                .attr("height", sideCanvasButtonHeight - 2*reportButtonOffset)
                .attr("rx", visualizationHolderRadius)
                .attr("ry", visualizationHolderRadius)
                .attr("stroke", "black")
                .attr("fill", "url(#buttonFillNormal)")
                .attr("filter","url(#Bevel)")
                .attr("id", "reportButtonBack")
                .attr("class", "sideCanvasButtons");

    reportButtonCanvas.append("text")
                .attr("x", sidePanelWidth/2)
                .attr("y", sideCanvasButtonHeight/2 + scaleForWindowSize(3))
                .attr("fill", "black")
                .attr("text-anchor", "middle")
                .attr("font-size", historyButtonTextSize)
                .attr("id", "reportButtonText")
                .attr("class", "sideCanvasButtonTexts")
                .text("Create report");     

    reportButtonCanvas.append("rect")
                .attr("x", reportButtonOffset)
                .attr("y", reportButtonOffset)
                .attr("width", sidePanelWidth - 2*reportButtonOffset)
                .attr("height", sideCanvasButtonHeight - 2*reportButtonOffset)
                .attr("rx", visualizationHolderRadius)
                .attr("ry", visualizationHolderRadius)
                .attr("stroke", "black")
                .attr("fill", "url(#buttonFillNormal)")
                .attr("filter","url(#Bevel)")
                .attr("opacity", "0.01")
                .attr("id", "reportButtonFront")
                .attr("class", "sideCanvasButtons");    
}

/**
 * Renders an entry in the history panel for the given research question
 * @param  {string} researchQuestion ['Formula' that is added by OCPU function calls]
 * @return {none}                  
 */
function updateHistory(researchQuestion)
{
    d3.selectAll(".selectedEntryIndicators").attr("style", "display: none;");

    addEntryToHistory(researchQuestion, numberOfEntriesInHistory);
    
    numberOfEntriesInHistory++;

    checkIfOverTesting();
}

// Plots the default visualisation/visualisation explicitly selected by the user

function plotVisualisation()
{   
    resetSVGCanvas();
       
    switch(selectedVisualisation)
    {
        case "Histogram":
                                    curveX = [];
                                    curveY = [];
                                        
                                    plotHistogram();
                                        
                                    break;

        case "Boxplot":                                
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
                                    multiVariateTestResults = new Object();
                                    distributions = new Object();
                                    variances = new Object();
                                    
                                    makeBoxPlotInPlotCanvas();
                                    
                                    break;
                                
        case "Scatterplot":                                    
                                    
                                    makeScatterplot();
                                    
                                    break;
                                    
        case "Scatterplot matrix":
                                    
                                    makeScatterplotMatrix();
                                    
                                    break;

        case "DoSignificanceTest":

                                    compareMeans();

                                    break;

        case undefined:
        case "":
                                    d3.select("#plotCanvas").append("text")
                                                                                .attr("x", plotPanelWidth/2)
                                                                                .attr("y", plotPanelHeight/2)
                                                                                .attr("font-size", "16px")
                                                                                .attr("text-anchor", "middle")
                                                                                .attr("fill", "grey")
                                                                                .text("");
                                    
    }
}

function resetSVGCanvas()
{
    effects = {};
    global.interactionEffect = {};

    removeElementsByClassName("regressionPredictionDiv");
    removeElementsByClassName("dialogBox");    

    dataIsIncomplete = false;
    
    // Reset the SVG canvases

    if(document.getElementById("plotCanvas") != null)
        removeElementById("plotCanvas");
    if(document.getElementById("buttonCanvas") != null)
        removeElementById("buttonCanvas");
    if(document.getElementById("assumptionsCanvas") != null)
        removeElementById("assumptionsCanvas");
    if(document.getElementById("resultsCanvas") != null)
        removeElementById("resultsCanvas");
    if(document.getElementById("decisionTreeDiv") != null)        
        removeElementById("decisionTreeDiv");
    if(document.getElementById("effectsPlotPanel") != null)
        removeElementById("effectsPlotPanel");
    if(document.getElementById("effectsPlotHelp") != null)
        removeElementById("effectsPlotHelp");
    if(document.getElementById("postHocResultsPanel") != null)
        removeElementById("postHocResultsPanel");
         
    var plotCanvas = d3.select("#plotPanel").append("svg");   
    plotCanvas.attr("id", "plotCanvas")
              .attr("x", 0)
              .attr("y", 0)
              .attr("height", plotPanelHeight)
              .attr("width", plotPanelWidth)
              .attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight);
            
    var buttonCanvas = d3.select("#buttonsPanel").append("svg");        
    buttonCanvas.attr("id", "buttonCanvas")
              .attr("x", 0)
              .attr("y", 0)
              .attr("height", buttonsPanelHeight)
              .attr("width", buttonsPanelWidth)
              .attr("viewBox", "0 0 " + buttonsPanelWidth + " " + buttonsPanelHeight);

    var assumptionsCanvas = d3.select("#assumptionsPanel").append("svg");        
    assumptionsCanvas.attr("id", "assumptionsCanvas")
              .attr("x", 0)
              .attr("y", 0)
              .attr("height", assumptionsPanelHeight)
              .attr("width", assumptionsPanelWidth)
              .attr("viewBox", "0 0 " + assumptionsPanelWidth + " " + assumptionsPanelHeight);

    var resultsCanvas = d3.select("#resultsPanel").append("svg");        
    resultsCanvas.attr("id", "resultsCanvas")
              .attr("x", 0)
              .attr("y", 0)
              .attr("height", resultsPanelHeight)
              .attr("width", resultsPanelWidth)
              .attr("viewBox", "0 0 " + resultsPanelWidth + " " + resultsPanelHeight);

    if(document.getElementById("reportButtonCanvas") == null)
    {
        var reportButtonCanvas = d3.select("#reportButtonPanel").append("svg");
        reportButtonCanvas.attr("id", "reportButtonCanvas")
                  .attr("x", 0)
                  .attr("y", 0)
                  .attr("height", sideCanvasButtonHeight)
                  .attr("width", sidePanelWidth)
                  .attr("viewBox", "0 0 " + sidePanelWidth + " " + sideCanvasButtonHeight);
    }

    if(document.getElementById("modeButtonCanvas") == null)
    {
        var modeButtonCanvas = d3.select("#modeButtonPanel").append("svg");
        modeButtonCanvas.attr("id", "modeButtonCanvas")
                  .attr("x", 0)
                  .attr("y", 0)
                  .attr("height", sideCanvasButtonHeight)
                  .attr("width", sidePanelWidth)
                  .attr("viewBox", "0 0 " + sidePanelWidth + " " + sideCanvasButtonHeight);
    }

    drawResetButton();    
    hideResetButton();
}

function showResetButton()
{
    d3.selectAll(".resetButton").attr("display", "inline");
}

function drawResetButton()
{
    drawButton("Reset selection", "resetButton", plotPanelWidth - 70, plotPanelHeight - 50, "plotCanvas");
}

function hideResetButton()
{
    d3.selectAll(".resetButton").attr("display", "none");
}


/**
 * Draws a button by using the bounding box of the given text
 * @param  {string} buttonText [the text in the button]
 * @param  {string} className  [name of the class]
 * @param  {float} cx         [center of the button (x)]
 * @param  {float} cy         [center of the button (y)]
 * @param  {string} canvasID   ['id' attribute of the canvas where the button is to be drawn]
 * @param  {boolean} disabled   [a flag indicating if the button is to be drawn disabled or enabled]
 * @return {none} 
 */
function drawButton(buttonText, className, cx, cy, canvasID, disabled)
{
    // default arguments
    if(typeof(cx) === 'undefined') cx = buttonsPanelWidth/2;
    if(typeof(cy) === 'undefined') cy = buttonsPanelHeight/2;
    if(typeof(canvasID) === 'undefined') canvasID = "buttonCanvas";   
    if(typeof(disabled) === 'undefined') disabled = false;

    var canvas = d3.select("#" + canvasID);       

    // if there is already a button in buttonCanvas (max = 2 for now)
    if(d3.selectAll("#buttonCanvas").select("#button")[0][0] != null && canvasID == "buttonCanvas")
    {
        console.log("Warning: another button detected at this position!");

        var currentButton = d3.select("#buttonCanvas").select("#button"); 
        var currentButtonText = d3.select("#buttonCanvas").select("#text"); 

        // change position of current button

        var tempBoundingBox = getBoundingBoxForText(cx, buttonsPanelHeight/3, currentButtonText, canvas);
        currentButton.attr("y", tempBoundingBox.y);
        currentButtonText.attr("y", buttonsPanelHeight/3);       

        // change settings of new button

        cy = 2*buttonsPanelHeight/3;
    }

    var boundingBox = getBoundingBoxForText(cx, cy, buttonText, canvas);   

    var buttonLeft = boundingBox.x;
    var buttonTop = boundingBox.y;

    var buttonWidth = boundingBox.width;
    var buttonHeight = boundingBox.height;  

    var buttonFill = disabled ? "url(#buttonFillDisabled)" : "url(#buttonFillNormal)";   
    var buttonFilter = disabled ? "none" : "url(#Bevel)";
    var textColor = disabled ? "lightgrey" : "black";    
    className = disabled ? "disabled" : className;    
    
    canvas.append("rect")
            .attr("x", buttonLeft)
            .attr("y", buttonTop)
            .attr("width", buttonWidth)
            .attr("height", buttonHeight)
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("fill", buttonFill)            
            .attr("filter", buttonFilter)
            .attr("stroke", "black")
            .attr("id", "button")
            .attr("class", className);
    
    canvas.append("text")
            .attr("x", cx)
            .attr("y", cy)
            .attr("text-anchor", "middle")
            .text(buttonText)
            .attr("font-size", fontSizes["button label"] )
            .attr("fill", textColor)
            .attr("id", "text")
            .attr("class", className); 
}

function drawDialogBoxToGetOutcomeVariable()
{
    var canvas = d3.select("#plotCanvas");
    
    var dialogBoxHeight = plotHeight/2;
    var dialogBoxWidth = plotWidth/2;
    
    var centerX = plotPanelWidth/2;
    var centerY = plotPanelHeight/2;
    
    var variableList = sort(selectedVariables);
    
    canvas.append("rect")
            .attr("x", centerX - dialogBoxWidth/2)
            .attr("y", centerY - dialogBoxHeight/2)
            .attr("width", dialogBoxWidth)
            .attr("height", dialogBoxHeight)
            .attr("rx", "5px")
            .attr("ry", "5px")
            .attr("fill", "white")
            .attr("stroke", "grey")
            .attr("filter", "url(#shadow)")
            .attr("id", "regression")
            .attr("class", "dialogBox");
    
    canvas.append("text")
            .attr("x", centerX)
            .attr("y", centerY - dialogBoxHeight/4)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeVariablePanel )
            .text("SELECT THE OUTCOME VARIABLE")
            .attr("id", "regression")
            .attr("class", "dialogBox");
            
    var step = (dialogBoxHeight/2)/selectedVariables.length;
    var yStart = centerY;
    var buttHeight = step - 10;
    
    for(var i=0; i<selectedVariables.length; i++)
    {
        if(variableRoles[selectedVariables[i]] == "dependent")
        {
            canvas.append("rect")
                    .attr("x", centerX - dialogBoxWidth/3)
                    .attr("y", i*step + yStart)
                    .attr("width", 2*dialogBoxWidth/3)
                    .attr("height", buttHeight)
                    .attr("rx", scaleForWindowSize(10) )
                    .attr("ry", scaleForWindowSize(10) )
                    .attr("fill", "url(#buttonFillNormal)")
                    .attr("filter", "url(#Bevel)")
                    .attr("stroke", "black")
                    .attr("id", selectedVariables[i])
                    .attr("class", "outcomeVariable");
            canvas.append("text")
                    .attr("x", centerX)
                    .attr("y", i*step + yStart + buttHeight/2 + yAxisTickTextOffset)
                    .attr("text-anchor", "middle")
                    .text(selectedVariables[i])
                    .attr("font-size", fontSizeVariablePanel)
                    .attr("id", selectedVariables[i])
                    .attr("class", "outcomeVariable");
        }
    }
}

function drawDialogBoxToGetPopulationMean()
{
    var canvas = d3.select("#plotCanvas");
    
    var dialogBoxHeight = plotHeight/2;
    var dialogBoxWidth = plotWidth/2;
    
    var centerX = plotPanelWidth/2;
    var centerY = plotPanelHeight/2;
    
    var variableList = sort(selectedVariables);
    
    canvas.append("rect")
            .attr("x", centerX - dialogBoxWidth/2)
            .attr("y", centerY - dialogBoxHeight/2)
            .attr("width", dialogBoxWidth)
            .attr("height", dialogBoxHeight/3)
            .attr("rx", "5px")
            .attr("ry", "5px")
            .attr("fill", "white")
            .attr("stroke", "grey")
            .attr("filter", "url(#shadow)")
            .attr("id", "regression")
            .attr("class", "dialogBox");
    
    var LEFT = (width - plotPanelWidth - sideBarWidth) + centerX - dialogBoxWidth/2;
    var TOP = centerY - dialogBoxHeight/2;
    
    var divElement = d3.select("body").append("div").attr("style", "position: absolute; left: " + LEFT + "px; top: " + TOP + "px; height: " + dialogBoxHeight + "px; width: " + dialogBoxWidth + "px; text-align: center;").attr("class", "dialogBox");

    var normality = d3.select("#normality.assumptionNodes");
    var inText = d3.select("#normality.crosses").attr("display") == "inline" ? "POPULATION MEDIAN = " : "POPULATION MEAN = ";
    
    divElement.append("label")
                .attr("align", "center")
                .attr("vertical-align", "middle")
                .attr("style", "font:1.2em \"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif; color: black; padding-top: 10px;")
                .text(inText);
    divElement.append("input")
                .attr("type", "text")
                .attr("style", "border-color: #000000")
                .attr("id", "populationValue");
                
    divElement.append("br");
    divElement.append("br");
    
    divElement.append("input")
                .attr("type", "button")
                .attr("onclick", "populationMeanEntered()")
                .attr("id", "oneSampleTestButton")
                .attr("style", "fill: url(#buttonFillNormal); filter: url(#Bevel)")
                .attr("value","TEST AGAINST POPULATION ESTIMATE");    
}   

// - - - - - - - - - - - - - Assumptions - - - - - - - - - - - - - 

function drawAssumptionNodes(postHocComparisonsArePossible)
{
    var canvas = d3.select("#assumptionsCanvas");

    var timeOut = global.flags.isTestWithoutTimeout  ? 0 : config.timeouts.assumptionDecisionTree;

    // ToDo: scale and position the nodes dynamically (based on whether post-hoc comparisons are done)

    var numberOfNodes = postHocComparisonsArePossible ? 4 : 3;     
    var assumptionsNodeSize = (assumptionsPanelHeight - 2*assumptionNodesMargin)/(2*numberOfNodes - 1); // offset at top and bottom   
    
    setTimeout(function(){
        
        for(var i=0; i<assumptions.length; i++)
        {                                
            canvas.append("text")
                    .attr("x", assumptionNodesLeftOffset + assumptionsNodeSize*Math.sqrt(2) + assumptionNodesMargin)  
                    .attr("y", assumptionNodesMargin + i*2*assumptionsNodeSize + (assumptionsNodeSize*Math.sqrt(2))/2)
                    .attr("font-size", fontSizeAssumptions )
                    .attr("text-decoration", "underline")
                    .attr("fill", "black")
                    .text(assumptionsText[assumptions[i]])
                    .attr("id", assumptions[i])
                    .attr("class", "assumptionsText");     

            canvas.append("line")
                                .attr("x1", assumptionNodesLeftOffset + assumptionsNodeSize/2)
                                .attr("y1", assumptionNodesMargin + i*2*assumptionsNodeSize + assumptionsNodeSize)
                                .attr("x2", assumptionNodesLeftOffset + assumptionsNodeSize/2)
                                .attr("y2", assumptionNodesMargin + i*2*assumptionsNodeSize + 2*assumptionsNodeSize)
                                .attr("stroke", "black")
                                .attr("stroke-width", "2px");                                

            canvas.append("rect")
                                .attr("x", assumptionNodesLeftOffset)                                
                                .attr("y", (i*2*assumptionsNodeSize) + assumptionNodesMargin)
                                .attr("width", assumptionsNodeSize)
                                .attr("height", assumptionsNodeSize)
                                .attr("transform", "rotate (45 " + (assumptionNodesLeftOffset + (assumptionsNodeSize/2)) + " " + ((i*2*assumptionsNodeSize) + assumptionNodesMargin + (assumptionsNodeSize/2)) + ")")
                                .attr("fill", "white")
                                .attr("stroke", "black")
                                .attr("id", assumptions[i])
                                .attr("class", "assumptionNodes");                  
        }  

        canvas.append("rect")
                    .attr("x", assumptionNodesLeftOffset)
                    .attr("y", 4*assumptionsNodeSize + assumptionNodesMargin)
                    .attr("width", assumptionsNodeSize)
                    .attr("height", assumptionsNodeSize)                    
                    .attr("fill", "white")
                    .attr("stroke", "black")
                    .attr("id", "statisticalTest")
                    .attr("class", "assumptionNodes");  

        canvas.append("text")
                            .attr("x", assumptionNodesLeftOffset + assumptionsNodeSize*Math.sqrt(2) + assumptionNodesMargin)  
                            .attr("y", assumptionNodesMargin + 2*2*assumptionsNodeSize + (assumptionsNodeSize*Math.sqrt(2))/2)
                            .attr("font-size", fontSizeAssumptions )
                            .attr("fill", "black")
                            .text("Choosing the test based on assumptions...")
                            .attr("id", "statisticalTestName")
                            .attr("class", "assumptionNodes");     
    }, timeOut);

    // Settings button

    canvas.append("rect")
                        .attr("x", assumptionsPanelWidth - settingsButtonOffset - settingsButtonRadius - settingsButtonImageWidth*1.1/2)
                        .attr("y", settingsButtonOffset + settingsButtonRadius - settingsButtonImageWidth*1.1/2)
                        .attr("width", settingsButtonImageWidth*1.1)
                        .attr("height", settingsButtonImageWidth*1.1)
                        .attr("fill", "url(#buttonFillNormal)")
                        .attr("filter", "url(#Bevel)")
                        .attr("stroke", "black")
                        .attr("stroke-width", scaleForWindowSize(4) )
                        .attr("id", "settingsButtonBack")
                        .attr("class", "settingsButtons");

    canvas.append("image")
                        .attr("x", assumptionsPanelWidth - settingsButtonOffset - settingsButtonRadius - settingsButtonImageWidth/2)
                        .attr("y", settingsButtonOffset + settingsButtonRadius - settingsButtonImageWidth/2)
                        .attr("width", settingsButtonImageWidth)
                        .attr("height", settingsButtonImageWidth)
                        .attr("xlink:href", "images/settings.png")
                        .attr("id", "settingsButtonImage")
                        .attr("class", "settingsButtons");

    canvas.append("rect")
                        .attr("x", assumptionsPanelWidth - settingsButtonOffset - settingsButtonRadius - settingsButtonImageWidth*1.1/2)
                        .attr("y", settingsButtonOffset + settingsButtonRadius - settingsButtonImageWidth*1.1/2)
                        .attr("width", settingsButtonImageWidth*1.1)
                        .attr("height", settingsButtonImageWidth*1.1)             
                        .attr("fill", "url(#buttonFillNormal)")
                        .attr("filter", "url(#Bevel)")
                        .attr("stroke", "black")
                        .attr("opacity", "0.01")
                        .attr("id", "settingsButtonFront")
                        .attr("class", "settingsButtons");    
}

function addEntryToDecisionTreeNodes()
{    
    var canvas = d3.select("#assumptionsCanvas");
    var nNodes = 4; //incl. post-hoc
    var assumptionsNodeSize = (assumptionsPanelHeight - 2*assumptionNodesMargin)/(2*nNodes - 1); // offset at top and bottom   
 
    // line from multi-variate test   
    canvas.append("line")
                .attr("x1", assumptionNodesLeftOffset + assumptionsNodeSize/2)
                .attr("y1", assumptionNodesMargin + 4*assumptionsNodeSize + assumptionsNodeSize)
                .attr("x2", assumptionNodesLeftOffset + assumptionsNodeSize/2)
                .attr("y2", assumptionNodesMargin + 4*assumptionsNodeSize + 2*assumptionsNodeSize)
                .attr("stroke", "black")
                .attr("stroke-width", "2px")
                .attr("id", "postHocTestLine");   

    // node for post-hoc test 
    canvas.append("rect")
                                        .attr("x", assumptionNodesLeftOffset)
                                        .attr("y", 6*assumptionsNodeSize + assumptionNodesMargin)
                                        .attr("width", assumptionsNodeSize)
                                        .attr("height", assumptionsNodeSize)                    
                                        .attr("fill", "white")
                                        .attr("stroke", "black")
                                        .attr("id", "postHocTest")
                                        .attr("class", "assumptionNodes");  

    // text for post-hoc test
    canvas.append("text")
                                        .attr("x", assumptionNodesLeftOffset + assumptionsNodeSize*Math.sqrt(2) + assumptionNodesMargin)  
                                        .attr("y", assumptionNodesMargin + 6*assumptionsNodeSize + (assumptionsNodeSize*Math.sqrt(2))/2)
                                        .attr("font-size", fontSizeAssumptions )
                                        .attr("fill", "black")
                                        .text("Choosing the test based on assumptions...")
                                        .attr("id", "postHocTestName")
                                        .attr("class", "assumptionNodes");         
}

function drawNormalityPlot(dependentVariable, level, type)
{
    //make histogram with these variables in a separate svg
    removeElementsByClassName("homogeneityPlot")
    
    var mean;

    if(level == "dataset")
        mean = d3.select("#" + dependentVariable + ".means");
    else
        mean = d3.select("#" + getValidId(level) + ".means");
        
    var centerX = mean.attr("cx"); // Get the centre of the corresponding mean     
    
    normalityPlotWidth = widthOfEachBox*1.5;
    normalityPlotHeight = 0.75*normalityPlotWidth;

    plotHistogramWithDensityCurve(centerX - normalityPlotWidth/2, plotPanelHeight + normalityPlotOffset, normalityPlotWidth, normalityPlotHeight, dependentVariable, level, type);//left, top, histWidth, histHeight, dependentVariable, level;

    // Table entries

    var plotCanvas = d3.select("#plotCanvas");
    var variableList = getSelectedVariables();

    var pValues = sessionStorage.getObject("ShapiroWilkTestPValues");
    var indexOfLevel = variableList["independent-levels"].indexOf(level);

    plotCanvas.append("text")
                .attr("x", centerX)
                .attr("y", plotPanelHeight + 2*normalityPlotOffset + normalityPlotHeight - axesOffset)
                .text(fP(pValues[indexOfLevel], false, false))
                .attr("text-anchor", "middle")
                .attr("font-size", scaleForWindowSize(16))
                .attr("class", "densityCurve");

    if(indexOfLevel == 0)
    {
        plotCanvas.append("text")
                    .attr("x", plotPanelWidth/2)
                    .attr("y", plotPanelHeight + 2*normalityPlotOffset + normalityPlotHeight)
                    .text("p-values are from Shapiro-Wilk test. (Higher than .05 suggests normal distribution.)")
                    .attr("text-anchor", "middle")
                    .attr("font-size", scaleForWindowSize(16))
                    .attr("class", "densityCurve");
    }
}

function drawQQPlots(dependentVariable, level)
{
    //make histogram with these variables in a separate svg
    removeElementsByClassName("homogeneityPlot");
    removeElementsByClassName("densityCurve");

    for(var i=0; i<level.length; i++)
    {
        var mean = d3.select("#" + getValidId(level[i]) + ".means");        
        var centerX = mean.attr("cx"); // Get the centre of the corresponding mean     
        
        normalityPlotWidth = widthOfEachBox*1.5;
        normalityPlotHeight = 0.75*normalityPlotWidth;        

        var plotPanel = d3.select("#plotPanel");
        plotPanel.append("div")
                    .attr("style", "position: absolute; left: " + (centerX - normalityPlotWidth/2) + "px; top: " + (plotHeight + normalityPlotOffset/2) + "px; width: " + normalityPlotWidth + "px; height: " + normalityPlotHeight + "px;")
                    .attr("id", level[i] + "_canvas")
                    .attr("class", "qqPlots");

        drawQQPlot(variables[dependentVariable][level[i]], "#" + level[i] + "_canvas");    
    }
}

function drawAdvancedPlotButton()
{   
    return;

    var canvas = d3.select("#plotCanvas");
    var zoomedOutPlotPanelWidth = plotPanelWidth;
    var zoomedOutPlotPanelHeight = scaledPlotPanelHeight;

    canvas.append("rect")
            .attr("x", zoomedOutPlotPanelWidth - advancedPlotButtonWidth - advancedPlotButtonOffset)
            .attr("y", zoomedOutPlotPanelHeight - advancedPlotButtonHeight - advancedPlotButtonOffset)
            .attr("width", advancedPlotButtonWidth)
            .attr("height", advancedPlotButtonHeight)
            .attr("rx", scaleForWindowSize(15) )
            .attr("ry", scaleForWindowSize(15) )
            .attr("fill", "url(#buttonFillNormal)")
            .attr("filter", "url(#Bevel)")
            .attr("stroke", "black")
            .attr("id", "advancedPlotButtonBack")
            .attr("class", "advancedPlotButton");

    canvas.append("text")
            .attr("x", zoomedOutPlotPanelWidth - advancedPlotButtonOffset - advancedPlotButtonWidth/2)
            .attr("y", zoomedOutPlotPanelHeight - advancedPlotButtonOffset - advancedPlotButtonHeight/2 + yAxisTickTextOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizes["button label"])
            .text("Advanced Visualisation")
            .attr("id", "advancedPlotButtonText")
            .attr("class", "advancedPlotButton");

    canvas.append("rect")
            .attr("x", zoomedOutPlotPanelWidth - advancedPlotButtonWidth - advancedPlotButtonOffset)
            .attr("y", zoomedOutPlotPanelHeight - advancedPlotButtonHeight - advancedPlotButtonOffset)
            .attr("width", advancedPlotButtonWidth)
            .attr("height", advancedPlotButtonHeight)
            .attr("rx", scaleForWindowSize(15) )
            .attr("ry", scaleForWindowSize(15) )
            .attr("fill", "url(#buttonFillNormal)")
            .attr("filter", "url(#Bevel)")
            .attr("stroke", "black")
            .attr("opacity", "0.01")
            .attr("id", "advancedPlotButtonFront")
            .attr("class", "advancedPlotButton");
}


// - - - - - - - - - - - - - Significance test results - - - - - - - - - - - - - 

function drawScalesInBoxplot(cx, cy)
{
    var yMin = Array.min(cy);
    var yMax = Array.max(cy);

    var leftOffset = 40;
    
    var canvas = d3.select("#plotCanvas");    
    var LEFT = plotPanelWidth/2 + plotWidth/2 + leftOffset;
    
    var variableList = getSelectedVariables();
    var means = [];
    
    var levels = variableList["independent-levels"]; 

    for(var i=0; i<cy.length; i++)
    {
        means.push(getActualValue(cy[i]));
    }
    
    means = means.sort(function(a,b){return a-b});
    cy = cy.sort(function(a,b){return b-a});
    
    var cyMax = Math.max.apply(Math, cy);
    var cyMin = Math.min.apply(Math, cy);		   	 
    
    canvas.append("text")
                .attr("x", LEFT + 10)
                .attr("y", (yMin + yMax)/2 + parseFloat(fontSizes["boxplot.main difference"])/2)
                .attr("fill", "black")
                .attr("font-size", fontSizes["boxplot.main difference"])
                .attr("id", "differenceInMeansMain")                
                .text(dec2(means[means.length-1] - means[0]));

    addToolTip("differenceInMeansMain", null, "Overall difference between the selected means");
    
    var error = parseFloat(multiVariateTestResults["error"]);     
    multiVariateTestResults["CI"] = calculateCI(means[means.length -1] - means[0], error);

    var meanValue = getActualValue(cyMin);
    var dependentVariable = variables[variableList["dependent"][0]]["dataset"];
    var dependentVariableMin = Array.min(dependentVariable);
    var dependentVariableMax = Array.max(dependentVariable);


    var lowerCI = meanValue - error;
    var upperCI = meanValue + error;

    if(lowerCI < dependentVariableMin)
        lowerCI = dependentVariableMin;

    if(upperCI > dependentVariableMax)
        upperCI = dependentVariableMax;
    
    var BOTTOM = plotPanelHeight/2 + plotHeight/2;
    
    // CI for mean

    canvas.append("line")
            .attr("x1", plotPanelWidth/2 + plotWidth/2 + leftOffset/3)
            .attr("y1", BOTTOM - getFraction(lowerCI)*plotHeight)
            .attr("x2", plotPanelWidth/2 + plotWidth/2 + leftOffset/3)
            .attr("y2", BOTTOM - getFraction(upperCI)*plotHeight)
            .attr("stroke", fillColor["CI"])
            .attr("stroke-width", strokeWidth["CI"])
            .attr("id", "center")
            .attr("class", "CIMean");
        
    canvas.append("line")
            .attr("x1", plotPanelWidth/2 + plotWidth/2 + leftOffset/3 - CIFringeLength/2)
            .attr("y1", BOTTOM - getFraction(lowerCI)*plotHeight)
            .attr("x2", plotPanelWidth/2 + plotWidth/2 + leftOffset/3 + CIFringeLength/2)
            .attr("y2", BOTTOM - getFraction(lowerCI)*plotHeight)
            .attr("stroke", fillColor["CI"])
            .attr("stroke-width", strokeWidth["CI"])
            .attr("id", "bottom")
            .attr("class", "CIMean");
        
    canvas.append("line")
            .attr("x1", plotPanelWidth/2 + plotWidth/2 + leftOffset/3 - CIFringeLength/2)
            .attr("y1", BOTTOM - getFraction(upperCI)*plotHeight)
            .attr("x2", plotPanelWidth/2 + plotWidth/2 + leftOffset/3 + CIFringeLength/2)
            .attr("y2", BOTTOM - getFraction(upperCI)*plotHeight)
            .attr("stroke", fillColor["CI"])
            .attr("stroke-width", strokeWidth["CI"])
            .attr("id", "top")
            .attr("class", "CIMean");

    // addToolTip(id, className, displayText, displaySubText, targetID, targetClassName, jointDirection, toolTipType) 
    addToolTip("center", "CIMean", dec2(upperCI - means[0]), "Upper 95% confidence interval of difference between means", "top", "CIMean", "bottom");
    addToolTip("center", "CIMean", dec2(lowerCI - means[0]), "Lower 95% confidence interval of difference between means", "bottom", "CIMean", "top");
    
    if(cy.length >= 2)
    {
        for(var i=0; i<cy.length-1; i++)
        {  
            if(cy.length > 2)
            {
                canvas.append("text")
                    .attr("x", plotPanelWidth/2 + plotWidth/2 + 2*leftOffset/3 + 10)
                    .attr("y", (parseFloat(cy[i]) + parseFloat(cy[i+1]))/2 + yAxisTickTextOffset)
                    .attr("fill", "black")
                    .attr("font-size", fontSizes["tick"])
                    .attr("id", "DIM" + i)
                    .attr("class", "differenceInMeansText")
                    .attr("display", "none")
                    .text(dec2(means[i+1] - means[i]));
            }
                
            canvas.append("line")
                .attr("x1", plotPanelWidth/2 + plotWidth/2 + 2*leftOffset/3 - CIFringeLength/2)
                .attr("y1", cy[i])
                .attr("x2", plotPanelWidth/2 + plotWidth/2 + 2*leftOffset/3)
                .attr("y2", cy[i])
                .attr("stroke", "black")
                .attr("stroke-width", scaleForWindowSize(3) )
                .attr("id", "DIM" + i)
                .attr("class", "differenceInMeans");       
            
            canvas.append("line")
                .attr("x1", plotPanelWidth/2 + plotWidth/2 + 2*leftOffset/3 - CIFringeLength/2)
                .attr("y1", cy[i+1])
                .attr("x2", plotPanelWidth/2 + plotWidth/2 + 2*leftOffset/3)
                .attr("y2", cy[i+1])
                .attr("stroke", "black")
                .attr("stroke-width", scaleForWindowSize(3) )
                .attr("id", "DIM" + i)
                .attr("class", "differenceInMeans"); 
            
            canvas.append("line")
                .attr("x1", plotPanelWidth/2 + plotWidth/2 + 2*leftOffset/3)
                .attr("y1", cy[i])
                .attr("x2", plotPanelWidth/2 + plotWidth/2 + 2*leftOffset/3)
                .attr("y2", cy[i+1])
                .attr("stroke", "black")
                .attr("stroke-width", scaleForWindowSize(5) )
                .attr("id", "DIM" + i)
                .attr("class", "differenceInMeans");       
        }           
    }
}
  
function displaySignificanceTestResults()
{        
    // ToDo draw lines through medians if non-parametric test was done

    var cx = [];
    var cy = [];
    
    removeElementsByClassName("significanceTest"); // Remove significance test results, if any

    if(document.getElementById("computingResultsImage") != null)    removeElementById("computingResultsImage");
    
    var means = document.getElementsByClassName("means");
    var meanRefLines = [];
    
    var canvas = d3.select("#plotCanvas");

    for(var i=0; i<means.length; i++)
    {
        if((means[i].getAttribute("fill") == meanColors["click"]) || (means[i].getAttribute("fill") == "#008000"))
        {
            cx.push(means[i].getAttribute("cx"));
            cy.push(means[i].getAttribute("cy"));
        
            meanRefLines[i] = canvas.append("line")
                                 .attr("x1", means[i].getAttribute("cx"))
                                 .attr("y1", means[i].getAttribute("cy"))
                                 .attr("x2", plotPanelWidth/2 + plotWidth/2)
                                 .attr("y2", means[i].getAttribute("cy"))
                                 .attr("stroke", "#111111")
                                 .attr("stroke-dasharray","5,5")
                                 .attr("id", "meanrefLine")
                                 .attr("class", "differenceInMeans");
                                 
                            canvas.append("line")
                                 .attr("x1", means[i].getAttribute("cx"))
                                 .attr("y1", means[i].getAttribute("cy"))
                                 .attr("x2", plotPanelWidth/2 - plotWidth/2 - axesOffset)
                                 .attr("y2", means[i].getAttribute("cy"))
                                 .attr("stroke", "#111111")
                                 .attr("opacity", "0.355")
                                 .attr("stroke-dasharray","5,5")
                                 .attr("id", "meanrefLine")
                                 .attr("class", "differenceInMeans");
        }
        else
        {									
            cx.splice(i, 1);
            cy.splice(i, 1);								
        }	
    }

    var cyMax = Math.max.apply(Math, cy);
    var cyMin = Math.min.apply(Math, cy);		   	 

    var differenceLine = canvas.append("line")
                            .attr("x1", plotPanelWidth/2 + plotWidth/2)
                            .attr("y1", cyMin)
                            .attr("x2", plotPanelWidth/2 + plotWidth/2)
                            .attr("y2", cyMax)
                            .attr("stroke", "black")
                            .attr("stroke-width", "2px")
                            .attr("id", "line")
                            .attr("class", "differenceInMeans");


    var x = plotPanelWidth/2 + plotWidth/2;
    var y = cyMin;	

    var head = canvas.append("path")
                  .attr("d", "M " + x + " " + y + " L " + (x-5)+ " " + (y+5) + " L " + (x+5) + " " + (y+5) + " z")
                  .attr("stroke", "black")
                  .attr("fill", "black")
                  .attr("id", "path")
                  .attr("class", "differenceInMeans");
    
    drawScalesInBoxplot(cx, cy);    

    var resultsCanvas = d3.select("#resultsCanvas");
    
    resultsCanvas.append("text")
            .attr("x", resultsPanelWidth/2)
            .attr("y", 1.5*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizes["test result"] )
            .attr("fill", "#627bf4")
            .text("Statistical test: " + multiVariateTestResults["method"])
            .attr("class", "significanceTest");
    
    drawParameter(multiVariateTestResults["df"], parseFloat(multiVariateTestResults["parameter"]));
    
    resultsCanvas.append("text")
            .attr("x", 3*resultsPanelWidth/4)
            .attr("y", 3*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizes["test result"] )
            .attr("fill", "#627bf4")
            .html("<tspan font-style='italic'>p</tspan>" + multiVariateTestResults["p"].substring(1))
            .attr("class", "significanceTest");
    
    
    // // Effect sizes
    
    drawEffectSize(parseFloat(multiVariateTestResults["effect-size"]));

    // Display report text/note

    if(multiVariateTestResults["method"] == "One-way RM ANOVA")
    {
        if(multiVariateTestResults["pIsCorrected"] == "true")
        {
            resultsCanvas.append("text")
                                    .attr("x", resultsPanelWidth/2)
                                    .attr("y", resultsPanelWidth - significanceTestResultStep/2)
                                    .attr("text-anchor", "middle")
                                    .attr("font-size", fontSizes["test result"])
                                    .text("p-value is adjusted to correct for violation of Sphericity assumption")
                                    .attr("class", "significanceTest");
        }
        
    }

    var partialReportText = multiVariateTestResults["rawP"] < 0.05 ? " shows that there is a significant effect" : " shows that there is no significant effect"; 
    resultsCanvas.append("text")
                            .attr("x", resultsPanelWidth/2)
                            .attr("y", resultsPanelHeight - significanceTestResultStep)
                            .attr("text-anchor", "middle")
                            .attr("font-size", fontSizes["result one-liner"])
                            .text(multiVariateTestResults["method"] + partialReportText)
                            .attr("class", "significanceTest");
        

    // Save reporting text for ANOVAs so that it can be displayed again for post-hoc tests
    var testType = multiVariateTestResults["test-type"];
    if (testType == "oneWayANOVA" || testType == "KruskalWallisTest" || testType == "WelchANOVA" || testType == "oneWayRepeatedMeasuresANOVA" || testType == "FriedmanTest")
            resultsFromANOVA = getReportingText(testType);
}

// Correlation & Regression

function displayCorrelationResults()
{     
    var resultsCanvas = d3.select("#resultsCanvas");
    
    if(document.getElementById("computingResultsImage") != null)
        removeElementById("computingResultsImage");
    
    resultsCanvas.append("text")
            .attr("x", resultsPanelWidth/2)
            .attr("y", 1.5*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizes["test result"] )
            .attr("fill", "#627bf4")
            .text("Statistical test: " + multiVariateTestResults["method"])
            .attr("class", "significanceTest");
    
    resultsCanvas.append("text")
            .attr("x", resultsPanelWidth/4)
            .attr("y", 3*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizes["test result"] )
            .attr("fill", "#627bf4")
            .text(multiVariateTestResults["statistic"])
            .attr("class", "significanceTest");
    
    resultsCanvas.append("text")
            .attr("x", 3*resultsPanelWidth/4)
            .attr("y", 3*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizes["test result"] )
            .attr("fill", "#627bf4")
            .text(multiVariateTestResults["p"])
            .attr("class", "significanceTest");    
    
    //Effect sizes
    drawEffectSize(parseFloat(multiVariateTestResults["effect-size"])); 
}

function displayBiserialCorrelationResults()
{       
    var resultsCanvas = d3.select("#resultsCanvas");
    
    if(document.getElementById("computingResultsImage") != null)
        removeElementById("computingResultsImage");
    
    resultsCanvas.append("text")
            .attr("x", resultsPanelWidth/2)
            .attr("y", 1.5*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizes["test result"] )
            .attr("fill", "#627bf4")
            .text("Statistical test: " + multiVariateTestResults["method"])
            .attr("class", "significanceTest");
    
    //Effect sizes
    drawEffectSize(parseFloat(multiVariateTestResults["effect-size"])); 
}

function displaySimpleRegressionResults()
{       
    var sideBar = d3.select("#sideBarCanvas");    
    
    if(document.getElementById("computingResultsImage") != null)
        removeElementById("computingResultsImage");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", significanceTestResultOffsetTop + significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizes["test result"] )
            .attr("fill", "#627bf4")
            .text(multiVariateTestResults["method"])
            .attr("class", "significanceTest");
    //Effect sizes
    drawEffectSize(parseFloat(multiVariateTestResults["effect-size"]));
 
    var plot = d3.select("#plotCanvas");
    
    plot.append("text")
            .attr("x", plotPanelWidth/2)
            .attr("y", plotPanelHeight + 2*axesOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", scaleForWindowSize(24) )
            .attr("fill", "#627bf4")
            .text(multiVariateTestResults["equation"])
            .attr("id", "equation")
            .attr("class", "significanceTest");
    
    //make div tag at the bottom of the page
    var DIVTag = d3.select("body").append("div").attr("class", "regressionPredictionDiv");
        
    DIVTag.attr("style", "position: absolute; left: " + (width - plotPanelWidth - sideBarWidth) + "px; top: " + (plotPanelHeight - bottomDivHeight) + "px; height: " + (bottomDivHeight) + "px; width: " + plotPanelWidth );    
    var table = DIVTag.append("table").attr("border", "1").attr("id", "regressionPredictionTable").attr("align", "center");
    
    //predictor variable
    var tr = table.append("tr");
    
    tr.append("td").append("label")
                .text(selectedVariables[0] + ":");
    tr.append("td").append("input")
                .attr("type", "text")
                .attr("placeholder", "<Enter value here>") 
                .attr("onchange", "calculateOutcome()")
                .attr("id", "value_" + selectedVariables[0]);
    
    //outcome variable
    tr = table.append("tr");
    
    tr.append("td").append("label")
                .text(selectedVariables[1] + ":");
    tr.append("td").append("label")
                .attr("id", "value_outcome");
}

function displayMultipleRegressionResults()
{       
    var sideBar = d3.select("#sideBarCanvas");    
    
    if(document.getElementById("computingResultsImage") != null)
        removeElementById("computingResultsImage");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", significanceTestResultOffsetTop + significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizes["test result"] )
            .attr("fill", "#627bf4")
            .text(multiVariateTestResults["method"])
            .attr("class", "significanceTest");
    //Effect sizes
    drawEffectSize(parseFloat(multiVariateTestResults["effect-size"]));
 
    var plot = d3.select("#plotCanvas");
    
    plot.append("text")
            .attr("x", plotPanelWidth/2)
            .attr("y", 3*plotHeight/4)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizes["test result"] )
            .attr("fill", "#627bf4")
            .text(multiVariateTestResults["equation"])
            .attr("id", "equation")
            .attr("class", "significanceTest"); 
    
    //make div tag at the bottom of the page
    var DIVTag = d3.select("body").append("div").attr("class", "regressionPredictionDiv");
        
    DIVTag.attr("style", "position: absolute; left: " + (width - plotPanelWidth - sideBarWidth) + "px; top: " + (plotPanelHeight - bottomDivHeight) + "px; height: " + (bottomDivHeight) + "px; width: " + plotPanelWidth );    
    var table = DIVTag.append("table").attr("border", "1").attr("id", "regressionPredictionTable").attr("align", "center");
    
    var outcomeVariable = multiVariateTestResults["outcomeVariable"];
    var explanatoryVariables = multiVariateTestResults["explanatoryVariables"];
    
    for(var i=0; i<explanatoryVariables.length; i++)
    {
        //predictor variable
        var tr = table.append("tr");
    
        tr.append("td").append("label")
                    .text(explanatoryVariables[i] + ":");
        tr.append("td").append("input")
                    .attr("type", "text")
                    .attr("placeholder", "<Enter value here>") 
                    .attr("onchange", "calculateOutcome()")
                    .attr("id", "value_" + explanatoryVariables[i]);
    }
    
    //outcome variable
    tr = table.append("tr");
    
    tr.append("td").append("label")
                .text(outcomeVariable + ":");
    tr.append("td").append("label")
                .attr("id", "value_outcome");
}

// Elements of significance test

function drawEffectSize(value, type, resultsCanvas)
{
    if(typeof(type) ==='undefined') type = multiVariateTestResults["effect-size-type"];
    if(typeof(resultsCanvas) === 'undefined') resultsCanvas = d3.select("#resultsCanvas");    

    value = parseFloat(value);
    
    if(type == "d")
        value = value > 5.0 ? 5.0 : value;
    
    var min = parseFloat(effectSizeMins[type]);
    var max = parseFloat(effectSizeMaxs[type]);
    
    var color = getColor(type, value);
    
    var L = parseFloat(resultsPanelWidth)/2 - parseFloat(effectSizeWidth)/2;
    var T = parseFloat(significanceTestResultStep)*5 - parseFloat(effectSizeHeight)/2;

    var bar = resultsCanvas.append("rect")
                        .attr("x", L)
                        .attr("y", T)
                        .attr("width", effectSizeWidth)
                        .attr("height", effectSizeHeight)
                        .attr("stroke", "MediumSlateBlue")
                        .attr("fill", "none")
                        .attr("class", "effectSize");
            
    var scale = d3.scale.linear()
                            .domain([min, max])
                            .range([0, effectSizeWidth]);

    if(scale(min + value) > 0)
    {
        var effectSize = resultsCanvas.append("rect")
                                    .attr("x", L + scale(0))
                                    .attr("y", T)
                                    .attr("width", scale(min + (value - 0)))
                                    .attr("height", effectSizeHeight)
                                    .attr("fill", color)
                                    .attr("id", "test")
                                    .attr("class", "effectSize");
    }
    else
    {
        var effectSize = resultsCanvas.append("rect")
                                    .attr("x", L + scale(0) + scale(min + (value - 0)))
                                    .attr("y", T)
                                    .attr("width", -scale(min + (value - 0)))
                                    .attr("height", effectSizeHeight)
                                    .attr("fill", color)
                                    .attr("id", "test2")
                                    .attr("class", "effectSize");
    }

    if(Math.abs(scale(min + value)) > effectSizeWidth/4)
    {   
        if(value < 0)
        {
            resultsCanvas.append("text")
                .attr("x", L + scale(0) + scale(min + (value - 0)) + yAxisTickTextOffset)
                .attr("y", T + effectSizeHeight/2 + yAxisTickTextOffset)
                .attr("text-anchor", "start")
                .attr("font-size", fontSizes["effectSize"])
                .attr("fill", "white")
                .text(value)
                .attr("id", "effectSizeValue")
                .attr("class", "effectSize");    
        }
        else
        {
            resultsCanvas.append("text")
                .attr("x", L + scale(0) + scale(min + (value - 0)) - yAxisTickTextOffset)
                .attr("y", T + effectSizeHeight/2 + yAxisTickTextOffset)
                .attr("text-anchor", "end")
                .attr("font-size", fontSizes["effectSize"])
                .attr("fill", "white")
                .text(value)
                .attr("id", "effectSizeValue")
                .attr("class", "effectSize");
        }
    }
    else
    {
        if(value < 0)
        {
            resultsCanvas.append("text")
                .attr("x", L + scale(0) + scale(min + (value - 0)) - yAxisTickTextOffset)
                .attr("y", T + effectSizeHeight/2 + yAxisTickTextOffset)
                .attr("text-anchor", "end")
                .attr("font-size", fontSizes["effectSize"])
                .attr("fill", "black")
                .text(value)
                .attr("id", "effectSizeValue")
                .attr("class", "effectSize");    
        }
        else
        {
            resultsCanvas.append("text")
                .attr("x", L + scale(0) + scale(min + (value - 0)) + yAxisTickTextOffset)
                .attr("y", T + effectSizeHeight/2 + yAxisTickTextOffset)
                .attr("text-anchor", "start")
                .attr("font-size", fontSizes["effectSize"])
                .attr("fill", "black")
                .text(value)
                .attr("id", "effectSizeValue")
                .attr("class", "effectSize");    
        }
        
    }
    
    resultsCanvas.append("text")
            .attr("x", L + scale(min))
            .attr("y", T + 3*effectSizeHeight/2)
            .attr("text-anchor", "start")
            .attr("font-size", fontSizes["effectSize"])
            .attr("fill", "darkgrey")
            .attr("id", "labelMin")
            .attr("class", "effectSize")
            .text(min);
    
    resultsCanvas.append("text")
            .attr("x", L + scale(max))
            .attr("y", T + 3*effectSizeHeight/2)
            .attr("text-anchor", "end")
            .attr("font-size", fontSizes["effectSize"])
            .attr("fill", "darkgrey")
            .attr("id", "labelMax")
            .attr("class", "effectSize")
            .text(max);
    
    var effectSizeInterpretationIndicators = ["small", "medium", "large"];
    var effectSizeMagnitude = value >= effectSizeInterpretations[type][0] ? "small" : ((value >= effectSizeInterpretations[type][1]) ? "medium" : ((value >= effectSizeInterpretations[type][2]) ? "large" : undefined));        
        
    for(i=0; i<effectSizeInterpretations[type].length; i++)
    {
        var fontWeight = "light";

        if(effectSizeInterpretationIndicators[i] == effectSizeMagnitude)
        {
            fontWeight = "900";
        }

        resultsCanvas.append("line")
                .attr("x1", L + scale(effectSizeInterpretations[type][i]))
                .attr("y1", T)
                .attr("x2", L + scale(effectSizeInterpretations[type][i]))
                .attr("y2", T + effectSizeHeight)
                .attr("stroke", "black")
                .attr("display", "none")
                .attr("class", "effectSizeInterpretationIndicators");

        resultsCanvas.append("text")
                .attr("x", L + scale(effectSizeInterpretations[type][i]))
                .attr("y", T - yAxisTickTextOffset)
                .attr("transform", "rotate (-45 " + (L + scale(effectSizeInterpretations[type][i])) + " " + (T - yAxisTickTextOffset) + ")")
                .attr("text-anchor", "start")
                .attr("font-size", fontSizes["effectSizeInterpretationIndicators"])
                .text(effectSizeInterpretationIndicators[i])
                .attr("fill", getColor(type, effectSizeInterpretations[type][i]))
                .style("font-weight", fontWeight)
                .attr("display", "none")
                .attr("id", effectSizeInterpretationIndicators[i])
                .attr("class", "effectSizeInterpretationIndicators");
    }
    
    
    if(min < 0)
    {
        for(i=0; i<effectSizeInterpretations[type].length; i++)
        {
            resultsCanvas.append("line")
                    .attr("x1", L + scale(-effectSizeInterpretations[type][i]))
                    .attr("y1", T)
                    .attr("x2", L + scale(-effectSizeInterpretations[type][i]))
                    .attr("y2", T + effectSizeHeight)
                    .attr("stroke", "black")
                    .attr("display", "none")
                    .attr("class", "effectSizeInterpretationIndicators");
            resultsCanvas.append("text")
                    .attr("x", L + scale(-effectSizeInterpretations[type][i]))
                    .attr("y", T - yAxisTickTextOffset)
                    .attr("transform", "rotate (-45 " + (L + scale(-effectSizeInterpretations[type][i])) + " " + (T - yAxisTickTextOffset) + ")")
                    .attr("text-anchor", "start")
                    .attr("font-size", scaleForWindowSize(14) )
                    .text(effectSizeInterpretationIndicators[i])
                    .attr("fill", getColor(type, effectSizeInterpretations[type][i]))
                    .attr("display", "none")
                    .attr("class", "effectSizeInterpretationIndicators");
        }
    
        resultsCanvas.append("text")
            .attr("x", L + scale(0))
            .attr("y", T + 3*effectSizeHeight/2)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizes["effectSize"])
            .attr("fill", "darkgrey")
            .attr("id", "labelMid")
            .attr("class", "effectSize")
            .text(0);
    }
    
    if(type == "ηS")
    {    
        var mainText = resultsCanvas.append("text")
            .attr("x", resultsPanelWidth/2)
            .attr("y", T - 2*yAxisTickTextOffset)// + effectSizeHeight/2 + yAxisTickTextOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizes["effectSize"])
            .attr("fill", "black")
            .attr("id", "effectSizeText")
            .attr("class", "effectSize");
            
        mainText.append("tspan")
                    .attr('font-style', 'italic')
                    .text("Effect size: η");
        mainText.append("tspan")
                    .attr("baseline-shift", "super")
                    .attr("font-size", "0.6em")
                    .text("2");
    }
    else if(type == "rS")
    {    
        var mainText = resultsCanvas.append("text")
            .attr("x", resultsPanelWidth/2)
            .attr("y", T - 2*yAxisTickTextOffset)// + effectSizeHeight/2 + yAxisTickTextOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizes["effectSize"])
            .attr("id", "effectSizeText")
            .attr("fill", "black")
            .attr("class", "effectSize");
            
        mainText.append("tspan")
                    .text("Effect size: r");
        mainText.append("tspan")
                    .attr("baseline-shift", "super")
                    .attr("font-size", "0.6em")
                    .text("2");
    }
    else
    {
        resultsCanvas.append("text")
            .attr("x", resultsPanelWidth/2)
            .attr("y", T - 2*yAxisTickTextOffset)// + effectSizeHeight/2 + yAxisTickTextOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizes["effectSize"])
            .attr("id", "effectSizeText")
            .attr("fill", "black")
            .attr("class", "effectSize")
            .text("Effect size: ")
            .append('tspan')
            .attr('font-style', 'italic')
            .text(type);
    } 
    
    resultsCanvas.append("rect")
            .attr("x", L)
            .attr("y", T)
            .attr("width", effectSizeWidth)
            .attr("height", effectSizeHeight)
            .attr("stroke", "black")
            .attr("opacity", "0.001")
            .attr("id", "effectSizeFront");        
}

function drawParameter(DF, parameter, type, resultsCanvas)
{
    if(typeof(type) === 'undefined') type = multiVariateTestResults["parameter-type"];
    if(typeof(resultsCanvas) === 'undefined') resultsCanvas = d3.select("#resultsCanvas");
    
    var X = resultsPanelWidth/4;
    var Y = 3*significanceTestResultStep;
    
    if(type == "cS")
    {
        var mainText = resultsCanvas.append("text")
                .attr("x", X)
                .attr("y", Y)
                .attr("font-size", fontSizes["test result"] )
                .attr("text-anchor", "middle")
                .attr("fill", "#627bf4")
                .attr("class", "parameter");
            
        mainText.append("tspan")
                    .text("𝝌");
        
        mainText.append("tspan")
                    .attr("baseline-shift", "super")
                    .text("2");
        
        mainText.append("tspan")
                    .text("(" + DF + ") = " + parameter);
    }
    else
    {
        if(hasDF[type] && !pairwiseComparisons)
        {
            resultsCanvas.append("text")
                    .attr("x", X)
                    .attr("y", Y)
                    .attr("font-size", fontSizes["test result"] )
                    .attr("text-anchor", "middle")
                    .attr("fill", "#627bf4")
                    .attr("class", "parameter")
                    .html("<tspan font-style='italic'>" + type + "</tspan>(" + DF + ") = " + Number(parameter).toFixed(2));
        }
        else
        {
            resultsCanvas.append("text")
                .attr("x", X)
                .attr("y", Y)
                .attr("text-anchor", "middle")
                .attr("font-size", fontSizes["test result"] )
                .attr("fill", "#627bf4")
                .attr("class", "parameter")
                .html("<tspan font-style='italic'>" + type + "</tspan> = " + parameter);
        }
    }
}    

// - - - - - - - - - - - - - Misc. - - - - - - - - - - - - - -

function displayToolTips()
{
    var variablePanelCanvas = d3.select("#variablePanelSVG");

    var fontSizeToolTips = scaleForWindowSize(16) ;

    var variablePanel = d3.select("#variable.panel");                
    var variablePanelWidth = removeAlphabetsFromString(variablePanel.style("width"));
    var variableNameHolderWidth = variablePanelWidth - 2*variableNameHolderPadding;  

    var radiusForRoundedRect = scaleForWindowSize(10) ;                                      

    var variablePanelBorder = variablePanelCanvas.append("rect")
                                    .attr("x", variableNameHolderPadding/2)
                                    .attr("y", variableNameHolderPadding/2)
                                    .attr("width", variableNameHolderWidth - variableTypeSelectionButtonWidth + variableNameHolderPadding)
                                    .attr("height", variableNames.length * (variableNameHolderHeight + variableNameHolderPadding))
                                    .attr("rx", radiusForRoundedRect)
                                    .attr("ry", radiusForRoundedRect)
                                    .attr("fill","none")
                                    .attr("stroke", "#3957F1")
                                    .attr("stroke-dasharray","3,3")
                                    .attr("class","toolTips");

    variablePanelCanvas.append("rect")
                        .attr("x", variableNameHolderPadding/2)
                        .attr("y", variableNames.length * (variableNameHolderHeight + variableNameHolderPadding) + 3*variableNameHolderPadding)
                        .attr("height", variableNameHolderHeight*1.25)
                        .attr("width", variableNameHolderWidth - variableNameHolderPadding)
                        .attr("rx", radiusForRoundedRect)
                        .attr("ry", radiusForRoundedRect)
                        .attr("fill", "#3957F1")
                        .attr("filter", "url(#Bevel)")
                        .attr("stroke", "none")
                        .attr("class", "toolTips");

    d3.select("body").append("label")
                        .text("List of variables in the dataset. Click on a variable to select/unselect them. ")
                        .attr("id", "variablePanel")
                        .attr("class", "toolTips")
                        .attr("style", "position: absolute; left: " + variableNameHolderPadding + "px; top: " + (variableNames.length * (variableNameHolderHeight + variableNameHolderPadding) + 4*variableNameHolderPadding) + "px; width: " + (variableNameHolderWidth - 3*variableNameHolderPadding/2) + "px; color: white; text-align: center; font-size: " + fontSizeToolTips + ";");

    variablePanelCanvas.append("line")
                        .attr("x1", variableNameHolderWidth/2)
                        .attr("y1", variableNames.length * (variableNameHolderHeight + variableNameHolderPadding) + variableNameHolderPadding/2)
                        .attr("x2", variableNameHolderWidth/2)
                        .attr("y2", variableNames.length * (variableNameHolderHeight + variableNameHolderPadding) + 3*variableNameHolderPadding)
                        .attr("stroke", "#3957F1")
                        .attr("stroke-dasharray", "3,3")
                        .attr("class", "toolTips");


    var variableTypeSelectionBorder = variablePanelCanvas.append("rect")
                                            .attr("x", variableNameHolderWidth - variableTypeSelectionButtonWidth + 2*variableNameHolderPadding - variableNameHolderPadding/3)
                                            .attr("y", variableNameHolderPadding/2)
                                            .attr("height", variableNames.length * (variableNameHolderHeight + variableNameHolderPadding))
                                            .attr("width", variableTypeSelectionButtonWidth/1.5 + variableNameHolderPadding)
                                            .attr("rx", radiusForRoundedRect)
                                            .attr("ry", radiusForRoundedRect)
                                            .attr("fill","none")
                                            .attr("stroke", "#3957F1")
                                            .attr("stroke-dasharray","3,3")
                                            .attr("class","toolTips");
    var plotCanvas = d3.select("#plotCanvas");

    plotCanvas.append("rect")
                        .attr("x", 3*variableNameHolderPadding)
                        .attr("y", variableNames.length * (variableNameHolderHeight + variableNameHolderPadding)/2 - variableNameHolderHeight*1.75/2)
                        .attr("height", variableNameHolderHeight*1.75)
                        .attr("width", variableNameHolderWidth + variableNameHolderPadding)
                        .attr("rx", radiusForRoundedRect)
                        .attr("ry", radiusForRoundedRect)
                        .attr("fill", "#3957F1")
                        .attr("filter", "url(#Bevel)")
                        .attr("stroke", "none")
                        .attr("class", "toolTips");

    d3.select("body").append("label")
                        .text("Displays the type of the variable. Use the switch to toggle the type as dependent or independent. VisiStat selects the visualization based on this information.")
                        .attr("id", "variablePanel")
                        .attr("class", "toolTips")
                        .attr("style", "position: absolute; left: " + (parseFloat(variablePanelWidth) + 4*variableNameHolderPadding) + "px; top: " + (variableNames.length * (variableNameHolderHeight + variableNameHolderPadding)/2 - variableNameHolderHeight*1.75/2 + variableNameHolderPadding) + "px; width: " + (variableNameHolderWidth - variableNameHolderPadding/2) + "px; color: white; text-align: center; font-size: " + fontSizeToolTips + ";");

    variablePanelCanvas.append("line")
                    .attr("x1", variableTypeSelectionButtonWidth/1.5 + variableNameHolderPadding + variableNameHolderWidth - variableTypeSelectionButtonWidth + 2*variableNameHolderPadding - variableNameHolderPadding/3)
                    .attr("y1", variableNames.length * (variableNameHolderHeight + variableNameHolderPadding)/2)
                    .attr("x2", variablePanelWidth)
                    .attr("y2", variableNames.length * (variableNameHolderHeight + variableNameHolderPadding)/2)
                    .attr("stroke", "#3957F1")
                    .attr("stroke-dasharray", "3,3")
                    .attr("class", "toolTips");
                
    plotCanvas.append("line")
                .attr("x1", 0)
                .attr("y1", variableNames.length * (variableNameHolderHeight + variableNameHolderPadding)/2)
                .attr("x2", 3*variableNameHolderPadding)
                .attr("y2", variableNames.length * (variableNameHolderHeight + variableNameHolderPadding)/2)
                .attr("stroke", "#3957F1")
                .attr("stroke-dasharray", "3,3")
                .attr("class", "toolTips");

    var visualizationPanelCanvas = d3.select("#visualisationPanelSVG");

    var visualisationPanelHeight = visualisationPanel.style("height");
    var visualisationPanelWidth = visualisationPanel.style("width");

    var visualizationPanelBorder = visualizationPanelCanvas.append("rect")
                                                            .attr("x", variableNameHolderPadding/2)
                                                            .attr("y", variableNameHolderPadding/2)
                                                            .attr("width", parseFloat(visualisationPanelWidth) - variableNameHolderPadding)
                                                            .attr("height", parseFloat(visualisationPanelHeight) - variableNameHolderPadding)
                                                            .attr("rx", radiusForRoundedRect)
                                                            .attr("ry", radiusForRoundedRect)
                                                            .attr("fill","none")
                                                            .attr("stroke", "#3957F1")                                                
                                                            .attr("stroke-dasharray","3,3")
                                                            .attr("class","toolTips");
    plotCanvas.append("rect")
                        .attr("x", (plotPanelWidth)/2 - 3*variableNameHolderPadding)
                        .attr("y", plotPanelHeight - variableNameHolderPadding*3 - variableNameHolderHeight*1)
                        .attr("height", variableNameHolderHeight*1)
                        .attr("width", variableNameHolderWidth + variableNameHolderPadding)
                        .attr("rx", radiusForRoundedRect)
                        .attr("ry", radiusForRoundedRect)
                        .attr("fill", "#3957F1")
                        .attr("filter", "url(#Bevel)")
                        .attr("stroke", "none")
                        .attr("class", "toolTips");

    d3.select("body").append("label")
                        .text("Visualizations available in VisiStat")
                        .attr("id", "variablePanel")
                        .attr("class", "toolTips")
                        .attr("style", "position: absolute; left: " + (plotPanelWidth/2 + parseFloat(variablePanelWidth) - 3*variableNameHolderPadding + variableNameHolderPadding) + "px; top: " + (plotPanelHeight - variableNameHolderPadding*3 - variableNameHolderHeight*1 + variableNameHolderPadding) + "px; width: " + (variableNameHolderWidth - variableNameHolderPadding/2) + "px; color: white; text-align: center; font-size: " + fontSizeToolTips + ";");

    plotCanvas.append("line")
                .attr("x1", (plotPanelWidth + sideBarWidth)/2)
                .attr("y1", plotPanelHeight)
                .attr("x2", (plotPanelWidth + sideBarWidth)/2)
                .attr("y2", plotPanelHeight - variableNameHolderPadding*3)
                .attr("stroke", "#3957F1")
                .attr("stroke-dasharray", "3,3")
                .attr("class", "toolTips");

    visualizationPanelCanvas.append("line")
                            .attr("x1", (plotPanelWidth + sideBarWidth)/2)
                            .attr("y1", variableNameHolderPadding/2)
                            .attr("x2", (plotPanelWidth + sideBarWidth)/2)
                            .attr("y2", 0)
                            .attr("stroke", "#3957F1")
                            .attr("stroke-dasharray", "3,3")
                            .attr("class", "toolTips");

    var sideBar = d3.select("#sideBarCanvas");

    // sideBar.append("rect")
    //         .attr("x", sideBarWidth/4 - variableNameHolderHeight/2 - variableNameHolderPadding/2)
    //         .attr("y", variableNameHolderPadding/2)
    //         .attr("width", variableNameHolderHeight + variableNameHolderPadding)
    //         .attr("height", variableNameHolderHeight + variableNameHolderPadding)
    //         .attr("rx", radiusForRoundedRect)
    //         .attr("ry", radiusForRoundedRect)
    //         .attr("fill","none")
    //         .attr("stroke", "#3957F1")                                                
    //         .attr("stroke-dasharray","3,3")
    //         .attr("class","toolTips");

    sideBar.append("rect")
            .attr("x", 3*sideBarWidth/4 - variableNameHolderHeight/2 - variableNameHolderPadding/2)
            .attr("y", variableNameHolderPadding/2)
            .attr("width", variableNameHolderHeight + variableNameHolderPadding)
            .attr("height", variableNameHolderHeight + variableNameHolderPadding)
            .attr("rx", radiusForRoundedRect)
            .attr("ry", radiusForRoundedRect)
            .attr("fill","none")
            .attr("stroke", "#3957F1")                                                
            .attr("stroke-dasharray","3,3")
            .attr("class","toolTips");

    sideBar.append("line")
            .attr("x1", 3*sideBarWidth/4)
            .attr("y1", variableNameHolderPadding + variableNameHolderHeight + variableNameHolderPadding/2)
            .attr("x2", 3*sideBarWidth/4)
            .attr("y2", variableNameHolderPadding + variableNameHolderHeight + 5*variableNameHolderPadding)
            .attr("stroke", "#3957F1")
            .attr("stroke-dasharray", "3,3")
            .attr("class", "toolTips");

    sideBar.append("rect")
            .attr("x", 3*sideBarWidth/4 - variableNameHolderWidth/4)
            .attr("y", variableNameHolderPadding + variableNameHolderHeight + 5*variableNameHolderPadding)
            .attr("width", variableNameHolderWidth/2)
            .attr("height", variableNameHolderHeight)
            .attr("rx", radiusForRoundedRect)
            .attr("ry", radiusForRoundedRect)
            .attr("fill", "#3957F1")
            .attr("filter", "url(#Bevel)")
            .attr("stroke", "none")
            .attr("class", "toolTips");

    d3.select("body").append("label")
                    .text("Help")
                    .attr("class", "toolTips")
                    .attr("style", "position: absolute; left: " + (plotPanelWidth + parseFloat(variablePanelWidth) + 3*sideBarWidth/4 - variableNameHolderWidth/4 + variableNameHolderPadding) + "px; top: " + (variableNameHolderPadding + variableNameHolderHeight + 5*variableNameHolderPadding + variableNameHolderPadding) + "px; width: " + (variableNameHolderWidth/2 - variableNameHolderPadding) + "px; color: white; text-align: center; font-size: " + fontSizeToolTips + ";");

    d3.select("body").append("label")
                    .text("SELECT A VARIABLE TO GET STARTED")
                    .attr("class", "toolTips")
                    .attr("style", "position: absolute; left: " + (parseFloat(variablePanelWidth) + variableNameHolderPadding) + "px; top: " + (plotPanelHeight/2 + variableNameHolderPadding) + "px; width: " + (plotPanelWidth - variableNameHolderPadding) + "px; color: #3957F1; text-align: center; font: normal " + scaleForWindowSize(32) + "px verdana !important;");

    d3.select("body").append("img")
                    .attr("class", "toolTips")
                    .attr("src", "images/arrow.png")
                    .attr("style", "position: absolute; left: " + (parseFloat(variablePanelWidth)) + "px; top: " + (plotPanelHeight/2 + variableNameHolderPadding - 35) + "px; height: 100px; ");
}

function initiateLoadingDatasetAnimation()
{
    freezeMouseEvents = true;
    
    var canvas = d3.select("#plotCanvas");

    if(document.getElementsByClassName("loadingAnimation").length > 0)
            removeElementsByClassName("loadingDataset");
            
    canvas.append("text")
        .attr("x", plotPanelWidth/2)
        .attr("y", plotPanelHeight/2)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .text("Loading Dataset")
        .attr("id", "text")
        .attr("class", "loadingAnimation");   

    canvas.append("image")
            .attr("x", plotPanelWidth/2 - loadingImageSize/2)
            .attr("y", 3*plotPanelHeight/4)
            .attr("xlink:href", "images/loading.gif")
            .attr("height", loadingImageSize)
            .attr("width", loadingImageSize)
            .attr("id", "image")
            .attr("class", "loadingAnimation");            
}

/**
 * Draw the plots to depict interaction effect
 * @param  {object} the type of effect {"main", "2-way interaction", "3-way interaction"}
 * @return {none} 
 */
function drawEffects(effect)
{
    var margin = 10;
    var leftMarginForAxisLabel = 25;
    if(document.getElementById("effectsPlotPanel"))
        removeElementById("effectsPlotPanel");

    var effectsPlotPanel = d3.select("body").append("div")
                                                                    .attr("style", "position: absolute; left: " + (variablesPanelWidth + margin) + "px; top: " + assumptionsPanelHeight + "px; width: " + (plotPanelWidth - 2*margin) + "px; height: " + (height - resultsPanelHeight - assumptionsPanelHeight) + "px; background-color: #fff")
                                                                    .attr("id", "effectsPlotPanel");
    
    var effectPlotCanvas = effectsPlotPanel.append("svg")                                                            
                                                            .attr("width", plotPanelWidth - 2*margin)
                                                            .attr("height", (height - resultsPanelHeight - assumptionsPanelHeight))
                                                            .attr("id", "effectPlotCanvas");

     if(effect == "simple main")
     {
        var variableList = sort(selectedVariables);
        var IVs = variableList["independent"];

        if(getObjectLength(global.interactionEffect) == 3)
        {

            // If user has already selected stuff (later)
            var simpleMainEffectPlotWidth = plotPanelWidth - 3*margin - leftMarginForAxisLabel;
            var simpleMainEffectPlotHeight = height - resultsPanelHeight - assumptionsPanelHeight - 2*config.interactionEffect.navigationButton.height - parseFloat(fontSizes["effect plot title"])*1.5 - 2*margin;

            // Title
            effectPlotCanvas.append("text")
                                    .attr("x", margin + leftMarginForAxisLabel + simpleMainEffectPlotWidth/2)
                                    .attr("y", config.interactionEffect.navigationButton.height + parseFloat(fontSizes["effect plot title"])*1.5)
                                    .attr("font-size", fontSizes["effect plot title"])
                                    .attr("text-anchor", "middle")
                                    .text(effect + " :" + global.interactionEffect.IV + "(" + global.interactionEffect.fixedIVLevels + ")");

            // Outline (temporary?)        
            effectPlotCanvas.append("rect")
                                    .attr("x", margin + leftMarginForAxisLabel)
                                    .attr("y", margin + config.interactionEffect.navigationButton.height + parseFloat(fontSizes["effect plot title"])*1.5)
                                    .attr("width", simpleMainEffectPlotWidth)
                                    .attr("height", simpleMainEffectPlotHeight)
                                    .attr("stroke", "black")
                                    .attr("stroke-width", strokeWidth["effect plot border"])
                                    .attr("fill", "none")
                                    .attr("class", "effectPlotOutline");

            plotSimpleMainEffect(margin + leftMarginForAxisLabel, margin + config.interactionEffect.navigationButton.height + parseFloat(fontSizes["effect plot title"])*1.5, simpleMainEffectPlotWidth, simpleMainEffectPlotHeight);

            effectPlotCanvas.append("rect")
                                .attr("x", margin + leftMarginForAxisLabel)
                                .attr("y", margin + config.interactionEffect.navigationButton.height + parseFloat(fontSizes["effect plot title"])*1.5)
                                .attr("width", simpleMainEffectPlotWidth)
                                .attr("height", simpleMainEffectPlotHeight)
                                .attr("stroke", "none")
                                .attr("fill", "white")
                                .attr("data-type", effect)                                                                                                                                                              
                                .attr("class", "effectPlotRects");  

            removeElementById("effectsPlotHelp");

            var helpText = "Simple main effect tests the effect of IV on the dependent variable by fixing the levels of other independent variables.";

             var effectsHelpPanel = d3.select("#buttonsPanel");
            effectsHelpPanel.append("p")
                                .attr("id", "effectsPlotHelp")
                                .attr("style", "font-size: 14px")
                                .html(helpText);
        
            displaySimpleMainEffectResults();
            plotYAxisLabelForInteractionPlots(margin, margin + config.interactionEffect.navigationButton.height + parseFloat(fontSizes["effect plot title"])*1.5 + simpleMainEffectPlotHeight/2);        
            drawEffectNavigationButton("top", "main");
        }
        else
        {
            drawPopUpToGetInputForSimpleMainEffect(IVs);
            drawEffectNavigationButton("top", "main");
        }

        return;
    }

    if(effect != "simple main")
    {
        var effectObject = effects[effect];

        var numberOfEffectPlots = effectObject.length;
        var widthOfEachPlot = (plotPanelWidth - 2*margin - leftMarginForAxisLabel - margin*numberOfEffectPlots)/numberOfEffectPlots;
        var heightOfEachPlot = (height - resultsPanelHeight - assumptionsPanelHeight)- 2*config.interactionEffect.navigationButton.height - parseFloat(fontSizes["effect plot title"])*1.5 - 2*margin;

        plotYAxisLabelForInteractionPlots(margin, margin + config.interactionEffect.navigationButton.height + parseFloat(fontSizes["effect plot title"])*1.5 + heightOfEachPlot/2);

        for(var i=0; i<numberOfEffectPlots; i++)
        {
            // Title
            effectPlotCanvas.append("text")
                                    .attr("x", margin + leftMarginForAxisLabel + i*(widthOfEachPlot + margin) + widthOfEachPlot/2)
                                    .attr("y", config.interactionEffect.navigationButton.height + parseFloat(fontSizes["effect plot title"])*1.5)
                                    .attr("font-size", fontSizes["effect plot title"])
                                    .attr("text-anchor", "middle")
                                    .text(effect + " :" + effectObject[i]["label"]);

            // Outline (temporary?)        
            effectPlotCanvas.append("rect")
                                    .attr("x", margin + leftMarginForAxisLabel + i*(widthOfEachPlot + margin))
                                    .attr("y", margin + config.interactionEffect.navigationButton.height + parseFloat(fontSizes["effect plot title"])*1.5)
                                    .attr("width", widthOfEachPlot)
                                    .attr("height", heightOfEachPlot)
                                    .attr("stroke", "black")
                                    .attr("stroke-width", strokeWidth["effect plot border"])
                                    .attr("fill", "none")
                                    .attr("class", "effectPlotOutline");

            // Plot the effects
            switch(effect)
            {
                case "main":
                                    plotMainEffect(margin + leftMarginForAxisLabel + i*(widthOfEachPlot + margin), margin + config.interactionEffect.navigationButton.height + parseFloat(fontSizes["effect plot title"])*1.5, widthOfEachPlot, heightOfEachPlot, effectObject[i]["label"]); //left, top, width, height, IV
                                    drawEffectNavigationButton("top", "2-way interaction");     
                                    drawEffectNavigationButton("bottom", "simple main");     
                                    displayEffectsPlotHelp(effect, effectObject[0]);                          

                                    break;

                case "2-way interaction":
                                    plot2WayInteractionEffect(margin + leftMarginForAxisLabel + i*(widthOfEachPlot + margin), margin + config.interactionEffect.navigationButton.height + parseFloat(fontSizes["effect plot title"])*1.5, widthOfEachPlot, heightOfEachPlot, effectObject[i]["label"].split(":")[0], effectObject[i]["label"].split(":")[1]); //left, top, width, height, xAxisIV, colorIV
                                    drawEffectNavigationButton("bottom", "main");

                                    if(highestOrderEffect == "3-way interaction")
                                    {                                    
                                        drawEffectNavigationButton("top", "3-way interaction");
                                    }

                                    displayEffectsPlotHelp(effect, effectObject[0]);

                                    break;

                case "3-way interaction":
                                plot3WayInteractionEffect(margin + leftMarginForAxisLabel + i*(widthOfEachPlot + margin), margin + config.interactionEffect.navigationButton.height + parseFloat(fontSizes["effect plot title"])*1.5, widthOfEachPlot, heightOfEachPlot, effectObject[i]["label"].split(":")[0], effectObject[i]["label"].split(":")[1], effectObject[i]["label"].split(":")[2]); //left, top, width, height, xAxisIV, colorIV, theOtherIV)                           
                                drawEffectNavigationButton("bottom", "2-way interaction");
                                
                                displayEffectsPlotHelp(effect, effectObject[0]);
                                break;

                default:
                                console.log("Error: unknown value for 'effect': " + effect);
                                break;
            }

            effectPlotCanvas.append("rect")
                                    .attr("x", margin + leftMarginForAxisLabel + i*(widthOfEachPlot + margin))
                                    .attr("y", margin + config.interactionEffect.navigationButton.height + parseFloat(fontSizes["effect plot title"])*1.5)
                                    .attr("width", widthOfEachPlot)
                                    .attr("height", heightOfEachPlot)
                                    .attr("stroke", "none")
                                    .attr("fill", "white")
                                    .attr("data-type", effect)
                                    .attr("data-index", i)                                
                                    .attr("opacity", "0.01") 
                                    .attr("id", getValidId(effectObject[i]["label"]))                                                               
                                    .attr("class", "effectPlotRects");

            if(i == 0)
            {
                displayEffectResults(effectObject[0], effect);
            }
        }
    }
}

/**
 * [displays the help for the chosen effect]
 * @param  {string} effect [possible values: "main", "2-way interaction", or "3-way interaction"]
 * @return {[none]}     
 */
var drawPopUpToGetInputForSimpleMainEffect;

function drawPopUpToGetInputForSimpleMainEffect(IVs)
{
    var html;
    var levels = {};

    for(var i=0; i<IVs.length; i++)
    {
        levels[IVs[i]] = variables[IVs[i]]["dataset"].unique();
    }

    html = "";
    html += "<div id='simpleMainEffectPopUp'><p id='simpleMainEffectPopUpExplanationText'>Please select independent variable for which you wish to find the simple main effect. Select the levels for other independent variables.<br/><br/>";

    for(var i=0; i<IVs.length; i++)
    {
        html += "<input type='radio' name='IVs' value=" + IVs[i] + " class='radioChoices' id=" + getValidId(IVs[i]) + " onclick='IVIsSelected(this.id)'>" + IVs[i];
        html += "<select name='levels_" + IVs[i] + "' id=" + getValidId(IVs[i]) + " class ='dropDowns'>";

        for(var j=0; j<levels[IVs[i]].length; j++)
        {
            html+= "<option value=" + levels[IVs[i]][j] + ">" + levels[IVs[i]][j] + "</option>\n";
        }
        html += "</select><br/>";
    }

    html += "<button type='button' onclick='submitButtonClicked()' id='submitButtonSimpleMainEffect'>Find simple main effect</button>"
    html += "</div>"

    appendDOM('#effectsPlotPanel', html);
};

function IVIsSelected(IV)
{
    if(IV.split("_").length == 2)
    {
        IV = IV.split("_")[1];
    }

    $(".dropDowns").attr("style", "display: inline;");
    $("#" + IV + ".dropDowns").attr("style", "display: none;");

    $("#submitButtonSimpleMainEffect").removeAttr("disabled");
}

function submitButtonClicked()
{
    // Store all input
    var variableList = sort(selectedVariables);
    var IVs = variableList["independent"];

    var IV = $(".radioChoices:checked");
    if(IV.length > 0)
        global.interactionEffect.IV = IV.val();

    global.interactionEffect.fixedIVs = [];
    global.interactionEffect.fixedIVs = IVs.clone();

    
    if(IVs.indexOf(global.interactionEffect.IV) != -1)
        global.interactionEffect.fixedIVs.splice(IVs.indexOf(global.interactionEffect.IV), 1);    

    global.interactionEffect.fixedIVLevels = [];
    for(var i=0; i<global.interactionEffect.fixedIVs.length; i++)
    {
        global.interactionEffect.fixedIVLevels.push($("#" + getValidId(global.interactionEffect.fixedIVs[i]) + ".dropDowns option:selected").text());
    }

    console.dir(global.interactionEffect);

    // Determine type of simple main effect
    if((experimentalDesign == "within-groups") && (getWithinGroupVariable(variableList) == global.interactionEffect.IV))
    {
        findMixedSimpleMainEffect();        
    }   
    else
    {
        findLinearSimpleMainEffect();
    }

    removeElementById("simpleMainEffectPopUp");

    // Call function, display
}

function displayEffectsPlotHelp(effect, effectObject) 
{
    if(document.getElementById("buttonCanvas") != null) removeElementById("buttonCanvas");
    if(document.getElementById("effectsPlotHelp") != null) removeElementById("effectsPlotHelp");

    var helpText = "";
    var variableList = sort(selectedVariables);
    var DV = variableList["dependent"][0];
    var IVs = variableList["independent"];

    var effectsHierarchy = ["main", "2-way interaction", "3-way interaction"];

    if(IVs.length == 2)
        IVs.push(null);

    var isSig = effectObject["rawP"] < 0.05 ? true : false;
    var isHigherSig = effectsHierarchy.indexOf(highestOrderEffect) > effectsHierarchy.indexOf(effect) ? true : false;

    switch(effect)
    {
        case "main":
                            helpText = root.VisiStat.UI.helpText.interactionEffectMainEffect(IVs[0], IVs[1], IVs[2] == undefined ? null : IVs[2], DV, isSig, isHigherSig); // iv1, iv2, iv3, dv, isSig=true, isHigherSig=true
                            break;

        case "2-way interaction":
                            helpText = root.VisiStat.UI.helpText.interactionEffect2Way(IVs[0], IVs[1], IVs[2] == undefined ? null : IVs[2], DV, isSig, isHigherSig); // iv1, iv2, iv3, dv, isSig=true, isHigherSig=true
                            break;

        case "3-way interaction":
                            helpText = root.VisiStat.UI.helpText.interactionEffect3Way(IVs[0], IVs[1], IVs[2], DV, isSig, isHigherSig); // iv1, iv2, iv3, dv, isSig=true, isHigherSig=true
                            break;

        case "simple main":
                            helpText = "Simple main effect tests the effect of IV on the dependent variable by fixing the levels of other independent variables.";
                            break;

        default: 
                        console.log("Error: unhandled case");
                        break;
    }

    var effectsHelpPanel = d3.select("#buttonsPanel");
    effectsHelpPanel.append("p")
                                .attr("id", "effectsPlotHelp")
                                .attr("style", "font-size: 13px")
                                .html(helpText);
                                //.text(window.VisiStat.UI.helpText.interactionEffect3Way("iv1", "iv2", "iv3", "dv", true));
}

function displayLoadingTextForInteractionEffect()
{
    var canvas = d3.select("#plotCanvas");

    canvas.transition().delay(750).duration(750).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight);

    var displayText = "Testing for interaction effect...";

    // Get bounding box

    var boundingBox = getBoundingBoxForText(plotPanelWidth/2, plotPanelHeight/2, displayText, canvas, plotPanelHeight/3);

    // Construct a rect BG
    canvas.append("rect")
                    .attr("x", boundingBox.x)
                    .attr("y", boundingBox.y)
                    .attr("width", boundingBox.width)
                    .attr("height", boundingBox.height)
                    .attr("fill", "#F8FCFF")
                    .attr("opacity", "0.9")
                    .attr("id", "rect")
                    .attr("class", "tempDisplay");

    canvas.append("text")
                    .attr("x", plotPanelWidth/2)
                    .attr("y", plotPanelHeight/2)
                    .attr("text-anchor", "middle")
                    .attr("font-size", fontSizes["display text"])
                    .attr("font-weight", "100")
                    .attr("id", "text")
                    .attr("class", "tempDisplay")
                    .text(displayText);                    
}

function displayEffectResults(effect, effectType)
{
    var resultsCanvas = d3.select("#resultsCanvas");
    
    removeElementsByClassName("significanceTest");
    removeElementsByClassName("effectSize");
    removeElementsByClassName("parameter");
    
    // Set as selected
    d3.select("#" + getValidId(effect["label"]) + ".effectPlotRects")
            .attr("fill", "lightgrey")
            .attr("opacity", "0.25")
            .attr("stroke", "black")
            .attr("stroke-width", strokeWidth["selected effect"]);
    
    resultsCanvas.append("text")
            .attr("x", resultsPanelWidth/2)
            .attr("y", 1.5*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizes["test result"] )
            .attr("fill", "#627bf4")
            .text("Statistical test: " + multiVariateTestResults["method"])
            .attr("class", "significanceTest");
    
    drawParameter(effect["df"], effect["parameter"], "F"); // drawParameter(DF, parameter, type, resultsCanvas)
    
    resultsCanvas.append("text")
            .attr("x", 3*resultsPanelWidth/4)
            .attr("y", 3*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizes["test result"] )
            .attr("fill", "#627bf4")
            .text(effect["dressedP"])
            .attr("class", "significanceTest");
    
    
    // // Effect sizes
    
    drawEffectSize(parseFloat(effect["rawEffectSize"]), multiVariateTestResults["effect-size-type"]); // drawEffectSize(value, type, resultsCanvas)

    // Display report text

    var partialReportText = effect["rawP"] < 0.05 ? " significant " + effectType + " effect (" + effect["label"] + ")": " *no* significant " + effectType + " effect (" + effect["label"] + ")"; 

    resultsCanvas.append("text")
                            .attr("x", resultsPanelWidth/2)
                            .attr("y", resultsPanelHeight - significanceTestResultStep)
                            .attr("text-anchor", "middle")
                            .attr("font-size", fontSizes["result one-liner"])
                            .text(partialReportText)
                            .attr("class", "significanceTest");
}        

function displaySimpleMainEffectResults()
{
    var resultsCanvas = d3.select("#resultsCanvas");
    
    removeElementsByClassName("significanceTest");
    removeElementsByClassName("effectSize");
    removeElementsByClassName("parameter");
    
    // Set as selected
    d3.select(".effectPlotRects")
            .attr("fill", "lightgrey")
            .attr("opacity", "0.25")
            .attr("stroke", "black")
            .attr("stroke-width", strokeWidth["selected effect"]);
    
    resultsCanvas.append("text")
            .attr("x", resultsPanelWidth/2)
            .attr("y", 1.5*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizes["test result"] )
            .attr("fill", "#627bf4")
            .text("Statistical test: " + multiVariateTestResults["method"])
            .attr("class", "significanceTest");
    
    drawParameter(multiVariateTestResults["df"][0], multiVariateTestResults["parameter"][0], "F"); // drawParameter(DF, parameter, type, resultsCanvas)
    
    resultsCanvas.append("text")
            .attr("x", 3*resultsPanelWidth/4)
            .attr("y", 3*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizes["test result"] )
            .attr("fill", "#627bf4")
            .text(multiVariateTestResults["p"][0])
            .attr("class", "significanceTest");

            // rawP: multiVariateTestResults["rawP"][i],
            //                                 dressedP: multiVariateTestResults["p"][i],
            //                                 df: multiVariateTestResults["df"][i],
            //                                 rawEffectSize: multiVariateTestResults["effect-size"][i],
            //                                 label: labels[i],
            //                                 parameter: multiVariateTestResults["parameter"][i]
    
    
    // // Effect sizes
    
    drawEffectSize(parseFloat(multiVariateTestResults["effect-size"][0]), multiVariateTestResults["effect-size-type"]); // drawEffectSize(value, type, resultsCanvas)

}

/**
 * Flashes the results of statistical test to get user's attention
 * @return {none} 
 */
function flashTestsResults()
{
    $(".significanceTest, .effectSize, .parameter").pulse({opacity: "0.1"}, {pulses: 1, duration: 750, interval: 500});
}  
