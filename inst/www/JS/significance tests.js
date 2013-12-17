//Significance Tests
//0 IV, 1 DV
function performOneSampleTTest(variable, level)
{
    expectedMean = localStorage.popMean;
    
    if(level == undefined)
        level = "dataset"
    if(expectedMean == undefined)
        expectedMean = "0";
    
    var req = ocpu.rpc("performOneSampleTTest", {
                    distribution: variables[variable][level],
                    trueMean: expectedMean
                  }, function(output) {                                                   
                  
                  console.log("\t\t " + output.method);
                  console.log("\t\t\t DF = " + output.df);
                  console.log("\t\t\t p = " + output.p);
                  console.log("\t\t\t t = " + output.t);
                  console.log("\t\t\t mean = " + output.estimate);
                  console.log("\t\t\t d = " + output.d);
                  
                  testResults["type"] = "mean";
                  testResults["df"] = output.df;
                  
                  testResults["parameter"] = output.t;
                  testResults["parameter-type"] = "t";
                  
                  testResults["p"] = changePValueNotation(output.p); 
                  testResults["method"] = output.method;
                  testResults["estimate"] = output.estimate;
                  testResults["effect-size"] = output.d;
                  testResults["effect-size-type"] = "d";
                  
                //drawing stuff
                removeElementsByClassName("completeLines");
                
                displayOneSampleTestResults();
        
      }).fail(function(){
          alert("Failure: " + req.responseText);
    });

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
    req.complete(function(){
        
    });
}

function performOneSampleWilcoxonTest(variable, level)
{
    expectedMean = localStorage.popMedian;
    
    if(level == undefined)
        level = "dataset";
    if(expectedMean == undefined)
        expectedMean = "0";
    
    var req = ocpu.rpc("performOneSampleWilcoxonTest", {
                    distribution: variables[variable][level],
                    trueMean: expectedMean
                  }, function(output) {                                                   
                  
                  console.log("\t\t " + output.method);
                  console.log("\t\t\t p = " + output.p);
                  console.log("\t\t\t V = " + output.V);
                  console.log("\t\t\t median = " + output.estimate);
                  console.log("\t\t\t r = " + output.r);
                  
                  testResults["type"] = "median";
                  
                  testResults["parameter"] = output.V;
                  testResults["parameter-type"] = "V";
                  
                  testResults["p"] = changePValueNotation(output.p); 
                  testResults["method"] = output.method;
                  testResults["estimate"] = output.estimate;
                  testResults["effect-size"] = output.r;
                  testResults["effect-size-type"] = "r";
                  
                //drawing stuff
                removeElementsByClassName("completeLines");
                
                displayOneSampleTestResults();
        
      }).fail(function(){
          alert("Failure: " + req.responseText);
    });

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
    req.complete(function(){
        
    });
}  

function performTTest(groupA, groupB, varianceEqual, paired) 
{
    var variableList = getSelectedVariables();    
    variableList["independent-levels"] = variableList["independent-levels"].sort();
    
    var label = "t-test(" + variableList["dependent"][0] + "~" + variableList["independent-levels"][0] + "," + variableList["independent-levels"][1] + ")";
    
    if(localStorage.getObject(label) == null)
    {
        // Get variable names and their data type
        var req = ocpu.rpc("performTTest", {
                        groupA: groupA,
                        groupB: groupB,
                        variance: varianceEqual,
                        paired: paired
                      }, function(output) {
                      
                    console.log("t-test");
                      
                    testResults["df"] = output.DOF;
              
                    testResults["parameter"] = output.t;
                    testResults["parameter-type"] = "t";
              
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
                    
                    if(paired)
                    {
                        testResults["method"] = "Paired 2-sample t-test";
                    }
                    else
                    {
                        if(varianceEqual)
                            testResults["method"] = "Unpaired 2-sample t-test";
                        else
                            testResults["method"] = "Welch's t-test";
                    }
                    
                    testResults["effect-size"] = output.d;
                    testResults["effect-size-type"] = "d";
                    testResults["formula"] = variableList["independent-levels"][0] + "." + variableList["dependent"][0] + " vs " + variableList["independent-levels"][1] + "." + variableList["dependent"][0];
                
                    localStorage.setObject(label, testResults);
              
                    //add to log
                    logResult();
                  
                    //drawing stuff
                    removeElementsByClassName("completeLines");
                
                    displaySignificanceTestResults();
        
          }).fail(function(){
              alert("Failure: " + req.responseText);
        });

        //if R returns an error, alert the error message
        req.fail(function(){
          alert("Server error: " + req.responseText);
        });
        req.complete(function(){
        
        });
    }
    else
    {        
        testResults = localStorage.getObject(label);

        //add to log
        logResult();
        
        setTimeout(function()
        {
            //drawing stuff
            removeElementsByClassName("completeLines");

            displaySignificanceTestResults();            
        }, 1800);
    }
}

