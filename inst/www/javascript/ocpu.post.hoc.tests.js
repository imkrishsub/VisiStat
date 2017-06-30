////////////////////////
//Post-hoc comparison //
////////////////////////

// t-tests with Bonferroni correction
function performPairwiseTTestsWithBonferroniCorrection(varEqual, paired)
{	
    var variableList = getSelectedVariables();

    var dependentVariable = variableList["dependent"][0];   
    var independentVariable = variableList["independent"][0]; 

    var formula = "pairwiseTTestWithBonfCorrection(" + dependentVariable + " " + independentVariable + ")";
    postHocTestResults["formula"] = formula;

    if(sessionStorage.getObject(formula) == null)
    {
        var req = ocpu.rpc("performPairwiseTTestsWithBonfCorrection", 
        {
        	dataset: dataset,
        	independentVariable: independentVariable,
        	dependentVariable: dependentVariable,
        	varEqual: varEqual,
        	paired: paired		
        }, function(output) 
        {   
            sessionStorage.setObject(formula, output);   
             if(paired == "T" && varEqual == "T")
             {
                postHocTestResults["method"] = "Pairwise paired t-test";
                postHocTestResults["test-type"] = "pairwisePairedTTest";
            }
            else if(varEqual == "F")
            {
                postHocTestResults["method"] = "Pairwise Welch's t-test";
                postHocTestResults["test-type"] = "pairwiseWelchTTest";            
            }

            callBackForPairwiseTTests(output);  	
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

        if(paired == "T" && varEqual == "T")
         {
            postHocTestResults["method"] = "Pairwise paired t-test";
            postHocTestResults["test-type"] = "pairwisePairedTTest";
        }
        else if(varEqual == "F")
        {
            postHocTestResults["method"] = "Pairwise Welch's t-test";
            postHocTestResults["test-type"] = "pairwiseWelchTTest";            
        }


        callBackForPairwiseTTests(output);
    }
}

function callBackForPairwiseTTests(output)
{
    postHocTestResults["pairs"]  = output.pairs;
    postHocTestResults["rawP"] = output.adjustedP;
    postHocTestResults["p"] = postHocTestResults["rawP"].clone();

    for(var i=0; i<postHocTestResults["p"].length; i++)
    {
        postHocTestResults["p"][i] = changePValueNotation(postHocTestResults["p"][i]);
    }

    postHocTestResults["df"] = output.df;
    postHocTestResults["parameter"] = output.t;   
    postHocTestResults["parameter-type"] = "t";
    postHocTestResults["effect-size"] = output.d;  
    postHocTestResults["effect-size-type"] = "d";    
    postHocTestResults["differences"] = output.differences;
    postHocTestResults["upperCI"] = output.upperCI;
    postHocTestResults["lowerCI"] = output.lowerCI;

    renderPostHocComparisonTable(); 
    setReportingText(postHocTestResults["formula"]);
}

// - - - - - - - - - - - - - Pairwise Wilcox-tests with Bonferroni correction - - - - - - - - - - - - - 

function performPairwiseWilcoxTestsWithBonferroniCorrection(paired)
{	
    var variableList = getSelectedVariables();

    var dependentVariable = variableList["dependent"][0];   
    var independentVariable = variableList["independent"][0]; 

    var formula = "pairwiseWilcoxTestWithBonfCorrection(" + dependentVariable + " " + independentVariable + ")";    

    postHocTestResults["formula"] = formula;

    if(sessionStorage.getObject(formula) == null)
    {
        var req = ocpu.rpc("performPairwiseWilcoxTestsWithBonfCorrection", 
        {
            dataset: dataset,
            independentVariable: independentVariable,
            dependentVariable: dependentVariable,			
            paired: paired
        }, function(output) 
        {   
            sessionStorage.setObject(formula, output);                 

            if(paired == "F")
            {
                postHocTestResults["method"] = "Pairwise unpaired Wilcox-test";
                postHocTestResults["test-type"] = "pairwiseUnpairedWilcoxTest";
            }
            else
             {
                 postHocTestResults["method"] = "Pairwise paired Wilcox-test";
                 postHocTestResults["test-type"] = "pairwisePairedWilcoxTest";
             }  

            callBackForPairwiseWilcoxTests(output);
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

        if(paired == "F")
        {
            postHocTestResults["method"] = "Pairwise unpaired Wilcox-test";
            postHocTestResults["test-type"] = "pairwiseUnpairedWilcoxTest";
        }
        else
         {
             postHocTestResults["method"] = "Pairwise paired Wilcox-test";
             postHocTestResults["test-type"] = "pairwisePairedWilcoxTest";
         }  

        callBackForPairwiseWilcoxTests(output);        
    }
}

function callBackForPairwiseWilcoxTests(output)
{    
    postHocTestResults["pairs"]  = output.pairs;
    postHocTestResults["rawP"] = output.adjustedP;    
    postHocTestResults["p"] = postHocTestResults["rawP"].clone();

    for(var i=0; i<postHocTestResults["p"].length; i++)
    {
        postHocTestResults["p"][i] = changePValueNotation(postHocTestResults["p"][i]);
    }

    postHocTestResults["parameter"] = output.statistic;
    postHocTestResults["parameter-type"] = postHocTestResults["method"].indexOf("unpaired") == -1 ? "W" : "U";
    postHocTestResults["effect-size"] = output.r;
    postHocTestResults["effect-size-type"] = "r";
    postHocTestResults["differences"] = output.differences;
    postHocTestResults["upperCI"] = output.upperCI;
    postHocTestResults["lowerCI"] = output.lowerCI;

    renderPostHocComparisonTable();
    setReportingText(postHocTestResults["formula"]);
}

// - - - - - - - - - - - - - Tukey HSD test - - - - - - - - - - - - - 

function performTukeyHSDTest()
{ 
    var variableList = getSelectedVariables();

    var dependentVariable = variableList["dependent"][0];
    var independentVariable = variableList["independent"][0];

    var formula = "tukeyHSD(" + dependentVariable + " " + independentVariable + ")";    
    postHocTestResults["formula"] = formula;

    if(sessionStorage.getObject(formula) == null)
    {
        var req = ocpu.rpc("DTKTest", 
        {
            dataset: dataset,
            dependentVariable: dependentVariable,
            independentVariable: independentVariable            
        }, function(output) 
        {    
            sessionStorage.setObject(formula, output);
            callBackForTukeyHSD(output);
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
        callBackForTukeyHSD(output);        
    } 
}

function callBackForTukeyHSD(output)
{
    postHocTestResults["pairs"]  = output.pairs;
    postHocTestResults["rawP"] = output.p;
    postHocTestResults["p"] = postHocTestResults["rawP"].clone();

    for(var i=0; i<postHocTestResults["rawP"].length; i++)
    {                
        postHocTestResults["p"][i] = changePValueNotation(postHocTestResults["p"][i]);
    }

    postHocTestResults["differences"] = output.differences;
    postHocTestResults["upperCI"] = output.upperCI;
    postHocTestResults["lowerCI"] = output.lowerCI;      
    postHocTestResults["method"] = "Tukey HSD test";
    postHocTestResults["effect-size"] = output.d;
    postHocTestResults["effect-size-type"] = "d";
    postHocTestResults["test-type"] = "tukeyHSDTest";

    renderPostHocComparisonTable();   
    setReportingText(postHocTestResults["formula"]);


}