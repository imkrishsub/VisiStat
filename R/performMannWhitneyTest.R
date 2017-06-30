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

    g <- factor(c(rep("GroupA", length(groupA)), rep("GroupB", length(groupB))))
    v <- c(groupA, groupB);
    
    distributionType="exact";    
    if(length(groupA) > 100)
      distributionType = "approximate";
    
    result <- coin::wilcox_test(v ~ g, distribution = distributionType)
    name <- names(result@statistic@teststatistic);
    
    Z = result@statistic@teststatistic[[name[1]]];
    
    r = Z/length(groupA);
    
    list(U = U, p = p, r = abs(r), error = error);
}