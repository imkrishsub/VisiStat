// Levene's test, p < 0.05 => not homogeneous

function performHomoscedasticityTest()
{   
    var variableList = selectedVisualisation == "DoSignificanceTest" ? sort(selectedVariables) : getSelectedVariables();

    var DV = variableList["dependent"][0];
    var IVs = variableList["independent"];    

    var req = ocpu.rpc("performHomoscedasticityTest", 
    {
        dataset: dataset,
        DV: DV,
        IVs: IVs          
    }, function(output) 
    { 
       sessionStorage.setObject("LeveneTestResultPValue", output.p); 

        callBackForPerformHomoscedasticityTest(output);           
    });

    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });   
}

// Shapiro-Wilk's normality test (we combine all distributions here for efficiency)

function performNormalityTestForMultipleDistributions(distributions, n)
{
    var variableList = selectedVisualisation == "DoSignificanceTest" ? sort(selectedVariables) : getSelectedVariables();

    var DV = variableList["dependent"][0];
    var levels = variableList["independent-levels"];

    if(selectedVisualisation == "DoSignificanceTest")
    {
        levels = [];

        var levelsA = variables[variableList["independent"][0]]["dataset"].unique();
        var levelsB = variables[variableList["independent"][1]]["dataset"].unique();
        var levelsC = variables[variableList["independent"][2]]["dataset"].unique();

        for(var i=0; i<levelsA.length; i++)
        {
            for(var j=0; j<levelsB.length; j++)
            {
                for(var k=0; k<levelsC.length; k++)
                {
                    levels.push(levelsA[i] + "-" + levelsB[j] + "-" + levelsC[k]);
                }
            }
        }     
    }
    
    var req = ocpu.rpc("performShapiroWilkTestForMultipleDistributions", 
    {
        distributions: distributions,
        n: n
    }, function(output) 
    {                                                                     
        var pValues = output.p;
        sessionStorage.setObject("ShapiroWilkTestPValues", pValues);

        for(var i=0; i<pValues.length; i++)
        {    
            if(pValues[i] < 0.05)
            {   
                // Non-normal distribution
                
                setDistribution(DV, levels[i], false);                    
            }
            else
            {   
                // Normal distribution                    
                
                setDistribution(DV, levels[i], true);                    
            }
        }
    });        

    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });    
}    

/**
 * Checks if a transformation is possible (log, sqrt, cube, or reciprocal)
 * @param  {string} dependentVariable   
 * @param  {string} independentVariable 
 */
function findTransformForNormality()
{    
    var variableList = sort(selectedVariables);
    var DV = variableList["dependent"][0];
    var IVs = variableList["independent"];

    if(selectedVisualisation == "DoSignificanceTest")
    {
        callBackForFindTransformationForNormality({type: "none"});
        return;
    }

    myDistributions = getAllDistributions();

    // Get variable names and their data type        
    var req = ocpu.rpc("checkForDataTransformationsToSatisfyNormality", 
    {
        distributions: myDistributions
    }, function(output) 
    {   
        callBackForFindTransformationForNormality(output);
    })
      
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });

}
    
function callBackForFindTransformationForNormality(output)
{
    var variableList = sort(selectedVariables);
    var DV = variableList["dependent"][0];
    var IVs = variableList["independent"][0];

    if(output.type == "none")
    {
        timeOut = 1200;

        // - - - - - - - - - - - - - Transformation is not possible - - - - - - - - - - - - - 
        console.log("Normality: transformation is not possible");

        testSelectionLogicAfterNormalityTest();                
    }
    else
    {                
        // - - - - - - - - - - - - - Transformation is possible - - - - - - - - - - - - - 
        transformationType = output.type[0];      
        console.log("Normality: " + transformationType + " transformation is possible");

        var buttonText = getTransformationButtonText(transformationType);
        
        // Draw buttons
        drawButton(buttonText, "transformToNormal");
        drawButton("Don't transform", "dontTransformToNormal");
    } 
}

/**
 * Checks if a transformation is possible (log, sqrt, cube, or reciprocal)
 * @param  {[type]} dependentVariable   [description]
 * @param  {[type]} independentVariable [description]
 * @return {[type]}                     [description]
 */
