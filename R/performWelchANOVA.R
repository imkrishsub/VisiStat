performWelchANOVA <- function(dependentVariable, independentVariable, dataset)
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

    result = eval(parse(text = paste("oneway.test(", dependentVariable, " ~ ", independentVariable, ", data = table)")));
    
    n = length(dependentVariable);
    
    es = ci.pvaf(result$statistic[["F"]], result$parameter[["num df"]], result$parameter[["denom df"]], n);
    
    list(p = result$p.value, F = result$statistic[["F"]], numeratorDF = result$parameter[["num df"]], denominatorDF = result$parameter[["denom df"]], etaSquared = es[["Upper.Limit.Proportion.of.Variance.Accounted.for"]], error = error);
}   