function OnMouseDown(e)
{
    if (e == null) 
        e = window.event; 

    var target = e.target != null ? e.target : e.srcElement;
   
    if(!freezeMouseEvents)
    {        
        if(help)
        {            
            if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "helpButtonFront"))
            {
                var helpButton = d3.select(".helpButtonBack");
                var helpButtonText = d3.select(".helpButtonText");
                
                helpButton.attr("fill", "url(#buttonFillNormal)")
                            .attr("filter", "url(#Bevel)")
                            .attr("stroke", "black");
            
                helpButtonText.attr("fill", "black");
                removeElementById("descriptionPanel");
                
                removeElementsByClassName("plot");
                removeElementsByClassName("plotHelp");
                removeElementsByClassName("pValueHelp");
                removeElementsByClassName("testStatisticHelp");
                removeElementsByClassName("methodHelp");
                removeElementsByClassName("effectSizeHelp");
                removeElementsByClassName("variancePlotWidth");
                removeElementsByClassName("normalityPlotHelp");
            }
            else if((e.button == 1 && window.event != null || e.button == 0) && (target.id == "historyButtonFront"))
            {
                setup(e, target);

                var helpButtonFront = d3.select("#helpButtonFront.sideCanvasButtons");
                var helpButtonBack = d3.select("#helpButtonBack.sideCanvasButtons");
                var helpButtonText = d3.select("#helpButtonText.sideCanvasButtonTexts");

                var historyButtonFront = d3.select("#historyButtonFront.sideCanvasButtons");
                var historyButtonBack = d3.select("#historyButtonBack.sideCanvasButtons");
                var historyButtonText = d3.select("#historyButtonText.sideCanvasButtonTexts");              
                
                // Do something only when help mode is currently not activated
                if(historyButtonBack.attr("fill") == "#f8f9f7")
                {
                    help = false;
                    
                    historyButtonBack.attr("fill", "#627bf4")
                                     .attr("stroke", "none")
                                     .attr("y", tabTopSelected);
                    historyButtonText.attr("fill", "white")
                                     .attr("y", parseFloat(sideCanvasButtonHeight/2) + parseFloat(tabTopSelected)/2);                    
                    historyButtonFront.attr("y", tabTopSelected);

                    helpButtonBack.attr("fill", "#f8f9f7")
                                  .attr("stroke", "black")
                                  .attr("y", tabTopUnselected);
                    helpButtonText.attr("fill", "black")
                                  .attr("y", parseFloat(sideCanvasButtonHeight/2) + parseFloat(tabTopUnselected)/2);                    
                    helpButtonFront.attr("y", tabTopUnselected);  

                    // Remove border from the button panel in the bottom (to stretch the border down)
                    d3.select("#reportButtonPanel").attr("style", "position: absolute; left: " + (variablesPanelWidth + assumptionsPanelWidth) + "px; top: " + (sidePanelHeight - sideCanvasButtonHeight) + "px; height: " + sideCanvasButtonHeight + "px; width: " + sidePanelWidth + "px; overflow: hidden;");                 
                    d3.select("#sidePanel").attr("style", "position: absolute; left: " + (variablesPanelWidth + assumptionsPanelWidth) + "px; top: " + sideCanvasButtonHeight + "px; height: " + (sidePanelHeight - 2*sideCanvasButtonHeight) + "px; width: " + sidePanelWidth + "px; overflow: auto; border-style: solid; border-color: #627bf4; border-width: " + borderWidth + "px;");

                    // Set all historyEntry displays to inline
                    d3.selectAll(".historyEntryBoundingBox").attr("display", "inline");

                    // ToDo: remove help panel to reveal history panel
                    removeElementById("helpPanel");
                    removeElementsByClassName("plot");
                    removeElementsByClassName("plotHelp");
                    removeElementsByClassName("pValueHelp");
                    removeElementsByClassName("testStatisticHelp");
                    removeElementsByClassName("methodHelp");
                    removeElementsByClassName("effectSizeHelp");
                    removeElementsByClassName("variancePlotWidth");
                    removeElementsByClassName("normalityPlotHelp");
                }                
            }
        }
        else
        {
            if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "statisticalTestNodes")) // When the user clicks on a statistical test in the decision tree
            {
                setup(e, target);

                var node = d3.select("#" + target.id + ".statisticalTestNodes");
                var testName, colour; 

                // If not current test
                if(node.attr("cursor") == "pointer")
                {
                    // Get the name of the statistical test
                    testName = node.attr("id");
                    colour = node.attr("fill");

                    console.log("Test name: [" + testName + "]");

                    // Do test (clear current test)
                    $("#resultsCanvas").empty();
                    $("#buttonCanvas").empty();

                    // Move focus back to test screen
                    removeElementsByClassName("decisionTreeBackButton");
                    removeElementById("decisionTreeDiv");                   

                    usedMultiVariateTestType = colour == "green" ? "proper" : (colour == "yellow") ? "warning" : "error";
                    doStatisticalTest(testName);    
                }                
            }
            else if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "effectPlotRects"))
            {
                setup(e, target);

                var rect = d3.select("#" + target.id + ".effectPlotRects");

                if(rect.attr("stroke") == "none") // If the rect is not already selected
                {
                    d3.selectAll(".effectPlotRects")
                        .attr("fill", "white")
                        .attr("opacity", "0.01")
                        .attr("stroke", "none");                        

                    rect.attr("fill", "lightgrey")
                        .attr("opacity", "0.25")
                        .attr("stroke", "black")
                        .attr("stroke-width", strokeWidth["selected effect"]);

                    var index = rect.attr("data-index");
                    var effectType = rect.attr("data-type");

                    // Show the results
                    displayEffectResults(effects[effectType][index], effectType);
                    flashTestsResults();
                }
            }
            else if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "navigationArrowEffects"))
            {
                setup(e, target);

                var effect = target.id;

                if(document.getElementById("effectsPlotPanel") != null)
                    removeElementById("effectsPlotPanel");

                drawEffects(effect);
            }
            else if((e.button == 1 && window.event != null || e.button == 0) && ((target.className.baseVal == "clickablesButton") || (target.className.baseVal == "clickablesText")))
            {
                setup(e, target);

                var button = d3.select("#" + target.id + ".clickablesButton");
                var text = d3.select("#" + target.id + ".clickablesText");

                if(button.attr("fill") == "white")
                {
                    d3.selectAll(".clickablesButton").attr("fill", "white");
                    d3.selectAll(".clickablesText").attr("fill", "black");

                    button.attr("fill", "lightgrey");
                    text.attr("fill", "white");

                    var level = button.attr("id");
                    if(level.split("_")[0] == "ValidNow")
                        level = level.slice(level.indexOf("_")+1);

                    console.log("level from data attribute = " + level);

                    $("*[data-animate]").attr("opacity", "0.2");

                    $('*[data-animate=' + level + ']').attr("opacity", "1.0");
                }
            }
            else if((e.button == 1 && window.event != null || e.button == 0) && (target.id == "statisticalTestName"))
            {
                setup(e, target);                

                d3.select("#statisticalTestName.assumptionNodes").attr("text-decoration", "none"); // remove underline
                d3.selectAll(".assumptionsText").attr("fill", "black"); // reset text color for assumptions 

                // remove entities in results panel
                if(document.getElementById("postHocResultsPanel") != null) 
                    removeElementById("postHocResultsPanel");

                if(document.getElementById("effectsPlotPanel") != null)
                {
                    var margin = 10;
                    d3.select("#effectsPlotPanel").attr("style", "position: absolute; left: " + (variablesPanelWidth + margin) + "px; top: " + assumptionsPanelHeight + "px; width: " + (plotPanelWidth - 2*margin) + "px; height: " + (height - resultsPanelHeight - assumptionsPanelHeight) + "px; background-color: #fff; display: inline;");
                }

                // reset the viewbox of the plotCanvas
                d3.select("#plotCanvas").attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight);

                // change the appearance of texts
                d3.select("#statisticalTestName.assumptionNodes").attr("text-decoration", "none");
                d3.select("#postHocTestName.assumptionNodes").attr("text-decoration", "underline");

                // remove post-hoc results
                removeElementsByClassName("postHocComparisonTableClickableCells");
                removeElementsByClassName("postHocComparisonTableCells");
                removeElementsByClassName("inactivePostHocComparisonCells");
                removeElementsByClassName("postHocComparisonTable");
            }
            else if((e.button == 1 && window.event != null || e.button == 0) && (target.id == "postHocTestName"))
            {
                setup(e, target);                
                
                d3.selectAll(".assumptionsText").attr("fill", "black"); // reset text color for assumptions 

                // remove post-hoc results
                removeElementsByClassName("postHocComparisonTableClickableCells");
                removeElementsByClassName("postHocComparisonTableCells");
                removeElementsByClassName("inactivePostHocComparisonCells");
                removeElementsByClassName("postHocComparisonTable");

                // remove entities in results panel
                if(document.getElementById("postHocResultsPanel") != null) 
                    removeElementById("postHocResultsPanel");

                if(document.getElementById("effectsPlotPanel") != null)
                {
                    var margin = 10;
                    d3.select("#effectsPlotPanel").attr("style", "position: absolute; left: " + (variablesPanelWidth + margin) + "px; top: " + assumptionsPanelHeight + "px; width: " + (plotPanelWidth - 2*margin) + "px; height: " + (height - resultsPanelHeight - assumptionsPanelHeight) + "px; background-color: #fff; display: inline;");
                }

                // reset the viewbox of the plotCanvas
                d3.select("#plotCanvas").attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight);

                // change the appearance of texts
                d3.select("#statisticalTestName.assumptionNodes").attr("text-decoration", "underline");
                d3.select("#postHocTestName.assumptionNodes").attr("text-decoration", "none");

                // shrink the visualization
                d3.select("#plotCanvas").attr("viewBox", "0 0 " + (plotPanelWidth*1.67) + " " + plotPanelHeight).attr("preserveAspectRatio", "xMidYMid meet");                

                // determine the appropriate pairwise post-hoc test (default => all pairs)
                doPostHocTests();                
                
                // remove normality/homogeneity plot
                removeElementsByClassName("densityCurve");
                removeElementsByClassName("homogeneityPlot");
            }
            
            else if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "postHocComparisonTableClickableCells"))
            {
                setup(e, target);   // TODO(Krishna): do we need setup() here?
                onClickPostHocCell(e, target);
            }

            else if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "postHocComparison"))
            {
                setup(e, target);

                // shrink the visualization
                d3.select("#plotCanvas").attr("viewBox", "0 0 " + (plotPanelWidth*1.67) + " " + plotPanelHeight).attr("preserveAspectRatio", "xMidYMid meet");

                // add entry to decision tree on top
                addEntryToDecisionTreeNodes();

                // determine the appropriate pairwise post-hoc test (default => all pairs)
                var postHocTestType = doPostHocTests();

                // remove button and help text
                removeElementsByClassName("postHocComparison");

                if(document.getElementById("refText") != null) removeElementById("refText");

                // remove normality/homogeneity plot
                removeElementsByClassName("densityCurve");
                removeElementsByClassName("homogeneityPlot");

                // Change appearance of statistical test
                d3.select("#statisticalTestName.assumptionNodes").attr("text-decoration", "underline");
                d3.select("#postHocTestName.assumptionNodes").attr("text-decoration", "none");
            }

            else if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "assumptionNodes"))
            {
                setup(e, target);

                var node = d3.select("#" + target.id + ".assumptionNodes");
                var nodeText = d3.select("#" + target.id + ".assumptionsText");

                if((target.id == "normality") || (target.id == "homogeneity"))
                    handleAssumptions(nodeText);
            }

            else if((e.button == 1 && window.event != null || e.button == 0) && (target.id == "moreText"))
            {
                setup(e, target);
                onClickPosthocMoreText(e, target);
            }

            else if((e.button == 1 && window.event != null || e.button == 0) && (target.id == "lessText"))
            {
                setup(e, target);
                onClickPosthocLessText(e, target);
            }

            else if((e.button == 1 && window.event != null || e.button == 0) && (target.id == "advancedPlotButtonFront"))
            {
                setup(e, target);

                var advancedPlotButtonFront = d3.selectAll("#advancedPlotButtonFront.advancedPlotButton");
                var advancedPlotButtonBack = d3.selectAll("#advancedPlotButtonBack.advancedPlotButton");
                var advancedPlotButtonText = d3.selectAll("#advancedPlotButtonText.advancedPlotButton");                

                advancedPlotButtonBack.attr("fill", "url(#buttonFillSelected)").attr("filter", "none").attr("stroke", "none");                
                advancedPlotButtonText.attr("fill", "white");

                // determine assumption type 
                var assumptionType = document.getElementsByClassName("densityCurve").length == 0 ? "homogeneity" : "normality";                                

                advancedPlotButtonBack.attr("x", advancedPlotButtonOffset)
                                        .attr("fill", "url(#buttonFillNormal)")
                                        .attr("filter", "url(#Bevel)")
                                        .attr("stroke", "black")
                                        .attr("id", "advancedPlotBackButtonBack");

                advancedPlotButtonFront.attr("x", advancedPlotButtonOffset).attr("id", "advancedPlotBackButtonFront");

                advancedPlotButtonText.attr("x", advancedPlotButtonOffset + advancedPlotButtonWidth/2)            
                                        .attr("fill", "black")
                                        .text("Back");        

                var variableList = getSelectedVariables();    
                
                var dependentVariable = variableList["dependent"][0];
                var levels = variableList["independent-levels"];
                var independentVariables = variableList["independent"];

                if (assumptionType == "normality")
                {
                    drawQQPlots(dependentVariable, levels);
                }
                else
                {
                    var canvasID = "residualPlot";
                    var residualPlotWidth = plotPanelWidth*0.35;
                    var residualPlotHeight = plotPanelHeight*0.25;                   

                    d3.select("#plotPanel").append("div")
                                            .attr("id", canvasID)
                                            .attr("style", "position: absolute; left: " + (plotPanelWidth/2 - residualPlotWidth/2) + "px; top: " + (plotPanelHeight - 1.5*residualPlotHeight) + "px; width: " + residualPlotWidth + "px; height: " + residualPlotHeight + "px;");

                    drawResidualPlot(dependentVariable, independentVariables, "#" + canvasID);       
                }
            }

            else if((e.button == 1 && window.event != null || e.button == 0) && (target.id == "advancedPlotBackButtonFront"))
            {
                setup(e, target);

                var advancedPlotBackButtonFront = d3.selectAll("#advancedPlotBackButtonFront");
                var advancedPlotBackButtonBack = d3.selectAll("#advancedPlotBackButtonBack");
                var advancedPlotBackButtonText = d3.selectAll("#advancedPlotBackButtonText");                

                advancedPlotBackButtonBack.attr("fill", "url(#buttonFillSelected)").attr("filter", "none").attr("stroke", "none");                
                advancedPlotBackButtonText.attr("fill", "white");

                removeElementsByClassName("qqPlots");

                if(document.getElementById("residualPlot") != null)
                    removeElementById("residualPlot");               

                // ToDo: draw the old plots
                var assumptionType = document.getElementsByClassName("densityCurve").length == 0 ? "homogeneity" : "normality";       

                if(assumptionType == "normality")
                {
                    removeElementsByClassName("densityCurve");
                    var homogeneityText = d3.select("#homogeneity.assumptionsText");                                           
                    
                    homogeneityText.attr("fill", "black");

                    var variableList = getSelectedVariables();
            
                    var dependentVariable = variableList["dependent"][0];

                    d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + scaledPlotPanelHeight);
                    drawAdvancedPlotButton();

                    for(var i=0; i<variableList["independent-levels"].length; i++)
                    {   
                        if(distributions[dependentVariable][variableList["independent-levels"][i]] == false)
                        {   
                            //draw boxplots in red 
                            drawBoxPlotInRed(variableList["independent-levels"][i]);
                            drawNormalityPlot(dependentVariable, variableList["independent-levels"][i], "notnormal");
                        }
                        else
                        {                                                
                            drawNormalityPlot(dependentVariable, variableList["independent-levels"][i], "normal");
                        }
                    }
                }    
                else
                {
                    var normalityText = d3.select("#normality.assumptionsText");                                           
                                            
                    normalityText.attr("fill", "black");
                                        
                    var variableList = sort(selectedVariables);
            
                    var dependentVariable = variableList["dependent"][0];
                    
                    var homogeneity = d3.select("#homogeneity.assumptionNodes").attr("fill") == "green" ? true : false;

                    d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + scaledPlotPanelHeight);
                    drawAdvancedPlotButton();

                    for(var i=0; i<variableList["independent"].length; i++)
                    {
                        drawHomogeneityPlot(homogeneity);                                           
                    }
                }
            }

            else if((e.button == 1 && window.event != null || e.button == 0) && (target.id == "settingsButtonFront"))
            {
                setup(e, target);

                var settingsButtonBack = d3.select("#settingsButtonBack");

                if(settingsButtonBack.attr("fill") == "url(#buttonFillNormal)")
                {
                    settingsButtonBack.attr("fill", "url(#buttonFillSelected)").attr("filter", "none");               

                    var decisionTreeDiv = d3.select("body").append("div")                                                            
                                                            .attr("id", "decisionTreeDiv")
                                                            .attr("style", "position: absolute; left: " + (variablesPanelWidth + borderWidth) + "px; top: 0px; width: " + (plotPanelWidth - borderWidth) + "px; height: " + height + "px; background-color: #FFF");

                    var decisionTreeCanvas = d3.select("#decisionTreeDiv").append("svg")    
                                                                            .attr("x", 0)
                                                                            .attr("y", 0)
                                                                            .attr("width", plotPanelWidth)
                                                                            .attr("height", height)
                                                                            .attr("id", "decisionTreeCanvas");                

                    var canvas = Snap("#decisionTreeCanvas");                          

                    var variableList = getSelectedVariables();

                    if(document.getElementById("postHocTestName") != null)
                    {
                        plotDecisionTree(canvas, decisionTreePostHocTests);
                        drawFooter();
                    }
                    else if(variableList["independent"].length > 1)
                        plotDecisionTree(canvas, decisionTree2OrMoreIndependentVariables);
                    else if(variableList["independent-levels"].length > 2)
                        plotDecisionTree(canvas, decisionTree3OrMoreLevels);
                    else
                        plotDecisionTree(canvas, decisionTree2Levels);

                    highlightPath(canvas);

                    settingsButtonBack.attr("fill", "url(#buttonFillNormal)").attr("filter", "url(#Bevel)");

                    // Back button to get back to the plot

                    drawButton("Back", "decisionTreeBackButton", 50, 50, "decisionTreeCanvas");                    
                }            
            }

            else if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "decisionTreeBackButton"))
            {
                setup(e, target);

                removeElementsByClassName("decisionTreeBackButton");
                removeElementById("decisionTreeDiv");
            }

            else if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "starImage"))
            {
                setup(e, target);    

                var imageHolder = d3.select("#" + target.id + "." + target.className.baseVal);

                if(imageHolder.attr("xlink:href") == "images/star_empty.png")
                    imageHolder.attr("xlink:href", "images/star_fill.png")

                else if(imageHolder.attr("xlink:href") == "images/star_fill.png")
                    imageHolder.attr("xlink:href", "images/star_empty.png");
            }

            else if((e.button == 1 && window.event != null || e.button == 0) && (target.id == "helpButtonFront"))
            {
                setup(e, target);

                var helpButtonFront = d3.select("#helpButtonFront.sideCanvasButtons");
                var helpButtonBack = d3.select("#helpButtonBack.sideCanvasButtons");
                var helpButtonText = d3.select("#helpButtonText.sideCanvasButtonTexts");

                var historyButtonFront = d3.select("#historyButtonFront.sideCanvasButtons");
                var historyButtonBack = d3.select("#historyButtonBack.sideCanvasButtons");
                var historyButtonText = d3.select("#historyButtonText.sideCanvasButtonTexts");
                
                // Do something only when help mode is currently not activated
                if(helpButtonBack.attr("fill") == "#f8f9f7")
                {                    
                    help = true;

                    helpButtonBack.attr("fill", "#627bf4")
                                  .attr("stroke", "none")
                                  .attr("y", tabTopSelected);
                    helpButtonText.attr("fill", "white")
                                  .attr("y", parseFloat(sideCanvasButtonHeight/2) + parseFloat(tabTopSelected)/2);                    
                    helpButtonFront.attr("y", tabTopSelected);                

                    historyButtonBack.attr("fill", "#f8f9f7")
                                     .attr("stroke", "black")
                                     .attr("y", tabTopUnselected);
                    historyButtonText.attr("fill", "black")
                                     .attr("y", parseFloat(sideCanvasButtonHeight/2) + parseFloat(tabTopUnselected)/2);                    
                    historyButtonFront.attr("y", tabTopUnselected);

                    // Add border to the button panel in the bottom (to stretch the border down)

                    d3.select("#reportButtonPanel").attr("style", "position: absolute; left: " + (variablesPanelWidth + assumptionsPanelWidth) + "px; top: " + (sidePanelHeight - sideCanvasButtonHeight) + "px; height: " + sideCanvasButtonHeight + "px; width: " + sidePanelWidth + "px; overflow: hidden; border-left: " + borderWidth + "px solid #627bf4; border-top: 0px;");
                    d3.select("#sidePanel").attr("style", "position: absolute; left: " + (variablesPanelWidth + assumptionsPanelWidth) + "px; top: " + sideCanvasButtonHeight + "px; height: " + (sidePanelHeight - 2*sideCanvasButtonHeight) + "px; width: " + sidePanelWidth + "px; overflow: auto; border-style: solid; border-color: #627bf4; border-width: " + borderWidth + "px; border-bottom: 0px;");

                    // Set all historyEntry displays to none
                    d3.selectAll(".historyEntryBoundingBox").attr("display", "none");


                    // ToDo: overlay help canvas on top of history panel
                    var helpPanel = d3.select("body").append("div")
                                                    .attr("id", "helpPanel")
                                                    .attr("style", "position: absolute; left: " + (variablesPanelWidth + plotPanelWidth + borderWidth) + "px; top: " + (sideCanvasButtonHeight + borderWidth) + "px; width: " + (sidePanelWidth - 2*borderWidth) + "px; height: " + (sidePanelHeight - sideCanvasButtonHeight - 2*borderWidth) + "px; background-color: #FFFFFF; overflow: auto; margin: " + marginHelpPanel + "px;");                                                    

                    helpPanel.append("label")
                                .attr("id", "descriptionLabel")
                                .text("Hover over a visible element to get help");
                    
                    //plotCanvas
                    var plotCanvas = d3.select("#plotCanvas");
                    // var resultsCanvas = d3.select("#resultsCanvas");
                    
                    // ToDo: modify the following to suit current changes

                    if(document.getElementById("regressionLine") == null)
                    {
                        plotCanvas.append("rect")
                                    .attr("x", plotPanelWidth/2 - plotWidth/2)
                                    .attr("y", plotPanelHeight/2 - plotHeight/2)
                                    .attr("width", plotWidth)
                                    .attr("height", plotHeight)
                                    .attr("rx", "10px")
                                    .attr("ry", "10px")
                                    .attr("fill", "white")
                                    .attr("stroke", "#627bf4")
                                    .attr("opacity", "0.01")
                                    .attr("zIndex", "-1")
                                    .attr("class", "plotHelp");  
                    }
                    
                    // if(document.getElementsByClassName("significanceTest").length > 0)
                    // {
                    //     resultsCanvas.append("rect")
                    //                 .attr("x", resultsPanelWidth/2 + scaleForWindowSize(10))
                    //                 .attr("y", 2.5*significanceTestResultStep)
                    //                 .attr("height", significanceTestResultStep - scaleForWindowSize(10))
                    //                 .attr("width", resultsPanelWidth/2 - scaleForWindowSize(10))
                    //                 .attr("rx", "3px")
                    //                 .attr("ry", "3px")
                    //                 .attr("stroke", "none")
                    //                 .attr("opacity", "0.01")
                    //                 .attr("fill", "white")
                    //                 .attr("class", "pValueHelp");
                                    
                    //     resultsCanvas.append("rect")
                    //                 .attr("x", scaleForWindowSize(10))
                    //                 .attr("y", 2.5*significanceTestResultStep)
                    //                 .attr("height", significanceTestResultStep - scaleForWindowSize(10))
                    //                 .attr("width", resultsPanelWidth/2 - 2*scaleForWindowSize(10))
                    //                 .attr("rx", "3px")
                    //                 .attr("ry", "3px")
                    //                 .attr("stroke", "none")
                    //                 .attr("opacity", "0.01")
                    //                 .attr("fill", "white")
                    //                 .attr("class", "testStatisticHelp");
                                    
                    //     resultsCanvas.append("rect")
                    //                 .attr("x", scaleForWindowSize(10))
                    //                 .attr("y", significanceTestResultStep)
                    //                 .attr("height", significanceTestResultStep - scaleForWindowSize(10))
                    //                 .attr("width", sidePanelWidth - 2*scaleForWindowSize(10))
                    //                 .attr("rx", "3px")
                    //                 .attr("ry", "3px")
                    //                 .attr("stroke", "none")
                    //                 .attr("opacity", "0.01")
                    //                 .attr("fill", "white")
                    //                 .attr("class", "methodHelp");
                        
                    //     resultsCanvas.append("rect")
                    //                 .attr("x", scaleForWindowSize(10))
                    //                 .attr("y", 3.5*significanceTestResultStep)
                    //                 .attr("height", effectSizeHeight + 2*significanceTestResultStep)
                    //                 .attr("width", sidePanelWidth - 2*scaleForWindowSize(10))
                    //                 .attr("rx", "3px")
                    //                 .attr("ry", "3px")
                    //                 .attr("stroke", "none")
                    //                 .attr("opacity", "0.01")
                    //                 .attr("fill", "white")
                    //                 .attr("class", "effectSizeHelp");
                    // }                    
                    
                    if(document.getElementById("homogeneity") != null)
                    {
                        if(d3.select("#homogeneity.assumptionsButtonBack").attr("stroke") != "black")
                        {
                            var variancePlotWidth = plotWidth/2;
                            var variancePlotHeight = scaleForWindowSize(250);
                            
                            plotCanvas.append("rect")
                                        .attr("x", plotPanelWidth/2 - variancePlotWidth/2 - scaleForWindowSize(10))
                                        .attr("y", plotPanelHeight/2 + plotHeight/2 + 3*axesOffset - scaleForWindowSize(10))
                                        .attr("height", variancePlotHeight + 2*scaleForWindowSize(10))
                                        .attr("width", variancePlotWidth + 2*scaleForWindowSize(10))
                                        .attr("rx", "5px")
                                        .attr("ry", "5px")
                                        .attr("fill", "white")
                                        .attr("stroke", "#627bf4")
                                        .attr("opacity", "0.01")
                                        .attr("class", "variancePlotHelp");
                            removeElementsByClassName("normalityPlotHelp");
                        }
                        
                        if(d3.select("#normality.assumptionsButtonBack").attr("stroke") != "black")
                        {   
                            plotCanvas.append("rect")
                                        .attr("x", plotPanelWidth/2 - plotWidth/2)
                                        .attr("y", plotPanelHeight + normalityPlotOffset - 2*scaleForWindowSize(10))
                                        .attr("height", normalityPlotHeight + 4*scaleForWindowSize(10))
                                        .attr("width", plotWidth)
                                        .attr("rx", "5px")
                                        .attr("ry", "5px")
                                        .attr("fill", "white")
                                        .attr("stroke", "#627bf4")
                                        .attr("opacity", "0.01")
                                        .attr("class", "normalityPlotHelp");
                            removeElementsByClassName("variancePlotHelp");
                        }                   
                    }
                }  
            }

            else if((e.button == 1 && window.event != null || e.button == 0) && (target.id == "reportButtonFront"))
            {
                setup(e, target);
                reportMode = true;

                $('body').animate({
                       scrollLeft: width - sidePanelWidth,
                       duration: 5000 
                });

                removeElementsByClassName("sideCanvasButtons");
                removeElementsByClassName("sideCanvasButtonTexts");

                var modeButtonCanvas = d3.select("#modeButtonCanvas");
                var reportButtonCanvas = d3.select("#reportButtonCanvas");

                modeButtonCanvas.append("rect")
                            .attr("x", 0)
                            .attr("y", 0)
                            .attr("height", sideCanvasButtonHeight )
                            .attr("width", sidePanelWidth )
                            .attr("stroke", "black")
                            .attr("fill", "url(#buttonFillNormal)")                        
                            .attr("id", "backButtonBack")
                            .attr("class", "sideCanvasButtons");

                modeButtonCanvas.append("text")
                            .attr("x", sidePanelWidth/2)
                            .attr("y", sideCanvasButtonHeight/2)
                            .attr("text-anchor", "middle")
                            .attr("font-size", historyButtonTextSize)
                            .attr("id", "backButtonText")
                            .attr("class", "sideCanvasButtonTexts")
                            .text("Back");

                modeButtonCanvas.append("rect")
                            .attr("x", 0)
                            .attr("y", 0)
                            .attr("height", sideCanvasButtonHeight )
                            .attr("width", sidePanelWidth )
                            .attr("stroke", "black")
                            .attr("fill", "url(#buttonFillNormal)") 
                            .attr("opacity", "0.01")                       
                            .attr("id", "backButtonFront")
                            .attr("class", "sideCanvasButtons");

                reportButtonCanvas.append("rect")
                            .attr("x", 0)
                            .attr("y", 0)
                            .attr("height", sideCanvasButtonHeight )
                            .attr("width", sidePanelWidth )
                            .attr("stroke", "black")
                            .attr("fill", "url(#buttonFillNormal)")                        
                            .attr("id", "generateButtonBack")
                            .attr("class", "sideCanvasButtons");

                reportButtonCanvas.append("text")
                            .attr("x", sidePanelWidth/2)
                            .attr("y", sideCanvasButtonHeight/2)
                            .attr("text-anchor", "middle")
                            .attr("font-size", historyButtonTextSize)
                            .attr("id", "generateButtonText")
                            .attr("class", "sideCanvasButtonTexts")
                            .text("Generate");

                reportButtonCanvas.append("rect")
                            .attr("x", 0)
                            .attr("y", 0)
                            .attr("height", sideCanvasButtonHeight )
                            .attr("width", sidePanelWidth )
                            .attr("stroke", "black")
                            .attr("fill", "url(#buttonFillNormal)") 
                            .attr("opacity", "0.01")                       
                            .attr("id", "generateButtonFront")
                            .attr("class", "sideCanvasButtons");


                var starredHistoryEntryIndices = getStarredHistoryEntryIndices();

                console.log("starredHistoryEntryIndices = [" + starredHistoryEntryIndices + "]");

                // Add checkbox for the reports
                d3.selectAll(".starImage").attr("display", "none");
                d3.selectAll(".checkboxImage").attr("display", "inline").attr("xlink:href", "images/checkbox_empty.png");

                testTypesSelectedForReport = [];
                researchQuestionsSelectedForReport = [];
                variablesSelectedForReport = [];

                for(var i=0; i<starredHistoryEntryIndices.length; i++)
                {
                    var image = d3.select("#image" + starredHistoryEntryIndices[i] + ".checkboxImage");                

                    if(image.attr("xlink:href") != "images/checkbox_checked.png")
                    {
                        image.attr("xlink:href", "images/checkbox_checked.png");
                        
                        testTypesSelectedForReport.push(listOfTestTypes[starredHistoryEntryIndices[i]]); // Add the currently selected history entry to testTypesSelectedForReport array
                        researchQuestionsSelectedForReport.push(listOfResearchQuestions[starredHistoryEntryIndices[i]]); // Add the currently selected history entry to testTypesSelectedForReport array
                        variablesSelectedForReport.push(listOfLevelsCompared[[starredHistoryEntryIndices[i]]]); // Add the currently selected history entry to testTypesSelectedForReport array                        

                        console.log("researchQuestionsSelectedForReport = [" + researchQuestionsSelectedForReport + "]");
                    }
                }  

                var reportPanel = document.getElementById("reportPanel");

                if ( reportPanel.hasChildNodes() )
                {
                    while ( reportPanel.childNodes.length >= 1 )
                    {
                        reportPanel.removeChild( reportPanel.firstChild );       
                    } 
                }                          
            }

            else if((e.button == 1 && window.event != null || e.button == 0) && (target.id == "backButtonFront"))
            {
                setup(e, target);
                backButtonPressed();
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "disabled"))
            {
                setup(e, target);
        
                if(document.getElementById("plotCanvas") != null)
                            removeElementById("plotCanvas");
                if(document.getElementById("sideBarCanvas") != null)
                            removeElementById("sideBarCanvas");        
        
                removeElementsByClassName("displayDataTable");
                removeElementsByClassName("displayDataText");
        
                displayDataForVariable(target.id);
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "means")
            {
                setup(e, target);    
        
                //get the selected mean
                var meanCircle = d3.selectAll("#" + target.id + ".means");

                if(meanCircle.attr("r") == engorgedMeanRadius)             
                {
                    if(meanCircle.attr("fill") == meanColors["click"])
                    {
                        //we are cancelling a mean
                        meanCircle.attr("fill", meanColors["normal"]);
            
                        //remove all complete lines associated with this and join the missing ones
                        var completeLines = document.getElementsByClassName("completeLines");
                        var lineBefore, lineAfter;
            
                        for(var i=0; i<completeLines.length; i++)
                        {
                            if(completeLines[i].getAttribute("x1") == meanCircle.attr("cx"))
                            {
                                lineAfter = completeLines[i];
                            }
                            if(completeLines[i].getAttribute("x2") == meanCircle.attr("cx"))
                            {
                                lineBefore = completeLines[i];
                            }
                        }
            
                        if(lineBefore == undefined && lineAfter == undefined)
                        {
                            //it was the only mean selected - just remove the existing incomplete line                    
                            removeElementsByClassName("incompleteLines");
                        }
                        else if(lineAfter == undefined)
                        {                
                            removeElementsByClassName("incompleteLines");
                            var canvas = d3.select("#plotCanvas");
            
                            canvas.append("line")
                                    .attr("x1", lineBefore.getAttribute("x1"))
                                    .attr("y1", lineBefore.getAttribute("y1"))
                                    .attr("x2", lineBefore.getAttribute("x1"))
                                    .attr("y2", lineBefore.getAttribute("y1"))
                                    .attr("stroke", meanColors["normal"])
                                    .attr("stroke-dasharray", "5,5")
                                    .attr("id", meanCircle.attr("id"))
                                    .attr("class", "incompleteLines");
                
                            lineBefore.parentNode.removeChild(lineBefore);
                        }
                        else if(lineBefore == undefined)
                        {                                
                            removeElementsByClassName("incompleteLines");
                            var canvas = d3.select("#plotCanvas");
                    
                            if(document.getElementsByClassName("completeLines").length > 0)
                            {
                                var endingLine = findEndingLine();
                        
                                canvas.append("line")
                                        .attr("x1", endingLine.getAttribute("x2"))
                                        .attr("y1", endingLine.getAttribute("y2"))
                                        .attr("x2", endingLine.getAttribute("x2"))
                                        .attr("y2", endingLine.getAttribute("y2"))
                                        .attr("stroke", meanColors["normal"])
                                        .attr("stroke-dasharray", "5,5")
                                        .attr("id", meanCircle.attr("id"))
                                        .attr("class", "incompleteLines");
                            }
                            else
                            {
                                canvas.append("line")
                                        .attr("x1", lineAfter.getAttribute("x2"))
                                        .attr("y1", lineAfter.getAttribute("y2"))
                                        .attr("x2", lineAfter.getAttribute("x2"))
                                        .attr("y2", lineAfter.getAttribute("y2"))
                                        .attr("stroke", meanColors["normal"])
                                        .attr("stroke-dasharray", "5,5")
                                        .attr("id", meanCircle.attr("id"))
                                        .attr("class", "incompleteLines");
                            }
                
                            lineAfter.parentNode.removeChild(lineAfter);

                        }
                        else
                        {
                            removeElementsByClassName("incompleteLines");
                
                            var canvas = d3.select("#plotCanvas");
            
                            if(document.getElementsByClassName("completeLines").length > 0)
                            {
                                var endingLine = findEndingLine();
                        
                                canvas.append("line")
                                        .attr("x1", endingLine.getAttribute("x2"))
                                        .attr("y1", endingLine.getAttribute("y2"))
                                        .attr("x2", endingLine.getAttribute("x2"))
                                        .attr("y2", endingLine.getAttribute("y2"))
                                        .attr("stroke", meanColors["normal"])
                                        .attr("stroke-dasharray", "5,5")
                                        .attr("id", meanCircle.attr("id"))
                                        .attr("class", "incompleteLines");
                            }
                            else
                            {
                                canvas.append("line")
                                        .attr("x1", lineAfter.getAttribute("x2"))
                                        .attr("y1", lineAfter.getAttribute("y2"))
                                        .attr("x2", lineAfter.getAttribute("x2"))
                                        .attr("y2", lineAfter.getAttribute("y2"))
                                        .attr("stroke", meanColors["normal"])
                                        .attr("stroke-dasharray", "5,5")
                                        .attr("id", meanCircle.attr("id"))
                                        .attr("class", "incompleteLines");
                            }
                        
                            lineBefore.setAttribute("x2", lineAfter.getAttribute("x2"));
                            lineBefore.setAttribute("y2", lineAfter.getAttribute("y2"));
                            lineAfter.parentNode.removeChild(lineAfter);
                        }
                    
                    
                    }
                    else
                    {
                        if(document.getElementsByClassName("means").length == 1)
                        {
                            //if there is only mean (one sample tests)
                            if(meanCircle.attr("fill") == meanColors["hover"])
                            {
                                meanCircle.attr("fill", meanColors["click"]);
                //                 compareMeans();
                            }
                            else
                            {
                                meanCircle.attr("fill", meanColors["normal"]);
                            }
                        }
                        else if(document.getElementsByClassName("completeLines").length < (document.getElementsByClassName("means").length - 1))
                        {
                            //if there are 2+ means            
                            meanCircle.attr("fill", meanColors["click"]);
        
                            //check if we are finishing an incomplete line here
                            if(document.getElementsByClassName("incompleteLines").length > 0)
                            {
                                var incompleteLines = d3.selectAll(".incompleteLines");
                
                                incompleteLines.attr("x2", meanCircle.attr("cx"))
                                               .attr("y2", meanCircle.attr("cy"))
                                               .attr("stroke", meanColors["click"])
                                               .attr("class", "completeLines");
                                       
                                removeElementsByClassName("indicator");
                                var canvas = d3.select("#plotCanvas");                                             
                            }
                            var means = document.getElementsByClassName("means");
                    
                            if(document.getElementsByClassName("completeLines").length < (document.getElementsByClassName("means").length - 1))
                            {
                                var canvas = d3.select("#plotCanvas");
            
                                canvas.append("line")
                                        .attr("x1", meanCircle.attr("cx"))
                                        .attr("y1", meanCircle.attr("cy"))
                                        .attr("x2", meanCircle.attr("cx"))
                                        .attr("y2", meanCircle.attr("cy"))
                                        .attr("stroke", meanColors["normal"])
                                        .attr("stroke-dasharray", "5,5")
                                        .attr("id", meanCircle.attr("id"))
                                        .attr("class", "incompleteLines");
                            }
                            else
                            {
                                //we are done
                //                 compareMeans();
                            }
                        }   
                    }
                
                    setSelectButtons();
                    setCompareNowButtonText();
                }
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "compareNow")
            {
                d3.selectAll(".compareNow").attr("cursor", "pointer");                
                showResetButton();
                    
                states.push({visualisation: selectedVisualisation, substate: "significanceTest"});
                
                //get selected means
                var means = document.getElementsByClassName("means");
                var selectedMeans = []; 
                var variableList = getSelectedVariables();
        
                for(var i=0; i<means.length; i++)
                {
                    if(means[i].getAttribute("fill") == meanColors["click"])
                        selectedMeans.push(means[i]);
                }
        
                if(selectedMeans.length == 2 || selectedMeans.length == means.length)
                {
                
                    compareMeans();                    
                    
                    removeElementsByClassName("boxplotLegends");
                    removeElementsByClassName("compareNow");
                }
                else 
                {
                    alert("Please select means of two levels (or) select means of all the levels!");                    
                }
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "compareMean")
            {
                setup(e, target);        

                removeElementsByClassName("compareMean");
                pairwiseComparisons = false;                       
                
                var buttonText = "Compare the Selected Distributions";
                drawButton(buttonText, "compareNow");                               

                drawButton("Select none", "selectNone", assumptionsPanelWidth*0.25, assumptionsPanelHeight*0.5, "assumptionsCanvas");
                drawButton("Select all", "selectAll", assumptionsPanelWidth*0.75, assumptionsPanelHeight*0.5, "assumptionsCanvas");
        
                freezeMouseEvents = true;

                d3.selectAll(".IQRs, .medians, .TOPFringes, .BOTTOMFringes, .TOPFringeConnectors, .BOTTOMFringeConnectors, .outliers, .CIs, .CITopFringes, .CIBottomFringes").transition().duration(500).style("opacity", "0.35");
                d3.selectAll(".means").transition().duration(500).attr("r", engorgedMeanRadius);

                selectAllMeans();

                var selectNoneText = d3.select("#text.selectNone");
                var selectNoneButton = d3.select("#button.selectNone");
            
                var selectAllText = d3.select("#text.selectAll");
                var selectAllButton = d3.select("#button.selectAll");

                selectAllButton.attr("fill", "url(#buttonFillSelected)");
                selectAllButton.attr("filter", "none");
                selectAllButton.attr("stroke", "none");
            
                selectAllText.attr("fill", "white");
            
                setTimeout(function()
                {
                    freezeMouseEvents = false;
                }, 500);                
            }
        
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "selectNone")
            {
                setup(e, target);
            
                var selectNoneText = d3.select("#text.selectNone");
                var selectNoneButton = d3.select("#button.selectNone");
            
                var selectAllText = d3.select("#text.selectAll");
                var selectAllButton = d3.select("#button.selectAll");
            
                if(selectNoneButton.attr("fill") == "url(#buttonFillNormal)")
                {
                    selectNoneButton.attr("fill", "url(#buttonFillSelected)")
                                                  .attr("filter", "none")
                                                  .attr("stroke", "none");
                
                    selectNoneText.attr("fill", "white");
                
                    unselectAllMeans();
                
                    selectAllButton.attr("fill", "url(#buttonFillNormal)")
                                             .attr("filter", "url(#Bevel)")
                                             .attr("stroke", "black");
                
                    selectAllText.attr("fill", "black");
                
                    setTimeout(function()
                    {
                        setCompareNowButtonText();
                    }, 800);
                }
            }
        
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "selectAll")
            {
                setup(e, target);
            
                var selectNoneText = d3.select("#text.selectNone");
                var selectNoneButton = d3.select("#button.selectNone");
            
                var selectAllText = d3.select("#text.selectAll");
                var selectAllButton = d3.select("#button.selectAll");
            
                if(selectAllButton.attr("fill") == "url(#buttonFillNormal)")
                {
                    selectAllButton.attr("fill", "url(#buttonFillSelected)");
                    selectAllButton.attr("filter", "none");
                    selectAllButton.attr("stroke", "none");
                
                    selectAllText.attr("fill", "white");
                
                    selectAllMeans();
                
                    selectNoneButton.attr("fill", "url(#buttonFillNormal)");
                    selectNoneButton.attr("filter", "url(#Bevel)");
                    selectNoneButton.attr("stroke", "black");
                
                    selectNoneText.attr("fill", "black");
                
                    setTimeout(function()
                    {
                        setCompareNowButtonText();
                    }, 800);
                }
            }           
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "transformToNormal")
            {
                setup(e, target);
                
                // Remove the buttons
                removeElementsByClassName("transformToNormal");
                removeElementsByClassName("dontTransformToNormal");
            
                var variableList = sort(selectedVariables);
        
                console.log("transformationType = " + transformationType);
                applyTransformationToDataset(transformationType);
            }

            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "dontTransformToNormal")
            {
                setup(e, target);

                // Remove the buttons
                removeElementsByClassName("transformToNormal");
                removeElementsByClassName("dontTransformToNormal");

                testSelectionLogicAfterNormalityTest();
            }
        
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "transformToHomogeneity")
            {
                setup(e, target);
                
                // Remove the buttons
                removeElementsByClassName("transformToHomogeneity");
                removeElementsByClassName("dontTransformToHomogeneity");            
                
                applyTransformationToDataset(transformationType);
            
                // applyHomogeneityTransform(variableList["dependent"][0], variableList["independent"][0]);               
            }

            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "dontTransformToHomogeneity")
            {
                setup(e, target);

                // Remove the buttons
                removeElementsByClassName("transformToHomogeneity");
                removeElementsByClassName("dontTransformToHomogeneity");

                testSelectionLogicAfterHomogeneityTest();
            }
        
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "helpButtonFront")
            {
                setup(e, target);
            
                var helpButton = d3.select(".helpButtonBack");
                var helpButtonText = d3.select(".helpButtonText");

                removeElementsByClassName("toolTips");
            
                if(helpButton.attr("stroke") == "black")
                {
                    help = true;
                    helpButton.attr("fill", "url(#buttonFillSelected)")
                                .attr("filter", "none")
                                .attr("stroke", "none");
                
                    helpButtonText.attr("fill", "white");

                    var helpTextHeight = (height - plotPanelHeight)/2;
                    console.log("helpTextHeight = " + helpTextHeight);
            
                    var description = d3.select("body").append("div");                
                    description.attr("id", "descriptionPanel")
                         .attr("style", "width: " + width + "px; height: " + helpTextHeight + "px; top: " + (parseFloat(plotPanelHeight) + parseFloat(helpTextHeight)) + "px;");
                    
                    description.append("label")
                                .attr("id", "descriptionLabel")
                                .text("Hover over a visible element to get help");
                    
                    //plotCanvas
                    var plotCanvas = d3.select("#plotCanvas");
                    var sideBar = d3.select("#sideBarCanvas");
                    
                    if(document.getElementById("regressionLine") == null)
                    {
                        plotCanvas.append("rect")
                                    .attr("x", plotPanelWidth/2 - plotWidth/2)
                                    .attr("y", plotPanelHeight/2 - plotHeight/2)
                                    .attr("width", plotWidth)
                                    .attr("height", plotHeight)
                                    .attr("rx", "10px")
                                    .attr("ry", "10px")
                                    .attr("fill", "white")
                                    .attr("stroke", "#627bf4")
                                    .attr("opacity", "0.01")
                                    .attr("zIndex", "-1")
                                    .attr("class", "plotHelp");  
                    }
                    
                    if(document.getElementsByClassName("significanceTest").length > 0)
                    {
                        sideBar.append("rect")
                                    .attr("x", scaleForWindowSize(10))
                                    .attr("y", significanceTestResultOffsetTop + 3*significanceTestResultStep - significanceTestResultStep/2)
                                    .attr("height", significanceTestResultStep)
                                    .attr("width", sideBarWidth - 2*scaleForWindowSize(10))
                                    .attr("rx", "3px")
                                    .attr("ry", "3px")
                                    .attr("stroke", "none")
                                    .attr("opacity", "0.01")
                                    .attr("fill", "white")
                                    .attr("class", "pValueHelp");
                                    
                        sideBar.append("rect")
                                    .attr("x", scaleForWindowSize(10))
                                    .attr("y", significanceTestResultOffsetTop + 2*significanceTestResultStep - significanceTestResultStep/2)
                                    .attr("height", significanceTestResultStep)
                                    .attr("width", sideBarWidth - 2*scaleForWindowSize(10))
                                    .attr("rx", "3px")
                                    .attr("ry", "3px")
                                    .attr("stroke", "none")
                                    .attr("opacity", "0.01")
                                    .attr("fill", "white")
                                    .attr("class", "testStatisticHelp");
                                    
                        sideBar.append("rect")
                                    .attr("x", scaleForWindowSize(10))
                                    .attr("y", significanceTestResultOffsetTop + significanceTestResultStep - significanceTestResultStep/2)
                                    .attr("height", significanceTestResultStep)
                                    .attr("width", sideBarWidth - 2*scaleForWindowSize(10))
                                    .attr("rx", "3px")
                                    .attr("ry", "3px")
                                    .attr("stroke", "none")
                                    .attr("opacity", "0.01")
                                    .attr("fill", "white")
                                    .attr("class", "methodHelp");
                        
                        sideBar.append("rect")
                                    .attr("x", scaleForWindowSize(10))
                                    .attr("y", significanceTestResultOffsetTop - significanceTestResultStep - effectSizeHeight/2 - yAxisTickTextOffset)
                                    .attr("height", effectSizeHeight + yAxisTickTextOffset*2)
                                    .attr("width", sideBarWidth - 2*scaleForWindowSize(10))
                                    .attr("rx", "3px")
                                    .attr("ry", "3px")
                                    .attr("stroke", "none")
                                    .attr("opacity", "0.01")
                                    .attr("fill", "white")
                                    .attr("class", "effectSizeHelp");
                    }
                    
                    
                    if(d3.select("#homogeneity.assumptionsButtonBack").attr("stroke") != "black")
                    {
                        var variancePlotWidth = plotWidth/2;
                        var variancePlotHeight = scaleForWindowSize(250);
                        
                        plotCanvas.append("rect")
                                    .attr("x", plotPanelWidth/2 - variancePlotWidth/2 - scaleForWindowSize(10))
                                    .attr("y", plotPanelHeight/2 + plotHeight/2 + 3*axesOffset - scaleForWindowSize(10))
                                    .attr("height", variancePlotHeight + 2*scaleForWindowSize(10))
                                    .attr("width", variancePlotWidth + 2*scaleForWindowSize(10))
                                    .attr("rx", "5px")
                                    .attr("ry", "5px")
                                    .attr("fill", "white")
                                    .attr("stroke", "#627bf4")
                                    .attr("opacity", "0.01")
                                    .attr("class", "variancePlotHelp");
                    }
                    
                    if(d3.select("#normality.assumptionsButtonBack").attr("stroke") != "black")
                    {   
                        plotCanvas.append("rect")
                                    .attr("x", plotPanelWidth/2 - plotWidth/2)
                                    .attr("y", plotPanelHeight + normalityPlotOffset - 2*scaleForWindowSize(10))
                                    .attr("height", normalityPlotHeight + 4*scaleForWindowSize(10))
                                    .attr("width", plotWidth)
                                    .attr("rx", "5px")
                                    .attr("ry", "5px")
                                    .attr("fill", "white")
                                    .attr("stroke", "#627bf4")
                                    .attr("opacity", "0.01")
                                    .attr("class", "normalityPlotHelp");
                    }                   
                }                
            }
            
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "resetButton")
            {
                setup(e, target);
                
                var buttonRect = d3.select("#button.resetButton");
                var buttonText = d3.select("#text.resetButton");
                
                plotVisualisation();                
                hideResetButton();

                var canvas = d3.select("#plotCanvas");
                var variableList = getSelectedVariables();
    
                var buttonText = "Compare the Selected Distributions";
                drawButton(buttonText, "compareNow");                               

                drawButton("Select none", "selectNone", assumptionsPanelWidth*0.25, assumptionsPanelHeight*0.5, "assumptionsCanvas");
                drawButton("Select all", "selectAll", assumptionsPanelWidth*0.75, assumptionsPanelHeight*0.5, "assumptionsCanvas");
    
                freezeMouseEvents = true;
                d3.selectAll(".IQRs, .medians, .TOPFringes, .BOTTOMFringes, .TOPFringeConnectors, .BOTTOMFringeConnectors, .outliers, .CIs, .CITopFringes, .CIBottomFringes").transition().duration(500).style("opacity", "0.35");
                d3.selectAll(".means").transition().duration(500).attr("r", engorgedMeanRadius);
        
                setTimeout(function()
                {
                    freezeMouseEvents = false;
                }, 500);
    
                removeElementsByClassName("compareMean");
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "regression")
            {
                setup(e, target);
                removeElementsByClassName("regression");
        
                drawDialogBoxToGetOutcomeVariable();
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "outcomeVariable")
            {
                setup(e, target);
        
                var outcomeVariableButton = d3.select("#" + target.id + ".outcomeVariable");
        
                var choice = target.id;
        
                if(selectedVisualisation == "Scatterplot")
                {
                    var timeOut = 0;
                    if(choice != selectedVariables[1])
                    {   
                        var temp = selectedVariables[1];
                        selectedVariables[1] = selectedVariables[0];
                        selectedVariables[0] = temp;
                
                        plotVisualisation();  

                        timeOut = 1000;
                    }
                    
                    setTimeout(
                        function()
                        {
                            var variableList = sort(selectedVariables);
        
                            console.log("\n\t\tFinding the regression model to predict the outcome variable (" + selectedVariables[1] + ") from the explanatory variable (" + selectedVariables[0] + ")");
                
                            removeElementsByClassName("outcomeVariable");
                            removeElementsByClassName("dialogBox");
                
                            setTimeout(function(){            
                                removeElementsByClassName("regression");
                                removeElementsByClassName("significanceTest");
                                removeElementsByClassName("effectSize");
                                removeElementsByClassName("effectSizeInterpretationIndicators");
                                getLinearModelCoefficients(selectedVariables[1], selectedVariables[0]);
                            }, 300);   
                        }, timeOut);                      
                }
                else if(selectedVisualisation == "Scatterplot matrix")
                {
                    resetSVGCanvas();
                    drawFullScreenButton();
            
                    var explanatoryVariables = [];
                    var outcomeVariable = choice;
            
                    for(var i=0; i<selectedVariables.length; i++)
                    {
                        if(selectedVariables[i] != outcomeVariable)
                        {
                            explanatoryVariables.push(selectedVariables[i]);
                        }
                    }
                    if(explanatoryVariables.length == 1)
                    {
                        getLinearModelCoefficients(outcomeVariable, explanatoryVariables[0]);
                        selectedVisualisation = "Scatterplot";
                        plotVisualisation();
                    }
                    else
                        performMultipleRegression(outcomeVariable, explanatoryVariables);
                }
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "interactionEffect")
            {
                setup(e, target);
        
                var button = d3.select("#button.interactionEffect");
                removeElementsByClassName("interactionEffect");
                
                var variableList = getSelectedVariables();
                
                states.push({variables: selectedVariables, substate: "other"});
                console.dir(states);
                
                findInteractionEffect(variableList["dependent"][0], variableList["independent"]);
            }
            
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "assumptionsText")
            {
                setup(e, target);

                var nodeText = d3.select("#" + target.id + ".assumptionsText");        
                handleAssumptions(nodeText);
            }
            
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "effectButtonFront")
            {
                setup(e, target);
                
                var effectButton = d3.select("#" + target.id + ".effectButtonBack");
                var effectButtonText = d3.select("#" + target.id + ".effectButtonText");
                
                var resultsCanvas = d3.select("#resultsCanvas");
                var index = parseFloat(effectButton.attr("data-index"));
                
                if(effectButton.attr("stroke") == "black")
                {
                    d3.selectAll(".effectButtonBack").attr("fill", "url(#buttonFillNormal)").attr("stroke", "black");
                    d3.selectAll(".effectButtonText").attr("fill", "black");
                    
                    effectButton.attr("fill", "url(#buttonFillSelected)")
                                .attr("stroke", "none");
                    
                    effectButtonText.attr("fill", "white");
                    
                    removeElementsByClassName("significanceTest");
                    removeElementsByClassName("effectSize");
                    removeElementsByClassName("parameter");
                    
                    resultsCanvas.append("text")
                                    .attr("x", resultsPanelWidth/2)
                                    .attr("y", 1.5*significanceTestResultStep)
                                    .attr("text-anchor", "middle")
                                    .attr("font-size", fontSizes["test result"] )
                                    .attr("fill", "#627bf4")
                                    .text("Statistical test: " + multiVariateTestResults["method"])
                                    .attr("class", "significanceTest");
                    
                    drawParameter(multiVariateTestResults["df"][index], parseFloat(multiVariateTestResults["parameter"][index]));
    
                    resultsCanvas.append("text")
                                    .attr("x", 3*resultsPanelWidth/4)
                                    .attr("y", 3*significanceTestResultStep)
                                    .attr("text-anchor", "middle")
                                    .attr("font-size", fontSizes["test result"] )
                                    .attr("fill", "#627bf4")
                                    .text(multiVariateTestResults["p"][index])
                                    .attr("class", "significanceTest");
    
    
                    //Effect sizes
                    drawEffectSize(parseFloat(multiVariateTestResults["effect-size"][index]));
                }
            }

            else
            {
                //the user clicked outside
                removeElementsByClassName("regressionPrediction");   
            }
        }
    }
}

