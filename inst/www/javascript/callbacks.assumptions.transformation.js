function callBackForPerformNormalityTest(p)
{
    if(p < 0.05)
    {   
        //not normal
        if(variableList["independent"].length == 0)
        {
            //one sample t-test
            d3.select("#normality.assumptionNodes").attr("fill", "red");
            
            if(!global.flags.isTestWithoutTimeout )
            {                
                d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + scaledPlotPanelHeight);
                drawAdvancedPlotButton();
            }

            //draw boxplots in red 
            drawBoxPlotInRed(variableList["dependent"][0]);
            drawNormalityPlot(variableList["dependent"][0], "dataset", "notnormal");

            findTransformForNormalityForDependentVariables(getNumericVariables());
        }
        else
        {
            setDistribution(dependentVariable, level, false);
        }
    }
    else
    {   
        //normal
        if(variableList["independent"].length == 0)
        {
            d3.select("#normality.assumptionNodes").attr("fill", "green");
            
    
            drawDialogBoxToGetPopulationMean();
        }
        else
        {
            setDistribution(dependentVariable, level, true);
        }
    }
}

function callBackForPerformHomoscedasticityTest(output)
{
    var p = output.p;
    var variableList = selectedVisualisation == "DoSignificanceTest" ? sort(selectedVariables) : getSelectedVariables();
    var DV = variableList["dependent"][0];

    // - - - - - - - - - - - - - Set state and draw plot if assumption is violated - - - - - - - - - - - - - 
    if(p < 0.05)
    {           
        // Heteroscedastic               
        d3.select("#homogeneity.assumptionNodes").attr("fill", "red");                 
        console.log("Homogeneity: false");

        if(selectedVisualisation != "DoSignificanceTest")
        {
            d3.select('#plotCanvas').transition().attr("viewBox", "0 0 " + plotPanelWidth + " " + scaledPlotPanelHeight);                
            drawHomogeneityPlot(false);
        }

        findTransformForHomogeneity();
    }
    else
    {   
        // Homoscedastic               
        console.log("Homogeneity: true");
        d3.select("#homogeneity.assumptionNodes").attr("fill", "green");  

        testSelectionLogicAfterHomogeneityTest();      
    }
}

function handleAssumptions(assumptionText)
{           
    if(assumptionText.attr("fill") == "black")
    {
        assumptionText.attr("fill", "#627bf4");

        switch(assumptionText.attr("id"))
        {
            case "normality":
                            {
                                removeElementsByClassName("densityCurve");
                                var homogeneityText = d3.select("#homogeneity.assumptionsText");                                           
                                d3.select("#effectsPlotPanel").attr("style", "display: none");
                                d3.select("#statisticalTestName.assumptionNodes").attr("text-decoration", "underline");
                                
                                homogeneityText.attr("fill", "black");
                                removeElementsByClassName("tempDisplay")

                                var variableList = getSelectedVariables();
                        
                                var dependentVariable = variableList["dependent"][0];

                                d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + scaledPlotPanelHeight);
                                drawAdvancedPlotButton();

                                if(variableList["independent"].length == 2)
                                {
                                    var levels = getSelectedMeanLevelsForColourBoxPlotData();

                                    for(var i=0; i<levels.length; i++)
                                    {   
                                        if(distributions.hasOwnProperty(dependentVariable))
                                        {
                                            if(distributions[dependentVariable][levels[i]] == false)
                                            {   
                                                //draw boxplots in red 
                                                drawBoxPlotInRed(levels[i]);
                                                drawNormalityPlot(dependentVariable, levels[i], "notnormal");
                                            }
                                            else
                                            {                                                
                                                drawNormalityPlot(dependentVariable, levels[i], "normal");
                                            }
                                        }
                                        else
                                        {
                                             if(distributions[levels[i]] == false)
                                            {   
                                                //draw boxplots in red 
                                                drawBoxPlotInRed(levels[i]);
                                                drawNormalityPlot(dependentVariable, levels[i], "notnormal");
                                            }
                                            else
                                            {                                                
                                                drawNormalityPlot(dependentVariable, levels[i], "normal");
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    for(var i=0; i<variableList["independent-levels"].length; i++)
                                    {   
                                        if(distributions.hasOwnProperty(dependentVariable))
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
                                        else if(distributions.hasOwnProperty(variableList["independent-levels"][i]))
                                        {
                                             if(distributions[variableList["independent-levels"][i]] == false)
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
                                }
                                

                                
                        
                                break;
                            }
            case "homogeneity":
                            {
                                var normalityText = d3.select("#normality.assumptionsText");                                                                                       
                                normalityText.attr("fill", "black");
                                d3.select("#effectsPlotPanel").attr("style", "display: none");
                                d3.select("#statisticalTestName.assumptionNodes").attr("text-decoration", "underline");
                                removeElementsByClassName("tempDisplay")

                                var variableList = sort(selectedVariables);
                                
                                var homogeneity = d3.select("#homogeneity.assumptionNodes").attr("fill") == "green" ? true : false;

                                d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + scaledPlotPanelHeight);
                                drawAdvancedPlotButton();        
                                drawHomogeneityPlot(homogeneity);                                               

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
        assumptionText.attr("fill", "black");

        switch(assumptionText.attr("id"))
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
        }
    }
}