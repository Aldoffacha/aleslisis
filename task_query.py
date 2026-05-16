import os
import django
from django.db import connection

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
try:
    django.setup()
    with connection.cursor() as cursor:
        # Check all tables to find the right one for "producto"
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = [row[0] for row in cursor.fetchall()]
        print(f"Tables: {tables}")

        target_table = None
        if 'catalogo_producto' in tables: target_table = 'catalogo_producto'
        elif 'producto' in tables: target_table = 'producto'
        else:
             for t in tables:
                 if 'producto' in t.lower():
                     target_table = t
                     break
        
        if target_table:
            print(f"Targeting: {target_table}")
            cursor.execute(f"SELECT column_name FROM information_schema.columns WHERE table_name = '{target_table}' ORDER BY column_name")
            rows = cursor.fetchall()
            columns = [row[0] for row in rows]
            keywords = ['image', 'imagen', 'foto', 'archivo', 'url']
            image_cols = [c for c in columns if any(kw in c.lower() for kw in keywords)]
            
            print("---COLUMNS---")
            for c in columns: print(c)
            print("---IMAGES---")
            for c in image_cols: print(c)
        else:
            print("Table not found")
except Exception as e:
    print(f"Error: {e}")
