//get pearson's r or kendall's tau correlation coefficients
function getCorrelationCoefficient(variableA, variableB, method)
{   
    //sort the variables in ascending alphabetical order
    if(variableB < variableA)
    {
        var temp = variableA;
        variableA = variableB;
        variableB = temp;
    }    

    var formula = method + "(" + variableA + ":" + variableB + ")";
    
    if(localStorage.getObject(formula) == null)
    {
        var req = ocpu.rpc("getCorrelationCoefficient", 
        {
            distributionX: variables[variableA]["dataset"],                    
            distributionY: variables[variableB]["dataset"],
            method: method
        }, function(output) 
        {   
            localStorage.setObject(formula, output);

            if(method == "pearson")
            {
                // console.log("\t\t\t Pearson's Correlation-coefficient for (" + variableA + " , " + variableB + ")");

                multiVariateTestResults["df"] = output.df;
                multiVariateTestResults["statistic"] = "t(" + output.df + ") = " + output.statistic;
        
                multiVariateTestResults["parameter"] = output.statistic;
                multiVariateTestResults["parameter-type"] = "t";
        
                multiVariateTestResults["p"] = changePValueNotation(output.p);                  
                multiVariateTestResults["method"] = "Pearson's correlation \'r\'"; 
        
                multiVariateTestResults["test-type"] = "pC";
        
                multiVariateTestResults["effect-size"] = output.cor;
                multiVariateTestResults["CI"] = [output.CI_min, output.CI_max];
                multiVariateTestResults["effect-size-type"] = "r";
        
                multiVariateTestResults["formula"] = variableA + " : " + variableB;
            
                // logResult();
                setReportingText(multiVariateTestResults["formula"]);

                // drawButton("FIT MODEL FOR PREDICTION", "regression");
            }
            else if(method == "kendall")
            {
                // console.log("\t\t\t Kendall's Correlation-coefficient for (" + variableA + " , " + variableB + ")");
            
                multiVariateTestResults["statistic"] = "z = " + output.statistic;
        
                multiVariateTestResults["parameter"] = output.statistic;
                multiVariateTestResults["parameter-type"] = "z";
      
                multiVariateTestResults["p"] = changePValueNotation(output.p);
                multiVariateTestResults["method"] = "Kendall's correlation \'𝜏\'"
                multiVariateTestResults["effect-size"] = output.cor;
                multiVariateTestResults["effect-size-type"] = "𝜏";
        
                multiVariateTestResults["test-type"] = "kC";
        
                multiVariateTestResults["formula"] = variableA + " : " + variableB;
            
                // logResult();
                setReportingText(multiVariateTestResults["formula"]);
        
                // drawButton("FIT MODEL FOR PREDICTION", "regression");
            }

            displayCorrelationResults();
        });
        
        //if R returns an error, alert the error message
        req.fail(function()
        {
            alert("Server error: " + req.responseText);
        });
    }
    else
    {
        var output = localStorage.getObject(formula);

        if(method == "pearson")
        {
            // console.log("\t\t\t Pearson's Correlation-coefficient for (" + variableA + " , " + variableB + ")");

            multiVariateTestResults["df"] = output.df;
            multiVariateTestResults["statistic"] = "t(" + output.df + ") = " + output.statistic;
    
            multiVariateTestResults["parameter"] = output.statistic;
            multiVariateTestResults["parameter-type"] = "t";
    
            multiVariateTestResults["p"] = changePValueNotation(output.p);                  
            multiVariateTestResults["method"] = "Pearson's correlation \'r\'"; 
    
            multiVariateTestResults["test-type"] = "pC";
    
            multiVariateTestResults["effect-size"] = output.cor;
            multiVariateTestResults["CI"] = [output.CI_min, output.CI_max];
            multiVariateTestResults["effect-size-type"] = "r";
    
            multiVariateTestResults["formula"] = variableA + " : " + variableB;
        
            // logResult();
            setReportingText(multiVariateTestResults["formula"]);

            // drawButton("FIT MODEL FOR PREDICTION", "regression");
        }
        else if(method == "kendall")
        {
            // console.log("\t\t\t Kendall's Correlation-coefficient for (" + variableA + " , " + variableB + ")");
        
            multiVariateTestResults["statistic"] = "z = " + output.statistic;
    
            multiVariateTestResults["parameter"] = output.statistic;
            multiVariateTestResults["parameter-type"] = "z";
  
            multiVariateTestResults["p"] = changePValueNotation(output.p);
            multiVariateTestResults["method"] = "Kendall's correlation \'𝜏\'"
            multiVariateTestResults["effect-size"] = output.cor;
            multiVariateTestResults["effect-size-type"] = "𝜏";
    
            multiVariateTestResults["test-type"] = "kC";
    
            multiVariateTestResults["formula"] = variableA + " : " + variableB;
        
            // logResult();
            setReportingText(multiVariateTestResults["formula"]);
    
            // drawButton("FIT MODEL FOR PREDICTION", "regression");
        }

        displayCorrelationResults();
    }    
}

