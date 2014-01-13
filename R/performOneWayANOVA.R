performOneWayANOVA <- function(dependentVariable, independentVariable, participantVariable, dataset)
{       
    table <- as.data.frame(dataset);
    
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

    model  = eval(parse(text = paste("lm(", dependentVariable, " ~ ", independentVariable, ", data = table)", sep="")));
    
    result = anova(model);    
    
    DF = result$Df;
    etaSquared = etaSquared(model)[1];
    
    list(numDF = Df[1], denomDF = Df[2], F = result[["F value"]][1], p = result[["Pr(>F)"]][1], etaSquared = etaSquared, error = error);
}
