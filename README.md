# Getting Started With Mahfuz JS

## Project Directory Structure
```
appName/
├── backend/
│   ├── public/
│   │   └── temp/
│   ├── src/
│   │   ├── app/
│   │   │   └── app.js
│   │   ├── backend/
│   │   │   └── backend.js
│   │   ├── controllers/
│   │   │   └── user.Controller.js
│   │   ├── database/
│   │   │   └── db.Config.js
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   │   └── user.Router.js
│   │   ├── server/
│   │   │   └── server.js
│   ├── .env
│   ├── .prettierignore
│   ├── .prettierrc
│   ├── package.json
│   └── vercel.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── contexts/
│   │   ├── app/
│   │   │   └── store.js
│   │   ├── frontend/
│   │   │   └── frontend.jsx
│   │   ├── layouts/
│   │   │   └── layout.jsx
│   │   ├── pages/
│   │   │   ├── NotFound.jsx
│   │   │   └── Welcome.jsx
│   │   ├── routes/
│   │   │   └── Router.jsx
│   │   ├── server/
│   │   │   └── Index.jsx
│   │   ├── styles/
│   │       └── Tailwind.css
│   ├── .env
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
├── .gitignore
└── Readme.md
```
## Installation
* Download and install from latest release from [here](https://github.com/mahfuz0712/Mahfuz-JS/releases/tag/1.0.1)
### Setup 
```bash
mahfuz create-mern-app appName
cd appName
```
## Start The Backend Server
open a new terminal and type
```bash
cd backend
npm run backend
```

## Start The Frontend Server
open a new terminal and type
```bash
cd frontend
npm run frontend
```
# Credits

## Author
Mohammad Mahfuz Rahman

Email: mahfuzrahman0712@gmail.com 

Github: https://github.com/mahfuz0712

Linkedin: https://www.linkedin.com/in/mahfuz0712/


## License
MIT License


```javascript
console.log('Happy Coding! 🚀');
```