# Author: Chat Wacharamanotham
# Calculate power set of a given vector
# Parameters:
#     s: a vector of elements to create power set
# Source: http://stackoverflow.com/questions/18715580/algorithm-to-calculate-power-set-all-possible-subsets-of-a-set-in-r
#  
powerSet <- function(s)
{
    # # load libraries 
    #   library(assertthat)
    #   library(sqldf)

    len <- length(s)
    l <- vector(mode="list",length=2^len)
    l[[1]] <- numeric()
    counter <- 1L
    for(x in 1L:length(s)){
        for(subset in 1L:counter)
        {
            counter <- counter+1L
            l[[counter]] <- c(l[[subset]],s[x])
        }
    }
    return(l)
}