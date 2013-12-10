performFriedmanTest <- function(dependentVariable, independentVariable, participantVariable, filePath)
{
    fileType = substr(filePath, nchar(filePath) - 3 + 1, nchar(filePath));
    
    if(fileType == "txt")
        dataset <- read.table(filePath, head=T);
    if(fileType == "csv")
        dataset <- read.csv(filePath, head=T);
    
    result = eval(parse(text = paste("friedman.test(",dependentVariable," ~ ",independentVariable," | ",participantVariable,", data = dataset)",sep="")));
    
    sampleSize = eval(parse(text = paste("length(dataset$",independentVariable,")", sep="")));
    etaSq = result$statistic[["Friedman chi-squared"]]/(sampleSize - 1);
    
    list(chiSquared = result$statistic[["Friedman chi-squared"]], df = result$parameter[["df"]], p = result$p.value, method = result$method, etaSquared = etaSq);
}
  
