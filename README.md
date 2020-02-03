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

This will create `build/index.bundle.js` and `build/index.html` which can be copied to the server. It is best to deploy as described later.

#### Run in development

`npm start`

#### Deployment

Deployment requires configuring the gulpfile to connect to the server. The server must be already setup and installed (see later) and configured to have access from the host machine via ssh with key authentication. First copy the example file to the real one:

```bash
cp DUMMYgulp.config.js gulp.config.js
```

Next, customize it to the settings used. Since the ssh key password is inserted in clreartext, it is desirable to have a dedicated ssh key.

Some items to configure:

```
WEB_SERVER_BASE_PATH -> Installation top level path, /var/www
host -> target host
username -> user to log in as
passphrase -> ssh key passphrase
privateKey -> your local private key (unlocked by the passphrase), complete path!
```

The key must be in PEM format or it will not work.

```bash
ssh-keygen -m PEM -t rsa -b 4096 ...
````

Once gulp is configured, it should be possible to deploy to the target machine:

```bash
npm run deploy
```