function OnMouseMove(e)
{
    if (e == null) 
    var e = window.event; 

    // this is the actual "drag code"
    
    
    if(_dragElement != undefined)
    {
        var incompleteLines = d3.selectAll(".incompleteLines");
        // if((_dragElement.className.baseVal == 'means') && (document.getElementsByClassName("incompleteLines").length > 0) && incompleteLines.attr("stroke") == meanColors["normal"])
//         {
//             if(!fullScreen)
//             {
//                 incompleteLines.attr("x2", e.pageX - (width - plotPanelWidth - sideBarWidth))
//                         .attr("y2", e.pageY);
//             }
//             else
//             {
//                 incompleteLines.attr("x2", (e.pageX/(width - sideBarWidth)) * plotPanelWidth)
//                         .attr("y2", (e.pageY/height) * plotPanelHeight);
//             }
//         }
        if(_dragElement.id == "regressionLine")
        {
//             var regressionPoint = d3.select(".regressionPrediction");
//             
//             var xLine = d3.select("#x.lineToAxis");
//             var yLine = d3.select("#y.lineToAxis");
//             
//             var mouseX = toModifiedViewBoxForRegressionLineXCoordinate(e.pageX);
//             var mouseY = toModifiedViewBoxForRegressionLineYCoordinate(e.pageY);
//             
// //             xLine.attr("x1", ((height - mouseY) + multiVariateTestResults["intercept"])/multiVariateTestResults["slope"])
// //                                  .attr("y1", mouseY)                                                 
// //                                  .attr("y2", mouseY);
// //                          
// //             mouseX = ((plotPanelHeight - mouseY) + multiVariateTestResults["intercept"])/multiVariateTestResults["slope"];
// //             
// //     
// //             yLine.attr("x1", mouseX)
// //                  .attr("y1", height - (multiVariateTestResults["slope"]*mouseX - multiVariateTestResults["intercept"]))
// //                  .attr("x2", mouseX);
// 
// //             mouseY = toModifiedViewBoxForRegressionLineYCoordinate(multiVariateTestResults["slope"]*mouseX + multiVariateTestResults["intercept"]);
//             
//             mouseX = toModifiedViewBoxForRegressionLineXCoordinate(LEFT + getValue1(multiVariateTestResults["slope"]*(plotPanelHeight - mouseY) + multiVariateTestResults["intercept"], mins["X"], maxs["X"])*plotWidth);
//             
//             var canvas = d3.select("#plotCanvas");
//             
//             var dT = d3.select("#dummyText");
//             dT.text("X = " + mouseX + " , Y = " + mouseY);
//             
//             
//             regressionPoint.attr("cx", mouseX)
//                            .attr("cy", mouseY);
        }
        
    }

}

