
## Overview
InDesign APIs empower enterprises in automating tedious time-consuming design tasks via scalable cloud services, delivering personalization at scale, creative automation and content velocity. Our API is built on RESTful principles, employing standard HTTP response codes, methods, and authentication techniques to deliver responses in JSON format.

InDesign APIs include three API capabilities:  
* Rendition
* Data merge 
* Custom script

This guide will assist you in:
•	Setup and Creating a project within the Adobe Developer Console
•	Obtaining and authenticating your credentials
•	Links & Working directory
•	Consume the APIs provided by InDesign APIs
•	Exposing your own APIs by utilizing the Custom Script Capabilities.
•	Constructing personalized workflows by chaining API calls to various endpoints within the Firefly Services APIs
•	Logging


## General workflow

The usual workflow entails initiating one or more calls to our API to create Renditions in either PNG, JPG, or PDF, use Data Merge to create multiple versions of a document or even use your own Custom Script as an API.
### Diagram Explaining Overall workflow
WIP
### Setup and Authentication
#### Onboarding Process for InDesign APIs
- Users need to sign up for the Adobe pre-release program for Indesign APIs, which is currently in beta phase.

    ![Prerelease Program](/images/prerelease_program.png "Prerelease Program")

    **Note: Users must fulfill specific requirements to be eligible for the program, including having a valid use case and being approved by the admin team.**

- After applying for InDesign APIs Prerelease Program, user have to generate credentials through **Adobe Developer Console**.

#### Steps To Generate Credentials through Adobe Developer Console
- Select `Create new project`

    ![Create new project](/images/quick_start.png "Quick Start")

- Select `Add API`

    ![Add API](/images/getting_started.png "Add API")
- Select `InDesign API Firefly Services`

    ![Add API](/images/add_api.png "Add API")

- Set up OAuth Server-to-Server Credentials.
  - The OAuth Server-to-Server credential relies on the OAuth 2.0 client_credentials grant type to generate access tokens.

  ![Authorisation](/images/server_to_server.png "Authorisation")

- Credentials are generated for the user through the Adobe Developer Console, including client ID, client secret, scope and other necessary details.

    ![Add API](/images/add_api.png "Add API")

    - Grant Type: client_credentials: Specifies the OAuth 2.0 grant type.
    - Client ID: A unique identifier assigned to each application to identify it to the OAuth server.
    - Client Secret: A confidential key used by the application to authenticate itself to the OAuth server.
    - Scope: Specifies the level of access that the application is requesting from the OAuth server.
- After successfully completing the above steps, you’ll get an 'access_token' in response. The token will be valid for 24hrs, after which you must re-generate it. Use this token in your API calls to make them work.

### Getting Started
Let's first understand what exactly is a curl request.

