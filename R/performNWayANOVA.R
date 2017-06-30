performNWayANOVA <- function (dataset, dependentVariable, independentVariables) 
{
  dataset = as.data.frame(dataset);
  
  factorString = toFormulaString(getCombinations(independentVariables)); # the magic function(s)		
  
  formula = paste(dependentVariable, " ~ ", factorString, sep=""); # append factorString to create formula	
  formula = as.formula(formula)

  # set contrasts for IVs
  nIVs = length(independentVariables)

  for(i in 1:nIVs)
  {
  	# get levels
    eval(parse(text = paste0("dataset$", independentVariables[i], " = ", "as.factor(dataset$", independentVariables[i], ")")));
  	nLevels = length(levels(eval(parse(text = paste("dataset$", independentVariables[i], sep="")))));
  	eval(parse(text = paste("contrasts(dataset$", independentVariables[i], ") = contr.helmert(", nLevels, ")", sep="")));
  }
  
  # get model
  model = lm(formula, data = dataset);
  
  # perform type III ANOVA
  result = car::Anova(model, type="III", singular.ok = T);  
  eSquared = lsr::etaSquared(model, type=3);
  
  labels = names(eSquared[,1])

  list(p = result[["Pr(>F)"]][2:(length(labels)+1)], F = result[["F value"]][2:(length(labels)+1)], numDF = result[["Df"]][2:(length(labels)+1)], denomDF = result[["Df"]][length(result[["Df"]])], etaSquared = eSquared[,1], labels = labels);
}