function performMannWhitneyTest(groupA, groupB)
{
    var variableList = getSelectedVariables();
    variableList["independent-levels"] = variableList["independent-levels"].sort();
    
    var label = "mann-whitney(" + variableList["dependent"][0] + "~" + variableList["independent-levels"][0] + "," + variableList["independent-levels"][1] + ")";
    // Get variable names and their data type
    
    if(localStorage.getObject(label) == null)
    {
        var req = ocpu.rpc("performMannWhitneyTest", {
                    groupA: groupA,
                    groupB: groupB
                  }, function(output) {                                                   
                  
                  console.log("\t\t Mann-Whitney U test");
                  
                  testResults["parameter"] = output.U;
                  testResults["parameter-type"] = "U";
                  
                  testResults["test-type"] = "mwT";
                  
                  testResults["p"] = changePValueNotation(output.p);                  
                  testResults["effect-size"] = output.r;
                  testResults["method"] = "Mann-Whitney U test";
                  testResults["effect-size-type"] = "r";
                  testResults["formula"] = variableList["independent-levels"][0] + "." + variableList["dependent"][0] + " vs " + variableList["independent-levels"][1] + "." + variableList["dependent"][0];
                  
                  localStorage.setObject(label, testResults);
                  logResult();
                  
                //drawing stuff
                removeElementsByClassName("completeLines");           

                displaySignificanceTestResults();              
        
          }).fail(function(){
              alert("Failure: " + req.responseText);
        });

        //if R returns an error, alert the error message
        req.fail(function(){
          alert("Server error: " + req.responseText);
        });
        req.complete(function(){
        
        });
    }
    else
    {
        testResults = localStorage.getObject(label);
        
        logResult();
        setTimeout(function()
        {
            //drawing stuff
            removeElementsByClassName("completeLines");           

            displaySignificanceTestResults(); 
        }, 1800);
    }
}

function performWilcoxonTest(groupA, groupB)
{
    var variableList = getSelectedVariables();
    variableList["independent-levels"] = variableList["independent-levels"].sort();
    
    var label = "wilcoxon(" + variableList["dependent"][0] + "~" + variableList["independent-levels"][0] + "," + variableList["independent-levels"][1] + ")";
    
    if(localStorage.getObject(label))
    {
        // Get variable names and their data type
        var req = ocpu.rpc("performWilcoxonTest", {
                        groupA: groupA,
                        groupB: groupB
                      }, function(output) {    
                    console.log("\t\t Wilcoxon Signed-rank Test");
                    
                    testResults["parameter"] = output.V;
                    testResults["parameter-type"] = "V";
                
                    testResults["test-type"] = "wT";
                
                    testResults["p"] = changePValueNotation(output.p);                  
                    testResults["effect-size"] = output.r;
                    testResults["method"] = "Wilcoxon Signed-rank test";
                    testResults["effect-size-type"] = "r";
                    testResults["formula"] = variableList["independent-levels"][0] + "." + variableList["dependent"][0] + " vs " + variableList["independent-levels"][1] + "." + variableList["dependent"][0];
                    
                    localStorage.setObject(value, testResults);
                      
                    logResult();                  
                  
                    //drawing stuff
                    removeElementsByClassName("completeLines");           

                    displaySignificanceTestResults();             
        
          }).fail(function(){
              alert("Failure: " + req.responseText);
        });

        //if R returns an error, alert the error message
        req.fail(function(){
          alert("Server error: " + req.responseText);
        });
        req.complete(function(){
        
        });
    }
    else
    {
        testResults = localStorage.getObject(label);
        
        logResult();                  
        
        setTimeout(function()
        {
            //drawing stuff
            removeElementsByClassName("completeLines");           

            displaySignificanceTestResults();
        }, 1800);
    }
}

