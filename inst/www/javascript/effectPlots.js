// - - - - - - - - - - - - - Interaction/main effects - - - - - - - - - - - - - 

function plotSimpleMainEffect(left, top, effectPlotWidth, effectPlotHeight)
{
	// Get canvas
	var canvas = d3.select("#effectPlotCanvas");

	// Get DV
	var variableList = sort(selectedVariables);
	var DV = variableList["dependent"][0];
	var IV = global.interactionEffect.IV;
	var otherIV = global.interactionEffect.fixedIVs[0];	

	// Get data
	var levels = variables[IV]["dataset"].unique(); // Data is accessible at variables[DV][levels[i]
	var otherLevel = global.interactionEffect.fixedIVLevels[0];

	// Plot axes
	var marginLeft = 60;
	var marginBottom = 75;
	var marginTop = 2.5*parseFloat(fontSizes["effect plot title"]);
	var marginRight = 10;

	var axesOffset = 15;

	var LEFT = left + marginLeft;
	var RIGHT = left + effectPlotWidth - marginRight;

	var TOP = top + marginTop;
	var BOTTOM = top + effectPlotHeight - marginBottom;

	canvas.append("line")
		.attr("x1", LEFT)
		.attr("y1", BOTTOM + axesOffset)
		.attr("x2", RIGHT)
		.attr("y2", BOTTOM + axesOffset)
		.attr("stroke", "black")
		.attr("stroke-width", strokeWidth["axis"])
		.attr("id", "xAxis")
		.attr("class", "effectPlot");

	canvas.append("line")
		.attr("x1", LEFT - axesOffset)
		.attr("y1", BOTTOM)
		.attr("x2", LEFT - axesOffset)
		.attr("y2", TOP)
		.attr("stroke", "black")
		.attr("stroke-width", strokeWidth["axis"])
		.attr("id", "yAxis")
		.attr("class", "effectPlot");

	// Plot ticks
	var numberOfTicksInXAxis = levels.length;
	var numberOfTicksInYAxis = getNumberOfTicks(BOTTOM - TOP);

	plotTicksXAxis(LEFT, BOTTOM + axesOffset, RIGHT - LEFT, IV); 

	var yAxisTicks = new Array(); // Calculate yAxisTicks

	var DVMin = Array.min(variables[DV]["dataset"]);
	var DVMax = Array.max(variables[DV]["dataset"]);

	var DVStepSize = (DVMax - DVMin)/(numberOfTicksInYAxis - 1);

	for(var i = 0; i<=numberOfTicksInYAxis; i++)
		yAxisTicks.push(DVMin + i*DVStepSize);

	plotTicksYAxis(LEFT - axesOffset, BOTTOM, BOTTOM - TOP, yAxisTicks);

	// Define scale
	var scale = d3.scale.linear()
			.domain([DVMin, DVMax])
			.range([0, BOTTOM - TOP]);

	
	for(var i=0; i<levels.length; i++)
	{
		
		var dist = variables[DV].hasOwnProperty(levels[i] + "-" + otherLevel) ? variables[DV][levels[i] + "-" + otherLevel] : variables[DV][otherLevel + "-" + levels[i]];					

		if(dist.length == 0)
			continue;

		var m = mean(dist);

		var fillColor = colors[j];

		var xStepSize = (RIGHT - LEFT)/levels.length;
		var yStepSize = (BOTTOM - TOP)/(yAxisTicks.length - 1);								

		var CI = findCI(dist);
		var CIWidth = 15;

		// Plot data points
		for(var j=0; j<dist.length; j++)
		{
			canvas.append("circle")
				.attr("cx", LEFT + i*xStepSize + xStepSize/2)
				.attr("cy", BOTTOM - scale(dist[j]))
				.attr("r", radius["effectPlot.data point"])
				.attr("fill", "black")
				.attr("class", "dataPoints");
		}

		canvas.append("line")
			.attr("x1", LEFT + i*xStepSize + xStepSize/2)
			.attr("y1", BOTTOM - scale(CI[0]))
			.attr("x2", LEFT + i*xStepSize + xStepSize/2)
			.attr("y2", BOTTOM - scale(CI[1]))
			.attr("stroke", "#93D5E5")
			.attr("stroke-width", strokeWidth["CI"])			
			.attr("id", getValidId(levels[i]))
			.attr("class", "effectPlotCIs");

		canvas.append("line")
			.attr("x1", LEFT + i*xStepSize + xStepSize/2 - CIWidth/2)
			.attr("y1", BOTTOM - scale(CI[0]))
			.attr("x2", LEFT + i*xStepSize + xStepSize/2 + CIWidth/2)
			.attr("y2", BOTTOM - scale(CI[0]))
			.attr("stroke", "#93D5E5")
			.attr("stroke-width", strokeWidth["CI"])
			.attr("id", getValidId(levels[i]))
			.attr("class", "effectPlotCIs");

		canvas.append("line")
			.attr("x1", LEFT + i*xStepSize + xStepSize/2 - CIWidth/2)
			.attr("y1", BOTTOM - scale(CI[1]))
			.attr("x2", LEFT + i*xStepSize + xStepSize/2 + CIWidth/2)
			.attr("y2", BOTTOM - scale(CI[1]))
			.attr("stroke", "#93D5E5")
			.attr("stroke-width", strokeWidth["CI"])
			.attr("id", getValidId(levels[i]))
			.attr("class", "effectPlotCIs");

		canvas.append("circle")
			.attr("cx", LEFT + i*xStepSize + xStepSize/2)
			.attr("cy", BOTTOM - scale(m)) 
			.attr("r", radius["effectPlot.mean"])
			.attr("fill", meanColors["normal"])
			.attr("id", getValidId(levels[i]))
			.attr("class", "effectPlotMeans");	
	}
	// Draw lines through the means
	for(var i=0; i<levels.length -1; i++)
	{		
		var mean1 = d3.select("#" + getValidId(levels[i]) + ".effectPlotMeans");
		var mean2 = d3.select("#" + getValidId(levels[i+1]) + ".effectPlotMeans");

		canvas.append("line")
			.attr("x1", mean1.attr("cx"))
			.attr("y1", mean1.attr("cy"))
			.attr("x2", mean2.attr("cx"))
			.attr("y2", mean2.attr("cy"))
			.attr("stroke", "black");
	}
}

