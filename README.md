## Udacity Cloud Developer Nanodegree - Capstone Project

This is the Capstone Project for the Cloud Developer Udacity Nanodegree.

This project leveraged the code for the [Serverless Project](https://github.com/udacity/cloud-developer/tree/master/course-04/project/c4-final-project-starter-code), which is part of section **5. Develop & Deploy Serverless App** of the course.

## Functionality

This project implements a simple Grocery shopping list.

## Features

The project deploys a serverless backend stack to Amazon AWS, comprised of:

* An API Gateway instance, which calls AWS Lambda functions depending on the endpoint reached
* A DynamoDB instance as a NoSQL database, consisting of:
    * A table containing **grocerieId** as main key
    * The following attributes: **userId**, **createdAt**
    * The **userId** as global secondary index, such that each user has their groceries list
* A S3 bucket to store images of groceries
* Lambda Functions that implement:
    * the Database queries operations, following a REST structure
    * the image file upload routine (gets a presigned upload URL)
    * the user authentication routine
* The corresponding policies necessary for the set up to run on AWS

The backend stack uses the Serverless Framework to deploy to AWS. All resources of the stack are specified in the `backend > serverless.yml` file.

The project also includes a simple frontend client built with React.

## Backend deployment

In order to deploy the backend stack to AWS, run:

`cd backend`

`sls deploy -v`

To choose specific regions and aws profile, run:

`sls deploy -v --region <sa-east-1> --aws-profile <serverless>`

Take note of the deployment URL as it will be used to configure the frontend client.

## Frontend deployment

First, configure the backend endpoint by editing `client > src > config.ts` and setting `apiId` to the corresponding backend URL deployed by AWS (the first portion of the URL).

To deploy a local frontend client, run:

`cd client`

`npm install`

`npm run start`


Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
