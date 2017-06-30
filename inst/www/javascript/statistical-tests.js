// Test selection

function compareMeans()
{   
    global.flags.isTestWithoutTimeout = isTestInHistory();  // If the test is in history, we show the test results without delay.     

    var timeOut = global.flags.isTestWithoutTimeout ? 0 : config.timeouts.assumptions;    

    var variableList = getSelectedVariables();  
    var DV = variableList["dependent"][0];

    var numberOfSelectedMeans = getNumberOfSelectedMeans();
    
    // Remove the selection buttons
    removeElementsByClassName("selectAll");
    removeElementsByClassName("selectNone");

    switch(numberOfSelectedMeans)
    {
        case 1:
            
                    // ToDo: one-sample tests

                    console.log("Not available in VisiStat!");                
                    break;

        case 2:

                    // Two-sample tests (unpaired t-test, Wilcoxon rank-sum/Mann-Whitney U test, Welch's t-test, paired t-test, and Wilcoxon signed-rank test)

                    if(variableList["independent"].length == 1)
                    {    
                        drawAssumptionNodes(false);                          
                        var IV = variableList["independent"][0];

                        if((experimentalDesign == "within-groups") && (getWithinGroupVariable(variableList) == IV))
                        {
                            // Within-subjects factor

                            setTimeout(function(){                    
                                performNormalityTests(); 
                            }, timeOut);                            
                        }
                        else
                        {                                    
                            // Between-subjects factor

                            setTimeout(function(){                    
                                performHomoscedasticityTest();
                            }, timeOut);                            
                        }            
                    }     
                    else
                    {                       
                        // ToDo: select all the means (Why? See Evernote note: https://www.evernote.com/shard/s98/nl/10853678/a29f7755-cf91-45c0-b04e-1a226dec1843/)
                        selectAllMeans();
                        
                        // Check for assumptions      
                        drawAssumptionNodes(false);      

                        setTimeout(function(){                                                    
                                performHomoscedasticityTest();                    
                            }, timeOut);                           
                    }

                    break;
        
        default: 

                    if(variableList["independent"].length == 1)
                    {    
                        drawAssumptionNodes(true);      

                        // Statistical tests for 3+ levels and 1 IV (one-way ANOVA, Kruskal-Wallis test, Welch's ANOVA, one-way repeated-measures ANOVA, and Friedman's analysis)              
                        var IV = variableList["independent"][0];
                        
                        if((experimentalDesign == "within-groups") && (getWithinGroupVariable(variableList) == IV))
                        {
                            // Within-subjects factor

                            setTimeout(function(){                    
                                performNormalityTests();
                            }, timeOut);                                
                        }
                        else
                        {
                            // Between-subjects factor

                            setTimeout(function(){                    
                                performHomoscedasticityTest();
                            }, timeOut);                            
                        }           
                    }
                    else                        
                    {
                        // Statistical tests for 3+ levels and 2+ IVs (Independent Factorial ANOVA and n-way repeated-measures ANOVA)                        
                            
                        drawAssumptionNodes(false);      

                        setTimeout(function(){                                                    
                                performHomoscedasticityTest();                    
                            }, timeOut);
                    }   
                    break;                 
    }
}

function removeSignificanceTestStuff()
{
    removeElementsByClassName("differenceInMeans")
    removeElementsByClassName("CIMean")
    removeElementsByClassName("differenceInMeansText")

    if(document.getElementById("differenceInMeansMain")) removeElementById("differenceInMeansMain");
}

