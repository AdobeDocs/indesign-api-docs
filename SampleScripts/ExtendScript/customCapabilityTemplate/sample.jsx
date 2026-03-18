/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2026 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 **************************************************************************/

// Custom Capability Template - sample.jsx
// For InDesign Server: there is no reliable "active document" — always open the job document
// via params.targetDocument (see Application / Document in the ExtendScript object model).
// Add your logic in capabilityLogic.jsx.

// @include "errors.jsx"
// @include "json2.jsx"
// @include "utils.jsx"
// @include "capabilityLogic.jsx"
// File inclusion ends.

/* globals app, Errors, File, MeasurementUnits, PageNumberingOptions, UTILS */

// Globals: define any globals here.
var timingObject = {}
var warnings = {}
var document
// Globals end.

// Constant strings
var KeyStrings = {
  OutputPath: 'outputPath',
  ProcessedData: 'processedData',
  TargetDocument: 'targetDocument',
  TimeDocumentClose: 'DocumentClose',
  TimeDocumentOpen: 'DocumentOpen',
  TimeProcessing: 'TimeProcessing',
  TimeOverall: 'Overall',
  TimeRelinkAssets: 'RelinkAssets',
  Timings: 'timings',
  WorkingFolder: 'workingFolder'
}

/* Collects document warnings (missing links, fonts, etc.) into an object for the response. */
function handleWarnings (doc) {
  UTILS.Log('Handling warnings')
  var errorlog = app.errorListErrors
  var warningsObject = {}
  var missingLinkArray = []
  var missingFontArray = []
  var otherWarningsArray = []
  var missingLinkStr = '(Link missing.; '
  var missingLinkStrLen = missingLinkStr.length

  for (var i = 0; i < errorlog.count(); i++) {
    var error = errorlog[i]
    UTILS.Log('Warning No. ' + (i + 1) + ': ' + error.listErrorCode + '(' + error.listErrorMessage + ')')
    if (error.listErrorCode === 35842) {
      var missingLink = error.listErrorMessage
      missingLink = missingLink.substring(missingLink.indexOf(missingLinkStr) + missingLinkStrLen)
      if (missingLinkArray.indexOf(missingLink) === -1) {
        missingLinkArray.push(missingLink)
      }
    } else if (error.listErrorCode === 1 && error.listErrorMessage.search(/missing font/i) !== -1) {
      var missingFont = error.listErrorMessage
      missingFont = missingFont.substring(missingFont.search(/missing font/i) + 13)
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

function ProcessParams (parameters, allParameters) {
  UTILS.Log('Processing parameters internal')
  var returnVal = {}

  // Open the target document (required on InDesign Server)
  var documentPath = UTILS.GetStringFromObject(parameters, KeyStrings.TargetDocument)
  documentPath = UTILS.GetFullPath(documentPath)

  UTILS.Log('Opening document')
  var tempTime = new Date().getTime()
  document = app.open(File(documentPath))
  timingObject[KeyStrings.TimeDocumentOpen] = (new Date()).getTime() - tempTime
  UTILS.Log('Opened document')

  tempTime = new Date().getTime()
  UTILS.UpdateDocumentLinks(document)
  timingObject[KeyStrings.TimeRelinkAssets] = (new Date()).getTime() - tempTime
  UTILS.Log('Updated links in the document')

  UTILS.Log('Number of errors: ' + app.errorListErrors.count())
  if (app.errorListErrors.count() > 0) {
    warnings = handleWarnings(document)
  }
  app.clearAllErrors()
  UTILS.Log('Got the warnings from the document.')

  tempTime = new Date().getTime()

  // Execute your capability logic (implement in capabilityLogic.jsx)
  CAPABILITY.run(document, parameters, allParameters, returnVal)

  timingObject[KeyStrings.TimeProcessing] = (new Date()).getTime() - tempTime

  return returnVal
}

function main () {
  var startTime = new Date().getTime()
  var returnObj = {}
  var parameters = {}
  var tempTime
  var errorOccurred = false
  var data = {}

  app.clearAllErrors()
  app.generalPreferences.pageNumbering = PageNumberingOptions.ABSOLUTE
  app.linkingPreferences.checkLinksAtOpen = true
  app.serverSettings.useErrorList = true
  var previousUnit = app.scriptPreferences.measurementUnit
  app.scriptPreferences.measurementUnit = MeasurementUnits.POINTS

  try {
    UTILS.InitiateLogging()
    UTILS.Log('Initiating logging.')

    UTILS.CloseAllOpenDocuments()

    var input = app.scriptArgs.get('parameters')
    var allParameters = JSON.parse(input)

    UTILS.Log('Parsed job input : ' + input)
    parameters = allParameters.params
    if (parameters === undefined) {
      parameters = allParameters.input.params
    }

    if (parameters === undefined || typeof parameters !== 'object' || Array.isArray(parameters)) {
      UTILS.Log('No params found')
      UTILS.RaiseException(Errors.MissingParams)
    }

    UTILS.SetWorkingFolder(UTILS.GetStringFromObject(allParameters, KeyStrings.WorkingFolder))

    var result
    UTILS.Log('Processing Params')
    tempTime = new Date().getTime()
    result = ProcessParams(parameters, allParameters)
    data[KeyStrings.ProcessedData] = result

    UTILS.AddAssetToBeUploaded(UTILS.logFilePath)

    data.warnings = warnings

    tempTime = new Date().getTime()
    if (document && document.isValid) {
      document.close()
    }

    timingObject[KeyStrings.TimeDocumentClose] = (new Date()).getTime() - tempTime
    UTILS.Log('End of try')
  } catch (e) {
    var tempObj = {
      name: e.name,
      message: e.message,
      errorCode: e.number,
      isCustom: e.isCustom,
      line: e.line,
      fileName: e.fileName
    }
    UTILS.Log('Exception occurred', tempObj)
    errorOccurred = true
    returnObj = UTILS.HandleError(tempObj)
  } finally {
    app.scriptPreferences.measurementUnit = previousUnit
    UTILS.Log('In finally')
    if (document && document.isValid) {
      UTILS.Log('Closing document')
      tempTime = new Date().getTime()
      document.close()
      timingObject[KeyStrings.TimeDocumentClose] = (new Date()).getTime() - tempTime
    }

    var elapsedTime = (new Date()).getTime() - startTime
    UTILS.Log('Time taken: ' + elapsedTime)
    timingObject[KeyStrings.TimeOverall] = elapsedTime
    UTILS.Log('Timing: ' + JSON.stringify(timingObject))
    data[KeyStrings.Timings] = timingObject

    if (!errorOccurred) {
      UTILS.Log('Finally: No error')
      returnObj = UTILS.GetSuccessReturnObj(data)
    }
    UTILS.Log('Final Result', JSON.stringify(returnObj))

    UTILS.TerminateLogging()
    app.clearAllErrors()

    return UTILS.GetFinalReturnPackage(returnObj)
  }
}

main()
