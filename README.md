# Social App <img src="./assets/instagram_2111463.png" width=30px height=30px>
**v1.0.2**

This app is build using Backend Development tools like 
> **bcrypt, body-parser, dotenv, express, jsonwebtoken, mongoose, node-rest-client, path, moment-timezone**

### API's available:-

NOTE:- 
**1️⃣** Use {your_URL} or {localhost}
**2️⃣** Request Format - (Method) (Type) (URL)

1. **[POST]** - Signup - http://{URL}/api/v1/auth/signup
2. **[POST]** - Signin - http://{URL}/api/v1/auth/signin
3. **[POST]** - Add one Post/many Posts (one Post at a time) - http://{URL}/api/v1/addPost
4. **[GET]**  - Fetch all Posts specifying user - http://{URL}/api/v1/posts
5. **[DELETE]** - Delete one Post specifying Post Id - http://{URL}/api/v1/posts
6. **[DELETE]** - Delete All Post specifying userId - http://{URL}/api/v1/allposts

### Installation:-

- Run this command to install dependencies

    ### ```npm install```

    **NOTE:** If above command doesn't install all dependencies, run below command
    ### ```npm run build```

- Start the server by running this command
    ### ```npm run start```
-To check if all is working good! 🎉 - http://{URL}:{PORT}
N.B. - PORT can be defined in **".env"** file, otherwise it will default to **3001**

<img align=center src="./assets/home_page.jpg"  width="80%" height="80%"><br>
<!-- [![](./assets/Home_page.png)](https://locize.com/blog/next-i18next/) -->

### Note to Developers:-
- I have added my MongoDB database URL to my Environment Variable **(.env)** file and all other secrets, so I insist to create a **(.env)** file and add necessary configuration data which is needed to be hidden from end-user/other developers.

- All the API's mentioned above will work best in Postman (Preferred, becoz I use it!) for testing and development, but other apps may also be used.

### Update
***30-05-2023***
- Testing Backend API's and other features to optimise it. Need a Front-end part to be build.

***01-06-2023***
- Added some functionalities. 

***27-09-2023***
- Added some functionalities. 
- Updated README 
    