function doStatisticalTest(testName)
{
    var variableList = sort(selectedVariables);
    var DV = variableList["dependent"][0];
    var IVs = variableList["independent"];
    var IV = variableList["independent"][0];

    switch(testName)
    {
        case "Pairedt-test":
                            var groupA, groupB; 
                            removeSignificanceTestStuff()

                            groupA = variables[DV][variableList["independent-levels"][0]];
                            groupB = variables[DV][variableList["independent-levels"][1]];

                            performTTest(groupA, groupB, "TRUE", "TRUE");

                            removeToolTip({id: "differenceInMeansMain", className: null});

                            break;

        case "Wilcoxonsigned-ranktest":
                            var groupA, groupB; 
                            removeSignificanceTestStuff()

                            groupA = variables[DV][variableList["independent-levels"][0]];
                            groupB = variables[DV][variableList["independent-levels"][1]];

                            removeToolTip({id: "differenceInMeansMain", className: null});

                            performWilcoxonSignedRankTest(groupA, groupB);

                            break;

        case "Unpairedt-test":
                            var groupA, groupB; 
                            removeSignificanceTestStuff()

                            groupA = variables[DV][variableList["independent-levels"][0]];
                            groupB = variables[DV][variableList["independent-levels"][1]];

                            removeToolTip({id: "differenceInMeansMain", className: null});

                            performTTest(groupA, groupB, "TRUE", "FALSE");

                            break;

        case "Mann-WhitneyUtest":
                            var groupA, groupB; 
                            removeSignificanceTestStuff()

                            groupA = variables[DV][variableList["independent-levels"][0]];
                            groupB = variables[DV][variableList["independent-levels"][1]];

                            removeToolTip({id: "differenceInMeansMain", className: null});

                            performMannWhitneyTest(groupA, groupB);

                            break;
                               
        case "Welchst-test":
                            var groupA, groupB; 
                            removeSignificanceTestStuff()

                            groupA = variables[DV][variableList["independent-levels"][0]];
                            groupB = variables[DV][variableList["independent-levels"][1]];

                            removeToolTip({id: "differenceInMeansMain", className: null});

                            performTTest(groupA, groupB, "FALSE", "FALSE");

                            break;

        case "One-wayRMANOVA":
                            performOneWayRepeatedMeasuresANOVA(DV, IV);  
                            removeSignificanceTestStuff()
                            removeToolTip({id: "differenceInMeansMain", className: null});

                            break;

        case "FriedmansAnalysis":
                            performFriedmanTest(DV, IV);
                            removeSignificanceTestStuff()
                            removeToolTip({id: "differenceInMeansMain", className: null});

                            break;

        case "One-wayANOVA":
                            performOneWayANOVA(DV, IV);
                            removeSignificanceTestStuff()
                            removeToolTip({id: "differenceInMeansMain", className: null});

                            break;

        case "KruskalWallistest":
                            performKruskalWallisTest(DV, IV);
                            removeSignificanceTestStuff()
                            removeToolTip({id: "differenceInMeansMain", className: null});
                            
                            break;

        case "WelchsANOVA":
                            performWelchANOVA(DV, IV);
                            removeSignificanceTestStuff()
                            removeToolTip({id: "differenceInMeansMain", className: null});

                            break;

        case "Pairwisepairedt-test":
                            performPairwiseTTestsWithBonferroniCorrection("T", "T");
                            removeSignificanceTestStuff()
                            removeToolTip({id: "differenceInMeansMain", className: null});

                            break;

        case "Friedmanmultiple-comparisons":
                            // ?
                            
                            break;

        case "TukeyHSDtest":
                            performTukeyHSDTest();

                            break;

        case "PairwiseunpairedWilcox-test":
                            performPairwiseWilcoxTestsWithBonferroniCorrection("F");

                            break;

        case "PairwiseWelchst-test":                            
                            performPairwiseTTestsWithBonferroniCorrection("F", "F");
                            
                            break;

        default:
                            break;
    }
}

function populationMeanEntered()
{
    var populationValue = document.getElementById("populationValue").value;
    var variableList = getSelectedVariables();
    
    if(d3.select("#normality.assumptionNodes").attr("fill") == "red")
    {    
        sessionStorage.popMedian = parseFloat(populationValue);
        
        removeElementsByClassName("dialogBox");
        
        performOneSampleWilcoxonTest(variableList["dependent"][0]);
    }
    else
    {
        sessionStorage.popMean = parseFloat(populationValue);
        
        removeElementsByClassName("dialogBox");
        
        performOneSampleTTest(variableList["dependent"][0]);
    }
}

