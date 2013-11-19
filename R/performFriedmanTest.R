performFriedmanTest <- function(dependentVariable, independentVariable, participantVariable, dataset)
{
    table <- as.data.frame(dataset);
    
    result = eval(parse(text = paste("friedman.test(",dependentVariable," ~ ",independentVariable," | ",participantVariable,", data = table)",sep="")));
    list(chiSquared = result$statistic[["Friedman chi-squared"]], df = result$parameter[["df"]], p = result$p.value, method = result$method)
}
  