function plotMainEffect(left, top, effectPlotWidth, effectPlotHeight, IV)
{
	// Get canvas
	var canvas = d3.select("#effectPlotCanvas");

	// Get DV
	var variableList = getSelectedVariables();
	var DV = variableList["dependent"][0];

	// Get data
	var levels = variables[IV]["dataset"].unique(); // Data is accessible at variables[DV][levels[i]]

	// Plot axes
	var marginLeft = 60;
	var marginBottom = 75;
	var marginTop = 2.5*parseFloat(fontSizes["effect plot title"]);
	var marginRight = 10;

	var axesOffset = 15;

	var LEFT = left + marginLeft;
	var RIGHT = left + effectPlotWidth - marginRight;

	var TOP = top + marginTop;
	var BOTTOM = top + effectPlotHeight - marginBottom;

	canvas.append("line")
		.attr("x1", LEFT)
		.attr("y1", BOTTOM + axesOffset)
		.attr("x2", RIGHT)
		.attr("y2", BOTTOM + axesOffset)
		.attr("stroke", "black")
		.attr("stroke-width", strokeWidth["axis"])
		.attr("id", "xAxis")
		.attr("class", "effectPlot");

	canvas.append("line")
		.attr("x1", LEFT - axesOffset)
		.attr("y1", BOTTOM)
		.attr("x2", LEFT - axesOffset)
		.attr("y2", TOP)
		.attr("stroke", "black")
		.attr("stroke-width", strokeWidth["axis"])
		.attr("id", "yAxis")
		.attr("class", "effectPlot");

	// Plot ticks
	var numberOfTicksInXAxis = levels.length;
	var numberOfTicksInYAxis = getNumberOfTicks(BOTTOM - TOP);

	plotTicksXAxis(LEFT, BOTTOM + axesOffset, RIGHT - LEFT, IV); 

	var yAxisTicks = new Array(); // Calculate yAxisTicks

	var DVMin = Array.min(variables[DV]["dataset"]);
	var DVMax = Array.max(variables[DV]["dataset"]);

	var DVStepSize = (DVMax - DVMin)/(numberOfTicksInYAxis - 1);

	for(var i = 0; i<=numberOfTicksInYAxis; i++)
		yAxisTicks.push(DVMin + i*DVStepSize);

	plotTicksYAxis(LEFT - axesOffset, BOTTOM, BOTTOM - TOP, yAxisTicks);

	// Define scale
	var scale = d3.scale.linear()
			.domain([DVMin, DVMax])
			.range([0, BOTTOM - TOP]);

	
	// Plot means
	for(var i=0; i<levels.length; i++)
	{
		var dist = variables[DV][levels[i]];

		if(dist.length == 0)
			continue;
		var m = mean(dist);	

		var xStepSize = (RIGHT - LEFT)/levels.length;
		var yStepSize = (BOTTOM - TOP)/(yAxisTicks.length - 1);	

		// Plot data points
		for(var j=0; j<dist.length; j++)
		{
			canvas.append("circle")
				.attr("cx", LEFT + i*xStepSize + xStepSize/2)
				.attr("cy", BOTTOM - scale(dist[j]))
				.attr("r", radius["effectPlot.data point"])
				.attr("fill", "black")
				.attr("class", "dataPoints");
		}

		var CI = findCI(dist);
		var CIWidth = 15;

		canvas.append("line")
			.attr("x1", LEFT + i*xStepSize + xStepSize/2)
			.attr("y1", BOTTOM - scale(CI[0]))
			.attr("x2", LEFT + i*xStepSize + xStepSize/2)
			.attr("y2", BOTTOM - scale(CI[1]))
			.attr("stroke", fillColor["CI"])
			.attr("stroke-width", strokeWidth["CI"])			
			.attr("id", getValidId(levels[i]))
			.attr("class", "effectPlotCIs");

		canvas.append("line")
			.attr("x1", LEFT + i*xStepSize + xStepSize/2 - CIWidth/2)
			.attr("y1", BOTTOM - scale(CI[0]))
			.attr("x2", LEFT + i*xStepSize + xStepSize/2 + CIWidth/2)
			.attr("y2", BOTTOM - scale(CI[0]))
			.attr("stroke", fillColor["CI"])
			.attr("stroke-width", strokeWidth["CI"])
			.attr("id", getValidId(levels[i]))
			.attr("class", "effectPlotCIs");

		canvas.append("line")
			.attr("x1", LEFT + i*xStepSize + xStepSize/2 - CIWidth/2)
			.attr("y1", BOTTOM - scale(CI[1]))
			.attr("x2", LEFT + i*xStepSize + xStepSize/2 + CIWidth/2)
			.attr("y2", BOTTOM - scale(CI[1]))
			.attr("stroke", fillColor["CI"])
			.attr("stroke-width", strokeWidth["CI"])
			.attr("id", getValidId(levels[i]))
			.attr("class", "effectPlotCIs");

		canvas.append("circle")
			.attr("cx", LEFT + i*xStepSize + xStepSize/2)
			.attr("cy", BOTTOM - scale(m)) 
			.attr("r", radius["effectPlot.mean"])
			.attr("fill", fillColor["mainEffect.mean"])
			.attr("id", getValidId(levels[i]))
			.attr("class", "effectPlotMeans");
		
	}

	// Draw lines through the means
	for(var i=0; i<levels.length -1; i++)
	{		
		var mean1 = d3.select("#" + getValidId(levels[i]) + ".effectPlotMeans");
		var mean2 = d3.select("#" + getValidId(levels[i+1]) + ".effectPlotMeans");

		canvas.append("line")
			.attr("x1", mean1.attr("cx"))
			.attr("y1", mean1.attr("cy"))
			.attr("x2", mean2.attr("cx"))
			.attr("y2", mean2.attr("cy"))
			.attr("stroke", "black");
	}
}

