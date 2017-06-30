///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//1 IV, 2 levels: unpaired t-test, Welch's t-test, paired t-test, Mann-Whitney U test, and Wilcoxon signed-rank test //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function performTTest(groupA, groupB, varianceEqual, paired) 
{
    var variableList = getSelectedVariables();    
    var formula = "t.test(" + mean(groupA) + ", " + mean(groupB) + ", var.equal=" + varianceEqual + ", paired = " + paired +  ")";
    
    if(sessionStorage.getObject(formula) == null)
    {
        var req = ocpu.rpc("performTTest", 
        {
            groupA: groupA,
            groupB: groupB,
            variance: varianceEqual,
            paired: paired
        }, function(output) 
        {
            sessionStorage.setObject(formula, output);

            multiVariateTestResults["df"] = output.DOF;

            multiVariateTestResults["parameter"] = output.t;
            multiVariateTestResults["parameter-type"] = "t";

            multiVariateTestResults["error"] = output.error;

            if(varianceEqual == "FALSE")
            {
                multiVariateTestResults["test-type"] = "WT";
            }
            else
            {
                if(paired == "TRUE")
                    multiVariateTestResults["test-type"] = "pairedTTest";
                else
                    multiVariateTestResults["test-type"] = "unpairedTTest";
            }


            multiVariateTestResults["rawP"] = output.p;
            multiVariateTestResults["p"] = changePValueNotation(output.p); 

            var method = "";
            if(paired == "TRUE")
            {
                method = "Paired t-test";  
            }
            else
            {
                if(varianceEqual == "TRUE")
                {
                    method = "Unpaired t-test";
                }
                else
                {
                    method = "Welch's t-test";
                }
            }

            multiVariateTestResults["method"] = method;

            multiVariateTestResults["effect-size"] = output.d;
            multiVariateTestResults["effect-size-type"] = "d";
            multiVariateTestResults["formula"] = variableList["dependent"][0] + " ~ " + variableList["independent"][0] + "(" + variableList["independent-levels"] + ")";

            //add to log
            logResult();

            //drawing stuff
            removeElementsByClassName("completeLines");

            displaySignificanceTestResults();
            setReportingText(multiVariateTestResults["formula"]);
            
        });
        
        //if R returns an error, alert the error message
        req.fail(function()
        {
            alert("Server error: " + req.responseText);
        });
    }
    else
    {   
        var output = sessionStorage.getObject(formula);

        multiVariateTestResults["df"] = output.DOF;

        multiVariateTestResults["parameter"] = output.t;
        multiVariateTestResults["parameter-type"] = "t";

        multiVariateTestResults["error"] = output.error;

        if(varianceEqual == "FALSE")
        {
            multiVariateTestResults["test-type"] = "WT";
        }
        else
        {
            if(paired == "TRUE")
                multiVariateTestResults["test-type"] = "pairedTTest";
            else
                multiVariateTestResults["test-type"] = "unpairedTTest";
        }

        multiVariateTestResults["rawP"] = output.p;
        multiVariateTestResults["p"] = changePValueNotation(output.p); 

        var method = "";
        if(paired == "TRUE")
        {
            method = "Paired t-test";  
        }
        else
        {
            if(varianceEqual == "TRUE")
            {
                method = "Unpaired t-test";
            }
            else
            {
                method = "Welch's t-test";
            }
        }

        multiVariateTestResults["method"] = method;

        multiVariateTestResults["effect-size"] = output.d;
        multiVariateTestResults["effect-size-type"] = "d";
        multiVariateTestResults["formula"] = variableList["dependent"][0] + " ~ " + variableList["independent"][0] + "(" + variableList["independent-levels"] + ")";

        //add to log
        logResult();

        //drawing stuff
        removeElementsByClassName("completeLines");

        displaySignificanceTestResults();
        setReportingText(multiVariateTestResults["formula"]);
    }
}

// ToDo: combine Mann-Whitney U test and Wilcoxon signed-rank test

// Mann-Whitney U test

