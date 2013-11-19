performWelchANOVA <- function(dependentVariable, independentVariable)
{
    dependentVariable <- c(dependentVariable);
    independentVariable <- c(independentVariable);
    
    result = oneway.test(dependentVariable ~ independentVariable);
    
    install.packages("MBESS");
    library(MBESS);
    
    n = length(dependentVariable);
    
    es = ci.pvaf(result$statistic[["F"]], result$parameter[["num df"]], result$parameter[["denom df"]], n);
    
    list(p = result$p.value, F = result$statistic[["F"]], numeratorDF = result$parameter[["num df"]], denominatorDF = result$parameter[["denom df"]], etaSquared = es[["Upper.Limit.Proportion.of.Variance.Accounted.for"]]);
}   