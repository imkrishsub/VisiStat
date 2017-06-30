DTKTest <- function(dataset, dependentVariable, independentVariable)
{
  table = as.data.frame(dataset); # typecast as data.frame
  
  result = eval(parse(text = paste("DTK::DTK.test(table$",dependentVariable,", table$", independentVariable,")", sep="")))
  
  difference = result[[2]][,1]
  upper = result[[2]][,3]
  lower = result[[2]][,2]
  
  responses = eval(parse(text = paste("table$", dependentVariable, sep="")))
  groups = eval(parse(text = paste("table$", independentVariable, sep="")))
  
  temp = rownames(result[[2]])
  pairs = c()
  
  for(i in 1:length(temp))
  {
    pairs = append(pairs, strsplit(temp[i], "-")[[1]][[1]])
    pairs = append(pairs, strsplit(temp[i], "-")[[1]][[2]])
  }
  
  comps = matrix(pairs, nrow=length(temp), ncol = 2, byrow=TRUE)
  pValues = pValueTukey(difference, upper, lower, responses, groups, comps)
  
  result = performPairwiseTTestsWithBonfCorrection(dataset, independentVariable, dependentVariable, "T", "F");
  
  list(p = pValues, differences = difference, upperCI = upper, lowerCI = lower, pairs = comps, d = result[["d"]])
}