performOneSampleTTest <- function(distribution, trueMean = "0")
{
    distribution = c(distribution);
    
    result = t.test(distribution, mu = eval(parse(text = trueMean)));
    
    d = ES.t.one(n = length(distribution), mu = result$estimate[["mean of x"]], t = result$statistic[["t"]])[["d"]];
    
    list(t = result$statistic[["t"]], df = result$parameter[["df"]], p = result$p.value, estimate = result$estimate[["mean of x"]], method = result$method, d = d);
}