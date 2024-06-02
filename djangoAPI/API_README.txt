Guide to using the api/database:

The api uses GET, POST, UPDATE, and DELTE requests to access, retrieve, and modify the internal database.  Each
model in the api (Game, Player, DrawingPhrasePair, and Chain) can use POST requests (provided you correctly fill
in the required fields, see models for fields).  In the models.py file inside "/djangoAPI/api/" you will defined
models for each datatype, and their corresponding fields.  Some of these fields are marked with the 'null=True'
attribute, signaling that you do not have to provide this field, as they are allowed to be empty when making POST
requests to the API.  Below are examples of API calls so that you can see how to use them:

API ENDPOINT: https://13.52.151.207:8000/api/

curl -X GET http://13.52.151.207:8000/api/  --- This makes sure that you have connection to the enpoint: the
output should look something like this:

{"games":"http://13.52.151.207:8000/api/games/","players":"http://13.52.151.207:8000/api/players/",
"drawing_phrase_pairs":"http://13.52.151.207:8000/api/drawing_phrase_pairs/",
"chains":"http://13.52.151.207:8000/api/chains/"}