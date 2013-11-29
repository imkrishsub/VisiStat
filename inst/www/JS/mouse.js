function OnMouseDown(e)
{
    if (e == null) 
        e = window.event; 

    var target = e.target != null ? e.target : e.srcElement;
   
    if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "variableNameHolderFront"))
    {
        setup(e, target);        
        
        //add to list of variables selected
        currentVariableSelection = toggleFillColorsForVariables(currentVariableSelection, target.id);
        
        //display the current variable selection
        console.log("\n\n\ncurrent variable selection: [" + currentVariableSelection + "]\n");
        
        removeElementsByClassName("displayDataTable");
        removeElementsByClassName("displayDataText");
              
        pickOutVisualizations();      
        makePlot(); //checks which plot is selected and draws that plot
        toggleFillColorsForVisualizations(); //manages the fill colors of vizualizations (only one at a time)
    }
    
    else if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "visualizationHolderFront"))
    {
        setup(e, target);    
        currentVisualizationSelection = target.id;        
        toggleFillColorsForVisualizations();        
        makePlot();
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
            dependentVariableText.attr("fill", "none");
        }
        else if(toggleButton.attr("xlink:href") == "images/toggle_down.png")
        {
            toggleButton.attr("xlink:href","images/toggle_up.png");
            
            if(variableNameHolderBack.attr("fill") == "url(#buttonFillNormal)")
                dependentVariableText.attr("fill", "#627bf4");
            else
                dependentVariableText.attr("fill", "white");
            independentVariableText.attr("fill", "none");
        }
    }
    
    else if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "dependentVariableButtonFront"))
    {
        setup(e, target);
        
        var variableButton = d3.select("#" + target.id + ".dependentVariableButtonBack");
        var variableText = d3.select("#" + target.id + ".dependentVariableText");
        
        var otherVariableButton = d3.select("#" + target.id + ".independentVariableButtonBack");
        var otherVariableText = d3.select("#" + target.id + ".independentVariableText");
        
        //if not selected
        if(variableButton.attr("fill") != variableTypeButtonColors["dependent"]["selected"])
        {
            variableButton.attr("fill", variableTypeButtonColors["dependent"]["selected"]);
            variableText.attr("fill", variableTypeTextColors["dependent"]["selected"]);
            
            otherVariableButton.attr("fill", variableTypeButtonColors["independent"]["normal"]);
            otherVariableText.attr("fill", variableTypeTextColors["independent"]["normal"]);
            
            variableTypes[target.id] = "dependent";
        }
    }
    
    else if((e.button == 1 && window.event != null || e.button == 0) && (target.className.baseVal == "independentVariableButtonFront"))
    {
        setup(e, target);
        
        var variableButton = d3.select("#" + target.id + ".independentVariableButtonBack");
        var variableText = d3.select("#" + target.id + ".independentVariableText");
        
        var otherVariableButton = d3.select("#" + target.id + ".dependentVariableButtonBack");
        var otherVariableText = d3.select("#" + target.id + ".dependentVariableText");
        
        //if not selected
        if(variableButton.attr("fill") != variableTypeButtonColors["independent"]["selected"])
        {
            variableButton.attr("fill", variableTypeButtonColors["independent"]["selected"]);
            variableText.attr("fill", variableTypeTextColors["independent"]["selected"]);
            
            otherVariableButton.attr("fill", variableTypeButtonColors["dependent"]["normal"]);
            otherVariableText.attr("fill", variableTypeTextColors["dependent"]["normal"]);
            
            variableTypes[target.id] ="independent";
            splitTheData(target.id);
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
                    //it was the only mean selected - do nothing
                    console.log("no lines before or after");
                }
                else if(lineAfter == undefined)
                {
                    console.log("one line before");
                
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
                    console.log("one line after");
                
                    removeElementsByClassName("incompleteLines");
                    var canvas = d3.select("#plotCanvas");
            
                    canvas.append("line")
                            .attr("x1", lineAfter.getAttribute("x2"))
                            .attr("y1", lineAfter.getAttribute("y2"))
                            .attr("x2", lineAfter.getAttribute("x2"))
                            .attr("y2", lineAfter.getAttribute("y2"))
                            .attr("stroke", meanColors["normal"])
                            .attr("stroke-dasharray", "5,5")
                            .attr("id", meanCircle.attr("id"))
                            .attr("class", "incompleteLines");
                
                    lineAfter.parentNode.removeChild(lineAfter);

                }
                else
                {
                    removeElementsByClassName("incompleteLines");
                
                    var canvas = d3.select("#plotCanvas");
            
                    canvas.append("line")
                            .attr("x1", lineAfter.getAttribute("x2"))
                            .attr("y1", lineAfter.getAttribute("y2"))
                            .attr("x2", lineAfter.getAttribute("x2"))
                            .attr("y2", lineAfter.getAttribute("y2"))
                            .attr("stroke", meanColors["normal"])
                            .attr("stroke-dasharray", "5,5")
                            .attr("id", meanCircle.attr("id"))
                            .attr("class", "incompleteLines");
                        
                    console.log("lines before and after");
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
                    }
                    var means = document.getElementsByClassName("means");
        
        
        //             for(var i=0; i<means.length; i++)
        //             {
        //                 if(means[i].getAttribute("fill") == meanColors["normal"])
        //                 {
        //                     console.log("starting animation for mean with id = " + means[i].getAttribute("id"));
        //                     var thisMean = d3.select("#" + means[i].getAttribute("id") + ".means");
        //                     startLoopAnimation(thisMean);       
        //                 }
        //             }
                //if we still have means to select, start an incomplete line
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
        
            setCompareNowButtonText();
        }
    }
    
    else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "compareNow")
    {
        d3.selectAll(".compareNow").attr("cursor", "pointer");
        
        //get selected means
        var means = document.getElementsByClassName("means");
        var selectedMeans = []; 
        var variableList = getSelectedVariables();
        
        for(var i=0; i<means.length; i++)
        {
            if(means[i].getAttribute("fill") == meanColors["click"])
                selectedMeans.push(means[i]);
        }
        
        console.log("selectedMeans:");
        console.dir(selectedMeans);
        
        if(selectedMeans.length == 0)
        {
            alert("select one or means and then press compare");
        }
        else if(variableList["independent"].length == 0)
        {
            if(selectedMeans.length > 1)
            {
                alert("select only one mean to compare against population mean!");
            }
            else
            {
                compareMeans();
            }
        }
        else
        {
            compareMeans();
        }
    }
    
    else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "compareMean")
    {
        setup(e, target);
        
        var canvas = d3.select("#plotCanvas");
        var variableList = getSelectedVariables();
        
        var inText = variableList["independent"].length > 0 ? "SELECT TWO OR MORE MEANS" : "SELECT ONE MEAN";             
    
        canvas.append("rect")
                .attr("x", canvasWidth/2 - buttonWidth/2)
                .attr("y", 0)
                .attr("width", buttonWidth)
                .attr("height", buttonHeight)
                .attr("rx", scaleForWindowSize(10) + "px")
                .attr("ry", scaleForWindowSize(10) + "px")
                .attr("fill", "url(#buttonFillNormal)")
                .attr("stroke", "black")
                .attr("id", "button")
                .attr("class", "compareNow");
    
        canvas.append("text")
                .attr("x", canvasWidth/2)
                .attr("y", buttonHeight/2 + yAxisTickTextOffset)
                .attr("text-anchor", "middle")
                .text(inText)
                .attr("id", "text")
                .attr("class", "compareNow"); 
        
        d3.selectAll(".IQRs, .medians, .TOPFringes, .BOTTOMFringes, .TOPFringeConnectors, .BOTTOMFringeConnectors, .outliers, .CIs, .CITopFringes, .CIBottomFringes").transition().duration(800).attr("opacity", 0.1)
//         setOpacityForElementsWithClassNames(["IQRs","medians", "TOPFringes", "BOTTOMFringes", "TOPFringeConnectors", "BOTTOMFringeConnectors", "outliers", "CIs", "CITopFringes", "CIBottomFringes"], 0.1);
        d3.selectAll(".means").attr("r", engorgedMeanRadius);
        
        removeElementsByClassName("compareMean");
    }
    
    else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "transformToNormal")
    {
        setup(e, target);
        
        var button = d3.select("#button." + target.className.baseVal);   
        var buttonText = d3.select("#text." + target.className.baseVal);        
        
        removeElementsByClassName("transformToNormal");
            
        var variableList = sort(currentVariableSelection);
        
        for(var i=0; i<variableList["independent-levels"].length; i++)
        {    
            applyTransform(variableList["dependent"][0], variableList["independent-levels"][i], false);
        }
        
        applyTransform(variableList["dependent"][0], "dataset", true);               
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
            d3.select("#visualization.panel").attr("style", "height: " + 0 + "px;"); 
            d3.select("#visualizationPanelSVG").attr("height", 0);
            d3.select("#canvas").attr("style", "left: 0px; height: " + height + "px;");
            d3.select("#plotCanvas").attr("height", height).attr("width", width-sideBarWidth);
        }
        else if(button.attr("xlink:href") == "images/fullscreenclick.png")
        {
            fullScreen = false;
            button.attr("xlink:href", "images/fullscreennormal.png");
            d3.select("#variable.panel").attr("style", "width: " + (width - canvasWidth - sideBarWidth) + "px; height: " + height + "px;"); 
            d3.select("#variablePanelSVG").attr("width", (width - canvasWidth - sideBarWidth));            
            d3.select("#visualization.panel").attr("style", "width: " + (canvasWidth + sideBarWidth) + "px; height: " + height/4 + "px; top: " + canvasHeight + "px; left: " + (width - canvasWidth - sideBarWidth) + "px;");                    
            d3.select("#visualizationPanelSVG").attr("height", height/4);
            d3.select("#canvas").attr("style", "position: absolute; width: " + canvasWidth + "px; height: " + canvasHeight + "px; top: 0px; left: " + (width - canvasWidth - sideBarWidth) + "px;");    
            d3.select("#plotCanvas").attr("height", canvasHeight).attr("width", canvasWidth);
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
        
        if(currentVisualizationSelection == "Scatterplot")
        {
            if(choice != currentVariableSelection[1])
            {   
                var temp = currentVariableSelection[1];
                currentVariableSelection[1] = currentVariableSelection[0];
                currentVariableSelection[0] = temp;
                
                makePlot();  
            }
        
            var variableList = sort(currentVariableSelection);
        
                console.log("\n\t\tFinding the regression model to predict the outcome variable (" + currentVariableSelection[1] + ") from the explanatory variable (" + currentVariableSelection[0] + ")");
        
                //some interaction to get the variables :)
        
                removeElementsByClassName("outcomeVariable");
                removeElementsByClassName("dialogBox");
        
            setTimeout(function(){            
                removeElementsByClassName("regression");
                removeElementsByClassName("significanceTest");
                removeElementsByClassName("effectSize");
                getLinearModelCoefficients(currentVariableSelection[1], currentVariableSelection[0]);
            }, 300);  
        }
        else if(currentVisualizationSelection == "Scatterplot-matrix")
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
                currentVisualizationSelection = "Scatterplot";
                makePlot();
            }
            else
                performMultipleRegression(outcomeVariable, explanatoryVariables);
        }
    }
    
