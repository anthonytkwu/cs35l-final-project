import mysql.connector

mydb = mysql.connector.connect(
  host="database-1.c94cq6qeuzwb.us-west-1.rds.amazonaws.com",
  user="cs35l_user",
  password="Anthony57085Giants"
)

print(mydb)
