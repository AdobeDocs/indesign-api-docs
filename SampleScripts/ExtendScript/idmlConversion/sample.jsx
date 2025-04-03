/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
* Copyright 2025 Adobe
* All Rights Reserved.
*
* NOTICE: All information contained herein is, and remains
* the property of Adobe and its suppliers, if any. The intellectual
* and technical concepts contained herein are proprietary to Adobe
* and its suppliers and are protected by all applicable intellectual
* property laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe.
**************************************************************************/

// Example.jsx
// This is a sample script which exports idml from an InDesign document. The expected input is as follows:
// "params": {
//   "targetDocument": "doc.indd",
//   "outputPath": "idmlDoc.idml",
//   "generalSettings": {
//     "appLogs": {
//       "logsRelativePath": "appLog.txt"
//     }
//   }
// }

// Following are the file inclusions and not comments.
// @include "errors.jsx"
// @include "json2.jsx"
// @include "utils.jsx"
// File inclusion ends.

/* globals app, Errors, ExportFormat, MeasurementUnits, PageNumberingOptions, UTILS */

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
  TimeExportIDML: 'ExportIDML',
  TimeOverall: 'Overall',
  TimeRelinkAssets: 'RelinkAssets',
  Timings: 'timings',
  WorkingFolder: 'workingFolder'
}
// Constant strings end

function handleWarnings (document) {
  UTILS.Log('Handling warnings')
  var errorlog = app.errorListErrors
  var warningsObject = {}

  var missingLinkArray = []
  var missingFontArray = []
  var failedErrorsArray = []
  var otherWarningsArray = []
  var missingLinkStr = '(Link missing.; '
  var missingLinkStrLen = missingLinkStr.length
  for (var i = 0; i < errorlog.count(); i++) {
    var error = errorlog[i]
    UTILS.Log('Warning No. ' + (i + 1) + ': ' + error.listErrorCode + '(' + error.listErrorMessage + ')')
    if (error.listErrorCode === 35842) { // link missing
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
  if (failedErrorsArray.length > 0) {
    warningsObject.exportErrors = failedErrorsArray
  }
  if (otherWarningsArray.length > 0) {
    warningsObject.otherWarnings = otherWarningsArray
  }
  return warningsObject
};

function ProcessParams (parameters) {
  // This is where the actual processing will take place.
  UTILS.Log('Processing parameters internal')
  var returnVal = {}

  // Do processing
  // Open the target document
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

  // TODO: Capture top level errors and then clear errorList.
  UTILS.Log('Number of errors: ' + app.errorListErrors.count())
  if (app.errorListErrors.count() > 0) {
    warnings = handleWarnings(document)
  }
  app.clearAllErrors()
  UTILS.Log('Got the warnings from the document.')

  var outputPath = UTILS.GetStringFromObject(parameters, KeyStrings.OutputPath)
  outputPath = UTILS.GetFullPath(outputPath)

  tempTime = new Date().getTime()
  UTILS.UpdateDocumentLinks(document)
  document.exportFile(ExportFormat.INDESIGN_MARKUP, File(outputPath))
  timingObject[KeyStrings.TimeExportIDML] = (new Date()).getTime() - tempTime

  // Add file to be uploaded as an output file.
  var relativePath = UTILS.GetRelativeReturnPath(outputPath)
  UTILS.AddAssetToBeUploaded(relativePath)

  returnVal.idmlPath = relativePath
  // Processing ends.

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
    UTILS.Log('This way of logging can be used for debugging and generic logging.')
    UTILS.Log('This has been done after setting of working directory because it is relative to the working directory')
    UTILS.Log('Each log will be a separate line in the log file.')
    UTILS.Log('The file generated can be sent back')

    // The following should come in the application log which can be dumped using generalSettings/appLogs/logsRelativePath
    app.consoleout('Logging in app\'s std::out')
    app.consoleerr('Logging in app\'s std::err')

    // As a safe practice close any open documents.
    UTILS.CloseAllOpenDocuments()

    var input = app.scriptArgs.get('parameters')
    var allParameters = JSON.parse(input)

    UTILS.Log('Parsed input', input)
    parameters = allParameters.params
    if (parameters === undefined) {
      parameters = allParameters.input.params
    }

    if (parameters === undefined || typeof parameters !== 'object' || Array.isArray(parameters)) {
      UTILS.Log('No params found')
      UTILS.RaiseException(Errors.MissingParams)
    }

    // Set the working folder first. This is the directory within which all the input and output assets are to be managed.
    UTILS.SetWorkingFolder(UTILS.GetStringFromObject(allParameters, KeyStrings.WorkingFolder))

    var result
    UTILS.Log('Processing Params')
    tempTime = new Date().getTime()
    result = ProcessParams(parameters)
    data[KeyStrings.ProcessedData] = result

    // Also add the log file
    UTILS.AddAssetToBeUploaded(UTILS.logFilePath)

    data.warnings = warnings
    // processing ends.

    tempTime = new Date().getTime()
    document.close()
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
    // UTILS.Log('Exception Stack: ' + e.stack)
    UTILS.Log('Exception occurred', tempObj)
    errorOccurred = true

    // Failure, prepare the object to be returned.
    returnObj = UTILS.HandleError(tempObj)
  } finally {
    app.scriptPreferences.measurementUnit = previousUnit
    UTILS.Log('In finally')
    if (document && document.isValid) {
      // Document is still open. Close it.
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
      // Success, prepare the object to be returned.
      UTILS.Log('Finally: No error')
      returnObj = UTILS.GetSuccessReturnObj(data)
    }
    UTILS.Log('Final Result', returnObj)

    // cleanup and return
    UTILS.TerminateLogging()
    app.clearAllErrors()

    // eslint-disable-next-line no-unsafe-finally
    return UTILS.GetFinalReturnPackage(returnObj)
  }
}

// entry point.
main()