function plot2WayInteractionEffect(left, top, effectPlotWidth, effectPlotHeight, xAxisIV, colorIV)
{
	// Get canvas
	var canvas = d3.select("#effectPlotCanvas");

	// Get DV
	var variableList = getSelectedVariables();
	var DV = variableList["dependent"][0];

	// Get data
	var levelsForXAxis = variables[xAxisIV]["dataset"].unique();
	var levelsForColor = variables[colorIV]["dataset"].unique();

	// Plot axes
	var marginLeft = 60;
	var marginBottom = 75;
	var marginTop = 2.5*parseFloat(fontSizes["effect plot title"]);
	var marginRight = 75;

	var axesOffset = 15;

	var LEFT = left + marginLeft;
	var RIGHT = left + effectPlotWidth - marginRight;

	var TOP = top + marginTop;
	var BOTTOM = top + effectPlotHeight - marginBottom;

	canvas.append("line")
		.attr("x1", LEFT)
		.attr("y1", BOTTOM + axesOffset)
		.attr("x2", RIGHT)
		.attr("y2", BOTTOM + axesOffset)
		.attr("stroke", "black")
		.attr("stroke-width", strokeWidth["axis"])
		.attr("id", "xAxis")
		.attr("class", "effectPlot");

	canvas.append("line")
		.attr("x1", LEFT - axesOffset)
		.attr("y1", BOTTOM)
		.attr("x2", LEFT - axesOffset)
		.attr("y2", TOP)
		.attr("stroke", "black")
		.attr("stroke-width", strokeWidth["axis"])
		.attr("id", "yAxis")
		.attr("class", "effectPlot");

	// Plot ticks

	var numberOfTicksInXAxis = levelsForXAxis.length;
	var numberOfTicksInYAxis = getNumberOfTicks(BOTTOM - TOP);

	plotTicksXAxis(LEFT, BOTTOM + axesOffset, RIGHT - LEFT, xAxisIV); 

	var yAxisTicks = new Array(); // Calculate yAxisTicks

	var DVMin = Array.min(variables[DV]["dataset"]);
	var DVMax = Array.max(variables[DV]["dataset"]);

	var DVStepSize = (DVMax - DVMin)/(numberOfTicksInYAxis - 1);

	for(var i = 0; i<=numberOfTicksInYAxis; i++)
		yAxisTicks.push(DVMin + i*DVStepSize);

	plotTicksYAxis(LEFT - axesOffset, BOTTOM, BOTTOM - TOP, yAxisTicks);

	// Define scale
	var scale = d3.scale.linear()
			.domain([DVMin, DVMax])
			.range([0, BOTTOM - TOP]);
	
	// Plot means
	for(var i=0; i<levelsForXAxis.length; i++)
	{
		for(var j=0; j<levelsForColor.length; j++)
		{
			var dist = variables[DV].hasOwnProperty(levelsForXAxis[i] + "-" + levelsForColor[j]) ? variables[DV][levelsForXAxis[i] + "-" + levelsForColor[j]] : variables[DV][levelsForColor[j] + "-" + levelsForXAxis[i]];			

			if(dist.length == 0)
				continue;

			var m = mean(dist);

			var fillColor = colors[j];

			var xStepSize = (RIGHT - LEFT)/levelsForXAxis.length;
			var yStepSize = (BOTTOM - TOP)/(yAxisTicks.length - 1);

			var CI = findCI(dist);
			var CIWidth = 15;

			canvas.append("line")
				.attr("x1", LEFT + i*xStepSize + xStepSize/2)
				.attr("y1", BOTTOM - scale(CI[0]))
				.attr("x2", LEFT + i*xStepSize + xStepSize/2)
				.attr("y2", BOTTOM - scale(CI[1]))
				.attr("stroke", fillColor)
				.attr("stroke-width", strokeWidth["CI"])
				.attr("id", getValidId(levelsForXAxis[i] + "-" + levelsForColor[j]))
				.attr("class", "effectPlotCIs");

			canvas.append("line")
				.attr("x1", LEFT + i*xStepSize + xStepSize/2 - CIWidth/2)
				.attr("y1", BOTTOM - scale(CI[0]))
				.attr("x2", LEFT + i*xStepSize + xStepSize/2 + CIWidth/2)
				.attr("y2", BOTTOM - scale(CI[0]))
				.attr("stroke", fillColor)
				.attr("stroke-width", strokeWidth["CI"])
				.attr("id", getValidId(levelsForXAxis[i] + "-" + levelsForColor[j]))
				.attr("class", "effectPlotCIs");

			canvas.append("line")
				.attr("x1", LEFT + i*xStepSize + xStepSize/2 - CIWidth/2)
				.attr("y1", BOTTOM - scale(CI[1]))
				.attr("x2", LEFT + i*xStepSize + xStepSize/2 + CIWidth/2)
				.attr("y2", BOTTOM - scale(CI[1]))
				.attr("stroke", fillColor)
				.attr("stroke-width", strokeWidth["CI"])
				.attr("id", getValidId(levelsForXAxis[i] + "-" + levelsForColor[j]))
				.attr("class", "effectPlotCIs");	

			canvas.append("circle")
				.attr("cx", LEFT + i*xStepSize + xStepSize/2)
				.attr("cy", BOTTOM - scale(m)) 
				.attr("r", radius["effectPlot.mean"])
				.attr("id", getValidId(levelsForXAxis[i] + "-" + levelsForColor[j]))
				.attr("fill", fillColor)
				.attr("class", "effectPlotMeans" + levelsForColor[j]);		
		}
	}

	// Draw lines through the means
	for(var i=0; i<levelsForColor.length; i++)
	{
		for(var j=0; j<levelsForXAxis.length - 1; j++)
		{
			var mean1 = d3.select("#" + getValidId(levelsForXAxis[j] + "-" + levelsForColor[i]) + ".effectPlotMeans" + levelsForColor[i]);
			var mean2 = d3.select("#" + getValidId(levelsForXAxis[j+1] + "-" + levelsForColor[i]) + ".effectPlotMeans" + levelsForColor[i]);

			canvas.append("line")
				.attr("x1", mean1.attr("cx"))
				.attr("y1", mean1.attr("cy"))
				.attr("x2", mean2.attr("cx"))
				.attr("y2", mean2.attr("cy"))
				.attr("stroke", colors[i]);
		}		
	}

	drawLegendInEffectPlot(RIGHT, TOP, colorIV);
}