function doPairwiseTests()
{
    var completeLines = d3.selectAll(".completeLines");
    var variableList = getSelectedVariables();  
    
    //homoscedasticity
    drawAssumptionNodes();
    
    var sampleSize;
    sampleSizesAreEqual = true;
    
    if(variableList["independent"].length == 2)
    {
        var levelsA = variableList["independent-levels"][0];
        var levelsB = variableList["independent-levels"][1];
        
        sampleSize = colourBoxPlotData[levelsA[0]][levelsB[0]].length;
    }
    else
    {
        sampleSize = variables[variableList["dependent"][0]][variableList["independent-levels"][0]].length;
        
        sampleSizesAreEqual = variables[variableList["dependent"][0]][variableList["independent-levels"][1]].length == variables[variableList["dependent"][0]][variableList["independent-levels"][0]].length ? true : false;
    }
    
    if(!sampleSizesAreEqual && experimentalDesign=="Between-groups")
    {
        alert("Between-groups design was detected but number of samples are different!");
        return;
    }                    
    else
    {
        performNormalityTests(); 
    }                   
}

function performNormalityTests()
{
    var variableList = selectedVisualisation == "DoSignificanceTest" ? sort(selectedVariables) : getSelectedVariables();    

    var DV = variableList["dependent"][0];
    
    // Init. distribution flags
    distributions[DV] = {};
    
    if(variableList["independent"].length == 1)
    {
        // - - - - - - - - - - - - - 1 IV - - - - - - - - - - - - - 

        var combinedDistributions = new Array();
        var numberOfDistributions = new Array();

        for(j=0; j<variableList["independent-levels"].length; j++) // for each level of the IV...
        {  
            for(k=0; k<variables[DV][variableList["independent-levels"][j]].length; k++) // for each element in the distribution of the DV corresponding the level j
            {
                combinedDistributions.push(variables[DV][variableList["independent-levels"][j]][k]);
            }
            
            numberOfDistributions.push(variables[DV][variableList["independent-levels"][j]].length);
        }
        
        performNormalityTestForMultipleDistributions(combinedDistributions, numberOfDistributions); // We send one enormous array of numbers with another array of array-sizes (to split up the enormous array)
    }
    else
    {
        // - - - - - - - - - - - - - 2+ IVs - - - - - - - - - - - - - 

        var combinedDistributions = new Array();
        var numberOfDistributions = new Array();

        if(variableList["independent"].length == 3)
        {
            // Get the distributions

            var levelsA = variables[variableList["independent"][0]]["dataset"].unique();
            var levelsB = variables[variableList["independent"][1]]["dataset"].unique();
            var levelsC = variables[variableList["independent"][2]]["dataset"].unique();

            for(var i=0; i<levelsA.length; i++)
            {
                for(var j=0; j<levelsB.length; j++)
                {
                    for(var k=0; k<levelsC.length; k++)
                    {
                        var variablesObject = variables[DV];
                        var dist; 

                        if(variablesObject.hasOwnProperty(levelsA[i] + "-" + levelsB[j] + "-" + levelsC[k]))
                        {
                            dist = variablesObject[levelsA[i] + "-" + levelsB[j] + "-" + levelsC[k]];
                        }
                        else if(variablesObject.hasOwnProperty(levelsA[i] + "-" + levelsC[k] + "-" + levelsB[j]))
                        {
                            dist = variablesObject[levelsA[i] + "-" + levelsC[k] + "-" + levelsB[j]];
                        }
                        else if(variablesObject.hasOwnProperty(levelsB[j] + "-" + levelsA[i] + "-" + levelsC[k]))
                        {
                            dist = variablesObject[levelsB[j] + "-" + levelsA[i] + "-" + levelsC[k]];
                        }
                        else if(variablesObject.hasOwnProperty(levelsB[j] + "-" + levelsC[k] + "-" + levelsA[i]))
                        {
                            dist = variablesObject[levelsB[j] + "-" + levelsC[k] + "-" + levelsA[i]];
                        }
                        else if(variablesObject.hasOwnProperty(levelsC[k] + "-" + levelsA[i] + "-" + levelsB[j]))
                        {
                            dist = variablesObject[levelsC[k] + "-" + levelsA[i] + "-" + levelsB[j]];
                        }
                        else if(variablesObject.hasOwnProperty(levelsC[k] + "-" + levelsB[j] + "-" + levelsA[i]))
                        {
                            dist = variablesObject[levelsC[k] + "-" + levelsB[j] + "-" + levelsA[i]];
                        }

                        for(l = 0; l<dist.length; l++)
                        {
                            combinedDistributions.push(dist[l]);
                        }

                        numberOfDistributions.push(dist.length);
                    }
                }
            }
        }        
        else
        {
            var groups = getGroupsForColourBoxPlotData();        
            
            for(var i=0; i<groups.length; i++)
            {  
                numberOfDistributions.push(groups[i].length);            
                
                for(var j=0; j<groups[i].length; j++)
                {
                    combinedDistributions.push(groups[i][j]);
                }
            }
        }

        performNormalityTestForMultipleDistributions(combinedDistributions, numberOfDistributions);       
    }
    
}

