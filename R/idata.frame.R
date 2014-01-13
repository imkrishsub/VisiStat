idata.frame <- function (df) 
{
    self <- new.env()
    self$`_data` <- df
    self$`_rows` <- seq_len(nrow(df))
    self$`_cols` <- names(df)
    self$`_getters` <- lapply(names(df), function(name) {
        eval(substitute(function(v) {
            if (missing(v)) {
                `_data`[[name]][`_rows`]
            } else {
                stop("Immutable")
            }
        }, list(name = name)), envir = self)
    })
    names(self$`_getters`) <- names(df)
    for (name in names(df)) {
        f <- self$`_getters`[[name]]
        environment(f) <- self
        makeActiveBinding(name, f, self)
    }
    structure(self, class = c("idf", "environment"))
}