function performMannWhitneyTest(groupA, groupB)
{
    var variableList = getSelectedVariables();
    var formula = "mW(" + mean(groupA) + "," + groupB;
    
    if(sessionStorage.getObject(formula) == null)
    {
        var req = ocpu.rpc("performMannWhitneyTest", 
        {
            groupA: groupA,
            groupB: groupB
        }, function(output) 
        {                   
            sessionStorage.setObject(formula, output);

            multiVariateTestResults["parameter"] = output.U;
            multiVariateTestResults["parameter-type"] = "U";

            multiVariateTestResults["test-type"] = "MannWhitneyTest";
            multiVariateTestResults["error"] = output.error;
            multiVariateTestResults["rawP"] = output.p;
            multiVariateTestResults["p"] = changePValueNotation(output.p);                  
            multiVariateTestResults["effect-size"] = output.r;
            multiVariateTestResults["method"] = "Mann-Whitney U test";
            multiVariateTestResults["effect-size-type"] = "r";
            multiVariateTestResults["formula"] = variableList["dependent"][0] + " ~ " + variableList["independent"][0] + "(" + variableList["independent-levels"] + ")";

            logResult();

            //drawing stuff
            removeElementsByClassName("completeLines");           

            displaySignificanceTestResults();    
            setReportingText(multiVariateTestResults["formula"]);                  
        });
        
        //if R returns an error, alert the error message
        req.fail(function()
        {
            alert("Server error: " + req.responseText);
        });
    }
    else
    {
        var output = sessionStorage.getObject(formula);

        multiVariateTestResults["parameter"] = output.U;
        multiVariateTestResults["parameter-type"] = "U";

        multiVariateTestResults["test-type"] = "MannWhitneyTest";
        multiVariateTestResults["error"] = output.error;
        multiVariateTestResults["rawP"] = output.p;
        multiVariateTestResults["p"] = changePValueNotation(output.p);                  
        multiVariateTestResults["effect-size"] = output.r;
        multiVariateTestResults["method"] = "Mann-Whitney U test";
        multiVariateTestResults["effect-size-type"] = "r";
        multiVariateTestResults["formula"] = variableList["dependent"][0] + " ~ " + variableList["independent"][0] + "(" + variableList["independent-levels"] + ")";

        logResult();

        //drawing stuff
        removeElementsByClassName("completeLines");           

        displaySignificanceTestResults();  
        setReportingText(multiVariateTestResults["formula"]);
    }
}

// WilcoxonSignedRankTest

