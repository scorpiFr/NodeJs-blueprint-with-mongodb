> create a mongoDb account on https://cloud.mongodb.com<br />

> git clone https://github.com/scorpiFr/NodeJs-blueprint-with-mongodb.git yourDirectory <br />
> cd yourDirectory<br />

update your dsn on app.js<br />

> npm init<br />
> nodemon server

available requests (form-data) :<br />
GET http://localhost:4000/api/stuff<br />
POST http://localhost:4000/api/stuff<br />
title:test<br />
description:desc<br />
imageUrl:test<br />
userId:1<br />
price:12<br />
GET http://localhost:4000/api/stuff/6844a31d2367fade2dbce885 <br />
DELETE http://localhost:4000/api/stuff/6844a19f9c2983b77a952e35 <br />
PATCH http://localhost:4000/api/stuff/6844a31d2367fade2dbce885 <br />
title:test2 (and the other fields you need) <br />
