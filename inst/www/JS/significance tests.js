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
    var label = "tT" + variableList["dependent"][0] + "~" + variableList["independent-levels"][0] + "," + variableList["independent-levels"][1];
    
    if(localStorage.getObject(label) == null)
    {
        // Get variable names and their data type
        var req = ocpu.rpc("performTTest", {
                        groupA: groupA,
                        groupB: groupB,
                        variance: varianceEqual,
                        paired: paired
                      }, function(output) {                                                   
                  
                    
                    
                    
                    
                        console.log("LABEL=" + label);
                                      
                        console.log("\t\t " + output.method);
                        console.log("\t\t\t DOF = " + output.DOF);
                        console.log("\t\t\t p = " + output.p);
                        console.log("\t\t\t t = " + output.t);
                        console.log("\t\t\t d = " + output.d);
                  
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
                        testResults["method"] = output.method;
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
        console.log("using cached value :)");
        
        testResults = localStorage.getObject(label);

        //add to log
        logResult();
        
        setTimeout(function()
        {
            //drawing stuff
            removeElementsByClassName("completeLines");

            displaySignificanceTestResults();            
        }, 1200);
    }
}

function performMannWhitneyTest(groupA, groupB)
{
    var variableList = getSelectedVariables();
    var label = "mwT" + variableList["dependent"][0] + "~" + variableList["independent-levels"][0] + "," + variableList["independent-levels"][1];
    // Get variable names and their data type
    
    if(localStorage.getObject(label) == null)
    {
        var req = ocpu.rpc("performMannWhitneyTest", {
                    groupA: groupA,
                    groupB: groupB
                  }, function(output) {                                                   
                  
                  
                  
                  console.log("\t\t Mann-Whitney U test");
                  console.log("\t\t\t U = " + output.U);
                  console.log("\t\t\t p = " + output.p);
                  console.log("\t\t\t r = " + output.r);
                  
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
        }, 1200);
    }
}

function performWilcoxonTest(groupA, groupB)
{
    var variableList = getSelectedVariables();
    var label = "wT" + variableList["dependent"][0] + "~" + variableList["independent-levels"][0] + "," + variableList["independent-levels"][1];
    
    if(localStorage.getObject(label))
    {
        // Get variable names and their data type
        var req = ocpu.rpc("performWilcoxonTest", {
                        groupA: groupA,
                        groupB: groupB
                      }, function(output) {    
                    console.log("\t\t Wilcoxon Signed-rank Test");
                    console.log("\t\t\t V = " + output.V);
                    console.log("\t\t\t p = " + output.p);
                    console.log("\t\t\t r = " + output.r);
                
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
        }, 1200);
    }
}

function performOneWayANOVA(dependentVariable, independentVariable)
{
    var variableList = getSelectedVariables();    
    var label = "owA" + dependentVariable + "~" + independentVariable;
    
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
                    console.log("\t\t\t F = " + output.F);
                    console.log("\t\t\t p = " + output.p);
                    console.log("\t\t\t method used = One-way ANOVA"); 
                    console.log("\t\t\t DF = " + output.numDF + ", " + output.denomDF);
                    console.log("\t\t\t Eta-squared: " + output.etaSquared);
                
                    testResults["df"] = output.numDF + ", " + output.denomDF;
                
                    testResults["test-type"] = "owA";
                
                    testResults["parameter"] = output.F;
                    testResults["parameter-type"] = "F";
                
                    testResults["p"] = changePValueNotation(output.p);   
                    testResults["method"] = "One-way ANOVA"; //todo
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
        }, 1200);        
    }
}

