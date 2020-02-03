# OnStage Frontend Application

This is a react.js application that connects to the solr backend of onstage, to retreive documents from the index and the images. To run OnStage these elements are necessary:

* IIIF image server serving the images
* TEI files formatted with metagata for each program and pointers to the images and OCR data
* Solr Installation (see https://github.com/rism-ch/onstage-backend)
* Manifest server (https://github.com/rism-ch/onstage-backend) to retreive IIIF documents from the TEI documents
* Optional static pages

## Basic installation and configuration

OnStage is made to be compiled on a host machine and deployed to the target server via gulp, so no installation of components on the server is necessary. The first step is setting up the local dev environment, secondly the apache server on the target.

### OnStage Development installation

#### Installation

pull the repo (remember! this is on a _local_ machine) and make sure you have the basic components installed:

```bash
sudo apt install npm gulp
git clone https://github.com/rism-ch/onstage-frontend
cd onstage-frontend
npm install
```

The static pages can be in `static/` in the `onstage-frontend` root directory. These will be static pages that are accessible in onstage-host/page/xxx (for example, a page called about.en.md in `static/` will be accessibe at `example.com/page/abaout`). Note that the pages are localized, so the name is in the format `name.code.md`, such as `about.en.md` or `about.de.md`. Missing language translations will show a "missing page" error.
The static pages can be on a different repo, for example

```bash
git clone https://github.com/rism-ch/onstage-texts static
```

Static pages are built atuomatically.

#### Build

Simply run in the onstage-frontend root:

```bash
npm run build
```
