performPairwiseWilcoxTestsWithBonfCorrection <- function(dataset, independentVariable, dependentVariable, paired)
{
  dataset = as.data.frame(dataset)
  
  if(paired == "T")
    paired = TRUE
  else
    paired = FALSE
  
  cat("\npaired = ", paired)
  
  # get all levels of IVs  
  L = unique(eval(parse(text = paste("dataset$", independentVariable))))  
  
  # compute the p-values
  p = c()
  statistic = c()
  df = c()
  method = c()
  r = c()
  differences = c()
  upperCI = c()
  lowerCI = c()  
  
  nComparisons = dim(combn(length(L), 2))[2]
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
    
    result = wilcox.test(distA, distB, paired = paired, conf.int = TRUE)
    differences = append(differences, mean(distA) - mean(distB))
    lowerCI = append(lowerCI, result[["conf.int"]][[1]])
    upperCI = append(upperCI, result[["conf.int"]][[2]])    
    
    p = append(p, result[["p.value"]])
    method = append(method, result[["method"]])
    
    if(paired == TRUE)
    {
      statistic = append(statistic, result[["statistic"]][["V"]])
      result <- coin::wilcoxsign_test(distA ~ distB, distribution = "exact")    
    }
    else
    {
      g <- factor(c(rep("GroupA", length(distA)), rep("GroupB", length(distB))))
      v <- c(distA, distB);
      statistic = append(statistic, result[["statistic"]][["W"]])
      
      result <- coin::wilcox_test(v ~ g, distribution = "exact")    
    }
    
    name <- names(result@statistic@teststatistic);    
    Z = result@statistic@teststatistic[[name[1]]];    
    r = append(r, Z/length(distA))
  }

  pairs = matrix(comps, nrow = nComparisons, ncol = 2, byrow=TRUE)
  
  # apply p-value adjustment
  adjusted.p = p.adjust(p, method = "bonferroni" )  
  
  # return the results
  list(adjustedP = adjusted.p, statistic = statistic, method = method, pairs = pairs, r = r, upperCI = upperCI, lowerCI = lowerCI, differences = differences)
}