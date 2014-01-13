llply <- function (.data, .fun = NULL, ..., .progress = "none", .inform = FALSE, 
    .parallel = FALSE, .paropts = NULL) 
{
    if (is.null(.fun)) 
        return(as.list(.data))
    if (is.character(.fun) || is.list(.fun)) 
        .fun <- each(.fun)
    if (!is.function(.fun)) 
        stop(".fun is not a function.")
    if (!inherits(.data, "split")) {
        pieces <- as.list(.data)
        fast_path <- .progress == "none" && !.inform && !.parallel
        if (fast_path) {
            return(structure(lapply(pieces, .fun, ...), dim = dim(pieces)))
        }
    }
    else {
        pieces <- .data
    }
    n <- length(pieces)
    if (n == 0) 
        return(list())
    if (.parallel && .progress != "none") {
        message("Progress disabled when using parallel plyr")
        .progress <- "none"
    }
    progress <- create_progress_bar(.progress)
    progress$init(n)
    on.exit(progress$term())
    result <- vector("list", n)
    do.ply <- function(i) {
        piece <- pieces[[i]]
        if (.inform) {
            res <- try(.fun(piece, ...))
            if (inherits(res, "try-error")) {
                piece <- paste(capture.output(print(piece)), 
                  collapse = "\n")
                stop("with piece ", i, ": \n", piece, call. = FALSE)
            }
        }
        else {
            res <- .fun(piece, ...)
        }
        progress$step()
        res
    }
    if (.parallel) {
        setup_parallel()
        i <- seq_len(n)
        fe_call <- as.call(c(list(as.name("foreach"), i = i), 
            .paropts))
        fe <- eval(fe_call)
        result <- fe %dopar% do.ply(i)
    }
    else {
        result <- loop_apply(n, do.ply)
    }
    attributes(result)[c("split_type", "split_labels")] <- attributes(pieces)[c("split_type", 
        "split_labels")]
    names(result) <- names(pieces)
    if (!is.null(dim(pieces))) {
        dim(result) <- dim(pieces)
    }
    result
}
