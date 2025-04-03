# IDML Conversion Capability (ExtendScript)

This directory contains an ExtendScript implementation for converting InDesign documents to IDML format. This is the ExtendScript version of the IDML conversion capability, designed to work with InDesign versions 16.0.1 and above.

## Directory Contents

```
Example/
├── manifest.json       # Capability manifest file
├── sample.jsx         # Main script implementation
├── utils.jsx          # Utility functions
├── errors.jsx         # Error handling definitions
└── json2.jsx          # JSON parsing utilities
```

## Files Description

### 1. `manifest.json`
The manifest file defines the capability configuration:
- Supports InDesign versions 16.0.1 and above 
- Implements an ExtendScript capability entry point
- Version: 1.0.0

### 2. `sample.jsx`
The main script file that implements the IDML conversion functionality. Features include:
- InDesign document to IDML conversion
- Document link management
- Asset handling and processing
- Performance monitoring
- Comprehensive error handling
- Logging capabilities

### 3. Helper Files
- `utils.jsx`: Contains utility functions for document processing and logging
- `errors.jsx`: Defines error types and messages for consistent error handling
- `json2.jsx`: Provides JSON parsing and manipulation utilities

## Prerequisites

- Adobe InDesign (version 16.0.1 or higher)
- ExtendScript environment
- Access to InDesign Services
- Appropriate file system permissions

## Installation

1. Create a capability bundle (ZIP file) containing all JSX files:
   ```
   Archive.zip  
   ├── manifest.json  
   ├── sample.jsx
   ├── utils.jsx
   ├── errors.jsx
   └── json2.jsx
   ```
   Note: All files must be zipped directly without a parent folder.

2. Register your script following the [InDesign Capabilities API guide](https://developer.adobe.com/firefly-services/docs/indesign-apis/how-tos/working-with-capabilities-api/)

## Usage

### Required Parameters

Provide the following JSON parameters to run the script:

```json
{
    "assets": [
        {
            "source": {
                "url": "<YOUR_URL>"
            },
            "destination": "sample.indd"
        }
    ],
    "params": {
        "targetDocument": "sample.indd",
        "outputPath": "converted.idml"
    }
}
```

### Parameter Details
- `targetDocument`: Input InDesign document path
- `outputPath`: Output IDML file path

## Logging and Monitoring

### Log File
The script generates detailed logs in `LogFile.txt` including:
- Document processing steps
- IDML conversion progress
- Asset processing status
- Performance metrics
- Error messages and warnings

### Performance Metrics
- Document opening time
- IDML conversion duration
- Asset processing time
- Total execution time

## Error Handling

The script includes comprehensive error handling for various scenarios:
- Parameter validation errors
- Document processing errors
- IDML conversion failures
- Asset handling issues
- File system operations

Each error includes:
- Error code
- Detailed error message
- Context information

## Support

For additional information and support:
- Refer to the [Adobe InDesign APIs documentation](https://developer.adobe.com/firefly-services/docs/indesign-apis/)
- Check the error messages in the log file for troubleshooting
- Ensure all prerequisites are met before running the script
