performKruskalWallisTest <- function(dependentVariable, independentVariable, dataset)
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
  
	result <- eval(parse(text = paste("kruskal.test(", dependentVariable, " ~ ", independentVariable, ", data = table)")));
	etaSq = result$statistic[["Kruskal-Wallis chi-squared"]]/(length(independentVariable)-1);

	list(ChiSquared = result$statistic[["Kruskal-Wallis chi-squared"]], DF = result$parameter[["df"]], p = result$p.value, etaSquared = etaSq, error = error);
}
