# TaskManager
A Complete Productivity Management Tool
TaskManager is a feature-rich, fully responsive productivity tool designed to help users stay organized, manage time, create reports , schedule meetings  and enhance efficiency.

### 📋 Features

- Organized Task Management
Easily add, categorize, and manage tasks across To-Do, Pending, and Done sections.

- Create reports manage reports and schedule meetings 

- Stay focused with a timer that includes animations, alert popups, and break reminders. (Not currently available )

- AI-Powered Task Suggestions
Get personalized task suggestions  and assistance via a custom chatbot. (Under work)

- Visual Productivity Tracking
View detailed productivity charts to track your progress over time. (Not available)

- Seamless Responsive Design
Accessible on all devices, with smooth animations, hover effects, and user-friendly popups.

### 🛠️ Tech Stack

#### Frontend: HTML, CSS (Tailwind CSS for styling), JavaScript (modularized for various components)
#### Backend: Node.js, Express
#### Database: PostgreSQL
#### Authentication: Google OAuth 2.0
### 🚀 Getting Started
## Prerequisites

 - Node.js and npm installed.
 - A PostgreSQL database set up or online database like neon cloud .

 ### Installation
 ##### Clone the repository

``` bash

git clone https://github.com/yourusername/taskmanager.git
```

#### Navigate into the project directory

```bash

cd taskmanager
```

#### Install the dependencies

````bash

npm install

````

## Set up environment variables
Configure a .env file in the root directory with your database credentials, API keys, and OAuth credentials.

### EX 

``` 
DB_USER = "same as below "
DB_HOST = "same "
DB_NAME = "same"
DB_PASSWORD = 'same'
DB_PORT = 'same'

# #  neon tech database 

# DB_USER="user like taskmanager_owner"
# DB_HOST ="write host address"
# DB_NAME="just name "
# DB_PASSWORD="pass"
# DB_PORT='port'
use ssl:{ssl : {
        rejectUnauthorized : false}}

GOOGLE_CLIENT_ID="Yours "

GOOGLE_CLIENT_SECRET ="Yours" 

OPENAI_API_KEY = "Get one : D"

X_API_KEY='get from api ninjas '

``` 
 ### DO THE OTHER STUFF LIKE SETUP TAILWIND AND OTHER 

#### Start the server

```bash

npm start

```


🛣️ Plans 

 - Add a productivity streak tracker.

 - Implement task tagging and color coding.

 - Integrate additional APIs to expand 
 functionality.

### 🤝 Contributing
Contributions are welcome! Please feel free to open an issue or submit a pull request.

### 📄 License
This project is licensed under the MIT License i hope. 