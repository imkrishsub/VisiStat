VisiStat
=======

VisiStat is a tool that allows users to do statistical analysis by interacting with visualizations. It guides the user to select appropriate statistical analysis tasks based on her research questions. It also prevents common statistical analysis mistakes and promotes understanding by collocating appropriate visualizations with statistical analysis results.

Homepage
========

http://hci.rwth-aachen.de/visistat/

Installation
===
1. Install R (http://www.r-project.org/)
2. Install required packages: Launch R (GUI or commandline) and execute script in setup/installPackages.R
3. Launch VisiStat server by executing the following commands in R. Replace PATH_ABOVE_VISISTAT with the parent path of this folder. E.g., if the path of this README.md is "/Document/VisiStat/README.md", PATH_ABOVE_VISISTAT should be replaced by "/Document/":
	  setwd("PATH_ABOVE_VISISTAT")
   	library(devtools)
   	library(opencpu)
   	install("VisiStat")


Running
====
After VisiStat is installed, you can run VisiStat using the following command in R.
	setwd("PATH_ABOVE_VISISTAT")
   	library(devtools)
   	library(opencpu)
	opencpu$browse("library/VisiStat/www")
