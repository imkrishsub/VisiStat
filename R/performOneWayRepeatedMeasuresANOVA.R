performOneWayRepeatedMeasuresANOVA <- function(dependentVariable, independentVariable, participantVariable, dataset)
{   
    install.packages("ez");
    library(ez);
        
    table <- as.data.frame(dataset);
    
    result <- eval(parse(text = paste("ezANOVA(table,",dependentVariable,",",participantVariable,",between=",independentVariable,")",sep="")));
    result <- result$ANOVA;
    
    list(numDF = result$DFn, denomDF = result$DFd, F = result$F, p = result$p, etaSquared = result$ges);    
}