function performOneWayANOVA(dependentVariable, independentVariable)
{
    var variableList = getSelectedVariables();  
    
    var label = "onewayANOVA(" + dependentVariable + "~" + independentVariable + ")";
    
    if(localStorage.getObject(label) == null)
    {
        // Get variable names and their data type
        var req = ocpu.rpc("performOneWayANOVA", {                    
                        dependentVariable: dependentVariable,
                        independentVariable: independentVariable,
                        participantVariable: participants,
                        dataset: dataset,
                      }, function(output) {                                                   
                  
                    console.log("\t\t One-way ANOVA for (" + dependentVariable + " ~ " + independentVariable + ")");
                   
                    testResults["df"] = output.numDF + ", " + output.denomDF;
                
                    testResults["test-type"] = "owA";
                
                    testResults["parameter"] = output.F;
                    testResults["parameter-type"] = "F";
                
                    testResults["p"] = changePValueNotation(output.p);   
                    testResults["method"] = "1-way ANOVA"; //todo
                    testResults["effect-size"] = output.etaSquared;
                    testResults["effect-size-type"] = "eS";
                    testResults["formula"] = variableList["dependent"][0] + " ~ " + variableList["independent"][0] + "(" + variableList["independent-levels"] + ")";
                    
                    localStorage.setObject(label, testResults);
                
                    logResult();                           
                    
                    //drawing stuff
                    removeElementsByClassName("completeLines");           

                    displaySignificanceTestResults();      
                    drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc");
                    drawButtonInSideBar("TUKEY'S HSD", "tukeyHSD",1);
        
          }).fail(function(){
              alert("Failure: " + req.responseText);
        });

        //if R returns an error, alert the error message
        req.fail(function(){
          alert("Server error: " + req.responseText);
        });
        req.complete(function(){
        
        });
    }
    else
    {
        testResults = localStorage.getObject(label);        
        logResult();                           
         
        setTimeout(function()
        {
            //drawing stuff
            removeElementsByClassName("completeLines");           

            displaySignificanceTestResults();      
            drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc");
            drawButtonInSideBar("TUKEY'S HSD", "tukeyHSD",1);
        }, 1800);        
    }
}

