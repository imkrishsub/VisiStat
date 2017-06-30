Array.max = function( array )
{
    return Math.max.apply( Math, array );
}

Array.min = function( array )
{
    return Math.min.apply( Math, array );
}	

function mean(values)
{ 
    var total = 0, i;
    for (i = 0; i < values.length; i += 1) {
        total += values[i];
    }
    return total / values.length;
}

function median(values) 
{
    temp = values.slice();
    temp.sort( function(a,b) {return a - b;} );
    
    var half = Math.floor(temp.length/2);

    if(temp.length % 2)
        return temp[half];
    else
        return (temp[half-1] + temp[half]) / 2.0;
    

}

function findNumberOfCombinations(n, y)
{
    return factorials[n]/(factorials[y]*factorials[n-y]);
}

function isPrime(num) 
{
    if(num < 2) return false;
    for (var i = 2; i < num; i++) {
        if(num%i==0)
            return false;
    }
    return true;
}

function findIQR(values)
{
    var temp = values.slice();
    temp.sort( function(a,b) {return a - b;} );
    
    var half1 = new Array();
    var half2 = new Array();
    if(temp.length % 2)
    {
        var x = Math.floor(temp.length/2);
        
        //odd
        for(var i=0; i<Math.floor(temp.length/2); i++)
            half1.push(temp[i]);
            
        for(var i=Math.floor(temp.length/2) + 1; i<temp.length; i++)
            half2.push(temp[i]);
    }
    else
    {
        //even
        for(var i=0; i<Math.floor(temp.length/2); i++)
            half1.push(temp[i]);
            
        for(var i=Math.floor(temp.length/2); i<temp.length; i++)
            half2.push(temp[i]);
    }
    
    var q1, q3;
    q1 = median(half1);
    q3 = median(half2);
    
    if(half1.length == 0)
        return 0;
    return q3 - q1;
} 

function findCI(distribution)
{
    var SE = getStandardError(distribution);
    var m = mean(distribution);
    
    var array = new Array();
    
    array[0] = m - 1.96*SE;
    array[1] = m + 1.96*SE;
    
    return array;
} 

function getStandardError(values)
{   
    var sd = getStandardDeviation(values);
    
    return sd/Math.sqrt(values.length);
}

function getStandardDeviation(values)
{
    var m = mean(values);
    var SS = 0;
    
    for(var i=0; i<values.length; i++)
    {
        SS += Math.pow(values[i] - m,2);
    }
    
    return Math.sqrt(SS/values.length);
}

function sumOf(values)
{
    var sum = 0;
    
    for(var i=0; i<values.length; i++)
    {
        sum += values[i];
    }
    
    return sum;
}

function getPearsonCorrelation(X, Y)
{
    var XY = [];
    var XS = [];
    var YS = [];
    
    for(var i=0; i<X.length; i++)
    {
        XY[i] = X[i]*Y[i];
        XS[i] = X[i]*X[i];
        YS[i] = Y[i]*Y[i];
    }
    
    var n = X.length;
    var numerator = n*sumOf(XY) - sumOf(X)*sumOf(Y);
    var denominator = Math.sqrt((n*sumOf(XS) - sumOf(X)*sumOf(X))*(n*sumOf(YS) - sumOf(Y)*sumOf(Y)));
    var r = numerator/denominator;

    multiVariateTestResults["method"] = "Pearson's correlation coefficient";
                    
    // logResult();
    
    return r;
}

// Returns the sum of numbers from 1 to number
function getSumUpTo(number)
{
    if(number == 1)
        return 1;
    else
    {
        return number + getSumUpTo(number-1);
    }
}