//     else if((e.button == 1 && window.event != null || e.button == 0) && target.id == "regressionLine")
//     {
//         //TODO: fade out the datapoints
//         setup(e, target);
//         
//         var canvas = d3.select("#plotCanvas");
//         
//         var mouseX = toModifiedViewBoxForRegressionLineXCoordinate(e.pageX);
//         var mouseY = toModifiedViewBoxForRegressionLineYCoordinate(e.pageY);
//         
//         canvas.append("circle")
//                 .attr("cx", mouseX)
//                 .attr("cy", mouseY)
//                 .attr("r", "7px")
//                 .attr("fill", "steelblue")
//                 .attr("class", "regressionPredictionInstance");        
//         
//         
//         if(mouseX < toModifiedViewBoxForRegressionLineXCoordinate(canvasWidth/2 - plotWidth/2 - axesOffset))
//         {
//             console.log("left of x-axis");
//         }
//         if(mouseY > toModifiedViewBoxForRegressionLineXCoordinate(canvasHeight/2 + plotHeight/2 + axesOffset))
//         {
//             console.log("bottom of y-axis");
//         }
//         
//         canvas.append("line")
//                 .attr("x1", mouseX)
//                 .attr("y1", mouseY)
//                 .attr("x2", toModifiedViewBoxForRegressionLineXCoordinate(canvasWidth/2 - plotWidth/2 - axesOffset))
//                 .attr("y2", mouseY)
//                 .attr("stroke", "purple")
//                 .attr("stroke-dasharray", "5,5")
//                 .attr("id", "x")
//                 .attr("class", "LineToAxisInstance");
//                     
//         canvas.append("line")
//                 .attr("x1", mouseX)
//                 .attr("y1", mouseY)
//                 .attr("x2", mouseX)
//                 .attr("y2", toModifiedViewBoxForRegressionLineYCoordinate(canvasHeight/2 + plotHeight/2 + axesOffset))
//                 .attr("stroke", "purple")
//                 .attr("stroke-dasharray", "5,5")
//                 .attr("id", "y")
//                 .attr("class", "LineToAxisInstance");
//     }
    
    else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "interactionEffect")
    {
        setup(e, target);
        
        var button = d3.select("#button.interactionEffect");
        removeElementsByClassName("interactionEffect");
        
        resetSVGCanvas();
        drawFullScreenButton();
        
        drawInteractionEffectPlot();
    }
    
    else if((e.button == 1 && window.event != null || e.button == 0) && target.id == "tukey")
    {
        var variableList = sort(currentVariableSelection);
        console.dir(variableList);
        console.log(variableList["independent"].length);
        
        if(variableList["independent"].length == 1)
        {
            performTukeyHSDTestOneIndependentVariable(variableList["dependent"][0], variableList["independent"][0]);
        }
        else if(variableList["independent"].length == 2)
        {
            performTukeyHSDTestTwoIndependentVariables(variableList["dependent"][0], variableList["independent"][0], variableList["independent"][1]);
        }
    }
    