function performTwoWayANOVA(dependentVariable, betweenGroupVariableA, betweenGroupVariableB)
{
    var variableList = getSelectedVariables();
    if(betweenGroupVariableB < betweenGroupVariableA)
    {
        var temp = betweenGroupVariableB;
        betweenGroupVariableB = betweenGroupVariableA;
        betweenGroupVariableA = temp;
    }
    
    var label = "twowayANOVA(" + dependentVariable + "~" + betweenGroupVariableA + "+" + betweenGroupVariableB + ")";
    
    if(localStorage.getObject(label) == null)
    {
        // (dataset, dependentVariable, independentVariableA, independentVariableB)
        // Get variable names and their data type
        var req = ocpu.rpc("performTwoWayANOVA", {   
                        dataset: dataset, 
                        dependentVariable: dependentVariable,
                        participantVariable: participants,
                        betweenGroupVariableA: betweenGroupVariableA,
                        betweenGroupVariableB: betweenGroupVariableB
                      }, function(output) {                                                   
                  
                    console.log("\t\t Two-way ANOVA for (" + dependentVariable + " ~ " + betweenGroupVariableA + " + " + betweenGroupVariableB + " +  " + betweenGroupVariableA + "*" + betweenGroupVariableB +")");
                    
                    testResults["df"] = [];
                    testResults["p"] = output.p;   
              
                    for(var i=0; i<(output.numDF).length; i++)
                    {
                      testResults["df"].push((output.numDF)[i] + ", " + (output.denomDF)[i]);
                      testResults["p"][i] = changePValueNotation(testResults["p"][i]);
                    }
              
                    testResults["parameter"] = output.F;
                    testResults["parameter-type"] = "F";                 
                             
                    testResults["test-type"] = "twA";
                
                    testResults["method"] = "2-way ANOVA"; //todo
                    testResults["effect-size"] = output.etaSquared;
                    testResults["effect-size-type"] = "eS";
                    testResults["formula"] = dependentVariable + " ~ " + betweenGroupVariableA + " + " + betweenGroupVariableB + " +  " + betweenGroupVariableA + "*" + betweenGroupVariableB;
              
                    localStorage.setObject(label, testResults);
                    logResult();
                       
                    drawButtonInSideBar("INTERACTION EFFECT", "interactionEffect");               
                    removeElementsByClassName("completeLines");           
                
                    displayANOVAResults();  
        
          }).fail(function(){
              alert("Failure: " + req.responseText);
        });

        //if R returns an error, alert the error message
        req.fail(function(){
          alert("Server error: " + req.responseText);
        });
        req.complete(function(){
        
        });
    }
    else
    {
        testResults = localStorage.getObject(label);
        
        logResult();
        
        setTimeout(function()
        {
            drawButtonInSideBar("INTERACTION EFFECT", "interactionEffect");               
            
            removeElementsByClassName("completeLines");    
            displayANOVAResults();
        }, 1800);
    }
}

function performOneWayRepeatedMeasuresANOVA(dependentVariable, independentVariable)
{
    var variableList = getSelectedVariables();
    var label = "repeatedANOVA(" + dependentVariable + "~" + independentVariable + ")";
    
    if(localStorage.getObject(label) == null)
    {
        var req = ocpu.rpc("performOneWayRepeatedMeasuresANOVA", {
                        dependentVariable: dependentVariable,
                        independentVariable: independentVariable,
                        participantVariable: participants,
                        dataset: dataset
                      }, function(output) {                                                   
                  
                    console.log("\t\t Repeated-measures ANOVA for (" + dependentVariable + " ~ " + independentVariable + " + Error(" + participants + "/" + independentVariable + ")");
                  
                    testResults["df"] = output.numDF + ", " + output.denomDF;
                
                    testResults["parameter"] = output.F;
                    testResults["parameter-type"] = "F";
                
                    testResults["test-type"] = "owrA";
                
                    testResults["method"] = "1-way repeated-measures ANOVA"; //todo
                    testResults["effect-size"] = output.etaSquared;
                    testResults["p"] = changePValueNotation(output.p);
                    testResults["effect-size-type"] = "eS";
                    testResults["formula"] = dependentVariable + " ~ " + independentVariable + " + Error(" + participants + "/" + independentVariable;
                         
                    localStorage.setObject(label, testResults);
                    
                    logResult();
                  
                    //drawing stuff
                    removeElementsByClassName("completeLines");
                
                    displaySignificanceTestResults();               
                    drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc");
        
          }).fail(function(){
              alert("Failure: " + req.responseText);
        });

        //if R returns an error, alert the error message
        req.fail(function(){
          alert("Server error: " + req.responseText);
        });
        req.complete(function(){
        
        });
    }
    else
    {
        testResults = localStorage.getObject(label);
        
        logResult();
        
        setTimeout(function()
        {
            //drawing stuff
            removeElementsByClassName("completeLines");
    
            displaySignificanceTestResults();               
            drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc");
        }, 1800);
    }
}

