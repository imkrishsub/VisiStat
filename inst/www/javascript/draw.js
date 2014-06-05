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
            .attr("style", "font-size: " + fontSizeForDisplayDataTitle + "px")
            .attr("class", "displayDataText");
    
    var table = canvas.append("table")
            .attr("border", "1")
            .attr("class", "displayDataTable")
            .attr("style", "font-size: " + fontSizeForDisplayDataTableElements + "px; position: relative; width: 30%; top: " + scaleForWindowSize(45) + "px; margin: 0 auto; border-spacing: 0; border-collapse: collapse;");
            
    table.append("tr").append("th").text(variable).attr("style", "font-size: " + 1.3*fontSizeForDisplayDataTableElements + "px;");      
            
    for(var i=0; i<variableData.length(); i++)
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

function encode_as_img_and_link()
{
 // // Add some critical information
 // $("svg").attr({ version: '1.1' , xmlns:"http://www.w3.org/2000/svg"});

 // var svg = d3.select("#plotCanvas");

 // console.log(svg[0]);

 // var b64 = Base64.encode(svg[0]); // or use btoa if supported
 // // var b64 = window.btoa(unescape(encodeURIComponent(svg[0])));
 // console.log(b64);

 // // Works in recent Webkit(Chrome)
 // $("#reportPanel").append($("<img src='data:image/svg+xml;btoa,\n"+b64+"' alt='file.svg'/>"));

 // // Works in Firefox 3.6 and Webit and possibly any browser which supports the data-uri
 // $("#reportPanel").append($("<a href-lang='image/svg+xml' href='data:image/svg+xml;base64,\n"+b64+"' title='file.svg'>Download</a>"));
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

    // Append the canvas where boxplot is drawn

    // var canvas = reportPanel.append("canvas")
    //                         .attr("x", reportPanelWidth/2 - plotPanelWidth/2)
    //                         .attr("y", scaleForWindowSize(25))
    //                         .attr("width", plotPanelWidth)
    //                         .attr("height", plotPanelHeight)
    //                         .attr("id", "reportCanvas" + researchQuestionsSelectedForReport.indexOf(researchQuestion))
    //                         .attr("style", "display: block; margin: auto;");

    // setTimeout(function()
    // {
    //     // console.log($('<div>').append($('#plotCanvas').clone()).html());
    //     canvg(document.getElementById("reportCanvas" + researchQuestionsSelectedForReport.indexOf(researchQuestion)), $('<div>').append($('#plotCanvas').clone()).html());
    // }, 200); 

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
    var sideCanvas = d3.select("#sideCanvas");
    var reportButtonCanvas = d3.select("#reportButtonCanvas");
    var modeButtonCanvas = d3.select("#modeButtonCanvas");

    var L = 0;
    var T = 0;

    modeButtonCanvas.append("rect")            
                .attr("width", sidePanelWidth/2 + "px")
                .attr("height", sideCanvasButtonHeight + "px")
                .attr("fill", "url(#buttonFillSelected)")                
                .attr("id", "historyButtonBack")
                .attr("style", "z-index: 0;")
                .attr("class", "sideCanvasButtons");

    modeButtonCanvas.append("text")
                .attr("x", L + sidePanelWidth/4)
                .attr("y", T + sideCanvasButtonHeight/2)            
                .attr("fill", "white")
                .attr("text-anchor", "middle")
                .attr("font-size", historyButtonTextSize)
                .attr("id", "historyButtonText")
                .attr("class", "sideCanvasButtonTexts")
                .text("History");

    modeButtonCanvas.append("rect")
                .attr("width", sidePanelWidth/2)
                .attr("height", sideCanvasButtonHeight + "px")
                .attr("fill", "url(#buttonFillNormal)")
                .attr("opacity", "0.01")
                .attr("style", "z-index: 0;")
                .attr("id", "historyButtonFront")
                .attr("class", "sideCanvasButtons");


    modeButtonCanvas.append("rect")
                .attr("x", L + sidePanelWidth/2)
                .attr("y", T)
                .attr("width", sidePanelWidth/2)
                .attr("height", sideCanvasButtonHeight + "px")
                .attr("stroke", "black")
                .attr("fill", "url(#buttonFillNormal)")
                .attr("id", "helpButtonBack")
                .attr("class", "sideCanvasButtons");

    modeButtonCanvas.append("text")
                .attr("x", L + 3*sidePanelWidth/4)
                .attr("y", T + sideCanvasButtonHeight/2)
                .attr("fill", "black")
                .attr("text-anchor", "middle")
                .attr("font-size", historyButtonTextSize)
                .attr("id", "helpButtonText")
                .attr("class", "sideCanvasButtonTexts")
                .text("Help");

    modeButtonCanvas.append("rect")
                .attr("x", L + sidePanelWidth/2)
                .attr("y", T)
                .attr("width", sidePanelWidth/2)
                .attr("height", sideCanvasButtonHeight + "px")
                .attr("stroke", "black")
                .attr("fill", "url(#buttonFillNormal)")
                .attr("opacity", "0.01")
                .attr("id", "helpButtonFront")
                .attr("class", "sideCanvasButtons");

    reportButtonCanvas.append("rect")
                .attr("x", L)
                .attr("y", 0)
                .attr("width", sidePanelWidth)
                .attr("height", sideCanvasButtonHeight + "px")
                .attr("stroke", "black")
                .attr("fill", "url(#buttonFillNormal)")
                .attr("id", "reportButtonBack")
                .attr("class", "sideCanvasButtons");
    
    reportButtonCanvas.append("text")
                .attr("x", L + sidePanelWidth/2)
                .attr("y", sideCanvasButtonHeight/2)
                .attr("fill", "black")
                .attr("text-anchor", "middle")
                .attr("font-size", historyButtonTextSize)
                .attr("id", "reportButtonText")
                .attr("class", "sideCanvasButtonTexts")
                .text("Create report"); 

    reportButtonCanvas.append("rect")
                .attr("x", L)
                .attr("y", 0)
                .attr("width", sidePanelWidth)
                .attr("height", sideCanvasButtonHeight + "px")
                .attr("stroke", "black")
                .attr("fill", "url(#buttonFillNormal)")
                .attr("opacity", "0.01")
                .attr("id", "reportButtonFront")
                .attr("class", "sideCanvasButtons");

}

