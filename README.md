# SICOP-TEC


 * About the project


 * Setup

 - Install following technologies in your local enviroment
    
    AngularJs 11.2
    NodeJS 8.5.4
    Postgresql 14.2


 - Install node modules dependecies

    1. Run into /backend/api
        npm install
    
    2. Run into /sicop
        npm install

 - Run the project

    1. Run api
        npm start into /backend/api

    2. Run Angular frontend
        ng serve into /sicop


 - Common project mistakes and posible soluctions





# GIT Workflow

This project follows Git Feature Workflow with Develop Branch. It allows teams to consistently merge new features, test them in (staging), and deploy to (production).


* Branches and environments

Each branch represents the code that is running on an environment. For example: master branch represents the production environment. So that, next table list all the branches and its corresponding environment.

| Branch    |   | Environment |
-----------------------------
| master    | -> |	(production) |
| develop   | -> |	(staging) |
| epic-*    | -> |	(local) |
| feature-* | -> |	(local) |
| bugfix-*  | -> |	(local) |
| hotfix-*  | -> |	(local) |