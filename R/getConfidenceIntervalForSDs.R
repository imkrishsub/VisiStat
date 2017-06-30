getConfidenceIntervalForSDs <- function(distributions)
{
  library(doMC)
  registerDoMC(cores=6)
  
  CI <- foreach(count = seq_len(length(distributions))) %dopar%
  {
    distribution = distributions[[count]]        
    findConfidenceIntervalOfSD(sd(distribution), length(distribution));
  }

  SD <- foreach(count = seq_len(length(distributions))) %dopar%
  {
    distribution = distributions[[count]]        
    sd(distribution)
  }
  
  list(CI = CI, CIArrayNames = names(distributions), SD = SD);  
}