//     else if((e.button == 1 && window.event != null || e.button == 0) && target.className.baseVal == "outliers")
//     {
//         setup(e, target);
//         
//         //give two options (remove this outlier, analyse other outliers, cancel)
//         var canvas = d3.select("#plotCanvas");
//         
//         var mouseX = e.pageX - (width - canvasWidth);
//         var mouseY = e.pageY;
//         
//         canvas.append("rect")
//                 .attr("x", mouseX)
//                 .attr("y", mouseY)
//                 .attr("height", 
//     }
    
    else
    {
        //the user clicked outside
        removeElementsByClassName("regressionPrediction");
        
        if(document.getElementsByClassName("incompleteLines").length > 0)
        {
            removeElementsByClassName("incompleteLines");
            
            if(document.getElementsByClassName("completeLines").length > 0)
            {
                compareMeans();
            }
            else
            {
                _dragElement.setAttribute("fill", meanColors["normal"]);
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
//                 incompleteLines.attr("x2", e.pageX - (width - canvasWidth - sideBarWidth))
//                         .attr("y2", e.pageY);
//             }
//             else
//             {
//                 incompleteLines.attr("x2", (e.pageX/(width - sideBarWidth)) * canvasWidth)
//                         .attr("y2", (e.pageY/height) * canvasHeight);
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
// //             mouseX = ((canvasHeight - mouseY) + testResults["intercept"])/testResults["slope"];
// //             
// //     
// //             yLine.attr("x1", mouseX)
// //                  .attr("y1", height - (testResults["slope"]*mouseX - testResults["intercept"]))
// //                  .attr("x2", mouseX);
// 
// //             mouseY = toModifiedViewBoxForRegressionLineYCoordinate(testResults["slope"]*mouseX + testResults["intercept"]);
//             
//             mouseX = toModifiedViewBoxForRegressionLineXCoordinate(LEFT + getValue1(testResults["slope"]*(canvasHeight - mouseY) + testResults["intercept"], mins["X"], maxs["X"])*plotWidth);
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

    if(target.className.baseVal == "variableNameHolderFront")
    {		
        setup(e, target);
        
        var variableNameHolder = d3.selectAll("#" + target.id + ".variableNameHolderFront");
        variableNameHolder.attr("cursor","pointer");
    }
    
    else if(target.className.baseVal == "visualizationHolderFront")
    {		
        setup(e, target);
        
        var visualizationHolder = d3.selectAll("#" + target.id + ".visualizationHolderFront");
        visualizationHolder.attr("cursor","pointer");
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
            var L = canvasWidth/2 - plotWidth/2 - axesOffset;
            
            var mouseX = e.pageX - (width - canvasWidth - sideBarWidth);
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
                        .text(format2(getActualValue(meanCircle.attr("cy"))))
                        .attr("fill", meanColors["normal"])
                        .attr("class", "hover");
                        
        }   
        else
        {
            if((document.getElementsByClassName("completeLines").length+1 < (document.getElementsByClassName("means").length)) || (document.getElementsByClassName("means").length == 1))
            {            
                meanCircle.attr("cursor","pointer");
        
                //change color of the mean circle
                if(meanCircle.attr("fill") == meanColors["normal"])
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
            if(variableTypes[currentVariableSelection[i]] == false && currentVariableSelection.length > 1)
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
                if(variableTypes[currentVariableSelection[i]] != false)
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
        
        var mouseX = e.pageX - (width - canvasWidth - sideBarWidth);
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
        
        xLine.transition().duration(500).attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset);
        
        var yLine = canvas.append("line")
                .attr("x1", datapoint.attr("cx"))
                .attr("y1", datapoint.attr("cy"))
                .attr("x2", datapoint.attr("cx"))
                .attr("y2", datapoint.attr("cy"))
                .attr("stroke", meanColors["normal"])
                .attr("stroke-dasharray", "5,5")
                .attr("id", "y")
                .attr("class", "hoverText");
        
        yLine.transition().duration(500).attr("y2", canvasHeight/2 + plotHeight/2 - topOffset + axesOffset);
                
        
    }   
    
    else if(target.className.baseVal == "transformToNormal")
    {
        setup(e, target);
        d3.selectAll(".transformToNormal").attr("cursor", "pointer");
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
    
    else if(target.className.baseVal == "outliers")
    {
        setup(e, target);
        var canvas = d3.select("#plotCanvas");
        var outlier = d3.select("#" + target.id + ".outliers");
        
        outlier.attr("r", outlierRadius*2).attr("stroke", "yellow").attr("stroke-width", "2px");
        canvas.append("line")       
                .attr("x1", outlier.attr("cx"))
                .attr("y1", outlier.attr("cy"))
                .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                .attr("y2", outlier.attr("cy"))
                .attr("stroke-dasharray", "5,5")
                .attr("stroke", "black")
                .attr("class", "hover");    
        
        canvas.append("text")
                .attr("x", e.pageX - (window-canvasWidth-sideBarWidth) + 9)
                .attr("y", e.pageY + 9)
                .attr("text-anchor", "middle")
                .text(format(getActualValue(outlier.attr("cy"))))
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
                .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                .attr("y2", tFringe.attr("y1"))
                .attr("stroke-dasharray", "5,5")
                .attr("stroke", "black")
                .attr("class", "hover");    
        
         canvas.append("line")       
                .attr("x1", bFringe.attr("x1"))
                .attr("y1", bFringe.attr("y1"))
                .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                .attr("y2", bFringe.attr("y1"))
                .attr("stroke-dasharray", "5,5")
                .attr("stroke", "black")
                .attr("class", "hover");    
    
        canvas.append("text")
                .attr("x", (parseFloat(tFringe.attr("x1")) + parseFloat(tFringe.attr("x2")))/2)
                .attr("y", parseFloat(tFringe.attr("y1")) - displayOffsetTop)
                .attr("text-anchor", "middle")
                .text(format(getActualValue(tFringe.attr("y1"))))
                .attr("class", "hover");
        
        canvas.append("text")
                .attr("x", (parseFloat(bFringe.attr("x1")) + parseFloat(bFringe.attr("x2")))/2)
                .attr("y", parseFloat(bFringe.attr("y1")) + displayOffsetBottom)
                .attr("text-anchor", "middle")
                .text(format(getActualValue(bFringe.attr("y1"))))
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
                .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                .attr("y2", topFringe.attr("y1"))
                .attr("stroke", "black")
                .attr("stroke-dasharray", "5,5")
                .attr("class", "hover");
                
        var bottomLine = canvas.append("line")
                .attr("x1", (parseFloat(bottomFringe.attr("x1")) + parseFloat(bottomFringe.attr("x2")))/2)
                .attr("y1", bottomFringe.attr("y1"))
                .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                .attr("y2", bottomFringe.attr("y1"))
                .attr("stroke", "black")
                .attr("stroke-dasharray", "5,5")
                .attr("class", "hover");
                   
        canvas.append("text")
                .attr("x",parseFloat(topFringe.attr("x1")))
                .attr("y", parseFloat(topFringe.attr("y1")) - displayOffsetTop)
                .attr("text-anchor", "middle")
                .text(format(getActualValue(parseFloat(topFringe.attr("y1")))))
                .attr("class", "hover");
                
        canvas.append("text")
                .attr("x",parseFloat(bottomFringe.attr("x1")))
                .attr("y", parseFloat(bottomFringe.attr("y1")) + displayOffsetBottom)
                .attr("text-anchor", "middle")
                .text(format(getActualValue(parseFloat(bottomFringe.attr("y1")))))
                .attr("class", "hover");
    }
    
    else if(target.className.baseVal == "regression")
    {
        var regressionElements = d3.selectAll(".regression").attr("cursor", "pointer");
    }
    
//     else if(target.id == "regressionLine")
//     {
//         var canvas = d3.select("#plotCanvas");
//         var mouseX = e.pageX - (width - canvasWidth);
//         var mouseY = e.pageY; 
//         
//         var interceptCircle = d3.select("#interceptCircle");
//         var intercept = interceptCircle.attr("cy");
//         var slope;
//         var regressionLine = d3.select("#regressionLine");
//         
//         //get intercept and slope
//         intercept = getNormalYAxisCoordinateFromScaledViewBoxCoordinate(intercept);
//         slope = (getNormalYAxisCoordinateFromScaledViewBoxCoordinate(regressionLine.attr("y2")) - getNormalYAxisCoordinateFromScaledViewBoxCoordinate(regressionLine.attr("y1")))/(getNormalXAxisCoordinateFromScaledViewBoxCoordinate(regressionLine.attr("x2")) - getNormalXAxisCoordinateFromScaledViewBoxCoordinate(regressionLine.attr("x1")));
//         
//         console.log("m=" + slope + "; intercept=" + intercept);
//         
//         canvas.append("line")
//                 .attr("x1", toX(0))
//                 .attr("y1", toY(intercept))
//                 .attr("x2", toX(canvasWidth))
//                 .attr("y2", toY(slope*canvasWidth + intercept))
//                 .attr("stroke", "red");
//         
// //         mouseY = slope*mouseX + intercept;
//         mouseX = (mouseX*viewBoxWidthForRegressionLine/canvasWidth + viewBoxXForRegressionLine);
//         mouseY = (mouseY*viewBoxHeightForRegressionLine/canvasHeight + viewBoxYForRegressionLine);
//         
//         console.log("mouseX=" + mouseX + ", mouseY=" + mouseY);
//         console.log("mouseX=" + getNormalXAxisCoordinateFromScaledViewBoxCoordinate(mouseX) + ", mouseY=" + getNormalYAxisCoordinateFromScaledViewBoxCoordinate(mouseY));
//         
//         
//         canvas.append("circle")
//                 .attr("cx", toX(mouseX))
//                 .attr("cy", canvasHeight - toY(mouseY))
//                 .attr("r", "10px")
//                 .attr("fill", "green");
//                 
//     
//     }
    
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
                .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                .attr("y2", mean.attr("cy"))
                .attr("stroke", mean.attr("fill"))
                .attr("stroke-dasharray", "5,5")
                .attr("class", "hover");
        
        console.log(mean.attr("data-index1"));
        canvas.append("text")
                .attr("x", e.pageX - (width - canvasWidth - sideBarWidth) + 9)
                .attr("y", e.pageY + 9)
                .attr("fill", "black")
                .text(tukeyResults[mean.attr("data-index1")][mean.attr("data-index2")]["difference"])
                .attr("class", "hover");
    }
    
    else if((target.className.baseVal == "tukeyCI") || (target.className.baseVal == "tukeyCITop") || (target.className.baseVal == "tukeyCIBottom"))
    {
        setup(e, target);
        console.log("'ola");
        
        var tCI = d3.select("#" + target.id + ".tukeyCI");
        var tCITop = d3.select("#" + target.id + ".tukeyCITop");
        var tCIBottom = d3.select("#" + target.id + ".tukeyCIBottom");
        
        var canvas = d3.select("#plotCanvas");
        
        canvas.append("line")
                .attr("x1", tCITop.attr("x1"))
                .attr("y1", tCITop.attr("y1"))
                .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                .attr("y2", tCITop.attr("y1"))
                .attr("stroke", tCITop.attr("stroke"))
                .attr("stroke-dasharray", "5,5")
                .attr("class", "hover");
        canvas.append("line")
                .attr("x1", tCIBottom.attr("x1"))
                .attr("y1", tCIBottom.attr("y1"))
                .attr("x2", canvasWidth/2 - plotWidth/2 - axesOffset)
                .attr("y2", tCIBottom.attr("y1"))
                .attr("stroke", tCIBottom.attr("stroke"))
                .attr("stroke-dasharray", "5,5")
                .attr("class", "hover");
        
        canvas.append("text")
                .attr("x", tCITop.attr("x1"))
                .attr("y", tCITop.attr("y1") - displayOffsetTop)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .text(tukeyResults[tCITop.attr("data-index1")][tCITop.attr("data-index2")]["upper"])
                .attr("class", "hover");
        
        canvas.append("text")
                .attr("x", tCIBottom.attr("x1"))
                .attr("y", tCIBottom.attr("y2") + displayOffsetBottom)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .text(tukeyResults[tCIBottom.attr("data-index1")][tCIBottom.attr("data-index2")]["lower"])
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
                differenceInMeansLines[i].setAttribute("opacity", "0.2");
            }
        }
    }
    
    else if(target.className.baseVal == "interactionEffect")
    {
        setup(e, target);
        
        d3.selectAll(".interactionEffect").attr("cursor", "pointer");
    }
}

function OnMouseOut(e)
{    
    var target = e.target != null ? e.target : e.srcElement;
                
    if(target.className.baseVal == "variableNameHolder")                
    {
        var variableNameHolder = d3.selectAll("#" + target.id + ".variableNameHolder");
    }
    
    else if(target.className.baseVal == "visualizationHolder")                
    {
        var visualizationHolder = d3.selectAll("#" + target.id + ".visualizationHolder");
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
        
//         removeElementsByClassName("loops");
        
        
//         clearInterval(intervals[meanCircle.attr("id")]);
        
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