performTwoWayANOVA <- function(dataset, dependentVariable, participantVariable, betweenGroupVariableA, betweenGroupVariableB)
{
    table <- as.data.frame(dataset);
    
    install.packages("ez");
    library(ez);
    
    result = eval(parse(text = paste("ezANOVA(table, dv = ", dependentVariable,", wid = ", participantVariable, ", between = c(", betweenGroupVariableA, ",", betweenGroupVariableB, "))", sep="")));
    
    result = result$ANOVA;
    
    list(numDF = result$DFn, denomDF = result$DFd, F = result$F, p = result$p, etaSquared = result$ges);
}