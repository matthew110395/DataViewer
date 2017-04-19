Setup
=====

Requirements

-   Linux Server (Ubuntu 16.04 used in development)
-   Git
-   NodeJS
-   NPM
-   Python 2.7
-   Python Pip
-   Apache Spark
-   PM2 (Production Node Server)

Installation

To install git run

sudo apt-get install git

To install NodeJS and NPM run the following commands

sudo apt-get install nodejs

sudo apt-get install npm

sudo ln -s /usr/bin/nodejs /usr/bin/node

To install Pip run the following

sudo apt-get install python-pip

To install Apache Spark follow the following tutorial

<https://www.tutorialspoint.com/apache_spark/apache_spark_installation.htm>

then add the following to \~/.profile

export SPARK\_HOME=/usr/local/spark

export
PYTHONPATH=\$SPARK\_HOME/python:\$SPARK\_HOME/python/build:\$PYTHONPATH

export
PYTHONPATH=\$SPARK\_HOME/python/lib/py4j-0.10.4-src.zip:\$PYTHONPATH

To install PM2 run the following command

sudo npm install pm2 –g

When the above has been completed, create a folder for the application
then navigate into the folder. Then get the application from GitHub by
running the following command.

git clone <https://github.com/matthew110395/DataViewer.git>

Then run the following command

Npm install

Then navigate to the Twitter folder and run the following command

pip install -r requirements.txt

Navigate to the parent directory and run the following command to start
the server

Pm2 start server.js

To connect to the Twitter API, the app must be registered with Twitter.

1.  Browse to <https://apps.twitter.com/>
2.  Click Create an Application
3.  Enter Information about your application
4.  Click Create Application
5.  Click the Keys and Access Tokens Tab
6.  Click Create my access token at the bottom of the page
7.  Note the consumer key, consumer secret, access token and access
    token Secret
8.  Enter the above details into the configuration screen of the data
    viewer application
