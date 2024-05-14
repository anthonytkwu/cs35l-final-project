import mysql.connector

# Connect to the MySQL database
connection = mysql.connector.connect(
    host='your_host',
    user='your_username',
    password='your_password',
    database='db1'  # Make sure to use your actual database name
)

# Create a cursor object to execute SQL queries
cursor = connection.cursor()

# SQL query to retrieve table names and column details from information_schema.columns
query = """
    SELECT table_name, column_name, data_type, is_nullable, column_key, column_default
    FROM information_schema.columns 
    WHERE table_schema = 'db1';
"""

# Execute the query
cursor.execute(query)

# Fetch all rows (table details)
table_details = cursor.fetchall()

# Print out the table details
print("Tables and their structures:")
current_table = None
for table_detail in table_details:
    if table_detail[0] != current_table:
        current_table = table_detail[0]
        print(f"\nTable: {current_table}")
    print(f"  - Field: {table_detail[1]}, Type: {table_detail[2]}, Null: {table_detail[3]}, Key: {table_detail[4]}, Default: {table_detail[5]}")

# Close cursor and connection
cursor.close()
connection.close()