function performFactorialANOVA(dependentVariable, withinGroupVariable, betweenGroupVariable)
{
    console.log("\t\t Factorial ANOVA for (" + dependentVariable + " ~ " + betweenGroupVariable + " + Error(" + participants + "/" + withinGroupVariable + ")");
     
    var label = "multiANOVA(" + dependentVariable + "~" + betweenGroupVariable + "~" + participants + "~" + withinGroupVariable + ")";
    
    if(localStorage.getObject(label) == null)
    {
    
        var req = ocpu.rpc("performFactorialANOVA", {
                        dependentVariable: dependentVariable,
                        withinGroupVariable: withinGroupVariable,
                        betweenGroupVariable: betweenGroupVariable,
                        participantVariable: participants,
                        dataset: dataset
                      }, function(output) {                                                   
                  
                      console.log("\t\t Mixed-design ANOVA for (" + dependentVariable + " ~ " + betweenGroupVariable + " + Error(" + participants + "/" + withinGroupVariable + ")");
                
                      testResults["df"] = [];
                      testResults["p"] = output.p;
                  
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
                           
                      localStorage.setObject(label, testResults);
                      
                      logResult();
                      
                      drawButtonInSideBar("INTERACTION EFFECT", "interactionEffect");               
                  
                    //drawing stuff
                    removeElementsByClassName("completeLines");
                
                    displayANOVAResults();                 
          }).fail(function(){
              alert("Failure: " + req.responseText);
        });

        //if R returns an error, alert the error message
        req.fail(function(){
          alert("Server error: " + req.responseText);
        });
        req.complete(function(){
        
        });
    }
    else
    {
        testResults = localStorage.getObject(label);
        logResult();
         
        setTimeout(function()
        { 
            //drawing stuff
            removeElementsByClassName("completeLines");
            
            drawButtonInSideBar("INTERACTION EFFECT", "interactionEffect");               
            displayANOVAResults();  
        }, 1800);
    }        
}

function performFriedmanTest(dependentVariable, independentVariable)
{
    var label = "friedman(" + dependentVariable + "~" + independentVariable + ")";
    
    if(localStorage.getObject(label) == null)
    {
        var req = ocpu.rpc("performFriedmanTest", {
                        dependentVariable: dependentVariable,
                        independentVariable: independentVariable,
                        participantVariable: participants,
                        filePath: pathToFile
                      }, function(output) {                                                   
                  
                    console.log("\t\t Friedman's Rank-sum Test for (" + dependentVariable + " ~ " + independentVariable + " + Error(" + participants + "/" + independentVariable + ")");
                    testResults["df"] = output.df;
                
                    testResults["parameter"] = output.chiSquared;
                    testResults["parameter-type"] = "cS";
                
                    testResults["test-type"] = "fT";
                
                    testResults["method"] = "Friedman's Analysis";
                    testResults["p"] = changePValueNotation(output.p);
                    testResults["effect-size"] = output.etaSquared;
                    testResults["effect-size-type"] = "eS";       
                    testResults["formula"] = dependentVariable + " ~ " + independentVariable + " + Error(" + participants + "/" + independentVariable;
                  
                    localStorage.setObject(label, testResults);
                    logResult();
                  
                    //drawing stuff
                    removeElementsByClassName("completeLines");           

                    displaySignificanceTestResults();   
                    drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc");  
        
          }).fail(function(){
              alert("Failure: " + req.responseText);
        });

        //if R returns an error, alert the error message
        req.fail(function(){
          alert("Server error: " + req.responseText);
        });
        req.complete(function(){
        
        });
    }
    else
    {
        testResults = localStorage.getObject(label);
        
        logResult();
        
        setTimeout(function()
        {
            //drawing stuff
            removeElementsByClassName("completeLines");           

            displaySignificanceTestResults();   
            drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc");  
        }, 1800);
    }
}