function plot3WayInteractionEffect(left, top, effectPlotWidth, effectPlotHeight, xAxisIV, colorIV, theOtherIV)
{
	// Get canvas
	var canvas = d3.select("#effectPlotCanvas");
	var clickablesOnTopHeight = 30;

	// Get DV
	var variableList = getSelectedVariables();
	var DV = variableList["dependent"][0];

	// Get data
	var levelsForXAxis = variables[xAxisIV]["dataset"].unique();
	var levelsForColor = variables[colorIV]["dataset"].unique();
	var otherLevels = variables[theOtherIV]["dataset"].unique();

	// Plot axes
	var marginLeft = 60;
	var marginBottom = 75;
	var marginTop = 2.5*parseFloat(fontSizes["effect plot title"]);
	var marginRight = 75;

	var axesOffset = 15;

	var LEFT = left + marginLeft;
	var RIGHT = left + effectPlotWidth - marginRight;

	var TOP = top + marginTop + clickablesOnTopHeight;
	var BOTTOM = top + effectPlotHeight - marginBottom;

	canvas.append("line")
		.attr("x1", LEFT)
		.attr("y1", BOTTOM + axesOffset)
		.attr("x2", RIGHT)
		.attr("y2", BOTTOM + axesOffset)
		.attr("stroke", "black")
		.attr("stroke-width", strokeWidth["axis"])
		.attr("id", "xAxis")
		.attr("class", "effectPlot");

	canvas.append("line")
		.attr("x1", LEFT - axesOffset)
		.attr("y1", BOTTOM)
		.attr("x2", LEFT - axesOffset)
		.attr("y2", TOP)
		.attr("stroke", "black")
		.attr("stroke-width", strokeWidth["axis"])
		.attr("id", "yAxis")
		.attr("class", "effectPlot");

	// Plot ticks
	var numberOfTicksInXAxis = levelsForXAxis.length;
	var numberOfTicksInYAxis = getNumberOfTicks(BOTTOM - TOP);	

	plotTicksXAxis(LEFT, BOTTOM + axesOffset, (RIGHT - LEFT), xAxisIV); 

	var yAxisTicks = new Array(); // Calculate yAxisTicks

	var DVMin = Array.min(variables[DV]["dataset"]);
	var DVMax = Array.max(variables[DV]["dataset"]);

	var DVStepSize = (DVMax - DVMin)/(numberOfTicksInYAxis - 1);

	for(var i = 0; i<=numberOfTicksInYAxis; i++)
		yAxisTicks.push(DVMin + i*DVStepSize);

	plotTicksYAxis(LEFT - axesOffset, BOTTOM, (BOTTOM - TOP), yAxisTicks);

	// Define scale
	var scale = d3.scale.linear()
			.domain([DVMin, DVMax])
			.range([0, (BOTTOM - TOP)]);
	
	// Plot means
	for(var i=0; i<levelsForXAxis.length; i++)
	{
		for(var j=0; j<levelsForColor.length; j++)
		{
			for(var k=0; k<otherLevels.length; k++)
			{
				var dist;

				if(variables[DV].hasOwnProperty(levelsForXAxis[i] + "-" + levelsForColor[j] + "-" + otherLevels[k]))
					dist = variables[DV][levelsForXAxis[i] + "-" + levelsForColor[j] + "-" + otherLevels[k]];
				if(variables[DV].hasOwnProperty(levelsForXAxis[i] + "-" + otherLevels[k] + "-" + levelsForColor[j]))
					dist = variables[DV][levelsForXAxis[i] + "-" + otherLevels[k] + "-" + levelsForColor[j]];
				if(variables[DV].hasOwnProperty(levelsForColor[j] + "-" + levelsForXAxis[i] + "-" + otherLevels[k]))
					dist = variables[DV][levelsForColor[j] + "-" + levelsForXAxis[i] + "-" + otherLevels[k]];
				if(variables[DV].hasOwnProperty(levelsForColor[j] + "-" + otherLevels[k] + "-" + levelsForXAxis[i]))
					dist = variables[DV][levelsForColor[j] + "-" + otherLevels[k] + "-" + levelsForXAxis[i]];
				if(variables[DV].hasOwnProperty(otherLevels[k] + "-" + levelsForXAxis[i] + "-" + levelsForColor[j]))
					dist = variables[DV][otherLevels[k] + "-" + levelsForXAxis[i] + "-" + levelsForColor[j]];
				if(variables[DV].hasOwnProperty(otherLevels[k] + "-" + levelsForColor[j] + "-" + levelsForXAxis[i]))
					dist = variables[DV][otherLevels[k] + "-" + levelsForColor[j] + "-" + levelsForXAxis[i]];				

				if(dist.length == 0)
					continue;

				var m = mean(dist);

				var fillColor = colors[j];

				var xStepSize = (RIGHT - LEFT)/levelsForXAxis.length;
				var yStepSize = (BOTTOM - TOP)/(yAxisTicks.length - 1);			

				var meanOpacity = k == 0 ? 1.0 : 0.2;				

				var CI = findCI(dist);
				var CIWidth = 15;

				canvas.append("line")
					.attr("x1", LEFT + i*xStepSize + xStepSize/2)
					.attr("y1", BOTTOM - scale(CI[0]))
					.attr("x2", LEFT + i*xStepSize + xStepSize/2)
					.attr("y2", BOTTOM - scale(CI[1]))
					.attr("stroke", fillColor)
					.attr("stroke-width", strokeWidth["CI"])
					.attr("id", getValidId(levelsForXAxis[i] + "-" + levelsForColor[j] + "-" + otherLevels[k]))
					.attr("data-animate", otherLevels[k])
					.attr("opacity", meanOpacity)
					.attr("class", "effectPlotCIs");

				canvas.append("line")
					.attr("x1", LEFT + i*xStepSize + xStepSize/2 - CIWidth/2)
					.attr("y1", BOTTOM - scale(CI[0]))
					.attr("x2", LEFT + i*xStepSize + xStepSize/2 + CIWidth/2)
					.attr("y2", BOTTOM - scale(CI[0]))
					.attr("stroke", fillColor)
					.attr("stroke-width", strokeWidth["CI"])
					.attr("id", getValidId(levelsForXAxis[i] + "-" + levelsForColor[j] + "-" + otherLevels[k]))
					.attr("data-animate", otherLevels[k])
					.attr("opacity", meanOpacity)
					.attr("class", "effectPlotCIs");

				canvas.append("line")
					.attr("x1", LEFT + i*xStepSize + xStepSize/2 - CIWidth/2)
					.attr("y1", BOTTOM - scale(CI[1]))
					.attr("x2", LEFT + i*xStepSize + xStepSize/2 + CIWidth/2)
					.attr("y2", BOTTOM - scale(CI[1]))
					.attr("stroke", fillColor)
					.attr("stroke-width", strokeWidth["CI"])
					.attr("id", getValidId(levelsForXAxis[i] + "-" + levelsForColor[j] + "-" + otherLevels[k]))
					.attr("data-animate", otherLevels[k])
					.attr("opacity", meanOpacity)					
					.attr("class", "effectPlotCIs");

				canvas.append("circle")
					.attr("cx", LEFT + i*xStepSize + xStepSize/2)
					.attr("cy", BOTTOM - scale(m)) 
					.attr("r", radius["effectPlot.mean"])
					.attr("id", getValidId(levelsForXAxis[i] + "-" + levelsForColor[j] + "-" + otherLevels[k]))
					.attr("fill", fillColor)
					.attr("data-animate", otherLevels[k])
					.attr("opacity", meanOpacity)
					.attr("class", "effectPlotMeans" + levelsForColor[j]);
			}
		}
	}

	// Draw lines through the means
	for(var i=0; i<levelsForColor.length; i++)
	{
		for(var j=0; j<levelsForXAxis.length - 1; j++)
		{
			for(var k=0; k<otherLevels.length; k++)
			{
				var mean1 = d3.select("#" + getValidId(levelsForXAxis[j] + "-" + levelsForColor[i] + "-" + otherLevels[k]) + ".effectPlotMeans" + levelsForColor[i]);
				var mean2 = d3.select("#" + getValidId(levelsForXAxis[j+1] + "-" + levelsForColor[i] + "-" + otherLevels[k]) + ".effectPlotMeans" + levelsForColor[i]);

				var lineOpacity = k == 0? 1.0 : 0.2;

				canvas.append("line")
					.attr("x1", mean1.attr("cx"))
					.attr("y1", mean1.attr("cy"))
					.attr("x2", mean2.attr("cx"))
					.attr("y2", mean2.attr("cy"))
					.attr("stroke", colors[i])
					.attr("opacity", lineOpacity)
					.attr("data-animate", otherLevels[k])
					.attr("id", getValidId(levelsForXAxis[i] + "-" + levelsForColor[j] + "-" + otherLevels[k]))
					.attr("class", "effectPlotLines" + levelsForColor[j])
			}
		}		
	}

	// Add legend
	drawLegendInEffectPlot(RIGHT, TOP, colorIV);


	setTimeout(function()
	{
		// Add clickables on top
		var currentLeft = (LEFT + RIGHT)/2;
		var margin = 5;		

		for(var i=0; i<otherLevels.length; i++)
		{
			var stepSize = 25;		

			var boundingBox = getBoundingBoxForText(currentLeft + margin, top + clickablesOnTopHeight/2 + margin + parseFloat(fontSizes["effect plot legend"])*1.5, otherLevels[i], canvas);
			var fillColor = i == 0 ? "lightgrey" : "white";
			var textColor = i == 0 ? "white" : "black";

			if(i ==0)
			{
				canvas.append("text")	
					.attr("x", (LEFT + RIGHT)/2 - margin)
					.attr("y", margin + boundingBox.y + boundingBox.height/2 + parseFloat(fontSizes["effect plot legend title"])/2)
					.attr("text-anchor", "end")
					.attr("font-size", fontSizes["effect plot legend title"])
					.attr("fill", "blue")
					.text(theOtherIV);
			}

			canvas.append("rect")
				.attr("x", boundingBox.x + stepSize)
				.attr("y", boundingBox.y + margin)
				.attr("width", boundingBox.width)
				.attr("height", boundingBox.height)
				.attr("stroke", "lightgrey")
				.attr("id", getValidId(otherLevels[i]))
				.attr("class", "clickablesButton")
				.attr("fill", fillColor);

			canvas.append("text")
				.attr("x", boundingBox.x + stepSize + boundingBox.width/2)
				.attr("y", boundingBox.y + margin + boundingBox.height/2 + parseFloat(fontSizes["effect plot legend"])/2)
				.attr("text-anchor", "middle")
				.attr("font-size", fontSizes["effect plot legend"])
				.attr("fill", textColor)
				.text(otherLevels[i])
				.attr("id", getValidId(otherLevels[i]))
				.attr("class", "clickablesText");

			currentLeft = currentLeft + boundingBox.width;
		}
	}, 800);	

	// ToDo: Animate the graph
	
	// for(k = 0; k<otherLevels.length; k++)
	// {
	// 	setInterval(function(){
		
	// 		setTimeout(function()
	// 		{

	// 			$('*[data-animate=' + otherLevels[k] + ']').animate({
	// 					opacity: 1.0
	// 				}, 750);
				
	// 			for(i=0; i<otherLevels.length; i++)
	// 			{
	// 				if(i != k)
	// 				{
	// 					$('*[data-animate=' + otherLevels[i] + ']').animate({
	// 						opacity: 0.1
	// 					}, 750);
	// 				}
	// 			}
	// 		}, 750*otherLevels.length);
	// 	}, 2*750*otherLevels.length);	
	// }
}

