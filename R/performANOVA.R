performANOVA <- function(dependentVariable = "", independentVariable = "", dataset = "")
{       
    table <- as.data.frame(dataset);
    
    model <- eval(parse(text = paste("lm(formula = ", dependentVariable, " ~ ", independentVariable, ", data = table)", sep="")));
  
    result <- anova(model);
    
    install.packages("MBESS");
    library(MBESS);
    
    n = eval(parse(text = paste("length(table$",dependentVariable,")")));
    
    es = ci.pvaf(result[["F value"]][1], result[["Df"]][1], result[["Df"]][2], n);
  
    list(F = result[["F value"]][1], DOF = result[["Df"]][1], p = result[["Pr(>F)"]][1], etaSquared = es[["Upper.Limit.Proportion.of.Variance.Accounted.for"]]);
}
