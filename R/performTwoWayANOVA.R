performTwoWayANOVA <- function(dataset, dependentVariable, participantVariable, betweenGroupVariableA, betweenGroupVariableB)
{
    table <- as.data.frame(dataset);

    independentVariables = c(betweenGroupVariableA, betweenGroupVariableB)
    
    for(j in 1:2)
    {
        levels = eval(parse(text = paste("unique(table$", independentVariables[j], ")", sep="")))   
        
        for(i in 1:length(levels))
        {
            if(i == 1 && j == 1)
            {
                distributions = c(list(eval(parse(text = paste("(subset(table, ", independentVariables[j], " == \"", levels[i], "\"))$", dependentVariable, sep = "")))))
            }
            else
            {
                distributions = c(distributions, list(eval(parse(text = paste("(subset(table, ", independentVariable[j], " == \"", levels[i], "\"))$", dependentVariable, sep = "")))))
            }
        }
    }
    
    result = findError(distributions);
    error = result$error;
    
    result = eval(parse(text = paste("ez::ezANOVA(table, dv = ", dependentVariable,", wid = ", participantVariable, ", between = c(", betweenGroupVariableA, ",", betweenGroupVariableB, "))", sep="")));
    
    result = result$ANOVA;
    
    list(numDF = result$DFn, denomDF = result$DFd, F = result$F, p = result$p, etaSquared = result$ges, error = error);
}