['cURL'](https://developer.adobe.com/commerce/webapi/get-started/gs-curl/) is a command-line tool that lets you transmit HTTP requests and receive responses from the command line or a shell script. It is available for Linux distributions, Mac OS X, and Windows. 

InDesign API's support OAuth Server-to-Server authentication. You can use the token generated in the above step to call InDesign API's.

Here’s a skeleton curl request to accessing the APIs :

<!-- Real Cool Heading -->
```curl
curl --location --request POST <endpoint> \
--header 'Authorization: bearer <access_token>' \
--header 'x-api-key: <client_id>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "assets": [
        ...
    ],
    "params": {
        ...
    },
    "outputs": [
        ...
    ]
}
```


You can use InDesign APIs in two ways:
1. Consume the out-of-box APIs. You can find these [API documentation here](https://adobedocs.github.io/indesign-api-docs/).
2. Expose your own APIs with the help of custom scripts. You can find the documentation [here](#exposing-your-own-apis).

We will cover both scenarios in the coming sections, but first, let us go over the common points. We'll discuss various points below, and their examples can be seen in conjunction with the API documentation shared above.

#### Understanding the body of the Request
As shown in the [skeleton request wip] above, there are three main parts to the body of the request. Here’s the information to understand these parts and their significance:

1. **"assets"**: This part is where the caller can specify input assets for the request to be processed successfully. More information can be found below(LINK WIP).

2. **"outputs"**: Specify the locations where to upload the output assets.More details can be found below(WIP LINK). In the absence of this, the outputs assets are stored in a temporary repository, and a pre-signed URL(WIP LINK) will be shared for those assets, which will be valid for 24hrs.

3. **"params"**: Specify information regarding what to do with the input assets.

Refer to API documentation(WIP LINK) for more details.

### Concept of Links / Working Directory
Links are one of the most important features of InDesign. You can place and link content within the same document or even across different documents. This helps keep the assets and the document decoupled. Links can correspond to texts, graphics, etc.

- InDesign APIs support the processing of documents with links.

- To process a request, a temporary folder/directory is created, called as the working directory for the request.

- All the input assets mentioned in the request are downloaded and kept in the working directory.

- Within the working directory the location of individual asset is governed by the relative path mentioned in the 'destination' attribute.

- Please note that the value mentioned in the destination property must be used to refer to the same asset in the rest of the parameters.

You can use the following ways to make links work. It can be done in two ways:

1. Maintain relative paths of assets to the target document. To do this, you need to place the files outside the working directory.

2. If you place the linked assets parallel to the target document, the links get resolved, and the assets will be picked.

Sometimes, the documents contain custom links that InDesign does not understand. To allow proper job execution, the custom URLs can be relinked to assets provided in the request. Here’s an example of this:
```json
{
    "params": {
        "generalSettings": {
            "links": {
                "replaceLinks": [
                    {
                        "targetDocument": "TargetDocument.indd",
                        "mapping": [
                            {
                                "currentURI": "customScheme:4c189e2d-315e-4fab-a8c2-45690e44d1f0",
                                "newAssetRelativePath": "SomeNewAsset.png"
                            }
                        ]
                    }
                ]
            }
        }
    }
}
```
In this example, the existing URI `"customScheme:4c189e2d-315e-4fab-a8c2-45690e44d1f0"` in the document `"TargetDocument.indd"` cannot be interpreted by InDesign by itself. The caller would have provided an input asset with `"destination"` attribute as `"SomeAsset.png"`.
By using the above example the caller is asking to relink the links with the specified URI to be relinked to the new asset, which is present at `<Working_Directory>/SomeNewAsset.png`

### Understanding the Use of Pre-Signed URLs for Input/Output Assets

***What exactly is a pre-signed URL ?***

A pre-signed URL is a URL that grants temporary access to a specific resource, typically in cloud storage, with predefined permissions and an expiration time. It allows users to upload or download files securely without needing direct access to the credentials of the storage service. 

While using InDesign APIs, the input assets as well as the output assets are stored as pre-signed URLs. Let's learn more about each of them.

#### Input Assets
The platform supports multiple asset types. These asset types signify storage repositories from which the platform can download. You can provide the input asset information within the `"assets"` array. 

InDesign APIs support following storage types to refer your assets from:

- **AWS S3**: Use a pre-signed GET/PUT/POST URL
- **Dropbox**: Generate temporary upload/download links using [link](https://dropbox.github.io/dropbox-api-v2-explorer/)
- **Azure**: Use a Shared Access Signature (SAS) in Azure Storage for GET/PUT/POST operations.

Example
```json
assets:[
    {
        "source" : {
            "storageType" : "Azure", //Optional
            "url" : "https://xyz-blob.core.windows.net/Template.indt"
        },
        "destination" : "jobasset/template1.indt"
    },
    {
        "source" : {
            "storageType" : "Aws", //Optional
            "url" : "https://s3.eu-west-1.amazonaws/xyz/Template.indt"
        },
        "destination" : "jobasset/template2.indt"
    }
]
```
In all the above examples, you can see that data is divided into source and destination. The first attribute, 'source' is where the asset is downloaded from. The second attribute 'destination' refers to the location where the asset would be downloaded to. 

#### Output Assets
Like input assets, the platform supports multiple asset types for output. These asset types signify storage repositories to which platform can upload. You can provide this information in the "outputs" array within the body of the request. 

Assets type differ from input and output? 
<!-- Azure	url	mandatory	Pre-signed URL -->
<!-- HTTP_POST	url	mandatory	Pre-signed URL -->


Example
```json
"outputs": [
    {
        "destination" : {
            "type" : "Azure",
            "url" : "https://xyz-blob.core.windows.net/Template.indt"
        },
        "source" : "jobasset/template.indt"
    }
]
```
Each DAM (Digital Asset Management) provider may have its own requirements for creating PUT or POST pre-signed URLs. Please follow the documentation from the individual DAM provider creating these URLs.

### How Custom Fonts Work and What Happens If They Are Not Supplied
Custom fonts or user fonts can be provided as a regular asset. Here’s an example:
```json
{

    "assets":[
        {
            "source": {
                "url":"<YOUR PRE-SIGNED URL>",
                "type":"HTTP_GET"
            },
            "destination" : "Cheese_final.indd"
        },
        {
            "source": {
                "url":"<YOUR PRE-SIGNED URL>",
                "type":"HTTP_GET"
            },
            "destination" : "FontName.otf"
        }
    ]
}
```
For the fonts to be picked properly, please place them in the "Document Fonts" folder parallel to the document that uses them. Or, if the fonts are kept under some other folder say "fontFolder", please specify the font directory as follows:
```json
{
    "params": {
        "generalSettings": {
            "fonts": {
                "fontsDirectories": [
                    "fontFolder"
                ]
            }
        }
    }
}
```
If no font directory is mentioned, the working directory will be added as the font directory.

### Recommended Optimizations
There are certain optimizations that a user can employ to make the APIs more performant.

1. If the font directories are to be added, don’t use them with InDesign documents, as opening these files will create additional lock files and, in turn, trigger recalculation of the font resources. 
As a best practice, try to keep the fonts in "Document Fonts" or in an isolated directory. If the hierarchy of the downloaded fonts has been properly mentioned as lying in the "Document Fonts" folder parallel to individual documents, then the following can be used to bring in a level of optimization. This will avoid the addition of any font directory and might result in performance benefits.
```json
{
    "params": {
        "generalSettings": {
            "fonts": {
                "fontsDirectories": []
            }
        }
    }
}
```
2. Another way to optimize the call is to skip the Adobe fonts search. To do this, provide includeDocuments as an empty array.
```json
{
    "params": {
        "generalSettings": {
            "fonts": {
                "adobeFonts": {
                    "includeDocuments": []
                }
            }
        }
    }
}
```
### Current limitations
Here are a few limitations to the APIs you should be aware of ahead of time:
- Error handling is a work in progress. Sometimes you may not see the most helpful of messages.
- InDesign APIs support only following storage types to refer your assets from:
    - AWS S3
    - Dropbox
    - Azure
- For increased reliability and stability we have added a retry mechanism for all API calls, and here are some recommendations on how to handle these:
    - You should only retry requests that have a 5xx response code. A 5xx error response indicates there was a problem processing the request on the server.
    - You should implement an exponential back-off retry strategy with 3 retry attempts.
    - You should not retry requests for any other response code.

## Features

This section provides an in-depth overview of the key features available through our APIs, including Rendition, Data Merge, and Custom Scripts, detailed insights into each feature, including how to leverage the SDK for developing custom scripts and getting started on your development journey.

You can find the detailed [API documentation here](https://adobedocs.github.io/indesign-api-docs/). Here are some sample requests for the APIs :

### Rendition using pre-signed URL
Creates and returns renditions in the PDF, JPEG or PNG format from a specific InDesign document. The following example provides PDF Rendition using a pre-signed URL and a custom font
```curl
curl --location --request POST 'https://indesign.adobe.io/v3/create-rendition' \
--header 'Authorization: bearer <YOUR_OAUTH_TOKEN>' \
--header 'x-api-key: <YOUR_API_KEY>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "assets":[
        {
            "source": {
                "url":"<YOUR PRE-SIGNED URL>",
                "storageType":"Azure"
            },
            "destination" : "Cheese_final.indd"
        },
        {
            "source": {
                "url":"<YOUR PRE-SIGNED URL>",
                "storageType":"Azure"
            },
            "destination" : "Abelone-FREE.otf"
        }
    ],
    "params":{
         "outputMediaType": "image/jpeg",
         "targetDocuments": [
            "Cheese_final.indd"
         ],
         "outputFileBaseString": "template_rendition"
    }
}
```
### DataMerge - Tags
Retrieves the data merge tags from the document.

```curl
curl --location --request POST 'https://indesign.adobe.io/v3/merge-data-tags' \
--header 'Authorization: bearer <YOUR_OAUTH_TOKEN>' \
--header 'x-api-key: <YOUR_API_KEY>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "assets": [
        {
            "source": {
                "url":"<YOUR PRE-SIGNED URL>",
                "storageType":"Azure"
            },
            "destination" : "dataMergeTemplate.indd"
        },
        {
            "source": {
                "url":"<YOUR PRE-SIGNED URL>",
                "storageType":"Azure"
            },
            "destination": "batang.ttc"
        }
    ],
    "params": {
        "outputMediaType": "application/x-indesign",
        "targetDocument": "dataMergeTemplate.indd",
        "includePageItemIdentifiers": true
    }
}
```
### DataMerge - Merge
Creates and returns merged InDesign documents or PDFs that are created after merging the data and the given template.
```curl
curl --location --request POST 'https://indesign.adobe.io/v3/merge-data' \
--header 'Authorization: bearer <YOUR_OAUTH_TOKEN>' \
--header 'x-api-key: <YOUR_API_KEY>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "assets": [
        {
            "source": {
                "url":"<YOUR PRE-SIGNED URL>",
                "storageType":"Azure"
            },
            "destination" : "dataMergeTemplate.indd"
        },
        {
            "source": {
                "url":"<YOUR PRE-SIGNED URL>",
                "storageType":"Azure"
            },
            "destination": "Directory_Names.csv"
        }
    ],
    "params": {
        "targetDocument": "dataMergeTemplate.indd",
        "outputMediaType": "application/x-indesign",
        "outputFolderPath": "outputfolder",
        "outputFileBaseString" : "merged"
        "dataSource": "Directory_Names.csv"
    }
    "outputs": [ // custom user output
        {
            "destination": {
                "url": "<YOUR PUT-SIGNED URL>"
            },
            "source": "outputfolder/merged.pdf"
        }
    ]
}
```
### Exposing your own APIs

Many times, the end users' requirements are very specific and cannot be fulfilled in a generic manner. Some custom work may be needed to address these cases.

InDesign APIs expose a way for third-party developers to come on board and deploy their custom scripts as endpoints. The script writer can define the custom attributes and values that make sense for a particular endpoint. These can be done by deploying the capability bundle. To understand more about capabilities, their deployment and using them, please refer to this [documentation](Capability.md).

There are a few points that must be kept in mind while writing a script for InDesign APIs.

* To run a script with InDesign APIs, the script must be compatible to run with InDesignServer. However, any script that can be run on InDesignServer can't be run as is.

* While writing a new script or modifying existing scripts for InDesign APIs, there are a few nuances that the developer must take care of with respect to "input to the script" and "output" from the script”. These nuances are discussed in the next few sections.

#### __Accepting input in custom script__

* Case 1: The script does not require any input/argument.

    In this case, the system by default sends string type argument named `"parameters"` as follows:
    ```json
    {
        "assets": [
            {"path": "doc.indd"},
            {"path": "image.pdf"},
            ...
        ],
        "params": {

        },
        "jobID": "0c531425-bc82-43c0-89b7-0e851cd56061",
        "workingFolder": <Some path>
    }
    ```
    The above-mentioned JSON will be received in the form of `"string"`, which needs to be parsed inside the script to retrieve the value of attributes. In this case, the `"params"` attribute will be empty since, the script does not need an argument.

*   Case 2: The script accepts some input argument.
In this case, the system, by default, sends a string-type argument named `"parameters"` which also includes input arguments e.g. "arg1", "arg2".
    
    So, In order to use the argument `"parameters"` must be parsed. And then you must extract the value of arg1 and arg2.
    ```json
    {
        "assets": [
            {"path":"doc.indd"},
            {"path":"image.pdf"},
            ...
        ],
        "params": {
            "arg1": <data corresponding to argument1>,
            "arg2": <data corresponding to argument2>,
            ...
        },
        "jobID": "0c531425-bc82-43c0-89b7-0e851cd56061",
        "workingFolder": <Some path>
    }
    ```
    You must tweak the existing scripts to accept the arguments correctly e.g.
    <table>
        <tr>
        <th>Old Script</th>
        <th>New Script</th>
        </tr>
        <tr>
        <td><p> var arg1 = app.scriptArgs.get('argument1')<br>
        var arg2 = app.scriptArgs.get('argument2')<br><br>
        // Some processing</p></td>
        <td><p>var parameters = app.scriptArgs.get('parameters')    <br>
        // parse "parameters" so, that values can be extracted.     <br>
        var arg1 = parameters['argument1'] <br>
        var arg2 = parameters['argument2'] <br><br>
        // Some processing</p></td>
        </tr>
    </table>

    The execution of any script depends on the following attributes:

    <table style="background-color:white;">
      <tr>
        <th>Attribute</th>
        <th>Input Request Mapping</th>
        <th>Description</th>
      </tr>
      <tr>
        <td>assets</td>
        <td>assets->destination field</td>
        <td>This contains a list of input assets like .indd, .pdf, or .jpeg etc.</td>
      </tr>
      <tr>
        <td>params</td>
        <td>params</td>
        <td>User input/arguments that are used inside script</td>
      </tr>
      <tr>
        <td>jobID</td>
        <td>Auto generated</td>
        <td>The job ID</td>
      </tr>
      <tr>
        <td>workingFolder</td>
        <td>Auto generated</td>
        <td>The working folder for the job. This is the base directory. Inside this directory, all the assets and scripts are downloaded. e.g c:\\baseFolder\assets </td>
      </tr>
    </table>
    
    </br> 


    Here’s the sample input and sample script code to open a document and close a document.

    * Sample Input request body
        ```json
        {
            "assets": [
                {
                    "source": {
                        "storageType": "Azure",
                        "url": "Pre-signed url of document"
                    },
                    "destination": "doc.indd"
                }
            ],
            "params": {
                "targetDocument": "doc.indd"
            }
        }
        ```
    * Transformed Input request. That is sent to script
        ```json
        {
            "assets": [
                {
                    "path": "doc.indd"
                }
            ],
            "params": {
                "targetDocument": "doc.indd"
            },
            "jobID": "0c531425-bc82-43c0-89b7-0e851cd56061",
            "workingFolder": "c:\\baseFolder\\assets"
        }
        ```
    * Sample code that takes above mentioned input. This code opens docuemnt and closes the document.
        ```javascript
         
            var input = app.scriptArgs.get('parameters')
            var allParameters = JSON.parse(input)

            // Set the working folder. This is the directory within which all the  input and output assets are to be managed.
            var basePath = allParameters["workingFolder"]

            var documentToOpen = allParameters["params"]["targetDocument"]

            documentPath = basePath + "\\" + documentToOpen
            document = app.open(File(documentPath))
            document.close()
        ```

</br>

#### __Providing output from custom script__

A developer must follow certain rules in order to output data, files, or logs from a script. Please follow these instructions to provide output correctly :

* __Execution is successful__

    The following attributes are expected in return as a JSON string if the script execution is successful.

    ```json
    {
        "status": "SUCCESS",
        "assetsToBeUploaded": [
            {
                "path": <Relative path of file to be uploaded w.r.t working folder>,
                "data": <Data in dictionary (object) format to be associated with this asset>
            }
        ],
        "dataURL": <Relative path of json file w.r.t working folder>
    }
    ```
    Caution: Anything outside of these attributes might be logged as data to be     investigated.

    <table style="background-color:white;">
      <tr>
        <th>Attribute</th>
        <th>Description</th>
        <th>Optional/Mandatory</th>
      </tr>
      <tr>
        <td>dataURL</td>
        <td>This should have a path of JSON file w.r.t working folder. It should be created inside the working folder</td>
        <td>Mandatory</td>
      </tr>
      <tr>
        <td>status</td>
        <td>Status of execution (SUCCESS/FAILURE)</td>
        <td>Mandatory</td>
      </tr>
      <tr>
        <td>assetToBeUploaded</td>
        <td>Array for assets that need to be uploaded. This can be empty.</td>
        <td>Mandatory</td>
      </tr>
    </table>

    </br>



    * Here’s a sample code returning a successful execution. Without data and without any output file.
        ```javascript
        /* Creates an object to be returned when the job is successful. The object should be stringified before returning. 
        */
        function GetSuccessReturnObj() {
            var obj = {}
            
            obj.status = 'SUCCESS'
            obj.assetsToBeUploaded = []
            obj.dataURL = ''
            
            return JSON.stringify(obj)

        }
        ```
    * Here’s a sample code returning a successful execution. With data and without any output file.
        ```javascript
        /* Creates an object to be returned when the job is successful. Data is written into a JSON file, which should be created inside a working folder.
            @param data: The data in dictionary (object) format is to be returned.
            The object should be stringified before returning. 
         */
    
         function GetSuccessReturnObj(data) {
            var obj = {}
            
            obj.status = 'SUCCESS'
            obj.assetsToBeUploaded = []
            obj.dataURL = WriteToFile(data)
            
            return JSON.stringify(obj)
         }
         function WriteToFile ( data ) {
            var newFile
            var fileName = 'data.json'
            var filePath = workingFolder + '\\' + fileName
            newFile = File(filePath)
            newFile.encoding = 'UTF8'
            newFile.open('write')
            newFile.write(JSON.stringify(data))
            newFile.close()
            return filePath  
        }
        ```

    * Here’s a sample code returning a successful execution. With/Without data and with the output file.
        ```javascript
        /* Create an array of assets which is to be uploaded and sent back to the caller.
            assetPath: Path of the file to be uploaded, relative to the working folder.
            data: The data in dictionary (object) format to be associated with this asset. (It is optional)
            This data will be provided to the user with ASSET_UPLOAD_COMPLETED  event. 
        */

         var assets = []
         var assetToBeUploaded = {}
         
         assetToBeUploaded.path = assetPath
         assetToBeUploaded.data = data //this is optional
         assets.push(assetToBeUploaded)
         
         
         function GetSuccessReturnObj(assets, data) {
            var obj = {}
            obj.status = 'SUCCESS'
            obj.assetsToBeUploaded = assets
            if (data) {
                obj.dataURL = WriteToFile(data)
            } else {
                obj.dataURL = ''
            }
            return JSON.stringify(obj)
        }
        ```
    * In the above cases, it can be observed that the data is being shared in a JSON file, and not directly. This is to take care of cases where the data becomes too big to send back.
    * In case no data is to be sent, an empty string should be passed in 'dataURL'.
* __Execution failed__

    In case of failed execution of the script, the following attributes are expected in return as a JSON string.
    ```json
    {
        "status": "FAILURE",
        "errorCode": <Error code>,
        "errorString": <Error Message>,
    }
    ```

    <table style="background-color:white;">
      <tr>
        <th>Attribute</th>
        <th>Output Request Mapping</th>
        <th>Meaning</th>
      </tr>
      <tr>
        <td>status</td>
        <td>Status of execution (SUCCESS/FAILURE)</td>
        <td>Mandatory</td>
      </tr>
        <tr>
        <td>errorCode</td>
        <td>ErrorCode of the error</td>
        <td>Optional</td>
      </tr>
      <tr>
        <td>errorString</td>
        <td>Description of error</td>
        <td>Optional</td>
      </tr>
    </table>



    Here’s a sample code to use as a starting point, to create the return object for failed cases.
    ```javascript
    /*  Creates json string that is returned in case the job has failed.
    @param errorCode: Error code detail.
    @param errorString: Description about the error.
    @return: json string.
    */

    function GetFailureReturnObj(errorCode, errorString) {
        var obj = {}
        obj.status = 'FAILURE'
        obj.errorCode = errorCode
        obj.errorString = errorString
        return JSON.stringify(obj)
    }
    ```

## Code Samples
### Rendition JPEG

### Rendition PDF
### Data merge with JPEG rendition
### Manifest
### Registering a script
### Executing the registered script
### Triggering an event from API
### Poll for job status

## API reference
Please refer to the [API Guide](https://adobedocs.github.io/indesign-api-docs/)

## Migration guides (if applicable)
IDS to InDesign APIs (Not Applicable)

Public beta to GA (Not Applicable)

[Private to Public Beta](https://wiki.corp.adobe.com/display/indesign/InDesign+API+migration+-+Private+Beta+to+Public+Beta)

## FAQs
Please refer to the following [FAQ Wiki](https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=indesign&title=FAQs+-+InDesign+APIs)