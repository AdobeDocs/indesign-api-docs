# InDesign Cloud Services

## Introduction
The InDesign Cloud Services enables you to make edits, query data and run workflows on ID file. This document will help you onboard to the services, familiarize you with the available features, and get you started with some basic usage examples.

## Onboarding & setup
### OnBoarding
1. The user should be registered on [Developer Pre-release program](https://www.adobeprerelease.com/beta/D1A76A97-F7DC-4552-DE3C-FF5F211C7492/apply) (This would bind the developer to NDA).
2. The user should fill up this [form](https://forms.office.com/Pages/ResponsePage.aspx?id=Wht7-jR7h0OUrtLBeN7O4b96s5AZBCJOvELTJf9VO8hUQTBCMjhZTjVIS0VYQzFGN1lFVjVSM0JROC4u) for being a part of the Beta program of InDesign Cloud Services.

After this, the developers will be shortlisted and they will be enrolled in the beta program. Individual developers will be shared with their client_id and client_secret and other relevant details.

### Setup
The user will have to generate an access token using the details shared above. The exact steps to make it work are as follows:

1. Download [node](https://nodejs.org/en/download/) and install on your machine.
2. Download and extract the [sample code](https://github.com/AdobeDocs/adobeio-auth/tree/stage/JWT/samples/adobe-jwt-node).
3. Edit the contents of the config file (config.js) by replacing relevant data for clientId , clientSecret and other attributes from the data shared with you at the time of acceptance.
4. Execute
```
npm install
node app.js
```

After successful completion of above steps, the user will get 'access_token' in response. The token will be valid for 24hrs, beyond which it  needs to be generated again. Use this token in your API calls to make them work.

### Accessing APIs
There are two types of authentication which will be supported for InDesign Cloud Services:

1. __Service Account Integration__: For service-to-service integrations, you will need a JSON Web Token (JWT) that encapsulates your client credentials and authenticates the identity of your integration. You then exchange the JWT for the access token that authorizes access.
2. __OAuth integration__: (Coming soon) If your integration needs to access content or a service on behalf of an end user, that user must be authenticated as well. Your integration will need to pass the OAuth token granted by the Adobe IMS.

A skeleton cURL request for accessing the APIs is provided below
```curl
curl --location --request POST <endpoint> \
--header 'Authorization: <access_token>' \
--header 'x-api-key: <client_id>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "assets":[
        ...
    ],
    "params":{
        ...
    },
    "outputs":[
        ...
    ]
}
```

## Working with the InDesign Cloud Services

InDesign Cloud Services can be used in two ways: 
1. Consuming the APIs provided by InDesign Cloud Services. You can find the [API documentation here](https://adobedocs.github.io/indesign-api-docs/).
2. Exposing your own APIs with the help of custom scripts. The documentation can be found [here](#exposing-your-own-apis).

Both scenarios will be covered a bit later, but first let us go over the common points. We'll discuss various points below and their examples can be seen in conjunction with the API documentation shared above.

### Understanding body of the request
As shown in the [skeleton request](#accessing-apis) above, there are three main parts of the body of the request. These parts and their significance can be understood from the information below:

1. "assets": This part is where the caller can specify input assets for the request to be processed successfully. More information can be found [below](#providing-input-assets).
2. "outputs": The caller can specify the locations where the output assets can be uploaded to. More details can be found [below](#providing-output-assets). In absence of this, the outputs assets will be stored in a temporary repository and a pre-signed url will be shared for those assets which will be valid for 24hrs.
3. "params": This part is where the caller can specify information regarding what to do of the input assets.

Please refer to [API documentation](https://adobedocs.github.io/indesign-api-docs/) for more details.

### Providing input assets

The platform supports multiple asset types. These asset types signify storage repositories from which platform can download.  The information pertaining to the input assets can be given within the "assets" array within body of the request.Supported types are as follows: 
<table style="background-color:White;">
  <tr>
    <th>Type</th>
    <th>Required Parameter</th>
    <th>Nature</th>
    <th>Notes</th>
  </tr>
  <tr>
    <td>HTTP_GET</td>
    <td>url</td>
    <td>mandatory</td>
    <td>Pre-signed URL</td>
  </tr>
</table>

__HTTP_GET__ example
```json
{
    "source" : {
        "type" : "HTTP_GET",
        "url" : "https://xyz-input-asset.s3.amazonaws.com/Template.indt"
    },
    "destination" : "jobasset/template.indt"
}
```
In all the examples above, the data is divided into source and destination. The first attribute, 'source' is where the asset is downloaded from. The second attribute 'destination' refers to the location where the asset would be downloaded to. More on this can be found under links.

### Providing output assets
Like input assets, the platform supports multiple asset types for output as well. These asset types signify storage repositories to which platform can upload. This information can be given within the "outputs" array within the body of the request. Supported types are as follows: 
<table style="background-color:White;">
  <tr>
    <th>Type</th>
    <th>Required Parameter</th>
    <th>Nature</th>
    <th>Notes</th>
  </tr>
  <tr>
    <td>HTTP_PUT</td>
    <td>url</td>
    <td>mandatory</td>
    <td>Pre-signed URL</td>
  </tr>
  <tr>
    <td>HTTP_POST</td>
    <td>url</td>
    <td>mandatory</td>
    <td>Pre-signed URL</td>
  </tr>
</table>

__HTTP_PUT__ or __HTTP_POST__ example
```json
{
    "destination" : {
        "type" : "HTTP_POST",
        "url" : "https://xyz-input-asset.s3.amazonaws.com/AdobeStock_322173431.indt"
    },
    "source" : "jobasset/template.indt"
}
```
URL should be a pre-signed POST URL in case of HTTP_POST and in case type is HTTP_PUT, URL should be a pre-signed PUT URL.

### Supported file storage
Currently, the following storage types are supported to reference your assets from:
- AWS S3: By using a presigned GET/PUT/POST URL
- Dropbox: Generate temporary upload/download links using https://dropbox.github.io/dropbox-api-v2-explorer/
- Azure: By using Shared Access Signature (SAS) in Azure Storage, for GET/PUT/POST operations.


### Links & Working directory
Links is one of the most important features of InDesign. You can place and link content within the same document or even across different documents. This also helps in keeping the assets and the document decoupled. Links can be corresponding to texts, graphics etc. 

InDesign APIs support the processing of documents with links. To process a request a temporary folder/directory is created. This directory is called the working directory for the request. In the request all the input assets mentioned in the request are downloaded and kept in the working directory. Within the working directory the location of individual asset is governed by the relative path mentioned in the 'destination' attribute. Please note, that to refer to the same asset in the rest of the params, the value mentioned in the destination property is to be used. To make links work, it can be done in two ways:

1. Maintaining relative paths of assets to the target document. While doing this one must understand that the files should be placed outside of the working directory.
2. If the linked assets are placed parallel to the target document, the links get resolved and the assets are picked. 

Sometimes the documents contain custom links which are not understood by InDesign. To enable proper execution of the job, the custom URLs can be relinked to assets provided in the request. An example of it is as follows:
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
In this example the existing URI "customScheme:4c189e2d-315e-4fab-a8c2-45690e44d1f0" in document "TargetDocument.indd" cannot be interpreted by InDesign by itself. The caller would have provided an input asset with "destination" attribute as "SomeAsset.png". By using the above example the caller is asking to relink the links with specified URI to be relinked to the new asset which is present at <Working_Directory>/SomeNewAsset.png
### Fonts 
Just like links, fonts are also very important. The support of fonts is as follows:
#### Adobe fonts
Adobe fonts are currently supported only with [OAuth integration](#accessing-apis) where the end user can be identified. These are yet not supported with [Service account integration](#accessing-apis). The fonts are fetched automatically, on behalf of the requestor and thus nothing needs to be done while making a request. Please note that the list of supported fonts is dependent on the account used to make the call. The way it works is that the platform iterates over all the InDesign documents brought in the temporary working directory by iterating over the input asset list. As a pre job step, these documents are opened and list of Adobe fonts is extracted from it. These documents are closed and fonts are downloaded. When the fonts' download is complete, the actual job script is run.

There may be certain cases where the search for Adobe Fonts will not help. The first case is when the Adobe fonts are not being used in the document, hence it does not make sense to open the document and search for those. The second case is of scenario where the service account integration is used for connecting with the APIs. In these scenarios, the caller has the option to skip the font search. For more details please look at the following example, where a specific document is to be searched for Adobe Fonts:
```json
{
    "params": {
        "generalSettings": {
            "fonts": {
                "adobeFonts": {
                    "includeDocuments": [
                        "TargetDocument.indd"
                    ]
                }
            }
        }
    }
}
```
For more information around this please refer to the API documentation.

#### Custom fonts
Custom fonts or user fonts can be provided as a regular asset. An example:
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

For the fonts to be picked properly, please place it in the "Document Fonts" folder parallel to the document which uses it. Or, if the fonts are kept under some other folder say "fontFolder", please specify the font directory as 
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
In absence of any font directory being mentioned, the working directory will be added as the font directory.

### Getting status of a job
Now that the request is sent, how can one get the status of the request. This is demonstrated with an example below. Suppose the user triggers a rendition call with a 3 page document. The request will look something like

```curl
curl --location --request POST 'https://indesign.adobe.io/api/v1/capability/indesign/rendition/png' \
--header 'Authorization: <access_token>' \
--header 'x-api-key: <client_id>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "assets":[
        {
            "source": {
                "url":<pre-signed url>,
                "type":"HTTP_GET"
            },
            "destination" : "3PageDoc.indd"
        }
    ],
    "params":{
         "jobType":"RENDITION_PNG",
         "targetDocuments": [
            "3PageDoc.indd"
         ],
         "pageRange": "1-3",
         "outputFileBaseString": "template_rendition"
    }
}'
```

The response to the request will be something like
```json
{
    "statusUrls": {
        "latest": "https://indesign.adobe.io/api/v1/capability/status/ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85",
        "all": "https://indesign.adobe.io/api/v1/capability/status/all/ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85"
    },
    "id": "ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85"
}
```

The "id" in the response, corresponds to the requestID or jobID. It can be further used to know the status. The value in "latest" can be used to get the latest status event of the job. Likewise the value in "all" can be used to get all status events in a paginated format.

__Latest__ request
This will give the latest event generated in the process.
```curl
curl --location --request GET 'https://indesign.adobe.io/api/v1/capability/status/ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85' \
--header 'Authorization: <access_token>' \
--header 'x-api-key: <client_id>'
```

__Latest__ response
```json
{
    "eventId": "8175851e-f122-464c-9d02-fe08e7d6fc0f",
    "data": {
        "outputs": [
            {
                "renditions": [
                    {
                        "pageIndex": 1,
                        "path": [
                            "tmp964721/template_rendition.png"
                        ]
                    },
                    {
                        "pageIndex": 2,
                        "path": [
                            "tmp964721/template_rendition2.png"
                        ]
                    },
                    {
                        "pageIndex": 3,
                        "path": [
                            "tmp964721/template_rendition3.png"
                        ]
                    }
                ],
                "input": "3PageDoc.indd"
            }
        ]
    },
    "id": "ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85",
    "state": "COMPLETED",
    "timestamp": 1623913539469
}
```

__All__ request
```curl
curl --location --request GET 'https://indesign.adobe.io/api/v1/capability/status/all/ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85' \
--header 'Authorization: <access_token>' \
--header 'x-api-key: <client_id>'
```

__All__ response
```json
{
    "events": [
        {
            "eventId": "8175851e-f122-464c-9d02-fe08e7d6fc0f",
            "data": {
                "outputs": [
                    {
                        "renditions": [
                            {
                                "pageIndex": 1,
                                "path": [
                                    "tmp964721/template_rendition.png"
                                ]
                            },
                            {
                                "pageIndex": 2,
                                "path": [
                                    "tmp964721/template_rendition2.png"
                                ]
                            },
                            {
                                "pageIndex": 3,
                                "path": [
                                    "tmp964721/template_rendition3.png"
                                ]
                            }
                        ],
                        "input": "3PageDoc.indd"
                    }
                ]
            },
            "id": "ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85",
            "state": "COMPLETED",
            "timestamp": 1623913539469
        },
        {
            "eventId": "7e48fd7e-8ffc-4439-b315-3f31da111cb4",
            "id": "ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85",
            "state": "ASSETS_UPLOAD_COMPLETED",
            "timestamp": 1623913539462
        },
        {
            "eventId": "ff08253f-2024-4ab3-b52e-67715fbc7f9f",
            "data": {
                "sizeInBytes": 7489,
                "destination": {
                    "type": "S3",
                    "url": <presigned url for temporary asset>
                },
                "uploadTimeMillis": 238,
                "source": "tmp964721/template_rendition2.png"
            },
            "id": "ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85",
            "state": "ASSET_UPLOAD_COMPLETED",
            "timestamp": 1623913539375
        },
        {
            "eventId": "ab01e522-deeb-41b8-a0c9-c662691b496f",
            "data": {
                "sizeInBytes": 8519,
                "destination": {
                    "type": "S3",
                    "url": <presigned url for temporary asset>
                },
                "uploadTimeMillis": 185,
                "source": "tmp964721/template_rendition3.png"
            },
            "id": "ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85",
            "state": "ASSET_UPLOAD_COMPLETED",
            "timestamp": 1623913539323
        },
        {
            "eventId": "8d264064-d426-4773-8a07-05336dbc1c73",
            "data": {
                "sizeInBytes": 4128,
                "destination": {
                    "type": "S3",
                    "url": <presigned url for temporary asset>
                },
                "uploadTimeMillis": 172,
                "source": "tmp964721/template_rendition.png"
            },
            "id": "ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85",
            "state": "ASSET_UPLOAD_COMPLETED",
            "timestamp": 1623913539308
        },
        {
            "eventId": "fe894b58-2cd9-4184-8d16-ab2c988b7f8f",
            "data": {
                "destination": {
                    "type": "S3"
                },
                "source": "tmp964721/template_rendition2.png"
            },
            "id": "ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85",
            "state": "ASSET_UPLOAD_STARTED",
            "timestamp": 1623913539202
        },
        {
            "eventId": "39278fe7-482d-411c-adc0-3917b62b1f05",
            "data": {
                "destination": {
                    "type": "S3"
                },
                "source": "tmp964721/template_rendition3.png"
            },
            "id": "ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85",
            "state": "ASSET_UPLOAD_STARTED",
            "timestamp": 1623913539196
        },
        {
            "eventId": "0a7940cf-411f-48be-84d6-d737623c34e1",
            "data": {
                "destination": {
                    "type": "S3"
                },
                "source": "tmp964721/template_rendition.png"
            },
            "id": "ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85",
            "state": "ASSET_UPLOAD_STARTED",
            "timestamp": 1623913539154
        },
        {
            "eventId": "3bfff3a6-895f-41ae-a280-3a0fd4e67ef0",
            "data": {
                "total": 1
            },
            "id": "ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85",
            "state": "ASSETS_UPLOAD_STARTED",
            "timestamp": 1623913539134
        },
        {
            "eventId": "4201e4ad-f225-42ad-b3f7-a8b66bb86926",
            "data": {
                "percent": 100
            },
            "id": "ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85",
            "state": "RUNNING",
            "timestamp": 1623913539085
        }
    ],
    "paging": {
        "prevUrl": "https://indesign.adobe.io/api/v1/capability/status/all/ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85?to=1623913539084",
        "nextUrl": "https://indesign.adobe.io/api/v1/capability/status/all/ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85?from=1623913539470"
    }
}
```

__Please note__: The nextUrl can be used to retrieve further status events. 

To check for specific events, please refer to following example, where "ASSET_UPLOAD_COMPLETED" event is looked for.

```curl
curl --location --request GET 'https://indesign.adobe.io/api/v1/capability/status/all/ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85?state=ASSET_UPLOAD_COMPLETED' \
--header 'Authorization: <access_token>' \
--header 'x-api-key: <client_id>'
```

The response corresponding to it is as follows
```json
{
    "events": [
        {
            "eventId": "ff08253f-2024-4ab3-b52e-67715fbc7f9f",
            "data": {
                "sizeInBytes": 7489,
                "destination": {
                    "type": "S3",
                    "url": <presigned url for temporary asset>
                },
                "uploadTimeMillis": 238,
                "source": "tmp964721/template_rendition2.png"
            },
            "id": "ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85",
            "state": "ASSET_UPLOAD_COMPLETED",
            "timestamp": 1623913539375
        },
        {
            "eventId": "ab01e522-deeb-41b8-a0c9-c662691b496f",
            "data": {
                "sizeInBytes": 8519,
                "destination": {
                    "type": "S3",
                    "url": <presigned url for temporary asset>
                },
                "uploadTimeMillis": 185,
                "source": "tmp964721/template_rendition3.png"
            },
            "id": "ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85",
            "state": "ASSET_UPLOAD_COMPLETED",
            "timestamp": 1623913539323
        },
        {
            "eventId": "8d264064-d426-4773-8a07-05336dbc1c73",
            "data": {
                "sizeInBytes": 4128,
                "destination": {
                    "type": "S3",
                    "url": <presigned url for temporary asset>
                },
                "uploadTimeMillis": 172,
                "source": "tmp964721/template_rendition.png"
            },
            "id": "ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85",
            "state": "ASSET_UPLOAD_COMPLETED",
            "timestamp": 1623913539308
        }
    ],
    "paging": {
        "prevUrl": "https://indesign.adobe.io/api/v1/capability/status/all/ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85?state=ASSET_UPLOAD_COMPLETED&to=1623913539307",
        "nextUrl": "https://indesign.adobe.io/api/v1/capability/status/all/ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85?state=ASSET_UPLOAD_COMPLETED&from=1623913539376"
    }
}
```

### Consuming the APIs provided by InDesign Cloud Services
You can find the detailed [API documentation here](https://adobedocs.github.io/indesign-api-docs/). Sample request for some of the APIs are provided below:

#### PDF rendition using pre-signed URL
Creates and returns new PDF from a specific InDesign document. The following example is using pre-signed URL and a custom font
```curl
curl --location --request POST 'https://indesign.adobe.io/api/v1/capability/indesign/rendition/pdf' \
--header 'Authorization: bearer <YOUR_OAUTH_TOKEN>' \
--header 'x-api-key: <YOUR_API_KEY>' \
--header 'Content-Type: application/json' \
--data-raw '{
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
            "destination" : "Abelone-FREE.otf"
        }
    ],
    "params":{
         "jobType":"RENDITION_PDFPRINT",
         "targetDocuments": [
            "Cheese_final.indd"
         ],
         "outputFileBaseString": "template_rendition"
    }
}
```

#### DataMerge - Tags
Retrieves the data merge tags from the document.

```curl
curl --location --request POST 'https://indesign.adobe.io/api/v1/capability/indesign/dataMerge/tags' \
--header 'Authorization: bearer <YOUR_OAUTH_TOKEN>' \
--header 'x-api-key: <YOUR_API_KEY>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "assets": [
        {
            "source": {
                "url":"<YOUR PRE-SIGNED URL>",
                "type":"HTTP_GET"
            },
            "destination" : "dataMergeTemplate.indd"
        },
        {
            "source": {
                "url":"<YOUR PRE-SIGNED URL>",
                "type":"HTTP_GET"
            },
            "destination": "batang.ttc"
        }
    ],
    "params": {
        "jobType": "DATAMERGE_TAGS",
        "targetDocument": "dataMergeTemplate.indd",
        "includePageItemIdentifiers": true
    }
}
```

#### DataMerge - Merge
Creates and returns merged InDesign documents or PDFs that are created after merging the data and the given template.
```curl
curl --location --request POST 'https://indesign.adobe.io/api/v1/capability/indesign/dataMerge/merge' \
--header 'Authorization: bearer <YOUR_OAUTH_TOKEN>' \
--header 'x-api-key: <YOUR_API_KEY>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "assets": [
        {
            "source": {
                "url":"<YOUR PRE-SIGNED URL>",
                "type":"HTTP_GET"
            },
            "destination" : "dataMergeTemplate.indd"
        },
        {
            "source": {
                "url":"<YOUR PRE-SIGNED URL>",
                "type":"HTTP_GET"
            },
            "destination": "Directory_Names.csv"
        }
    ],
    "params": {
        "jobType": "DATAMERGE_MERGE",
        "targetDocument": "dataMergeTemplate.indd",
        "outputType": "PDF",
        "outputFolderPath": "outputfolder",
        "outputFileBaseString" : "merged"
        "dataSource": "Directory_Names.csv"
    }
    "outputs": [ // custom user output
        {
            "destination": {
                "type": "HTTP_PUT",
                "url": "<YOUR PUT-SIGNED URL>"
            },
            "source": "outputfolder/merged.pdf"
        }
    ]
}
```

### Exposing your own APIs
Many times, the requirement of the end user are very specific and cannot be fulfilled in a generic manner. To address these sort of cases, some custom work may be needed to be done.

InDesign Cloud Services exposes a way for third party to come onboard and deploy their custom scripts as end points. The script writer can define the custom attributes and values which will make sense for a particular endpoint. These can be done by deploying capability bundle. To understand more about capabilities, their deployment and using them, please refer to this [documentation](Capability.md).

There are few points which must be kept in mind while writing a script for InDesign Cloud Services.

#### Scripts
To run a script with InDesign Cloud Services, the script should be confirming to what can be run on an InDesignServer. Also the scripts can't be run as is. There are certain assumptions w.r.t. input to the script and output from it, which needs to be modified. These nuances are discussed in the next few sections.

#### Accepting input in script
Executing script relies on the user inputs along with information about the working directory from the platform. All this information is passed to the script via a single argument i.e. "parameters". The structure of the parameters is as follows:

```json
{
    "assets": [
        ...
    ],
    "params": {
        ...
    },
    "jobID": "0c531425-bc82-43c0-89b7-0e851cd56061",
    "workingFolder": <Some path>
}
```
Details of the attributes within the data passed to script is as follows:
<table style="background-color:White;">
  <tr>
    <th>Attribute</th>
    <th>Mapping/Meaning</th>
  </tr>
  <tr>
    <td>assets</td>
    <td>&lt;RequestBody&gt;/assets</td>
  </tr>
  <tr>
    <td>params</td>
    <td>&lt;RequestBody&gt;/params</td>
  </tr>
  <tr>
    <td>jobID</td>
    <td>The job ID</td>
  </tr>
  <tr>
    <td>workingFolder</td>
    <td>The working directory for the job</td>
  </tr>
</table>

The existing scripts will need little tweaking to accept the arguments correctly. So an existing sample script will look like this
```javascript
    var arg1 = app.scriptArgs.get('argument1')
    var arg2 = app.scriptArgs.get('argument2')

    // Some processing
```

To make it work with the InDesign Cloud Services, some tweaking needs to be done. Please follow the steps below to make the script work

1. Send the arguments within the params of the request body
```json
    "params": {
        "argument1": <data corresponding to argument1>,
        "argument2": <data corresponding to argument2>,
        ...
    }
```
2. Within the script, modify the fetching mechanism. Please use the following as a reference script.
```javascript
    var parameters = app.scriptArgs.get('parameters')
    var arg1 = parameters['argument1'] // or var arg1 = parameters.argument1
    var arg2 = parameters['argument2'] // or var arg2 = parameters.argument2

    // Some processing
```
#### Providing output from script
As for the input there would be certain assumptions in the script corresponding to the output to be provided back. Please follow the below instructions to provide the data correctly.

__Execution is successful__

In case of successful execution of the script, the following attributes are expected.
```json
{
    "status": "SUCCESS",
    "assetsToBeUploaded": [
        {
            "path": <url of file to be uploaded, relative to working directory>,
            "data"
        }
    ],
    "dataURL": <url of data file, relative to working directory>
}
```
Caution: Anything outside of these attributes might be logged as data to be investigated.

For creating the return data in case of a success, the following script can be used.
```javascript
var assets = []

/* Creates the package to be returned in case job is successful.
    @param assetsToBeUploaded: Information about the files to be uploaded. 
    @param data: The data in dictionary (object) format to be returned back.
    @return:     the package to be returned 
*/
GetSuccessReturnObj = function (assetsToBeUploaded, data) {
  var obj = {}
  obj.status = 'SUCCESS'
  obj.assetsToBeUploaded = assetsToBeUploaded
  if (data) {
    obj.dataURL = WriteToFile(data)
  } else {
      obj.dataURL = ''
  }
  return JSON.stringify(obj)
}

/* Add an asset which is to be uploaded and sent back to the caller.
    @param assetPath: Path of the file to be uploaded, relative to the working directory.
    @param data: The data in dictionary (object) format to be associated with this asset. This data will be provided to the user with ASSET_UPLOAD_COMPLETED event. e.g. If the asset to be added, looks like this:
        {
            "path" : "design.jpeg",
            "data" : {
                "abcd" : "pqr",
                "xyz" : "mno"
            }
        }
    The ASSET_UPLOAD_COMPLETED will look like:
        {
            ...
            "data":{
                ... //Some metadata added by platform.
                "source":"design.jpeg"
                "abcd": "pqr",
                "xyz": "mno"
            }
        }
*/
AddAssetToBeUploaded = function (assetPath, data) {
  var assetToBeUploaded = {}
  assetToBeUploaded.path = assetPath
  if (data !== undefined) {
    assetToBeUploaded.data = data
  }
  assets.push(assetToBeUploaded)
}

// Actual processing

// Return data
return GetSuccessReturnObj(assets, data)
```

In both the cases above, it can be observed that the data is being shared in a file, and not directly. This is to take care of cases where the data becomes too big to send back. This also helps in keeping the performance optimized. In case no data is to be sent, empty string should be passed in dataURL. Missing dataURL will be treated as an error. A sample write function can be as follows:
```javascript
/* Utility to write the data to be sent back, in a file.
    @param data: Data which is to be written.
    @param filePath: OPTIONAL: The name of the file.
    @return:     the package to be returned 
*/
WriteToFile = function (data, filePath) {
  var fileURL, newFile
  if (filePath === undefined) {
    filePath = 'data.json'
  }
  fileURL = workingDirectory + filePath
  newFile = File(fileURL)
  newFile.encoding = 'UTF8'
  newFile.open('write')
  if (newFile.write(JSON.stringify(data))) {
    // Data was successfully written'
    newFile.close()
    return filePath
  } else {
    // 'Data write failed'
    throw ex
  }
}
```

__Execution failed__

Expected failure object
```json
{
    "status": "FAILURE",
    "errorCode": <Error code>,
    "errorString": <Error Message>,
}
```

The following script can be used as a starting point to create the return object for failed cases.
```javascript
/* Creates the package to be returned in case the job has failed.
    @param assetPath: Path of the file to be uploaded, relative to the working directory.
    @return:     the package to be returned 
*/
GetFailureReturnObj = function (errorCode, errorString) {
  var obj = {}
  obj.status = 'FAILURE'
  obj.errorCode = errorCode
  obj.errorString = errorString
  return JSON.stringify(obj)
}

// Actual processing where some error occurred
return GetFailureReturnObj(errorCode, errorString)
```

#### Logging
While writing your own scripts, debugging forms an important part of the whole process. Likewise, to keep track of what decisions were made during a script execution, one may feel the need to log the steps. To take care of this logging of data can be done during script execution. This can be done in two ways
- Collecting all the logs in an array and then dumping them using a function similar to WriteToFile. This needs to be accompanied with addition of the relative path to list of assets to be uploaded.
- Second way is to log data in the application's log. Following script calls can be used to redirect the provided log to application's log.
```
// The following should come in the application log which can be dumped using generalSettings/appLogs/logsRelativePath
app.consoleout('Logging in app\'s std::out')
app.consoleerr('Logging in app\'s std::err')
```

The application's log can be dumped using generalSettings/appLogs/logsRelativePath
```
"params": {
  "targetDocument": "doc.indd",
  "outputPath": "idmlDoc.idml",
  "generalSettings": {
    "appLogs": {
      "logsRelativePath": "appLog.txt"
    }
  }
}
```

#### Sample script
A sample script can be found under [Example](Example/). The main script is sample.jsx and rest are supporting scripts.

### Guidelines for capability development
There are certain things that a script writer should keep in mind while writing scripts. These points are:

1. __Set appropriate preferences__: Many times the script execution is dependent on the preferences set for the application or the document. Before executing the relevant portion of script, please make sure that the desired preferences are set. As a good practice, reset the preferences to their original value once the execution is complete.
2. __No socket programming__: The container running the script is a closed one and any kind of socket programming is discouraged.
3. __Work within the working directory__: For a job, working directory is the designated space for the script to work on. Scripts are supposed to be working on files within this and are not supposed to look outside.
4. __Code Readability Requirements__: Developers must not obfuscate the code or conceal the functionality of their capability. This also applies to any external code or resource fetched by the extension package. Minification is allowed, including the following forms:
    - Removal of whitespace, newlines, code comments, and block delimiters
    - Shortening of variable and function names
    - Collapsing files together
5. __Refrain from performing the following activities__:
    - Facilitate unauthorized access to content on websites, such as circumventing paywalls or login restrictions
    - Encourage, facilitate, or enable the unauthorized access, download, or streaming of copyrighted content or media
    - Enumerate system resources such as files, networking configuration, etc.
    - Mine cryptocurrency

### Current Limitations
There are a few limitations to the APIs you should be aware of ahead of time:
- Error handling is a work in progress. Sometimes you may not see the most helpful of messages

### Retries
For increased reliability and stability we have added a retry mechanism for all API calls, and have some recommendations on how to handle these:
- You should only retry requests that have a 5xx response code. A 5xx error response indicates there was a problem processing the request on the server.
- You should implement an exponential back-off retry strategy with 3 retry attempts.
- You should not retry requests for any other response code.
