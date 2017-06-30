# Author: Chat Wacharamanotham
# Returns row indices in which the values matched the given selctors
# Parameters:
#     selectorCols: vector of column names
#     selectorValues: vector of values to match (in the same order as the selectorCols)
#     dataDF: data frame to match
matchedIndicesByColVal <- function(selectorCols, selectorValues, dataDF)
{
      # # load libraries 
      # library(assertthat)
      # library(sqldf)

      # calculate index of rows to include in the computation
      if(length(selectorCols) > 1) {
            rowMatch <- rep(T, nrow(dataDF))
            for (colIdx in seq_len(length(selectorCols)))
            {
                  colName <- selectorCols[colIdx]
                  colVal <- selectorValues[colIdx]
                  rowMatch <- rowMatch & dataDF[,colName] == colVal
            }
            rowIndices <- which(rowMatch)

      } else {
            rowIndices <- which(dataDF[, selectorCols] == selectorValues)
      }
      return(rowIndices)
}