function performTwoWayANOVA(dependentVariable, betweenGroupVariableA, betweenGroupVariableB)
{
    var variableList = getSelectedVariables();
    var label = "twA" + dependentVariable + "~" + betweenGroupVariableA + "+" + betweenGroupVariableB;
    
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
                        console.log("\t\t\t F values= [" + output.F + "]");
                        console.log("\t\t\t method used = Two-way ANOVA"); //todo
                        console.log("\t\t\t DF values = [" + output.numDF + "] , [" + output.denomDF + "]");
                        console.log("\t\t\t Eta-squared values: [" + output.etaSquared + "]");
                        console.log("\t\t\t p-values: [" + output.p + "]");
                  
                        testResults["df"] = [];
                        testResults["p"] = output.p;   
                  
                        for(var i=0; i<(output.numDF).length; i++)
                        {
                          testResults["df"].push((output.numDF)[i] + ", " + (output.denomDF)[i]);
                          testResults["p"][i] = changePValueNotation(testResults["p"][i]);
                        }
                  
                        console.dir(testResults["df"]);
                  
                        testResults["parameter"] = output.F;
                        testResults["parameter-type"] = "F";                 
                                 
                        testResults["test-type"] = "twA";
                    
                        testResults["method"] = "Two-way ANOVA"; //todo
                        testResults["effect-size"] = output.etaSquared;
                        testResults["effect-size-type"] = "eS";
                        testResults["formula"] = dependentVariable + " ~ " + betweenGroupVariableA + " + " + betweenGroupVariableB + " +  " + betweenGroupVariableA + "*" + betweenGroupVariableB;
                  
                        localStorage.setObject(value, testResults);
                        logResult();
                           
    //                   findEffect(dependentVariable, [betweenGroupVariableA,betweenGroupVariableB]);
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
//             findEffect(dependentVariable, [betweenGroupVariableA,betweenGroupVariableB]);
            removeElementsByClassName("completeLines");           
    
//             drawButtonInSideBar("TUKEY'S HSD", "tukeyHSD");
            displayANOVAResults();
        }, 1200);
    }
}

function performOneWayRepeatedMeasuresANOVA(dependentVariable, independentVariable)
{
    var variableList = getSelectedVariables();
    var label = "owrA" + dependentVariable + "~" + independentVariable;
    
    if(localStorage.getObject(label) == null)
    {
        var req = ocpu.rpc("performOneWayRepeatedMeasuresANOVA", {
                        dependentVariable: dependentVariable,
                        independentVariable: independentVariable,
                        participantVariable: participants,
                        dataset: dataset
                      }, function(output) {                                                   
                  
                    console.log("\t\t Repeated-measures ANOVA for (" + dependentVariable + " ~ " + independentVariable + " + Error(" + participants + "/" + independentVariable + ")");
                    console.log("\t\t\t F = " + output.F);
                    console.log("\t\t\t method used = Repeated-measures ANOVA"); //todo
                    console.log("\t\t\t DF = " + output.numDF + "," + output.denomDF);
                    console.log("\t\t\t p = " + output.p);
                    console.log("\t\t\t Eta-squared: " + output.etaSquared);
                
                    testResults["df"] = output.numDF + ", " + output.denomDF;
                
                    testResults["parameter"] = output.F;
                    testResults["parameter-type"] = "F";
                
                    testResults["test-type"] = "owrA";
                
                    testResults["method"] = "Repeated Measures ANOVA"; //todo
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
        }, 1200);
    }
}

function performFactorialANOVA(dependentVariable, withinGroupVariable, betweenGroupVariable)
{
    console.log("\t\t Factorial ANOVA for (" + dependentVariable + " ~ " + betweenGroupVariable + " + Error(" + participants + "/" + withinGroupVariable + ")");
    
    var label = "fA" + dependentVariable + "~" + betweenGroupVariable + "~" + participants + "~" + withinGroupVariable;
    
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
                      console.log("\t\t\t F = " + output.F);
                      console.log("\t\t\t method used = Repeated-measures ANOVA"); //todo
                      console.log("\t\t\t DF = " + output.numDF + "," + output.denomDF);
                      console.log("\t\t\t p = " + output.p);
                      console.log("\t\t\t Eta-squared: " + output.etaSquared);
                  
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
    
            displayANOVAResults();  
        }, 1200);
    }        
}

function performFriedmanTest(dependentVariable, independentVariable)
{
    var label = "fT" + dependentVariable + "~" + independentVariable;
    
    if(localStoraget.getObject(label) == null)
    {
        var req = ocpu.rpc("performFriedmanTest", {
                        dependentVariable: dependentVariable,
                        independentVariable: independentVariable,
                        participantVariable: participants,
                        filePath: pathToFile
                      }, function(output) {                                                   
                  
                    console.log("\t\t Friedman's Rank-sum Test for (" + dependentVariable + " ~ " + independentVariable + " + Error(" + participants + "/" + independentVariable + ")");
                    console.log("\t\t\t ChiSquared = " + output.chiSquared);
                    console.log("\t\t\t method used = " + output.method); //todo
                    console.log("\t\t\t DF = " + output.df);
                    console.log("\t\t\t p = " + output.p);
                    console.log("\t\t\t eta-squared = " + output.etaSquared);
                
                    testResults["df"] = output.df;
                
                    testResults["parameter"] = output.chiSquared;
                    testResults["parameter-type"] = "cS";
                
                    testResults["test-type"] = "fT";
                
                    testResults["method"] = output.method; 
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
        }, 1200);
    }
}