function updateHistory(researchQuestion)
{    
    var sideCanvas = d3.select("#sideCanvas");

    entryHeight = (sidePanelHeight - sideCanvasButtonHeight*2)/3; 
    entryWidth = entryHeight*4/3.5;

    if(listOfResearchQuestions.length() > 3)
            sideCanvas.attr("height", parseFloat(sideCanvas.attr("height")) + parseFloat(entryHeight))
                        .attr("viewBox", "0 0 " + parseFloat(sidePanelWidth) + " " + parseFloat(sideCanvas.attr("height")));

    currentHistoryY = (listOfResearchQuestions.length() - 1) * entryHeight;

    sideCanvas.append("rect")
                .attr("x", 0)
                .attr("y", currentHistoryY)
                .attr("width", sidePanelWidth)
                .attr("height", entryHeight)
                .attr("stroke", "black")
                .attr("fill", "none");

    sideCanvas.append("text")
                .attr("x", sidePanelWidth/2)
                .attr("y", currentHistoryY + 2.5*yAxisTickTextOffset)
                .attr("text-anchor", "middle")
                .attr("fill", "#FF6314")
                .attr("font-size", scaleForWindowSize(12) + "px")
                .text(researchQuestion)
                .style("font-family: \"Verdana\", sans-serif; font-weight: normal; font-style: normal;");

    if(document.getElementsByClassName("starImage").length() >= 3)
    {
    
        $("#sidePanel").animate({
            scrollTop: currentHistoryY,
            duration: 5000,
            easing: 'easeInBounce'
        }); 
    }

    makeBoxPlotInHistoryCanvas();       

    sideCanvas.append("rect")
                .attr("x", 0)
                .attr("y", currentHistoryY)
                .attr("width", sidePanelWidth)
                .attr("height", entryHeight)
                .attr("stroke", "none")
                .attr("fill", "lightgrey")
                .style("opacity", "0.05")
                .attr("class", "historyEntry")
                .attr("id", "entry" + nHistoryEntries);

    // Star 
    var starSize = (sidePanelWidth - entryWidth)*2/3;

    sideCanvas.append("image")
                .attr("x", entryWidth)
                .attr("y", currentHistoryY + entryHeight/2 - starSize/2)
                .attr("height", starSize)
                .attr("width", starSize)
                .attr("xlink:href", "images/star_empty.png")
                .attr("id", "image" + nHistoryEntries)
                .attr("class", "starImage");

    sideCanvas.append("image")
                .attr("x", entryWidth)
                .attr("y", currentHistoryY + entryHeight/2 - starSize/2)
                .attr("height", starSize)
                .attr("width", starSize)
                .attr("xlink:href", "images/checkbox_empty.png")
                .attr("display", "none")
                .attr("id", "image" + nHistoryEntries)
                .attr("class", "checkboxImage");

    nHistoryEntries++;
}


