
# **Technical Test by Henri Serano**

This project is a web application for image verification, consisting of a Node.js backend and a React frontend.

## Backend Setup

The backend of this web app is built using the Node.js framework. To run the backend, follow these steps in your terminal:

1. **Navigate to the Backend Directory**

   ```
   cd back
   ```
2. **Install Dependencies**

   - This command installs all the necessary Node.js packages as defined in `package.json`.

   ```
   npm install
   ```
3. **Start the Server**

   - This command starts the Node.js server.
   - The application should run on port 3000 of your local machine.
   - Ensure that port 3000 is free before starting the server.

   ```
   npm start
   ```

## Frontend Setup

The frontend of this web app is developed using React, providing a component-based structure for the web page. Follow these steps to set up and run the frontend:

1. **Navigate to the Frontend Directory**

   ```
   cd playmaker-test
   ```
2. **Install Dependencies**

   - This command installs all the necessary React and JavaScript packages as defined in `package.json`.

   ```
   npm install
   ```
3. **Start the React App**

   - This command starts the React application.
   - Make sure to run the backend server before starting the frontend to avoid port conflicts.

   ```
   npm start
   ```

   **Important Note**: The frontend expects the backend to be running on port 3000. If the backend is not running or is configured to use a different port, you may encounter connectivity issues.

## Additional Information

- **Node.js Version**: Ensure that you have Node.js installed on your system. The application is tested with Node.js version 14.x or newer.
- **React Version**: The frontend is built with React. Make sure you have a recent version of Node.js that supports npx (Node.js 5.2.0 or newer).

By following these instructions, you should be able to set up and run both the backend and frontend of the web application successfully.