function findTransformForHomogeneity()
{ 
    var variableList = sort(selectedVariables);
    var DV = variableList["dependent"][0];
    var IVs = variableList["independent"];

    if(selectedVisualisation == "DoSignificanceTest")
    {
        callBackForFindTransformationForHomoscedasticity({type: "none"});
        return;
    }
        // Get variable names and their data type
    var req = ocpu.rpc("checkForDataTransformationsToSatisfyHomoscedasticity", 
    {
        dataset: dataset,
        DV: DV,
        IVs: IVs
    }, function(output) 
    {   
        callBackForFindTransformationForHomoscedasticity(output);            
    });
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

function callBackForFindTransformationForHomoscedasticity(output)
{
    var variableList = sort(selectedVariables);
    var DV = variableList["dependent"][0];
    var IVs = variableList["independent"][0];

    if(output.type == "none")
    {
        console.log("Homogeneity: transformation is not possible");
        testSelectionLogicAfterHomogeneityTest();                      
    }                
    else
    {
        // - - - - - - - - - - - - - Transformation is possible - - - - - - - - - - - - - 
        transformationType = output.type[0];      
        console.log("Homogeneity:  " + transformationType + " transformation is possible");

        var buttonText = getTransformationButtonText(transformationType);
    
        // Draw button
        drawButton(buttonText, "transformToHomogeneity");
        drawButton("Leave data as is and violate the assumption", "dontTransformToHomogeneity");
    } 
}

function getTransformationButtonText(transformationType)
{
    var buttonText = "Transform data to satisfy the assumption using ";

    switch(transformationType)
    {
        case "log":
                    buttonText += "log(x+1)";
                    break;

        case "sqrt":
                    buttonText += "x^(1/2)";
                    break;

        case "cube":
                    buttonText += "x^(1/3)";
                    break;

        case "reciprocal":
                    buttonText += "1/x";
                    break;

        default:
                console.log("Error: unhandled switch-case");
                break;
    }

    return buttonText;
}

/**
 * Applies transformation to the dataset (in javascript)
 * @param  {string} transformationType {log, sqrt, cube, reciprocal}
 */
function applyTransformationToDataset(transformationType)
{
    sessionStorage.setObject("variables.backup", variables);
    sessionStorage.setObject("dataset.backup", dataset.clone());
    sessionStorage.setObject("MIN.backup", MIN);
    sessionStorage.setObject("MAX.backup", MAX);
    sessionStorage.setObject("IQR.backup", IQR);
    sessionStorage.setObject("CI.backup", CI);

    var variableList = sort(selectedVariables);
    var DV = variableList["dependent"][0];

    for(aLevel in variables[DV])
    {        
        for(var i=0; i<variables[DV][aLevel].length; i++)
        {
            // For each data point of each level...
            switch(transformationType)
            {
                case "log":
                                variables[DV][aLevel][i] = log10(variables[DV][aLevel][i] + 1);
                                break;

                case "sqrt":
                                variables[DV][aLevel][i] = Math.sqrt(variables[DV][aLevel][i]);
                                break;

                case "cube":
                                variables[DV][aLevel][i] = Math.cbrt(variables[DV][aLevel][i]);
                                break;

                case "reciprocal":
                                variables[DV][aLevel][i] = 1/(variables[DV][aLevel][i] + 1);
                                break;

                default:
                                console.log("Default: unhandled case");
                                break;
            }        
            if(aLevel == "dataset")
            {
                dataset[i][DV] = variables[DV][aLevel][i];
            }
        }

        MIN[DV][aLevel] = Array.min(variables[DV][aLevel]);
        MAX[DV][aLevel] = Array.max(variables[DV][aLevel]);
        IQR[DV][aLevel] = findIQR(variables[DV][aLevel]);
        CI[DV][aLevel] = findCI(variables[DV][aLevel]);    
    }

    global.CIForSDs = {};
    computeCIForSDs(true, transformationType);
}

function drawQQPlot(distribution, canvas)
{
    var variableList = getSelectedVariables();
    var formula = "drawQQPlot(" + mean(distribution) + ")";    

    if(sessionStorage.getObject(formula) == null)
    {
        // Get variable names and their data type
        var req = $(canvas).rplot("drawQQPlot",
        {
            distribution: distribution
        });
        
        //if R returns an error, alert the error message
        req.fail(function()
        {
            alert("Server error: " + req.responseText);
        }); 
    }
    else
    {
        
    } 
}

function drawResidualPlot(dependentVariable, independentVariables, canvas)
{    
    removeElementsByClassName("homogeneityPlot");
    removeElementsByClassName("densityCurve");

    var variableList = getSelectedVariables();
    var formula = "drawResidualPlot(" + dependentVariable + " ~ " + independentVariables +  ")";

    if(sessionStorage.getObject(formula) == null)
    {
        // Get variable names and their data type
        var req = $(canvas).rplot("drawResidualPlot", 
        {
            dataset: dataset,
            dependentVariable: dependentVariable,
            independentVariables: independentVariables      
        });
        
        //if R returns an error, alert the error message
        req.fail(function()
        {
            alert("Server error: " + req.responseText);
        }); 
    }
    else
    {
        
    } 
}