function OnMouseOver(e)			
{
    // IE is retarded and doesn't pass the event object
    if (e == null) 
            e = window.event; 

    // IE uses srcElement, others use target
    var target = e.target != null ? e.target : e.srcElement;
    // for IE, left click == 1
    // for Firefox, left click == 0
    
    if(!freezeMouseEvents)
    {
        if(help)
        {
            var sheet = document.styleSheets;                                

            for(var i=0; i<sheet.length; i++)
            {
                if(sheet[i].href != null)
                {
                    if(sheet[i].href.indexOf("help.css") > -1)
                    {
                        sheet[i].insertRule("img { width : " + sidePanelWidth + "; } ", 0);
                    }
                }
            }

            if(target.className.baseVal == "plotHelp")
            {
                document.getElementById("helpPanel").innerHTML = "";
                d3.select("#helpPanel").append("label")
                                    .attr("id", "descriptionLabel")
                                    .text("Hover over a visible element to get help");
            
                setup(e, target);
                
                var visualisation = selectedVisualisation;
                var helpText = d3.select("#descriptionLabel");
                
                
                if(visualisation == null || visualisation == undefined)
                {
                    helpText.text("Please select a variable to get started");
                }
                else
                {   
                    d3.select(".plotHelp").attr("opacity","0.3").attr("cursor", "help");
                    helpText.text(desc[visualisation]);                
                }
            }
            
            if(target.className.baseVal == "pValueHelp")
            {
                setup(e, target);
                document.getElementById("helpPanel").innerHTML = "";
                d3.select("#helpPanel").append("label")
                                    .attr("id", "descriptionLabel")
                                    .text("Hover over a visible element to get help");
            
                var helpText = d3.select("#descriptionLabel");
                
                d3.select(".pValueHelp").attr("opacity","0.3").attr("cursor", "help");
                
                helpText.text(desc["p-value"]);                
            }
            
            if(target.className.baseVal == "testStatisticHelp")
            {
                setup(e, target);
                var helpText = d3.select("#descriptionLabel");
                
                d3.select(".testStatisticHelp").attr("opacity","0.3").attr("cursor", "help");               

                document.getElementById("helpPanel").innerHTML = '<object type="text/html" data="help/parameter/' + multiVariateTestResults["parameter-type"] + '.html" height = ' + (sidePanelHeight - sideCanvasButtonHeight) + ' width = ' + sidePanelWidth + '></object>';

                // switch(multiVariateTestResults["parameter-type"])
                // {
                //     case "t":
                //             d3.select("#helpPanel").html('<h2>The t-statistic </h2> \'t\' is a ratio of the departure of an estimated parameter from its notional value and its standard error."</div> <h2>Formula:</h2> <div class="formula"> $t = { { \bar{ x_1 } - \bar{ x_2 } } \over \sqrt{ { S_1^2 \over n_1 } + {S_2^2 \over n_2 } } } $ </div> <h2>Legend:</h2> <ul>     <li>$\bar{ x_1 } = $ Mean of first set of values</li>     <li>$\bar{ x_2 } = $ Mean of second set of values</li>    <li>$S_1 = $ Standard deviation of first set of values</li> <li>$S_2 = $ Standard deviation of second set of values</li>     <li>$n_1 = $ Total number of values in first set</li>     <li>$n_2 = $ Total number of values in second set</li> </ul>');
                //             break;
                //     case "F":    
                //             d3.select("#helpPanel").html('<h2>The F-statistic</h2> \'F\' is the ratio of variance explained by the model to the variance unexplained by the model.</div> <h2>Formula:</h2> <div class="formula"> $F = { \sigma_{explained}^2 \over \sigma_{unexplained}^2 } $ </div> or <div class="formula"> $F = { between-group variability \over within-group variability } $ </div> <br/> <div class="description"> Suppose we use mean ($\bar{x}$) to model the data, explained variance is given by </div> <br/> <div class="formula"> $\sigma_{explained}^2 = { { \sum_{i} n_{i} (\bar{x}_{i} - \bar{x})^2 } \over {K - 1} }$ </div> <br/> <div class="description">  Where $\bar{x}_{i}$ denotes the sample mean in the ith group,  $n_{i}$ is the number of observations in the ith group,$\bar{x}$ denotes the overall mean of the data, and $K$ denotes the number of groups. </div> <br/> <div class="description"> And, unexplained variance is given by : </div> <div class="formula"> $\sigma_{unexplained}^2 = { { \sum_{ij} ( x_{ij}  - \bar{x}_{i} )^2 } \over {N - K} }$ </div> <br> <div class="description"> Where $x_{ij}$ is the jth observation in the ith out of $K$ groups and $N$ is the overall sample size. </div> <br/> <h2>Legend:</h2> <ul> <li>$\sigma_1^2 = $ Variance One</li> <li>$\sigma_2^2 = $ Variance Two </li> <li>$\sigma^2 = $ Variance</li> <li>$x = $ Values given in a set of data</li> <li>$\bar{x} = $ Mean of the data</li> <li>$n = $ Total number of values </li> </ul>');
                //             break;
                //     case "cS":
                //             d3.select("#helpPanel").html('<h2>The chi-square statistic</h2> Chi-square is a normalized sum of squared deviations between observed and theoretical frequencies. </div> <h2>Formula:</h2> <div class="formula"> $ \chi^2 = \sum\limits_{c} { { ( O - E )^2 } \over { E } } $ </div> <h2>Legend:</h2> <ul> <li>$c = $ Cells in the contingency table constructed from the two variables</li> <li>$O = $ Observed frequency: counted from the actual result</li> <li>$E = $ Expected frequency: calculated frequency representing the null hypothesis that there is no relationship between variables.</li> <li>$\chi^2 = $ Chi square statistics</li> </ul> <h2>Expected and Observed Frequencies From Contingency Table:</h2> <div class="example"> For example, if we have the following survey results: <img src="images/1.pdf" class="helpImg" width = ' + sidePanelWidth + '/> </div> <br> <div class="example"> Then we can calculate our expected frequencies (E) based on the proportion of respondents who said yes versus no. It can also be calculated for each cell by the row total with the column total divided by the grand total (e.g. 254 x 294 : 692 = 108). <img src="images/2.pdf" class="helpImg" width = ' + sidePanelWidth + '/> </div> <br> <div class="example"> This second table, where no relationship exists between the interest in attending history and heritage attractions and events and gender, also represents the null hypothesis or Ho. (Therefore, if a study says that it "fails to reject the null hypothesis", it means that no relationship was found to exist between the variables under study.)</div> <br> <div class="description"> Hence, one can now use the the chi-square statistic to get the results. </div>');
                //             break;
                //     case "U":
                //             d3.select("#helpPanel").html('<h2>U statistic </h2> \'U\' is used in Wilcoxon rank-sum test calculated from the number of samples that ranked smaller in the opposite (ranked) datasets. </div> <div class="description"> The test involves the calculation of a statistic, usually called U, whose distribution under the null hypothesis is known. In the case of small samples, the distribution is tabulated, but for sample sizes above ~20 approximation using the normal distribution is fairly good. Some books tabulate statistics equivalent to U, such as the sum of ranks in one of the samples, rather than U itself. </div> <h2>Formula:</h2> <h3>Method 1:</h3> <div class="methodPart1"> 1.Choose the sample for which the ranks seem to be smaller (The only reason to do this is to make computation easier). Call this "sample 1," and call the other sample "sample 2." </div> <div class="methodPart1"> 2.For each observation in sample 1, count the number of observations in sample 2 that have a smaller rank (count a half for any that are equal to it). The sum of these ranks is U. </div> <br> <h3>Method 2:</h3> <div class="methodPart1"> For larger samples, a formula can be used: <br> Add up the ranks for the observations which came from sample 1. Where there are tied groups, take the rank to be equal to the midpoint of the group. The sum of ranks in sample 2 is now determinate, since the sum of all the ranks equals N(N + 1)/2 where N is the total number of observations. </div> <br> <div class="methodPart2"> 2.U is then given by: </div> <br> <div class="formulaU1"> $ U_1 = n_1n_2 + {{n_1(n_1+1)} \over 2} - R_1$ </div> <br> <div class="description"> Note that it doesn\'t matter which of the two samples is considered sample 1. An equally valid formula for U is: </div> <br> <div class="formulaU2"> $ U_2 = n_1n_2 + {{n_2(n_2+1)} \over 2} - R_2$ </div> <br> <div class="description"> The smaller value of U1 and U2 is the one used when consulting significance tables. The sum of the two values is given by: </div> <br> <div class="formulaU2"> $ U_1 + U_2 = R_1 - {{n_1(n_1+1)} \over 2} + R_2 - {{n_2(n_2+1)} \over 2} $ </div> <br> <div class="description"> Knowing that R1 + R2 = N(N + 1)/2 and N = n1 + n2 , and doing some algebra, we find that the sum is: </div> <br> <div class="final"> $ U_1 + U_2 = n_1n_2 $ </div> <h2>Legend:</h2> <ul> <li>$n_1 = $ Sample size for sample 1 </li> <li>$R_1 = $ The sum of the ranks in sample 1</li> <li>$n_2 = $ Sample size for sample 2</li> <li>$R_2 = $ The sum of the ranks in sample 2</li> </ul>');
                //             break;
                //     case "V":
                //             d3.select("#helpPanel").html('<h2>V statistic </h2> \'V\' (also known as Z statistics) is used in Wilcoxon signed-rank test.</div> <h2>Formula:</h2> <div class="formula"> $ Z = {(W - 0.5 -N * (N+1) \div 4 ) } \div {\sqrt{ { ( N * (N + 1) * (2 * N + 1 ) ) }  \div 24} }  $ </div> <h2>Legend:</h2> <ul> <li>$N = $ Total number of pairs</li> <li>$W = $ W is larger of $W^+$ or $W^-$</li> </ul> <h2>Procedure:</h2> <div class="description"> Rank the differences without regard to the sign of the difference (i.e., rank order the absolute differences). Ignore all zero differences (i.e., pairs with equal members, x=y). Affix the original signs to the rank numbers. All pairs with equal absolute differences (ties) get the same rank: all are ranked with the mean of the rank numbers that would have been assigned if they would have been different. Sum all positve ranks (W+) and all negative ranks (W-) and determine the total number of pairs (N). </div>');
                //             break;
                // }
            }
            
            if(target.className.baseVal == "methodHelp")
            {                    
                setup(e, target);
                var helpText = d3.select("#descriptionLabel");
                
                d3.select(".methodHelp").attr("opacity","0.3").attr("cursor", "help");
                
                switch(multiVariateTestResults["test-type"])
                {
                    case "WT":
                            d3.select("#helpPanel").html('<h2>Welch\'s t-test</h2> This test is used when 2 conditions are compared and they are unpaired (i.e., between-groups factor). Welch\'s t-test is the alternative to unpaired t-test when homogeneity of variances is not met (i.e., the distributions have unequal variances). It still requires the distributions to be normal. </div> <h2>Conditions:</h2> <ul> <li>Between-subjects experimental design </li> <li>Number of levels in the independent variable are two </li> <li>Number of independent variable is one </li> <li>Independent variable that is categorical (i.e., two or more groups)</li> <li>Dependent variable that is continuous (i.e., interval or ratio level) </li> <li>Cases that have values on both the dependent and independent variables </li> <li>Independent samples/groups (i.e., independence of observations) </li> <li>Random sample of data from the population </li> <li>Normal distribution (approximately) of the dependent variable for each group </li> <li>No outliers </li> </ul> <h2>Examples: </h2> <div class="example"> <b>Example 1:</b> In a text entry user study, two keyboard layouts (QWERTY and DVORAK) were compared in a between-subjects experimental design. As shown in the graph below, the measured task completion time were normally distributed in each condition, but their variance were radically different. This violates the assumption of homogeniety of variance of unpaired t-tests. <img src="images/wt-ex1.pdf" class="helpImg" width = ' + sidePanelWidth + '/> </div> <div class="example"> <b>Example 2:</b> In a weight loss user study, weight lost of participants is considered under two different conditions (skip breakfast and skip lunch), which were compared in a between-subjects experimental design. As shown in the graph below, the measured weight lost was normally distributed in each condition, and their variance were about the same.<img src="images/wt-ex2.pdf" class="helpImg" width = ' + sidePanelWidth + '/> </div>');
                            break;
                    case "pairedTTest":
                            d3.select("#helpPanel").html('<h2>Paired t-test</h2> A paired t-test is used when 2 conditions are compared and they are paired (i.e., within-groups factor). Paired t-test can be used only when the distributions are normal <i>and</i> homogeneity of variances is met (i.e., the distributions have equal variances). However, since there is no alternative when homogeneity of variances is not met, a paired t-test is used even then. </div> <h2>Conditions:</h2> <ul> <li>Within-subjects experimental design</li> <li>The number of Independent Variable is one</li> <li>The number of levels in Independent Variable are two</li> <li>Your independent variable should consist of two categorical, "related groups" or "matched pairs"</li> <li>The dependent variable should be measured on a continuous scale (i.e., it is measured at the interval or ratio level)</li> <li>The distribution of the differences in the dependent variable between the two related groups should be approximately normally distributed</li> <li>There should be no significant outliers in the differences between the two related groups</li> <li>Sampled data from the population of same variance</li> </ul> <h2>Examples:</h2> <div class="example"> <b>Example 1:</b> In an effect of phone operating systems emotionally on users, two types of phone operating systems(ios and android) were compared in a within-subjects experimental design. As shown in the graph below, the measured stress score was normally distributed in each condition, but they are sampled from same participants hence violating the assumption of independence of paired t-tests. <img src="images/pt-ex2.pdf" class="helpImg" width = ' + sidePanelWidth + '/> </div> <div class="example"> <b>Example 2:</b>In an effect of food on test scores user study, two types of food items(Yogurt and Snickers) were compared in a within-subjects experimental design. As shown in the graph below, the measured math score was normally distributed in each condition, but they are sampled from same participants hence violating the assumption of independence of paired t-tests.Their variance is about the same. <img src="images/pt-ex1.pdf" class="helpImg" width = ' + sidePanelWidth + '/> </div>');
                            break;
                    case "unpairedTTest": 
                            d3.select("#helpPanel").html('<h2>Unpaired t-test</h2> An unpaired t-test is used when 2 conditions are compared and they are unpaired (i.e., between-groups factor). Unpaired t-test can be used only when the distributions are normal and homogeneity of variances is met (i.e., the distributions have equal variances). </div> <h2>Conditions:</h2> <ul> <li>Between-subjects experimental design</li> <li>The number of Independent Variable is one</li> <li>The number of levels in Independent Variable are two</li> <li>The dependent variable is in interval scale</li> <li>The dependent variable is normally-distributed in each condition</li> <li>Homogeneity of variances (i.e., variances approximately equal across groups)</li> </ul> <h2>Examples:</h2> <div class="example"> <b>Example 1:</b> In a text entry user study, two keyboard layouts (QWERTY and DVORAK) were compared in a between-subjects experimental design. As shown in the graph below, the measured task completion time were normally distributed in each condition, but their variance were radically different. This violates the assumption of homogeniety of variance of unpaired t-tests. <img src="images/wt-ex1.pdf" class="helpImg" width = ' + sidePanelWidth + '/> </div> <div class="example"> <b>Example 2:</b> In a weight loss user study, weight lost of participants is considered under two different conditions (skip breakfast and skip lunch), which were compared in a between-subjects experimental design. As shown in the graph below, the measured wight lost was normally distributed in each condition, and their variance were about the same.  <img src="images/wt-ex2.pdf" class="helpImg" width = ' + sidePanelWidth + '/> </div>');
                            break;
                    case "MannWhitneyTest": 
                            d3.select("#helpPanel").html('<h2>Mann–Whitney U test</h2> A Mann–Whitney U test (also called the Wilcoxon rank-sum test) is used when 2 conditions are compared and they are unpaired (i.e., between-groups factor). It is an alternative test for unpaired t-test. It is used when the distributions are not normal. It still requires the homogeneity of variances to hold (i.e., the distributions should have equal variance).</div> <h2>Conditions:</h2> <ul> <li>Within-subjects experimental design</li> <li>The number of Independent Variable is one</li> <li>The number of levels in Independent Variable are two</li> <li>Your independent variable should consist of two categorical, independent groups</li> <li>The dependent variable should be measured at ordinal or continous scale</li> </ul> <h2>Examples:</h2> <div class="example"> <b>Example 1:</b> In a weight loss user study, excercise of participants is considered under two different conditions (none and high), which were compared in a between-subjects experimental design. As shown in the graph below, the measured user rating was not normally distributed in each condition, but their variance were about the same. <img src="images/mwt-ex1.pdf" class="helpImg" width = ' + sidePanelWidth + '/> </div> <div class="example"> <b>Example 2:</b> In a weight loss user study, wight loss of participants is considered under two different conditions (no breakfast and no lunch), which were compared in a between-subjects experimental design. As shown in the graph below, the measured user rating was not normally distributed in each condition, but their variance were about the same. <img src="images/mwt-ex2.pdf" class="helpImg" width = ' + sidePanelWidth + '/> </div>');
                            break;
                    case "WelchTTest":
                            d3.select("#helpPanel").html('<h2>Wilcoxon signed-rank test</h2> This test is used when 2 conditions are compared and they are paired (i.e., within-groups factor). It is an alternative test for paired t-test. It is used when the distributions are not normal. It still requires the homogeneity of variances to hold (i.e., the distributions should have equal variance). </div> <h2>Conditions:</h2> <ul> <li>Within-subjects experimental design </li> <li>The number of Independent Variable is one </li> <li>The number of levels in Independent Variable are two </li> <li>Your dependent variable should be measured at the ordinal or continuous level </li> <li>The distribution of the differences between the two related groups needs to be symmetrical in shape. </li> </ul> <h2>Examples: </h2> <div class="example"> <b>Example 1:</b> <b>Example 2:</b>In an effect of food on test scores user study, two types of food items(Yogurt and Snickers) were compared in a within-subjects experimental design. As shown in the graph below, the measured verbal score was normally distributed in each condition, but they are sampled from same participants hence violating the assumption of independence.Their variance is about the same. <img src="images/wt2-ex1.pdf" class="helpImg" width = ' + sidePanelWidth + '/> </div> <div class="example"> <b>Example 2:</b> In an effect of phone operating systems emotionally on users, two types of phone operating systems(ios and android) were compared in a within-subjects experimental design. As shown in the graph below, the measured stress score was normally distributed in each condition, but they are sampled from same participants hence violating the assumption of independence condition. <img src="images/wt2-ex2.pdf" class="helpImg" width = ' + sidePanelWidth + '/> </div>');
                            break;
                    case "oneWayANOVA":
                            d3.select("#helpPanel").html('<h2>One-way ANOVA</h2> An one-way ANOVA is used when 3 or more conditions are compared and the independent variable is a between-groups factor (different participants are used for different conditions). It can be used when the distributions are normal and when homogeneity of variances is met (i.e., the distributions have equal variances). </div> <h2>Conditions:</h2> <ul> <li>Between-subjects experimental design </li> <li>The number of levels in Independent Variable are more than two </li> <li>Your dependent variable should be measured at the interval or ratio level (i.e., they are continuous) </li> <li> Your dependent variable should be approximately normally distributed for each category of the independent variable </li> <li>There should be no significant outliers </li> <li>There needs to be homogeneity of variances </li> </ul> <h2>Examples: </h2><div class="example"> <b>Example 1:</b> In a text entry user study, three keyboard layouts (QWERTY and DVORAK and Colemak) were compared in a between-subjects experimental design. As shown in the graph below, the measured task completion time were normally distributed in each condition, and their variance were radically same. <img src="images/owa-ex1.pdf" class="helpImg" width = ' + sidePanelWidth + '/> </div> <div class="example"> <b>Example 2:</b> In a weight loss user study, weight lost of participants is considered under four different conditions (skip breakfast, skip lunch, skip dinner and control), which were compared in a between-subjects experimental design. As shown in the graph below, the measured wight lost was normally distributed in each condition, and their variance were about the same.<img src="images/owa-ex2.pdf" class="helpImg" width = ' + sidePanelWidth + '/></div>');
                            break;
                    case "twA": 
                            d3.select("#helpPanel").html('<h2>Two-way ANOVA</h2> A two-way ANOVA is used when there are 2 independent variables (both must be between-groups factor) and a dependent variable. It is used to see the effect of each independent variable on the dependent variable as well as the interaction between the independent variables. </div> <h2>Conditions:</h2> <ul> <li>Between-subjects experimental design</li> <li>The number of Independent Variable are two</li> <li>The number of levels in Independent Variable are more than two</li> <li>Two independent variables should each consist of two or more categorical, independent groups</li> <li>Dependent variable should be measured at the interval or ratio level (i.e., they are continuous)</li> <li> Your dependent variable should be approximately normally distributed for each combination of the groups of the two independent variables</li> <li>The populations from which the samples were obtained must be normally or approximately normally distributed </li> <li>There should be no significant outliers</li>  <li>There needs to be homogeneity of variances for each combination of the groups of the two independent variables</li> </ul> <h2>Examples:</h2> <!-- TODO: Use interaction plot instead --> <div class="example"> <b>Example 1:</b> In a weight loss user study, weight lost of participants is considered under four different conditions (skip breakfast, skip lunch, skip dinner and control) and excercise is considered at three different levels(none , high , low), which were compared in a between-subjects experimental design. As shown in the graph below, the measured wight lost was normally distributed in each condition, and their variance were about the same.<img src="images/twa-ex1.pdf" class="helpImg" width = ' + sidePanelWidth + '/> </div> <div class="example"> <b>Example 2:</b> In a text entry user study, three keyboard layouts (QWERTY and DVORAK and Colemak) and two gender levels( male and female)  were compared in a between-subjects experimental design. As shown in the graph below, the measured task completion time were normally distributed in each condition, and their variance were radically same. <img src="images/twa-ex2.pdf" class="helpImg" width = ' + sidePanelWidth + '/> </div>');
                                break;
                    case "oneWayRepeatedMeasuresANOVA":
                            d3.select("#helpPanel").html('<h2>One-way repeated-measures ANOVA</h3> An one-way repeated measures ANOVA is used when 3 or more conditions are compared and the independent variable is a within-groups factor (same set of participants for all conditions). It can be used when the distributions are normal and when homogeneity of variances is met (i.e., the distributions have equal variances.)</div> <h2>Conditions:</h2><ul> <li>Within-subjects experimental design</li> <li>The number of Independent Variable is one</li> <li>The number of levels in Independent Variable are more than two</li> <li>Independent variable should consist of at least two categorical, "related groups" or matched pairs" </li> <li>The dependent variable should be measured at interval or ratio scale</li> <li>There should be no significant outliers in the related groups</li> <li>The distribution of the dependent variable in the two or more related groups should be approximately normally distributed</li> <li>The variances of the differences between all combinations of related groups must be equal( Sphericity) </li> </ul> <h2>Examples:</h2> <div class="example"> <b>Example 1:</b> In an effect of phone operating systems emotionally on users, three types of phone operating systems(ios,android and windows) were compared in a within-subjects experimental design. As shown in the graph below, the measured stress score was normally distributed in each condition, but they are sampled from same participants hence violating the assumption of independence condition. <img src="images/owra-ex1.pdf" class="helpImg" width = ' + sidePanelWidth + '/> </div> <div class="example"> <b>Example 2:</b> Can\'t be extracted from the provided data. </div>');
                            break;
                    case "factorialANOVA":
                            d3.select("#helpPanel").html('<h2>Mixed-design ANOVA</h2> A mixed-design ANOVA is used when there are 2 independent variables (one between-groups factor and one within-groups factor) and a dependent variable. It is used to see the effect of each independent variable on the dependent variable as well as the interaction between the two independent variables.</div><h2>Conditions:</h2><ul><li>Between-subjects experimental design</li><li>Within-subjects experimental design</li><li>The dependent variable is in interval or ratio scale</li><li>The independent variable of the within-group experiment should have at least two categorically related groups or matched groups.</li><li>The independent variable of the Between-group experiment should have at least two categorically independent groups.</li><li>No significant outliners from either Witihin-group or Between-group studies.</li><li>The dependent variable is approximately normally distributed for each combination of the groups of your two factor/independent variables.</li>    <li>Homogeneity of variances between within-group and between-group is required.</li></ul><h2>Examples:</h2><div class="example"><b>Example 1:</b> Does skipping a meal lead to weight loss? If so, does it vary for different meals? In this experiment, we compare the weight lost by participants under four different conditions: skip breakfast, skip lunch, skip dinner, and control. We measured the amount of weight lost (positive value means that weight was lost) and the absolute BMI after 3 months. The experiment follows a between-group design. Following the experiment, we also get the satisfaction rating from the participant. The amount of exercise of the participant is also considered as an independent variable. This graph depicts the between group part of the experiment wherein the dependent variable is weight loss<img src="images/fA1.pdf" class="helpImg" width = ' + sidePanelWidth + '/><b> For the same data, if we had data of weightloss over time, this would have given us the within-group data with different conditions and time as the independent variable and the weight loss being the dependent variable. </b></div><div class="example"><b>Example 2:</b> The following is an example of mathematical notation, written in LaTeX and rendered by SVG via mathjax library $a \ne 0$</div>');
                            break;
                    case "FriedmanTest":
                            d3.select("#helpPanel").html('<h2>Friedman\'s test</h2> A Friedman\'s test (or Friedman\'s analysis) is used when 3 or more conditions are compared and the independent variable is a within-groups factor (same set of participants for all conditions). It is an alternative for one-way repeated-measures ANOVA. It can be used even when the distributions are not normal but requires the homogeneity of variances to be met (i.e., the distributions must have equal variances).</div><h2>Conditions:</h2><ul><li>Between-subjects experimental design</li><li>The dependent variable is in ordinal scale (Likert scales or 5 point scale) or continuous scale</li><li>Group consists of random sample of population </li><li>Data do not need to be normally distributed</li></ul><h2>Examples:</h2><div class="example"><b>Example 1:</b> Does skipping a meal lead to weight loss? If so, does it vary for different meals? In this experiment, we compare the weight lost by participants under four different conditions: skip breakfast, skip lunch, skip dinner, and control. We measured the amount of weight lost (positive value means that weight was lost) and the absolute BMI after 3 months. The experiment follows a between-group design. Following the experiment, we also get the satisfaction rating from the participant. The amount of exercise of the participant is also considered as an independent variable. Here condition is taken as the independent variable and the corresponding weight loss is the dependent variable.<img src="images/fT1.pdf" class="helpImg" width = ' + sidePanelWidth + '/></div><div class="example"><b>Example 2:</b> Similarly with the same above experiment but with different independent variable selected, in this case exercise is taken as the independent variable and weight loss the dependent variable.<img src="images/fT2.pdf" class="helpImg" width = ' + sidePanelWidth + '/></div>');
                            break;
                    case "WelchANOVA":
                            d3.select("#helpPanel").html('<h2>Welch\'s ANOVA</h2> A Welch\'s ANOVA is used when 3 or more conditions are compared and the independent variable is a between-groups factor (different participants are used for different conditions). It is an alternative to the one-way ANOVA. It can be used used when homogeneity of variances is not met (i.e., the distributions have unequal variances). It still requires the distributions to follow normal distributions. </div> <h2>Conditions:</h2> <ul> <li>Within-subjects experimental design </li> <li> Variables under examination should be measured in interval or ratio scale </li> <li> Variables should have a linear relationship between the independent and dependent variable </li> <li> Variables should not have significant outliners </li> <li> Needs for dependent data to be normally distributed or homogeneity of variances </li> </ul>');
                            break;
                    case "KruskalWallisTest":
                            d3.select("#helpPanel").html('<h2>Kruskal-Wallis test</h2> A Kruskal-Wallis test is used when 3 or more conditions are compared and the independent variable is a between-groups factor (different participants are used for different conditions). It is an alternative to the one-way ANOVA. It can be used used when distributions are not normal. However, it requires homogeneity of variances to be met (i.e., the distributions must have equal variances). </div> <h2>Conditions:</h2> <ul>     <li>Between-subjects experimental design</li>  <li>The dependent variable is in ordinal or continuous scale</li>     <li>The dependent variable is not required to normally-distributed in each condition but homogeneity of variances should be met</li> <li> Same variability ie you have to determine whether the distribution in each group have same shape which also means same varialability. </li> </ul> <h2>Examples: </h2> <div class="example"> <b>Example 1:</b> Does skipping a meal lead to weight loss? If so, does it vary for different meals? In this experiment, we compare the weight lost by participants under four different conditions: skip breakfast, skip lunch, skip dinner, and control. We measured the amount of weight lost (positive value means that weight was lost) and the absolute BMI after 3 months. The experiment follows a between-group design. Following the experiment, we also get the satisfaction rating from the participant. The amount of exercise of the participant is also considered as an independent variable. <img src="Images/kwT1.pdf" width = ' + sidePanelWidth + '/> </div> <div class="example"> <b>Example 2:</b> Three teaching methods were tested on a group of 19 students with homogeneous backgrounds in statistics and comparable aptitudes. Each student was randomly assigned to a method and at the end of a 6-week program was given a standardized exam. Because of classroom space and group size, the students were not equally allocated to each method. The results are shown in the table below. Test for a difference in distributions (medians) of the test scores for the different teaching methods using the Kruskal-Wallis test. <img src="Images/kwT2.pdf" width = ' + sidePanelWidth + '/> </div>');
                            break;
                    case "pC":
                            d3.select("#helpPanel").html('<h2>Pearson\'s correlation coefficient</h2> A Pearson\'s correlation coefficient (<i>r</i>)is a measure of correlation (the direction of change in one variable as the other variable changes) between two ratio variables. It has a range of -1 to +1. -1 implies that one variable decreases as the other increases (negative correlation) and +1 implies one variable increases as the other increases (positive correlation). 0 implies there is no dependence between the two variables. </div> <h2>Conditions:</h2> <ul> <li>Two variables measured in interval or ratio scale </li> <li>There should be a linear relationship between the variables </li> <li> No significant outliners </li> <li> Variables are approximately normally distributed. </li> </ul> <h2>Examples:</h2> <div class="example"> <b>Example 1:</b> Does skipping a meal lead to weight loss? If so, does it vary for different meals? In this experiment, we compare the weight lost by participants under four different conditions: skip breakfast, skip lunch, skip dinner, and control. We measured the amount of weight lost (positive value means that weight was lost) and the absolute BMI after 3 months. The experiment follows a between-group design. Following the experiment, we also get the satisfaction rating from the participant. The amount of exercise of the participant is also considered as an independent variable. Here we plot data of weight loss against BMI both either interval or ratio scale measurements. <img src="images/pC1.pdf" class="helpImg" width = ' + sidePanelWidth + '/> </div> <div class="example"> <b>Example 2:</b> The following is an example of mathematical notation, written in LaTeX and rendered by SVG via mathjax library $a \ne 0$ </div>');
                            break;
                    case "kC":
                            d3.select("#helpPanel").html('<h2>Kendall\'s correlation coefficient</b> A Kendall\'s correlation coefficient (<i>𝜏</i>)is a measure of correlation (the direction of change in one variable as the other variable changes) when an interval variable is present. It has a range of -1 to +1. -1 implies that one variable decreases as the other increases (negative correlation) and +1 implies one variable increases as the other increases (positive correlation). 0 implies there is no dependence between the two variables.</div><h2>Conditions:</h2><ul><li> Variables either scalar or ordinal</li><li>The relationship between the 2 variables is monotonic</li></ul>');
                            break;
                    case "bC": 
                            d3.select("#helpPanel").html('<h2>Biserial correlation coefficient</h2> A biserial correlation coefficient (<i>r</i>) is a measure of correlation (the direction of change in one variable as the other variable changes) when one of the variables is binary (can take only two values). It has a range of -1 to +1. -1 implies that one variable decreases as the other increases (negative correlation) and +1 implies one variable increases as the other increases (positive correlation). 0 implies there is no dependence between the two variables.</div><h2>Conditions:</h2><ul><li>Between-subjects experimental design</li><li>The dependent variable is in interval or ratio scale</li><li>The independent variable is in nominal scale and is occuring artificially dichotomonous</li></ul><h2>Examples:</h2><div class="example"><b>Example 1:</b> In a text entry user study, two keyboard layouts (QWERTY and DVORAK) were compared in a between-subjects experimental design. As shown in the graph below, the measured task completion time were normally distributed in each condition, but their variance were radically different. This violates the assumption of homogeniety of variance of unpaired t-tests.<div class="example"><b>Example 2:</b> In a study of Effect of Food on Test Scores, We compare the effect of different types of food on the participant test scores. The foods considered are plain yoghurt, a snickers bar, and a sandwich. We measure the verbal (language) and the quantitative (math) scores of the participant. Since the same set of participants are used for different conditions (foodEaten), this experiment follows a within-groups design. Following the experiment, we also get the satisfaction rating from the participant. The gender of the participant is also considered as an independent variable.<img src="images/bC1.pdf" class="helpImg" width=' + sidePanelWidth + '/></div>');
                            break;
                    case "ptT":
                            d3.select("#helpPanel").html('<h2>Pairwise t-test (with Bonferroni correction)</h2> Pairwise t-tests are used as a follow up to the significance tests (ANOVAs or their alternatives). Pairwise t-tests can be used to compare two conditions when both normality of distributions and homogeneity of variances are met. </div> <p> You need to use a Bonferroni adjustment on the results you get from the Wilcoxon tests because you are making multiple comparisons, which makes it more likely that you will declare a result significant when you should not (a Type I error). Luckily, the Bonferroni adjustment is very easy to calculate; simply take the significance level you were initially using and divide it by the number of tests you are running.</p> <p><b>The Bonferroni correction</b> is a multiple-comparison correction used when several dependent or independent statistical tests are being performed simultaneously (since while a given alpha value alpha may be appropriate for each individual comparison, it is not for the set of all comparisons). In order to avoid a lot of spurious positives, the alpha value needs to be lowered to account for the number of comparisons being performed. </p> <p>The simplest and most conservative approach is the Bonferroni correction, which sets the alpha value for the entire set of n comparisons equal to alpha by taking the alpha value for each comparison equal to alpha/n. Explicitly, given n tests T_i for hypotheses  H_i (1<=i<=n) under the assumption H_0 that all hypotheses H_i are false, and if the individual test critical values are <=alpha/n, then the experiment-wide critical value is <=alpha.</p> <h2>Conditions:</h2> <ul> <li>Within-subjects experimental design</li> <li> Variables under examination should be measured in interval or ratio scale </li> <li> Variables should have a linear relationshio between the independent and dependent variable </li> <li> Variables should not have significant outliners </li> <li> Need for dependent data to be normally distributed or homogeneity of variances</li></ul>');
                            break;
                    case "pwT":
                            d3.select("#helpPanel").html('<h2>Pairwise Wilcoxon-test (with Bonferroni correction)</h2> Pairwise Wilcox-tests are used as a follow up to the significance tests (ANOVAs or their alternatives). Pairwise t-tests can be used to compare two conditions when homogeneity of variances is met. It doens\'t require the distributions to be normal. </div> <p> You need to use a Bonferroni adjustment on the results you get from the Wilcoxon tests because you are making multiple comparisons, which makes it more likely that you will declare a result significant when you should not (a Type I error). Luckily, the Bonferroni adjustment is very easy to calculate; simply take the significance level you were initially using and divide it by the number of tests you are running.</p> <p><b>The Bonferroni correction</b> is a multiple-comparison correction used when several dependent or independent statistical tests are being performed simultaneously (since while a given alpha value alpha may be appropriate for each individual comparison, it is not for the set of all comparisons). In order to avoid a lot of spurious positives, the alpha value needs to be lowered to account for the number of comparisons being performed. </p> <p>The simplest and most conservative approach is the Bonferroni correction, which sets the alpha value for the entire set of n comparisons equal to alpha by taking the alpha value for each comparison equal to alpha/n. Explicitly, given n tests T_i for hypotheses  H_i (1<=i<=n) under the assumption H_0 that all hypotheses H_i are false, and if the individual test critical values are <=alpha/n, then the experiment-wide critical value is <=alpha.</p> <h2>Conditions:</h2> <ul> <li>Within-subjects experimental design </li> <li> Variables under examination should be measured in interval or ratio scale </li> <li> Variables should not have significant outliners </li> <li> No need for dependent data to be normally distributed or homogeneity of variances </li> <li> Data must have homogeneity of variances between groups. </li> </ul>');
                            break;
                    case "linR":
                            d3.select("#helpPanel").html('<h2> Linear regression </h2> Linear regression is used to construct a model (usually a line) to predict the outcome variable from the causal/explanatory variable.</div><h2>Conditions:</h2><ul><li> Variables under examination should be measured in interval or ratio scale </li><li> Variables should have a linear relationship between them </li><li> Variables should not have significant outliners</li><li> Data collected for the two variables under examination should have homoscedasticity </li> <li> The residuals(errors) of the regression line are approximatelynormally distributed </li> </ul> <p><b>homoscedasticity</b>  is where the variances along the line of best fit remain similar as you move along the line. Whilst we explain more about what this means and how to assess the homoscedasticity of your data in our enhanced linear regression line, take a look at the two scatterplots below, which provide two simple examples: one of data that meets this assumption and one that fails the assumption.</p> <img src="images/linR0.pdf" class="helpImg" width = ' + sidePanelWidth + '/> <p><b>Note:</b>When you analyse your own data, you will be lucky if your scatterplot looks like either of the two above. Whilst these help to illustrate the differences in data that meets or violates the assumption of homoscedasticity, real-world data is often a lot more messy. </p> <h2>Examples:</h2> <div class="example"> <b>Example 1:</b> Effect of food on Test Scores: We compare the effect of different types of food on the participant\'s test scores. The foods considered are plain yoghurt, a snickers bar, and a sandwich. We measure the verbal (language) and the quantitative (math) scores of the participant. Since the same set of participants are used for different conditions (foodEaten), this experiment follows a within-groups design. Following the experiment, we also get the satisfaction rating from the participant. The gender of the participant is also considered as an independent variable. For this we have made the verbalScore as independent variable and the corresponding Mathscore as the dependent variable as both of them are measured in ratio scale.<img src="images/linR1.pdf" class="helpImg" width = ' + sidePanelWidth + '/></div><div class="example"><b>Example 2:</b> Speed vs. stopping distance of 50 cars <img src="images/linR2.pdf" width = ' + sidePanelWidth + ' class="helpImg"/></div>');
                            break;
                    case "mulR": 
                            d3.select("#helpPanel").html('<h2> Multiple regression </h2> Multiple regression is an extension of linear regression where we construct a model to predict the outcome variable from multiple causal/explanatory variables.</div> <h2>Conditions:</h2> <ul> <li> Variables under examination should be measured in interval or ratio scale </li> <li> Two or more independent variables which either are in ratio/interval scale or ordinal/nominal scale </li> <li> Variables should have a linear relationshio between the independent and dependent variable </li> <li> Variables should not have significant outliners </li> <li> Data collected for the two variables under examination should have homoscedasticity and should not show multicollinearity </li> <li> The residuals(errors) of the regression line are approximatelynormally distributed </li> </ul> <p><b>homoscedasticity</b>  is where the variances along the line of best fit remain similar as you move along the line. Whilst we explain more about what this means and how to assess the homoscedasticity of your data in our enhanced linear regression line, take a look at the two scatterplots below, which provide two simple examples: one of data that meets this assumption and one that fails the assumption.</p> <img src="images/linR0.pdf" class="helpImg" width = ' + sidePanelWidth + '/> <p><b>Note:</b>When you analyse your own data, you will be lucky if your scatterplot looks like either of the two above. Whilst these help to illustrate the differences in data that meets or violates the assumption of homoscedasticity, real-world data is often a lot more messy. </p>');
                            break;
                }
            }
            
            if(target.className.baseVal == "effectSizeHelp")
            {

                setup(e, target);
                document.getElementById("helpPanel").innerHTML = "";
                d3.select("#helpPanel").append("label")
                                    .attr("id", "descriptionLabel")
                                    .text("Hover over a visible element to get help");
                var helpText = d3.select("#descriptionLabel");
                
                d3.select(".effectSizeHelp").attr("opacity","0.3").attr("cursor", "help");
                
                switch(multiVariateTestResults["effect-size-type"])
                {
                    case 'd':
                            d3.select("#helpPanel").html('<b>Cohen\'s (<i>d</i>)</b> is an effect size used to indicate the magnitude of difference between two means as a factor of standard deviation (see formula below). It has a range of 0 to infinity. It is used in reporting the results of t-tests. Cohen\'s <i>d</i> can be calculated as the difference between the compared means divided by the pooled standard deviation. <br/><br/> A Cohen\'s d of 0.2, 0.5, and 0.8 can be interpreted as small, medium, and large effect sizes respectively.<br/><h2>Example</h2><img src="images/d.pdf" class="helpImg" width = ' + sidePanelWidth + '/><br/><br/>In a text entry study, the speed of two different keyboard layouts (QWERTY, Colemak) are compared. The difference between the means is given by a Cohen\'s d of 0.45, which shows that the distributions are 0.45 times the pooled SD apart from each other.');
                            break; 
                    case 'ηS':
                            d3.select("#helpPanel").html('<b>Generalized eta-squared (<i>η^2</i>)</b> indicates the amount of variance (change) in the dependent variable caused by the independent variable(s). It has a range of 0 to 1. It is used in reporting the results of ANOVAs. It is analogous to R-squared, which is used in multiple regression. An eta-squared of 0.04, 0.35, and 0.65 can be interpreted as small, medium, and large effect sizes respectively.<br/>'); //ToDO: ges example!
                            break;
                    case 'rS':
                            d3.select("#helpPanel").html('<b>Coefficient of determination (<i>R^2</i>)</b> indicates how well the data fits a statistical model (e.g., line or curve). The coefficient of determination varies from 0 to 1. It is used in reporting the results of a simple linear regression or a multiple regression. A coefficient of determination of 0.04, 0.35, and 0.65 can be interpreted as small, medium, and large effect sizes respectively.<br/>');
                            break;
                    case 'r':
                            d3.select("#helpPanel").html('<h2>Pearson\'s correlation coefficient</h2> A Pearson\'s correlation coefficient (<i>r</i>)is a measure of correlation (the direction of change in one variable as the other variable changes) between two ratio variables. It has a range of -1 to +1. -1 implies that one variable decreases as the other increases (negative correlation) and +1 implies one variable increases as the other increases (positive correlation). 0 implies there is no dependence between the two variables. </div> <h2>Conditions:</h2> <ul> <li>Two variables measured in interval or ratio scale </li> <li>There should be a linear relationship between the variables </li> <li> No significant outliners </li> <li> Variables are approximately normally distributed. </li> </ul> <h2>Examples:</h2> <div class="example"> <b>Example 1:</b> Does skipping a meal lead to weight loss? If so, does it vary for different meals? In this experiment, we compare the weight lost by participants under four different conditions: skip breakfast, skip lunch, skip dinner, and control. We measured the amount of weight lost (positive value means that weight was lost) and the absolute BMI after 3 months. The experiment follows a between-group design. Following the experiment, we also get the satisfaction rating from the participant. The amount of exercise of the participant is also considered as an independent variable. Here we plot data of weight loss against BMI both either interval or ratio scale measurements. <img src="images/pC1.pdf" class="helpImg" width = ' + sidePanelWidth + '/> </div> <div class="example"> <b>Example 2:</b> The following is an example of mathematical notation, written in LaTeX and rendered by SVG via mathjax library $a \ne 0$ </div>');
                            break;
                    case '𝜏':
                            d3.select("#helpPanel").html('<h2>Kendall\'s correlation coefficient</b> A Kendall\'s correlation coefficient (<i>𝜏</i>)is a measure of correlation (the direction of change in one variable as the other variable changes) when an interval variable is present. It has a range of -1 to +1. -1 implies that one variable decreases as the other increases (negative correlation) and +1 implies one variable increases as the other increases (positive correlation). 0 implies there is no dependence between the two variables.</div><h2>Conditions:</h2><ul><li> Variables either scalar or ordinal</li><li>The relationship between the 2 variables is monotonic</li></ul>');
                            break;
                }                
            }
            
            if(target.className.baseVal == "variancePlotHelp")
            {
                setup(e, target);
                document.getElementById("helpPanel").innerHTML = "";
                d3.select("#helpPanel").append("label")
                                    .attr("id", "descriptionLabel")
                                    .text("Hover over a visible element to get help");
                
                var visualisation = selectedVisualisation;
                var helpText = d3.select("#descriptionLabel");
                
                d3.select(".variancePlotHelp").attr("opacity","0.3").attr("cursor", "help");

                helpText.text(desc["variancePlot"]);                
            }
            
            if(target.className.baseVal == "normalityPlotHelp")
            {
                setup(e, target);
                document.getElementById("helpPanel").innerHTML = "";
                d3.select("#helpPanel").append("label")
                                    .attr("id", "descriptionLabel")
                                    .text("Hover over a visible element to get help");
                
                var visualisation = selectedVisualisation;
                var helpText = d3.select("#descriptionLabel");
                
                d3.select(".normalityPlotHelp").attr("opacity","0.3").attr("cursor", "help");

                helpText.text(desc["normalityPlot"]);                
            }
            
            if(target.className.baseVal == "assumptionsText")
            {
                setup(e, target);

                var assumptionType = target.id;
                
                d3.select("#" + assumptionType + ".assumptionsButtonBack").attr("stroke-width","2px");
                d3.select("#" + assumptionType + ".assumptionsButtonFront").attr("cursor", "help");

                if(assumptionType == "normality")
                    d3.select("#helpPanel").html('<h2>Normality</h2> This assumption is met when the distributions that are compared are normally distributed. A normal or Gaussian distribution can be identified by a characteristic bell-shaped curve.<h2>Examples:</h2><div class="example"><b>Example 1: Data not normally distributed</b> <br/> <br/> Fitts law experiment conducted with 10 candidates and histogram created for 80 data points for task completion in milliseconds. The histogram shows that the distribution is multi-modal (multiple local-maximas) and does not have the characteristic bell-shaped curve. <img src="images/normality_1.pdf" width=' + sidePanelWidth + '/></div><div class="example"><b>Example 2: Data normally distributed</b> <br/> <br/> Height of 40 men plotted. The resulting histogram shows that the distribution is normal with a character bell-shaped curve. <img src="images/normality_2.pdf" width=' + sidePanelWidth + '/><br/>');
                else
                    d3.select("#helpPanel").html('<h2>Homogeneity/Homoscedasticity</h2> This assumption is met when the distributions have almost similar variances (the spread of the data).</div> Homoscedasticity holds true when the variances along the line of best fit remain similar (on either side of the line) as you move along the line. The two scatterplots below provide two simple examples: one of data that meets this assumption and one that fails the assumption. <img src="images/lineR0.pdf" width = ' + sidePanelWidth + '/></div><b>Note:</b> When you analyse your own data, you will be lucky if your scatterplot looks like either of the two above. Whilst these help to illustrate the differences in data that meets or violates the assumption of homoscedasticity, real-world data is often a lot more messy and would require statistical tests to check if homoscedasticity holds true. <div class="example"><h2>Examples</h2> <b> Example 1: Homoscedastic data </b> <br/> <br/> Are males and females distributed equally among the sampled schools? In this example they <i>are</i> equally distributed and thus homogeneity holds. In other words, the proportion of males accepted into each school is the same as the proportion of females accepted into each school. Thus, the proportion of students accepted into each school is equal, regardless of gender. We can therefore conclude that males and females are distributed equally among the four schools. <img src="images/homogeneity_1.pdf" width = ' + sidePanelWidth + '/> <b> Example 2: Heteroscedastic data </b> </br/> </br/> The same study for a different set of data values is as follows : <img src="images/homogeneity_2.pdf" width = ' + sidePanelWidth + '/> Here, the proportion of males accepted into each school is different than the proportion of females accepted into each school. Therefore, the proportion of students accepted into each school, regardless of gender, is different than the proportion of males and females accepted into each school. We can thus conclude that males and females are not distributed equally among the four schools. </div>');                                
            }
            
            if(target.className.baseVal == "compareMean")
            {
                setup(e, target);
                document.getElementById("helpPanel").innerHTML = "";
                d3.select("#helpPanel").append("label")
                                    .attr("id", "descriptionLabel")
                                    .text("Hover over a visible element to get help");
                var assumptionType = target.id;                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#button.compareMean").attr("stroke-width","2px").attr("cursor", "help");
                d3.select("#text.compareMean").attr("cursor", "help");
                
                helpText.text(desc["compareMean"]);   
            }
            
            if(target.className.baseVal == "compareNow")
            {
                setup(e, target);
                document.getElementById("helpPanel").innerHTML = "";
                d3.select("#helpPanel").append("label")
                                    .attr("id", "descriptionLabel")
                                    .text("Hover over a visible element to get help");
                var assumptionType = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#button.compareNow").attr("stroke-width","2px").attr("cursor", "help");
                d3.select("#text.compareNow").attr("cursor", "help");
                
                helpText.text(desc["compareNow"]);   
            }
            
            if(target.className.baseVal == "pairwisePostHoc")
            {
                setup(e, target);
                document.getElementById("helpPanel").innerHTML = "";
                d3.select("#helpPanel").append("label")
                                    .attr("id", "descriptionLabel")
                                    .text("Hover over a visible element to get help");
                var assumptionType = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#button.pairwisePostHoc").attr("stroke-width","2px").attr("cursor", "help");
                d3.select("#text.pairwisePostHoc").attr("cursor", "help");
                
                helpText.text(desc["pairwisePostHoc"]);   
            }
            
            if(target.className.baseVal == "tukeyHSD")
            {
                setup(e, target);
                document.getElementById("helpPanel").innerHTML = "";
                d3.select("#helpPanel").append("label")
                                    .attr("id", "descriptionLabel")
                                    .text("Hover over a visible element to get help");
                var assumptionType = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#button.tukeyHSD").attr("stroke-width","2px").attr("cursor", "help");
                d3.select("#text.tukeyHSD").attr("cursor", "help");
                
                helpText.text(desc["tukeyHSD"]);   
            }
            
            if(target.className.baseVal == "regression")
            {
                setup(e, target);
                document.getElementById("helpPanel").innerHTML = "";
                d3.select("#helpPanel").append("label")
                                    .attr("id", "descriptionLabel")
                                    .text("Hover over a visible element to get help");
                var assumptionType = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#button.regression").attr("stroke-width","2px").attr("cursor", "help");
                d3.select("#text.regression").attr("cursor", "help");
                
                helpText.text(desc["regression"]);   
            }
            
            if(target.id == "regressionLine")
            {
                setup(e, target);
                document.getElementById("helpPanel").innerHTML = "";
                d3.select("#helpPanel").append("label")
                                    .attr("id", "descriptionLabel")
                                    .text("Hover over a visible element to get help");
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.selectAll("#regressionLine").attr("stroke-width", "12px").attr("cursor", "help");
                
                helpText.text(desc["regressionLine"]);
            }
            
            if(target.id == "equation")
            {
                setup(e, target);
                document.getElementById("helpPanel").innerHTML = "";
                d3.select("#helpPanel").append("label")
                                    .attr("id", "descriptionLabel")
                                    .text("Hover over a visible element to get help");
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.selectAll("#equation").attr("fill", "light#627bf4").attr("cursor", "help");
                
                helpText.text(desc["equation"]);
            }
            
            if(target.className.baseVal == "interactionEffect")
            {
                setup(e, target);
                document.getElementById("helpPanel").innerHTML = "";
                d3.select("#helpPanel").append("label")
                                    .attr("id", "descriptionLabel")
                                    .text("Hover over a visible element to get help");
                var assumptionType = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#button.interactionEffect").attr("stroke-width","2px").attr("cursor", "help");
                d3.select("#text.interactionEffect").attr("cursor", "help");
                
                helpText.text(desc["interactionEffect"]);   
            }
            
            if((target.className.baseVal == "variableNameHolderFront"))
            {
                setup(e, target);
                document.getElementById("helpPanel").innerHTML = "";
                d3.select("#helpPanel").append("label")
                                    .attr("id", "descriptionLabel")
                                    .text("Hover over a visible element to get help");
                var varName = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#" + varName + ".variableNameHolderBack").attr("stroke-width","2px");
                d3.select("#" + varName + ".variableNameHolderFront").attr("cursor", "help");
                
                helpText.text(desc["variables"][varName]);                
            }

            if((target.className.baseVal == "visualisationHolderFront"))
            {
                setup(e, target);
                document.getElementById("helpPanel").innerHTML = "";
                d3.select("#helpPanel").append("label")
                                    .attr("id", "descriptionLabel")
                                    .text("Hover over a visible element to get help");
                var visualisationName = target.id;
                console.log(visualisationName);
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#" + visualisationName + ".visualisationHolder").attr("stroke-width","2px");
                d3.select("#" + visualisationName + ".visualisationHolderFront").attr("cursor", "help");
                
                helpText.text(desc["visualisation"][visualisationName]);                
            }

            if((target.className.baseVal == "disabled"))
            {
                setup(e, target);
                document.getElementById("helpPanel").innerHTML = "";
                d3.select("#helpPanel").append("label")
                                    .attr("id", "descriptionLabel")
                                    .text("Hover over a visible element to get help");
                var varName = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#" + varName + ".disabled").attr("cursor", "help");
                
                helpText.text(desc["variables"][varName]);                
            }

            if(target.id == "historyButtonFront")
            {
                setup(e, target);

                d3.select("#historyButtonFront").attr("cursor", "pointer");
            }
        }
        else
        {
            /** Hover actions for DOM elements */            
            if(target.className.baseVal == "statisticalTestNodes")
            {
                var node = d3.select("#" + target.id + ".statisticalTestNodes");

                if((node.attr("fill") == "green") || (node.attr("fill") == "yellow") || (node.attr("fill") == "red"))
                    node.attr("cursor", "pointer");                
                else                                
                    node.attr("cursor", "default");                                
            }
            if(target.className.baseVal == "effectPlotRects")
            {
                d3.selectAll(".effectPlotRects").attr("cursor", "pointer");
            }
            if(target.id== "postHocTest")
            {
                showToolTip(target);
            }
            if(target.id== "statisticalTest")
            {
                showToolTip(target);   
            }
            if((target.id == "statisticalTestName") || (target.id == "postHocTestName"))
            {                
                // Set the cursor as a pointer when the text is underlined
                setup(e, target);                
                var element = d3.select("#" + target.id + ".assumptionNodes");                           

                if(element.style("text-decoration") == "underline")
                    element.style("cursor", "pointer");
                else
                    element.style("cursor", "default");
            }
            if((target.className.baseVal == "clickablesButton") || (target.className.baseVal == "clickablesText"))
            {
                var button = d3.select("#" + target.id + ".clickablesButton");
                var text = d3.select("#" + target.id + ".clickablesText");

                if(button.attr("fill") == "lightgrey")
                {
                    button.attr("cursor", "default");
                    text.attr("cursor", "default");
                }
                else
                {
                    button.attr("cursor", "pointer");
                    text.attr("cursor", "pointer");
                }
            }
            if(target.className.baseVal == "navigationArrowEffects")
            {
                d3.selectAll(".navigationArrowEffects").attr("cursor", "pointer");
            }            
            if(target.className.baseVal == "postHocComparisonTableClickableCells")
            {
                d3.selectAll(".postHocComparisonTableClickableCells").attr("cursor", "pointer");
            }
            if(target.className.baseVal == "advancedPlotButton")
            {
                setup(e, target);

                d3.select("#" + target.id + ".advancedPlotButton").attr("cursor", "pointer");
            }

            if(target.className.baseVal == "postHocComparison")
            {
                d3.selectAll(".postHocComparison").attr("cursor", "pointer");
            }

            if((target.id == "moreText") || (target.id == "lessText"))
            {
                if(target.id == "moreText")
                {                 
                    if(d3.select("#" + target.id).attr("fill") == "white")
                    {
                        d3.select("#" + target.id).attr("cursor", "default");
                        return;
                    }
                }                

                d3.select("#" + target.id).attr("cursor", "pointer");
            }
            if(target.id == "settingsButtonFront")
            {
                setup(e, target);

                d3.select("#settingsButtonFront").attr("cursor", "pointer");
            }
            if(target.className.baseVal == "nodes" && (target.id.indexOf("Homogeneity") != -1) || (target.id.indexOf("Normality") != -1))
            {
                setup(e, target);               

                // var node = d3.select("#" + target.id + ".nodes");
                // var assumptionType = target.id.indexOf("Homogeneity") != -1 ? "Homogeneity" : "Normality";

                // var canvas = Snap("#decisionTreeCanvas");
                // var toolTipSize = scaleForWindowSize(200);

                // var offset = scaleForWindowSize(15);
                // var x = (e.pageX - variablesPanelWidth + offset + toolTipSize) > plotPanelWidth ? (e.pageX - variablesPanelWidth - offset - toolTipSize) : (e.pageX - variablesPanelWidth + offset);

                // canvas.rect(x, e.pageY + offset, toolTipSize, toolTipSize).attr({stroke: "black", fill: "beige", id: "hoverRect"});
            }
            if(target.className.baseVal == "decisionTreeBackButton")
            {
                setup(e, target);

                d3.selectAll(".decisionTreeBackButton").attr("cursor", "pointer");
            }
            if(target.className.baseVal == "variableNameHolderFront")
            {		
                setup(e, target);
        
                var variableNameHolder = d3.selectAll("#" + target.id + ".variableNameHolderFront");
                variableNameHolder.attr("cursor","pointer");
            }

            else if(target.id == "generateButtonFront")
            {
                setup(e, target);

                d3.select("#generateButtonFront").attr("cursor", "pointer");
            }

            else if(target.className.baseVal == "historyEntry")
            {
                setup(e, target);

                d3.select("#" + target.id + ".historyEntry").attr("cursor", "pointer");
            }

            else if(target.className.baseVal == "starImage")
            {
                setup(e, target);

                var starImage = d3.select("#" + target.id + ".starImage");
                starImage.attr("cursor", "pointer");
            }

            else if(target.className.baseVal == "checkboxImage")
            {
                setup(e, target);

                var checkboxImage = d3.select("#" + target.id + ".checkboxImage");
                checkboxImage.attr("cursor", "pointer");
            }

            else if(target.id == "historyButtonFront")
            {
                setup(e, target);

                var historyButtonBack = d3.select("#historyButtonBack.sideCanvasButtons");
                var historyButtonFront = d3.select("#historyButtonFront.sideCanvasButtons");

                if(historyButtonBack.attr("fill") == "#f8f9f7")
                {
                    historyButtonFront.attr("cursor", "pointer");
                }
            }

            else if(target.id == "helpButtonFront")
            {
                setup(e, target);

                var helpButtonBack = d3.select("#helpButtonBack.sideCanvasButtons");
                var helpButtonFront = d3.select("#helpButtonFront.sideCanvasButtons");

                if(helpButtonBack.attr("fill") == "#f8f9f7")
                    helpButtonFront.attr("cursor", "pointer");
            }

            else if(target.id == "reportButtonFront")
            {
                setup(e, target);

                d3.select("#reportButtonFront.sideCanvasButtons").attr("cursor", "pointer");
            }

            else if(target.id == "backButtonFront")
            {
                setup(e, target);

                d3.select("#backButtonFront.sideCanvasButtons").attr("cursor", "pointer");
            }

    
            else if(target.className.baseVal == "visualisationHolderFront")
            {		
                setup(e, target);
        
                var visualisationHolder = d3.selectAll("#" + target.id + ".visualisationHolderFront");
                visualisationHolder.attr("cursor","pointer");
            }
    
            else if(target.className.baseVal == "variableTypeToggleButton")
            {
                setup(e, target);
        
                var toggleButton = d3.select("#" + target.id + ".variableTypeToggleButton");
        
                toggleButton.attr("cursor", "pointer");
            }
    
            else if(target.className.baseVal == "dependentVariableButtonFront")
            {
                setup(e, target);
        
                var variableButton = d3.select("#" + target.id + ".dependentVariableButtonBack");
                //if not selected
                if(variableButton.attr("fill") != variableTypeButtonColors["dependent"]["selected"])
                {
                    d3.select("#" + target.id + "." + target.className.baseVal).attr("cursor", "pointer");
                }
                else
                {
                    d3.select("#" + target.id + "." + target.className.baseVal).attr("cursor", "default");
                }
            }
    
            else if(target.className.baseVal == "independentVariableButtonFront")
            {
                setup(e, target);
        
                var variableButton = d3.select("#" + target.id + ".independentVariableButtonBack");
                //if not selected
                if(variableButton.attr("fill") != variableTypeButtonColors["independent"]["selected"])
                {
                    d3.select("#" + target.id + "." + target.className.baseVal).attr("cursor", "pointer");
                }
                else
                {
                    d3.select("#" + target.id + "." + target.className.baseVal).attr("cursor", "default");
                }
            }
    
            else if(target.className.baseVal == "disabled")
            {
                setup(e, target);

                if((target.id == "button") || (target.id == "text"))
                    return;
        
                var variableHolder = d3.select("#" + target.id + ".disabled");
                variableHolder.attr("cursor", "pointer");
            }
    
            else if((target.className.baseVal == "means") || (target.className.baseVal == "medians"))
            {
                showToolTip(target);
            }
    
            else if(target.className.baseVal == "compareNow")
            {
                setup(e, target);
            
                d3.selectAll(".compareNow").attr("cursor", "pointer");
            }    
    
            else if(target.className.baseVal == "compareMean")
            {
                setup(e, target);
            
                d3.selectAll(".compareMean").attr("cursor", "pointer");
            }    
        
            else if(target.className.baseVal == "selectAll")
            {
                setup(e, target);
            
                d3.selectAll(".selectAll").attr("cursor", "pointer");
            }
        
            else if(target.className.baseVal == "selectNone")
            {
                setup(e, target);
            
                d3.selectAll(".selectNone").attr("cursor", "pointer");
            }
        
            else if(target.className.baseVal == "assumptionsText")
            {
                setup(e, target);
            
                d3.selectAll("#" + target.id + ".assumptionsText").attr("cursor", "pointer");
            }
    
            else if(target.className.baseVal == "bins")
            {		
                setup(e, target);
        
                highlightBinWithId(target.id);
            }   
    
            else if(target.className.baseVal == "datapoints")
            {		
                setup(e, target);
    
                var datapoint = d3.select("#" + target.id + ".datapoints");
        
                datapoint.transition().duration(300).attr("r", "5px");
        
                var altScatterPlot = false;
                var text = new Array();
        
                //Get data, minimums and maximums for each selected variable
                for(var i=0; i<selectedVariables.length; i++)
                {   
                    if(variableRoles[selectedVariables[i]] == false && selectedVariables.length > 1)
                    {
                        // Levels are needed when we have a independent variable and one or more dependent variables
                        levels = variables[selectedVariables[i]]["dataset"].unique();            
                        altScatterPlot = true;
                    }
                }
    
                for(var i=0; i<selectedVariables.length; i++)
                {        
                    if(altScatterPlot)
                    {
                        if(variableRoles[selectedVariables[i]] != false)
                        {
                            //for the dependent variable(s)
                
                            for(var j=0; j<levels.length; j++)
                            {
                                // for each level of the independent variable, find the dependent variables                    
                    
                                text[j] = variables[selectedVariables[i]][levels[j]];
                            }
                        }  
                    }
                    else 
                    {               
                        text[i] = variables[selectedVariables[i]]["dataset"];                
                    }             
                }
        
                var mouseX = e.pageX - (width - plotPanelWidth - sideBarWidth);
                var mouseY = e.pageY;
        
                var canvas = d3.select("#plotCanvas");
                canvas.append("text")
                        .attr("x", mouseX + 10)
                        .attr("y", mouseY + 15)
                        .attr("fill", meanColors["normal"])
                        .text(text[0][removeAlphabetsFromString(datapoint.attr("id"))] + ", " + text[1][removeAlphabetsFromString(datapoint.attr("id"))])
                        .attr("class", "hoverText");
                
                var xLine = canvas.append("line")
                        .attr("x1", datapoint.attr("cx"))
                        .attr("y1", datapoint.attr("cy"))
                        .attr("x2", datapoint.attr("cx"))
                        .attr("y2", datapoint.attr("cy"))
                        .attr("stroke", meanColors["normal"])
                        .attr("stroke-dasharray", "5,5")
                        .attr("id", "x")
                        .attr("class", "hoverText");
        
                xLine.transition().duration(500).attr("x2", plotPanelWidth/2 - plotWidth/2 - axesOffset);
        
                var yLine = canvas.append("line")
                        .attr("x1", datapoint.attr("cx"))
                        .attr("y1", datapoint.attr("cy"))
                        .attr("x2", datapoint.attr("cx"))
                        .attr("y2", datapoint.attr("cy"))
                        .attr("stroke", meanColors["normal"])
                        .attr("stroke-dasharray", "5,5")
                        .attr("id", "y")
                        .attr("class", "hoverText");
        
                yLine.transition().duration(500).attr("y2", plotPanelHeight/2 + plotHeight/2 - topOffset + axesOffset);
                
        
            }   
    
            else if(target.className.baseVal == "transformToNormal")
            {
                setup(e, target);
                d3.selectAll(".transformToNormal").attr("cursor", "pointer");
            }

            else if(target.className.baseVal == "dontTransformToNormal")
            {
                setup(e, target);
                d3.selectAll(".dontTransformToNormal").attr("cursor", "pointer");
            }
        
            else if(target.className.baseVal == "transformToHomogeneity")
            {
                setup(e, target);
                d3.selectAll(".transformToHomogeneity").attr("cursor", "pointer");
            }

            else if(target.className.baseVal == "dontTransformToHomogeneity")
            {
                setup(e, target);
                d3.selectAll(".dontTransformToHomogeneity").attr("cursor", "pointer");
            }
    
            else if(target.className.baseVal == "fullscreen")
            {
                // grab the mouse position
                _startX = e.clientX;
                _startY = e.clientY;
                // we need to access the element in OnMouseMove
                _dragElement = target;

                // tell our code to start moving the element with the mouse
            //     document.onmousemove = OnMouseMove;

                // cancel out any text selections
                document.body.focus();

                // prevent text selection in IE
                document.onselectstart = function () { return false; };
                // prevent IE from trying to drag an image
                target.ondragstart = function() { return false; };
        
                var button = d3.select(".fullscreen");
                button.attr("cursor", "pointer");
            }
        
            else if(target.className.baseVal == "helpButtonFront")
            {
                setup(e, target);
            
                var helpButton = d3.select(".helpButtonFront");
                var helpButtonText = d3.select(".helpButtonText");
                
//                 if(currentState().substate = "base"
            
                helpButton.attr("cursor", "pointer");
                helpButtonText.attr("cursor", "pointer");
            } 
            
            else if(target.className.baseVal == "resetButton")
            {
                setup(e, target);
            
                d3.selectAll(".resetButton").attr("cursor", "pointer");            
            } 
    
            else if(target.className.baseVal == "outliers")
            {
                showToolTip(target);                               
            }
    
            else if((target.className.baseVal == "TOPFringes") || (target.className.baseVal == "BOTTOMFringes"))
            {
                setup(e, target);
                var canvas = d3.select("#plotCanvas");
                var tFringe = d3.select("#" + target.id + ".TOPFringes");
                var bFringe = d3.select("#" + target.id + ".BOTTOMFringes");
        
                tFringe.attr("stroke-width", 4);
                bFringe.attr("stroke-width", 4);
        
                canvas.append("line")       
                        .attr("x1", tFringe.attr("x1"))
                        .attr("y1", tFringe.attr("y1"))
                        .attr("x2", plotPanelWidth/2 - plotWidth/2 - axesOffset)
                        .attr("y2", tFringe.attr("y1"))
                        .attr("stroke-dasharray", "5,5")
                        .attr("stroke", "black")
                        .attr("class", "hover");    
        
                 canvas.append("line")       
                        .attr("x1", bFringe.attr("x1"))
                        .attr("y1", bFringe.attr("y1"))
                        .attr("x2", plotPanelWidth/2 - plotWidth/2 - axesOffset)
                        .attr("y2", bFringe.attr("y1"))
                        .attr("stroke-dasharray", "5,5")
                        .attr("stroke", "black")
                        .attr("class", "hover");    
    
                canvas.append("text")
                        .attr("x", (parseFloat(tFringe.attr("x1")) + parseFloat(tFringe.attr("x2")))/2)
                        .attr("y", parseFloat(tFringe.attr("y1")) - displayOffsetTop)
                        .attr("text-anchor", "middle")
                        .text(dec2(getActualValue(tFringe.attr("y1"))))
                        .attr("class", "hover");
        
                canvas.append("text")
                        .attr("x", (parseFloat(bFringe.attr("x1")) + parseFloat(bFringe.attr("x2")))/2)
                        .attr("y", parseFloat(bFringe.attr("y1")) + displayOffsetBottom)
                        .attr("text-anchor", "middle")
                        .text(dec2(getActualValue(bFringe.attr("y1"))))
                        .attr("class", "hover");
                
            }
    
            else if((target.className.baseVal == "CIs") || (target.className.baseVal == "CITopFringes") || (target.className.baseVal == "CIBottomFringes"))
            {
                var element = d3.select("#" + target.id + ".CIs");
                showToolTip(element);
            }

            else if(target.className.baseVal == "CIMean")
            {
                if(target.id == "center")
                {
                    //nothing
                }

                var element = d3.select("#" + target.id + ".CIMean");
                showToolTip(element);
            }
            
            else if(target.id == "differenceInMeansMain")
            {
                var element = d3.select("#differenceInMeansMain");
                showToolTip(element);
            }
    
            else if(target.className.baseVal == "regression")
            {
                var regressionElements = d3.selectAll(".regression").attr("cursor", "pointer");
            }
    
            else if(target.className.baseVal == "outcomeVariable")
            {
                setup(e, target);
        
                var outcomeVariableButton = d3.select("#button.outcomeVariable");
                var outcomeVariableText = d3.select("#text.outcomeVariable");
        
                d3.selectAll(".outcomeVariable").attr("cursor", "pointer");
            }
    
            else if(target.className.baseVal == "tukeyMean")
            {
                setup(e, target);
        
                var mean = d3.select("#" + target.id + ".tukeyMean");
                var canvas = d3.select("#plotCanvas");
        
                canvas.append("line")
                        .attr("x1", mean.attr("cx"))
                        .attr("y1", mean.attr("cy"))
                        .attr("x2", plotPanelWidth/2 - plotWidth/2 - axesOffset)
                        .attr("y2", mean.attr("cy"))
                        .attr("stroke", mean.attr("fill"))
                        .attr("stroke-dasharray", "5,5")
                        .attr("class", "hover");
        
                canvas.append("text")
                        .attr("x", e.pageX - (width - plotPanelWidth - sideBarWidth) + 9)
                        .attr("y", e.pageY + 9)
                        .attr("fill", "black")
                        .text(tukeyResults[mean.attr("data-index1")][mean.attr("data-index2")]["difference"])
                        .attr("class", "hover");
            }
    
            else if((target.className.baseVal == "tukeyCI") || (target.className.baseVal == "tukeyCITop") || (target.className.baseVal == "tukeyCIBottom"))
            {
                setup(e, target);
        
                var tCI = d3.select("#" + target.id + ".tukeyCI");
                var tCITop = d3.select("#" + target.id + ".tukeyCITop");
                var tCIBottom = d3.select("#" + target.id + ".tukeyCIBottom");
        
                var canvas = d3.select("#plotCanvas");
                
                canvas.append("text")
                        .attr("x", tCITop.attr("x1"))
                        .attr("y", tCITop.attr("y1") - displayOffsetTop)
                        .attr("text-anchor", "middle")
                        .attr("fill", "black")
                        .text(tukeyResults[tCITop.attr("data-index1")][tCITop.attr("data-index2")]["upper"])
                        .attr("class", "hover");
        
                canvas.append("text")
                        .attr("x", tCIBottom.attr("x1"))
                        .attr("y", parseFloat(tCIBottom.attr("y1")) + displayOffsetBottom)
                        .attr("text-anchor", "middle")
                        .attr("fill", "black")
                        .text(tukeyResults[tCIBottom.attr("data-index1")][tCIBottom.attr("data-index2")]["lower"])
                        .attr("class", "hover");
        
                canvas.append("line")
                        .attr("x1", tCITop.attr("x1"))
                        .attr("y1", tCITop.attr("y1"))
                        .attr("x2", plotPanelWidth/2 - plotWidth/2 - axesOffset)
                        .attr("y2", tCITop.attr("y1"))
                        .attr("stroke", tCITop.attr("stroke"))
                        .attr("stroke-dasharray", "5,5")
                        .attr("class", "hover");
                canvas.append("line")
                        .attr("x1", tCIBottom.attr("x1"))
                        .attr("y1", tCIBottom.attr("y1"))
                        .attr("x2", plotPanelWidth/2 - plotWidth/2 - axesOffset)
                        .attr("y2", tCIBottom.attr("y1"))
                        .attr("stroke", tCIBottom.attr("stroke"))
                        .attr("stroke-dasharray", "5,5")
                        .attr("class", "hover");
            }
    
            else if(target.className.baseVal == "differenceInMeans")
            {
                if(getNumberOfSelectedMeans() == 2)
                    return;

                d3.select("#" + target.id + ".differenceInMeansText").attr("display", "inline");                
            }
    
            else if(target.className.baseVal == "interactionEffect")
            {
                setup(e, target);
        
                d3.selectAll(".interactionEffect").attr("cursor", "pointer");
            }
    
            else if(target.className.baseVal == "pairwisePostHoc")
            {
                setup(e, target);
        
                d3.selectAll(".pairwisePostHoc").attr("cursor", "pointer");
            }
            
            else if(target.className.baseVal == "tukeyHSD")
            {
                setup(e, target);
        
                d3.selectAll(".tukeyHSD").attr("cursor", "pointer");
            }
    
            else if(target.className.baseVal == "doPairwiseTest")
            {
                setup(e, target);
        
                d3.selectAll(".doPairwiseTest").attr("cursor", "pointer");
            }
            
            else if(target.className.baseVal == "effectButtonFront")
            {
                setup(e, target);
                
                var effectButton = d3.select("#" + target.id + ".effectButtonFront");
                
                if(d3.select("#" + target.id + ".effectButtonBack").attr("stroke") == "black")
                    effectButton.attr("cursor", "pointer");
            }
            
            else if((target.className.baseVal == "stateForNavigation") || (target.className.baseVal == "stateForNavigationText"))
            {
                setup(e, target);
                
                var button = d3.select("#" + target.id + ".stateForNavigation");
                var buttonText = d3.select("#" + target.id + ".stateForNavigationText");
                
                if(button.attr("stroke") == "black")
                {
                    button.attr("cursor", "pointer");
                    buttonText.attr("cursor", "pointer");
                }
                else
                {
                    button.attr("cursor", "default");
                    buttonText.attr("cursor", "pointer");
                }
            }
            
            else if(target.id == "effectSizeFront")
            {
                setup(e, target);
                
                d3.selectAll("#effectSizeText, #effectSizeValue").attr("display", "none");
                d3.selectAll(".effectSizeInterpretationIndicators").attr("display", "inline");
            } 
        }
    }
}

