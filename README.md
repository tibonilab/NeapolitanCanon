# NeapolitanCanon

This repository contains the *frontend* application codebase and the whole *dataset* for "NeapolitanCanon" project.

```
/src              # frontend
/dataset          # dataset
```


## Development
Pull the repository and make sure you have the basic components installed on your machine:

```bash
sudo apt install npm gulp
git clone https://github.com/tibonilab/NeapolitanCanon
cd NeapolitanCanon
npm install
```

### Frontend
Frontend application is a single page application built on top of react.js, you can launch the dev server with

```bash
npm start
```

## Deployment
Deployment requires configuring the gulpfile to connect to the server. The server must be already setup and configured to have access from the host machine via ssh with key authentication.

### Environments
The gulpfile is designed to automate _staging_ or _production_ deployment. 

In order to let this work you have to create 2 different gulp configuration files.

```bash
# Create production config file
cp DUMMYgulp.config.js gulp.config.js

# Create staging config file
cp DUMMYgulp.config.js gulp.staging.config.js
```

Next, open your config files and customize them for your needs.

You can switch the config file imported in the `gulpfile.js` file in order to switch the environment.



### Frontend configurations
Since the data is all retrieved from public JSON, it is necessary to configure the Manifest server endpoints and the dev server to reach the `/public/dataset.json` file in `webpack.config.js` file.


```js
    // here it is the local server configuration
    proxy: {
        '/public/**': {
            target: 'http://localhost/path/to/local/dataset/',
            ...
        },
        ...
    },
```

And 

```js
    // here it is the endpoint for Diva JS manifest server
    DIVA_BASE_MANIFEST_SERVER: environment.production
        ? JSON.stringify('https://my-host.com/public/manifests/')
        : JSON.stringify('/public/manifests/'),
```

### Deployment tasks

To deploy frontend, backend and dataset simply run

```bash
npm run deploy
```

you can otherwise use one of the following commands to update a peculiar aspect of the application

```bash
# Deploy frontend application
npm run deploy:frontend

# Upload the dataset
npm run deploy:dataset
```

### Frontend Apache configuration
Apache requires no special configuration, excepy for a Rewrite to make the paths availabe in react

```apache
VirtualHost ip:80>
    ServerName my-host.com

    # Tell Apache where your app's code directory is
    DocumentRoot /var/www/NeapolitanCanon

    # Relax Apache security settings
    <Directory /var/www/NeapolitanCanon>
      Allow from all
      Options -MultiViews
      # Uncomment this if you're on Apache >= 2.4:
      #Require all granted

        <IfModule mod_rewrite.c>
            <IfModule mod_negotiation.c>
                Options -MultiViews
            </IfModule>

            RewriteEngine On

            # Serve Client Application
            RewriteCond %{REQUEST_FILENAME} !-d
            RewriteCond %{REQUEST_FILENAME} !-f
            RewriteCond %{REQUEST_URI} ^(.).
            RewriteRule ^(.*)$ index.html [L]
        </IfModule>

    </Directory>

    Header set Access-Control-Allow-Origin "*"

</VirtualHost>
```