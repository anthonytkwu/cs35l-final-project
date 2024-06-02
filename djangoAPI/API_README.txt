Guide to using the api/database:

The api uses GET, POST, UPDATE, and DELTE requests to access, retrieve, and modify the internal database.  Each
model in the api (Game, Player, DrawingPhrasePair, and Chain) can use POST requests (provided you correctly fill
in the required fields, see models for fields).  In the models.py file inside "/djangoAPI/api/" you will defined
models for each datatype, and their corresponding fields.  Some of these fields are marked with the 'null=True'
attribute, signaling that you do not have to provide this field, as they are allowed to be empty when making POST
requests to the API.  Below are examples of API calls so that you can see how to use them:

API ENDPOINT: https://13.52.151.207:8000/api/

curl -X GET http://13.52.151.207:8000/api/  --- This makes sure that you have connection to the enpoint, lists 
different requests inside the endpoint. The output should look something like this:

{"games":"http://13.52.151.207:8000/api/games/","players":"http://13.52.151.207:8000/api/players/",
"drawing_phrase_pairs":"http://13.52.151.207:8000/api/drawing_phrase_pairs/",
"chains":"http://13.52.151.207:8000/api/chains/"}

API FIELD SPECIFIC ENDPOINTS:

https://13.52.151.207:8000/api/games/
https://13.52.151.207:8000/api/players/
https://13.52.151.207:8000/api/drawing_phrase_pairs/
https://13.52.151.207:8000/api/chains/


MAKING REQUESTS (for now they will be formatted as curl requests but can be easily moved into the react form):
List All Games:
curl -X GET http://localhost:8000/api/games/

Make a new Game Entry:
curl -X POST http://localhost:8000/api/games/ -H "Content-Type: application/json" -d '{"game_id": "123", "is_active": true}'

Search by game_id
curl -X GET http://localhost:8000/api/games/?search=123&field=game_id

Find next pair in a drawing_phrase_pairs chain from drawing_phrase_pairs with id=1:
curl -X GET http://localhost:8000/api/drawing_phrase_pairs/1/next_pair/

Info on authentication:
Register user:
http://localhost:8000/api/user/register/

Allow you to input username and password and request refresh and access tokens:
http://localhost:8000/api/token/ 

To refresh your access token, send refresh token:
http://localhost:8000/api/token/refresh
