# FAQs - InDesign APIs

[1. What is the difference between InDesign Server and InDesign
APIs?](#FAQsInDesignAPIs-WhatisthedifferencebetweenInDesignServerandInDesignAPIs?)

[2. What is the general workflow of calling an InDesign API?](#FAQsInDesignAPIs-WhatisthegeneralworkflowofcallinganInDesignAPI?)

[3. What do I do if an API call fails?](#FAQsInDesignAPIs-WhatdoIdoifanAPIcallfails?)
[4. What are the file storage types supported by InDesign APIs?](#FAQsInDesignAPIs-WhatarethefilestoragetypessupportedbyInDesignAPIs?)

[5. What is the maximum number of assets we can pass in a single payload?](#FAQsInDesignAPIs-Whatisthemaximumnumberofassetswecanpassinasinglepayload?)

[6. What if my customer wants to know their usage?](#FAQsInDesignAPIs-Whatifmycustomerwantstoknowtheirusage?)

[7. What are the rate limits for the InDesign API?](#FAQsInDesignAPIs-WhataretheratelimitsfortheInDesignAPI?)

[8. Can the customer request that the rate limits be changed?](#FAQsInDesignAPIs-Canthecustomerrequestthattheratelimitsbechanged?)

[9. What are the current limitations?](#FAQsInDesignAPIs-Whatarethecurrentlimitations?)

### 1. What is the difference between InDesign Server and InDesign APIs?

The InDesign Server is a headless application that lets users run
InDesign scripts on their machines. Via InDesign Server, users can
automate a variety of workflows like 'Publishing
Automation', 'Database Publishing', and 'Template Editing' on their
 local machines.

 InDesign APIs offer a variety of InDesign Server capabilities as
 service endpoints. The supported capabilities can be found here: [[API
 Documentation]](https://adobedocs.github.io/indesign-api-docs/)

### 2. What is the general workflow of calling an InDesign API?

 The general workflow for consuming an InDesign API requires making
 cURL requests to generate a proper authentication token (which expires
 every 24 hours) and then calling one of the InDesign APIs. You can
 find the details about the both the API structures here: [[API
 Overview]](https://github.com/AdobeDocs/indesign-api-docs?tab=readme-ov-file)

### 3. What do I do if an API call fails?

 For increased reliability and stability, we have added a retry
 mechanism for all API calls, and here are some recommendations on how
 to handle these:

-   You should only retry requests with a 5xx response code. A 5xx error
     response indicates there was a problem processing the request on
     the server.

-   You should implement an exponential back-off retry strategy with 3
     retry attempts.

-   You should not retry requests for any other response code.

### 4. What are the file storage types supported by InDesign APIs? 

 Here are the supported storage types to refer your assets from:

-   AWS S3: Use a pre signed GET/PUT/POST URL.

-   Dropbox: Generate temporary upload/download links
     using [[link]](https://dropbox.github.io/dropbox-api-v2-explorer/).

-   Azure: Use a Shared Access Signature (SAS) in Azure Storage, for
     GET/PUT/POST operations.

 If any other storage system support is required, please contact our
 team to request the new storage system.

### 5. What is the maximum number of assets we can pass in a single payload?

 The maximum number of assets (input+output) a user can pass in a
 single payload is 99.

### 6. What if my customer wants to know their usage?

 Customers must request reporting through their AE, CSM, or sales
 contact. On an ad-hoc basis, Adobe will provide customer usage to
 enterprises. Please stay tuned for a DL for requesting customer usage

### 7. What are the rate limits for the InDesign API?

 The soft limit is 250 requests/min after which the user will
 experience delayed responses. The hard limit is 350 requests/min,
 meaning user can\'t make more than 350 requests in a minute.

### 8. Can the customer request that the rate limits be changed?

 Upon request, we can increase the rate limits for a customer (based on
 their tier). However, it can be increased only for a specific
 technical account. Please note the following:

-   Internally, the rate limit will be tied to technical accounts.
     However, we should communicate them as org-wide rate limits to the
     customers.

-   We will also monitor the rate limit across all technical accounts
     (usage limit) within an org for abuse and escalate if necessary.

-   This sheet captures projected tiered-level rate limits. (Use this
     document only as a reference. The final numbers should be
     consulted with the finance and legal teams before being promised
     to customers.)

### 9. What are the current limitations?

 Here are a few limitations to the APIs you should be aware of ahead of time:

-   Error handling is a work in progress. Sometimes, you may not see the most helpful of messages.
