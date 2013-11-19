performMannWhitneyTest <- function(groupA, groupB)
{
    install.packages("coin");
    
    groupA <- c(groupA);
    groupB <- c(groupB);
    
    result <- wilcox.test(groupA, groupB);
    
    U = result$statistic[["W"]];
    p = result$p.value;
    
    library(coin);
    
    g <- factor(c(rep("groupA", length(groupA)), rep("groupB", length(groupB))));
    v <- c(groupA, groupB);
    
    result <- wilcox_test(v~g, distribution = "exact");
    
    Z = result@statistic@teststatistic[["groupA"]];
    
    r = Z/length(groupA);
    
    list(U = U, p = p, r = abs(r));
}