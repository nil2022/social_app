# Instagram Clone 
**v1.0.1**

This app is build using Backend Development tools like 
> **bcryptjs, body-parser, dotenv, express, jsonwebtoken, mongoose, node-rest-client, path**

### _API's available:-_

1. Signup http://127.0.0.1:3100/api/v1/auth/signup
2. Signin http://127.0.0.1:3100/api/v1/auth/signin
3. Add one Post/many Posts (one at a time) http://127.0.0.1:3100/api/v1/addPost
4. Fetch all Posts specifying user http://127.0.0.1:3100/api/v1/posts
5. Delete one Post specifying Post Id http://127.0.0.1:3100/api/v1/posts
6. Delete All Post specifying user http://127.0.0.1:3100/api/v1/allposts

### Installation:-

- Run this command to install dependencies

    ### ```npm install```

    **NOTE:** If above command doesn't install all dependencies, run below command
    ### ```npm run build```

- Start the server by running this command
    ### ```npm run start```
- Click here to view Welcome page - http://127.0.0.1:3100

### Note to Developers:-
- I have added my MongoDB database URL to Environment Variable **(.env)** file and all other secrets, so I insist to create a **(.env)** file and add necessary configuration data which is neede to be hidden form end-user/other developers.

 - All the API's mentioned above will work best in Postman (Preferred, becoz I use it!) for testing ad development, but other apps may also be used.

### Update
***30-05-2023***
- Testing Backend API's and other features to optimise it. Need a Front-end part to be build.
