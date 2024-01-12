# Edge Data Store Grafana Data Source Plugin Sample

**Version:** 1.0.0

[![Build Status](https://dev.azure.com/osieng/engineering/_apis/build/status/product-readiness/ADH/osisoft.sample-adh-grafana_backend_plugin-datasource?repoName=osisoft%2Fsample-adh-grafana_backend_plugin-datasource&branchName=main)](https://dev.azure.com/osieng/engineering/_build/latest?definitionId=4858&repoName=osisoft%2Fsample-adh-grafana_backend_plugin-datasource&branchName=main)

This sample demonstrates how to build a [Grafana](https://grafana.com/) data source plugin that runs queries against the Sequential Data Store (SDS) of the Edge Data Store (EDS). The sample performs normal "Get Values" calls against a specified stream in SDS, using the time range of the Grafana dashboard.

## Requirements

- [Grafana 8.3+](https://grafana.com/grafana/download)
- Web Browser with JavaScript enabled
- [NodeJS](https://nodejs.org/en/)
- [Git](https://git-scm.com/download/win)
- If building the plugin, a Linux OS or WSL for Windows is required. Referr to [grafana's troubleshooting documentation](https://grafana.com/developers/plugin-tools/troubleshooting) for more information. 
- The browser must be running locally on a device running the Edge Data Store

## Getting started

1. Copy this folder to your Grafana server's plugins directory, like `.../grafana/data/plugins`
1. (Optional) If using other plugins, rename the folder to `aveva-eds-datasource`
1. Open a command prompt inside that folder
1. Install dependencies, using `npm install`
1. Build the plugin, using `npm run build` (or `npm run dev` for browser debugging)
1. Restart the Grafana server to load the new plugin
1. Open the Grafana configuration and set the parameter `allow_loading_unsigned_plugins` equal to `aveva-eds-datasource` or to the name of the folder set in step 2 (see [Grafana docs](https://grafana.com/docs/grafana/latest/administration/configuration/#allow_loading_unsigned_plugins))
1. Add a new Grafana datasource using the sample (see [Grafana docs](https://grafana.com/docs/grafana/latest/features/datasources/add-a-data-source/))
1. Enter the port that EDS is running on
1. Open a new or existing Grafana dashboard, and choose the `AVEVA Edge Data Store (SAMPLE)` as the data source
1. Enter your Stream, and data will populate into the dashboard from the stream for the dashboard's time range

## Running the Sample with Docker

1. Open a command prompt inside this folder
1. Build the container using `docker build -t grafana-eds .`  
   _Note: The dockerfile being built contains an ENV statement that creates an [environment variable](https://grafana.com/docs/grafana/latest/administration/configuration/#configure-with-environment-variables) that overrides an option in the grafana config. In this case, the `allow_loading_unsigned_plugins` option is being overridden to allow the [unsigned plugin](https://grafana.com/docs/grafana/latest/administration/configuration/#allow_loading_unsigned_plugins) in this sample to be used._
1. Run the container using `docker run -d --name=grafana-eds -p 3000:3000 grafana-eds`
1. Navigate to localhost:3000 to configure data sources and view data

## Running the Automated Tests on Frontend Components

1. Open a command prompt inside this folder
1. Install dependencies, using `npm install`
1. Run the tests, using `npm run test`

## Running the Automated Tests on Backend Components

1. Open a command prompt inside this folder
1. Install dependencies, using `go mod tidy`
1. Run the tests, using `go test`

---

For the main ADH page [ReadMe](https://github.com/osisoft/OSI-Samples-OCS)  
For the main samples page [ReadMe](https://github.com/osisoft/OSI-Samples)
