//Significance Tests
//0 IV, 1 DV
function performOneSampleTTest(variable, level)
{
    expectedMean = sessionStorage.popMean;
    
    if(level == undefined)
        level = "dataset"
    if(expectedMean == undefined)
        expectedMean = "0";
    
    var req = opencpu.r_fun_json("performOneSampleTTest", {
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
    expectedMean = sessionStorage.popMedian;
    
    if(level == undefined)
        level = "dataset";
    if(expectedMean == undefined)
        expectedMean = "0";
    
    var req = opencpu.r_fun_json("performOneSampleWilcoxonTest", {
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

function performTTest(groupA, groupB, varianceEqual, paired) //groupA, groupB, paired = "FALSE", alternative = "two.sided", alpha = 0.95, var = "FALSE"
{
    // Get variable names and their data type
    console.log("varianceEqual=" + varianceEqual + ", paired=" + paired);
    console.log("A=" + groupA + ", B=" + groupB);
    var req = opencpu.r_fun_json("performTTest", {
                    groupA: groupA,
                    groupB: groupB,
                    variance: varianceEqual,
                    paired: paired
                  }, function(output) {                                                   
                  
                  var variableList = getSelectedVariables();
                  
                  console.log("\t\t " + output.method);
                  console.log("\t\t\t DOF = " + output.DOF);
                  console.log("\t\t\t p = " + output.p);
                  console.log("\t\t\t t = " + output.t);
                  console.log("\t\t\t d = " + output.d);
                  
                  testResults["df"] = output.DOF;
                  
                  testResults["parameter"] = output.t;
                  testResults["parameter-type"] = "t";
                  
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

function performMannWhitneyTest(groupA, groupB)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performMannWhitneyTest", {
                    groupA: groupA,
                    groupB: groupB
                  }, function(output) {                                                   
                  
                  var variableList = getSelectedVariables();
                  
                  console.log("\t\t Mann-Whitney U test");
                  console.log("\t\t\t U = " + output.U);
                  console.log("\t\t\t p = " + output.p);
                  console.log("\t\t\t r = " + output.r);
                  
                  testResults["parameter"] = output.U;
                  testResults["parameter-type"] = "U";
                  
                  testResults["p"] = changePValueNotation(output.p);                  
                  testResults["effect-size"] = output.r;
                  testResults["method"] = "Mann-Whitney U test";
                  testResults["effect-size-type"] = "r";
                  testResults["formula"] = variableList["independent-levels"][0] + "." + variableList["dependent"][0] + " vs " + variableList["independent-levels"][1] + "." + variableList["dependent"][0];
                  
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

function performWilcoxonTest(groupA, groupB)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performWilcoxonTest", {
                    groupA: groupA,
                    groupB: groupB
                  }, function(output) {                                                   
                  
                  var variableList = getSelectedVariables();
                  
                  console.log("\t\t Wilcoxon Signed-rank Test");
                  console.log("\t\t\t V = " + output.V);
                  console.log("\t\t\t p = " + output.p);
                  console.log("\t\t\t r = " + output.r);
                  
                  testResults["parameter"] = output.V;
                  testResults["parameter-type"] = "V";
                  
                  testResults["p"] = changePValueNotation(output.p);                  
                  testResults["effect-size"] = output.r;
                  testResults["method"] = "Wilcoxon Signed-rank test";
                  testResults["effect-size-type"] = "r";
                  testResults["formula"] = variableList["independent-levels"][0] + "." + variableList["dependent"][0] + " vs " + variableList["independent-levels"][1] + "." + variableList["dependent"][0];
                  
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

function performANOVA(dependentVariable, independentVariable)
{
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performANOVA", {
                    dataset: dataset,
                    dependentVariable: dependentVariable,
                    independentVariable: independentVariable                   
                  }, function(output) {                                                   
                  
                  var variableList = getSelectedVariables();
                  
                  console.log("\t\t One-way ANOVA for (" + dependentVariable + " ~ " + independentVariable + ")");
                  console.log("\t\t\t F = " + output.F);
                  console.log("\t\t\t p = " + output.p);
                  console.log("\t\t\t method used = One-way ANOVA"); //todo
                  console.log("\t\t\t DF = " + output.DOF);
                  console.log("\t\t\t Eta-squared: " + output.etaSquared);
                  
                  testResults["df"] = output.DOF;
                  
                  testResults["parameter"] = output.F;
                  testResults["parameter-type"] = "F";
                  
                  testResults["p"] = changePValueNotation(output.p);   
                  testResults["method"] = "ANOVA"; //todo
                  testResults["effect-size"] = output.etaSquared;
                  testResults["effect-size-type"] = "eS";
                  testResults["formula"] = variableList["dependent"][0] + " ~ " + variableList["independent"][0] + "(" + variableList["independent-levels"] + ")";
                  
                  logResult();
                           
                  
                //drawing stuff
                removeElementsByClassName("completeLines");           

                displaySignificanceTestResults();      
                drawButtonInSideBar("POST-HOC TESTS", "tukey");
        
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

function performTwoWayANOVA(dependentVariable, independentVariableA, independentVariableB)
{
    // (dataset, dependentVariable, independentVariableA, independentVariableB)
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performTwoWayANOVA", {
                    dataset: dataset,
                    dependentVariable: dependentVariable,
                    independentVariableA: independentVariableA,
                    independentVariableB: independentVariableB
                  }, function(output) {                                                   
                  
                  var variableList = getSelectedVariables();
                  
                  console.log("\t\t Two-way ANOVA for (" + dependentVariable + " ~ " + independentVariableA + " + " + independentVariableB + " " + independentVariableA + "*" + independentVariableB +")");
                  console.log("\t\t\t F = " + output.F);
                  console.log("\t\t\t method used = Two-way ANOVA"); //todo
                  console.log("\t\t\t DF = " + output.numDF + "," + output.denomDF);
                  console.log("\t\t\t Eta-squared: " + output.etaSquared);
                  console.log("\t\t\t p-values: " + output.p);
                  
                  testResults["df"] = output.numDF + "," + output.denomDF;
                  
                  testResults["parameter"] = output.F;
                  testResults["parameter-type"] = "F";
                  
                  testResults["method"] = "Two-way ANOVA"; //todo
                  testResults["effect-size"] = output.etaSquared;
                  testResults["effect-size-type"] = "eS";
                  testResults["formula"] = dependentVariable + " ~ " + independentVariableA + " + " + independentVariableB + " " + independentVariableA + "*" + independentVariableB;
                  
                  logResult();
                           
                  findEffect(dependentVariable, [independentVariableA, independentVariableB]);
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

function performOneWayRepeatedMeasuresANOVA(dependentVariable, independentVariable)
{
    var req = opencpu.r_fun_json("performOneWayRepeatedMeasuresANOVA", {
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
                  
                  testResults["df"] = output.numDF + "," + output.denomDF;
                  
                  testResults["parameter"] = output.F;
                  testResults["parameter-type"] = "F";
                  
                  testResults["method"] = "Repeated Measures ANOVA"; //todo
                  testResults["effect-size"] = output.etaSquared;
                  testResults["p"] = changePValueNotation(output.p);
                  testResults["effect-size-type"] = "eS";
                  testResults["formula"] = dependentVariable + " ~ " + independentVariable + " + Error(" + participants + "/" + independentVariable;
                           
                  logResult();
                  
                //drawing stuff
                removeElementsByClassName("completeLines");
                
                displaySignificanceTestResults();               
                drawButtonInSideBar("POST-HOC TESTS", "tukey");
        
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

function performFactorialANOVA(dependentVariable, withinGroupVariable, betweenGroupVariable)
{
    console.log("\t\t Factorial ANOVA for (" + dependentVariable + " ~ " + betweenGroupVariable + " + Error(" + participants + "/" + withinGroupVariable + ")");
    
    var req = opencpu.r_fun_json("performFactorialANOVA", {
                    dependentVariable: dependentVariable,
                    withinGroupVariable: withinGroupVariable,
                    betweenGroupVariable: betweenGroupVariable,
                    participantVariable: participants,
                    dataset: dataset
                  }, function(output) {                                                   
                  
                  console.log("\t\t Factorial ANOVA for (" + dependentVariable + " ~ " + betweenGroupVariable + " + Error(" + participants + "/" + withinGroupVariable + ")");
                  console.log("\t\t\t F = " + output.F);
                  console.log("\t\t\t method used = Repeated-measures ANOVA"); //todo
                  console.log("\t\t\t DF = " + output.numDF + "," + output.denomDF);
                  console.log("\t\t\t p = " + output.p);
                  console.log("\t\t\t Eta-squared: " + output.etaSquared);
                  
                  testResults["df"] = output.numDF + "," + output.denomDF;
                  
                  testResults["parameter"] = output.F;
                  testResults["parameter-type"] = "F";
                  
                  testResults["method"] = "Factorial ANOVA"; //todo
                  testResults["effect-size"] = output.etaSquared;
                  testResults["p"] = changePValueNotation(output.p);
                  testResults["effect-size-type"] = "eS";
                  testResults["formula"] = dependentVariable + " ~ " + betweenGroupVariable + " + Error(" + participants + "/" + withinGroupVariable;
                           
                  logResult();
                  
                //drawing stuff
                removeElementsByClassName("completeLines");
                
                displaySignificanceTestResults();               
                drawButtonInSideBar("POST-HOC TESTS", "tukey");
        
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

function performFriedmanTest(dependentVariable, independentVariable)
{
    console.log(dependentVariable);
    console.log(independentVariable);
    console.log(participants);
    var req = opencpu.r_fun_json("performFriedmanTest", {
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
                  
                  testResults["method"] = output.method; 
                  testResults["p"] = changePValueNotation(output.p);
                  testResults["effect-size"] = output.etaSquared;
                  testResults["effect-size-type"] = "eS";       
                  testResults["formula"] = dependentVariable + " ~ " + independentVariable + " + Error(" + participants + "/" + independentVariable;
                  
                  logResult();
                  
                //drawing stuff
                removeElementsByClassName("completeLines");           

                displaySignificanceTestResults();   
                drawButtonInSideBar("POST-HOC TESTS", "tukey");
        
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

function findEffect(dependentVariable, independentVariables)
{
    var req = opencpu.r_fun_json("findEffect", {
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
                
                drawButtonInSideBar("INTERACTION EFFECT", "interactionEffect");
                drawButtonInSideBar("POST-HOC TESTS", "tukey", 1);
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
    //get data from variable names
    dependentVariableData = variables[dependentVariable]["dataset"];
    independentVariableData = variables[independentVariable]["dataset"];
    
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performWelchANOVA", {
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
                  
                  testResults["p"] = changePValueNotation(output.p);
                  testResults["method"] = "Welch's ANOVA"; 
                  testResults["effect-size"] = output.etaSquared;
                  testResults["effect-size-type"] = "eS";
                  testResults["formula"] = dependentVariable + " ~ " + independentVariable;
                         
                  logResult();       
                  
                //drawing stuff
                removeElementsByClassName("completeLines"); 
                
                displaySignificanceTestResults();
//                 drawButtonInSideBar("POST-HOC TESTS", "tukey");
        
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

function performKruskalWallisTest(dependentVariable, independentVariable)
{
    //get data from variable names
    dependentVariableData = variables[dependentVariable]["dataset"];
    independentVariableData = variables[independentVariable]["dataset"];
    
    // Get variable names and their data type
    var req = opencpu.r_fun_json("performKruskalWallisTest", {
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
                  
                  testResults["p"] = changePValueNotation(output.p);                  
                  testResults["method"] = "Kruskal-Wallis Test"; 
                  testResults["effect-size"] = output.etaSquared;         
                  testResults["effect-size-type"] = "eS";
                  testResults["formula"] = dependentVariable + " ~ " + independentVariable;
                  
                  logResult();
                //drawing stuff
                removeElementsByClassName("completeLines");   
                
                displaySignificanceTestResults();
                drawButtonInSideBar("POST-HOC TESTS", "tukey");
        
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

function performTukeyHSDTestOneIndependentVariable(dependentVariable, independentVariable)
{ 
    var req = opencpu.r_fun_json("performTukeyHSDTestOneIndependentVariable", {
                    dependentVariable: dependentVariable,
                    independentVariable: independentVariable,
                    dataset: dataset
                  }, function(output) {                                                   
                  

                    console.log("TukeyHSD test for " + dependentVariable + " ~ " + independentVariable);
                    sessionStorage.tukeyResultsMin = Array.min(output.lower);
                    sessionStorage.tukeyResultsMax = Array.max(output.upper);
                    
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
                    
                    console.dir(tukeyResults);
                    
                    resetSVGCanvas();
                    drawFullScreenButton();
        
                    drawTukeyHSDPlot();
                    
            
                //drawing stuff
                removeElementsByClassName("completeLines");   
                
                resetSVGCanvas();
                drawTukeyHSDPlot();
                
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

function performTukeyHSDTestTwoIndependentVariables(dependentVariable, independentVariableA, independentVariableB)
{ 
    var req = opencpu.r_fun_json("performTukeyHSDTestTwoIndependentVariables", {
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
                drawTukeyHSDPlot();
                
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


//POST-HOC TESTS
function performPairwiseTTest(varianceEqual, paired) //groupA, groupB, paired = "FALSE", alternative = "two.sided", alpha = 0.95, var = "FALSE"
{
    var variableList = getSelectedVariables();
    
    var req = opencpu.r_fun_json("performPairwiseTTest", {
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
                  testResults["method"] = "Pairwise t-test with Bonferroni correction";
                  testResults["effect-size"] = output.d;
                  testResults["effect-size-type"] = "d";
                  
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

function performPairwiseWilcoxTest(varianceEqual, paired) //groupA, groupB, paired = "FALSE", alternative = "two.sided", alpha = 0.95, var = "FALSE"
{
    var variableList = getSelectedVariables();
    
    var req = opencpu.r_fun_json("performPairwiseWilcoxTest", {
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
                  testResults["method"] = "Pairwise Wilcox-test";
                  testResults["effect-size-type"] = "r";                  
                  
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

// Effect sizes

// function getDFromT(n)
// {
//     // Get variable names and their data type
//     var req = opencpu.r_fun_json("getDFromT", {
//                     t: testResults["t"],                   
//                     n1: n,
//                     n2: n
//                   }, function(output) {                                                   
//                   
//                   console.log("Cohen's d: " + output.d);
//                   
//                   testResults["effect-size"] = "Cohen's d = " + output.d;
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