//get biserial correlation coefficient
function getBiserialCorrelationCoefficient(continuousVariable, binaryVariable)
{
    var formula = "biserial(" + continuousVariable + ":" + binaryVariable + ")";

    if(localStorage.getObject(formula) == null)
    {
        var req = ocpu.rpc("getBiserialCorrelationCoefficient", 
        {
            continuousVariable: variables[continuousVariable]["dataset"],
            binaryVariable: variables[binaryVariable]["dataset"]
        }, function(output) 
        {    
            localStorage.setObject(formula, output);                                               
            // console.log("\t\t Biserial Correlation-coefficient for (" + continuousVariable + " , " + binaryVariable + ")");                
        
            multiVariateTestResults["method"] = "Biserial correlation";
            multiVariateTestResults["effect-size"] = output.cor;  
            multiVariateTestResults["effect-size-type"] = "r";                
            multiVariateTestResults["test-type"] = "bC";                
            multiVariateTestResults["formula"] = continuousVariable + " : " + binaryVariable;
        
            // logResult();
            setReportingText(multiVariateTestResults["formula"]);
            displayBiserialCorrelationResults();                    
        });
        
        //if R returns an error, alert the error message
        req.fail(function()
        {
            alert("Server error: " + req.responseText);
        });
    }
    else
    {
        var output = localStorage.getObject(formula);

        multiVariateTestResults["method"] = "Biserial correlation";
        multiVariateTestResults["effect-size"] = output.cor;  
        multiVariateTestResults["effect-size-type"] = "r";                
        multiVariateTestResults["test-type"] = "bC";                
        multiVariateTestResults["formula"] = continuousVariable + " : " + binaryVariable;
    
        // logResult();
        setReportingText(multiVariateTestResults["formula"]);
        displayBiserialCorrelationResults(); 
    }
}

