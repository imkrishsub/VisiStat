//OpenCPU: load dataset
//load the file to a JS object
function loadFile(filePath)
{
    //loads the file and returns the dataset and variable names
    var req = ocpu.rpc("loadFile", 
    {
        fileName: sessionStorage.fileName
    }, function(output) 
    {    
        console.dir(output);
        dataset = output.dataset;

        //render the variable names
        renderVariableNames(output.variableNames);    

        //we now have the variable names. let the dogs out!
        variableNames = output.variableNames;

        //for each variable, get the data and the IQR
        for(var i=0; i<output.variableNames.length(); i++)
        {    
            conso  
            variables[output.variableNames[i]] = new Object();
            MIN[output.variableNames[i]] = new Object();
            MAX[output.variableNames[i]] = new Object();
            IQR[output.variableNames[i]] = new Object();
            CI[output.variableNames[i]] = new Object();

            getData(dataset, output.variableNames[i]);      
        }
    });
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}    

//get data by each variable name into JS object-value pairs
function getData(dataset, variableName, level)
{
    if(level === undefined)  
        level = "dataset";
    
    variables[variableName][level] = [];
    
    for(var i=0; i<dataset.length(); i++)
        variables[variableName][level].push(dataset[i][variableName]);  
        
    MIN[variableName][level] = Array.min(variables[variableName][level]);
    MAX[variableName][level] = Array.max(variables[variableName][level]);
    
    IQR[variableName][level] = findIQR(variables[variableName][level]);
    CI[variableName][level] = findCI(variables[variableName][level]);   
    
    if(++variableCount == getObjectLength(variableNames))
    {
        setVariableRoles();
        setVariableTypes();
        
        testForEvilVariables();
        
        removeElementsByClassName("loadingAnimation");
        freezeMouseEvents = false;
        
        experimentalDesign = findExperimentalDesign();            
        
        var visualisations = ["Histogram", "Boxplot", "Scatterplot", "Scatterplot-matrix"];
        invalidate(visualisations);

        // displayToolTips();
    }
}

//TODO: writes the list of tasks done to a file
function writeToFileTests(fileName)
{
    return;
    var req = ocpu.rpc("writeToFile", 
    {
        object: logListTests,
        fileName: fileName
    }, function(output) 
    {
    
    })
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

//TODO: writes the list of tasks done to a file
function writeToFileVisualizations(fileName)
{
    return;
    var req = ocpu.rpc("writeToFile", 
    {
        object: logListVisualizations,
        fileName: fileName
    }, function(output) 
    {
    
    })
    
    //if R returns an error, alert the error message
    req.fail(function()
    {
        alert("Server error: " + req.responseText);
    });
}