function drawLegendInEffectPlot(left, top, IV)
{
	var levels = variables[IV]["dataset"].unique();

	var margin = 10;
	var topOffset = 15;

	top = top + topOffset;

	var canvas = d3.select("#effectPlotCanvas");
	var legendSize = parseFloat(radius["effectPlot.mean"]); 

	canvas.append("text")
		.attr("x", left + margin + legendSize/2 + margin)
		.attr("y", top - topOffset)
		.attr("font-size", fontSizes["effect plot legend title"])
		.attr("fill", "blue")
		.attr("text-anchor", "middle")
		.text(IV);

	for(var i=0; i<levels.length; i++)
	{
		// ToDo: Have legends clickable 

		canvas.append("circle")
			.attr("cx", left + margin + legendSize/2)
			.attr("cy", top + margin + i*(legendSize + margin))
			.attr("r", legendSize)
			.attr("fill", colors[i])			
			.attr("class", "effectPlotLegends");

		canvas.append("text")
			.attr("x", left + margin + legendSize + margin)
			.attr("y", top + margin + i*(legendSize + margin) + legendSize/2)// - parseFloat(fontSizes["effect plot legend"])/2)
			.attr("font-size", fontSizes["effect plot legend"])
			.attr("text-anchor", "start")
			.text(levels[i])
			.attr("class", "effectPlotLegends");
	}
}

