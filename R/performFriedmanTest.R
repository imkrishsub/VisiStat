performFriedmanTest <- function(dependentVariable, independentVariable, participantVariable, dataset)
{        
    table <- as.data.frame(dataset)
    
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
        
    eval(parse(text = paste("dataset.modified <- doBy::summaryBy(", dependentVariable, " ~ ", participantVariable, " + ", independentVariable, ", data = dataset, FUN = mean, keep.names=T)", sep="")))    
    
    result = eval(parse(text = paste("friedman.test(", dependentVariable," ~ ",independentVariable," | ",participantVariable,", data = dataset.modified)",sep="")));
    
    sampleSize = eval(parse(text = paste("length(dataset$",independentVariable,")", sep="")));
    etaSq = result$statistic[["Friedman chi-squared"]]/(sampleSize - 1);
    
    list(chiSquared = result$statistic[["Friedman chi-squared"]], df = result$parameter[["df"]], p = result$p.value, method = result$method, etaSquared = etaSq, error = error);
}
  
