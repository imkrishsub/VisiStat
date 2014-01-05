performWilcoxonTest <- function(groupA, groupB)
{   
    groupA <- c(groupA);    
    groupB <- c(groupB);
      
    result <- wilcox.test(groupA, groupB, paired = T, conf.int=TRUE);
  
    V = result$statistic[["V"]];
    p = result$p.value;
    CI = result$conf.int;
    
    result <- wilcoxsign_test(groupA ~ groupB, distribution = "exact");
    
    name <- names(result@statistic@teststatistic);
    
    Z = result@statistic@teststatistic[[name[1]]];
    
    r = Z/length(groupA);
    
    list(V = V, p = p, r = abs(r), CI = CI);
}
