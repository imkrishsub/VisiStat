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

                var historyButtonBack = d3.select("#historyButtonBack.sideCanvasButtons");
                var historyButtonText = d3.select("#historyButtonText.sideCanvasButtonTexts");

                var helpButtonBack = d3.select("#helpButtonBack.sideCanvasButtons");
                var helpButtonText = d3.select("#helpButtonText.sideCanvasButtonTexts");               
                
                // Do something only when help mode is currently not activated
                if(historyButtonBack.attr("fill") == "url(#buttonFillNormal)")
                {
                    help = false;
                    
                    historyButtonBack.attr("fill", "url(#buttonFillSelected)")
                                    .attr("stroke", "none");
                    historyButtonText.attr("fill", "white");

                    helpButtonBack.attr("fill", "url(#buttonFillNormal)")
                                        .attr("stroke", "black");
                    helpButtonText.attr("fill", "black");

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
            if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "variableNameHolderFront"))
            {
                setup(e, target);        

                removeElementsByClassName("toolTips")
        
                //add to list of variables selected
                currentVariableSelection = setColorsForVariables(currentVariableSelection, target.id);
        
                removeElementsByClassName("displayDataTable");
                removeElementsByClassName("displayDataText");
              
                restrictVisualisationSelection();      
                plotVisualisation(); //checks which plot is selected and draws that plot
                setColorsForVisualisations(); //manages the fill colors of vizualizations (only one at a time)
                
                hideResetButton();
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
    
            else if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "visualisationHolderFront"))
            {
                setup(e, target);    
                currentVisualisationSelection = target.id;        
                setColorsForVisualisations();        
                plotVisualisation();
                
                hideResetButton();
            }

            else if((e.button == 1 && window.event != null || e.button == 0) && (target.id == "helpButtonFront"))
            {
                setup(e, target);

                var helpButtonBack = d3.select("#helpButtonBack.sideCanvasButtons");
                var helpButtonText = d3.select("#helpButtonText.sideCanvasButtonTexts");

                var historyButtonBack = d3.select("#historyButtonBack.sideCanvasButtons");
                var historyButtonText = d3.select("#historyButtonText.sideCanvasButtonTexts");
                
                // Do something only when help mode is currently not activated
                if(helpButtonBack.attr("fill") == "url(#buttonFillNormal)")
                {
                    help = true;

                    helpButtonBack.attr("fill", "url(#buttonFillSelected)")
                                    .attr("stroke", "none");
                    helpButtonText.attr("fill", "white");

                    historyButtonBack.attr("fill", "url(#buttonFillNormal)")
                                        .attr("stroke", "black");
                    historyButtonText.attr("fill", "black");

                    // ToDo: overlay help canvas on top of history panel
                    var helpPanel = d3.select("body").append("div")
                                                    .attr("id", "helpPanel")
                                                    .attr("style", "position: absolute; left: " + (variablesPanelWidth + plotPanelWidth) + "px; top: " + (sideCanvasButtonHeight + 0.5*yAxisTickTextOffset) + "px; width: " + sidePanelWidth + "px; height: " + (sidePanelHeight - sideCanvasButtonHeight - 0.5*yAxisTickTextOffset) + "px; z-index: 1; background-color: #FFFFFF; border-left-style: ridge; border-color: #b6b6b6; overflow: auto;");

                    helpPanel.append("label")
                                .attr("id", "descriptionLabel")
                                .text("Hover over a visible element to get help");
                    
                    //plotCanvas
                    var plotCanvas = d3.select("#plotCanvas");
                    var resultsCanvas = d3.select("#resultsCanvas");
                    
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
                    
                    if(document.getElementsByClassName("significanceTest").length > 0)
                    {
                        resultsCanvas.append("rect")
                                    .attr("x", resultsPanelWidth/2 + scaleForWindowSize(10))
                                    .attr("y", 2.5*significanceTestResultStep)
                                    .attr("height", significanceTestResultStep)
                                    .attr("width", resultsPanelWidth/2 - scaleForWindowSize(10))
                                    .attr("rx", "3px")
                                    .attr("ry", "3px")
                                    .attr("stroke", "black")
                                    .attr("opacity", "0.2")
                                    .attr("fill", "white")
                                    .attr("class", "pValueHelp");
                                    
                        resultsCanvas.append("rect")
                                    .attr("x", scaleForWindowSize(10))
                                    .attr("y", 2.5*significanceTestResultStep)
                                    .attr("height", significanceTestResultStep)
                                    .attr("width", resultsPanelWidth/2 - 2*scaleForWindowSize(10))
                                    .attr("rx", "3px")
                                    .attr("ry", "3px")
                                    .attr("stroke", "black")
                                    .attr("opacity", "0.2")
                                    .attr("fill", "white")
                                    .attr("class", "testStatisticHelp");
                                    
                        resultsCanvas.append("rect")
                                    .attr("x", scaleForWindowSize(10))
                                    .attr("y", significanceTestResultStep)
                                    .attr("height", significanceTestResultStep)
                                    .attr("width", sidePanelWidth - 2*scaleForWindowSize(10))
                                    .attr("rx", "3px")
                                    .attr("ry", "3px")
                                    .attr("stroke", "black")
                                    .attr("opacity", "0.2")
                                    .attr("fill", "white")
                                    .attr("class", "methodHelp");
                        
                        resultsCanvas.append("rect")
                                    .attr("x", scaleForWindowSize(10))
                                    .attr("y", 3.5*significanceTestResultStep)
                                    .attr("height", effectSizeHeight + 2.5*significanceTestResultStep)
                                    .attr("width", sidePanelWidth - 2*scaleForWindowSize(10))
                                    .attr("rx", "3px")
                                    .attr("ry", "3px")
                                    .attr("stroke", "black")
                                    .attr("opacity", "0.5")
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

            else if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "historyEntry") || (target.className.baseVal == "checkboxImage"))
            {
                setup(e, target);
                var id = removeAlphabetsFromString(target.id);

                if(!reportMode)
                {
                    resetSVGCanvas();

                    sessionStorage.plotWithNoInteraction = "true"; // Flag is set to indicate we are only rendering history entry (no interaction)

                    console.log("listOfVariableSelections[" + id + "] = " + listOfVariableSelections[id]);                    
                    console.log("variableLists[" + id + "] = " + variableLists[id]);

                    currentVariableSelection = listOfVariableSelections[id].clone(); // Get the list of variables that were selected
                    setColorsForVariablesWithArray(currentVariableSelection); // Set the variable buttons according to the currentVariableSelection[]
                    currentVisualisationSelection = listOfVisualizationSelections[id]; // Get the visualization that was selected

                    setColorsForVisualisations(); // Set the colors for the visualization buttons
                    plotVisualisation();

                    removeElementsByClassName("compareMean");
                
                    d3.selectAll(".IQRs, .medians, .TOPFringes, .BOTTOMFringes, .TOPFringeConnectors, .BOTTOMFringeConnectors, .outliers, .CIs, .CITopFringes, .CIBottomFringes").style("opacity", "0.35"); // Make some elements of the boxplot transparent
                    selectMeansFromArray(variableLists[id]); // Select means specified in this array                
                    

                    compareMeans(); // Perform the significance test
                }                
                else
                {   
                    // ToDo: add the starred history entries to testTypesSelectedForReport array

                    var imageHolder = d3.select("#image" + id + ".checkboxImage");

                    if(imageHolder.attr("xlink:href") == "images/checkbox_empty.png")
                    {
                        imageHolder.attr("xlink:href", "images/checkbox_checked.png");

                        var sizeBefore = researchQuestionsSelectedForReport.length;
                        var modifiedArray = researchQuestionsSelectedForReport.slice(0);
                        modifiedArray.push(listOfResearchQuestions[id]);

                        console.log("\n\narrayBefore = [" + researchQuestionsSelectedForReport + "]");
                        console.log("arrayAfter = [" + modifiedArray + "]");

                        var sizeAfter = (eliminateDuplicates(modifiedArray)).length;

                        console.log("after eliminateDuplicates = [" + eliminateDuplicates(modifiedArray) + "]");

                        console.log("sizeBefore = " + sizeBefore + ", sizeAfter = " + sizeAfter);

                        if(sizeAfter > sizeBefore)
                        {
                            testTypesSelectedForReport.push(listOfTestTypes[id]); // Add the currently selected history entry to testTypesSelectedForReport array
                            researchQuestionsSelectedForReport.push(listOfResearchQuestions[id]); // Add the currently selected history entry to testTypesSelectedForReport array
                            variablesSelectedForReport.push(listOfLevelsCompared[id]); // Add the currently selected history entry to testTypesSelectedForReport array
                        }
                    }

                    else if(imageHolder.attr("xlink:href") == "images/checkbox_checked.png")
                    {
                        imageHolder.attr("xlink:href", "images/checkbox_empty.png");
                        
                        if(researchQuestionsSelectedForReport.indexOf(listOfResearchQuestions[id]) != -1)
                        {
                            testTypesSelectedForReport.splice(testTypesSelectedForReport.indexOf(listOfTestTypes[id]));
                            researchQuestionsSelectedForReport.splice(researchQuestionsSelectedForReport.indexOf(listOfResearchQuestions[id]));
                            variablesSelectedForReport.splice(variablesSelectedForReport.indexOf(listOfLevelsCompared[id]));
                        }
                    }
                }
            }

            else if((e.button == 1 && window.event != null || e.button == 0) && (target.id == "downloadButton"))
            {
                setup(e, target);

                removeElementById("downloadButton");

                html2canvas(document.getElementById("reportPanel"), {
                    onrendered: function(canvas){
                        if(document.getElementById("imageCanvas") != null)
                            document.removeElementById("imageCanvas");

                        canvas.setAttribute("id", "imageCanvas");                
                        document.body.appendChild(canvas);

                        download(document.getElementById("imageCanvas"), "myImage");
                    }
                });
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
                            .attr("height", sideCanvasButtonHeight + "px")
                            .attr("width", sidePanelWidth + "px")
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
                            .attr("height", sideCanvasButtonHeight + "px")
                            .attr("width", sidePanelWidth + "px")
                            .attr("stroke", "black")
                            .attr("fill", "url(#buttonFillNormal)") 
                            .attr("opacity", "0.01")                       
                            .attr("id", "backButtonFront")
                            .attr("class", "sideCanvasButtons");

                reportButtonCanvas.append("rect")
                            .attr("x", 0)
                            .attr("y", 0)
                            .attr("height", sideCanvasButtonHeight + "px")
                            .attr("width", sidePanelWidth + "px")
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
                            .attr("height", sideCanvasButtonHeight + "px")
                            .attr("width", sidePanelWidth + "px")
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

            else if((e.button == 1 && window.event != null || e.button == 0) && (target.id == "generateButtonFront"))
            {
                setup(e, target);

                var reportPanel = document.getElementById("reportPanel");

                if ( reportPanel.hasChildNodes() )
                {
                    while ( reportPanel.childNodes.length >= 1 )
                    {
                        reportPanel.removeChild( reportPanel.firstChild );       
                    } 
                } 

                console.log("\n\ntestTypesSelectedForReport = [" + testTypesSelectedForReport + "]");               
                console.log("researchQuestionsSelectedForReport = [" + researchQuestionsSelectedForReport + "]");               
                console.dir(variablesSelectedForReport);

                for(var i=0; i<testTypesSelectedForReport.length; i++)                    
                {
                    (function(i) 
                    {
                        setTimeout(function() {
                            var id = listOfResearchQuestions.indexOf(researchQuestionsSelectedForReport[i]);

                            resetSVGCanvas();

                            currentVariableSelection = listOfVariableSelections[id].clone(); // Get the list of variables that were selected
                            setColorsForVariablesWithArray(currentVariableSelection); // Set the variable buttons according to the currentVariableSelection[]
                            currentVisualisationSelection = listOfVisualizationSelections[id]; // Get the visualization that was selected

                            setColorsForVisualisations(); // Set the colors for the visualization buttons
                            plotVisualisation();

                            removeElementsByClassName("compareMean");
                        
                            d3.selectAll(".IQRs, .medians, .TOPFringes, .BOTTOMFringes, .TOPFringeConnectors, .BOTTOMFringeConnectors, .outliers, .CIs, .CITopFringes, .CIBottomFringes").style("opacity", "0.35"); // Make some elements of the boxplot transparent
                            selectMeansFromArray(variableLists[id]); // Select means specified in this array                

                            sessionStorage.plotWithNoInteraction = "true"; // Flag is set to indicate we are only rendering history entry (no interaction)
                            compareMeans(); // Perform the significance test

                            if(i == 0)    
                                generateReport(researchQuestionsSelectedForReport[i], testTypesSelectedForReport[i], "true"); // Generate report (text and image)
                            else
                                generateReport(researchQuestionsSelectedForReport[i], testTypesSelectedForReport[i], "false"); // Generate report (text and image)
                        
                            if(i == testTypesSelectedForReport.length - 1)
                            {                            
                                checkForOverTesting();
                            }
                        }, 500 * i); // <-- You need to multiply by i here.
                    })(i);
                }
            }

            else if((e.button == 1 && window.event != null || e.button == 0) && (target.id == "doANOVAButton"))
            {
                setup(e, target);

                // Get the erroneous history entries
                sessionStorage.plotWithNoInteraction = "false"; // Flag is set to indicate we want this to be a plot that will be added to history

                var historyEntries = document.getElementsByClassName("historyEntry");
                
                var id; // ID of one of the entries
                var selectedLevels = new Array();

                for(var i=0; i<historyEntries.length; i++)
                {
                    if(historyEntries[i].getAttribute("opacity") == "0.6")
                    {
                        id = removeAlphabetsFromString(historyEntries[i].getAttribute("id")); 

                        for(var j=0; j<variableLists[id].length; j++)
                        {   
                            if(selectedLevels.indexOf(variableLists[id][j]) == -1)                   
                                selectedLevels.push(variableLists[id][j]);
                        }
                    }
                }

                // console.log("selectedLevels = [" + selectedLevels + "]");

                resetSVGCanvas();

                currentVariableSelection = listOfVariableSelections[id].clone(); // Get the list of variables that were selected
                setColorsForVariablesWithArray(currentVariableSelection); // Set the variable buttons according to the currentVariableSelection[]

                currentVisualisationSelection = listOfVisualizationSelections[id]; // Get the visualization that was selected
                setColorsForVisualisations(); // Set the colors for the visualization buttons
                plotVisualisation();

                removeElementsByClassName("compareMean");
            
                d3.selectAll(".IQRs, .medians, .TOPFringes, .BOTTOMFringes, .TOPFringeConnectors, .BOTTOMFringeConnectors, .outliers, .CIs, .CITopFringes, .CIBottomFringes").style("opacity", "0.35"); // Make some elements of the boxplot transparent
                selectMeansFromArray(selectedLevels); // Select means specified in this array                
                
                compareMeans(); // Perform the significance test

                backButtonPressed();
            }

            else if((e.button == 1 && window.event != null || e.button == 0) && (target.id == "backButtonFront"))
            {
                setup(e, target);
                backButtonPressed();
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "variableTypeToggleButton"))
            {
                setup(e, target);

                var variableNameHolderBack = d3.select("#" + target.id + ".variableNameHolderBack");
                var toggleButton = d3.select("#" + target.id + ".variableTypeToggleButton");
                var dependentVariableText = d3.select("#" + target.id + ".dependentVariableText");
                var independentVariableText = d3.select("#" + target.id + ".independentVariableText");
                if(toggleButton.attr("xlink:href") == "images/toggle_up.png")
                {
                    toggleButton.attr("xlink:href","images/toggle_down.png");
            
                    if(variableNameHolderBack.attr("fill") == "url(#buttonFillNormal)")
                        independentVariableText.attr("fill", "#627bf4");
                    else
                        independentVariableText.attr("fill", "white");
                
                    dependentVariableText.attr("fill", "#BEC9FC");
                }
                else if(toggleButton.attr("xlink:href") == "images/toggle_down.png")
                {
                    toggleButton.attr("xlink:href","images/toggle_up.png");
            
                    if(variableNameHolderBack.attr("fill") == "url(#buttonFillNormal)")
                        dependentVariableText.attr("fill", "#627bf4");
                    else
                        dependentVariableText.attr("fill", "white");
                    independentVariableText.attr("fill", "#BEC9FC");
                }
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
                sessionStorage.plotWithNoInteraction = "false";
                
                showResetButton();
                    
                states.push({visualisation: currentVisualisationSelection, substate: "significanceTest"});
                
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
        
                pairwiseComparisons = false;
                
                states.push({visualisation: currentVisualisationSelection, substate: "base"});
                states.push({visualisation: currentVisualisationSelection, substate: "meanSelection"});
        
                var assumptionsCanvas = d3.select("#assumptionsCanvas");
                var variableList = getSelectedVariables();
        
                var inText = "Compare the Selected Distributions";
    
                drawButtonInSideBar(inText, "compareNow");
            
                var availableWidth = plotPanelWidth;
            
                assumptionsCanvas.append("rect")
                        .attr("x", availableWidth/3 - selectionButtonWidth/2)
                        .attr("y", selectionButtonOffset)
                        .attr("height", selectionButtonHeight)
                        .attr("width", selectionButtonWidth)
                        .attr("rx", scaleForWindowSize(10) + "px")
                        .attr("ry", scaleForWindowSize(10) + "px")
                        .attr("fill", "url(#buttonFillSelected)")
                        .attr("filter", "none")
                        .attr("stroke", "none")
                        .attr("id", "rect")
                        .attr("class", "selectNone");
                    
                assumptionsCanvas.append("text")
                        .attr("x", availableWidth/3)
                        .attr("y", selectionButtonOffset + selectionButtonHeight/2 + yAxisTickTextOffset)
                        .attr("fill", "white")
                        .attr("text-anchor", "middle")
                        .attr("font-size", fontSizeButtonLabel + "px")
                        .text("Select none")
                        .attr("id", "text")
                        .attr("class", "selectNone");
            
                assumptionsCanvas.append("rect")
                        .attr("x", 2*availableWidth/3 - selectionButtonWidth/2)
                        .attr("y", selectionButtonOffset)
                        .attr("height", selectionButtonHeight)
                        .attr("width", selectionButtonWidth)
                        .attr("rx", scaleForWindowSize(10) + "px")
                        .attr("ry", scaleForWindowSize(10) + "px")
                        .attr("fill", "url(#buttonFillNormal)")
                        .attr("filter", "url(#Bevel)")
                        .attr("stroke", "black")
                        .attr("id", "rect")
                        .attr("class", "selectAll");
                    
                assumptionsCanvas.append("text")
                        .attr("x", 2*availableWidth/3)
                        .attr("y", selectionButtonOffset + selectionButtonHeight/2 + yAxisTickTextOffset)
                        .attr("fill", "black")
                        .attr("text-anchor", "middle")
                        .attr("font-size", fontSizeButtonLabel + "px")
                        .text("Select all")
                        .attr("id", "text")
                        .attr("class", "selectAll");
        
                freezeMouseEvents = true;
                d3.selectAll(".IQRs, .medians, .TOPFringes, .BOTTOMFringes, .TOPFringeConnectors, .BOTTOMFringeConnectors, .outliers, .CIs, .CITopFringes, .CIBottomFringes").transition().duration(500).style("opacity", "0.35");
                d3.selectAll(".means").transition().duration(500).attr("r", engorgedMeanRadius);
            
                setTimeout(function()
                {
                    freezeMouseEvents = false;
                }, 500);
        
                removeElementsByClassName("compareMean");
            }
        
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "selectNone")
            {
                setup(e, target);
            
                var selectNoneText = d3.select("#text.selectNone");
                var selectNoneButton = d3.select("#rect.selectNone");
            
                var selectAllText = d3.select("#text.selectAll");
                var selectAllButton = d3.select("#rect.selectAll");
            
                if(selectNoneButton.attr("fill") == "url(#buttonFillNormal)")
                {
                    selectNoneButton.attr("fill", "url(#buttonFillSelected)");
                    selectNoneButton.attr("filter", "none");
                    selectNoneButton.attr("stroke", "none");
                
                    selectNoneText.attr("fill", "white");
                
                    unselectAllMeans();
                
                    selectAllButton.attr("fill", "url(#buttonFillNormal)");
                    selectAllButton.attr("filter", "url(#Bevel)");
                    selectAllButton.attr("stroke", "black");
                
                    selectAllText.attr("fill", "black");
                
                    setTimeout(function()
                    {
                        setCompareNowButtonText();
                    }, 500);
                }
            }
        
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "selectAll")
            {
                setup(e, target);
            
                var selectNoneText = d3.select("#text.selectNone");
                var selectNoneButton = d3.select("#rect.selectNone");
            
                var selectAllText = d3.select("#text.selectAll");
                var selectAllButton = d3.select("#rect.selectAll");
            
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
                    }, 1000);
                }
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "doPairwiseTest")
            {
                removeElementsByClassName("CIMean");
                
                // showResetButton();
                    
                d3.selectAll(".doPairwiseTest").attr("cursor", "pointer");
        
                //get selected means
                var means = document.getElementsByClassName("means");
                var selectedMeans = []; 
                var variableList = getSelectedVariables();
        
                for(var i=0; i<means.length; i++)
                {
                    if(means[i].getAttribute("fill") == meanColors["click"])
                        selectedMeans.push(means[i]);
                }
        
                if(selectedMeans.length != 2)
                {
                    alert("select two means then press compare");
                }
                else
                {
                    removeElementsByClassName("doPairwiseTest");
                    removeElementsByClassName("boxplotLegends");
                    compareMeans();
                }
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "transformToNormal")
            {
                setup(e, target);
                
                removeElementsByClassName("transformToNormal");
                removeElementsByClassName("dontTransformToNormal");
            
                var variableList = sort(currentVariableSelection);
        
                for(var i=0; i<variableList["independent-levels"].length; i++)
                {    
                    applyNormalityTransform(variableList["dependent"][0], variableList["independent-levels"][i], false);
                }
        
                applyNormalityTransform(variableList["dependent"][0], "dataset", true);               
            }

            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "dontTransformToNormal")
            {
                setup(e, target);

                removeElementsByClassName("transformToNormal");
                removeElementsByClassName("dontTransformToNormal");

                var variableList = getSelectedVariables();

                console.log("not transforming...");
                d3.select("#plotCanvas").transition().delay(3000).duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight);
            
                if(variableList["independent"].length == 1)
                {
                    if((experimentalDesign == "within-groups") && (variableList["independent"][0] == getWithinGroupVariable(variableList)))
                    {
                        //within-group design
                        if(variableList["independent-levels"].length == 2)
                        {
                            //wilcoxon signed-rank
                            if(pairwiseComparisons)
                                performPairwiseWilcoxTest("TRUE", "TRUE");
                            else
                                performWilcoxonTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]]);
                        }
                        else
                        {   
                            //Friedman's test
                            performFriedmanTest(dependentVariable, independentVariable);
                        }
                    }                       
                    else if(d3.select("#homogeneity.ticks").attr("display") == "inline")
                    {
                        //between-groups design
                        if(variableList["independent-levels"].length == 2)
                        {                    
                            //Mann-Whitney U test
                            if(pairwiseComparisons)
                                performPairwiseWilcoxTest("TRUE", "FALSE");
                            else
                                performMannWhitneyTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]]);
                        }
                        else
                        {   
                            //Kruskal-Wallis test
                            performKruskalWallisTest(dependentVariable, independentVariable);
                        }
                    }
                }      
                else if(variableList["independent"].length == 2)
                {
                    if((experimentalDesign == "within-groups") && (variableList["independent"][0] == getWithinGroupVariable(variableList)))
                    {
                        //within-group design
                    
                    }                       
                    else if(d3.select("#homogeneity.ticks").attr("display") == "inline")
                    {
                        //between-groups design
                        if(variableList["independent-levels"].length == 2)
                        {
                            var groups = getGroupsForColourBoxPlotData();
                            //Mann-Whitney U test
                            if(pairwiseComparisons)
                                performPairwiseWilcoxTest("TRUE", "FALSE");
                            else
                                performMannWhitneyTest(groups[0], groups[1]);
                        }                            
                    }
                }
            }
        
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "transformToHomogeneity")
            {
                setup(e, target);
        
                var button = d3.select("#button." + target.className.baseVal);   
                var buttonText = d3.select("#text." + target.className.baseVal);        
        
                removeElementsByClassName("transformToHomogeneity");
                removeElementsByClassName("dontTransformToHomogeneity");
            
                var variableList = sort(currentVariableSelection);
            
                applyHomogeneityTransform(variableList["dependent"][0], variableList["independent"][0]);               
            }

            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "dontTransformToHomogeneity")
            {
                setup(e, target);

                removeElementsByClassName("transformToHomogeneity");
                removeElementsByClassName("dontTransformToHomogeneity");

                d3.select("#plotCanvas").transition().delay(3000).duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight);

                var variableList = getSelectedVariables();
                            
                if(variableList["independent"].length == 1)
                {
                    if(experimentalDesign == "between-groups")
                    {
                        performNormalityTests();
                
                        //between-groups design
                        if(variableList["independent-levels"].length == 2)
                        {
                            //2 variables
                            if(pairwiseComparisons)
                                performPairwiseTTest("FALSE", "FALSE");
                            else
                                performTTest(variables[variableList["dependent"][0]][variableList["independent-levels"][0]], variables[variableList["dependent"][0]][variableList["independent-levels"][1]], "FALSE", "FALSE");
                        }
                        else
                        {
                            //> 2 variables
                            performWelchANOVA(variableList["dependent"][0], variableList["independent"][0]);
                        }                
                    }
                }
                else
                {
                    if(experimentalDesign == "between-groups" && variableList["independent-levels"].length == 2)
                    {
                        performNormalityTests();
                        
                        //2 variables
                        var groups = getGroupsForColourBoxPlotData();
                    
                        if(pairwiseComparisons)
                            performPairwiseTTest("FALSE", "FALSE");
                        else
                            performTTest(groups[0], groups[1], "FALSE", "FALSE");
                    }
                }
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "fullscreen")
            {
                _startX = e.clientX;
                _startY = e.clientY;
        
                _dragElement = target;
        
                document.onmousemove = OnMouseMove;
                document.body.focus();

                document.onselectstart = function () { return false; };

                target.ondragstart = function() { return false; };
        
                var button = d3.select(".fullscreen");
        
                if(button.attr("xlink:href") == "images/fullscreennormal.png")
                {
                    fullScreen = true;
                    button.attr("xlink:href", "images/fullscreenclick.png");
                    d3.select("#variable.panel").attr("style", "width: " + 0 + "px; height: " + height + "px;"); 
                    d3.select("#variablePanelSVG").attr("width", 0);            
                    d3.select("#visualisation.panel").attr("style", "height: " + 0 + "px;"); 
                    d3.select("#visualisationPanelSVG").attr("height", 0);
                    d3.select("#canvas").attr("style", "left: 0px; height: " + height + "px;");
                    d3.select("#plotCanvas").attr("height", height).attr("width", width-sideBarWidth);
                }
                else if(button.attr("xlink:href") == "images/fullscreenclick.png")
                {
                    fullScreen = false;
                    button.attr("xlink:href", "images/fullscreennormal.png");
                    d3.select("#variable.panel").attr("style", "width: " + (width - plotPanelWidth - sideBarWidth) + "px; height: " + height + "px;"); 
                    d3.select("#variablePanelSVG").attr("width", (width - plotPanelWidth - sideBarWidth));            
                    d3.select("#visualisation.panel").attr("style", "width: " + (plotPanelWidth + sideBarWidth) + "px; height: " + height/4 + "px; top: " + plotPanelHeight + "px; left: " + (width - plotPanelWidth - sideBarWidth) + "px;");                    
                    d3.select("#visualisationPanelSVG").attr("height", height/4);
                    d3.select("#canvas").attr("style", "position: absolute; width: " + plotPanelWidth + "px; height: " + plotPanelHeight + "px; top: 0px; left: " + (width - plotPanelWidth - sideBarWidth) + "px;");    
                    d3.select("#plotCanvas").attr("height", plotPanelHeight).attr("width", plotPanelWidth);
                }
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
            
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "resetButtonFront")
            {
                setup(e, target);
                
                sessionStorage.plotWithNoInteraction = "false";
                
                var resetButtonImage = d3.select(".resetButtonImage");
                
                if(currentVisualisationSelection == "Boxplot" && resetButtonImage.attr("display") == "inline")
                {
                    plotVisualisation();
                
                    showResetButton();

                    var canvas = d3.select("#plotCanvas");
                    var variableList = getSelectedVariables();
        
                    var inText = "COMPARE SELECTED DISTRIBUTIONS";
    
                    if(pairwiseComparisons)
                        drawButtonInSideBar(inText, "doPairwiseTest");
                    else
                        drawButtonInSideBar(inText, "compareNow");
            
                    var availableWidth = plotPanelWidth;
                    
                    if(!pairwiseComparisons)
                    {
                        canvas.append("rect")
                                .attr("x", availableWidth/3 - selectionButtonWidth/2)
                                .attr("y", selectionButtonOffset)
                                .attr("height", selectionButtonHeight)
                                .attr("width", selectionButtonWidth)
                                .attr("rx", scaleForWindowSize(10) + "px")
                                .attr("ry", scaleForWindowSize(10) + "px")
                                .attr("fill", "url(#buttonFillSelected)")
                                .attr("filter", "none")
                                .attr("stroke", "none")
                                .attr("id", "rect")
                                .attr("class", "selectNone");
                    
                        canvas.append("text")
                                .attr("x", availableWidth/3)
                                .attr("y", selectionButtonOffset + selectionButtonHeight/2 + yAxisTickTextOffset)
                                .attr("fill", "white")
                                .attr("text-anchor", "middle")
                                .attr("font-size", fontSizeButtonLabel + "px")
                                .text("SELECT NONE")
                                .attr("id", "text")
                                .attr("class", "selectNone");
            
                        canvas.append("rect")
                                .attr("x", 2*availableWidth/3 - selectionButtonWidth/2)
                                .attr("y", selectionButtonOffset)
                                .attr("height", selectionButtonHeight)
                                .attr("width", selectionButtonWidth)
                                .attr("rx", scaleForWindowSize(10) + "px")
                                .attr("ry", scaleForWindowSize(10) + "px")
                                .attr("fill", "url(#buttonFillNormal)")
                                .attr("filter", "url(#Bevel)")
                                .attr("stroke", "black")
                                .attr("id", "rect")
                                .attr("class", "selectAll");
                    
                        canvas.append("text")
                                .attr("x", 2*availableWidth/3)
                                .attr("y", selectionButtonOffset + selectionButtonHeight/2 + yAxisTickTextOffset)
                                .attr("fill", "black")
                                .attr("text-anchor", "middle")
                                .attr("font-size", fontSizeButtonLabel + "px")
                                .text("SELECT ALL")
                                .attr("id", "text")
                                .attr("class", "selectAll");
                    }
        
                    freezeMouseEvents = true;
                    d3.selectAll(".IQRs, .medians, .TOPFringes, .BOTTOMFringes, .TOPFringeConnectors, .BOTTOMFringeConnectors, .outliers, .CIs, .CITopFringes, .CIBottomFringes").transition().duration(500).style("opacity", "0.35");
                    d3.selectAll(".means").transition().duration(500).attr("r", engorgedMeanRadius);
            
                    setTimeout(function()
                    {
                        freezeMouseEvents = false;
                    }, 500);
        
                    removeElementsByClassName("compareMean");
                }
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
        
                if(currentVisualisationSelection == "Scatterplot")
                {
                    var timeOut = 0;
                    if(choice != currentVariableSelection[1])
                    {   
                        var temp = currentVariableSelection[1];
                        currentVariableSelection[1] = currentVariableSelection[0];
                        currentVariableSelection[0] = temp;
                
                        plotVisualisation();  

                        timeOut = 1000;
                    }
                    
                    setTimeout(
                        function()
                        {
                            var variableList = sort(currentVariableSelection);
        
                            console.log("\n\t\tFinding the regression model to predict the outcome variable (" + currentVariableSelection[1] + ") from the explanatory variable (" + currentVariableSelection[0] + ")");
                
                            removeElementsByClassName("outcomeVariable");
                            removeElementsByClassName("dialogBox");
                
                            setTimeout(function(){            
                                removeElementsByClassName("regression");
                                removeElementsByClassName("significanceTest");
                                removeElementsByClassName("effectSize");
                                removeElementsByClassName("effectSizeInterpretationIndicators");
                                getLinearModelCoefficients(currentVariableSelection[1], currentVariableSelection[0]);
                            }, 300);   
                        }, timeOut);                      
                }
                else if(currentVisualisationSelection == "Scatterplot-matrix")
                {
                    resetSVGCanvas();
                    drawFullScreenButton();
            
                    var explanatoryVariables = [];
                    var outcomeVariable = choice;
            
                    for(var i=0; i<currentVariableSelection.length; i++)
                    {
                        if(currentVariableSelection[i] != outcomeVariable)
                        {
                            explanatoryVariables.push(currentVariableSelection[i]);
                        }
                    }
                    if(explanatoryVariables.length == 1)
                    {
                        getLinearModelCoefficients(outcomeVariable, explanatoryVariables[0]);
                        currentVisualisationSelection = "Scatterplot";
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
                
                states.push({variables: currentVariableSelection, substate: "other"});
                console.dir(states);
                
                findInteractionEffect(variableList["dependent"][0], variableList["independent"]);
            }
    
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "pairwisePostHoc")
            {
                setup(e, target);
        
                removeElementsByClassName("effectSize");
                removeElementsByClassName("parameter");
                removeElementsByClassName("significanceTest");
                removeElementsByClassName("differenceInMeans");
                removeElementsByClassName("checkingAssumptions");
                removeElementsByClassName("assumptions");
                removeElementsByClassName("assumptionsButtonFront");
                removeElementsByClassName("assumptionsButtonBack");
                removeElementsByClassName("ticks");
                removeElementsByClassName("crosses");
                removeElementsByClassName("pairwisePostHoc");
                removeElementsByClassName("loading");
                removeElementsByClassName("selectNone");
                removeElementsByClassName("selectAll");
                removeElementsByClassName("effectSizeInterpretationIndicators");
                removeElementsByClassName("differenceInMeans");
                removeElementsByClassName("differenceInMeansText");
                removeElementsByClassName("differenceInMeansMain");
                removeElementsByClassName("densityCurve");
                removeElementsByClassName("CIMean");
                removeElementsByClassName("tukeyHSD");                
                if(document.getElementById("border") != null)
                    removeElementById("border");
        
                pairwiseComparisons = true;
        
                var variableList = getSelectedVariables();
                var canvas = d3.select("#plotCanvas");
                
                resetMeans();
    
                drawButtonInSideBar("Compare the Selected Distributions", "doPairwiseTest");
        
                d3.selectAll(".IQRs, .medians, .TOPFringes, .BOTTOMFringes, .TOPFringeConnectors, .BOTTOMFringeConnectors, .outliers, .CIs, .CITopFringes, .CIBottomFringes").transition().duration(500).style("opacity", "0.35");
                d3.selectAll(".means").transition().duration(500).attr("r", engorgedMeanRadius);
        
                removeElementsByClassName("compareMean");
            }
            
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "tukeyHSD")
            {
                setup(e, target);        
                var variableList = sort(currentVariableSelection);
                
                states.push({variables: currentVariableSelection, substate: "other"});
                console.dir(states);
        
                if(variableList["independent"].length == 1)
                {
                    performTukeyHSDTestOneIndependentVariable(variableList["dependent"][0], variableList["independent"][0]);
                }
                else if(variableList["independent"].length == 2)
                {
                    performTukeyHSDTestTwoIndependentVariables(variableList["dependent"][0], variableList["independent"][0], variableList["independent"][1]);
                }
            }
        
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "assumptionsButtonFront")
            {
                setup(e, target);
        
                var assumptionText = d3.select("#" + target.id + ".assumptions");
                var assumptionButton = d3.select("#" + target.id + ".assumptionsButtonBack");
            
                if(assumptionButton.attr("stroke") == "black")
                {
                    assumptionButton.attr("fill", "url(#buttonFillSelected)")
                                    .attr("filter", "none")
                                    .attr("stroke", "none");
            
                    assumptionText.attr("fill", "white");
            
                    switch(target.id)
                    {
                        case "normality":
                                        {
                                            removeElementsByClassName("densityCurve");
                                            var homogeneityText = d3.select("#homogeneity.assumptions");
                                            var homogeneityButton = d3.select("#homogeneity.assumptionsButtonBack");
                                            
                                            homogeneityText.attr("fill", "black");
                                            homogeneityButton.attr("fill", "url(#buttonFillNormal)")
                                                                .attr("filter", "url(#Bevel)")
                                                                .attr("stroke", "black");
                                                                
                                            var variableList = getSelectedVariables();
                                    
                                            var dependentVariable = variableList["dependent"][0];
        
                                            for(var i=0; i<variableList["independent-levels"].length; i++)
                                            {   
                                                if(distributions[dependentVariable][variableList["independent-levels"][i]] == false)
                                                {                                
                                                    d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight*1.5);
                
                                                    //draw boxplots in red 
                                                    drawBoxPlotInRed(variableList["independent-levels"][i]);
                                                    drawNormalityPlot(dependentVariable, variableList["independent-levels"][i], "notnormal");
                                                }
                                                else
                                                {
                                                    d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight*1.5);
                 
                                                    drawNormalityPlot(dependentVariable, variableList["independent-levels"][i], "normal");
                                                }
                                            }
                                    
                                            break;
                                        }
                        case "homogeneity":
                                        {
                                            var normalityText = d3.select("#normality.assumptions");
                                            var normalityButton = d3.select("#normality.assumptionsButtonBack");
                                            
                                            normalityText.attr("fill", "black");
                                            normalityButton.attr("fill", "url(#buttonFillNormal)")
                                                                .attr("filter", "url(#Bevel)")
                                                                .attr("stroke", "black");
                                                                
                                            var variableList = sort(currentVariableSelection);
                                    
                                            var dependentVariable = variableList["dependent"][0];
                                            
                                            var homogeneity = d3.select("#homogeneity.ticks").attr("display") == "inline" ? true : false;
        
                                            for(var i=0; i<variableList["independent"].length; i++)
                                            {                   
                                                d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight*1.5);
        
                                                drawHomogeneityPlot(homogeneity);                                           
                                            }
                                            break;
                                        }
                        case "sphericity":
                                        {                                    
                                            break;
                                        }
                        default: 
                                alert("this is not supposed to happen!");
                    }
                }
                else
                {
                    assumptionButton.attr("fill", "url(#buttonFillNormal)")
                                    .attr("filter", "url(#Bevel)")
                                    .attr("stroke", "black");
            
                    assumptionText.attr("fill", "black");
            
                    switch(target.id)
                    {
                        case "normality":
                                        {
                                            d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight);
                                    
                                            break;
                                        }
                        case "homogeneity":
                                        {
                                            d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + plotPanelHeight);
                                        
                                            break;
                                        }
                        case "sphericity":
                                        {
                                            console.log("To be done!");
                                    
                                            break;
                                        }
                        default: 
                                alert("this is not supposed to happen!");
                    }
                }
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
                                    .attr("font-size", fontSizeSignificanceTestResults + "px")
                                    .attr("fill", "#627bf4")
                                    .text("Statistical test: " + testResults["method"])
                                    .attr("class", "significanceTest");
                    
                    drawParameter(testResults["df"][index], parseFloat(testResults["parameter"][index]));
    
                    resultsCanvas.append("text")
                                    .attr("x", 3*resultsPanelWidth/4)
                                    .attr("y", 3*significanceTestResultStep)
                                    .attr("text-anchor", "middle")
                                    .attr("font-size", fontSizeSignificanceTestResults + "px")
                                    .attr("fill", "#627bf4")
                                    .text(testResults["p"][index])
                                    .attr("class", "significanceTest");
    
    
                    //Effect sizes
                    drawEffectSize(parseFloat(testResults["effect-size"][index]));
                }
            }
            
            else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "stateForNavigation")
            {
                setup(e, target);
                
                d3.selectAll(".stateForNavigation").attr("fill", "url(#buttonFillNormal)").attr("filter", "url(#Bevel)").attr("stroke", "black");
                d3.selectAll(".stateForNavigationText").attr("fill", "black");                
                
                var button = d3.select("#" + target.id + ".stateForNavigation");
                var buttonText = d3.select("#" + target.id + ".stateForNavigationText");
                
                if(button.attr("stroke") == "black")
                {
                    button.attr("fill", "url(#buttonFillSelected)")
                            .attr("filter", "none")
                            .attr("stroke", "none");
                    
                    buttonText.attr("fill", "white");
                    
                    switch(currentVisualisationSelection)
                    {
                        case "Boxplot":
                                        {
                                            switch(target.id)
                                            {
                                                case "significance test":
                                                                        {
                                                                            var canvas = d3.select("#plotCanvas");
                                                                            var variableList = getSelectedVariables();
        
                                                                            var inText = "COMPARE SELECTED DISTRIBUTIONS";
    
                                                                            drawButtonInSideBar(inText, "compareNow");
            
                                                                            var availableWidth = plotPanelWidth;
            
                                                                            canvas.append("rect")
                                                                                    .attr("x", availableWidth/3 - selectionButtonWidth/2)
                                                                                    .attr("y", selectionButtonOffset)
                                                                                    .attr("height", selectionButtonHeight)
                                                                                    .attr("width", selectionButtonWidth)
                                                                                    .attr("rx", scaleForWindowSize(10) + "px")
                                                                                    .attr("ry", scaleForWindowSize(10) + "px")
                                                                                    .attr("fill", "url(#buttonFillSelected)")
                                                                                    .attr("filter", "none")
                                                                                    .attr("stroke", "none")
                                                                                    .attr("id", "rect")
                                                                                    .attr("class", "selectNone");
                    
                                                                            canvas.append("text")
                                                                                    .attr("x", availableWidth/3)
                                                                                    .attr("y", selectionButtonOffset + selectionButtonHeight/2 + yAxisTickTextOffset)
                                                                                    .attr("fill", "white")
                                                                                    .attr("text-anchor", "middle")
                                                                                    .attr("font-size", fontSizeButtonLabel + "px")
                                                                                    .text("SELECT NONE")
                                                                                    .attr("id", "text")
                                                                                    .attr("class", "selectNone");
            
                                                                            canvas.append("rect")
                                                                                    .attr("x", 2*availableWidth/3 - selectionButtonWidth/2)
                                                                                    .attr("y", selectionButtonOffset)
                                                                                    .attr("height", selectionButtonHeight)
                                                                                    .attr("width", selectionButtonWidth)
                                                                                    .attr("rx", scaleForWindowSize(10) + "px")
                                                                                    .attr("ry", scaleForWindowSize(10) + "px")
                                                                                    .attr("fill", "url(#buttonFillNormal)")
                                                                                    .attr("filter", "url(#Bevel)")
                                                                                    .attr("stroke", "black")
                                                                                    .attr("id", "rect")
                                                                                    .attr("class", "selectAll");
                    
                                                                            canvas.append("text")
                                                                                    .attr("x", 2*availableWidth/3)
                                                                                    .attr("y", selectionButtonOffset + selectionButtonHeight/2 + yAxisTickTextOffset)
                                                                                    .attr("fill", "black")
                                                                                    .attr("text-anchor", "middle")
                                                                                    .attr("font-size", fontSizeButtonLabel + "px")
                                                                                    .text("SELECT ALL")
                                                                                    .attr("id", "text")
                                                                                    .attr("class", "selectAll");
        
                                                                            freezeMouseEvents = true;
                                                                            d3.selectAll(".IQRs, .medians, .TOPFringes, .BOTTOMFringes, .TOPFringeConnectors, .BOTTOMFringeConnectors, .outliers, .CIs, .CITopFringes, .CIBottomFringes").transition().duration(500).style("opacity", "0.35");
                                                                            d3.selectAll(".means").transition().duration(500).attr("r", engorgedMeanRadius);
            
                                                                            setTimeout(function()
                                                                            {
                                                                                freezeMouseEvents = false;
                                                                            }, 500);
        
                                                                            removeElementsByClassName("compareMean");
                                                                            
                                                                            break;
                                                                        }
                                            }
                                            
                                            break;                                            
                                        }
                        
                    }
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
// //             xLine.attr("x1", ((height - mouseY) + testResults["intercept"])/testResults["slope"])
// //                                  .attr("y1", mouseY)                                                 
// //                                  .attr("y2", mouseY);
// //                          
// //             mouseX = ((plotPanelHeight - mouseY) + testResults["intercept"])/testResults["slope"];
// //             
// //     
// //             yLine.attr("x1", mouseX)
// //                  .attr("y1", height - (testResults["slope"]*mouseX - testResults["intercept"]))
// //                  .attr("x2", mouseX);
// 
// //             mouseY = toModifiedViewBoxForRegressionLineYCoordinate(testResults["slope"]*mouseX + testResults["intercept"]);
//             
//             mouseX = toModifiedViewBoxForRegressionLineXCoordinate(LEFT + getValue1(testResults["slope"]*(plotPanelHeight - mouseY) + testResults["intercept"], mins["X"], maxs["X"])*plotWidth);
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
            // style = document.getElementById("helpStyle");

            // style.innerHTML = "img { width: " + sidePanelWidth + "; } ";

            var sheet = document.styleSheets;  
            document.getElementById("helpPanel").innerHTML = "";
            d3.select("#helpPanel").append("label")
                                    .attr("id", "descriptionLabel")
                                    .text("Hover over a visible element to get help");
                              

            for(var i=0; i<sheet.length; i++)
            {
                if(sheet[i].href != null)
                {
                    console.log("i=" + i + ", href=" + sheet[i].href);

                    if(sheet[i].href.indexOf("help.css") > -1)
                    {
                        sheet[i].insertRule("img { width : " + sidePanelWidth + "; } ", 0);
                    }
                }
            }

            if(target.className.baseVal == "plotHelp")
            {
                setup(e, target);
                
                var visualisation = currentVisualisationSelection;
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
                var helpText = d3.select("#descriptionLabel");
                
                d3.select(".pValueHelp").attr("opacity","0.3").attr("cursor", "help");
                
                helpText.text(desc["p-value"]);                
            }
            
            if(target.className.baseVal == "testStatisticHelp")
            {
                setup(e, target);
                var helpText = d3.select("#descriptionLabel");
                
                d3.select(".testStatisticHelp").attr("opacity","0.3").attr("cursor", "help");               
                
                document.getElementById("helpPanel").innerHTML = '<object type="text/html" data="help/parameter/' + testResults["parameter-type"] + '.html" height = ' + (sidePanelHeight - sideCanvasButtonHeight) + ' width = ' + sidePanelWidth + '></object>';               
            }
            
            if(target.className.baseVal == "methodHelp")
            {
                setup(e, target);
                var helpText = d3.select("#descriptionLabel");
                
                d3.select(".methodHelp").attr("opacity","0.3").attr("cursor", "help");
                console.log(testResults["test-type"]);                
                
                document.getElementById("helpPanel").innerHTML = '<object type="text/html" data="help/method/' + testResults["test-type"] + '.html" height = ' + (sidePanelHeight - sideCanvasButtonHeight) + ' width = ' + sidePanelWidth + '></object>';
            }
            
            if(target.className.baseVal == "effectSizeHelp")
            {
                setup(e, target);
                var helpText = d3.select("#descriptionLabel");
                
                d3.select(".effectSizeHelp").attr("opacity","0.3").attr("cursor", "help");
                helpText.text(desc["effect-size"][testResults["effect-size-type"]]);
            }
            
            if(target.className.baseVal == "variancePlotHelp")
            {
                setup(e, target);
                
                var visualisation = currentVisualisationSelection;
                var helpText = d3.select("#descriptionLabel");
                
                d3.select(".variancePlotHelp").attr("opacity","0.3").attr("cursor", "help");

                helpText.text(desc["variancePlot"]);                
            }
            
            if(target.className.baseVal == "normalityPlotHelp")
            {
                setup(e, target);
                
                var visualisation = currentVisualisationSelection;
                var helpText = d3.select("#descriptionLabel");
                
                d3.select(".normalityPlotHelp").attr("opacity","0.3").attr("cursor", "help");

                helpText.text(desc["normalityPlot"]);                
            }
            
            if(target.className.baseVal == "assumptionsButtonFront")
            {
                setup(e, target);
                var assumptionType = target.id;
                
                d3.select("#" + assumptionType + ".assumptionsButtonBack").attr("stroke-width","2px");
                d3.select("#" + assumptionType + ".assumptionsButtonFront").attr("cursor", "help");

                document.getElementById("helpPanel").innerHTML = '<object type="text/html" data="help/assumptions/' + assumptionType + '.html" height = ' + (sidePanelHeight - sideCanvasButtonHeight) + ' width = ' + sidePanelWidth + '></object>';
                
            }
            
            if(target.className.baseVal == "compareMean")
            {
                setup(e, target);
                var assumptionType = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#button.compareMean").attr("stroke-width","2px").attr("cursor", "help");
                d3.select("#text.compareMean").attr("cursor", "help");
                
                helpText.text(desc["compareMean"]);   
            }
            
            if(target.className.baseVal == "compareNow")
            {
                setup(e, target);
                var assumptionType = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#button.compareNow").attr("stroke-width","2px").attr("cursor", "help");
                d3.select("#text.compareNow").attr("cursor", "help");
                
                helpText.text(desc["compareNow"]);   
            }
            
            if(target.className.baseVal == "pairwisePostHoc")
            {
                setup(e, target);
                var assumptionType = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#button.pairwisePostHoc").attr("stroke-width","2px").attr("cursor", "help");
                d3.select("#text.pairwisePostHoc").attr("cursor", "help");
                
                helpText.text(desc["pairwisePostHoc"]);   
            }
            
            if(target.className.baseVal == "tukeyHSD")
            {
                setup(e, target);
                var assumptionType = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#button.tukeyHSD").attr("stroke-width","2px").attr("cursor", "help");
                d3.select("#text.tukeyHSD").attr("cursor", "help");
                
                helpText.text(desc["tukeyHSD"]);   
            }
            
            if(target.className.baseVal == "regression")
            {
                setup(e, target);
                var assumptionType = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#button.regression").attr("stroke-width","2px").attr("cursor", "help");
                d3.select("#text.regression").attr("cursor", "help");
                
                helpText.text(desc["regression"]);   
            }
            
            if(target.id == "regressionLine")
            {
                setup(e, target);
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.selectAll("#regressionLine").attr("stroke-width", "12px").attr("cursor", "help");
                
                helpText.text(desc["regressionLine"]);
            }
            
            if(target.id == "equation")
            {
                setup(e, target);
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.selectAll("#equation").attr("fill", "light#627bf4").attr("cursor", "help");
                
                helpText.text(desc["equation"]);
            }
            
            if(target.className.baseVal == "interactionEffect")
            {
                setup(e, target);
                var assumptionType = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#button.interactionEffect").attr("stroke-width","2px").attr("cursor", "help");
                d3.select("#text.interactionEffect").attr("cursor", "help");
                
                helpText.text(desc["interactionEffect"]);   
            }
            
            if((target.className.baseVal == "variableNameHolderFront"))
            {
                setup(e, target);
                var varName = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#" + varName + ".variableNameHolderBack").attr("stroke-width","2px");
                d3.select("#" + varName + ".variableNameHolderFront").attr("cursor", "help");
                
                helpText.text(desc["variables"][varName]);                
            }

            if((target.className.baseVal == "visualisationHolderFront"))
            {
                setup(e, target);
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
                var varName = target.id;
                
                var helpText = d3.select("#descriptionLabel");
                
                d3.select("#" + varName + ".disabled").attr("cursor", "help");
                
                helpText.text(desc["variables"][varName]);                
            }
        }
        else
        {
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

                if(historyButtonBack.attr("fill") == "url(#buttonFillNormal)")
                    historyButtonFront.attr("cursor", "pointer");
            }

            else if(target.id == "helpButtonFront")
            {
                setup(e, target);

                var helpButtonBack = d3.select("#helpButtonBack.sideCanvasButtons");
                var helpButtonFront = d3.select("#helpButtonFront.sideCanvasButtons");

                if(helpButtonBack.attr("fill") == "url(#buttonFillNormal)")
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
        
                var variableHolder = d3.select("#" + target.id + ".disabled");
                variableHolder.attr("cursor", "pointer");
            }
    
            else if(target.className.baseVal == "means")
            {		
                setup(e, target);
        
                var meanCircle = d3.select("#" + target.id + ".means");                
        
                if(meanCircle.attr("r") == meanRadius)
                {                
                    meanCircle.attr("cursor", "default");
            
                    var plotCanvas = d3.select("#plotCanvas");
                    var L = plotPanelWidth/2 - plotWidth/2 - axesOffset;
            
                    var mouseX = e.pageX - (variablesPanelWidth);
                    var mouseY = e.pageY;
            
                    plotCanvas.append("line")
                                .attr("x1", meanCircle.attr("cx"))
                                .attr("y1", meanCircle.attr("cy"))
                                .attr("x2", L)
                                .attr("y2", meanCircle.attr("cy"))
                                .attr("stroke-dasharray", "5,5")
                                .attr("stroke", meanColors["normal"])
                                .attr("class", "hover");
            
                    plotCanvas.append("text")
                                .attr("x", mouseX + 10)
                                .attr("y", mouseY + 15)
                                .attr("text-anchor", "start")
                                .text(dec2(getActualValue(meanCircle.attr("cy"))))
                                .attr("fill", meanColors["normal"])
                                .attr("class", "hover");
                        
                }   
                else
                {                
                    if((document.getElementsByClassName("completeLines").length+1 <= (document.getElementsByClassName("means").length)) || (document.getElementsByClassName("means").length == 1))
                    {      
                        meanCircle.attr("cursor","pointer");
                    
                        //change color of the mean circle
                        if(meanCircle.attr("fill") == meanColors["normal"])
                        {
                            startLoopAnimation(meanCircle);
                            meanCircle.attr("fill", meanColors["hover"]);
            
                            // startLoopAnimation(meanCircle);
            
                            var incompleteLines = d3.selectAll(".incompleteLines");
            
                            if(document.getElementsByClassName("incompleteLines").length > 0)
                            {
                                incompleteLines.attr("x2", meanCircle.attr("cx"))
                                                .attr("y2", meanCircle.attr("cy"))
                                                .attr("display", "inline")
                                                .attr("stroke", meanColors["hover"]);
                            }
                        }
                    }
                }
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
        
            else if(target.className.baseVal == "assumptionsButtonFront")
            {
                setup(e, target);
            
                d3.selectAll("#" + target.id + ".assumptionsButtonFront").attr("cursor", "pointer");
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
                for(var i=0; i<currentVariableSelection.length; i++)
                {   
                    if(variableRoles[currentVariableSelection[i]] == false && currentVariableSelection.length > 1)
                    {
                        // Levels are needed when we have a independent variable and one or more dependent variables
                        levels = variables[currentVariableSelection[i]]["dataset"].unique();            
                        altScatterPlot = true;
                    }
                }
    
                for(var i=0; i<currentVariableSelection.length; i++)
                {        
                    if(altScatterPlot)
                    {
                        if(variableRoles[currentVariableSelection[i]] != false)
                        {
                            //for the dependent variable(s)
                
                            for(var j=0; j<levels.length; j++)
                            {
                                // for each level of the independent variable, find the dependent variables                    
                    
                                text[j] = variables[currentVariableSelection[i]][levels[j]];
                            }
                        }  
                    }
                    else 
                    {               
                        text[i] = variables[currentVariableSelection[i]]["dataset"];                
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
            
            else if(target.className.baseVal == "resetButtonFront")
            {
                setup(e, target);
            
                var resetButtonImage = d3.select(".resetButtonImage");
                var resetButton = d3.select(".resetButtonFront");            
                        
                resetButton.attr("cursor", "pointer");
            
            } 
    
            else if(target.className.baseVal == "outliers")
            {
                setup(e, target);
                var canvas = d3.select("#plotCanvas");
                var outlier = d3.select("#" + target.id + ".outliers");
        
                var mouseX = e.pageX - (width - plotPanelWidth - sideBarWidth);
                var mouseY = e.pageY;
        
                outlier.attr("r", outlierRadius*2).attr("stroke", "yellow").attr("stroke-width", "2px");
                canvas.append("line")       
                        .attr("x1", outlier.attr("cx"))
                        .attr("y1", outlier.attr("cy"))
                        .attr("x2", plotPanelWidth/2 - plotWidth/2 - axesOffset)
                        .attr("y2", outlier.attr("cy"))
                        .attr("stroke-dasharray", "5,5")
                        .attr("stroke", "black")
                        .attr("class", "hover");    
        
                canvas.append("text")
                        .attr("x", mouseX + scaleForWindowSize(45))
                        .attr("y", mouseY + scaleForWindowSize(25))
                        .attr("text-anchor", "middle")
                        .text(dec2(getActualValue(outlier.attr("cy"))))
                        .attr("class", "hover");                
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
                var canvas = d3.select("#plotCanvas");
        
                var topFringe = d3.select("#" + target.id + ".CITopFringes");
                var bottomFringe = d3.select("#" + target.id + ".CIBottomFringes");
    
                var variableList = sort(currentVariableSelection);        
                var topLine = canvas.append("line")
                        .attr("x1", (parseFloat(topFringe.attr("x1")) + parseFloat(topFringe.attr("x2")))/2)
                        .attr("y1", topFringe.attr("y1"))
                        .attr("x2", plotPanelWidth/2 - plotWidth/2 - axesOffset)
                        .attr("y2", topFringe.attr("y1"))
                        .attr("stroke", "black")
                        .attr("stroke-dasharray", "5,5")
                        .attr("class", "hover");
                
                var bottomLine = canvas.append("line")
                        .attr("x1", (parseFloat(bottomFringe.attr("x1")) + parseFloat(bottomFringe.attr("x2")))/2)
                        .attr("y1", bottomFringe.attr("y1"))
                        .attr("x2", plotPanelWidth/2 - plotWidth/2 - axesOffset)
                        .attr("y2", bottomFringe.attr("y1"))
                        .attr("stroke", "black")
                        .attr("stroke-dasharray", "5,5")
                        .attr("class", "hover");
                   
                canvas.append("text")
                        .attr("x",parseFloat(topFringe.attr("x1")))
                        .attr("y", parseFloat(topFringe.attr("y1")) - displayOffsetTop)
                        .attr("text-anchor", "middle")
                        .text(dec2(getActualValue(parseFloat(topFringe.attr("y1")))))
                        .attr("class", "hover");
                
                canvas.append("text")
                        .attr("x",parseFloat(bottomFringe.attr("x1")))
                        .attr("y", parseFloat(bottomFringe.attr("y1")) + displayOffsetBottom)
                        .attr("text-anchor", "middle")
                        .text(dec2(getActualValue(parseFloat(bottomFringe.attr("y1")))))
                        .attr("class", "hover");
            }
            
            else if(target.className.baseVal == "CIMean")
            {
                var canvas = d3.select("#plotCanvas");
        
                var topFringe = d3.select("#top.CIMean");
                var bottomFringe = d3.select("#bottom.CIMean");
    
                var variableList = sort(currentVariableSelection);       
                
                var top = dec2(testResults["CI"][1]);
                var bottom = dec2(testResults["CI"][0]);
                   
                canvas.append("text")
                        .attr("x",parseFloat(topFringe.attr("x1")))
                        .attr("y", parseFloat(topFringe.attr("y1")) - displayOffsetTop)
                        .attr("text-anchor", "middle")
                        .text(top)
                        .attr("class", "hover");
                
                canvas.append("text")
                        .attr("x",parseFloat(bottomFringe.attr("x1")))
                        .attr("y", parseFloat(bottomFringe.attr("y1")) + displayOffsetBottom)
                        .attr("text-anchor", "middle")
                        .text(bottom)
                        .attr("class", "hover");
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
                var differenceInMeansText = d3.select("#" + target.id + ".differenceInMeansText");
        
                differenceInMeansText.attr("display", "inline");
        
                var differenceInMeansLines = document.getElementsByClassName("differenceInMeans");
        
                for(var i=0; i<differenceInMeansLines.length; i++)
                {
                    if(differenceInMeansLines[i].getAttribute("id") != target.id)
                    {
                        differenceInMeansLines[i].setAttribute("opacity", "0.35");
                    }
                }
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
        if(target.className.baseVal == "variableNameHolder")                
        {
            var variableNameHolder = d3.selectAll("#" + target.id + ".variableNameHolder");
        }
    
        else if(target.className.baseVal == "visualisationHolder")                
        {
            var visualisationHolder = d3.selectAll("#" + target.id + ".visualisationHolder");
        }
    
        else if(target.className.baseVal == "means")                
        {
            var meanCircle = d3.selectAll("#" + target.id + ".means");
        
            if(meanCircle.attr("r") == engorgedMeanRadius)
            {
                if(meanCircle.attr("fill") != meanColors["click"])
                {
                    meanCircle.attr("fill", meanColors["normal"]);
                    var incompleteLine = d3.select(".incompleteLines").attr("display", "none");
                }
            }
            else
            {
                removeElementsByClassName("hover");
            }
        
            removeElementsByClassName("loops");
            clearInterval(intervals[meanCircle.attr("id")]);
        
    //         var incompleteLines = d3.selectAll(".incompleteLines");
    //             
    //         if(document.getElementsByClassName("incompleteLines").length > 0)
    //         {
    //             incompleteLines.attr("stroke", meanColors["normal"]);
    //         }   
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
            var canvas = d3.select("#plotCanvas");
            var outlier = d3.select("#" + target.id + ".outliers");
        
            outlier.attr("r", outlierRadius).attr("stroke", "none");
            removeElementsByClassName("hover");
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
            removeElementsByClassName("hover");
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
    document.onselectstart = function () { return false; };
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
                .attr("height", sideCanvasButtonHeight + "px")
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
                .attr("height", sideCanvasButtonHeight + "px")
                .attr("stroke", "black")
                .attr("fill", "url(#buttonFillNormal)")
                .attr("opacity", "0.01")
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
                .text("Report statistical tests"); 

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