function findEffect(dependentVariable, independentVariables)
{   
    independentVariables = independentVariables.sort();
    var label = "interactionEffect(" + dependentVariable + "~" + independentVariables + ")";
    
    if(localStorage.getObject(label) == null)
    {
        var req = ocpu.rpc("findEffect", {
                        dependentVariable: dependentVariable,
                        independentVariables: independentVariables,                    
                        dataset: dataset
                      }, function(output) {                                                   
                    
                    var variableList = getSelectedVariables();
                
                    var levelsA = variables[variableList["independent"][0]]["dataset"].unique().slice().sort();
                    var levelsB = variables[variableList["independent"][1]]["dataset"].unique().slice().sort();

                    interactions = output.fit;
                    localStorage.setObject(label, interactions);
                    
                    resetSVGCanvas();
                    drawFullScreenButton();

                    drawInteractionEffectPlot();
                    
          }).fail(function(){
              alert("Failure: " + req.responseText);
        });

        //if R returns an error, alert the error message
        req.fail(function(){
          alert("Server error: " + req.responseText);
        });
        req.complete(function(){
        
        });
    }
    else
    {
        interactions = localStorage.getObject(label);

        resetSVGCanvas();
        drawFullScreenButton();

        drawInteractionEffectPlot();
    }    
}

function performWelchANOVA(dependentVariable, independentVariable)
{
    var label = "welchANOVA(" + dependentVariable + "~" + independentVariable + ")";
    
    if(localStorage.getObject(label) == null)
    {
        //get data from variable names
        dependentVariableData = variables[dependentVariable]["dataset"];
        independentVariableData = variables[independentVariable]["dataset"];
    
        // Get variable names and their data type
        var req = ocpu.rpc("performWelchANOVA", {
                        dependentVariable: dependentVariableData,
                        independentVariable: independentVariableData                   
                      }, function(output) {                                                   
                  
                    console.log("\t\t Welch's ANOVA for (" + dependentVariable + " ~ " + independentVariable + ")");
                    
                    testResults["df"] = output.numeratorDF + "," + output.denominatorDF;
                
                    testResults["parameter"] = output.F;
                    testResults["parameter-type"] = "F";
                    testResults["test-type"] = "WA";
                
                    testResults["p"] = changePValueNotation(output.p);
                    testResults["method"] = "Welch's ANOVA"; 
                    testResults["effect-size"] = output.etaSquared;
                    testResults["effect-size-type"] = "eS";
                    testResults["formula"] = dependentVariable + " ~ " + independentVariable;
                    
                    localStorage.setObject(label, testResults);
                    
                    logResult();       
                  
                    //drawing stuff
                    removeElementsByClassName("completeLines"); 
                
                    displaySignificanceTestResults();
                    drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc");  
        
          }).fail(function(){
              alert("Failure: " + req.responseText);
        });

        //if R returns an error, alert the error message
        req.fail(function(){
          alert("Server error: " + req.responseText);
        });
        req.complete(function(){
        
        });
    }
    else
    {
        testResults = localStorage.getObject(label);
        logResult();       
        
        setTimeout(function()
        {
            //drawing stuff
            removeElementsByClassName("completeLines"); 
    
            displaySignificanceTestResults();
            drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc");     
        }, 1800);
    }
}

