pairwise.table.t <- function (compare.levels.t, level.names, p.adjust.method) 
{
    ix <- setNames(seq_along(level.names), level.names)
    pp <- outer(ix[-1L], ix[-length(ix)], function(ivec, jvec) sapply(seq_along(ivec), 
        function(k) {
            i <- ivec[k]
            j <- jvec[k]
            if (i > j)
                compare.levels.t(i, j)               
            else NA
        }))
    pp[lower.tri(pp, TRUE)] <- pp[lower.tri(pp, TRUE)]
    pp
}