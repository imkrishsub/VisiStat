etaSquared <- function (x, type = 2, anova = FALSE) 
{
    if (!is(anova, "logical") | length(anova) != 1) {
        stop("\"anova\" must be a single logical value")
    }
    if (!is(x, "lm")) {
        stop("\"x\" must be a linear model object")
    }
    if (!is(type, "numeric") | length(type) != 1) {
        stop("type must be equal to 1,2 or 3")
    }
    if (type == 1) {
        ss <- anova(x)[, "Sum Sq", drop = FALSE]
        ss.res <- ss[dim(ss)[1], ]
        ss.tot <- sum(ss)
        ss <- ss[-dim(ss)[1], , drop = FALSE]
        ss <- as.matrix(ss)
    }
    else {
        if (type == 2) {
            ss.tot <- sum((x$model[, 1] - mean(x$model[, 1]))^2)
            ss.res <- sum((x$residuals)^2)
            terms <- attr(x$terms, "factors")[-1, , drop = FALSE]
            l <- attr(x$terms, "term.labels")
            ss <- matrix(NA, length(l), 1)
            rownames(ss) <- l
            for (i in seq_along(ss)) {
                vars.this.term <- which(terms[, i] != 0)
                dependent.terms <- which(apply(terms[vars.this.term, 
                  , drop = FALSE], 2, prod) > 0)
                m0 <- lm(x$terms[-dependent.terms], x$model)
                if (length(dependent.terms) > 1) {
                  m1 <- lm(x$terms[-setdiff(dependent.terms, 
                    i)], x$model)
                  ss[i] <- anova(m0, m1)$`Sum of Sq`[2]
                }
                else {
                  ss[i] <- anova(m0, x)$`Sum of Sq`[2]
                }
            }
        }
        else {
            if (type == 3) {
                mod <- drop1(x, scope = x$terms)
                ss <- mod[-1, "Sum of Sq", drop = FALSE]
                ss.res <- mod[1, "RSS"]
                ss.tot <- sum((x$model[, 1] - mean(x$model[, 
                  1]))^2)
                ss <- as.matrix(ss)
            }
            else {
                stop("type must be equal to 1,2 or 3")
            }
        }
    }
    if (anova == FALSE) {
        eta2 <- ss/ss.tot
        eta2p <- ss/(ss + ss.res)
        E <- cbind(eta2, eta2p)
        rownames(E) <- rownames(ss)
        colnames(E) <- c("eta.sq", "eta.sq.part")
    }
    else {
        ss <- rbind(ss, ss.res)
        eta2 <- ss/ss.tot
        eta2p <- ss/(ss + ss.res)
        k <- length(ss)
        eta2p[k] <- NA
        df <- anova(x)[, "Df"]
        ms <- ss/df
        Fval <- ms/ms[k]
        p <- 1 - pf(Fval, df, rep.int(df[k], k))
        E <- cbind(eta2, eta2p, ss, df, ms, Fval, p)
        E[k, 6:7] <- NA
        colnames(E) <- c("eta.sq", "eta.sq.part", "SS", "df", 
            "MS", "F", "p")
        rownames(E) <- rownames(ss)
        rownames(E)[k] <- "Residuals"
    }
    return(E)
}
