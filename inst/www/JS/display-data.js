function displayDataForVariable(variable)
{
    var variableData = variables[variable]["dataset"];
    
    var LEFT = canvasWidth/2 - plotWidth/2;
    var RIGHT = canvasWidth/2 + plotWidth/2;
    
    var TOP = canvasHeight/2 - plotHeight/2;
    var BOTTOM = canvasHeight/2 + plotHeight/2;
    
    var canvas = d3.select("#canvas");
    
    canvas.append("p")
            .text("Unfortunately, this variable has too many levels and does not have a meaningful visualization!")
            .attr("align", "center")
            .attr("style", "font-size: " + fontSizeForDisplayDataTitle + "px")
            .attr("class", "displayDataText");
    
    var table = canvas.append("table")
            .attr("border", "1")
            .attr("class", "displayDataTable")
            .attr("style", "font-size: " + fontSizeForDisplayDataTableElements + "px; position: relative; width: 30%; top: " + scaleForWindowSize(45) + "px; margin: 0 auto; border-spacing: 0; border-collapse: collapse;");
            
    table.append("tr").append("th").text(variable).attr("style", "font-size: " + 1.3*fontSizeForDisplayDataTableElements + "px;");      
            
    for(var i=0; i<variableData.length; i++)
    {
        if(i < displayDataLimit)
        {
            if(i > rangeToFade)
            {
                table.append("tr").append("td").text(variableData[i]).attr("align", "center").attr("style", "color: rgba(0, 0, 0, " + ((displayDataLimit - i)/(displayDataLimit - rangeToFade))*1 + ")");
            }
            else
            {
                table.append("tr").append("td").attr("align", "center").text(variableData[i]);            
            }
        }
    }
}