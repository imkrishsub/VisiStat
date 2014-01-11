levene.test <- function (y, group, location = c("median", "mean", "trim.mean"), 
    trim.alpha = 0.25, bootstrap = FALSE, num.bootstrap = 1000, 
    kruskal.test = FALSE, correction.method = c("none", "correction.factor", 
        "zero.removal", "zero.correction")) 
{
    if (length(y) != length(group)) {
        stop("the length of the data (y) does not match the length of the group")
    }
    location <- match.arg(location)
    correction.method <- match.arg(correction.method)
    DNAME = deparse(substitute(y))
    y <- y[!is.na(y)]
    group <- group[!is.na(y)]
    if ((location == "trim.mean") & (trim.alpha == 1)) {
        stop("trim.alpha value of 0 to 0.5 should be provided for the trim.mean location")
    }
    reorder <- order(group)
    group <- group[reorder]
    y <- y[reorder]
    gr <- group
    group <- as.factor(group)
    if (location == "mean") {
        means <- tapply(y, group, mean)
        METHOD <- "classical Levene's test based on the absolute deviations from the mean"
    }
    else if (location == "median") {
        means <- tapply(y, group, median)
        METHOD = "modified robust Brown-Forsythe Levene-type test based on the absolute deviations from the median"
    }
    else {
        location = "trim.mean"
        trimmed.mean <- function(y) mean(y, trim = trim.alpha)
        means <- tapply(y, group, trimmed.mean)
        METHOD <- "modified robust Levene-type test based on the absolute deviations from the trimmed mean"
    }
    n <- tapply(y, group, length)
    resp.mean <- abs(y - means[group])
    ngroup <- n[group]
    if (location != "median" && correction.method != "correction.factor") {
        METHOD <- paste(METHOD, "(", correction.method, "not applied because the location is not set to median", 
            ")")
        correction.method <- "none"
    }
    if (correction.method == "correction.factor") {
        METHOD <- paste(METHOD, "with correction factor")
        correction <- sqrt(ngroup/(ngroup - 1))
        resp.mean <- correction * resp.mean
    }
    if (correction.method == "zero.removal" || correction.method == 
        "zero.correction") {
        if (correction.method == "zero.removal") {
            METHOD <- paste(METHOD, "with Hines-Hines structural zero removal method")
        }
        if (correction.method == "zero.correction") {
            METHOD <- paste(METHOD, "with modified structural zero removal method and correction factor")
        }
        resp.mean <- y - means[group]
        k <- length(n)
        temp <- double()
        endpos <- double()
        startpos <- double()
        for (i in 1:k) {
            group.size <- n[i]
            j <- i - 1
            if (i == 1) 
                start <- 1
            else start <- sum(n[1:j]) + 1
            startpos <- c(startpos, start)
            end <- sum(n[1:i])
            endpos <- c(endpos, end)
            sub.resp.mean <- resp.mean[start:end]
            sub.resp.mean <- sub.resp.mean[order(sub.resp.mean)]
            if (group.size%%2 == 1) {
                mid <- (group.size + 1)/2
                temp2 <- sub.resp.mean[-mid]
                if (correction.method == "zero.correction") {
                  ntemp <- length(temp2) + 1
                  correction <- sqrt((ntemp - 1)/ntemp)
                  temp2 <- correction * temp2
                }
            }
            if (group.size%%2 == 0) {
                mid <- group.size/2
                if (correction.method == "zero.removal") {
                  denom <- sqrt(2)
                }
                else {
                  denom <- 1
                }
                replace1 <- (sub.resp.mean[mid + 1] - sub.resp.mean[mid])/denom
                temp2 <- sub.resp.mean[c(-mid, -mid - 1)]
                temp2 <- c(temp2, replace1)
                if (correction.method == "zero.correction") {
                  ntemp <- length(temp2) + 1
                  correction <- sqrt((ntemp - 1)/ntemp)
                  temp2 <- correction * temp2
                }
            }
            temp <- c(temp, temp2)
        }
        resp.mean <- abs(temp)
        zero.removal.group <- group[-endpos]
    }
    else {
        correction.method = "none"
    }
    if (correction.method == "zero.removal" || correction.method == 
        "zero.correction") {
        d <- zero.removal.group
    }
    else {
        d <- group
    }
    if (kruskal.test == FALSE) {
        statistic <- anova(lm(resp.mean ~ d))[1, 4]
        p.value <- anova(lm(resp.mean ~ d))[1, 5]
    }
    else {
        METHOD <- paste("rank-based (Kruskal-Wallis)", METHOD)
        ktest <- kruskal.test(resp.mean, d)
        statistic <- ktest$statistic
        p.value = ktest$p.value
    }
    non.bootstrap.p.value <- p.value
    if (bootstrap == TRUE) {
        METHOD <- paste("bootstrap", METHOD)
        R <- 0
        N <- length(y)
        frac.trim.alpha <- 0.2
        b.trimmed.mean <- function(y) {
            nn <- length(y)
            wt <- rep(0, nn)
            y2 <- y[order(y)]
            lower <- ceiling(nn * frac.trim.alpha) + 1
            upper <- floor(nn * (1 - frac.trim.alpha))
            if (lower > upper) 
                stop("frac.trim.alpha value is too large")
            m <- upper - lower + 1
            frac <- (nn * (1 - 2 * frac.trim.alpha) - m)/2
            wt[lower - 1] <- frac
            wt[upper + 1] <- frac
            wt[lower:upper] <- 1
            return(weighted.mean(y2, wt))
        }
        b.trim.means <- tapply(y, group, b.trimmed.mean)
        rm <- y - b.trim.means[group]
        for (j in 1:num.bootstrap) {
            sam <- sample(rm, replace = TRUE)
            boot.sample <- sam
            if (min(n) < 10) {
                U <- runif(1) - 0.5
                means <- tapply(y, group, mean)
                v <- sqrt(sum((y - means[group])^2)/N)
                boot.sample <- ((12/13)^(0.5)) * (sam + v * U)
            }
            if (location == "mean") {
                boot.means <- tapply(boot.sample, group, mean)
            }
            else if (location == "median") {
                boot.means <- tapply(boot.sample, group, median)
            }
            else {
                location = "trim.mean"
                trimmed.mean.2 <- function(boot.sample) mean(boot.sample, 
                  trim = trim.alpha)
                boot.means <- tapply(boot.sample, group, trimmed.mean.2)
            }
            resp.boot.mean <- abs(boot.sample - boot.means[group])
            if (correction.method == "correction.factor") {
                correction <- sqrt(ngroup/(ngroup - 1))
                resp.mean <- correction * resp.boot.mean
            }
            if (correction.method == "zero.removal" || correction.method == 
                "zero.correction") {
                resp.mean <- boot.sample - boot.means[group]
                k <- length(n)
                temp <- double()
                endpos <- double()
                startpos <- double()
                for (i in 1:k) {
                  group.size <- n[i]
                  j <- i - 1
                  if (i == 1) 
                    start <- 1
                  else start <- sum(n[1:j]) + 1
                  startpos <- c(startpos, start)
                  end <- sum(n[1:i])
                  endpos <- c(endpos, end)
                  sub.resp.mean <- resp.mean[start:end]
                  sub.resp.mean <- sub.resp.mean[order(sub.resp.mean)]
                  if (group.size%%2 == 1) {
                    mid <- (group.size + 1)/2
                    temp2 <- sub.resp.mean[-mid]
                    if (correction.method == "zero.correction") {
                      ntemp <- length(temp2) + 1
                      correction <- sqrt((ntemp - 1)/ntemp)
                      temp2 <- correction * temp2
                    }
                  }
                  if (group.size%%2 == 0) {
                    mid <- group.size/2
                    if (correction.method == "zero.removal") {
                      denom <- sqrt(2)
                    }
                    else {
                      denom <- 1
                    }
                    replace1 <- (sub.resp.mean[mid + 1] - sub.resp.mean[mid])/denom
                    temp2 <- sub.resp.mean[c(-mid, -mid - 1)]
                    temp2 <- c(temp2, replace1)
                    if (correction.method == "zero.correction") {
                      ntemp <- length(temp2) + 1
                      correction <- sqrt((ntemp - 1)/ntemp)
                      temp2 <- correction * temp2
                    }
                  }
                  temp <- c(temp, temp2)
                }
                resp.boot.mean <- abs(temp)
                zero.removal.group <- group[-endpos]
            }
            if (correction.method == "zero.removal" || correction.method == 
                "zero.correction") {
                d <- zero.removal.group
            }
            else {
                d <- group
            }
            if (kruskal.test == FALSE) {
                statistic2 = anova(lm(resp.boot.mean ~ d))[1, 
                  4]
            }
            else {
                bktest <- kruskal.test(resp.boot.mean, d)
                statistic2 <- bktest$statistic
            }
            if (statistic2 > statistic) 
                R <- R + 1
        }
        p.value <- R/num.bootstrap
    }
    STATISTIC = statistic
    names(STATISTIC) = "Test Statistic"
    structure(list(statistic = STATISTIC, p.value = p.value, 
        method = METHOD, data.name = DNAME, non.bootstrap.p.value = non.bootstrap.p.value), 
        class = "htest")
}