//get linear model coefficients (slope and intercept)
function getLinearModelCoefficients(outcome, explanatory)
{     
    var req = ocpu.rpc("getLinearModelCoefficients", 
    {
        outcome: variables[outcome]["dataset"],
        explanatory: variables[explanatory]["dataset"]
    }, function(output) 
    {                            
        multiVariateTestResults["test-type"] = "linR";
        
        if(isNaN(variables[explanatory]["dataset"][0]))
        {
            //we have a categorical variable
            var levels = variables[explanatory]["dataset"].unique().slice().sort();                    
            var nCoefficients = levels.length - 1;
            var coefficients = output.coefficients;                  
    
            multiVariateTestResults["effect-size"] = output.rSquared;
            multiVariateTestResults["method"] = "Linear Regression Model";
            multiVariateTestResults["equation"] = outcome + " = ";
            multiVariateTestResults["effect-size-type"] = "rS";
    
            multiVariateTestResults["formula"] = explanatory + " => " + outcome;
    
            // logResult();
    
            for(var i=0; i<nCoefficients; i++)
            {
                if(i == 0)                        
                    multiVariateTestResults["equation"] = multiVariateTestResults["equation"] + coefficients[i] + levels[i+1];
                else
                    multiVariateTestResults["equation"] = multiVariateTestResults["equation"] + (coefficients[i] < 0 ? coefficients[i] : "+" + coefficients[i]) + levels[i+1];
            }
            multiVariateTestResults["equation"] = multiVariateTestResults["equation"] + (output.intercept < 0 ? output.intercept : "+" + output.intercept);
    
            multiVariateTestResults["coefficients"] = new Object();
    
            for(var i=0; i<levels.length; i++)
            {
                multiVariateTestResults["coefficients"][levels[i]] = coefficients[i];
            }    
            multiVariateTestResults["intercept"] = output.intercept;    
            setReportingText(multiVariateTestResults["formula"]);
        }
        else
        {  
            var coefficients = output.coefficients;
  
            multiVariateTestResults["effect-size"] = output.rSquared;
            multiVariateTestResults["effect-size-type"] = "rS";
            multiVariateTestResults["method"] = "Linear Regression Model";
            multiVariateTestResults["equation"] = outcome + " = " + coefficients + explanatory + (output.intercept < 0 ? output.intercept : "+" + output.intercept);
            multiVariateTestResults["coefficients"] = coefficients;
            multiVariateTestResults["intercept"] = output.intercept;
            multiVariateTestResults["formula"] = explanatory + " => " + outcome;
        
            // logResult();
        
            removeElementsByClassName("significanceTest");
            drawRegressionLine(output.intercept, output.coefficients);                

            displaySimpleRegressionResults();  
            setReportingText(multiVariateTestResults["formula"]);                  
        }
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//get coefficients for multiple regression (individual slopes and intercepts)
function performMultipleRegression(outcomeVariable, explanatoryVariables)
{
    explanatoryVariables = explanatoryVariables.sort();
     
    var req = ocpu.rpc("performMultipleRegression", 
    {
        outcomeVariable: outcomeVariable,
        explanatoryVariables: explanatoryVariables,
        dataset: dataset                
    }, function(output) 
    {                                                   
        multiVariateTestResults["test-type"] = "mulR";
        // console.log("Performing Multiple Regression for " + outcomeVariable + " ~ [" + explanatoryVariables + "]");
      
        multiVariateTestResults["outcomeVariable"] = outcomeVariable;
        multiVariateTestResults["explanatoryVariables"] = explanatoryVariables;
    
        multiVariateTestResults["effect-size"] = output.rSquared;
        multiVariateTestResults["method"] = "Multiple Regression";
        multiVariateTestResults["equation"] = outcomeVariable + " = ";
        multiVariateTestResults["effect-size-type"] = "rS";
    
        multiVariateTestResults["formula"] = "[" + explanatoryVariables + "] => " + outcomeVariable;                    
        // logResult();
    
        var intercepts = [];
    
        for(var i=0; i<explanatoryVariables.length; i++)
        {
            if(i == 0)
                multiVariateTestResults["equation"] = multiVariateTestResults["equation"] + output.coefficients[i] + explanatoryVariables[i];
            else
                multiVariateTestResults["equation"] = multiVariateTestResults["equation"] + (output.coefficients[i] < 0 ? output.coefficients[i] : "+" + output.coefficients[i]) + explanatoryVariables[i];
            
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
        multiVariateTestResults["equation"] = multiVariateTestResults["equation"] + (output.intercept < 0 ? output.intercept : "+" + output.intercept);
    
        multiVariateTestResults["coefficients"] = output.coefficients;                
        multiVariateTestResults["intercept"] = output.intercept;
        multiVariateTestResults["intercepts"] = intercepts;
        
        makeScatterplotMatrixForMultipleRegression(outcomeVariable);
        displayMultipleRegressionResults();
        setReportingText(multiVariateTestResults["formula"]);
        
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}