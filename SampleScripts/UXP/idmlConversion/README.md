# IDML Export Capability

This directory contains a UXP script for exporting InDesign documents to IDML format using Adobe InDesign's scripting capabilities. The script is designed to work with InDesign versions 18.4.0 and above.

## Directory Contents

```
idmlConversion/
├── manifest.json       # Capability manifest file
└── idml.idjs          # Main script implementation
```

## Files Description

### 1. `manifest.json`
The manifest file defines the capability configuration:
- Supports InDesign versions 18.4.0 and above
- Implements a UXP capability entry point
- Version: 1.0.0

### 2. `idml.idjs`
The main script file that implements the IDML export functionality. Features include:
- Robust error handling with detailed error messages
- Comprehensive logging system
- Document link management
- Asset handling and processing
- Performance monitoring
- File system operations using UXP storage API

## Prerequisites

- Adobe InDesign (version 18.4.0 or higher)
- UXP scripting environment
- Access to InDesign Services
- Appropriate file system permissions

## Installation

1. Create a capability bundle (ZIP file) with the following structure:
   ```
   Archive.zip  
   ├── manifest.json  
   └── idml.idjs
   ```
   Note: Files should be zipped directly without a parent folder.

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

### Error Handling

The script includes comprehensive error handling for various scenarios:
- Parameter validation errors
- File system operations
- Document processing errors
- Link management issues
- Asset handling problems

Each error includes:
- Error code
- Detailed error message
- Context information

## Logging and Monitoring

### Log File
The script generates detailed logs in `LogFile.txt` including:
- Document processing steps
- Performance metrics
- Error messages and warnings
- Asset processing status
- Link management operations

### Performance Metrics
- Document opening time
- Link update time
- Processing duration
- Asset handling time

## Support

For additional information and support:
- Refer to the [Adobe InDesign APIs documentation](https://developer.adobe.com/firefly-services/docs/indesign-apis/)
- Check the error messages in the log file for troubleshooting
- Ensure all prerequisites are met before running the script