function OnMouseOut(e)
{    
    var target = e.target != null ? e.target : e.srcElement;
    
    if(help)
    {
        if(target.className.baseVal == "plotHelp")
        {
            d3.select(".plotHelp").attr("fill", "white").attr("opacity","0.01").attr("cursor", "default");        
        }
        
        if(target.className.baseVal == "variancePlotHelp")
        {
            d3.select(".variancePlotHelp").attr("fill", "white").attr("opacity","0.01").attr("cursor", "default");        
        }
        
        if(target.className.baseVal == "normalityPlotHelp")
        {
            d3.select(".normalityPlotHelp").attr("fill", "white").attr("opacity","0.01").attr("cursor", "default");        
        }
        
        if(target.className.baseVal == "pValueHelp")
        {
            d3.select(".pValueHelp").attr("fill", "white").attr("opacity","0.01").attr("cursor", "default");        
        }
        
        if(target.className.baseVal == "testStatisticHelp")
        {
            d3.select(".testStatisticHelp").attr("fill", "white").attr("opacity","0.01").attr("cursor", "default");        
        }
        
        if(target.className.baseVal == "methodHelp")
        {
            d3.select(".methodHelp").attr("fill", "white").attr("opacity","0.01").attr("cursor", "default");        
        }
        
        if(target.className.baseVal == "effectSizeHelp")
        {
            d3.select(".effectSizeHelp").attr("fill", "white").attr("opacity","0.01").attr("cursor", "default");        
        }
        
        if(target.className.baseVal == "assumptionsButtonFront")
        {
            d3.select("#" + target.id + ".assumptionsButtonBack").attr("stroke-width", "1px");
            d3.select("#" + target.id + ".assumptionsButtonFront").attr("cursor", "pointer");
        }
        
        if(target.className.baseVal == "compareMean")
        {
            d3.select("#button.compareMean").attr("stroke-width", "1px").attr("cursor", "pointer");
            d3.select("#text.compareMean").attr("cursor", "pointer");
        }
        
        if(target.className.baseVal == "compareNow")
        {
            d3.select("#button.compareNow").attr("stroke-width", "1px").attr("cursor", "pointer");
            d3.select("#text.compareNow").attr("cursor", "pointer");
        }
        
        if(target.className.baseVal == "pairwisePostHoc")
        {
            d3.select("#button.pairwisePostHoc").attr("stroke-width", "1px").attr("cursor", "pointer");
            d3.select("#text.pairwisePostHoc").attr("cursor", "pointer");
        }
        
        if(target.className.baseVal == "tukeyHSD")
        {
            d3.select("#button.tukeyHSD").attr("stroke-width", "1px").attr("cursor", "pointer");
            d3.select("#text.tukeyHSD").attr("cursor", "pointer");
        }
        
        if(target.className.baseVal == "regression")
        {
            d3.select("#button.regression").attr("stroke-width", "1px").attr("cursor", "pointer");
            d3.select("#text.regression").attr("cursor", "pointer");
        }
        
        if(target.className.baseVal == "interactionEffect")
        {
            d3.select("#button.interactionEffect").attr("stroke-width", "1px").attr("cursor", "pointer");
            d3.select("#text.interactionEffect").attr("cursor", "pointer");
        }
        
        if(target.className.baseVal == "variableNameHolderFront")
        {
            var varName = target.id;
            
            d3.select("#" + varName + ".variableNameHolderBack").attr("stroke-width","1px");
            d3.select("#" + varName + ".variableNameHolderFront").attr("cursor", "pointer");
        }
        
        if(target.id == "regressionLine")
        {
            d3.selectAll("#regressionLine").attr("stroke-width", "10px").attr("cursor", "default");
        }
        
        if(target.id == "equation")
        {
            d3.selectAll("#equation").attr("fill", "#627bf4").attr("cursor", "default");
        }
        
    }
    else
    {    
        if(target.id == "statisticalTest")            
        {
            hideToolTip(target);
        }
        if(target.id == "postHocTest")            
        {
            hideToolTip(target);
        }
        if(target.className.baseVal == "variableNameHolder")                
        {
            var variableNameHolder = d3.selectAll("#" + target.id + ".variableNameHolder");
        }
         
        if(target.className.baseVal == "nodes" && (target.id.indexOf("Homogeneity") != -1) || (target.id.indexOf("Normality") != -1))
        {
            if(document.getElementById("hoverRect"))
                removeElementById("hoverRect");
        }

        else if(target.className.baseVal == "visualisationHolder")                
        {
            var visualisationHolder = d3.selectAll("#" + target.id + ".visualisationHolder");
        }
    
        else if(target.className.baseVal == "means")                
        {
            hideToolTip(target);           
        }
    
        else if(target.className.baseVal == "bins")                
        {
            var bins = d3.selectAll(".bins");
        
            unhighlightBins();
        }
    
        else if(target.className.baseVal == "datapoints")                
        {
            var datapoint = d3.select("#" + target.id + ".datapoints");
        
            datapoint.transition().duration(300).attr("r", datapointRadius);
            removeElementsByClassName("hoverText");
        }
    
        else if(target.className.baseVal == "outliers")
        {
            hideToolTip(target);
        }

        else if(target.className.baseVal == "medians")
        {
            hideToolTip(target);
        }
    
        else if((target.className.baseVal == "TOPFringes") || (target.className.baseVal == "BOTTOMFringes"))
        {
            var canvas = d3.select("#plotCanvas");
        
            var tFringe = d3.select("#" + target.id + ".TOPFringes");
            var bFringe = d3.select("#" + target.id + ".BOTTOMFringes");
        
            tFringe.attr("stroke-width", 2);
            bFringe.attr("stroke-width", 2);
        
            removeElementsByClassName("hover");
        }
    
        else if((target.className.baseVal == "CIs") || (target.className.baseVal == "CITopFringes") || (target.className.baseVal == "CIBottomFringes"))
        {
            var element = d3.select("#" + target.id + ".CIs");
            hideToolTip(element);
        }
        
        else if(target.className.baseVal == "CIMean")
        {
            removeElementsByClassName("hover");
        }
    
        else if((target.id == "regressionLine"))
        {
    //         removeElementsByClassName("regressionPrediction");
    //         removeElementsByClassName("lineToAxis")
        }
    
        else if((target.className.baseVal == "tukeyMean") || (target.className.baseVal == "tukeyCI") || (target.className.baseVal == "tukeyCITop") || (target.className.baseVal == "tukeyCIBottom"))
        {
            removeElementsByClassName("hover");
        }
    
        else if(target.className.baseVal == "differenceInMeans")
        {
            var differenceInMeansText = d3.select("#" + target.id + ".differenceInMeansText");
        
            differenceInMeansText.attr("display", "none");
        
            var differenceInMeansLines = document.getElementsByClassName("differenceInMeans");
        
            for(var i=0; i<differenceInMeansLines.length; i++)
            {
                if(differenceInMeansLines[i].getAttribute("id") != target.id)
                {
                    differenceInMeansLines[i].setAttribute("opacity", "1.0");
                }
            }
        }
        
        else if(target.id == "effectSizeFront")
        {
            d3.selectAll("#effectSizeText, #effectSizeValue").attr("display", "inline");
            d3.selectAll(".effectSizeInterpretationIndicators").attr("display", "none");
        }
    }
}	