function plotTicksXAxis(x, y, size, IV)
{
	var canvas = d3.select("#effectPlotCanvas");
	var levels = variables[IV]["dataset"].unique();

	canvas.append("text")
		.attr("x", x + size/2)
		.attr("y", y + tickLength + parseFloat(fontSizes["tick"])*4)
		.attr("font-size", fontSizes["effect plot legend title"])
		.attr("text-anchor", "middle")
		.attr("fill", "blue")
		.text(IV);

	for(var i=0; i<levels.length; i++)
	{
		canvas.append("line")
			.attr("x1", x + (i*size)/levels.length + (size/levels.length)/2)
			.attr("y1", y)
			.attr("x2", x + (i*size)/levels.length + (size/levels.length)/2)
			.attr("y2", y + tickLength)
			.attr("stroke", "black")
			.attr("stroke-width", strokeWidth["tick"]);	

		canvas.append("text")
			.attr("x", x + (i*size)/levels.length + (size/levels.length)/2)
			.attr("y", y + tickLength + parseFloat(fontSizes["tick"])*1.5)
			.attr("text-anchor", "middle")
			.attr("font-size", fontSizes["tick"])
			.text(levels[i]);	
	}
}

function plotTicksYAxis(x, y, size, tickText)
{
	var canvas = d3.select("#effectPlotCanvas");

	for(var i=0; i<tickText.length; i++)
	{
		canvas.append("line")
			.attr("x1", x - tickLength)
			.attr("y1", y - (i*size)/(tickText.length-1))
			.attr("x2", x)
			.attr("y2", y - (i*size)/(tickText.length-1))
			.attr("stroke", "black")	
			.attr("stroke-width", strokeWidth["tick"]);	

		canvas.append("text")
			.attr("x", x - tickLength - 0.5*parseFloat(fontSizes["tick"]))
			.attr("y", y - (i*size)/(tickText.length-1) + parseFloat(fontSizes["tick"])/2)
			.attr("text-anchor", "end")
			.attr("font-size", fontSizes["tick"])
			.text(dec2(tickText[i]));
	}
}

