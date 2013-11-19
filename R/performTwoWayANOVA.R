performTwoWayANOVA <- function(dataset, dependentVariable, independentVariableA, independentVariableB)
{
    table <- as.data.frame(dataset);
    
    model <- eval(parse(text = paste("lm(",dependentVariable,"~",independentVariableA," + ", independentVariableB," + ",independentVariableA,"*",independentVariableB,",dataset)",sep="")));
    result <- summary(model);
    
    install.packages("MBESS");
    library(MBESS);
    
    n = eval(parse(text = paste("length(table$",dependentVariable,")")));
    
    es = ci.pvaf(result$fstatistic[["value"]], result$fstatistic[["numdf"]], result$fstatistic[["dendf"]], n);
    
    ares = anova(model);
    p = ares[["Pr(>F)"]];
    
    
    list(F = result$fstatistic[["value"]], numDF = result$fstatistic[["numdf"]], denomDF = result$fstatistic[["dendf"]], rSquared = result$r.squared, etaSquared = es[["Upper.Limit.Proportion.of.Variance.Accounted.for"]], p=p);
}