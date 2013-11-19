performPairwiseTTest <- function(dependentVariable, independentVariable, dataset, levelA, levelB)
{
    table <- as.data.frame(dataset);
    
    result <- eval(parse(text = paste("pairwise.t.test(table$",dependentVariable,",table$",independentVariable,",p.adj=\"bonf\")",sep="")));
    p = result[["p.value"]][levelA,levelB];
    
    list(p = p, method = result[["method"]]);
}