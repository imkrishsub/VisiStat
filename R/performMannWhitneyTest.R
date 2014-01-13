performMannWhitneyTest <- function(groupA, groupB)
{
    groupA <- c(groupA);
    groupB <- c(groupB);
    
    result = findError(c(list(groupA), list(groupB)));
    error =  result$error;
    
    result <- wilcox.test(groupA, groupB);
    
    U = result$statistic[["W"]];
    p = result$p.value;
    CI = result$conf.int;
 
    Z = 
    
    list(U = U, p = p, r = abs(r), error = error);
}