# Author: Chat Wacharamanotham
# Returns estimated effect calculated by recursively (signed) accumulate the mean effect of all 
#   main and interaction effects of the given factor set
# Parameters:
#     factorSet: vector of column names as a factors to be recursively interated on
#     responseName: string name of response column
#     dataDF: data frame for the calculation
estimatedEffect <- function(factorSet, responseName, dataDF)
{
   # # load libraries 
   #    library(assertthat)
   #    library(sqldf)

      # prepare powerset of the given factors
      factorPowerset <- powerSet(factorSet)
      sortResult <- sort(unlist(lapply(factorPowerset, length)), decreasing = T, index.return = T)
      factorPowerset <- head(factorPowerset[sortResult$ix] , - 1) # removes the empty subset from the powerset
      signs <- {
            x <- sortResult$x
            ifelse((x %% 2) == rep((x %% 2)[1], length(x)),1, -1) 
            # NOTE: flipping array between 1 and -1
            # the last element representing the sign of the grand mean
      }

      grandMean <- mean(dataDF[,responseName])

      # create a table of the estimated effect over unique combinations of values in the dataset
      dfSummary <- unique(dataDF[,factorSet, drop = FALSE])
      dfSummary$EstimateEffect <- 0
      for (r in seq_len(nrow(dfSummary)))
      {
            estimatedEffect <- 0
            for (i in seq_len(length(factorPowerset)))
            {
                  aFactorSubset <- unlist(factorPowerset[i])
                  matchedRowIdxs <- matchedIndicesByColVal(aFactorSubset, unlist(dfSummary[r, aFactorSubset]), dataDF)
                  aMean <- mean(dataDF[matchedRowIdxs, responseName])
                  estimatedEffect <- estimatedEffect + (signs[i] * aMean)
            }
            estimatedEffect <- estimatedEffect + (tail(signs, 1) * grandMean)
            dfSummary[r,"EstimateEffect"] <- estimatedEffect
      }

      # match the table with the data and return a vector of estimated effect
      anSql <- sprintf("SELECT EstimateEffect 
               FROM dataDF 
               LEFT JOIN dfSummary using (%s) 
               ORDER BY dataDF.rowid",
               paste(unlist(factorSet), collapse=",")
            )
      result <- sqldf::sqldf(anSql)
      return(result)
}