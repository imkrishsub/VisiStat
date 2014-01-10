performFriedmanTest <- function(dependentVariable, independentVariable, participantVariable, filePath)
{
    fileType = substr(filePath, nchar(filePath) - 3 + 1, nchar(filePath));
    
    if(fileType == "txt")
        dataset <- read.table(filePath, head=T);
    if(fileType == "csv")
        dataset <- read.csv(filePath, head=T);
        
    table <- dataset
    
    levels = eval(parse(text = paste("unique(table$", independentVariable, ")", sep="")))   
    
    for(i in 1:length(levels))
    {
        if(i == 1)
        {
            distributions = c(list(eval(parse(text = paste("(subset(table, ", independentVariable, " == \"", levels[i], "\"))$", dependentVariable, sep = "")))))
        }
        else
        {
            distributions = c(distributions, list(eval(parse(text = paste("(subset(table, ", independentVariable, " == \"", levels[i], "\"))$", dependentVariable, sep = "")))))
        }
    }
    
    result = findError(distributions);
    error = result$error;
    
    result = eval(parse(text = paste("friedman.test(",dependentVariable," ~ ",independentVariable," | ",participantVariable,", data = dataset)",sep="")));
    
    sampleSize = eval(parse(text = paste("length(dataset$",independentVariable,")", sep="")));
    etaSq = result$statistic[["Friedman chi-squared"]]/(sampleSize - 1);
    
    list(chiSquared = result$statistic[["Friedman chi-squared"]], df = result$parameter[["df"]], p = result$p.value, method = result$method, etaSquared = etaSq, error = error);
}
  
