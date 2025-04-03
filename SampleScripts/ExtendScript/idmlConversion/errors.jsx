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
// errors.jsx

// Error constants are defined here.
/*  This document list all the error which are possible from the scripts. The error object is built such that it has an error code and some error strings.
    The error strings are constructed in a way such that the first string is default and a string literal. It is to be returned anyhow. The subsequent strings can be
    strings having '^1' as placeholder replacement string. This replacement string can be replaced with relevant information. Based on the information
    available the final error message can be created.
*/
/* eslint-disable no-unused-vars */

var ErrorReplacementString = '^1'

var Errors = {
  // Errors during processing: 1001-1999
  InternalScriptError: {
    errorCode: 1001,
    errorStrings: [
      'Internal script error. This should not had happened.'
    ]
  },
  ProcessingErrorOccurred: {
    errorCode: 1002,
    errorStrings: [
      'Error during processing.'
    ]
  },
  PDFPresetNotSet: {
    errorCode: 1003,
    errorStrings: [
      'No PDF Preset could be set.'
    ]
  },
  OutputDirError: {
    errorCode: 1004,
    errorStrings: [
      'Unable to create specified output directory.'
    ]
  },
  RelinkError: {
    errorCode: 1005,
    errorStrings: [
      'Unable to relink.',
      'Relink failed for ^1'
    ]
  },
  PlaceError: {
    errorCode: 1006,
    errorStrings: [
      'Unable to place.',
      'Place failed for ^1'
    ]
  },

  // Errors in input: 2001-2999
  ArrayExpected: {
    errorCode: 2001,
    errorStrings: [
      'Expected array',
      'for property ^1.'
    ]
  },
  ParsingBoolError: {
    errorCode: 2002,
    errorStrings: [
      'Expected boolean.',
      '^1 is the provided value',
      'for property ^1.'
    ]
  },
  ParsingIntError: {
    errorCode: 2003,
    errorStrings: [
      'Expected integer.',
      '^1 is the provided value',
      'for property ^1.'
    ]
  },
  ParsingFloatError: {
    errorCode: 2004,
    errorStrings: [
      'Expected number.',
      '^1 is the provided value',
      'for property ^1.'
    ]
  },
  ParsingStringError: {
    errorCode: 2005,
    errorStrings: [
      'Expected string.',
      '^1 is the provided value',
      'for property ^1.'
    ]
  },
  OutOfBound: {
    errorCode: 2006,
    errorStrings: [
      'Incorrect range provided.',
      'Culprit Value is ^1.'
    ]
  },
  MissingKey: {
    errorCode: 2007,
    errorStrings: [
      'Key not found in object.',
      'Missing key is ^1.'
    ]
  },
  EnumError: {
    errorCode: 2008,
    errorStrings: [
      'No matching enum value found.',
      '^1 is the provided value',
      'for property ^1.'
    ]
  },
  MissingParams: {
    errorCode: 2013,
    errorStrings: [
      'Either the \'params\' is not found in the request or it is not in the correct format.'
    ]
  },
  ObjectExpected: {
    errorCode: 2016,
    errorStrings: [
      'Expected object',
      'for property ^1.'
    ]
  },
  AtLeastOneInternalParamShouldBePresent: {
    errorCode: 2017,
    errorStrings: [
      'At least one of the parameters should be present.',
      'Missing parameters are ^1'
    ]
  },

  // Errors coming from IDS and sent under ProcessingErrorOccurred. These are specific errors which need string change while returning to the user.
  CannotOpenFileError: {
    errorCode: 29447, // kCannotOpenFileError
    errorStrings: [
      'Cannot open file.'
    ]
  }
}
