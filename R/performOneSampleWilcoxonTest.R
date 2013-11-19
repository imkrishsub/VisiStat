performOneSampleWilcoxonTest <- function(distribution, trueMean = "0")
{
    distribution = c(distribution);
    
    result = wilcox.test(distribution, mu = eval(parse(text = trueMean)), conf.int=TRUE);
    
    Z = median(scale(distribution));
    r = Z/sqrt(length(distribution));
    list(V = result$statistic[["V"]], p = result$p.value, estimate = result$estimate[["(pseudo)median"]], method = result$method, r = r, estimate = result$estimate[["(pseudo)median"]]);
}