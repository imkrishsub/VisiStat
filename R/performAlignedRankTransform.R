# Author: Chat Wacharamanotham
# Calculate Aligned Rank Transform (ART) for all effects and interactions column
# Parameters:
#   srcTable: Data table in long format (one row = one measurement of the response variable)
#   responseName: The name of the column that contans the response to be ART-ed. (Default: last column)
performAlignedRankTransform <- function(srcTable, responseName = names(srcTable)[ncol(srcTable)])
{
      # # load libraries 
      # library(assertthat)
      # library(sqldf)

      srcTable <- as.data.frame(srcTable);

      # table checking
      assertthat::assert_that(ncol(srcTable) > 2)  # first column is subject and last column is response
      assertthat::assert_that(is.numeric(unlist(srcTable[responseName])))

      # 1. the first step is to parse the *.csv file and create a long-format data table
      dstTable <- srcTable
      # no-op due to precondition of the parameter

      # 2. the second step is to create columns in the destination table and then fill them with aligned data
      # prepare column names
      factorNames <- names(srcTable)[2:(ncol(srcTable) - 1)]

      list(factorNames = factorNames)

      # 2.1 compute residuals
      residual <- {
            byParam <- srcTable[factorNames]
            responseMeanByFactors <- aggregate(unlist(srcTable[responseName]), byParam, mean)
            cellMeans <- unlist(merge(srcTable[factorNames], responseMeanByFactors)["x"])
            srcTable[responseName] - cellMeans
      }

      # create power set of factors, sorted descendingly by its cardinal order (high order interactions first, main effects last)
      # removes the empty subset from the powerset
      factorPset <- {
            tempPset <- powerSet(factorNames)
            sortResult <- sort(unlist(lapply(tempPset, length)), decreasing = T, index.return = T)
            factorPset <- head(tempPset[sortResult$ix] , - 1)
      }
      

      # 2.2 align rows and put the results in the columns
      #   The following code is optimized by using lookup table to compute each estimate 
      #   once per combination of factor x levels. This result in O(number of factors x number of unique levels)
      #   instead of O(number of rows in the data). The translation of Wobbrock's version is in align2() in altFuctions.R
      #  
      #   Performance on Higgins1990-Table1.csv
      #   user  system elapsed 
      #   0.049   0.004   0.052 

      for (i in seq_len(length(factorPset)))
      {
            aFactorSubset <- unlist(factorPset[i])
            colName <- sprintf("aligned(%s) for %s", 
                        responseName,
                        paste(unlist(aFactorSubset), collapse="*"))
            dstTable[colName] <- residual + estimatedEffect(aFactorSubset, responseName, srcTable)
      }


      # 3. the third step is a check: sum each aligned column to ensure it equals zero
      alignedColumns <- grep("align.*", names(dstTable))
      checkResults <- (abs(colSums(dstTable[,alignedColumns])) < 0.001)
      assertthat::assert_that(all(checkResults == TRUE))

      # 4. the fourth step is to assign averaged ranks to each of the aligned columns, creating new columns
      #   Here, we dismiss some precision to match results in Wobbrock's implementation (although theoretically unnecessary)
      dstTable[,alignedColumns] <- round(dstTable[,alignedColumns], digits=6)       
      rankCols <- apply(dstTable[,alignedColumns], 2, rank,  ties.method="average")
      colnames(rankCols) <- gsub("^aligned\\(","ART\\(", colnames(rankCols))
      dstTable[,colnames(rankCols)] <- rankCols

      # 5. the fifth step is to write out the destination table with the same name as the source table, plus *.art.csv.      
      # write.csv(dstTable, "/Users/krishsub/Code/ART/test.art.csv", row.names = F, na = "")

      list(transformedDataset = dstTable)
}