function setDistribution(DV, level, distributionIsNormal)
{    
    if(distributions[DV] == undefined)
        distributions[DV] = new Object();
    
    distributions[DV][level] = distributionIsNormal;    

    var numberOfHypotheticallySelectedMeans = 0;
    var variableList = selectedVisualisation == "DoSignificanceTest" ? sort(selectedVariables) : getSelectedVariables(); 

    var timeOut = 0;

    if(selectedVisualisation == "DoSignificanceTest")
    {
        var levelsA = variables[variableList["independent"][0]]["dataset"].unique();
        var levelsB = variables[variableList["independent"][1]]["dataset"].unique();
        var levelsC = variables[variableList["independent"][2]]["dataset"].unique();

        numberOfHypotheticallySelectedMeans = levelsA.length * levelsB.length * levelsC.length;
    }

    if((getObjectLength(distributions[DV]) == getNumberOfSelectedMeans()) || ((selectedVisualisation == "DoSignificanceTest") && (getObjectLength(distributions[DV]) == numberOfHypotheticallySelectedMeans)))
    {   
        var distributionsAreNormal = true;
        
        for(var i=0; i<variableList["independent-levels"].length; i++)
        {   
            if(distributions[DV][variableList["independent-levels"][i]] == false)
            {
                d3.select("#normality.assumptionNodes").attr("fill", "red");                
                distributionsAreNormal = false;
                
                if(selectedVisualisation != "DoSignificanceTest")
                {
                    if(!global.flags.isTestWithoutTimeout  )
                    {                        
                        d3.select("#plotCanvas").transition().duration(1000).attr("viewBox", "0 0 " + plotPanelWidth + " " + scaledPlotPanelHeight);
                        drawAdvancedPlotButton();
                    }
                    
                    //draw boxplots in red 
                    drawBoxPlotInRed(variableList["independent-levels"][i]);
                    drawNormalityPlot(DV, variableList["independent-levels"][i], "notnormal");
                    timeOut = 1200;
                }
            }
        }        
        
        if(distributionsAreNormal)        
        {
            d3.select("#normality.assumptionNodes").attr("fill", "green");              
            testSelectionLogicAfterNormalityTest();
        }
        else
         {
            d3.select("#normality.assumptionNodes").attr("fill", "red");              
            console.log("Normality: false");

            // Check for transformations and if transformations are not possible, insert code.    
            
            findTransformForNormality();
         }   
    }
}