function performWilcoxonSignedRankTest(groupA, groupB)
{
    var variableList = getSelectedVariables();
    var formula = "wil(" + mean(groupA) + "," + mean(groupB) + ")";

    if(sessionStorage.getObject(formula) == null)
    {   
        // Get variable names and their data type
        var req = ocpu.rpc("performWilcoxonTest", 
        {
            groupA: groupA,
            groupB: groupB
        }, function(output) 
        {         
            sessionStorage.setObject(formula, output);

            multiVariateTestResults["parameter"] = output.V;
            multiVariateTestResults["parameter-type"] = "V";
        
            multiVariateTestResults["test-type"] = "WelchTTest";
            multiVariateTestResults["error"] = output.error;
            
            multiVariateTestResults["rawP"] = output.p;
            multiVariateTestResults["p"] = changePValueNotation(output.p);                  
            multiVariateTestResults["effect-size"] = output.r;
            multiVariateTestResults["method"] = "Wilcoxon signed-rank test";    
            multiVariateTestResults["effect-size-type"] = "r";
            multiVariateTestResults["formula"] = variableList["dependent"][0] + " ~ " + variableList["independent"][0] + "(" + variableList["independent-levels"] + ")";
            
            logResult();                  
          
            //drawing stuff
            removeElementsByClassName("completeLines");           

            displaySignificanceTestResults();    
            setReportingText(multiVariateTestResults["formula"]);                 
        });
        
        //if R returns an error, alert the error message
        req.fail(function()
        {
            alert("Server error: " + req.responseText);
        });
    }
    else
    {
        var output = sessionStorage.getObject(formula);

        multiVariateTestResults["parameter"] = output.V;
        multiVariateTestResults["parameter-type"] = "V";
    
        multiVariateTestResults["test-type"] = "WelchTTest";
        multiVariateTestResults["error"] = output.error;
        
        multiVariateTestResults["rawP"] = output.p;
        multiVariateTestResults["p"] = changePValueNotation(output.p);                  
        multiVariateTestResults["effect-size"] = output.r;
        multiVariateTestResults["method"] = "Wilcoxon signed-rank test";    
        multiVariateTestResults["effect-size-type"] = "r";
        multiVariateTestResults["formula"] = variableList["dependent"][0] + " ~ " + variableList["independent"][0] + "(" + variableList["independent-levels"] + ")";
        
        logResult();                  
      
        //drawing stuff
        removeElementsByClassName("completeLines");           

        displaySignificanceTestResults(); 
        setReportingText(multiVariateTestResults["formula"]);
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//1 IV, 3+ levels: one-way ANOVA, Welch's ANOVA, Kruskal-Wallis test, one-way repeated-measures ANOVA, Friedman's test //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// One-way ANOVA

function performOneWayANOVA(dependentVariable, independentVariable)
{
    var variableList = getSelectedVariables();  
    var formula = "owA(" + dependentVariable + "," + independentVariable + ")";
    
    if(sessionStorage.getObject(formula) == null)
    {
        // Get variable names and their data type
        var req = ocpu.rpc("performOneWayANOVA", 
        {                    
            dependentVariable: dependentVariable,
            independentVariable: independentVariable,
            participantVariable: participants,
            dataset: dataset,
        }, function(output) 
        {                                                                                        
            sessionStorage.setObject(formula, output);
            callBackForPerformOneWayANOVA(output);           
        });
        
        //if R returns an error, alert the error message
        req.fail(function()
        {
            alert("Server error: " + req.responseText);
        });
    }
    else
    {
        callBackForPerformOneWayANOVA(sessionStorage.getObject(formula));        
    }
}

// Welch's ANOVA(non-parametric alternative for one-way ANOVA)

function performWelchANOVA(dependentVariable, independentVariable)
{
    var variableList = getSelectedVariables();
    var formula = "wA(" + dependentVariable + "," + independentVariable + ")";

    if(sessionStorage.getObject(formula) == null)
    {
        // Get variable names and their data type
        var req = ocpu.rpc("performWelchANOVA", 
        {
            dependentVariable: dependentVariable,
            independentVariable: independentVariable,
            dataset: dataset                   
        }, function(output) 
        {   
            sessionStorage.setObject(formula, output);

            multiVariateTestResults["df"] = output.numeratorDF + "," + output.denominatorDF;
        
            multiVariateTestResults["parameter"] = output.F;
            multiVariateTestResults["parameter-type"] = "F";
            multiVariateTestResults["test-type"] = "WelchANOVA";

            multiVariateTestResults["error"] = output.error;
            
            multiVariateTestResults["rawP"] = output.p;
            multiVariateTestResults["p"] = changePValueNotation(output.p);
            multiVariateTestResults["method"] = "Welch's ANOVA"; 
            multiVariateTestResults["effect-size"] = output.etaSquared;
            multiVariateTestResults["effect-size-type"] = "ηS";
            multiVariateTestResults["formula"] = dependentVariable + " ~ " + independentVariable + "(" + variableList["independent-levels"] + ")";
            
            logResult();       
          
            //drawing stuff
            removeElementsByClassName("completeLines"); 
        
            displaySignificanceTestResults();            
            setReportingText(multiVariateTestResults["formula"]);       
            drawPairwisePostHocComparisonsButtonWithHelpText(); 
        });
        
        //if R returns an error, alert the error message
        req.fail(function()
        {
            alert("Server error: " + req.responseText);
        });
    }
    else
    {
        var output = sessionStorage.getObject(formula);

        multiVariateTestResults["df"] = output.numeratorDF + "," + output.denominatorDF;
    
        multiVariateTestResults["parameter"] = output.F;
        multiVariateTestResults["parameter-type"] = "F";
        multiVariateTestResults["test-type"] = "WelchANOVA";

        multiVariateTestResults["error"] = output.error;
        
        multiVariateTestResults["rawP"] = output.p;
        multiVariateTestResults["p"] = changePValueNotation(output.p);
        multiVariateTestResults["method"] = "Welch's ANOVA"; 
        multiVariateTestResults["effect-size"] = output.etaSquared;
        multiVariateTestResults["effect-size-type"] = "ηS";
        multiVariateTestResults["formula"] = dependentVariable + " ~ " + independentVariable + "(" + variableList["independent-levels"] + ")";
        
        logResult();       
      
        //drawing stuff
        removeElementsByClassName("completeLines"); 
    
        displaySignificanceTestResults();        
        setReportingText(multiVariateTestResults["formula"]);
        drawPairwisePostHocComparisonsButtonWithHelpText();
    }
}

// Kruskal-Wallis test(non-parametric alternative for one-way ANOVA)

function performKruskalWallisTest(dependentVariable, independentVariable)
{
    var variableList = getSelectedVariables();
    var formula = "kW(" + dependentVariable + "," + independentVariable + ")";

    if(sessionStorage.getObject(formula) == null)
    {
        // Get variable names and their data type
        var req = ocpu.rpc("performKruskalWallisTest", 
        {
            dependentVariable: dependentVariable,
            independentVariable: independentVariable,
            dataset: dataset                   
        }, function(output) 
        {       
            sessionStorage.setObject(formula, output);

            multiVariateTestResults["df"] = output.DF; 

            multiVariateTestResults["parameter"] = output.ChiSquared;
            multiVariateTestResults["parameter-type"] = "cS";
            multiVariateTestResults["test-type"] = "KruskalWallisTest";

            multiVariateTestResults["error"] = output.error;

            multiVariateTestResults["rawP"] = output.p;
            multiVariateTestResults["p"] = changePValueNotation(output.p);                  
            multiVariateTestResults["method"] = "Kruskal Wallis test"; 
            multiVariateTestResults["effect-size"] = output.etaSquared;         
            multiVariateTestResults["effect-size-type"] = "ηS";
            multiVariateTestResults["formula"] = variableList["dependent"] + " ~ " + variableList["independent"] + "(" + variableList["independent-levels"] + ")";

            logResult();
            //drawing stuff
            removeElementsByClassName("completeLines");   

            displaySignificanceTestResults();            
            setReportingText(multiVariateTestResults["formula"]);     
            drawPairwisePostHocComparisonsButtonWithHelpText(); 
        });
        
        //if R returns an error, alert the error message
        req.fail(function()
        {
            alert("Server error: " + req.responseText);
        });
    }
    else
    {
        var output = sessionStorage.getObject(formula);

        multiVariateTestResults["df"] = output.DF; 

        multiVariateTestResults["parameter"] = output.ChiSquared;
        multiVariateTestResults["parameter-type"] = "cS";
        multiVariateTestResults["test-type"] = "KruskalWallisTest";

        multiVariateTestResults["error"] = output.error;

        multiVariateTestResults["rawP"] = output.p;
        multiVariateTestResults["p"] = changePValueNotation(output.p);                  
        multiVariateTestResults["method"] = "Kruskal Wallis test"; 
        multiVariateTestResults["effect-size"] = output.etaSquared;         
        multiVariateTestResults["effect-size-type"] = "ηS";
        multiVariateTestResults["formula"] = variableList["dependent"] + " ~ " + variableList["independent"] + "(" + variableList["independent-levels"] + ")";

        logResult();
        //drawing stuff
        removeElementsByClassName("completeLines");   

        displaySignificanceTestResults();        
        setReportingText(multiVariateTestResults["formula"]);
        drawPairwisePostHocComparisonsButtonWithHelpText();
    }
}

// One-way repeated-measures ANOVA

function performOneWayRepeatedMeasuresANOVA(dependentVariable, independentVariable)
{
    var variableList = getSelectedVariables();
    var formula = "owrA(" + dependentVariable + "," + independentVariable + ")";
    
    if(sessionStorage.getObject(formula) == null)
    {
        var req = ocpu.rpc("performOneWayRepeatedMeasuresANOVA", 
        {
            dependentVariable: dependentVariable,
            independentVariable: independentVariable,
            participantVariable: participants,
            dataset: dataset
        }, function(output) 
        {          
            sessionStorage.setObject(formula, output);

            multiVariateTestResults["df"] = output.numDF + ", " + output.denomDF;

            multiVariateTestResults["parameter"] = output.F;
            multiVariateTestResults["parameter-type"] = "F";
        
            multiVariateTestResults["error"] = output.error;

            multiVariateTestResults["test-type"] = "oneWayRepeatedMeasuresANOVA";

            multiVariateTestResults["method"] = "One-way RM ANOVA"; 
            multiVariateTestResults["effect-size"] = output.etaSquared;
            multiVariateTestResults["rawP"] = output.p;
            multiVariateTestResults["p"] = changePValueNotation(output.p);
            multiVariateTestResults["effect-size-type"] = "ηS";
            multiVariateTestResults["formula"] = variableList["dependent"][0] + " ~ " + variableList["independent"][0] + " ( " + variableList["independent-levels"] + ")";
            multiVariateTestResults["pIsCorrected"] = output.pIsCorrected.toString();

            logResult();
      
            //drawing stuff
            removeElementsByClassName("completeLines");

            displaySignificanceTestResults();                           
            resultsFromANOVA = setReportingText(multiVariateTestResults["formula"]);
            setReportingText(multiVariateTestResults["formula"]);  
            drawPairwisePostHocComparisonsButtonWithHelpText();          
        });
        
        //if R returns an error, alert the error message
        req.fail(function()
        {
            alert("Server error: " + req.responseText);
        });
    }
    else
    {
        var output = sessionStorage.getObject(formula);

        multiVariateTestResults["df"] = output.numDF + ", " + output.denomDF;

        multiVariateTestResults["parameter"] = output.F;
        multiVariateTestResults["parameter-type"] = "F";
    
        multiVariateTestResults["error"] = output.error;

        multiVariateTestResults["test-type"] = "oneWayRepeatedMeasuresANOVA";

        multiVariateTestResults["method"] = "One-way RM ANOVA"; 
        multiVariateTestResults["effect-size"] = output.etaSquared;
        multiVariateTestResults["rawP"] = output.p;
        multiVariateTestResults["p"] = changePValueNotation(output.p);
        multiVariateTestResults["effect-size-type"] = "ηS";
        multiVariateTestResults["formula"] = variableList["dependent"][0] + " ~ " + variableList["independent"][0] + " ( " + variableList["independent-levels"] + ")";
        multiVariateTestResults["pIsCorrected"] = output.pIsCorrected.toString();
    
        logResult();
  
        //drawing stuff
        removeElementsByClassName("completeLines");

        displaySignificanceTestResults();                           
        resultsFromANOVA = setReportingText(multiVariateTestResults["formula"]);
        setReportingText(multiVariateTestResults["formula"]);  
        drawPairwisePostHocComparisonsButtonWithHelpText(); 
    }
}

// Friedman's test (non-parametric alternative for one-way repeated-measures ANOVA)
function performFriedmanTest(dependentVariable, independentVariable)
{
    var formula = "fT(" + dependentVariable + "," + independentVariable + ")";

    if(sessionStorage.getObject(formula) == null)
    {
        var req = ocpu.rpc("performFriedmanTest", 
        {
            dependentVariable: dependentVariable,
            independentVariable: independentVariable,
            participantVariable: participants,
            dataset: dataset
        }, function(output) 
        {        
            sessionStorage.setObject(formula, output);

            multiVariateTestResults["df"] = output.df;

            multiVariateTestResults["parameter"] = output.chiSquared;
            multiVariateTestResults["parameter-type"] = "cS";

            multiVariateTestResults["test-type"] = "FriedmanTest";
            multiVariateTestResults["error"] = output.error;

            multiVariateTestResults["method"] = "Friedman's Analysis";
            multiVariateTestResults["rawP"] = output.p;
            multiVariateTestResults["p"] = changePValueNotation(output.p);
            multiVariateTestResults["effect-size"] = output.etaSquared;
            multiVariateTestResults["effect-size-type"] = "ηS";       
            multiVariateTestResults["formula"] = dependentVariable + " ~ " + independentVariable;

            logResult();

            //drawing stuff
            removeElementsByClassName("completeLines");           

            displaySignificanceTestResults();               
            setReportingText(multiVariateTestResults["formula"]);
            drawPairwisePostHocComparisonsButtonWithHelpText();
        });
        
        //if R returns an error, alert the error message
        req.fail(function()
        {
            alert("Server error: " + req.responseText);
        });
    }
    else
    {
        var output = sessionStorage.getObject(formula);

        multiVariateTestResults["df"] = output.df;

        multiVariateTestResults["parameter"] = output.chiSquared;
        multiVariateTestResults["parameter-type"] = "cS";

        multiVariateTestResults["test-type"] = "FriedmanTest";
        multiVariateTestResults["error"] = output.error;

        multiVariateTestResults["method"] = "Friedman's Analysis";
        multiVariateTestResults["rawP"] = output.p;
        multiVariateTestResults["p"] = changePValueNotation(output.p);
        multiVariateTestResults["effect-size"] = output.etaSquared;
        multiVariateTestResults["effect-size-type"] = "ηS";       
        multiVariateTestResults["formula"] = dependentVariable + " ~ " + independentVariable;
        logResult();

        //drawing stuff
        removeElementsByClassName("completeLines");           

        displaySignificanceTestResults();           
        setReportingText(multiVariateTestResults["formula"]);
        drawPairwisePostHocComparisonsButtonWithHelpText();
    }
}

/**
 * Creates the Aligned-Rank Transformed table from the given dataset
 */
function ART()
{
    var variableList = getSelectedVariables();
    var formula = "ART("  + "ToDo: something unique to a dataset" + ")";
    var dependentVariable = variableList["dependent"][0];

    if(sessionStorage.getObject(formula) == null)
    {    
        var req = ocpu.rpc("performAlignedRankTransform",
        {
            srcTable: dataset,
            responseName: dependentVariable
        }, function(output)
        {
            sessionStorage.setObject(formula, output);

            console.dir(output);

            // ToDo: set it as a new dataset (or just keep a copy of the old dataset)
        });

        req.fail(function()
        {
            alert("Server error: " + req.responseText);
        });
    }
}