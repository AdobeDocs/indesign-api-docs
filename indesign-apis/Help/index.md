# Help

## Best practices 

There are specific optimizations that a user can employ to make the APIs
more performant.

- If the font directories are to be added, don't use them with InDesign documents, as opening these files will create additional lock files and, in turn, trigger recalculation of the font resources.
- As a best practice, try to keep the fonts in “Document Fonts” or in an isolated directory. If the hierarchy of the downloaded fonts has been properly mentioned as lying in the “Document Fonts” folder parallel to individual documents, then the following can be used to bring in a level of optimization. This will avoid the addition of any font directory and might result in performance benefits. 

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
## API Limitations

Here are a few limitations to the APIs you should be aware of ahead of
time:

-   InDesign APIs support only following storage types to refer your
    assets from:

    -   AWS S3

    -   Dropbox

    -   Azure

-   For increased reliability and stability, we have added a retry
    mechanism for all API calls, and here are some recommendations on
    how to handle these:

    -   You should only retry requests that have a 5xx response code. A
        5xx error response indicates there was a problem processing the
        request on the server.

    -   You should implement an exponential back-off retry strategy with
        3 retry attempts.

    -   You should not retry requests for any other response code.

-   Allowed Origins and Allowed Domains

    -   We support only a specific set of Origins and Domains. In case
        if you using some different origin/domain, please reach out to
        adobe in order to whitelist those origins/domains.