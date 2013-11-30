//drawing
function resetSVGCanvas()
{
    removeElementsByClassName("regressionPredictionDiv");
    
    if(document.getElementById("plotCanvas") != null)
        removeElementById("plotCanvas");
            
    var plotCanvas = d3.select("#canvas").append("svg");
        
    plotCanvas.attr("id", "plotCanvas")
              .attr("x", 0)
              .attr("y", 0)
              .attr("height", canvasHeight)
              .attr("width", canvasWidth)
              .attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight);
    
    if(document.getElementById("sideBarCanvas") != null)
        removeElementById("sideBarCanvas");
            
    var plotCanvas = d3.select("#sideBar").append("svg");
        
    plotCanvas.attr("id", "sideBarCanvas")
              .attr("x", 0)
              .attr("y", 0)
              .attr("height", canvasHeight)
              .attr("width", sideBarWidth)
              .attr("viewBox", "0 0 " + sideBarWidth + " " + canvasHeight);
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

function drawButtonInSideBar(buttonText, className, offset)
{
    if(offset == undefined)
        offset = 1;
        
    var canvas = d3.select("#sideBarCanvas");
    
    canvas.append("rect")
            .attr("x", scaleForWindowSize(10))
            .attr("y", offset*buttonOffset)
            .attr("width", sideBarWidth - scaleForWindowSize(10)*2)
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
            .attr("y", offset*buttonOffset + buttonHeight/2 + yAxisTickTextOffset)
            .attr("text-anchor", "middle")
            .text(buttonText)
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
            .attr("fill", "#5a4c29")
            .attr("id", "regression")
            .attr("class", "dialogBox");
    
    canvas.append("text")
            .attr("x", centerX)
            .attr("y", centerY - dialogBoxHeight/4)
            .attr("fill", "white")
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
                .attr("fill", panelColors["normal"])
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
            .attr("fill", "#5a4c29")
            .attr("id", "regression")
            .attr("class", "dialogBox");
    
    var LEFT = (width - canvasWidth - sideBarWidth) + centerX - dialogBoxWidth/2;
    var TOP = centerY - dialogBoxHeight/2;
    
    var divElement = d3.select("body").append("div").attr("style", "position: absolute; left: " + LEFT + "px; top: " + TOP + "px; height: " + dialogBoxHeight + "px; width: " + dialogBoxWidth + "px;").attr("class", "dialogBox");
    
    var inText = d3.select("#normality.crosses").attr("display") == "inline" ? "POPULATION MEDIAN = " : "POPULATION MEAN = ";
    
    divElement.append("label")
                .attr("align", "center")
                .attr("vertical-align", "middle")
                .attr("style", "font:1.2em \"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif; color: white;")
                .text(inText);
    divElement.append("input")
                .attr("type", "text")
                .attr("placeholder", "<Enter value>")
                .attr("id", "populationValue");
    
    divElement.append("input")
                .attr("type", "button")
                .attr("onclick", "populationMeanEntered()")
                .attr("align", "center")
                .attr("value","TEST");
    
}   

function drawEffectSize(value)
{
    var sideBar = d3.select("#sideBarCanvas");
    
    var type = testResults["effect-size-type"];
    console.log("type = " + type);
    
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
    
    var effectSize = sideBar.append("rect")
                                .attr("x", L + scale(0))
                                .attr("y", canvasHeight/2 - significanceTestResultOffset - effectSizeHeight/2)
                                .attr("width", scale(min + (value - 0)))
                                .attr("height", effectSizeHeight)
                                .attr("fill", color)
                                .attr("class", "effectSize");
    
    if(scale(min + (value - 0)) > effectSizeWidth/6)
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

function drawParameter(value)
{
    console.log("drawing...");
    var sideBar = d3.select("#sideBarCanvas");
    
    var type = testResults["parameter-type"];
    console.log("type = " + type);
    
    var X = sideBarWidth/2;
    var Y = canvasHeight/2 + 2*significanceTestResultOffset;
    
    if(type == "cS")
    {
        var mainText = sideBar.append("text")
                .attr("x", X)
                .attr("y", Y)
                .attr("font-size", fontSizeSignificanceTestResults + "px")
                .attr("text-anchor", "middle")
                .attr("fill", "#627bf4");
            
        mainText.append("tspan")
                    .text("𝝌");
        
        mainText.append("tspan")
                    .attr("baseline-shift", "super")
                    .text("2");
        
        mainText.append("tspan")
                    .text("(" + testResults["df"] + ") = " + testResults["parameter"]);
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
                    .text(type + "(" + testResults["df"] + ") = " + testResults["parameter"]);
        }
        else
        {
            sideBar.append("text")
                .attr("x", X)
                .attr("y", Y)
                .attr("text-anchor", "middle")
                .attr("font-size", fontSizeSignificanceTestResults + "px")
                .attr("fill", "#627bf4")
                .text(type + " = " + testResults["parameter"]);
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
    