function performKruskalWallisTest(dependentVariable, independentVariable)
{
    var label = "kruskal(" + dependentVariable + "~" + independentVariable + ")";
    //get data from variable names
    dependentVariableData = variables[dependentVariable]["dataset"];
    independentVariableData = variables[independentVariable]["dataset"];
    
    if(localStorage.getObject(label) == null)
    {
        // Get variable names and their data type
        var req = ocpu.rpc("performKruskalWallisTest", {
                        dependentVariable: dependentVariableData,
                        independentVariable: independentVariableData                   
                      }, function(output) {                                                   
                  
                    console.log("\t\t Kruskal-Wallis test for (" + dependentVariable + " ~ " + independentVariable + ")");
                    
                    testResults["df"] = output.DF;
                
                    testResults["parameter"] = output.ChiSquared;
                    testResults["parameter-type"] = "cS";
                
                    testResults["test-type"] = "kwT";
                
                    testResults["p"] = changePValueNotation(output.p);                  
                    testResults["method"] = "Kruskal-Wallis test"; 
                    testResults["effect-size"] = output.etaSquared;         
                    testResults["effect-size-type"] = "eS";
                    testResults["formula"] = dependentVariable + " ~ " + independentVariable;
                    
                    localStorage.setObject(label, testResults);
                
                    logResult();
                    //drawing stuff
                    removeElementsByClassName("completeLines");   
                
                    displaySignificanceTestResults();
                    drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc");
                    drawButtonInSideBar("TUKEY'S HSD", "tukeyHSD",1);
        
          }).fail(function(){
              alert("Failure: " + req.responseText);
        });

        //if R returns an error, alert the error message
        req.fail(function(){
          alert("Server error: " + req.responseText);
        });
        req.complete(function(){
        
        });
    }
    else
    {
        testResults = localStorage.getObject(label);
        
        logResult();
        
        setTimeout(function()
        {
            //drawing stuff
            removeElementsByClassName("completeLines");   
    
            displaySignificanceTestResults();
            drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc");
            drawButtonInSideBar("TUKEY'S HSD", "tukeyHSD",1);        
        }, 1800);
    }
}

function performTukeyHSDTestOneIndependentVariable(dependentVariable, independentVariable)
{ 
    var label = "tukeyHSD(" + dependentVariable + "~" + independentVariable + ")";
    
    if(localStorage.getObject(label) == null)
    {
        var req = ocpu.rpc("performTukeyHSDTestOneIndependentVariable", {
                        dependentVariable: dependentVariable,
                        independentVariable: independentVariable,
                        dataset: dataset
                      }, function(output) {                                                   
                  

                        console.log("TukeyHSD test for " + dependentVariable + " ~ " + independentVariable);
                        
                        localStorage.tukeyResultsMin = Array.min(output.lower);
                        localStorage.tukeyResultsMax = Array.max(output.upper);
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
                        
                        localStorage.setObject(label, tukeyResults);
                    
                        resetSVGCanvas();
                        drawFullScreenButton();
        
                        drawTukeyHSDPlot();        
          }).fail(function(){
              alert("Failure: " + req.responseText);
        });

        //if R returns an error, alert the error message
        req.fail(function(){
          alert("Server error: " + req.responseText);
        });
        req.complete(function(){
        
        });
    }
    else
    {
        tukeyResults = localStorage.getObject(label);
        
        resetSVGCanvas();
        drawFullScreenButton();

        drawTukeyHSDPlot();  
    }
}

function performTukeyHSDTestTwoIndependentVariables(dependentVariable, independentVariableA, independentVariableB)
{ 
    var req = ocpu.rpc("performTukeyHSDTestTwoIndependentVariables", {
                    dependentVariable: dependentVariable,
                    independentVariableA: independentVariableA,
                    independentVariableB: independentVariableB,
                    dataset: dataset
                  }, function(output) {   
                    console.log("TukeyHSD test for " + dependentVariable + " ~ " + independentVariableA + " + " + independentVariableB);
                    
                    console.log(output.difference);
                    console.log(output.lower);
                    console.log(output.upper);
                    console.log(output.adjustedP);
            
                //drawing stuff
                removeElementsByClassName("completeLines");   
                
                resetSVGCanvas();
//                 drawTukeyHSDPlot();
                
//                 displaySignificanceTestResults();
        
      }).fail(function(){
          alert("Failure: " + req.responseText);
    });

    //if R returns an error, alert the error message
    req.fail(function(){
      alert("Server error: " + req.responseText);
    });
    req.complete(function(){
        
    });
}

