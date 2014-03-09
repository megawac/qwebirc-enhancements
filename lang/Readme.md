#Localization

Localization will request files based on the `Accept-Language` in a http request. For instance `Accept-Language=en-US,en;q=0.8,es;q=0.6` will compile a response of `en-US.json + en.json + base.json` assuming they all exist.

Requires a server with localization (see [this commit](https://github.com/megawac/iris/commit/fed82b8a6a4c9168fda4ee12a657fde5bddfc337))

Files in this directory will be converted to minified json in the build step.