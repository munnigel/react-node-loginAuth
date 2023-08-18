# "Node JS Tutorial Series - MongoDB with Mongoose: Async CRUD"

✅ [Check out my YouTube Channel with all of my tutorials](https://www.youtube.com/DaveGrayTeachesCode).

[<img src="https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix-button.svg" width="163px" />](https://glitch.com/edit/#!/import/github/gitdagray/mongo_async_crud)

**Deploy by clicking the button above**
_Remember to add your .env variables in the deployed version_

**Description:**

This repository shares the code applied during the Youtube tutorial. The tutorial is part of a [Node.js & Express for Beginners Playlist](https://www.youtube.com/playlist?list=PL0Zuz27SZ-6PFkIxaJ6Xx_X46avTM1aYw) on my channel.

[YouTube Tutorial](https://youtu.be/AWlLhRQJvtw) for this repository.

I suggest completing my [8 hour JavaScript course tutorial video](https://youtu.be/EfAl9bwzVZk) if you are new to Javascript.

### Academic Honesty

**ROUTES**
GET http://localhost:3500/users: must be logged in, have a token in Auth Bearer, and have appropriate role
POST http://localhost:3500/auth: to sign in with username and pwd
POST http://localhost:3500/register: to register with username and pwd and receive RefreshToken as a cookie and AccessToken as a response
GET http://localhost:3500/logout: to logout
GET http://localhost:3500/refresh: to have RefreshToken as a cookie (meaning to perform auth first), and receive new AccessToken as response