//POST-HOC TESTS
function performPairwiseTTest(varianceEqual, paired) 
{    
    var variableList = getSelectedVariables();
    
    variableList["independent-levels"] = variableList["independent-levels"].sort();
    var label = "pairwiseT(" + variableList["dependent"][0] + "~" + variableList["independent-levels"][0] + "~" + variableList["independent-levels"][1] + "~" + varianceEqual + "~" + paired + ")";
    
    if(localStorage.getObject(label) == null)
    {    
        var req = ocpu.rpc("performPairwiseTTest", {
                        dependentVariable: variables[variableList["dependent"][0]]["dataset"],
                        independentVariable: variables[variableList["independent"][0]]["dataset"],                    
                        dataset: dataset,
                        varianceEqual: varianceEqual,
                        paired: paired,
                        independentVariableName: variableList["independent"][0], 
                        dependentVariableName: variableList["dependent"][0], 
                        levelA: variableList["independent-levels"][0],
                        levelB: variableList["independent-levels"][1]
                      }, function(output) {     
                    
                    console.log("pairwise t-test");
                        
                    testResults["parameter"] = output.t;
                    testResults["parameter-type"] = "t";
                
                    testResults["p"] = changePValueNotation(output.p); 
                    testResults["method"] = "Pairwise t-test (Bonf.)";
                    testResults["effect-size"] = output.d;
                    testResults["effect-size-type"] = "d";
                    testResults["test-type"] = "ptT";
                    
                    localStorage.setObject(label, testResults);
                
                    logResult();
                    //drawing stuff
                    removeElementsByClassName("completeLines");
                
                    displaySignificanceTestResults();
        
          }).fail(function(){
              alert("Failure: " + req.responseText);
        });

        //if R returns an error, alert the error message
        req.fail(function(){
          alert("Server error: " + req.responseText);
        });
        req.complete(function(){
        
        });
    }
    else
    {
        testResults = localStorage.getObject(label);
        
        logResult();
        
        setTimeout(function()
        {
            //drawing stuff
            removeElementsByClassName("completeLines");
    
            displaySignificanceTestResults();       
        }, 1800);        
    }
}

function performPairwiseWilcoxTest(varianceEqual, paired) //groupA, groupB, paired = "FALSE", alternative = "two.sided", alpha = 0.95, var = "FALSE"
{
    var variableList = getSelectedVariables();
    variableList["independent-levels"] = variableList["independent-levels"].sort();
    var label = "pairwiseW(" + variableList["dependent"][0] + "~" + variableList["independent-levels"][0] + "~" + variableList["independent-levels"][1] + "~" + varianceEqual + "~" + paired + ")";
    
    if(localStorage.getObject(label) == null)
    {   
        var req = ocpu.rpc("performPairwiseWilcoxTest", {
                        dependentVariable: variables[variableList["dependent"][0]]["dataset"],
                        independentVariable: variables[variableList["independent"][0]]["dataset"],                    
                        dataset: dataset,
                        varianceEqual: varianceEqual,
                        paired: paired,
                        independentVariableName: variableList["independent"][0], 
                        dependentVariableName: variableList["dependent"][0], 
                        levelA: variableList["independent-levels"][0],
                        levelB: variableList["independent-levels"][1]
                      }, function(output) {         

                    console.log("\t\t Pairwise wilcox-test");
                    
                    testResults["parameter"] = output.U;
                    testResults["parameter-type"] = paired == "FALSE" ? "U" : "W";
                
                    testResults["p"] = changePValueNotation(output.p);                  
                    testResults["effect-size"] = output.r;
                    testResults["method"] = "Pairwise Wilcoxon-test (Bonf.)";
                    testResults["test-type"] = "pwT";
                    testResults["effect-size-type"] = "r";                  
                    
                    localStorage.setObject(label, testResults);
                
                    logResult();
                    //drawing stuff
                    removeElementsByClassName("completeLines");           

                    displaySignificanceTestResults(); 
        
          }).fail(function(){
              alert("Failure: " + req.responseText);
        });

        //if R returns an error, alert the error message
        req.fail(function(){
          alert("Server error: " + req.responseText);
        });
        req.complete(function(){
        
        });
    }
    else
    {
        testResults = localStorage.getObject(label);
        
        logResult();
        
        setTimeout(function()
        {
            //drawing stuff
            removeElementsByClassName("completeLines");
    
            displaySignificanceTestResults();        
        }, 1800);
    }
}