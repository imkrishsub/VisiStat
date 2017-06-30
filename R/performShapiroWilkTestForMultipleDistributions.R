performShapiroWilkTestForMultipleDistributions <- function(distributions, n)
{  
    dist <- c(distributions)
    currentIndex = 1
    testStatistic = c()
    p = c()
    method = "IdenticalDataElementsInAllDistributions"
    
    for (i in 1:length(n)) 
    {
        temp = dist[currentIndex:(currentIndex+n[i]-1)]
        currentIndex = currentIndex + n[i]
        
        if(length(temp) > 3 && length(unique(temp)) > 1)
        {
          result <- eval(parse(text = paste("shapiro.test(temp)")));
        
          if(i == 1)
          {
              testStatistic = c(result$statistic[["W"]]);
              p = c(result$p.value);
              method = result$method;
              val = temp;
          }
          else
          {
              testStatistic = c(testStatistic, result$statistic[["W"]]);
              p = c(p, result$p.value);
          }  
        }
        else
        {
          testStatistic = c(testStatistic, 0);
          p = c(p, 1.0);          
        }
    }

    list(testStatistic = testStatistic, p = p, method = method)
}
