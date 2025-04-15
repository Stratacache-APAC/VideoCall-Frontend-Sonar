# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This project contains UI React Application for Video call

## Start Local Dev Server

In the project directory, you can run:

## Step 1

### `npm install`

## Step 2
Change the start and build script in package.json file to below :

### `"start": "react-scripts start",`
### `"build": "react-scripts build",`

## Step 3
In Service.js file Change the server to localhost as shown below:
### `const SERVER = 'http://localhost:5000'`

## Step 4
In wssConnection.js file Change the server to localhost as shown below:
### `const SERVER = 'http://localhost:5000'`
### `const SERVER = 'http://localhost:3000'`

## Step 5
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.




## steps to import and update certificates  ##

update the ur network ip in  req.cnf 
CN ='your_ip'
IP.1 = 'your_ip' 


if multiple ips 
IP.1 = 'your_ip' 
IP.2 = 'your_ip' 
IP.3 = 'your_ip' 
IP.4 = 'your_ip' 

reveal req.cnf in file explorer 
cmd  for that folder location 
run the below cammand
`openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf -sha256`
run the project and download te certificates from the browers

##  steps to place the cerificate ##
open chrome settings > prvacy and security >   security > manage certificates > trusted root certificates > 
add latest certificate there 