function testSelectionLogicAfterHomogeneityTest()
{
    var variableList = sort(selectedVariables);
    var DV = variableList["dependent"][0];
    var IVs = variableList["independent"][0];

    var timeOut = global.flags.isTestWithoutTimeout ? 0 : 1200;        

    setTimeout(function() {

        // - - - - - - - - - - - - - Select test/follow-up on the other assumption - - - - - - - - - - - - - 

        if(getNumberOfSelectedMeans() == 2)              
        {
            // - - - - - - - - - - - - - Comparison between two distributions - - - - - - - - - - - - - 

            if(variableList["independent"].length == 1)
            {
                // - - - - - - - - - - - - - 1 IV - - - - - - - - - - - - - 
                var IV = variableList["independent"][0];

                if((experimentalDesign == "within-groups") && (getWithinGroupVariable(variableList) == IV))
                {
                    // Within-subjects factor

                    var distributionsAreHomoscedastic = d3.select("#homogeneity.assumptionNodes").attr("fill") == "green" ? true : false;
                    var distributionsAreNormal = d3.select("#normality.assumptionNodes").attr("fill") == "green" ? true : false;

                    var groupA, groupB; 

                    groupA = variables[DV][variableList["independent-levels"][0]];
                    groupB = variables[DV][variableList["independent-levels"][1]];

                    if(distributionsAreNormal && distributionsAreHomoscedastic)
                    {
                        // Paired t-test     
                        usedMultiVariateTestType = "proper";

                        performTTest(groupA, groupB, "TRUE", "TRUE");
                    }
                    else if(distributionsAreHomoscedastic)
                    {
                        // Wilcoxon signed-rank test                        
                        usedMultiVariateTestType = "proper";

                        performWilcoxonSignedRankTest(groupA, groupB);
                    }
                    else
                    {
                        console.log("Test not available in VisiStat");

                        usedMultiVariateTestType = "error";
                        d3.select("#statisticalTest.assumptionNodes").attr("fill", "red");

                        performWilcoxonSignedRankTest(groupA, groupB);
                    }
                }
                else
                {
                    // Between-subjects factor

                    performNormalityTests();
                }
            }
            else
            {
                // - - - - - - - - - - - - - 2+ IVs - - - - - - - - - - - - - 

                console.log("Error: this should not happen: condition should be handled in compareMeans()");
            }
        }
        else
        {
            // - - - - - - - - - - - - - Comparison between 3+ distributions - - - - - - - - - - - - - 

            if(variableList["independent"].length == 1)
            {
                // - - - - - - - - - - - - - 1 IV - - - - - - - - - - - - - 

                var IV = variableList["independent"][0];

                if((experimentalDesign == "within-groups") && (getWithinGroupVariable(variableList) == IV))
                {
                    // Within-subjects factor

                    var distributionsAreHomoscedastic = d3.select("#homogeneity.assumptionNodes").attr("fill") == "green" ? true : false;
                    var distributionsAreNormal = d3.select("#normality.assumptionNodes").attr("fill") == "green" ? true : false;

                    if(distributionsAreNormal && distributionsAreHomoscedastic)
                    {
                        // One-way repeated-measures ANOVA
                        usedMultiVariateTestType = "proper";

                        performOneWayRepeatedMeasuresANOVA(DV, IV);  
                    }
                    else if(distributionsAreNormal)
                    {
                        // Friedman's analysis
                        usedMultiVariateTestType = "proper";

                        performFriedmanTest(DV, IV);
                    }
                    else
                    {
                        console.log("Test not available in VisiStat");
                        usedMultiVariateTestType = "error";
                        d3.select("#statisticalTest.assumptionNodes").attr("fill", "red");

                        performFriedmanTest(DV, IV);
                    }
                }
                else
                {
                    // Between-subjects factor

                    performNormalityTests();
                }
            }
            else
            {
                // - - - - - - - - - - - - - 2+ IVs - - - - - - - - - - - - - 

                performNormalityTests();
            }
        }     
    }, timeOut); 
}

