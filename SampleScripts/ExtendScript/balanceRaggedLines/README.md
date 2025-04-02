# Balance Ragged Lines Capability

This directory contains a script for managing ragged line balancing in Adobe InDesign documents using ExtendScript. The script is designed to work with InDesign versions 16.0.1 through 20.2.0.

## Directory Contents

```
balanceRaggedLines/
├── manifest.json           # Capability manifest file
├── balanceRaggedLines.jsx  # Main script implementation
├── utils.jsx              # Utility functions
├── errors.jsx             # Error handling definitions
└── json2.jsx              # JSON parsing utilities
```

## Files Description

### 1. `manifest.json`
The manifest file defines the capability configuration:
- Supports InDesign versions 16.0.1 to 20.2.0
- Implements an ExtendScript capability entry point
- Version: 1.0.3

### 2. `balanceRaggedLines.jsx`
The main script file that implements the ragged line balancing functionality. Features include:
- Text frame identification by labels
- Ragged line balancing control for specified paragraphs
- Document link management
- Performance monitoring
- Comprehensive error handling

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
   ├── balanceRaggedLines.jsx
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
                "type": "HTTP_GET",
                "url": "<YOUR_URL>"
            },
            "destination": "sample.indd"
        }
    ],
    "params": {
        "targetDocument": "sample.indd",
        "outputPath": "balanced.indd",
        "labels": ["MainPara", "Heading"],  // Optional: If not provided, affects all text frames
        "balance": "true"                   // Can be "true" or "false"
    }
}
```

### Parameter Details
- `labels`: Array of text frame labels to process (optional)
- `balance`: Boolean value to enable/disable ragged line balancing
- `targetDocument`: Input InDesign document path
- `outputPath`: Output document path

## Logging and Monitoring

### Log File
The script generates detailed logs in `LogFile.txt` including:
- Document processing steps
- Text frame identification
- Ragged line balancing operations
- Performance metrics
- Error messages and warnings

### Performance Metrics
- Document opening time
- Link update time
- Ragged line balancing processing time
- Total execution duration

## Error Handling

The script includes comprehensive error handling for various scenarios:
- Parameter validation errors
- Document processing errors
- Text frame identification issues
- Link management problems
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
