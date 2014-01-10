//unpaired t-test, paired t-test, and welch's t-test
function performTTest(groupA, groupB, varianceEqual, paired) 
{
    var variableList = getSelectedVariables();    
    
    // Get variable names and their data type
    var req = ocpu.rpc("performTTest", 
    {
        groupA: groupA,
        groupB: groupB,
        variance: varianceEqual,
        paired: paired
    }, function(output) 
    {
        testResults["df"] = output.DOF;

        testResults["parameter"] = output.t;
        testResults["parameter-type"] = "t";

        testResults["error"] = output.error;

        if(varianceEqual == "FALSE")
        {
            testResults["test-type"] = "WT";
        }
        else
        {
            if(paired == "TRUE")
                testResults["test-type"] = "pT";
            else
                testResults["test-type"] = "upT";
        }


        testResults["p"] = changePValueNotation(output.p); 

        testResults["method"] = output.method;

        testResults["effect-size"] = output.d;
        testResults["effect-size-type"] = "d";
        testResults["formula"] = variableList["independent-levels"][0] + "." + variableList["dependent"][0] + " vs " + variableList["independent-levels"][1] + "." + variableList["dependent"][0];
        //add to log
        logResult();

        //drawing stuff
        removeElementsByClassName("completeLines");

        displaySignificanceTestResults();
        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//perform mann-whitney test (unpaired t-test's alternative)
function performMannWhitneyTest(groupA, groupB)
{
    var variableList = getSelectedVariables();
    
    var req = ocpu.rpc("performMannWhitneyTest", 
    {
        groupA: groupA,
        groupB: groupB
    }, function(output) 
    {                                                   
        testResults["parameter"] = output.U;
        testResults["parameter-type"] = "U";

        testResults["test-type"] = "mwT";
        testResults["error"] = output.error;
        testResults["p"] = changePValueNotation(output.p);                  
        testResults["effect-size"] = output.r;
        testResults["method"] = "Mann-Whitney U test";
        testResults["effect-size-type"] = "r";
        testResults["formula"] = variableList["independent-levels"][0] + "." + variableList["dependent"][0] + " vs " + variableList["independent-levels"][1] + "." + variableList["dependent"][0];

        logResult();

        //drawing stuff
        removeElementsByClassName("completeLines");           

        displaySignificanceTestResults();                      
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

function performWilcoxonTest(groupA, groupB)
{
    var variableList = getSelectedVariables();
   
    // Get variable names and their data type
    var req = ocpu.rpc("performWilcoxonTest", 
    {
        groupA: groupA,
        groupB: groupB
    }, function(output) 
    {                       
        testResults["parameter"] = output.V;
        testResults["parameter-type"] = "V";
    
        testResults["test-type"] = "wT";
        testResults["error"] = output.error;
        
        
        testResults["p"] = changePValueNotation(output.p);                  
        testResults["effect-size"] = output.r;
        testResults["method"] = "Wilcoxon Signed-rank test";
        testResults["effect-size-type"] = "r";
        testResults["formula"] = variableList["independent-levels"][0] + "." + variableList["dependent"][0] + " vs " + variableList["independent-levels"][1] + "." + variableList["dependent"][0];
        
        logResult();                  
      
        //drawing stuff
        removeElementsByClassName("completeLines");           

        displaySignificanceTestResults();                     
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//perform one-way ANOVA
function performOneWayANOVA(dependentVariable, independentVariable)
{
    var variableList = getSelectedVariables();  
    
    // Get variable names and their data type
    var req = ocpu.rpc("performOneWayANOVA", 
    {                    
        dependentVariable: dependentVariable,
        independentVariable: independentVariable,
        participantVariable: participants,
        dataset: dataset,
    }, function(output) 
    {                                                                                        
        testResults["df"] = output.numDF + ", " + output.denomDF;

        testResults["test-type"] = "owA";

        testResults["parameter"] = output.F;
        testResults["parameter-type"] = "F";
        testResults["error"] = output.error;
    
        console.log("Error for One-way anova: " + output.error);

        testResults["p"] = changePValueNotation(output.p);   
        testResults["method"] = "1-way ANOVA"; //todo
        testResults["effect-size"] = output.etaSquared;
        testResults["effect-size-type"] = "eS";
        testResults["formula"] = variableList["dependent"][0] + " ~ " + variableList["independent"][0] + "(" + variableList["independent-levels"] + ")";
    
        logResult();                           
    
        //drawing stuff
        removeElementsByClassName("completeLines");           

        displaySignificanceTestResults();      
        drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc");
        drawButtonInSideBar("TUKEY'S HSD", "tukeyHSD",1);        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//perform Welch's ANOVA(non-parametric alternative for one-way ANOVA)
function performWelchANOVA(dependentVariable, independentVariable)
{
    //get data from variable names
    dependentVariableData = variables[dependentVariable]["dataset"];
    independentVariableData = variables[independentVariable]["dataset"];

    // Get variable names and their data type
    var req = ocpu.rpc("performWelchANOVA", 
    {
        dependentVariable: dependentVariableData,
        independentVariable: independentVariableData                   
    }, function(output) 
    {                                                   
        testResults["df"] = output.numeratorDF + "," + output.denominatorDF;
    
        testResults["parameter"] = output.F;
        testResults["parameter-type"] = "F";
        testResults["test-type"] = "WA";
    
        testResults["p"] = changePValueNotation(output.p);
        testResults["method"] = "Welch's ANOVA"; 
        testResults["effect-size"] = output.etaSquared;
        testResults["effect-size-type"] = "eS";
        testResults["formula"] = dependentVariable + " ~ " + independentVariable;
        
        logResult();       
      
        //drawing stuff
        removeElementsByClassName("completeLines"); 
    
        displaySignificanceTestResults();
        drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc");          
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//perform Kruskal-Wallis test(non-parametric alternative for one-way ANOVA)
function performKruskalWallisTest(dependentVariable, independentVariable)
{
    //get data from variable names
    dependentVariableData = variables[dependentVariable]["dataset"];
    independentVariableData = variables[independentVariable]["dataset"];
    
    // Get variable names and their data type
    var req = ocpu.rpc("performKruskalWallisTest", 
    {
        dependentVariable: dependentVariableData,
        independentVariable: independentVariableData                   
    }, function(output) 
    {                                                                      
        testResults["df"] = output.DF; 

        testResults["parameter"] = output.ChiSquared;
        testResults["parameter-type"] = "cS";
        testResults["test-type"] = "kwT";

        testResults["p"] = changePValueNotation(output.p);                  
        testResults["method"] = "Kruskal-Wallis test"; 
        testResults["effect-size"] = output.etaSquared;         
        testResults["effect-size-type"] = "eS";
        testResults["formula"] = dependentVariable + " ~ " + independentVariable;

        logResult();
        //drawing stuff
        removeElementsByClassName("completeLines");   

        displaySignificanceTestResults();
        drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc");
        drawButtonInSideBar("TUKEY'S HSD", "tukeyHSD",1);        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//perform two-way ANOVA
function performTwoWayANOVA(dependentVariable, betweenGroupVariableA, betweenGroupVariableB)
{
    var variableList = getSelectedVariables();
    
    // Get variable names and their data type
    var req = ocpu.rpc("performTwoWayANOVA", 
    {   
        dataset: dataset, 
        dependentVariable: dependentVariable,
        participantVariable: participants,
        betweenGroupVariableA: betweenGroupVariableA,
        betweenGroupVariableB: betweenGroupVariableB
    }, function(output) 
    {                                                   
        testResults["df"] = [];
        testResults["p"] = output.p;   
  
        for(var i=0; i<(output.numDF).length; i++)
        {
          testResults["df"].push((output.numDF)[i] + ", " + (output.denomDF)[i]);
          testResults["p"][i] = changePValueNotation(testResults["p"][i]);
        }
  
        testResults["parameter"] = output.F;
        testResults["parameter-type"] = "F";                 
        
        testResults["error"] = output.error;
                 
        testResults["test-type"] = "twA";
    
        testResults["method"] = "2-way ANOVA"; //todo
        testResults["effect-size"] = output.etaSquared;
        testResults["effect-size-type"] = "eS";
        testResults["formula"] = dependentVariable + " ~ " + betweenGroupVariableA + " + " + betweenGroupVariableB + " +  " + betweenGroupVariableA + "*" + betweenGroupVariableB;
  
        logResult();
           
        drawButtonInSideBar("INTERACTION EFFECT", "interactionEffect");               
        removeElementsByClassName("completeLines");           
    
        displayANOVAResults();  
        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//perform one-way repeated-measures ANOVA
function performOneWayRepeatedMeasuresANOVA(dependentVariable, independentVariable)
{
    var variableList = getSelectedVariables();
    
    var req = ocpu.rpc("performOneWayRepeatedMeasuresANOVA", 
    {
        dependentVariable: dependentVariable,
        independentVariable: independentVariable,
        participantVariable: participants,
        dataset: dataset
    }, function(output) 
    {                                                   
        testResults["df"] = output.numDF + ", " + output.denomDF;

        testResults["parameter"] = output.F;
        testResults["parameter-type"] = "F";
    
        testResults["error"] = output.error;

        testResults["test-type"] = "owrA";

        testResults["method"] = "1-way repeated-measures ANOVA"; //todo
        testResults["effect-size"] = output.etaSquared;
        testResults["p"] = changePValueNotation(output.p);
        testResults["effect-size-type"] = "eS";
        testResults["formula"] = dependentVariable + " ~ " + independentVariable + " + Error(" + participants + "/" + independentVariable;
    
        logResult();
  
        //drawing stuff
        removeElementsByClassName("completeLines");

        displaySignificanceTestResults();               
        drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc");
        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//perform Friedman's test (non-parametric alternative for one-way repeated-measures ANOVA)
function performFriedmanTest(dependentVariable, independentVariable)
{
    var req = ocpu.rpc("performFriedmanTest", 
    {
        dependentVariable: dependentVariable,
        independentVariable: independentVariable,
        participantVariable: participants,
        filePath: pathToFile
    }, function(output) 
    {                                                   
        testResults["df"] = output.df;

        testResults["parameter"] = output.chiSquared;
        testResults["parameter-type"] = "cS";

        testResults["test-type"] = "fT";
        testResults["error"] = output.error;

        testResults["method"] = "Friedman's Analysis";
        testResults["p"] = changePValueNotation(output.p);
        testResults["effect-size"] = output.etaSquared;
        testResults["effect-size-type"] = "eS";       
        testResults["formula"] = dependentVariable + " ~ " + independentVariable + " + Error(" + participants + "/" + independentVariable;

        logResult();

        //drawing stuff
        removeElementsByClassName("completeLines");           

        displaySignificanceTestResults();   
        drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc");  
        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//perform mixed-design ANOVA
function performMixedDesignANOVA(dependentVariable, withinGroupVariable, betweenGroupVariable)
{  
    var req = ocpu.rpc("performMixedDesignANOVA", 
    {
        dependentVariable: dependentVariable,
        withinGroupVariable: withinGroupVariable,
        betweenGroupVariable: betweenGroupVariable,
        participantVariable: participants,
        dataset: dataset
    }, function(output) 
    {                                                   
        testResults["df"] = [];
        testResults["p"] = output.p;
        testResults["error"] = output.error;

        for(var i=0; i<(output.numDF).length; i++)
        {
        testResults["df"].push((output.numDF)[i] + ", " + (output.denomDF)[i]);
        testResults["p"][i] = changePValueNotation(testResults["p"][i]);
        }

        testResults["parameter"] = output.F;
        testResults["parameter-type"] = "F";

        testResults["test-type"] = "fA";

        testResults["method"] = "Mixed-design ANOVA"; //todo
        testResults["effect-size"] = output.etaSquared;

        testResults["effect-size-type"] = "eS";
        testResults["formula"] = dependentVariable + " ~ " + betweenGroupVariable + " + Error(" + participants + "/" + withinGroupVariable;

        logResult();

        drawButtonInSideBar("INTERACTION EFFECT", "interactionEffect");               

        //drawing stuff
        removeElementsByClassName("completeLines");
        displayANOVAResults();                 
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//find interaction effect (two-way ANOVA, mixed-design ANOVA)
function findInteractionEffect(dependentVariable, independentVariables)
{   
    independentVariables = independentVariables.sort();
    
    var req = ocpu.rpc("findInteractionEffect", 
    {
        dependentVariable: dependentVariable,
        independentVariables: independentVariables,                    
        dataset: dataset
    }, function(output) 
    {                                                   
        var variableList = getSelectedVariables();
    
        var levelsA = variables[variableList["independent"][0]]["dataset"].unique().slice().sort();
        var levelsB = variables[variableList["independent"][1]]["dataset"].unique().slice().sort();

        interactions = output.fit;
        resetSVGCanvas();
        drawFullScreenButton();

        drawInteractionEffectPlot();
        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

function performTukeyHSDTestOneIndependentVariable(dependentVariable, independentVariable)
{ 
    var req = ocpu.rpc("performTukeyHSDTestOneIndependentVariable", 
    {
        dependentVariable: dependentVariable,
        independentVariable: independentVariable,
        dataset: dataset
    }, function(output) 
    {                                                   
        localStorage.setItem((label + "tkMin"), Array.min(output.lower));
        localStorage.setItem((label + "tkMax"), Array.max(output.upper));
        
        //get levels of the independent variable
        var levels = variables[independentVariable]["dataset"].unique().slice();
        //sort it
        levels = levels.sort();
        var index = 0;
    
        for(i=0; i<levels.length; i++)
        {
            tukeyResults[levels[i]] = new Object();
            for(j=i+1; j<levels.length; j++)
            {
                if(tukeyResults[levels[j]] == undefined)
                    tukeyResults[levels[j]] = new Object();
                if(i != j)
                {
                    tukeyResults[levels[i]][levels[j]] = new Object();                                
                    tukeyResults[levels[j]][levels[i]] = new Object();
                
                    tukeyResults[levels[j]][levels[i]]["difference"] = output.difference[index];
                    tukeyResults[levels[j]][levels[i]]["lower"] = output.lower[index];
                    tukeyResults[levels[j]][levels[i]]["upper"] = output.upper[index];
                    tukeyResults[levels[j]][levels[i]]["p"] = output.adjustedP[index];
                
                    tukeyResults[levels[i]][levels[j]]["difference"] = output.difference[index];
                    tukeyResults[levels[i]][levels[j]]["lower"] = output.lower[index];
                    tukeyResults[levels[i]][levels[j]]["upper"] = output.upper[index];
                    tukeyResults[levels[i]][levels[j]]["p"] = output.adjustedP[index++];
                }
            }
        }
    
        resetSVGCanvas();
        drawFullScreenButton();

        drawTukeyHSDPlot();        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

// function performTukeyHSDTestTwoIndependentVariables(dependentVariable, independentVariableA, independentVariableB)
// { 
//     var req = ocpu.rpc("performTukeyHSDTestTwoIndependentVariables", {
//                     dependentVariable: dependentVariable,
//                     independentVariableA: independentVariableA,
//                     independentVariableB: independentVariableB,
//                     dataset: dataset
//                   }, function(output) {   
//                     console.log("TukeyHSD test for " + dependentVariable + " ~ " + independentVariableA + " + " + independentVariableB);
//                     
//                     console.log(output.difference);
//                     console.log(output.lower);
//                     console.log(output.upper);
//                     console.log(output.adjustedP);
//             
//                 //drawing stuff
//                 removeElementsByClassName("completeLines");   
//                 
//                 resetSVGCanvas();
// //                 drawTukeyHSDPlot();
//                 
// //                 displaySignificanceTestResults();
//         
//       }).fail(function(){
//           alert("Failure: " + req.responseText);
//     });
// 
//     //if R returns an error, alert the error message
//     req.fail(function(){
//       alert("Server error: " + req.responseText);
//     });
//     req.complete(function(){
//         
//     });
// }

//POST-HOC TESTS

//perform pairwise t-tests
function performPairwiseTTest(varianceEqual, paired) 
{    
    var variableList = getSelectedVariables();
    
    var req = ocpu.rpc("performPairwiseTTest", 
    {
        dependentVariable: variables[variableList["dependent"][0]]["dataset"],
        independentVariable: variables[variableList["independent"][0]]["dataset"],                    
        dataset: dataset,
        varianceEqual: varianceEqual,
        paired: paired,
        independentVariableName: variableList["independent"][0], 
        dependentVariableName: variableList["dependent"][0], 
        levelA: variableList["independent-levels"][0],
        levelB: variableList["independent-levels"][1]
    }, function(output) 
    {     
        testResults["parameter"] = output.t;
        testResults["parameter-type"] = "t";

        testResults["p"] = changePValueNotation(output.p); 
        testResults["method"] = "Pairwise t-test (Bonf.)";
        testResults["effect-size"] = output.d;
        testResults["effect-size-type"] = "d";
        testResults["test-type"] = "ptT";
    
        testResults["error"] = output.error;
    
        logResult();
        //drawing stuff
        removeElementsByClassName("completeLines");

        displaySignificanceTestResults();
        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//perform pairwise wilcox-tests (non-parametric alternative for pairwise t-tests)
function performPairwiseWilcoxTest(varianceEqual, paired) //groupA, groupB, paired = "FALSE", alternative = "two.sided", alpha = 0.95, var = "FALSE"
{
    var variableList = getSelectedVariables();
    
    var req = ocpu.rpc("performPairwiseWilcoxTest", 
    {
        dependentVariable: variables[variableList["dependent"][0]]["dataset"],
        independentVariable: variables[variableList["independent"][0]]["dataset"],                    
        dataset: dataset,
        varianceEqual: varianceEqual,
        paired: paired,
        independentVariableName: variableList["independent"][0], 
        dependentVariableName: variableList["dependent"][0], 
        levelA: variableList["independent-levels"][0],
        levelB: variableList["independent-levels"][1]
    }, function(output) 
    {         
        testResults["parameter"] = output.U;
        testResults["parameter-type"] = paired == "FALSE" ? "U" : "W";

        testResults["p"] = changePValueNotation(output.p);                  
        testResults["effect-size"] = output.r;
        testResults["method"] = "Pairwise Wilcoxon-test (Bonf.)";
        testResults["test-type"] = "pwT";
        testResults["effect-size-type"] = "r";                  

        testResults["error"] = output.error;
        
        logResult();
        //drawing stuff
        removeElementsByClassName("completeLines");           

        displaySignificanceTestResults(); 
        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}