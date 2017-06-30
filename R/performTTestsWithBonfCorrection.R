performPairwiseTTestsWithBonfCorrection <- function(dataset, independentVariable, dependentVariable, varEqual, paired)
{
  dataset = as.data.frame(dataset)

  if(varEqual == "T")
    varEqual = TRUE
  else
    varEqual = FALSE

  if(paired == "T")
    paired = TRUE
  else
    paired = FALSE
  
  # get all levels of IVs  
  data = eval(parse(text = paste("dataset$", independentVariable, sep="")))
  L = unique(data)  
  
  # compute the p-values
  p = c()
  t = c()
  df = c()
  method = c()
  d = c()
  differences = c()
  upperCI = c()
  lowerCI = c()
  
  nComparisons = dim(combn(length(L), 2))[2]
  
  print(nComparisons)
  combinations = getPairwiseCombinations(L)
  
  comps = c()
  
  for(i in 1:nComparisons)
  {    
    levelA = strsplit(combinations[i], "-")[[1]][1]
    levelB = strsplit(combinations[i], "-")[[1]][2]
    
    comps = append(comps, levelA)
    comps = append(comps, levelB)
    
    dataA = eval(parse(text = paste("subset(dataset,dataset$", independentVariable, " == \"", levelA, "\")", sep="")))
    dataB = eval(parse(text = paste("subset(dataset,dataset$", independentVariable, " == \"", levelB, "\")", sep="")))
    
    distA = eval(parse(text = paste("dataA$", dependentVariable, sep="")))
    distB = eval(parse(text = paste("dataB$", dependentVariable, sep="")))
    
    result = t.test(distA, distB, var.equal = varEqual, paired = paired)  
    differences = append(differences, mean(distA) - mean(distB))
    lowerCI = append(lowerCI, result[["conf.int"]][[1]])
    upperCI = append(upperCI, result[["conf.int"]][[2]])
    
    p = append(p, result[["p.value"]])
    t = append(t, result[["statistic"]])
    df = append(df, result[["parameter"]])
    method = append(method, result[["method"]])
    d = append(d, abs(smd(distA, distB)))
  }
  
  pairs = matrix(comps, nrow = nComparisons, ncol = 2, byrow=T)
  
  # apply p-value adjustment
  adjusted.p = p.adjust(p, method = "bonferroni" )  
  
  # return the results
  list(adjustedP = adjusted.p, t = t, df = df, method = method, pairs = pairs, d = d, upperCI = upperCI, lowerCI = lowerCI, differences = differences)
}