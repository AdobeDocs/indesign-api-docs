# InDesign Cloud Services

## Introduction
The InDesign Cloud Services enables you to make edit, query data, and run workflows on an ID file. This document will help you onboard to the services, familiarize you with the available features, and get you started with some basic usage examples.
## Onboarding & setup
### OnBoarding
1. The user should be registered on [Developer Pre-release program](https://www.adobeprerelease.com/beta/D1A76A97-F7DC-4552-DE3C-FF5F211C7492/apply) (This would bind the developer to NDA).
2. The user should fill up this [form](https://forms.office.com/Pages/ResponsePage.aspx?id=Wht7-jR7h0OUrtLBeN7O4b96s5AZBCJOvELTJf9VO8hUQTBCMjhZTjVIS0VYQzFGN1lFVjVSM0JROC4u) for being a part of the Beta program of InDesign Cloud Services.

After this, we will be shortlisting and enroll the developers in the beta program. We will be sharing the client_id and client_secret and other relevant details with individual developers.

### Setup
You must generate an access token using the details shared above and follow these steps to setup:

1. Download the [node](https://nodejs.org/en/download/) and install it on your machine.
2. Download and extract the [sample code](https://github.com/AdobeDocs/adobeio-auth/tree/stage/JWT/samples/adobe-jwt-node).
3. Edit the contents of the config file (config.js) by replacing relevant data for clientId , clientSecret, and other attributes from the data shared with you at the time of acceptance.
4. Execute.
    ```
    npm install
    node app.js
    ```
After successfully completing the above steps, you’ll get an 'access_token' in response. The token will be valid for 24hrs, after which you must re-generate it. Use this token in your API calls to make them work.

## Accessing APIs

InDesign Cloud Services support two types of authentication :

1. __Service Account Integration__: For service-to-service integrations, you will need a JSON Web Token (JWT) that encapsulates your client credentials and authenticates the identity of your integration. You then exchange the JWT for the access token that authorizes access.
2. __OAuth integration__: (Coming soon) If your integration needs to access content or a service on behalf of an end user, that user must be authenticated as well. Your integration must pass the OAuth token granted by the Adobe IMS.

    Here’s a skeleton cURL request to accessing the APIs :
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
## Working with the InDesign Cloud Services
You can use InDesign Cloud Services in two ways:

1. Consume the APIs provided by InDesign Cloud Services. You can find the [API documentation here](https://adobedocs.github.io/indesign-api-docs/).
2. Expose your own APIs with the help of custom scripts. You can find the documentation [here](#exposing-your-own-apis).

We will cover both scenarios in the coming sections, but first, let us go over the common points. We'll discuss various points below and; their examples can be seen in conjunction with the API documentation shared above.
### Understanding body of the request
As shown in the [skeleton request](#accessing-apis) above, there are three main parts of the body of the request. Here’s the information to understand these parts and their significance:

1. "assets": This part is where the caller can specify input assets for the request to be processed successfully. More information can be found [below](#provide-input-assets).
2. "outputs": Specify the locations where to upload the output assets. You can find More more details can be found here[below](#provide-output-assets). In the absence of this, the outputs assets are stored in a temporary repository, and a pre-signed URL will be shared for those assets, which will be valid for 24hrs.
3. "params": Specify information regarding what to do with the input assets.

    You can refer to [API documentation](https://adobedocs.github.io/indesign-api-docs/) for more details.
### Provide input assets
The platform supports multiple asset types. These asset types signify storage repositories from which the platform can download. You can provide the input asset information within the "assets" array . Here are the supported types :
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
In all the above examples, you can view that data is divided into source and destination. The first attribute, `'source'` is where the asset is downloaded from. The second attribute `'destination'` refers to the location where the asset would be downloaded to. You can find more information in below sections.

### Provide output assets
Like input assets, the platform supports multiple asset types for output as well. These asset types signify storage repositories to which platform can upload. You can provide this information in the `"outputs"` array within the body of the request. 
Here are the supported types:

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
Here are the supported storage types to refer your assets from:

- AWS S3: Use a presigned GET/PUT/POST URL
- Dropbox: Generate temporary upload/download links using [link](https://dropbox.github.io/dropbox-api-v2-explorer/)
- Azure: Use a Shared Access Signature (SAS) in Azure Storage, for GET/PUT/POST operations.
## Links & Working directory
Links is one of the most important features of InDesign. You can place and link content within the same document or even across different documents. This also helps in keeping the assets and the document decoupled. Links can be corresponding to texts, graphics etc.

* InDesign APIs support the processing of documents with links. 
* To process a request, a temporary folder/directory is created. which is called as the working directory for the request.
* All the input assets mentioned in the request are downloaded and kept in the working directory.
* Within the working directory the location of individual asset is governed by the relative path mentioned in the 'destination' attribute.
* Please note, that to refer to the same asset in the rest of the params, the value mentioned in the destination property is to be used.

You can use the following ways to make links work, it can be done in two ways:
1. Maintaining relative paths of assets to the target document. While doing this, you need to  place the files outside of the working directory.
2. If you place the linked assets parallel to the target document, the links get resolved and the assets are picked.

Sometimes the documents contain custom links which are not understood by InDesign. To enable proper execution of the job, the custom URLs can be relinked to assets provided in the request. 
Here’s an example for this:
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
In this example the existing URI `"customScheme:4c189e2d-315e-4fab-a8c2-45690e44d1f0"` in document `"TargetDocument.indd"` cannot be interpreted by InDesign by itself. The caller would have provided an input asset with `"destination"` attribute as `"SomeAsset.png"`.

By using the above example the caller is asking to relink the links with specified URI to be relinked to the new asset which is present at <Working_Directory>/SomeNewAsset.png

<br>

## Fonts
Just like links, fonts are also very important. The support of fonts is as follows:
### Adobe fonts
Adobe fonts are currently supported only with [OAuth integration](#accessing-apis) where the end user can be identified. These are not yet supported with [Service account integration](#accessing-apis). 
* The fonts are fetched automatically, on behalf of the requestor and thus nothing needs to be done while making a request. 
* The list of supported fonts is dependent on the account used to make the call.
* Platform iterates over all the InDesign documents brought in the temporary working directory. Then pre-job is executed.
* As a pre-job step, these documents are opened and, the list of Adobe fonts is extracted from it. These documents are closed, and fonts are downloaded.
* When the fonts' download is complete, the actual job script is run.

Here are cases where the search from Adobe Fonts will not help : 
1. When the Adobe fonts are not being used in the document, hence it does not make sense to open the document and search for those.

2. Where the service account integration is used for connecting with the APIs.

In these scenarios, the caller has the option to skip the font search. For more details please look at the [Optimisation](#optimizations) section.
Here’s an example, where a specific document is to be searched for Adobe Fonts:
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
For more information around this, please refer to the API documentation.
### Custom fonts
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
For the fonts to be picked properly, please place it in the "Document Fonts" folder parallel to the document which uses it. Or, if the fonts are kept under some other folder say like "fontFolder", please specify the font directory as follows:
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
### Optimizations
There are certain optimizations which a user can employ to make the APIs more performant.

1. If the font directories are to be added, don’t use the directories with InDesign documents, as opening of these files will create additional lock files and will in turn trigger recalculation of the font resources. 
As a best practice, try to keep the fonts in "Document Fonts" or in an isolated directory. If all the hierarchy of the downloaded fonts have been properly mentioned as lying in "Document Fonts" folder parallel to individual documents then following can be used to bring in a level of optimization. This will avoid addition of any font directory and might thus result in performance benefits.
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
2. Skipping the Adobe fonts search is another way to optimize the call. It can be done by providing includeDocuments as an empty array.
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
### Get the status of a job
Now that the request is sent, how can one get the status of the request. This is demonstrated with an example below. Suppose the user triggers a rendition call with a 3 page document, the request will look something like this:
```curl
curl --location --request POST 'https://indesign.adobe.io/api/v1/capability/indesign/rendition/png' \
--header 'Authorization: bearer <access_token>' \
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
* `"id"`: Corresponds to the jobID. Use this to know the status.
* `"latest"`: Use this to get the latest status event of the job.
* `"all"`: Use this to get all the status events in a paginated format.


__Latest__ request
Use this to get the latest event generated in the process.
```curl
curl --location --request GET 'https://indesign.adobe.io/api/v1/capability/status/ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85' \
--header 'Authorization: bearer <access_token>' \
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
--header 'Authorization: bearer <access_token>' \
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

__Please Note__: You can use the nextUrl to retrieve further status events.

Here’s an example to check for specific events, please refer to following example, where "ASSET_UPLOAD_COMPLETED" event is looked for.

```curl
curl --location --request GET 'https://indesign.adobe.io/api/v1/capability/status/all/ee9f6ee4-ea8c-40d5-a548-f7a0e5a2ca85?state=ASSET_UPLOAD_COMPLETED' \
--header 'Authorization: bearer <access_token>' \
--header 'x-api-key: <client_id>'
```

Here’s the response corresponding to it :
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
## Consume the APIs provided by InDesign Cloud Services
You can find the detailed [API documentation here](https://adobedocs.github.io/indesign-api-docs/). Here are some sample requests for the APIs :

### PDF rendition using pre-signed URL
Creates and returns new PDF from a specific InDesign document. The following example uses pre-signed URL and a custom font
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
### DataMerge - Tags
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

### DataMerge - Merge
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

## __Exposing your own APIs__
Many times, the requirements of the end users are very specific and cannot be fulfilled in a generic manner. Some custom work may be needed to address these cases,.

InDesign Cloud Services exposes a way for third- party developers to come onboard and deploy their custom scripts as end points. The script writer can define the custom attributes and values which will make sense for a particular endpoint. These can be done by deploying the capability bundle. To understand more about capabilities, their deployment and using them, please refer to this [documentation](Capability.md).

There are few points which must be kept in mind while writing a script for InDesign Cloud Services.

* To run a script with InDesign Cloud Services, the script must be compatible to run with InDesignServer. However, any script that can be run on InDesignServer can't be run as is.

* While writing a new script or modifing exisiting scripts for InDesign Cloud Services, there are few nuances which the developer must takecare with respect to "input to the script" and "output" from script”. These nuances are discussed in the next few sections.

### __Accepting input in custom script__

* Case 1 : Script does not require any input/argument.

    In this case, system by default send string type argument named `"parameters"` as following:
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
    The above mentioned json will be received in the form of `"string"`. Which further needs to be parsed inside the script to retrive the value of attributes. In this case `"params"` attribute will be empty. Since, the script does not need an argument.

*   Case 2 : Script accepts some input argument.
In this case, system by default  send string type argument named `"parameters"` which also, include input arguments e.g. "arg1", "arg2".
    
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
        <td>This contain list of input assets. like indd,pdf or jpeg etc.</td>
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
        <td>The working folder for the job. This is the base directory. Inside this directory all the assets and scripts downloaded. e.g c:\\baseFolder\assets </td>
      </tr>
    </table>
    
    </br> 


    Here’s the sample input and sample script code to open document and close a document.

    * Sample Input request body
        ```json
        {
            "assets": [
                {
                    "source": {
                        "type": "HTTP_GET",
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

### __Providing output from custom script__

A developer must follow certain rules in order to output data, file or log from a script. Please follow these instructions to provide output correctly :

* __Execution is successful__

    The following attributes are expected in return as json string, if the script execution is successful.

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
        <td>This should have path of json file w.r.t working folder. And it should be created inside working folder</td>
        <td>Mandatory</td>
      </tr>
      <tr>
        <td>status</td>
        <td>Status of execution (SUCCESS/FAILURE)</td>
        <td>Mandatory</td>
      </tr>
      <tr>
        <td>assetToBeUploaded</td>
        <td>Array for assets that need to uploaded. This can be empty</td>
        <td>Mandatory</td>
      </tr>
    </table>

    </br>



    * Here’s a sample code returning a successful execution. Without data and without any output file.
        ```javascript
        /* Creates object to be returned when job is successful. object should be    stringify  before returning. 
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
        /*  Creates object to be returned when job is successful. Data is written into a json file, which should be created inside working folder.
            @param data: The data in dictionary (object) format to be returned back.
            Object should be stringifiedy before returning. 
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

    * Here’s a sample code returning a successful execution. With/Without data and with output file.
        ```javascript
        /*  Create array of asset which is to be uploaded and sent back to the caller.
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
    * In the above cases, it can be observed that the data is being shared in a json file, and not directly. This is to take care of cases where the data becomes too big to send back.
    * In case no data is to be sent, empty string should be passed in 'dataURL'.
* __Execution failed__

    In case of failed execution of the script, the following attributes are expected in return as json string.
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
    @param errorString: Description about error.
    @return: json string.
    */

    function GetFailureReturnObj(errorCode, errorString) {
        var obj = {}
        obj.status = '‘FAILURE'’
        obj.errorCode = errorCode
        obj.errorString = errorString
        return JSON.stringify(obj)
    }
    ```

### __Logging__
While writing your own scripts, debugging forms an important part of the whole process. Likewise, to keep track of what decisions were made during a script execution, one may feel the need to log the steps. You can log the data during script execution. This can be done in two ways

- Collecting all the logs in an array and then dumping them with a function similar to WriteToFile. This must be accompanied with addition of the relative path to list of assets to be uploaded.
- Second way is to log data in the application's log. You can use the following script calls to redirect the provided log to application's log.
    ```javascript
    // The following should come in the application log, which can be dumped using      generalSettings/appLogs/logsRelativePath
    app.consoleout('Logging in app\'s std::out')
    app.consoleerr('Logging in app\'s std::err')
    ```
    You can dump the application's log into a file, with the addition of `"generalSetting"` as mentioned below:.
    ```json
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

### __Complete Sample script__
A sample script can be found under [Example](Example/). where the main script is sample.jsx and rest are supporting scripts.
- This script has the functionality to create `idml` from indesign document.
- This script can be treated as a baseline script that has the handling of input and output.

### __Guidelines for capability development__
Here are a few things that a script writer must keep in mind while writing scripts. These points are:

1. __Set appropriate preferences__: Many times the script execution is dependent on the preferences set for the application or the document. Before executing the relevant portion of script, please ensure that the desired preferences are set. As a good practice, reset the preferences to their original value once the execution is complete.
2. __No socket programming__: The container running the script is a closed one and any kind of socket programming is discouraged.
3. __Work within the working folder__: For a job, working folder is the designated space for the script to work on. Scripts are supposed to be working on files within this and are not supposed to look outside.
4. __Code Readability Requirements__: Developers must not obfuscate the code or conceal the functionality of their capability. This also applies to any external code or resource fetched by the extension package. Minification is allowed, including the following forms:
    - Removal of whitespace, newlines, code comments, and block delimiters
    - Shortening of variable and function names
    - Collapsing files together
5. __Refrain from performing the following activities__:
    - Facilitate unauthorized access to content on websites, such as circumventing paywalls or login restrictions
    - Encourage, facilitate, or enable the unauthorized access, download, or streaming of copyrighted content or media
    - Enumerate system resources such as files, networking configuration, etc.
    - Mine cryptocurrency

### __Current Limitations__
Here are a few limitations to the APIs you should be aware of ahead of time:
- Error handling is a work in progress. Sometimes you may not see the most helpful of messages.

### __Retries__
For increased reliability and stability we have added a retry mechanism for all API calls, and here are some recommendations on how to handle these:

- You should only retry requests that have a 5xx response code. A 5xx error response indicates there was a problem processing the request on the server.
- You should implement an exponential back-off retry strategy with 3 retry attempts.
- You should not retry requests for any other response code.