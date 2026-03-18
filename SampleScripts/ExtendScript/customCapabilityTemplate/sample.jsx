/*************************************************************************
 * InDesign API — Custom capability TEMPLATE (ExtendScript)
 *
 * You normally only edit: capabilityLogic.jsx
 *
 * This file wires: parse parameters → working folder → logging → your
 * logic → success/failure JSON → upload log + outputs.
 *************************************************************************/

// @include "errors.jsx"
// @include "json2.jsx"
// @include "utils.jsx"
// @include "capabilityLogic.jsx"

/* globals app, Errors, MeasurementUnits, PageNumberingOptions, UTILS */

var KeyStrings = {
  ProcessedData: 'processedData',
  Timings: 'timings',
  WorkingFolder: 'workingFolder'
}

var timingObject = {}
var customerDocument = null

function collectDocumentWarnings (document) {
  var warningsObject = {}
  var missingLinkArray = []
  var missingFontArray = []
  var otherWarningsArray = []
  var missingLinkStr = '(Link missing.; '
  var missingLinkStrLen = missingLinkStr.length
  var errorlog = app.errorListErrors
  var i
  var error
  var missingLink
  var missingFont
  for (i = 0; i < errorlog.count(); i++) {
    error = errorlog[i]
    if (error.listErrorCode === 35842) {
      missingLink = error.listErrorMessage
      missingLink = missingLink.substring(missingLink.indexOf(missingLinkStr) + missingLinkStrLen)
      if (missingLinkArray.indexOf(missingLink) === -1) {
        missingLinkArray.push(missingLink)
      }
    } else if (error.listErrorCode === 1 && error.listErrorMessage.search(/missing font/i) !== -1) {
      missingFont = error.listErrorMessage
      missingFont = missingFont.substring(error.listErrorMessage.search(/missing font/i) + 13)
      if (missingFontArray.indexOf(missingFont) === -1) {
        missingFontArray.push(missingFont)
      }
    } else if (error.listErrorCode === 1) {
      otherWarningsArray.push(error.listErrorMessage)
    }
  }
  if (missingLinkArray.length > 0) {
    warningsObject.missingLinks = missingLinkArray
  }
  if (missingFontArray.length > 0) {
    warningsObject.missingFonts = missingFontArray
  }
  if (otherWarningsArray.length > 0) {
    warningsObject.otherWarnings = otherWarningsArray
  }
  return warningsObject
}

function main () {
  var startTime = (new Date()).getTime()
  var returnObj = {}
  var parameters = {}
  var errorOccurred = false
  var data = {}
  var allParameters = {}
  var result
  var warnings = {}
  var previousUnit = app.scriptPreferences.measurementUnit

  app.clearAllErrors()
  app.generalPreferences.pageNumbering = PageNumberingOptions.ABSOLUTE
  app.linkingPreferences.checkLinksAtOpen = true
  if (app.serverSettings && app.serverSettings.useErrorList !== undefined) {
    app.serverSettings.useErrorList = true
  }
  app.scriptPreferences.measurementUnit = MeasurementUnits.POINTS

  try {
    UTILS.InitiateLogging()
    UTILS.Log('Custom capability template — job starting')
    UTILS.CloseAllOpenDocuments()

    var input = app.scriptArgs.get('parameters')
    allParameters = JSON.parse(input)
    UTILS.Log('Raw parameters length: ' + (input && input.length))

    parameters = allParameters.params
    if (parameters === undefined && allParameters.input) {
      parameters = allParameters.input.params
    }
    if (parameters === undefined || typeof parameters !== 'object' || Array.isArray(parameters)) {
      UTILS.RaiseException(Errors.MissingParams)
    }

    UTILS.SetWorkingFolder(UTILS.GetStringFromObject(allParameters, KeyStrings.WorkingFolder))

    var jobId = allParameters.jobID || allParameters.jobId || ''
    var context = {
      jobId: jobId,
      workingFolder: UTILS.workingFolder,
      setActiveDocument: function (doc) {
        customerDocument = doc
      }
    }

    var t0 = (new Date()).getTime()
    result = runCapability(parameters, context)
    timingObject.customerRunMs = (new Date()).getTime() - t0

    if (customerDocument && customerDocument.isValid && app.errorListErrors.count() > 0) {
      warnings = collectDocumentWarnings(customerDocument)
    }

    data[KeyStrings.ProcessedData] = result || {}
    data.warnings = warnings
  } catch (e) {
    errorOccurred = true
    returnObj = UTILS.HandleError({
      name: e.name,
      message: e.message,
      errorCode: e.number,
      isCustom: e.isCustom,
      line: e.line,
      fileName: e.fileName
    })
  } finally {
    if (customerDocument && customerDocument.isValid) {
      try {
        customerDocument.close(SaveOptions.NO)
      } catch (closeErr) {
        UTILS.Log('Document close: ' + closeErr)
      }
    }
    app.scriptPreferences.measurementUnit = previousUnit
    timingObject.overallMs = (new Date()).getTime() - startTime
    data[KeyStrings.Timings] = timingObject

    // Always upload log file so caller can inspect what happened (success or failure).
    UTILS.AddAssetToBeUploaded(UTILS.logFilePath)

    if (!errorOccurred) {
      returnObj = UTILS.GetSuccessReturnObj(data)
    }
    UTILS.TerminateLogging()
    try {
      app.clearAllErrors()
    } catch (ignore) {}

    return UTILS.GetFinalReturnPackage(returnObj)
  }
}

main()