function plotVisualisation()
{   
    resetSVGCanvas();
    drawFullScreenButton();
   
    switch(currentVisualisationSelection)
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
                                        testResults = new Object();
                                        distributions = new Object();
                                        variances = new Object();
                                        
                                        makeBoxPlotInPlotCanvas();
                                        
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

function resetSVGCanvas()
{
    removeElementsByClassName("regressionPredictionDiv");
    removeElementsByClassName("dialogBox");
    
    if(document.getElementById("plotCanvas") != null)
        removeElementById("plotCanvas");
    if(document.getElementById("buttonCanvas") != null)
        removeElementById("buttonCanvas");
    if(document.getElementById("assumptionsCanvas") != null)
        removeElementById("assumptionsCanvas");
    if(document.getElementById("resultsCanvas") != null)
        removeElementById("resultsCanvas");        
            
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

    if(document.getElementById("sideCanvas") == null)
    {
        var sideCanvas = d3.select("#sidePanel").append("svg");
        sideCanvas.attr("id", "sideCanvas")
                  .attr("x", 0)
                  .attr("y", 0)
                  .attr("height", (sidePanelHeight - 2*sideCanvasButtonHeight))
                  .attr("width", sidePanelWidth)
                  .attr("viewBox", "0 0 " + sidePanelWidth + " " + (sidePanelHeight - 2*sideCanvasButtonHeight));
    }

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
}

function drawFullScreenButton()
{    
    //TODO 
}

function drawHelpButton()
{
    var sideBar = d3.select("#sideBarCanvas");

    var helpButtonOffset = assumptionImageSize*2;
    var size = variableNameHolderHeight;

    sideBar.append("rect")
            .attr("x", 6*sideBarWidth/8 - size/2)
            .attr("y", variableNameHolderPadding)
            .attr("rx", visualizationHolderRadius)
            .attr("ry", visualizationHolderRadius)
            .attr("height", size)
            .attr("width", size)
            .attr("fill", "url(#buttonFillNormal)")
            .attr("filter", "url(#Bevel)")
            .attr("stroke", "black")
            .attr("class", "helpButtonBack");
    
    sideBar.append("text")
            .attr("x", 6*sideBarWidth/8)
            .attr("y", variableNameHolderPadding + size/2 + 2*yAxisTickTextOffset)
            .attr("font-size", scaleForWindowSize(35))
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .text("?")
            .attr("class", "helpButtonText");
    
    sideBar.append("rect")
            .attr("x", 6*sideBarWidth/8 - size/2)
            .attr("y", variableNameHolderPadding)
            .attr("rx", visualizationHolderRadius)
            .attr("ry", visualizationHolderRadius)
            .attr("height", size)
            .attr("width", size)
            .attr("opacity", "0.1")
            .attr("class", "helpButtonFront");
}

function drawResetButton()
{
    var assumptionsCanvas = d3.select("#plotCanvas");        

    var helpButtonOffset = assumptionImageSize*2;
    var size = variableNameHolderHeight;
    
    assumptionsCanvas.append("rect")
            .attr("x", assumptionsPanelWidth - size - size/2)
            .attr("y", plotPanelHeight - size - size/2)
            .attr("rx", visualizationHolderRadius)
            .attr("ry", visualizationHolderRadius)
            .attr("height", size)
            .attr("width", size)
            .attr("fill", "url(#buttonFillNormal)")
            .attr("filter", "url(#Bevel)")
            .attr("stroke", "black")
            .attr("display", "none")
            .attr("class", "resetButtonBack");
    
    assumptionsCanvas.append("image")
            .attr("x", assumptionsPanelWidth - size - size/4)
            .attr("y", plotPanelHeight - size - size/2 + size/4)
            .attr("height", size/2)
            .attr("width", size/2)
            .attr("display", "none")
            .attr("xlink:href", "images/reset.png")
            .attr("class", "resetButtonImage");
    
    assumptionsCanvas.append("rect")
            .attr("x", assumptionsPanelWidth - size - size/2)
            .attr("y", plotPanelHeight - size - size/2)
            .attr("rx", visualizationHolderRadius)
            .attr("ry", visualizationHolderRadius)
            .attr("height", size)
            .attr("width", size)
            .attr("opacity", "0.001")
            .attr("class", "resetButtonFront");
}

function drawButtonInSideBar(buttonText, className, offset)
{
    if(offset == undefined)
        offset = 0;

    var maxButtons = 3; 

    var buttonOffset = 0.1 * buttonsPanelWidth;
    var L = buttonOffset;
    var T = buttonsPanelHeight/2 - buttonHeight/2 + offset*buttonsPanelHeight/3; 
        
    var buttonCanvas = d3.select("#buttonCanvas");
    
    buttonCanvas.append("rect")
            .attr("x", L)
            .attr("y", T)
            .attr("width", 0.8*buttonsPanelWidth)
            .attr("height", buttonHeight)
            .attr("rx", scaleForWindowSize(10) + "px")
            .attr("ry", scaleForWindowSize(10) + "px")
            .attr("fill", "url(#buttonFillNormal)")
            .attr("filter", "url(#Bevel)")
            .attr("stroke", "black")
            .attr("id", "button")
            .attr("class", className);
    
    buttonCanvas.append("text")
            .attr("x", L + 0.8*buttonsPanelWidth/2)
            .attr("y", T + buttonHeight/2)
            .attr("text-anchor", "middle")
            .text(buttonText)
            .attr("font-size", fontSizeButtonLabel + "px")
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
    
    var variableList = sort(currentVariableSelection);
    
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
            .attr("font-size", fontSizeVariablePanel + "px")
            .text("SELECT THE OUTCOME VARIABLE")
            .attr("id", "regression")
            .attr("class", "dialogBox");
            
    var step = (dialogBoxHeight/2)/currentVariableSelection.length();
    var yStart = centerY;
    var buttHeight = step - 10;
    
    for(var i=0; i<currentVariableSelection.length(); i++)
    {
        if(variableRoles[currentVariableSelection[i]] == "dependent")
        {
            canvas.append("rect")
                    .attr("x", centerX - dialogBoxWidth/3)
                    .attr("y", i*step + yStart)
                    .attr("width", 2*dialogBoxWidth/3)
                    .attr("height", buttHeight)
                    .attr("rx", scaleForWindowSize(10) + "px")
                    .attr("ry", scaleForWindowSize(10) + "px")
                    .attr("fill", "url(#buttonFillNormal)")
                    .attr("filter", "url(#Bevel)")
                    .attr("stroke", "black")
                    .attr("id", currentVariableSelection[i])
                    .attr("class", "outcomeVariable");
            canvas.append("text")
                    .attr("x", centerX)
                    .attr("y", i*step + yStart + buttHeight/2 + yAxisTickTextOffset)
                    .attr("text-anchor", "middle")
                    .text(currentVariableSelection[i])
                    .attr("font-size", fontSizeVariablePanel)
                    .attr("id", currentVariableSelection[i])
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
    
    var variableList = sort(currentVariableSelection);
    
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

    var normality = d3.select("#normality.crosses");
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

function drawEffectSize(value)
{
    var resultsCanvas = d3.select("#resultsCanvas"); 

    var type = testResults["effect-size-type"];

    value = parseFloat(value);
    
    if(type == "d")
        value = value > 5.0 ? 5.0 : value;
    
    var min = parseFloat(effectSizeMins[type]);
    var max = parseFloat(effectSizeMaxs[type]);
    
    var color = getColor(type, value);
    
    var L = resultsPanelWidth/2 - effectSizeWidth/2;
    var T = significanceTestResultStep*5 - effectSizeHeight/2;
    
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
                .attr("font-size", effectSizeFontSize)
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
                .attr("font-size", effectSizeFontSize)
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
                .attr("font-size", effectSizeFontSize)
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
                .attr("font-size", effectSizeFontSize)
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
            .attr("font-size", effectSizeFontSize)
            .attr("fill", "darkgrey")
            .attr("id", "labelMin")
            .attr("class", "effectSize")
            .text(min);
    
    resultsCanvas.append("text")
            .attr("x", L + scale(max))
            .attr("y", T + 3*effectSizeHeight/2)
            .attr("text-anchor", "end")
            .attr("font-size", effectSizeFontSize)
            .attr("fill", "darkgrey")
            .attr("id", "labelMax")
            .attr("class", "effectSize")
            .text(max);
    
    var effectSizeInterpretationIndicators = ["small", "medium", "large"];
        
    for(i=0; i<effectSizeInterpretations[type].length(); i++)
    {
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
                .attr("font-size", scaleForWindowSize(14) + "px")
                .text(effectSizeInterpretationIndicators[i])
                .attr("fill", getColor(type, effectSizeInterpretations[type][i]))
                .attr("display", "none")
                .attr("class", "effectSizeInterpretationIndicators");
    }
    
    
    if(min < 0)
    {
        for(i=0; i<effectSizeInterpretations[type].length(); i++)
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
                    .attr("font-size", scaleForWindowSize(14) + "px")
                    .text(effectSizeInterpretationIndicators[i])
                    .attr("fill", getColor(type, effectSizeInterpretations[type][i]))
                    .attr("display", "none")
                    .attr("class", "effectSizeInterpretationIndicators");
        }
    
        resultsCanvas.append("text")
            .attr("x", L + scale(0))
            .attr("y", T + 3*effectSizeHeight/2)
            .attr("text-anchor", "middle")
            .attr("font-size", effectSizeFontSize)
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
            .attr("font-size", effectSizeFontSize)
            .attr("fill", "black")
            .attr("id", "effectSizeText")
            .attr("class", "effectSize");
            
        mainText.append("tspan")
                    .text("Effect size: η");
        mainText.append("tspan")
                    .attr("baseline-shift", "super")
                    .text("2");
    }
    else if(type == "rS")
    {    
        var mainText = resultsCanvas.append("text")
            .attr("x", resultsPanelWidth/2)
            .attr("y", T - 2*yAxisTickTextOffset)// + effectSizeHeight/2 + yAxisTickTextOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", effectSizeFontSize)
            .attr("id", "effectSizeText")
            .attr("fill", "black")
            .attr("class", "effectSize");
            
        mainText.append("tspan")
                    .text("Effect size: r");
        mainText.append("tspan")
                    .attr("baseline-shift", "super")
                    .text("2");
    }
    else
    {
        resultsCanvas.append("text")
            .attr("x", resultsPanelWidth/2)
            .attr("y", T - 2*yAxisTickTextOffset)// + effectSizeHeight/2 + yAxisTickTextOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", effectSizeFontSize)
            .attr("id", "effectSizeText")
            .attr("fill", "black")
            .text("Effect size: " + type)
            .attr("class", "effectSize");
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

function drawParameter(DF, parameter)
{
    var resultsCanvas = d3.select("#resultsCanvas");
    
    var type = testResults["parameter-type"];
    
    var X = resultsPanelWidth/4;
    var Y = 3*significanceTestResultStep;
    
    if(type == "cS")
    {
        var mainText = resultsCanvas.append("text")
                .attr("x", X)
                .attr("y", Y)
                .attr("font-size", fontSizeSignificanceTestResults + "px")
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
                    .attr("font-size", fontSizeSignificanceTestResults + "px")
                    .attr("text-anchor", "middle")
                    .attr("fill", "#627bf4")
                    .attr("class", "parameter")
                    .text(type + "(" + DF + ") = " + parameter);
        }
        else
        {
            resultsCanvas.append("text")
                .attr("x", X)
                .attr("y", Y)
                .attr("text-anchor", "middle")
                .attr("font-size", fontSizeSignificanceTestResults + "px")
                .attr("fill", "#627bf4")
                .attr("class", "parameter")
                .text(type + " = " + parameter);
        }
    }
}    

function drawComputingResultsImage()
{
    // var resultsPanel = d3.select("#resultsPanel");
    
    // var computingResultsText = resultsPanel.append("text")
    //                                         .attr("x", resultsPanelWidth/2)
    //                                         .attr("y", resultsPanelHeight/2 - computingResultsImageSize/2)
    //                                         .text("SELECTING THE APPROPRIATE TEST...")
    //                                         .attr("font-size", scaleForWindowSize(14) + "px")
    //                                         .attr("text-anchor", "middle")
    //                                         .attr("id", "computingResultsImage");
    
    // computingResultsText.transition().duration(750).attr("opacity", "0.35");
    // computingResultsText.transition().delay(750).duration(750).attr("opacity", "1.0");
    
    // setInterval(function()
    // {
    //     computingResultsText.transition().duration(750).attr("opacity", "0.35");
    //     computingResultsText.transition().delay(750).duration(750).attr("opacity", "1.0");
    // }, 1500);
}

function setOpacityForElementsWithClassNames(classNames, opacity)
{
    for(var i=0; i<classNames.length(); i++)
    {
        d3.selectAll("." + classNames[i]).transition().duration(1000).delay(500).attr("opacity", opacity);
    }
}

//Significance Tests
function loadAssumptionCheckList(type)
{
    var assumptionsCanvas = d3.select("#assumptionsCanvas");
    var timeOut = 1200;

    if(sessionStorage.plotWithNoInteraction == "false")
    {
        var title = assumptionsCanvas.append("text")
                                    .attr("x", assumptionsPanelWidth/2)
                                    .attr("y", fontSizeAssumptionsTitle + yAxisTickTextOffset)
                                    .attr("font-size",  fontSizeAssumptionsTitle + "px")
                                    .attr("text-anchor", "start")
                                    .attr("opacity", "0")
                                    .attr("fill", "#627bf4")
                                    .text("Assumptions for statistical test: ")
                                    .attr("class", "checkingAssumptions");

        title.transition().delay(500).duration(700).attr("opacity", "1.0").attr("x", 25);
    }
    else
    {
        timeOut = 0;
        var title = assumptionsCanvas.append("text")
                                    .attr("x", 25)
                                    .attr("y", fontSizeAssumptionsTitle + yAxisTickTextOffset)
                                    .attr("font-size",  fontSizeAssumptionsTitle + "px")
                                    .attr("text-anchor", "start")
                                    .attr("opacity", "1.0")
                                    .attr("fill", "#627bf4")
                                    .text("ASSUMPTIONS")
                                    .attr("class", "checkingAssumptions");
    }
        
    //timer for 500 ms
    setTimeout(function(){
        for(var i=0; i<assumptions[type].length(); i++)
        {
            assumptionsCanvas.append("rect")
                    .attr("x", assumptionImageSize*2 - scaleForWindowSize(15)) 
                    .attr("y", (i*1 + 1.10) * assumptionsPanelHeight/3)
                    .attr("width", assumptionsPanelWidth/2 - 1.5*assumptionImageSize)
                    .attr("height", assumptionImageSize)
                    .attr("rx", "5px")
                    .attr("ry", "5px")
                    .attr("fill", "url(#buttonFillNormal)")
                    .attr("filter", "url(#Bevel)")
                    .attr("stroke", "black")
                    .attr("id", assumptions[type][i])
                    .attr("class", "assumptionsButtonBack");
                    
            assumptionsCanvas.append("text")
                    .attr("x", assumptionImageSize*2) 
                    .attr("y", (i*1 + 1.10) * assumptionsPanelHeight/3 + assumptionImageSize/2)
                    .attr("font-size", fontSizeAssumptions + "px")
                    .attr("fill", "black")
                    .text(assumptionsText[assumptions[type][i]])
                    .attr("id", assumptions[type][i])
                    .attr("class", "assumptions");

            assumptionsCanvas.append("text")
                    .attr("x", assumptionsPanelWidth) 
                    .attr("y", (i*1 + 1.10) * assumptionsPanelHeight/3 + assumptionImageSize/2)
                    .attr("font-size", fontSizeTicks + "px")
                    .attr("fill", "green")
                    .attr("text-anchor", "end")
                    .text("The appropriate test has been chosen to compensate for this violation")
                    .attr("id", assumptions[type][i])
                    .attr("display", "none")
                    .attr("class", "assumptionsViolationText");

                
            assumptionsCanvas.append("image")
                    .attr("x", scaleForWindowSize(15))
                    .attr("y", (i*1 + 1.10) * assumptionsPanelHeight/3)
                    .attr("text-anchor", "end")
                    .attr("xlink:href", "images/checkingAssumptions.gif")
                    .attr("height", assumptionImageSize)            
                    .attr("width", assumptionImageSize)
                    .attr("id", assumptions[type][i])
                    .attr("class", "loading");
                
            assumptionsCanvas.append("image")
                    .attr("x", scaleForWindowSize(15))
                    .attr("y", (i*1 + 1.10) * assumptionsPanelHeight/3)
                    .attr("text-anchor", "end")
                    .attr("xlink:href", "images/tick.png")
                    .attr("height", assumptionImageSize)            
                    .attr("width", assumptionImageSize)
                    .attr("display", "none")
                    .attr("id", assumptions[type][i])
                    .attr("class", "ticks");
                         
            assumptionsCanvas.append("image")
                    .attr("x", scaleForWindowSize(15))
                    .attr("y", (i*1 + 1.10) * assumptionsPanelHeight/3)
                    .attr("text-anchor", "end")
                    .attr("xlink:href", "images/cross.png")
                    .attr("height", assumptionImageSize)
                    .attr("width", assumptionImageSize)
                    .attr("display", "none")
                    .attr("id", assumptions[type][i])
                    .attr("class", "crosses");
                
            assumptionsCanvas.append("rect")
                    .attr("x", assumptionImageSize*2 - scaleForWindowSize(15)) 
                    .attr("y", (i*1 + 1.10) * assumptionsPanelHeight/3)
                    .attr("width", assumptionsPanelWidth/2 - 1.5*assumptionImageSize)
                    .attr("height", assumptionImageSize)
                    .attr("rx", "5px")
                    .attr("ry", "5px")
                    .attr("opacity", "0.1")
                    .attr("id", assumptions[type][i])
                    .attr("class", "assumptionsButtonFront");                    
        }    
    }, timeOut); 

    assumptionsCanvas.append("text")
                    .attr("x", assumptionsPanelWidth) 
                    .attr("y", assumptionsPanelHeight/2 + assumptionImageSize/2)
                    .attr("font-size", fontSizeTicks + "px")
                    .attr("fill", "green")
                    .attr("text-anchor", "end")
                    .text("The appropriate test has been chosen to compensate for these violations")
                    .attr("id", "bothAssumptions")
                    .attr("display", "none")
                    .attr("class", "assumptionsViolationText");   
    
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
        
    var centerX = mean.attr("cx");   
    
    
    normalityPlotWidth = widthOfEachBox*1.5;
    normalityPlotHeight = 0.75*normalityPlotWidth;

    makeHistogramWithDensityCurve(centerX - normalityPlotWidth/2, plotPanelHeight + normalityPlotOffset, normalityPlotWidth, normalityPlotHeight, dependentVariable, level, type);//left, top, histWidth, histHeight, dependentVariable, level;
}

function drawScales(cx, cy)
{
    //get number of means
    var yMin = Array.min(cy);
    var yMax = Array.max(cy);
    
    var canvas = d3.select("#plotCanvas");    
    var x = plotPanelWidth/2 + plotWidth/2 + significanceTestScaleOffset + scaleForWindowSize(5);
    
    var variableList = getSelectedVariables();
    var means = [];
    
    var levels = variableList["independent-levels"]; 

    for(var i=0; i<cy.length(); i++)
    {
        means.push(getActualValue(cy[i]));
    }
    
    means = means.sort(function(a,b){return a-b});
    cy = cy.sort(function(a,b){return b-a});
    
    var cyMax = Math.max.apply(Math, cy);
    var cyMin = Math.min.apply(Math, cy);		   	 
    
    canvas.append("text")
                .attr("x", x + scaleForWindowSize(35))
                .attr("y", (yMin + yMax)/2)
                .attr("fill", "black")
                .attr("font-size", scaleForWindowSize(14) + "px")
                .attr("id", "tickText")
                .attr("class", "differenceInMeansMain")
                .text(dec2(means[means.length()-1] - means[0]));
    
    var error = parseFloat(testResults["error"]);     
    testResults["CI"] = calculateCI(means[means.length() -1] - means[0], error);

    var meanValue = getActualValue(cyMin);
    var dependentVariable = variables[variableList["dependent"][0]]["dataset"];
    var dependentVariableMin = Array.min(dependentVariable);
    var dependentVariableMax = Array.max(dependentVariable);

    var lowerCI = meanValue - error;
    var upperCI = meanValue + error;

    if(lowerCI < dependentVariableMin)
    {
        lowerCI = dependentVariableMin;
    }

    if(upperCI > dependentVariableMax)
    {
        upperCI = dependentVariableMax;
    }
    
    var BOTTOM = plotPanelHeight/2 + plotHeight/2;
    //CI for mean
    canvas.append("line")
            .attr("x1", plotPanelWidth/2 + plotWidth/2 + 15)
            .attr("y1", BOTTOM - getFraction(lowerCI)*plotHeight)
            .attr("x2", plotPanelWidth/2 + plotWidth/2 + 15)
            .attr("y2", BOTTOM - getFraction(upperCI)*plotHeight)
            .attr("stroke", "rosybrown")
            .attr("stroke-width", "4")
            .attr("id", "center")
            .attr("class", "CIMean");
        
    canvas.append("line")
            .attr("x1", plotPanelWidth/2 + plotWidth/2 + 10)
            .attr("y1", BOTTOM - getFraction(lowerCI)*plotHeight)
            .attr("x2", plotPanelWidth/2 + plotWidth/2 + 20)
            .attr("y2", BOTTOM - getFraction(lowerCI)*plotHeight)
            .attr("stroke", "rosybrown")
            .attr("stroke-width", "4")
            .attr("id", "bottom")
            .attr("class", "CIMean");
        
    canvas.append("line")
            .attr("x1", plotPanelWidth/2 + plotWidth/2 + 10)
            .attr("y1", BOTTOM - getFraction(upperCI)*plotHeight)
            .attr("x2", plotPanelWidth/2 + plotWidth/2 + 20)
            .attr("y2", BOTTOM - getFraction(upperCI)*plotHeight)
            .attr("stroke", "rosybrown")
            .attr("stroke-width", "4")
            .attr("id", "top")
            .attr("class", "CIMean");
    
    if(cy.length() >= 2)
    {
        for(var i=0; i<cy.length()-1; i++)
        {  
            if(cy.length() > 2)
            {
                canvas.append("text")
                    .attr("x", x + scaleForWindowSize(5))
                    .attr("y", (parseFloat(cy[i]) + parseFloat(cy[i+1]))/2 + yAxisTickTextOffset)
                    .attr("fill", "black")
                    .attr("font-size", fontSizeTicks)
                    .attr("id", "DIM" + i)
                    .attr("class", "differenceInMeansText")
                    .attr("display", "none")
                    .text(dec2(means[i+1] - means[i]));
            }
                
            canvas.append("line")
                .attr("x1", x-5)
                .attr("y1", cy[i])
                .attr("x2", x)
                .attr("y2", cy[i])
                .attr("stroke", "black")
                .attr("stroke-width", scaleForWindowSize(3) + "px")
                .attr("id", "DIM" + i)
                .attr("class", "differenceInMeans");       
            
            canvas.append("line")
                .attr("x1", x-5)
                .attr("y1", cy[i+1])
                .attr("x2", x)
                .attr("y2", cy[i+1])
                .attr("stroke", "black")
                .attr("stroke-width", scaleForWindowSize(3) + "px")
                .attr("id", "DIM" + i)
                .attr("class", "differenceInMeans"); 
            
            canvas.append("line")
                .attr("x1", x)
                .attr("y1", cy[i])
                .attr("x2", x)
                .attr("y2", cy[i+1])
                .attr("stroke", "black")
                .attr("stroke-width", scaleForWindowSize(5) + "px")
                .attr("id", "DIM" + i)
                .attr("class", "differenceInMeans");       
        }           
    }
}

function displayOneSampleTestResults()
{        
    var cx = [];
    var cy = [];

    removeElementsByClassName("significanceTest");
    if(document.getElementById("computingResultsImage") != null)
        removeElementById("computingResultsImage");
    
    var means = document.getElementsByClassName("means");
    var medians = document.getElementsByClassName("medians");
    var meanRefLines = [];
    
    var RIGHT = plotPanelWidth/2 + plotWidth/2;
    var BOTTOM = plotPanelHeight/2 + plotHeight/2;
    
    var canvas = d3.select("#plotCanvas");
    
    if(testResults["type"] == "mean")
    {       
        canvas.append("line")
            .attr("x1", RIGHT)
            .attr("y1", BOTTOM - getFraction(testResults["estimate"])*plotHeight)
            .attr("x2", plotPanelWidth/2-plotWidth/2-axesOffset)
            .attr("y2", BOTTOM - getFraction(testResults["estimate"])*plotHeight)
            .attr("stroke", "green")
            .attr("id", "estimateLine")
            .attr("class", "differenceInMeans");
        
        canvas.append("line")
            .attr("x1", RIGHT)
            .attr("y1", BOTTOM - getFraction(sessionStorage.popMean)*plotHeight)
            .attr("x2", plotPanelWidth/2-plotWidth/2-axesOffset)
            .attr("y2", BOTTOM - getFraction(sessionStorage.popMean)*plotHeight)
            .attr("stroke", "red")
            .attr("id", "populationLine")
            .attr("class", "differenceInMeans");
            
        cy.push(BOTTOM - getFraction(testResults["estimate"])*plotHeight);
        cy.push(BOTTOM - getFraction(sessionStorage.popMean)*plotHeight);
    }
    else
    {
        canvas.append("line")
                .attr("x1", RIGHT)
                .attr("y1", BOTTOM - getFraction(testResults["estimate"])*plotHeight)
                .attr("x2", plotPanelWidth/2-plotWidth/2-axesOffset)
                .attr("y2", BOTTOM - getFraction(testResults["estimate"])*plotHeight)
                .attr("stroke", "green")
                .attr("id", "estimateLine")
                .attr("class", "differenceInMeans");
        
        canvas.append("line")
                .attr("x1", RIGHT)
                .attr("y1", BOTTOM - getFraction(sessionStorage.popMedian)*plotHeight)
                .attr("x2", plotPanelWidth/2-plotWidth/2-axesOffset)
                .attr("y2", BOTTOM - getFraction(sessionStorage.popMedian)*plotHeight)
                .attr("stroke", "red")
                .attr("id", "populationLine")
                .attr("class", "differenceInMeans");
                
        cy.push(BOTTOM - getFraction(testResults["estimate"])*plotHeight);
        cy.push(BOTTOM - getFraction(sessionStorage.popMedian)*plotHeight);
    }
    
    
    
    var cyMax = Math.max.apply(Math, cy);
    var cyMin = Math.min.apply(Math, cy);		   	 

    var differenceLine = canvas.append("line")
                            .attr("x1", plotPanelWidth/2 + plotWidth/2)
                            .attr("y1", cyMin)
                            .attr("x2", plotPanelWidth/2 + plotWidth/2)
                            .attr("y2", cyMax)
                            .attr("stroke", "red")
                            .attr("stroke-width", "2px")
                            .attr("class", "differenceInMeans");


    var x = plotPanelWidth/2 + plotWidth/2;
    var y = cyMin;			 
    var head = canvas.append("path")
                  .attr("d", "M " + x + " " + y + " L " + (x-5)+ " " + (y+5) + " L " + (x+5) + " " + (y+5) + " z")
                  .attr("stroke", "red")
                  .attr("fill", "red")
                  .attr("class", "differenceInMeans");

    sideBar = d3.select("#sideBarCanvas");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", plotPanelHeight/2 + significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", plotPanelHeight/2 + 2*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text(testResults["statistic"])
            .attr("class", "significanceTest");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", plotPanelHeight/2 + 3*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text(testResults["p"])
            .attr("class", "significanceTest");
    
    
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"]));
//     sideBar.append("text")
//             .attr("x", sideBarWidth/2)
//             .attr("y", plotPanelHeight/2 - significanceTestResultStep)
//             .attr("text-anchor", "middle")
//             .attr("font-size", "24px")
//             .attr("fill", "#627bf4")
//             .text(testResults["effect-size"])
//             .attr("class", "significanceTest");
}
  
function displaySignificanceTestResults()
{        
    var cx = [];
    var cy = [];
    
    removeElementsByClassName("significanceTest");
    if(document.getElementById("computingResultsImage") != null)
        removeElementById("computingResultsImage");
    
    var means = document.getElementsByClassName("means");

    var meanRefLines = [];
    
    var canvas = d3.select("#plotCanvas");

    for(var i=0; i<means.length(); i++)
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
                            .attr("stroke", "red")
                            .attr("stroke-width", "2px")
                            .attr("class", "differenceInMeans");


    var x = plotPanelWidth/2 + plotWidth/2;
    var y = cyMin;			 
    var head = canvas.append("path")
                  .attr("d", "M " + x + " " + y + " L " + (x-5)+ " " + (y+5) + " L " + (x+5) + " " + (y+5) + " z")
                  .attr("stroke", "red")
                  .attr("fill", "red")
                  .attr("class", "differenceInMeans");
    
    drawScales(cx, cy);     
    
    var resultsCanvas = d3.select("#resultsCanvas");
    
    resultsCanvas.append("text")
            .attr("x", resultsPanelWidth/2)
            .attr("y", 1.5*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text("Statistical test: " + testResults["method"])
            .attr("class", "significanceTest");
    
    drawParameter(testResults["df"], parseFloat(testResults["parameter"]));
    
    resultsCanvas.append("text")
            .attr("x", 3*resultsPanelWidth/4)
            .attr("y", 3*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text(testResults["p"])
            .attr("class", "significanceTest");
    
    
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"]));
    
    // resultsCanvas.append("rect")
    //                 .attr("x", scaleForWindowSize(10))
    //                 .attr("y", 3.0*significanceTestResultStep)
    //                 .attr("height", 7.5*significanceTestResultStep)
    //                 .attr("width", sidePanelWidth - scaleForWindowSize(10)*2)
    //                 .attr("rx", "5px")
    //                 .attr("ry", "5px")
    //                 .attr("stroke", "grey")
    //                 .attr("stroke-dasharray", "5,5")
    //                 .attr("fill", "none")
    //                 .attr("id", "border");

    //save reporting text for ANOVAs so that it can be displayed again for post-hoc tests
      var testType = testResults["test-type"];
      if (testType == "owA" || testType == "kwT" || testType == "WA" || testType == "owrA" || testType == "fT")
            resultsFromANOVA = getReportingText(testType);
}

function displayANOVAResults()
{        
    var cx = [];
    var cy = [];
    
    removeElementsByClassName("significanceTest");
    if(document.getElementById("computingResultsImage") != null)
        removeElementById("computingResultsImage");
    
    var means = document.getElementsByClassName("means");

    var meanRefLines = [];
    
    var canvas = d3.select("#plotCanvas");

    for(var i=0; i<means.length(); i++)
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
                                 .attr("stroke", "black")
                                 .attr("stroke-dasharray","5,5")
                                 .attr("id", "meanrefLine")
                                 .attr("class", "differenceInMeans");
                                 
                            canvas.append("line")
                                 .attr("x1", means[i].getAttribute("cx"))
                                 .attr("y1", means[i].getAttribute("cy"))
                                 .attr("x2", plotPanelWidth/2 - plotWidth/2 - axesOffset)
                                 .attr("y2", means[i].getAttribute("cy"))
                                 .attr("stroke", "black")
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
                            .attr("stroke", "red")
                            .attr("stroke-width", "2px")
                            .attr("class", "differenceInMeans");

    var x = plotPanelWidth/2 + plotWidth/2;
    var y = cyMin;			 
    var head = canvas.append("path")
                  .attr("d", "M " + x + " " + y + " L " + (x-5)+ " " + (y+5) + " L " + (x+5) + " " + (y+5) + " z")
                  .attr("stroke", "red")
                  .attr("fill", "red")
                  .attr("class", "differenceInMeans");
    
    drawScales(cx, cy);     
    
    var resultsCanvas = d3.select("#resultsCanvas");
   
    var variableList = getSelectedVariables();
    
    var levels = [variableList["independent"][0], variableList["independent"][1], variableList["independent"][0] + "-" + variableList["independent"][1]];
   
    var tabWidth = resultsPanelWidth/(levels.length());    
    var tabHeight = scaleForWindowSize(25);
    var fontSizeTabText = scaleForWindowSize(12);
    
    var currentX = scaleForWindowSize(25);
    
    //construct the tabs

    for(var i=0; i<levels.length(); i++)
    {
        tabWidth = levels[i].length()*fontSizeTabText/1.6;
        resultsCanvas.append("rect")
                .attr("x", currentX)
                .attr("y", 0)
                .attr("width", tabWidth)
                .attr("height", tabHeight)
                .attr("stroke","black")
                .attr("fill", "url(#buttonFillNormal)")
                .attr("id", levels[i])                
                .attr("data-index", i)
                .attr("class", "effectButtonBack");
        
        resultsCanvas.append("text")
                .attr("x", currentX + tabWidth/2)
                .attr("y", tabHeight/2)
                .attr("text-anchor", "middle")
                .attr("font-size", fontSizeTabText + "px")
                .attr("fill", "black")
                .attr("id", levels[i])
                .text(levels[i])
                .attr("class", "effectButtonText");  
        
        resultsCanvas.append("rect")
                .attr("x", currentX)
                .attr("y", 0)
                .attr("width", tabWidth)
                .attr("height", tabHeight)
                .attr("stroke","black")
                .attr("opacity", "0.1")
                .attr("fill", "url(#buttonFillNormal)")
                .attr("id", levels[i])
                .attr("class", "effectButtonFront");
                      
        currentX = parseFloat(currentX) + parseFloat(tabWidth);
        
        if(i == 0)
        {
            d3.select("#" + levels[i] + ".effectButtonBack")
                .attr("stroke", "none")
                .attr("fill", "url(#buttonFillSelected)");
            
            d3.select("#" + levels[i] + ".effectButtonText")
                .attr("fill", "white");
        }
    }   
    

    
    //drawing
    resultsCanvas.append("text")
            .attr("x", resultsPanelWidth/2)
            .attr("y", 1.5*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text("Statistical test: " + testResults["method"])
            .attr("class", "significanceTest");

    
    
    //things that change for each effect
    drawParameter(testResults["df"][0], parseFloat(testResults["parameter"][0]));
    
    resultsCanvas.append("text")
            .attr("x", 3*resultsPanelWidth/4)
            .attr("y", 3*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text(testResults["p"][0])
            .attr("class", "significanceTest");
    
    
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"][0]));
}

function displayCorrelationResults()
{     
    var resultsCanvas = d3.select("#resultsCanvas");
    
    if(document.getElementById("computingResultsImage") != null)
        removeElementById("computingResultsImage");
    
    resultsCanvas.append("text")
            .attr("x", resultsPanelWidth/2)
            .attr("y", 1.5*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text("Statistical test: " + testResults["method"])
            .attr("class", "significanceTest");
    
    resultsCanvas.append("text")
            .attr("x", resultsPanelWidth/4)
            .attr("y", 3*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text(testResults["statistic"])
            .attr("class", "significanceTest");
    
    resultsCanvas.append("text")
            .attr("x", 3*resultsPanelWidth/4)
            .attr("y", 3*significanceTestResultStep)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text(testResults["p"])
            .attr("class", "significanceTest");    
    
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"])); 
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
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text("Statistical test: " + testResults["method"])
            .attr("class", "significanceTest");
    
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"])); 
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
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"]));
 
    var plot = d3.select("#plotCanvas");
    
    plot.append("text")
            .attr("x", plotPanelWidth/2)
            .attr("y", plotPanelHeight + 2*axesOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", scaleForWindowSize(24) + "px")
            .attr("fill", "#627bf4")
            .text(testResults["equation"])
            .attr("id", "equation")
            .attr("class", "significanceTest");
    
    //make div tag at the bottom of the page
    var DIVTag = d3.select("body").append("div").attr("class", "regressionPredictionDiv");
        
    DIVTag.attr("style", "position: absolute; left: " + (width - plotPanelWidth - sideBarWidth) + "px; top: " + (plotPanelHeight - bottomDivHeight) + "px; height: " + (bottomDivHeight) + "px; width: " + plotPanelWidth + "px");    
    var table = DIVTag.append("table").attr("border", "1").attr("id", "regressionPredictionTable").attr("align", "center");
    
    //predictor variable
    var tr = table.append("tr");
    
    tr.append("td").append("label")
                .text(currentVariableSelection[0] + ":");
    tr.append("td").append("input")
                .attr("type", "text")
                .attr("placeholder", "<Enter value here>") 
                .attr("onchange", "calculateOutcome()")
                .attr("id", "value_" + currentVariableSelection[0]);
    
    //outcome variable
    tr = table.append("tr");
    
    tr.append("td").append("label")
                .text(currentVariableSelection[1] + ":");
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
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"]));
 
    var plot = d3.select("#plotCanvas");
    
    plot.append("text")
            .attr("x", plotPanelWidth/2)
            .attr("y", 3*plotHeight/4)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text(testResults["equation"])
            .attr("id", "equation")
            .attr("class", "significanceTest"); 
    
    //make div tag at the bottom of the page
    var DIVTag = d3.select("body").append("div").attr("class", "regressionPredictionDiv");
        
    DIVTag.attr("style", "position: absolute; left: " + (width - plotPanelWidth - sideBarWidth) + "px; top: " + (plotPanelHeight - bottomDivHeight) + "px; height: " + (bottomDivHeight) + "px; width: " + plotPanelWidth + "px");    
    var table = DIVTag.append("table").attr("border", "1").attr("id", "regressionPredictionTable").attr("align", "center");
    
    var outcomeVariable = testResults["outcomeVariable"];
    var explanatoryVariables = testResults["explanatoryVariables"];
    
    for(var i=0; i<explanatoryVariables.length(); i++)
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

function meanSelectionHelper()
{
    // var meanCircle = d3.selectAll("#" + target.id + ".means");    
// 
//     if(document.getElementsByClassName("means").length() == 1)
//     {
//         //if there is only mean (one sample tests)
//         if(meanCircle.attr("fill") == meanColors["hover"])
//         {
//             meanCircle.attr("fill", meanColors["click"]);
// //                 compareMeans();
//         }
//         else
//         {
//             meanCircle.attr("fill", meanColors["normal"]);
//         }
//     }
//     else if(document.getElementsByClassName("completeLines").length() < (document.getElementsByClassName("means").length() - 1))
//     {
//         //if there are 2+ means            
//         meanCircle.attr("fill", meanColors["click"]);
// 
//         //check if we are finishing an incomplete line here
//         if(document.getElementsByClassName("incompleteLines").length() > 0)
//         {
//             var incompleteLines = d3.selectAll(".incompleteLines");
// 
//             incompleteLines.attr("x2", meanCircle.attr("cx"))
//                            .attr("y2", meanCircle.attr("cy"))
//                            .attr("stroke", meanColors["click"])
//                            .attr("class", "completeLines");
//                        
//             removeElementsByClassName("indicator");
//             var canvas = d3.select("#plotCanvas");                                             
//         }
//         var means = document.getElementsByClassName("means");
//     
//         if(document.getElementsByClassName("completeLines").length() < (document.getElementsByClassName("means").length() - 1))
//         {
//             var canvas = d3.select("#plotCanvas");
// 
//             canvas.append("line")
//                     .attr("x1", meanCircle.attr("cx"))
//                     .attr("y1", meanCircle.attr("cy"))
//                     .attr("x2", meanCircle.attr("cx"))
//                     .attr("y2", meanCircle.attr("cy"))
//                     .attr("stroke", meanColors["normal"])
//                     .attr("stroke-dasharray", "5,5")
//                     .attr("id", meanCircle.attr("id"))
//                     .attr("class", "incompleteLines");
//         }
//         else
//         {
//             //we are done
// //                 compareMeans();
//         }
//     }   
    setCompareNowButtonText();
}

function drawNavigator(STATES)
{
    var navigatorHeight = scaleForWindowSize(50);
    var arrowHeadLength = scaleForWindowSize(15);
    
    var canvas = d3.select("#plotCanvas");
    var stateWidth = (plotPanelWidth-sideBarWidth)/(STATES.length() - 1);
    
    for(i=0; i<STATES.length(); i++)
    {
        var x = i*stateWidth;
        var y = 0;
        
        canvas.append("path")
                .attr("d", "M " + (x) + " " + y + " L " + (x + stateWidth) + " " + y + " L " + (x + stateWidth + arrowHeadLength) + " " + (y + navigatorHeight/2) + " L " + (x + stateWidth) + " " + (y + navigatorHeight) + " L " + (x) + " " + (y + navigatorHeight) + " L " + (x + arrowHeadLength) + " " + (y + navigatorHeight/2) + " L " + (x) + " " + (y) + " z")
                .attr("stroke", "black")
                .attr("fill", "url(#buttonFillNormal)")
                .attr("filter", "url(#Bevel)")
                .attr("id", STATES[i])
                .attr("class", "stateForNavigation");
        
        canvas.append("text")
                .attr("x", x + stateWidth/2)
                .attr("y", navigatorHeight/2 - scaleForWindowSize(5))
                .attr("fill", "black")
                .attr("text-anchor", "middle")
                .text(STATES[i])
                .attr("id", STATES[i])
                .attr("class", "stateForNavigationText");
    }
}

function displayToolTips()
{
    var variablePanelCanvas = d3.select("#variablePanelSVG");

    var fontSizeToolTips = scaleForWindowSize(16) + "px";

    var variablePanel = d3.select("#variable.panel");                
    var variablePanelWidth = removeAlphabetsFromString(variablePanel.style("width"));
    var variableNameHolderWidth = variablePanelWidth - 2*variableNameHolderPadding;  

    var radiusForRoundedRect = scaleForWindowSize(10) + "px";                                      

    var variablePanelBorder = variablePanelCanvas.append("rect")
                                    .attr("x", variableNameHolderPadding/2)
                                    .attr("y", variableNameHolderPadding/2)
                                    .attr("width", variableNameHolderWidth - variableTypeSelectionButtonWidth + variableNameHolderPadding)
                                    .attr("height", variableNames.length() * (variableNameHolderHeight + variableNameHolderPadding))
                                    .attr("rx", radiusForRoundedRect)
                                    .attr("ry", radiusForRoundedRect)
                                    .attr("fill","none")
                                    .attr("stroke", "#3957F1")
                                    .attr("stroke-dasharray","3,3")
                                    .attr("class","toolTips");

    variablePanelCanvas.append("rect")
                        .attr("x", variableNameHolderPadding/2)
                        .attr("y", variableNames.length() * (variableNameHolderHeight + variableNameHolderPadding) + 3*variableNameHolderPadding)
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
                        .attr("style", "position: absolute; left: " + variableNameHolderPadding + "px; top: " + (variableNames.length() * (variableNameHolderHeight + variableNameHolderPadding) + 4*variableNameHolderPadding) + "px; width: " + (variableNameHolderWidth - 3*variableNameHolderPadding/2) + "px; color: white; text-align: center; font-size: " + fontSizeToolTips + ";");

    variablePanelCanvas.append("line")
                        .attr("x1", variableNameHolderWidth/2)
                        .attr("y1", variableNames.length() * (variableNameHolderHeight + variableNameHolderPadding) + variableNameHolderPadding/2)
                        .attr("x2", variableNameHolderWidth/2)
                        .attr("y2", variableNames.length() * (variableNameHolderHeight + variableNameHolderPadding) + 3*variableNameHolderPadding)
                        .attr("stroke", "#3957F1")
                        .attr("stroke-dasharray", "3,3")
                        .attr("class", "toolTips");


    var variableTypeSelectionBorder = variablePanelCanvas.append("rect")
                                            .attr("x", variableNameHolderWidth - variableTypeSelectionButtonWidth + 2*variableNameHolderPadding - variableNameHolderPadding/3)
                                            .attr("y", variableNameHolderPadding/2)
                                            .attr("height", variableNames.length() * (variableNameHolderHeight + variableNameHolderPadding))
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
                        .attr("y", variableNames.length() * (variableNameHolderHeight + variableNameHolderPadding)/2 - variableNameHolderHeight*1.75/2)
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
                        .attr("style", "position: absolute; left: " + (parseFloat(variablePanelWidth) + 4*variableNameHolderPadding) + "px; top: " + (variableNames.length() * (variableNameHolderHeight + variableNameHolderPadding)/2 - variableNameHolderHeight*1.75/2 + variableNameHolderPadding) + "px; width: " + (variableNameHolderWidth - variableNameHolderPadding/2) + "px; color: white; text-align: center; font-size: " + fontSizeToolTips + ";");

    variablePanelCanvas.append("line")
                    .attr("x1", variableTypeSelectionButtonWidth/1.5 + variableNameHolderPadding + variableNameHolderWidth - variableTypeSelectionButtonWidth + 2*variableNameHolderPadding - variableNameHolderPadding/3)
                    .attr("y1", variableNames.length() * (variableNameHolderHeight + variableNameHolderPadding)/2)
                    .attr("x2", variablePanelWidth)
                    .attr("y2", variableNames.length() * (variableNameHolderHeight + variableNameHolderPadding)/2)
                    .attr("stroke", "#3957F1")
                    .attr("stroke-dasharray", "3,3")
                    .attr("class", "toolTips");
                
    plotCanvas.append("line")
                .attr("x1", 0)
                .attr("y1", variableNames.length() * (variableNameHolderHeight + variableNameHolderPadding)/2)
                .attr("x2", 3*variableNameHolderPadding)
                .attr("y2", variableNames.length() * (variableNameHolderHeight + variableNameHolderPadding)/2)
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

function showResetButton()
{
    d3.select(".resetButtonBack").attr("display", "inline");
    d3.select(".resetButtonImage").attr("display", "inline");
}

function hideResetButton()
{
    var resetButtonElements = d3.selectAll(".resetButtonBack, .resetButtonImage");

    resetButtonElements.attr("display", "none");
}

function initiateLoadingDatasetAnimation()
{
    freezeMouseEvents = true;
    
    var canvas = d3.select("#plotCanvas");
    
    if(document.getElementsByClassName("loadingAnimation").length() > 0)
            removeElementsByClassName("loadingDataset");
            
    canvas.append("text")
        .attr("x", plotPanelWidth/2)
        .attr("y", plotPanelHeight/2)
        .attr("text-anchor", "middle")
        .attr("font-size", "25px")
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

    
