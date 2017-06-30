getPairwiseCombinations <- function(vector)
{
  combinations = combinat::combn(vector, 2)
  pairwiseCombinations = c()
  
  for(i in 1:ncol(combinations))
  {
    pairwiseCombinations = c(pairwiseCombinations, paste(combinations[1,i], "-", combinations[2,i], sep=""))
  }
  
  return(pairwiseCombinations)
}
