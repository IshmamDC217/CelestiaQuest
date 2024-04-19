# CelestiaQuest

<picture> <img align="left" src="https://media.giphy.com/media/l4KhQo2MESJkc6QbS/giphy.gif?cid=790b7611tbfw9erw5i0vkkb9ru6w66q8m8cmkexyvn2u299s&ep=v1_gifs_search&rid=giphy.gif&ct=g" width = 250px></picture>

## About

CelestiaQuest is a full-stack dashboard application that utilizes two of NASA's free APIs. The project comprises both a client-side and a server-side component, with authentication implemented using Passport.js for secure user authentication.

### Features

- **Full Stack Dashboard:** Combining React.js for the front end, Express.js for the back end, and Passport.js for authentication to provide a comprehensive dashboard experience.
- **NASA APIs Integration:** Utilizing NASA's free APIs to gather and display relevant astronomical data.
- **Responsive Design:** Ensuring compatibility across various devices for a seamless user experience.

## Repository Structure

- **CelestiaQuest-Client:** This folder contains the client-side codebase for the dashboard application, built with React.js. It has undergone a complete makeover to enhance its functionality and user interface.
  
- **CelestiaQuest-Server:** Here lies the server-side codebase, which is built with Express.js and has been updated to provide better asset management and performance.

## Installation

To set up CelestiaQuest locally, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the `CelestiaQuest-Server` folder and install the necessary dependencies.
3. Start the server.
4. Open another terminal window, navigate to the `CelestiaQuest-Client` folder, and install its dependencies.
5. Start the client.
6. Access the dashboard through your web browser.

## Database Setup

To set up the database for CelestiaQuest, follow these steps:

1. Create a MySQL database named `loginDB`.
2. Create the necessary tables as specified below:

### Users Table

```sql
CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

### Sessions Table

```sql
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

## Running the Server

Execute `node server.js` to start the server. It will be accessible on `http://localhost:3000`.

## Contributing

Contributions to CelestiaQuest are welcome! If you'd like to contribute, please fork the repository and submit a pull request with your changes.
