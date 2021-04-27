# Traveler Blog (server)
This is the final project for the Cloud Developer course.

The project implement a Travel Blog website, 
where every traveler can share his experiences with each others.

This project use the following AWS services:
- AWS X-RAY: to trace operatione
- S3: to store image
- DynamoDB: to store data of a todo item
- AWS Lambda: to process data and incoming request
- AWS API Gateway: to expose front-end API
- AWS SNS : simple notification service to get notification from upload image to S3
- Auth0: to implement users access with JWT Token

## Requirements
The NOdeJs target runtime for AWS is **nodejs-14.x**.

## Install tools
To deploy project in AWS  need to install _serverless_ app:

``
npm install -g serverless
``

## Install package
To install all package (node_modules) run:

``
npm install
``

## Deploy
To deploy the application need AWS credential create all resources.
Check the _profile_ used in _serverless.yml_ file and change it.

``
serverless deploy -v
``

To increase nodejs memory during compilation phase it's necessary to increase **--max-old-space** parameter by using command:

``
export NODE_OTIONS="--max-old-space-size=8192"
``