function testSelectionLogicAfterNormalityTest()
{
    var variableList = sort(selectedVariables);
    var DV = variableList["dependent"][0];
    var IVs = variableList["independent"][0];

    var timeOut = global.flags.isTestWithoutTimeout ? 0 : 1200;       

    setTimeout(function() {
        if(getNumberOfSelectedMeans() == 2)
        {
            // - - - - - - - - - - - - -  Comparison between 2 distributions - - - - - - - - - - - - - 

            if(variableList["independent"].length == 1)
            {
                // - - - - - - - - - - - - -  1 IV - - - - - - - - - - - - - 

                var IV = variableList["independent"][0];

                if((experimentalDesign == "within-groups") && (getWithinGroupVariable(variableList) == IV))
                {
                    // Within-subjects factor

                    performHomoscedasticityTest(DV, IV);
                }
                else
                {
                    // Between-subjects factor

                    var distributionsAreHomoscedastic = d3.select("#homogeneity.assumptionNodes").attr("fill") == "green" ? true : false;
                    var distributionsAreNormal = d3.select("#normality.assumptionNodes").attr("fill") == "green" ? true : false;

                    var groupA, groupB; 

                    groupA = variables[DV][variableList["independent-levels"][0]];
                    groupB = variables[DV][variableList["independent-levels"][1]];

                    if(distributionsAreNormal && distributionsAreHomoscedastic)
                    {
                        // Unpaired t-test
                        usedMultiVariateTestType = "proper";

                        performTTest(groupA, groupB, "TRUE", "FALSE");
                    }
                    else if(distributionsAreHomoscedastic)
                    {
                        // Mann-Whitney U test
                        usedMultiVariateTestType = "proper";

                        performMannWhitneyTest(groupA, groupB);
                    }
                    else if(distributionsAreNormal)
                    {
                        // Welch's t-test
                        usedMultiVariateTestType = "proper";

                        performTTest(groupA, groupB, "FALSE", "FALSE");
                    }
                    else
                    {
                        console.log("Test not available in VisiStat");
                        usedMultiVariateTestType = "error";
                        d3.select("#statisticalTest.assumptionNodes").attr("fill", "red");

                        performMannWhitneyTest(groupA, groupB);
                    }
                }            
            }
            else
            {
                // - - - - - - - - - - - - -  2+ IVs - - - - - - - - - - - - - 

                console.log("This should not happen: condition should be handled in compareMeans()");
            }
        }
        else
        {
            // - - - - - - - - - - - - - Comparison between 3+ distributions - - - - - - - - - - - - - 

            if(variableList["independent"].length == 1)
            {
                // - - - - - - - - - - - - - 1 IV - - - - - - - - - - - - - 

                var IV = variableList["independent"][0];

                if((experimentalDesign == "within-groups") && (getWithinGroupVariable(variableList) == IV))
                {
                    // Within-subjects factor

                    performHomoscedasticityTest(DV, IV);
                }
                else
                {
                    // Between-subjects factor

                    var distributionsAreHomoscedastic = d3.select("#homogeneity.assumptionNodes").attr("fill") == "green" ? true : false;
                    var distributionsAreNormal = d3.select("#normality.assumptionNodes").attr("fill") == "green" ? true : false;

                    if(distributionsAreNormal && distributionsAreHomoscedastic)
                    {
                        // One-way ANOVA
                        usedMultiVariateTestType = "proper";

                        performOneWayANOVA(DV, IV);
                    }
                    else if(distributionsAreHomoscedastic)
                    {
                        // Kruskal-Wallis test
                        usedMultiVariateTestType = "proper";

                        performKruskalWallisTest(DV, IV);
                    }
                    else if(distributionsAreNormal)
                    {
                        // Welch's ANOVA
                        usedMultiVariateTestType = "proper";

                        performWelchANOVA(DV, IV);
                    }
                    else
                    {
                        console.log("Test not available in VisiStat");
                        usedMultiVariateTestType = "error";
                        d3.select("#statisticalTest.assumptionNodes").attr("fill", "red");

                        performKruskalWallisTest(DV, IV);
                    }
                }
            }
            else
            {
                // - - - - - - - - - - - - -  2+ IVs - - - - - - - - - - - - - 

                displayLoadingTextForInteractionEffect();

                var distributionsAreHomoscedastic = d3.select("#homogeneity.assumptionNodes").attr("fill") == "green" ? true : false;
                var distributionsAreNormal = d3.select("#normality.assumptionNodes").attr("fill") == "green" ? true : false;

                if(distributionsAreNormal && distributionsAreHomoscedastic)
                {
                    usedMultiVariateTestType = "proper";

                    if(isMixedDesign(variableList))
                    {
                        // - - - - - - - - - - - - -  Mixed-design (at least 1 within-subjects factor) - - - - - - - - - - - - -                         

                        setTimeout(function()
                        {
                            performMixedANOVA();
                        }, timeOut["loading interaction effect"]);                        
                        
                    }
                    else
                    {
                        // - - - - - - - - - - - - -  All factors are between-subjects - - - - - - - - - - - - - 

                        setTimeout(function()
                        {
                            performNWayANOVA();
                        }, timeOut["loading interaction effect"]);  
                    }
                }
                else
                {
                    console.log("Test not available in VisiStat");

                    usedMultiVariateTestType = "error";
                    d3.select("#statisticalTest.assumptionNodes").attr("fill", "red");

                    if(isMixedDesign(variableList))
                    {
                        // - - - - - - - - - - - - -  Mixed-design (at least 1 within-subjects factor) - - - - - - - - - - - - -                         

                        setTimeout(function()
                        {
                            performMixedANOVA()
                        }, timeOut["loading interaction effect"]);
                    }
                    else
                    {
                        // - - - - - - - - - - - - -  All factors are between-subjects - - - - - - - - - - - - - 

                         setTimeout(function()
                        {
                            performNWayANOVA()
                        }, timeOut["loading interaction effect"]);
                    }
                }
            }
        }            
    }, timeOut);     
}

