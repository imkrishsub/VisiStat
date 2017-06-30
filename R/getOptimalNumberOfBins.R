getOptimalNumberOfBins <- function(distributions)
{   
  library(doMC)
  registerDoMC(cores=6)
  nBins <- foreach(count = seq_len(length(distributions))) %dopar%
  {
    distribution = distributions[[count]]    
    N <- 2: 15
    C <- numeric(length(N))
    D <- C
    
    for (i in 1:length(N)) {
      D[i] <- diff(range(distribution))/N[i]
      
      edges = seq(min(distribution),max(distribution),length=N[i])
      hp <- hist(distribution, breaks = edges, plot=FALSE )
      ki <- hp$counts
      
      k <- mean(ki)
      v <- sum((ki-k)^2)/N[i]
      
      C[i] <- (2*k-v)/D[i]^2  #Cost Function
    }
    
    idx <- which.min(C);
    numBreaks <- N[idx] - 1
    altBreaks <- nclass.FD(distribution)
    numBreaks <- ifelse(numBreaks == 2 & altBreaks > numBreaks, altBreaks, numBreaks)
    
    # return value for the parallel loop
    numBreaks
  }
  
  list(nBinsArray = nBins, nBinsArrayNames = names(distributions));
}
