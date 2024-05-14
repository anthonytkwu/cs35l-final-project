import mysql.connector

connection = mysql.connector.connect(
  host="database-1.c94cq6qeuzwb.us-west-1.rds.amazonaws.com",
  user="cs35l_user",
  password="Anthony57085Giants"
)
query = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'db1';"
cursor = connection.cursor()
# Execute the query
cursor.execute(query)

# Fetch all rows (table names)
tables = cursor.fetchall()

# Print out the table names
print("Tables in the database:")
for table in tables:
    print(table[0])

# Close cursor and connection
cursor.close()
connection.close()