function findEffect(dependentVariable, independentVariables)
{
    var req = ocpu.rpc("findEffect", {
                    dependentVariable: dependentVariable,
                    independentVariables: independentVariables,                    
                    dataset: dataset
                  }, function(output) {                                                   
                var variableList = getSelectedVariables();
                
                var levelsA = variables[variableList["independent"][0]]["dataset"].unique().slice().sort();
                var levelsB = variables[variableList["independent"][1]]["dataset"].unique().slice().sort();

                for(var i=0; i<levelsB.length; i++)
                {
                    for(var j=0; j<levelsA.length; j++)
                    {
                        console.log(levelsA[j] + ":" + levelsB[i] + " = " + output.fit[i*levelsA.length + j]);
                    }
                }
                interactions = output.fit;
                
//                 drawButtonInSideBar("INTERACTION EFFECT", "interactionEffect");
//                 drawButtonInSideBar("PAIRWISE POST-HOC COMPARISONS", "pairwisePostHoc", 1);
                //drawing stuff
//                 removeElementsByClassName("completeLines");           
// 
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

function performWelchANOVA(dependentVariable, independentVariable)
{
    var label = "WA" + dependentVariable + "~" + independentVariable;
    
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
                    console.log("\t\t\t F = " + output.F);
                    console.log("\t\t\t p = " + output.p);
                    console.log("\t\t\t method used = Welch's ANOVA");
                    console.log("\t\t\t DF = (" + output.numeratorDF + "," + output.denominatorDF +")");
                    console.log("\t\t\t Eta-squared: " + output.etaSquared);
                
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
        }, 1500);
    }
}

function performKruskalWallisTest(dependentVariable, independentVariable)
{
    var label = "kwT" + dependentVariable + "~" + independentVariable;
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
                    console.log("\t\t\t Chi-squared = " + output.ChiSquared);
                    console.log("\t\t\t p = " + output.p);
                    console.log("\t\t\t method used = Kruskal-Wallis Test ANOVA");
                    console.log("\t\t\t DF = " + output.DF);
                    console.log("\t\t\t Eta-squared: " + output.etaSquared);
                
                    testResults["df"] = output.DF;
                
                    testResults["parameter"] = output.ChiSquared;
                    testResults["parameter-type"] = "cS";
                
                    testResults["test-type"] = "kwT";
                
                    testResults["p"] = changePValueNotation(output.p);                  
                    testResults["method"] = "Kruskal-Wallis Test"; 
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
        }, 1200);
    }
}

function performTukeyHSDTestOneIndependentVariable(dependentVariable, independentVariable)
{ 
    var label = "tuk" + dependentVariable + "~" + independentVariable;
    
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
                    
                        console.log(output.difference);
                        console.log(output.lower);
                        console.log(output.upper);
                        console.log(output.adjustedP);
                    
                        //make a data structure to hold all this
                    
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
    var label = "pTT" + variableList["dependent"][0] + "~" + variableList["independent-levels"][0] + "~" + variableList["independent-levels"][1] + "~" + varianceEqual + "~" + paired;
    
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
  
                    console.log("\t\t " + output.method);
                    console.log("\t\t\t p = " + output.p);
                    console.log("\t\t\t t = " + output.t);
                    console.log("\t\t\t d = " + output.d);                  
                
                    testResults["parameter"] = output.t;
                    testResults["parameter-type"] = "t";
                
                    testResults["p"] = changePValueNotation(output.p); 
                    testResults["method"] = "Pairwise t-test";
                    testResults["effect-size"] = output.d;
                    testResults["effect-size-type"] = "d";
                    
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
        }, 1200);        
    }
}

function performPairwiseWilcoxTest(varianceEqual, paired) //groupA, groupB, paired = "FALSE", alternative = "two.sided", alpha = 0.95, var = "FALSE"
{
    var variableList = getSelectedVariables();
    var label = "pWT" + variableList["dependent"][0] + "~" + variableList["independent-levels"][0] + "~" + variableList["independent-levels"][1] + "~" + varianceEqual + "~" + paired;
    
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
                    console.log("\t\t\t U = " + output.U);
                    console.log("\t\t\t p = " + output.p);
                    console.log("\t\t\t r = " + output.r);
                
                    testResults["parameter"] = output.U;
                    testResults["parameter-type"] = paired == "FALSE" ? "U" : "W";
                
                    testResults["p"] = changePValueNotation(output.p);                  
                    testResults["effect-size"] = output.r;
                    testResults["method"] = "Pairwise Wilcoxon-test";
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
        }, 1200);
    }
}