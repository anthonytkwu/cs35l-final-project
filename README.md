# UCLA Computer Science 35L 24S Final Project

This is the CS35L project by Alex Wu, Anthony Wu, Daniel Hughes, Ian Kwon, and Jacob Freund.

To ensure you have the dependencies, run this command (assuming you have Python and Pip installed):
```
pip install -r requirements.txt
```

To setup the backend:
```
python3 backend/manage.py makemigrations
python3 backend/manage.py migrate
```

To setup the the front end:
```
cd client
npm install
```

To start the backend (accessible to other computers depending on firewall):
```
python3 backend/manage.py runserver 0.0.0.0:8000
```
Please edit client/src/config.js to the appropriate IP: http://localhost:8000 or http://{backend_IP}:8000

To start the React development server:
```
npm start
```

## Basic Idea of Our Project
We recreated the game of [GarticPhone](https://garticphone.com/) using [Django](https://www.djangoproject.com/) for the backend, [SQLite](https://sqlite.org/) for our database, [React](https://react.dev/) with [Tailwind](https://tailwindcss.com/) for the frontend, and [Django Rest Framework](https://www.django-rest-framework.org/) for connecting the backend and frontend.

We hosted the backend server and npm developmental server on an AWS EC2 instance, which works great! This is a 3-10 player game, where each user writes out a description, then is handed a description which they must draw. The drawing then is given to a different user, who must describe the drawing. This is a fun game of telephone and you get to see how badly people's drawing and interpretation skills are! The drawings and descriptions you are given are from the same person so if they suck, blame them!