function setup(e, target)
{
    // grab the mouse position
    _startX = e.clientX;
    _startY = e.clientY;

    // grab the clicked element's position
    _offsetX = removeAlphabetsFromString(target.style.left);
    _offsetY = removeAlphabetsFromString(target.style.top);      

    // bring the clicked element to the front while it is being dragged
    _oldZIndex = target.style.zIndex;
    target.style.zIndex = +1;

    // we need to access the element in OnMouseMove
    _dragElement = target;

    // tell our code to start moving the element with the mouse
    document.onmousemove = OnMouseMove;

    // cancel out any text selections
    document.body.focus();

    // prevent text selection in IE
    target.onselectstart = function () { return false; };
    
    // prevent IE from trying to drag an image
    target.ondragstart = function() { return false; };		
}

function backButtonPressed()
{
    reportMode = false;

    $('body').animate({
           scrollLeft: 0,
           duration: 5000 
    });

    removeElementsByClassName("sideCanvasButtons");
    removeElementsByClassName("sideCanvasButtonTexts");

    // Add checkbox for the reports
    d3.selectAll(".starImage").attr("display", "inline");
    d3.selectAll(".checkboxImage").attr("display", "none");
    d3.selectAll(".historyEntry").attr("fill", "lightgrey").attr("opacity", "0.05");

    var sideCanvas = d3.select("#sideCanvas");
    var modeButtonCanvas = d3.select("#modeButtonCanvas");
    var reportButtonCanvas = d3.select("#reportButtonCanvas");

    var L = 0;
    var T = 0;

    modeButtonCanvas.append("rect")
                .attr("x", L)
                .attr("y", T)
                .attr("width", sidePanelWidth/2)
                .attr("height", sideCanvasButtonHeight )
                .attr("stroke", "none")
                .attr("fill", "url(#buttonFillSelected)")                
                .attr("id", "historyButtonBack")
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
                .attr("x", L)
                .attr("y", T)
                .attr("width", sidePanelWidth/2)
                .attr("height", sideCanvasButtonHeight )
                .attr("stroke", "black")
                .attr("fill", "url(#buttonFillNormal)")
                .attr("opacity", "0.01")
                .attr("id", "historyButtonFront")
                .attr("class", "sideCanvasButtons");


    modeButtonCanvas.append("rect")
                .attr("x", L + sidePanelWidth/2)
                .attr("y", T)
                .attr("width", sidePanelWidth/2)
                .attr("height", sideCanvasButtonHeight )
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
                .attr("height", sideCanvasButtonHeight )
                .attr("stroke", "black")
                .attr("fill", "url(#buttonFillNormal)")
                .attr("opacity", "0.01")
                .attr("id", "helpButtonFront")
                .attr("class", "sideCanvasButtons");

    reportButtonCanvas.append("rect")
                .attr("x", L)
                .attr("y", 0)
                .attr("width", sidePanelWidth)
                .attr("height", sideCanvasButtonHeight )
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
                .text("Report statistical tests"); 

    reportButtonCanvas.append("rect")
                .attr("x", L)
                .attr("y", 0)
                .attr("width", sidePanelWidth)
                .attr("height", sideCanvasButtonHeight )
                .attr("stroke", "black")
                .attr("fill", "url(#buttonFillNormal)")
                .attr("opacity", "0.01")
                .attr("id", "reportButtonFront")
                .attr("class", "sideCanvasButtons");
}
