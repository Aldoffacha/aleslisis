import psycopg2

try:
    conn = psycopg2.connect(
        dbname="DBAlesli",
        user="postgres",
        password="A12345",
        host="127.0.0.1",
        port="5433"
    )
    print("Conexion exitosa!")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
