# Returns p-value(s) for the given estimate of mean difference from Tukey test
# 
# Parameters:
#   difference: numeric vector of mean differences obtained from Tukey HSD
#   upper: numeric vector of the upper confidence interval
# 	lower: numeric vector of the lower part of the confidence interval
#   responses: vector of dependent variable values
#   groups: vector of the independent variable levels. The size of this vector must be the same as the responses
#   comps: k * 2 matrix containing labels of k pairs of comparison. Each element is the lable of groups
pValueTukey <- function(difference, upper, lower, responses, groups, comps, alpha = .05)
{
  nMeans <- {										# nMeans = number of means (only for the means that involving in the comparison)
    x <- comps
    dim(x) <- NULL
    nMeans <- length(unique(x))
  }
  residualDf <- length(responses) - length(unique(groups))
  
  marginOfError <- ((upper - lower) / 2) / qtukey(p = 1 - alpha, nmeans = nMeans, df = residualDf)
  estimate <- difference / marginOfError
  
  pTukey <- ptukey(abs(estimate), nmeans = nMeans, df = residualDf, lower.tail = FALSE)
  return(pTukey)
}