/**
 * Draws the navigation buttons that are used to switch between different levels of effect
 * @param  {string} direction  [the direction of the arrow]
 * @param  {string} effectType [{main, 2-way interaction, 3-way interaction}]
 * @return {none}            
 */
function drawEffectNavigationButton(direction, effectType)
{
    var canvas = d3.select("#effectPlotCanvas");

    if(direction == "top")
    {    	
    	canvas.append("rect")
    		.attr("x", plotPanelWidth/2 - config.interactionEffect.navigationButton.width/2)
    		.attr("y", 0)
    		.attr("width", config.interactionEffect.navigationButton.width)
    		.attr("height", config.interactionEffect.navigationButton.height)
    		.attr("rx", "5px")
    		.attr("ry", "5px")
    		.attr("fill", "url(#buttonFillNormal)")
    		.attr("filter", "url(#Bevel)")
    		.attr("stroke", "black")
    		.attr("id", effectType)
    		.attr("class", "navigationArrowEffects");

    	canvas.append("text")
    		.attr("x", plotPanelWidth/2 + config.interactionEffect.navigationButton.arrowSize)
    		.attr("y", config.interactionEffect.navigationButton.height/2 + parseFloat(fontSizes["button label"])/2)
    		.attr("width", config.interactionEffect.navigationButton.width - config.interactionEffect.navigationButton.arrowSize)
    		.attr("height", config.interactionEffect.navigationButton.height)
    		.attr("font-size", fontSizes["button label"])
    		.attr("text-anchor", "middle")
    		.attr("fill", "black")
    		.attr("id", effectType)
    		.attr("class", "navigationArrowEffects")
    		.text(effectType);

	canvas.append("image")
	            .attr("x", config.interactionEffect.navigationButton.padding + plotPanelWidth/2 - config.interactionEffect.navigationButton.width/2)
	            .attr("y", config.interactionEffect.navigationButton.height/2 - config.interactionEffect.navigationButton.arrowSize/2)
	            .attr("xlink:href", "images/arrow_top.png")
	            .attr("width", config.interactionEffect.navigationButton.arrowSize)
	            .attr("height", config.interactionEffect.navigationButton.arrowSize)
	            .attr("id", effectType)
	            .attr("class", "navigationArrowEffects");
    }
    else if(direction == "bottom")
    {
    	canvas.append("rect")
    		.attr("x", plotPanelWidth/2 - config.interactionEffect.navigationButton.width/2)
    		.attr("y", height - resultsPanelHeight - assumptionsPanelHeight - config.interactionEffect.navigationButton.height)
    		.attr("width", config.interactionEffect.navigationButton.width)
    		.attr("height", config.interactionEffect.navigationButton.height)
    		.attr("rx", "5px")
    		.attr("ry", "5px")
    		.attr("fill", "url(#buttonFillNormal)")
    		.attr("filter", "url(#Bevel)")
    		.attr("stroke", "black")
    		.attr("id", effectType)
    		.attr("class", "navigationArrowEffects");

    	canvas.append("text")
    		.attr("x", plotPanelWidth/2 + config.interactionEffect.navigationButton.arrowSize)
    		.attr("y", height - resultsPanelHeight - assumptionsPanelHeight - config.interactionEffect.navigationButton.height + config.interactionEffect.navigationButton.height/2 + parseFloat(fontSizes["button label"])/2)
    		.attr("width", config.interactionEffect.navigationButton.width - config.interactionEffect.navigationButton.arrowSize)
    		.attr("height", config.interactionEffect.navigationButton.height)
    		.attr("font-size", fontSizes["button label"])
    		.attr("text-anchor", "middle")
    		.attr("fill", "black")
    		.attr("id", effectType)
    		.attr("class", "navigationArrowEffects")
    		.text(effectType);

	canvas.append("image")
	            .attr("x", config.interactionEffect.navigationButton.padding + plotPanelWidth/2 - config.interactionEffect.navigationButton.width/2)
	            .attr("y", height - resultsPanelHeight - assumptionsPanelHeight - config.interactionEffect.navigationButton.height + config.interactionEffect.navigationButton.height/2 - config.interactionEffect.navigationButton.arrowSize/2)
	            .attr("xlink:href", "images/arrow_down.png")
	            .attr("width", config.interactionEffect.navigationButton.arrowSize)
	            .attr("height", config.interactionEffect.navigationButton.arrowSize)
	            .attr("id", effectType)
	            .attr("class", "navigationArrowEffects");
    }
}

/**
 * Plots the y-axis label (which is common for all the interaction plots)
 * @param  {float} cx x-center
 * @param  {float} cy y-center
 * @return {none}   
 */
function plotYAxisLabelForInteractionPlots(cx, cy)
{
	var canvas = d3.select("#effectPlotCanvas");

	var variableList = sort(selectedVariables);
	var labelText = variableList["dependent"][0];

	canvas.append("text")
		.attr("x", cx)
		.attr("y", cy)
		.attr("text-anchor", "middle")
		.attr("font-size", fontSizes["effect plot legend title"])
		.attr("fill", "blue")
		.attr("transform", "rotate(-90 " + cx + " " + cy + ")")
		.attr("id", "yAxisLabel")
		.text(labelText);
}