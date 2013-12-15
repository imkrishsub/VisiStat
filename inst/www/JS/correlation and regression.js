// Correlation & Regression
function getCorrelationCoefficient(variableA, variableB, method)
{
    var req = ocpu.rpc("getCorrelationCoefficient", {
                    distributionX: variables[variableA]["dataset"],                    
                    distributionY: variables[variableB]["dataset"],
                    method: method
                  }, function(output) {                                                   
                
                if(method == "pearson")
                {
                    console.log("\t\t\t Pearson's Correlation-coefficient for (" + variableA + " , " + variableB + ")");
                    console.log("\t\t\t\t t = " + output.statistic);
                    console.log("\t\t\t\t p = " + output.p);
                    console.log("\t\t\t\t method used = " + output.method);
                    console.log("\t\t\t\t DF = " + output.df);
                    console.log("\t\t\t\t r = " + output.cor);
                    console.log("\t\t\t\t CI = [" + output.CI_min + ", " + output.CI_max + "]");

                    testResults["df"] = output.df;
                    testResults["statistic"] = "t(" + output.df + ") = " + output.statistic;
                    
                    testResults["parameter"] = output.statistic;
                    testResults["parameter-type"] = "t";
                    
                    testResults["p"] = output.p;                  
                    testResults["method"] = output.method; 
                    
                    testResults["test-type"] = "pC";
                    
                    testResults["effect-size"] = output.cor;
                    testResults["CI"] = [output.CI_min, output.CI_max];
                    testResults["effect-size-type"] = "r";
                    
                    testResults["formula"] = variableA + " : " + variableB;
                    
                    logResult();
                    
//                     if(allVariablesAreNumeric())
                    console.log("yo");
                    drawButtonInSideBar("CONSTRUCT MODEL", "regression");
                }
                else if(method == "kendall")
                {
                    console.log("\t\t\t Kendall's Correlation-coefficient for (" + variableA + " , " + variableB + ")");
                    console.log("\t\t\t\t z = " + output.statistic);
                    console.log("\t\t\t\t p = " + output.p);
                    console.log("\t\t\t\t method used = " + output.method);
                    console.log("\t\t\t\t 𝜏 = " + output.cor);

                    testResults["statistic"] = "z = " + output.statistic;
                    
                    testResults["parameter"] = output.statistic;
                    testResults["parameter-type"] = "z";
                  
                    testResults["p"] = output.p;                  
                    testResults["method"] = output.method; 
                    testResults["effect-size"] = output.cor;
                    testResults["effect-size-type"] = "𝜏";
                    
                    testResults["test-type"] = "kC";
                    
                    testResults["formula"] = variableA + " : " + variableB;
                    
                    logResult();
                    
//                     if(allVariablesAreNumeric())
                    console.log("yo");
                    drawButtonInSideBar("CONSTRUCT MODEL", "regression");
                }
                
                displayCorrelationResults();
        
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

function getBiserialCorrelationCoefficient(continuousVariable, binaryVariable)
{
    var req = ocpu.rpc("getBiserialCorrelationCoefficient", {
                    continuousVariable: variables[continuousVariable]["dataset"],
                    binaryVariable: variables[binaryVariable]["dataset"]
                  }, function(output) {                                                   
              
                console.log("\t\t Biserial Correlation-coefficient for (" + continuousVariable + " , " + binaryVariable + ")");                
                console.log("\t\t\t method used = " + "Biserial Correlation-coefficient");
                console.log("\t\t\t r = " + output.cor);

                testResults["method"] = "Biserial Correlation-coefficient";
                testResults["effect-size"] = output.cor;  
                testResults["effect-size-type"] = "r";
                
                testResults["test-type"] = "bC";
                
                testResults["formula"] = continuousVariable + " : " + binaryVariable;
                    
                logResult();
                
                displayBiserialCorrelationResults();            
        
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

function getLinearModelCoefficients(outcome, explanatory)
{
    var req = ocpu.rpc("getLinearModelCoefficients", {
                    outcome: variables[outcome]["dataset"],
                    explanatory: variables[explanatory]["dataset"]
                  }, function(output) {          
                  
                if(isNaN(variables[explanatory]["dataset"][0]))
                {
                    //we have a categorical variable
                    var levels = variables[explanatory]["dataset"].unique().slice().sort();                    
                    var nCoefficients = levels.length - 1;
                    var coefficients = output.coefficients;
                  
                    
                    testResults["effect-size"] = output.rSquared;
                    testResults["method"] = "Linear Regression Model";
                    testResults["equation"] = outcome + " = ";
                    testResults["effect-size-type"] = "rS";
                    
                    testResults["formula"] = explanatory + " => " + outcome;
                    
                    logResult();
                    
                    for(var i=0; i<nCoefficients; i++)
                    {
                        if(i == 0)                        
                            testResults["equation"] = testResults["equation"] + coefficients[i] + levels[i+1];
                        else
                            testResults["equation"] = testResults["equation"] + (coefficients[i] < 0 ? coefficients[i] : "+" + coefficients[i]) + levels[i+1];
                    }
                    testResults["equation"] = testResults["equation"] + (output.intercept < 0 ? output.intercept : "+" + output.intercept);
                    
                    testResults["coefficients"] = new Object();
                    
                    for(var i=0; i<levels.length; i++)
                    {
                        testResults["coefficients"][levels[i]] = coefficients[i];
                    }
                    
                    testResults["intercept"] = output.intercept;
                
                    console.log("intercept=" + output.intercept + ", coefficients=" + output.coefficients);
                }
                else
                {  
                    var coefficients = output.coefficients;
                  
                    testResults["effect-size"] = output.rSquared;
                    testResults["effect-size-type"] = "rS";
                    testResults["method"] = "Linear Regression Model";
                    testResults["equation"] = outcome + " = " + coefficients + explanatory + (output.intercept < 0 ? output.intercept : "+" + output.intercept);
                    testResults["coefficients"] = coefficients;
                    testResults["intercept"] = output.intercept;
                    
                    testResults["formula"] = explanatory + " => " + outcome;
                    
                    logResult();
                
                    console.log("intercept=" + output.intercept + ", coefficients=" + output.coefficients);
                    removeElementsByClassName("significanceTest");
                    drawRegressionLine(output.intercept, output.coefficients);                
                
                    displaySimpleRegressionResults();                    
                }
                
                
        
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

function performMultipleRegression(outcomeVariable, explanatoryVariables)
{
    console.log("outcome=" + outcomeVariable + ", explanatory=[" + explanatoryVariables);
    
    var req = ocpu.rpc("performMultipleRegression", {
                    outcomeVariable: outcomeVariable,
                    explanatoryVariables: explanatoryVariables,
                    dataset: pathToFile                
                  }, function(output) {                                                   
                  
                console.log("Performing Multiple Regression for " + outcomeVariable + " ~ [" + explanatoryVariables + "]");
                console.log("Intercept = " + output.intercept + ", coefficients = " + output.coefficients);
                console.log("Length = " + output.len);
                
                
                testResults["outcomeVariable"] = outcomeVariable;
                testResults["explanatoryVariables"] = explanatoryVariables;
                
                testResults["effect-size"] = output.rSquared;
                testResults["method"] = "Multiple Regression";
                testResults["equation"] = outcomeVariable + " = ";
                testResults["effect-size-type"] = "rS";
                
                testResults["formula"] = "[" + explanatoryVariables + "] => " + outcomeVariable;                    
                logResult();
                
                var intercepts = [];
                
                for(var i=0; i<explanatoryVariables.length; i++)
                {
                    if(i == 0)
                        testResults["equation"] = testResults["equation"] + output.coefficients[i] + explanatoryVariables[i];
                    else
                        testResults["equation"] = testResults["equation"] + (output.coefficients[i] < 0 ? output.coefficients[i] : "+" + output.coefficients[i]) + explanatoryVariables[i];
                        
                    var sum=output.intercept;
                    for(var j=0; j<explanatoryVariables.length; j++)
                    {
                        if(i != j)
                        {
                            sum += mean(variables[explanatoryVariables[j]]["dataset"])*output.coefficients[j];
                        }
                    }
                    
                    intercepts.push(sum);
                }
                testResults["equation"] = testResults["equation"] + (output.intercept < 0 ? output.intercept : "+" + output.intercept);
                
                testResults["coefficients"] = output.coefficients;                
                testResults["intercept"] = output.intercept;
                testResults["intercepts"] = intercepts;
                
                makeScatterplotMatrixForMultipleRegression(outcomeVariable);
                displayMultipleRegressionResults();
        
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