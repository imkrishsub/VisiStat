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

function plotVisualisation()
{   
    resetSVGCanvas();
    drawFullScreenButton();
    
    console.log(currentVisualisationSelection);
    
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

function resetSVGCanvas()
{
    removeElementsByClassName("regressionPredictionDiv");
    removeElementsByClassName("dialogBox");
    
    if(document.getElementById("plotCanvas") != null)
        removeElementById("plotCanvas");
    if(document.getElementById("sideBarCanvas") != null)
        removeElementById("sideBarCanvas");
            
    var plotCanvas = d3.select("#canvas").append("svg");        
    plotCanvas.attr("id", "plotCanvas")
              .attr("x", 0)
              .attr("y", 0)
              .attr("height", canvasHeight)
              .attr("width", canvasWidth)
              .attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
            
    var sideBarCanvas = d3.select("#sideBar").append("svg");        
    sideBarCanvas.attr("id", "sideBarCanvas")
              .attr("x", 0)
              .attr("y", 0)
              .attr("height", canvasHeight)
              .attr("width", sideBarWidth)
              .attr("viewBox", "0 0 " + sideBarWidth + " " + canvasHeight);
              
//     sideBarCanvas.append("image")
//                     .attr("x", sideBarWidth - 3*(helpButtonWidth + helpButtonOffset))
//                     .attr("y", helpButtonOffset/4)
//                     .attr("width", sideBarWidth)
//                     .attr("height", helpButtonHeight)
//                     .attr("xlink:href", "images/leather.png");
    
    drawHelpButton();
    drawBackButton();
}

function drawFullScreenButton()
{
//     var canvas = d3.select("#sideBarCanvas");
//     
//     canvas.append("image")
//                 .attr("x", canvas.attr("width") - (fullScreenButtonSize + fullScreenButtonOffset))
//                 .attr("y", 0)
//                 .attr("xlink:href", "images/fullscreennormal.png")
//                 .attr("height", fullScreenButtonSize)
//                 .attr("width", fullScreenButtonSize)
//                 .attr("style", "opacity: 1.0;")
//                 .attr("class", "fullscreen");
}

function drawHelpButton()
{
    var sideBar = d3.select("#sideBarCanvas");
    
    sideBar.append("rect")
            .attr("x", sideBarWidth - helpButtonWidth - helpButtonOffset)
            .attr("y", helpButtonOffset/2)//canvasHeight - helpButtonHeight - helpButtonOffset)
            .attr("rx", "15px")
            .attr("ry", "15px")
            .attr("height", helpButtonHeight)
            .attr("width", helpButtonWidth)
            .attr("fill", "url(#bannerFill)")
            .attr("filter", "url(#Bevel)")
            .attr("stroke", "black")
            .attr("class", "helpButtonBack");
    
    sideBar.append("text")
            .attr("x", sideBarWidth - helpButtonWidth/2 - helpButtonOffset)
            .attr("y", helpButtonOffset/2 + 2*helpButtonHeight/3)//canvasHeight - helpButtonHeight/3 - helpButtonOffset)
            .attr("font-size", scaleForWindowSize(32))
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .text("?")
            .attr("class", "helpButtonText");
    
    sideBar.append("rect")
            .attr("x", sideBarWidth - helpButtonWidth - helpButtonOffset)
            .attr("y", helpButtonOffset/2)//canvasHeight - helpButtonHeight - helpButtonOffset)
            .attr("rx", "15px")
            .attr("ry", "15px")
            .attr("height", helpButtonHeight)
            .attr("width", helpButtonWidth)
            .attr("opacity", "0.1")
            .attr("class", "helpButtonFront");
}

function drawBackButton()
{
    var sideBar = d3.select("#sideBarCanvas");
    var helpButtonHeight = scaleForWindowSize(50);
    var helpButtonWidth = scaleForWindowSize(50);
    
    var helpButtonOffset = assumptionImageSize;
    
    var offset = 2;
    
    sideBar.append("rect")
            .attr("x", sideBarWidth - offset*(helpButtonWidth + helpButtonOffset))
            .attr("y", helpButtonOffset/2)//canvasHeight - helpButtonHeight - helpButtonOffset)
            .attr("rx", "15px")
            .attr("ry", "15px")
            .attr("height", helpButtonHeight)
            .attr("width", helpButtonWidth)
            .attr("fill", "url(#bannerFill)")
            .attr("filter", "url(#Bevel)")
            .attr("stroke", "black")
            .attr("class", "backButtonBack");
    
    sideBar.append("text")
            .attr("x", sideBarWidth - offset*(helpButtonWidth + helpButtonOffset) + helpButtonWidth/2)
            .attr("y", helpButtonOffset/2 + 2*helpButtonHeight/3)//canvasHeight - helpButtonHeight/3 - helpButtonOffset)
            .attr("font-size", scaleForWindowSize(32))
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .text("<")
            .attr("class", "backButtonText");
    
    sideBar.append("rect")
            .attr("x", sideBarWidth - offset*(helpButtonWidth + helpButtonOffset))
            .attr("y", helpButtonOffset/2)//canvasHeight - helpButtonHeight - helpButtonOffset)
            .attr("rx", "15px")
            .attr("ry", "15px")
            .attr("height", helpButtonHeight)
            .attr("width", helpButtonWidth)
            .attr("opacity", "0.1")
            .attr("class", "backButtonFront");
}

function drawButtonInSideBar(buttonText, className, offset)
{
    if(offset == undefined)
        offset = 0;
        
    var canvas = d3.select("#sideBarCanvas");
    
    canvas.append("rect")
            .attr("x", assumptionImageSize)
            .attr("y", canvasHeight - buttonOffset + offset*(buttonPadding + buttonHeight))
            .attr("width", sideBarWidth - assumptionImageSize*2)
            .attr("height", buttonHeight)
            .attr("rx", scaleForWindowSize(10) + "px")
            .attr("ry", scaleForWindowSize(10) + "px")
            .attr("fill", "url(#buttonFillNormal)")
            .attr("filter", "url(#Bevel)")
            .attr("stroke", "black")
            .attr("id", "button")
            .attr("class", className);
    
    canvas.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight - buttonOffset + offset*(buttonPadding + buttonHeight) + buttonHeight/2 + yAxisTickTextOffset)
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
    
    var centerX = canvasWidth/2;
    var centerY = canvasHeight/2;
    
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
            
    var step = (dialogBoxHeight/2)/currentVariableSelection.length;
    var yStart = centerY;
    var buttHeight = step - 10;
    
    for(var i=0; i<currentVariableSelection.length; i++)
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

function drawDialogBoxToGetPopulationMean()
{
    var canvas = d3.select("#plotCanvas");
    
    var dialogBoxHeight = plotHeight/2;
    var dialogBoxWidth = plotWidth/2;
    
    var centerX = canvasWidth/2;
    var centerY = canvasHeight/2;
    
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
    
    var LEFT = (width - canvasWidth - sideBarWidth) + centerX - dialogBoxWidth/2;
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
    var sideBar = d3.select("#sideBarCanvas");
    
    var type = testResults["effect-size-type"];
    
    if(type == "d")
        value = value > 3.0 ? 3.0 : value;
    
    var min = parseFloat(effectSizeMins[type]);
    var max = parseFloat(effectSizeMaxs[type]);
    value = parseFloat(value);
    
    var color = getColour(type, value);
    
    var L = sideBarWidth/2 - effectSizeWidth/2;
    var T = canvasHeight/2 - significanceTestResultOffset - effectSizeHeight/2;
    
    var bar = sideBar.append("rect")
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
    
    if(scale(min + (value - 0)) > 0)
    {
        var effectSize = sideBar.append("rect")
                                    .attr("x", L + scale(0))
                                    .attr("y", T)
                                    .attr("width", scale(min + (value - 0)))
                                    .attr("height", effectSizeHeight)
                                    .attr("fill", color)
                                    .attr("class", "effectSize");
    }
    else
    {
        console.log("negative effect size value");
        var effectSize = sideBar.append("rect")
                                    .attr("x", L + scale(0) + scale(min + (value - 0)))
                                    .attr("y", T)
                                    .attr("width", -scale(min + (value - 0)))
                                    .attr("height", effectSizeHeight)
                                    .attr("fill", color)
                                    .attr("class", "effectSize");
    }
    
    if(Math.abs(scale(min + (value - 0))) > effectSizeWidth/4)
    {    
        sideBar.append("text")
                .attr("x", L + scale(0) + scale(min + (value - 0)) - yAxisTickTextOffset)
                .attr("y", canvasHeight/2 - significanceTestResultOffset + effectSizeHeight/2 - yAxisTickTextOffset)
                .attr("text-anchor", "end")
                .attr("font-size", effectSizeFontSize)
                .attr("fill", "white")
                .text(value)
                .attr("class", "effectSize");
    }
    else
    {
        sideBar.append("text")
                .attr("x", L + scale(0) + scale(min + (value - 0)) + yAxisTickTextOffset)
                .attr("y", canvasHeight/2 - significanceTestResultOffset + effectSizeHeight/2 - yAxisTickTextOffset)
                .attr("text-anchor", "start")
                .attr("font-size", effectSizeFontSize)
                .attr("fill", "black")
                .text(value)
                .attr("class", "effectSize");
    }
    
    sideBar.append("text")
            .attr("x", L + scale(min))
            .attr("y", T + 3*effectSizeHeight/2)
            .attr("text-anchor", "start")
            .attr("font-size", effectSizeFontSize)
            .attr("fill", "darkgrey")
            .attr("id", "labelMin")
            .attr("class", "effectSize")
            .text(min);
    
    sideBar.append("text")
            .attr("x", L + scale(max))
            .attr("y", T + 3*effectSizeHeight/2)
            .attr("text-anchor", "end")
            .attr("font-size", effectSizeFontSize)
            .attr("fill", "darkgrey")
            .attr("id", "labelMax")
            .attr("class", "effectSize")
            .text(max);
    
    var effectSizeInterpretationIndicators = ["small", "medium", "large"];
            
    for(i=0; i<effectSizeInterpretations[type].length; i++)
    {
        sideBar.append("line")
                .attr("x1", L + scale(effectSizeInterpretations[type][i]))
                .attr("y1", T)
                .attr("x2", L + scale(effectSizeInterpretations[type][i]))
                .attr("y2", T + effectSizeHeight)
                .attr("stroke", "black")
                .attr("class", "effectSizeInterpretationIndicators");
        sideBar.append("text")
                .attr("x", L + scale(effectSizeInterpretations[type][i])
                .attr("y", T - yAxisTickTextOffset)
                .attr("transform", "rotate (-45" + (L + scale(effectSizeInterpretations[type][i])) + " " + (T - yAxisTickTextOffset) + ")")
                .attr("text-anchor", "start")
                .attr("font-size", scaleForWindowSize(14) + "px");
                .text(effectSizeInterpretationIndicators[i])
                .attr("fill", getColor(type, effectSizeInterpretations[type][i]))
                .attr("class", "effectSizeInterpretationIndicators");
    }
    
    if(min < 0)
    {
        sideBar.append("text")
            .attr("x", L + scale(0))
            .attr("y", T + 3*effectSizeHeight/2)
            .attr("text-anchor", "middle")
            .attr("font-size", effectSizeFontSize)
            .attr("fill", "darkgrey")
            .attr("id", "labelMid")
            .attr("class", "effectSize")
            .text(0);
    }
    
    if(type == "eS")
    {    
        var mainText = sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 - significanceTestResultOffset - effectSizeHeight/2 - yAxisTickTextOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", effectSizeFontSize)
            .attr("fill", "black")
            .attr("class", "effectSize");
            
        mainText.append("tspan")
                    .text("η");
        mainText.append("tspan")
                    .attr("baseline-shift", "super")
                    .text("2");
    }
    else if(type == "rS")
    {    
        var mainText = sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 - significanceTestResultOffset - effectSizeHeight/2 - yAxisTickTextOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", effectSizeFontSize)
            .attr("fill", "black")
            .attr("class", "effectSize");
            
        mainText.append("tspan")
                    .text("r");
        mainText.append("tspan")
                    .attr("baseline-shift", "super")
                    .text("2");
    }
    else
    {
        sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 - significanceTestResultOffset - effectSizeHeight/2 - yAxisTickTextOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", effectSizeFontSize)
            .attr("fill", "black")
            .text(type)
            .attr("class", "effectSize");
    }       
}

function drawParameter(DF, parameter)
{
    var sideBar = d3.select("#sideBarCanvas");
    
    var type = testResults["parameter-type"];
    
    var X = sideBarWidth/2;
    var Y = canvasHeight/2 + 2*significanceTestResultOffset;
    
    if(type == "cS")
    {
        var mainText = sideBar.append("text")
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
        if(hasDF[type])
        {
            sideBar.append("text")
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
            sideBar.append("text")
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
    var sideBar = d3.select("#sideBarCanvas");
    
    sideBar.append("image")
            .attr("x", sideBarWidth/2 - computingResultsImageSize/2)
            .attr("y", canvasHeight/2 - computingResultsImageSize/2)
            .attr("xlink:href", "images/checkingAssumptions.gif")
            .attr("height", computingResultsImageSize)
            .attr("width", computingResultsImageSize)
            .attr("id", "computingResultsImage");
}

function setOpacityForElementsWithClassNames(classNames, opacity)
{
    for(var i=0; i<classNames.length; i++)
    {
        d3.selectAll("." + classNames[i]).transition().duration(1000).delay(500).attr("opacity", opacity);
    }
}

//Significance Tests
function loadAssumptionCheckList(type)
{
    var canvas = d3.select("#sideBarCanvas");
    
    var title = canvas.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", assumptionOffsetTop)
            .attr("font-size", fontSizeAssumptionsTitle + "px")
            .attr("text-anchor", "middle")
            .attr("opacity", "0")
            .attr("fill", "#627bf4")
            .text("CHECKING ASSUMPTIONS")
            .attr("class", "checkingAssumptions");
    
    title.transition().delay(500).duration(700).attr("opacity", "1.0").attr("y", assumptionOffsetTop - 50);
    
    //timer for 500 ms
    setTimeout(function(){
        for(var i=0; i<assumptions[type].length; i++)
        {
            canvas.append("rect")
                    .attr("x", assumptionImageSize*1.25) 
                    .attr("y", i*assumptionStep + assumptionOffsetTop - assumptionImageSize/2 - 10)
                    .attr("width", sideBarWidth - 2*assumptionImageSize)
                    .attr("height", assumptionImageSize)
                    .attr("rx", "5px")
                    .attr("ry", "5px")
                    .attr("fill", "url(#buttonFillNormal)")
                    .attr("filter", "url(#Bevel)")
                    .attr("stroke", "black")
                    .attr("id", assumptions[type][i])
                    .attr("class", "assumptionsButtonBack");
                    
            canvas.append("text")
                .attr("x", assumptionImageSize*1.25 + assumptionImageSize/2)
                .attr("y", i*assumptionStep + assumptionOffsetTop - 5)
                .attr("font-size", fontSizeAssumptions + "px")
                .attr("fill", "black")
                .text(assumptionsText[assumptions[type][i]])
                .attr("id", assumptions[type][i])
                .attr("class", "assumptions");
                
            canvas.append("image")
                .attr("x", 0)
                .attr("y", i*assumptionStep + assumptionOffsetTop - assumptionImageSize/2 - 10)
                .attr("text-anchor", "end")
                .attr("xlink:href", "images/checkingAssumptions.gif")
                .attr("height", assumptionImageSize)            
                .attr("width", assumptionImageSize)
                .attr("id", assumptions[type][i])
                .attr("class", "loading");
                
            canvas.append("image")
                .attr("x", 0)
                .attr("y", i*assumptionStep + assumptionOffsetTop - assumptionImageSize/2 - 10)
                .attr("text-anchor", "end")
                .attr("xlink:href", "images/tick.png")
                .attr("height", assumptionImageSize)            
                .attr("width", assumptionImageSize)
                .attr("display", "none")
                .attr("id", assumptions[type][i])
                .attr("class", "ticks");
                         
            canvas.append("image")
                .attr("x", 0)
                .attr("y", i*assumptionStep + assumptionOffsetTop - assumptionImageSize/2 - 8)
                .attr("text-anchor", "end")
                .attr("xlink:href", "images/cross.png")
                .attr("height", assumptionImageSize)
                .attr("width", assumptionImageSize)
                .attr("display", "none")
                .attr("id", assumptions[type][i])
                .attr("class", "crosses");
                
            canvas.append("rect")
                    .attr("x", assumptionImageSize*1.25) 
                    .attr("y", i*assumptionStep + assumptionOffsetTop - assumptionImageSize/2 - 10)
                    .attr("width", sideBarWidth - 2*assumptionImageSize)
                    .attr("height", assumptionImageSize)
                    .attr("rx", "5px")
                    .attr("ry", "5px")
                    .attr("opacity", "0.1")
                    .attr("id", assumptions[type][i])
                    .attr("class", "assumptionsButtonFront");
        }    
    }, 1300);
    
    
}

function drawNormalityPlot(dependentVariable, level, type)
{
    //make histogram with these variables in a separate svg
    removeElementsByClassName("homogeneityPlot");
    removeElementsByClassName("densityCurve");
    
    var mean;
    if(level == "dataset")
        mean = d3.select("#" + dependentVariable + ".means");
    else
        mean = d3.select("#" + getValidId(level) + ".means");
        
    var centerX = mean.attr("cx");   
    
    
    makeHistogramWithDensityCurve(centerX - normalityPlotWidth/2, canvasHeight + normalityPlotOffset, normalityPlotWidth, normalityPlotHeight, dependentVariable, level, type);//left, top, histWidth, histHeight, dependentVariable, level;
}

function drawScales(cx, cy)
{
    //get number of means
    var yMin = Array.min(cy);
    var yMax = Array.max(cy);
    
    var canvas = d3.select("#plotCanvas");    
    var x = canvasWidth/2 + plotWidth/2 + significanceTestScaleOffset;
    
    var variableList = getSelectedVariables();
    var means = [];
    
    var levels = variableList["independent-levels"]; 

    for(var i=0; i<cy.length; i++)
    {
        means.push(getActualValue(cy[i]));
    }
    
    means = means.sort(function(a,b){return a-b});
    cy = cy.sort(function(a,b){return b-a});
    
    canvas.append("text")
                .attr("x", x + scaleForWindowSize(35))
                .attr("y", (yMin + yMax)/2)
                .attr("fill", "black")
                .attr("font-size", scaleForWindowSize(16) + "px")
                .attr("id", "tickText")
                .attr("class", "significanceTest")
                .text(dec2(means[means.length-1] - means[0]));
    
    if(cy.length >= 2)
    {
        for(var i=0; i<cy.length-1; i++)
        {  
            if(cy.length > 2)
            {
                canvas.append("text")
                    .attr("x", x + scaleForWindowSize(5))
                    .attr("y", (parseFloat(cy[i]) + parseFloat(cy[i+1]))/2 + yAxisTickTextOffset)
                    .attr("fill", "black")
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
    
    var RIGHT = canvasWidth/2 + plotWidth/2;
    var BOTTOM = canvasHeight/2 + plotHeight/2;
    
    var canvas = d3.select("#plotCanvas");
    
    if(testResults["type"] == "mean")
    {       
        canvas.append("line")
            .attr("x1", RIGHT)
            .attr("y1", BOTTOM - getFraction(testResults["estimate"])*plotHeight)
            .attr("x2", canvasWidth/2-plotWidth/2-axesOffset)
            .attr("y2", BOTTOM - getFraction(testResults["estimate"])*plotHeight)
            .attr("stroke", "green")
            .attr("id", "estimateLine")
            .attr("class", "significanceTest");
        
        canvas.append("line")
            .attr("x1", RIGHT)
            .attr("y1", BOTTOM - getFraction(sessionStorage.popMean)*plotHeight)
            .attr("x2", canvasWidth/2-plotWidth/2-axesOffset)
            .attr("y2", BOTTOM - getFraction(sessionStorage.popMean)*plotHeight)
            .attr("stroke", "red")
            .attr("id", "populationLine")
            .attr("class", "significanceTest");
            
        cy.push(BOTTOM - getFraction(testResults["estimate"])*plotHeight);
        cy.push(BOTTOM - getFraction(sessionStorage.popMean)*plotHeight);
    }
    else
    {
        console.log("BOTTOM=" + BOTTOM);
        console.log("median=" + sessionStorage.popMedian);
        console.log("plotHeight=" + plotHeight);
    
        canvas.append("line")
                .attr("x1", RIGHT)
                .attr("y1", BOTTOM - getFraction(testResults["estimate"])*plotHeight)
                .attr("x2", canvasWidth/2-plotWidth/2-axesOffset)
                .attr("y2", BOTTOM - getFraction(testResults["estimate"])*plotHeight)
                .attr("stroke", "green")
                .attr("id", "estimateLine")
                .attr("class", "significanceTest");
        
        canvas.append("line")
                .attr("x1", RIGHT)
                .attr("y1", BOTTOM - getFraction(sessionStorage.popMedian)*plotHeight)
                .attr("x2", canvasWidth/2-plotWidth/2-axesOffset)
                .attr("y2", BOTTOM - getFraction(sessionStorage.popMedian)*plotHeight)
                .attr("stroke", "red")
                .attr("id", "populationLine")
                .attr("class", "significanceTest");
                
        cy.push(BOTTOM - getFraction(testResults["estimate"])*plotHeight);
        cy.push(BOTTOM - getFraction(sessionStorage.popMedian)*plotHeight);
    }
    
    
    
    var cyMax = Math.max.apply(Math, cy);
    var cyMin = Math.min.apply(Math, cy);		   	 

    var differenceLine = canvas.append("line")
                            .attr("x1", canvasWidth/2 + plotWidth/2)
                            .attr("y1", cyMin)
                            .attr("x2", canvasWidth/2 + plotWidth/2)
                            .attr("y2", cyMax)
                            .attr("stroke", "red")
                            .attr("stroke-width", "2px")
                            .attr("class", "significanceTest");


    var x = canvasWidth/2 + plotWidth/2;
    var y = cyMin;			 
    var head = canvas.append("path")
                  .attr("d", "M " + x + " " + y + " L " + (x-5)+ " " + (y+5) + " L " + (x+5) + " " + (y+5) + " z")
                  .attr("stroke", "red")
                  .attr("fill", "red")
                  .attr("class", "significanceTest");

    sideBar = d3.select("#sideBarCanvas");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + 2*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["statistic"])
            .attr("class", "significanceTest");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + 3*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["p"])
            .attr("class", "significanceTest");
    
    
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"]));
//     sideBar.append("text")
//             .attr("x", sideBarWidth/2)
//             .attr("y", canvasHeight/2 - significanceTestResultOffset)
//             .attr("text-anchor", "middle")
//             .attr("font-size", "24px")
//             .attr("fill", "orange")
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

    for(var i=0; i<means.length; i++)
    {
        if((means[i].getAttribute("fill") == meanColors["click"]) || (means[i].getAttribute("fill") == "#008000"))
        {
            cx.push(means[i].getAttribute("cx"));
            cy.push(means[i].getAttribute("cy"));
        
            meanRefLines[i] = canvas.append("line")
                                 .attr("x1", means[i].getAttribute("cx"))
                                 .attr("y1", means[i].getAttribute("cy"))
                                 .attr("x2", canvasWidth/2 + plotWidth/2)
                                 .attr("y2", means[i].getAttribute("cy"))
                                 .attr("stroke", "black")
                                 .attr("stroke-dasharray","5,5")
                                 .attr("id", "meanrefLine")
                                 .attr("class", "significanceTest");
                                 
                            canvas.append("line")
                                 .attr("x1", means[i].getAttribute("cx"))
                                 .attr("y1", means[i].getAttribute("cy"))
                                 .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                                 .attr("y2", means[i].getAttribute("cy"))
                                 .attr("stroke", "black")
                                 .attr("opacity", "0.25")
                                 .attr("stroke-dasharray","5,5")
                                 .attr("id", "meanrefLine")
                                 .attr("class", "significanceTest");
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
                            .attr("x1", canvasWidth/2 + plotWidth/2)
                            .attr("y1", cyMin)
                            .attr("x2", canvasWidth/2 + plotWidth/2)
                            .attr("y2", cyMax)
                            .attr("stroke", "red")
                            .attr("stroke-width", "2px")
                            .attr("class", "significanceTest");

    var x = canvasWidth/2 + plotWidth/2;
    var y = cyMin;			 
    var head = canvas.append("path")
                  .attr("d", "M " + x + " " + y + " L " + (x-5)+ " " + (y+5) + " L " + (x+5) + " " + (y+5) + " z")
                  .attr("stroke", "red")
                  .attr("fill", "red")
                  .attr("class", "significanceTest");
    
    drawScales(cx, cy);     
    
    var sideBar = d3.select("#sideBarCanvas");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    
    drawParameter(testResults["df"], parseFloat(testResults["parameter"]));
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + 3*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text(testResults["p"])
            .attr("class", "significanceTest");
    
    
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"]));
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

    for(var i=0; i<means.length; i++)
    {
        if((means[i].getAttribute("fill") == meanColors["click"]) || (means[i].getAttribute("fill") == "#008000"))
        {
            cx.push(means[i].getAttribute("cx"));
            cy.push(means[i].getAttribute("cy"));
        
            meanRefLines[i] = canvas.append("line")
                                 .attr("x1", means[i].getAttribute("cx"))
                                 .attr("y1", means[i].getAttribute("cy"))
                                 .attr("x2", canvasWidth/2 + plotWidth/2)
                                 .attr("y2", means[i].getAttribute("cy"))
                                 .attr("stroke", "black")
                                 .attr("stroke-dasharray","5,5")
                                 .attr("id", "meanrefLine")
                                 .attr("class", "significanceTest");
                                 
                            canvas.append("line")
                                 .attr("x1", means[i].getAttribute("cx"))
                                 .attr("y1", means[i].getAttribute("cy"))
                                 .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                                 .attr("y2", means[i].getAttribute("cy"))
                                 .attr("stroke", "black")
                                 .attr("opacity", "0.25")
                                 .attr("stroke-dasharray","5,5")
                                 .attr("id", "meanrefLine")
                                 .attr("class", "significanceTest");
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
                            .attr("x1", canvasWidth/2 + plotWidth/2)
                            .attr("y1", cyMin)
                            .attr("x2", canvasWidth/2 + plotWidth/2)
                            .attr("y2", cyMax)
                            .attr("stroke", "red")
                            .attr("stroke-width", "2px")
                            .attr("class", "significanceTest");

    var x = canvasWidth/2 + plotWidth/2;
    var y = cyMin;			 
    var head = canvas.append("path")
                  .attr("d", "M " + x + " " + y + " L " + (x-5)+ " " + (y+5) + " L " + (x+5) + " " + (y+5) + " z")
                  .attr("stroke", "red")
                  .attr("fill", "red")
                  .attr("class", "significanceTest");
    
    drawScales(cx, cy);     
    
    var sideBar = d3.select("#sideBarCanvas");
   
    var variableList = getSelectedVariables();
    
    var levels = [variableList["independent"][0], variableList["independent"][1], variableList["independent"][0] + "-" + variableList["independent"][1]];
   
    var tabWidth = sideBarWidth/(levels.length);    
    var tabHeight = scaleForWindowSize(25);
    var fontSizeTabText = scaleForWindowSize(12);
    
    var currentX = 0;
    
    //construct the tabs
    for(var i=0; i<levels.length; i++)
    {
        tabWidth = levels[i].length*fontSizeTabText/1.6;
        sideBar.append("rect")
                .attr("x", currentX)
                .attr("y", canvasHeight/2 - 3*significanceTestResultOffset - tabHeight)
                .attr("width", tabWidth)
                .attr("height", tabHeight)
                .attr("stroke","black")
                .attr("fill", "url(#buttonFillNormal)")
                .attr("id", levels[i])                
                .attr("data-index", i)
                .attr("class", "effectButtonBack");
        
        sideBar.append("text")
                .attr("x", currentX + tabWidth/2)
                .attr("y", canvasHeight/2 - 3*significanceTestResultOffset - tabHeight/2 + yAxisTickTextOffset)
                .attr("text-anchor", "middle")
                .attr("font-size", fontSizeTabText + "px")
                .attr("fill", "black")
                .attr("id", levels[i])
                .text(levels[i])
                .attr("class", "effectButtonText");  
        
        sideBar.append("rect")
                .attr("x", currentX)
                .attr("y", canvasHeight/2 - 3*significanceTestResultOffset - tabHeight)
                .attr("width", tabWidth)
                .attr("height", tabHeight)
                .attr("stroke","black")
                .attr("opacity", "0.1")
                .attr("fill", "url(#buttonFillNormal)")
                .attr("id", levels[i])
                .attr("class", "effectButtonFront");
                      
        currentX += tabWidth;
        
        if(i == 0)
        {
            d3.select("#" + levels[i] + ".effectButtonBack")
                .attr("stroke", "none")
                .attr("fill", "url(#buttonFillSelected)");
            
            d3.select("#" + levels[i] + ".effectButtonText")
                .attr("fill", "white");
        }
    }   
    
    sideBar.append("rect")
                    .attr("x", 0)
                    .attr("y", canvasHeight/2 - 3*significanceTestResultOffset)
                    .attr("height", 7*significanceTestResultOffset)
                    .attr("width", sideBarWidth - scaleForWindowSize(10)*2)
                    .attr("rx", "5px")
                    .attr("ry", "5px")
                    .attr("stroke", "grey")
                    .attr("stroke-dasharray", "5,5")
                    .attr("fill", "none")
                    .attr("id", "border");
    
    //drawing
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "#627bf4")
            .text(testResults["method"])
            .attr("class", "significanceTest");

    
    
    //things that change for each effect
    drawParameter(testResults["df"][0], parseFloat(testResults["parameter"][0]));
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + 3*significanceTestResultOffset)
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
    var sideBar = d3.select("#sideBarCanvas");
    
    if(document.getElementById("computingResultsImage") != null)
        removeElementById("computingResultsImage");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + 2*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["statistic"])
            .attr("class", "significanceTest");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + 3*significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["p"])
            .attr("class", "significanceTest");
    
    
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"]));
//     sideBar.append("text")
//             .attr("x", sideBarWidth/2)
//             .attr("y", canvasHeight/2 - significanceTestResultOffset)
//             .attr("text-anchor", "middle")
//             .attr("font-size", "24px")
//             .attr("fill", "orange")
//             .text(testResults["effect-size"])
//             .attr("class", "significanceTest");
 
}

function displayBiserialCorrelationResults()
{       
    var sideBar = d3.select("#sideBarCanvas");
    
    if(document.getElementById("computingResultsImage") != null)
        removeElementById("computingResultsImage");
    
    sideBar.append("text")
            .attr("x", sideBarWidth/2)
            .attr("y", canvasHeight/2 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["method"])
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
            .attr("y", canvasHeight/2 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"]));
 
    var plot = d3.select("#plotCanvas");
    
    plot.append("text")
            .attr("x", canvasWidth/2)
            .attr("y", canvasHeight + 2*axesOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["equation"])
            .attr("class", "significanceTest");
    
    //make div tag at the bottom of the page
    var DIVTag = d3.select("body").append("div").attr("class", "regressionPredictionDiv");
        
    DIVTag.attr("style", "position: absolute; left: " + (width - canvasWidth - sideBarWidth) + "px; top: " + (canvasHeight - bottomDivHeight) + "px; height: " + (bottomDivHeight) + "px; width: " + canvasWidth + "px");    
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
            .attr("y", canvasHeight/2 + significanceTestResultOffset)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["method"])
            .attr("class", "significanceTest");
    //Effect sizes
    drawEffectSize(parseFloat(testResults["effect-size"]));
 
    var plot = d3.select("#plotCanvas");
    
    plot.append("text")
            .attr("x", canvasWidth/2)
            .attr("y", 3*plotHeight/4)
            .attr("text-anchor", "middle")
            .attr("font-size", fontSizeSignificanceTestResults + "px")
            .attr("fill", "orange")
            .text(testResults["equation"])
            .attr("class", "significanceTest"); 
    
    //make div tag at the bottom of the page
    var DIVTag = d3.select("body").append("div").attr("class", "regressionPredictionDiv");
        
    DIVTag.attr("style", "position: absolute; left: " + (width - canvasWidth - sideBarWidth) + "px; top: " + (canvasHeight - bottomDivHeight) + "px; height: " + (bottomDivHeight) + "px; width: " + canvasWidth + "px");    
    var table = DIVTag.append("table").attr("border", "1").attr("id", "regressionPredictionTable").attr("align", "center");
    
    var outcomeVariable = testResults["outcomeVariable"];
    var explanatoryVariables = testResults["explanatoryVariables"];
    
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

function meanSelectionHelper()
{
    // var meanCircle = d3.selectAll("#" + target.id + ".means");    
// 
//     if(document.getElementsByClassName("means").length == 1)
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
//     else if(document.getElementsByClassName("completeLines").length < (document.getElementsByClassName("means").length - 1))
//     {
//         //if there are 2+ means            
//         meanCircle.attr("fill", meanColors["click"]);
// 
//         //check if we are finishing an incomplete line here
//         if(document.getElementsByClassName("incompleteLines").length > 0)
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
//         if(document.getElementsByClassName("completeLines").length < (document.getElementsByClassName("means").length - 1))
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

    
