#Task Management Backend
A web application for managing tasks assigned to administrators by users, built with Node.js, Express, and MongoDB. The application allows users to assign tasks to admins, track assigned tasks, and let admins accept or reject tasks.

##Features:
###Users can:
-Register and log in.
-Upload assignments.
###Admins can:
-Register and log in.
- View assignments tagged to them.
- Accept or reject assignments.

##Installation:
###Install dependencies and set MongoDB route
```
npm install
MONGO_URI=<your-mongodb-route>
PORT=5000
```
###Start the app
```
npm start
```

##Endpoints:
###User endpoints (/user):
- `POST /register` - Register a new user.
- `POST /login` - User login.
- `POST /upload` - Upload an assignment.
- `GET /admins`- fetch all admins

###Admin endpoints (/admin):
- `POST /register` - Register a new admin.
- `POST /login` - Admin login.
- `GET /assignments/:adminId` - View assignments tagged to the admin.
- `POST /assignments/:id/accept` - Accept an assignment.
- `POST /assignments/:id/reject` - Reject an assignment.

  
