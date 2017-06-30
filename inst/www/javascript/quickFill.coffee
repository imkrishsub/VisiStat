quickFill = (name, role, datatype) ->
  roleID = "#" + name + ".role"
  dataTypeID = "#" + name + ".datatype"
  roleID = roleID.replace(/\./g, "\\.")
  dataTypeID = dataTypeID.replace(/\./g, "\\.")
  $(roleID).val role
  $(dataTypeID).val datatype
  return


# Simon's Tapping_final_summarized.csv
simonTapping = ->
  quickFill "User", "ID", "nominal"
  quickFill "Mean.TimeDelta.", "DV", "ratio"
  return


# Simon's Dragging_new_summarized.csv
simonDragging = ->
  quickFill "Username", "ID", "nominal"
  quickFill "Mean.PathLength.", "DV", "ratio"    
  quickFill "Mean.time.", "DV", "ratio"
  return

# Simon's CrossDragging.csv
simonCrossDragging = ->
  quickFill "User", "ID", "nominal"
  quickFill "deltaAngle", "IV", "ordinal"
  quickFill "Time", "DV", "ratio"
  quickFill "vTime", "DV", "ratio"
  quickFill "hTime", "DV", "ratio"
  quickFill "selTime", "DV", "ratio"
  quickFill "switchTime", "DV", "ratio"
  quickFill "Length", "DV", "ratio"
  quickFill "hLength", "DV", "ratio"
  quickFill "vLength", "DV", "ratio"
  quickFill "selLength", "DV", "ratio"
  return


# export functions to be used globally
root = exports ? this
root.VisiStat ?= {}
root.VisiStat.quickFill ?= {}
root.VisiStat.quickFill.simonDragging = simonDragging
root.VisiStat.quickFill.simonTapping = simonTapping
root.VisiStat.quickFill.simonCrossDragging = simonCrossDragging