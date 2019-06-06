"""
see this link for inforation on setting up a datatbase.ini file:
http://www.postgresqltutorial.com/postgresql-python/connect/
"""
import psycopg2
from configparser import ConfigParser
class PostgreSQL_Tutorial:
#    def __init__(self):
#        PostgreSQL_Tutorial.connect()
#        PostgreSQL_Tutorial.create_tables()

    @staticmethod
    def config(filename='static/config/exampleDatabase.ini', section='postgresql'):
        # create a parser
        parser = ConfigParser()
        # read config file
        parser.read(filename)
                      
        # get section, default to postgresql
        db = {}
        if parser.has_section(section):
            params = parser.items(section)
            for param in params:
                db[param[0]] = param[1]
        else:
            raise Exception('Section {0} not found in the {1} file'.format(section, filename))
                                                                                   
        return db

    @staticmethod
    def connect():
        """ Connect to the PostgreSQL database server"""
        conn = None
        try:
            # read connection parameters
            params = PostgreSQL_Tutorial.config()

            #connect to the PostgreSQL server
            print('Connecting to the PostgreSQL database...')
            conn = psycopg2.connect(**params)

            # create a cursor
            cur = conn.cursor()

            # execute a statement
            cur.execute('SELECT version()')

            # display the PostgreSQL database server version
            db_version = cur.fetchone()
            print(db_version)

            # close the communication with the PostgreSQL
            cur.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        finally:
            if conn is not None:
                conn.close()
                print('Database connection closed')
    
    @staticmethod
    def create_tables():
        """ create tables in the PostgreSQL database """
        commands = (
                """
                CREATE TABLE vendors (
                    vendor_id SERIAL PRIMARY KEY,
                    vendor_name VARCHAR(255) NOT NULL
                    )
                """,
                """
                CREATE TABLE parts (
                part_id SERIAL PRIMARY KEY,
                part_name VARCHAR(255) NOT NULL
                )
                """,
                """
                CREATE TABLE part_drawings (
                part_id INTEGER PRIMARY KEY,
                file_extension VARCHAR(5) NOT NULL,
                drawing_data BYTEA NOT NULL,
                FOREIGN KEY (part_id)
                REFERENCES parts (part_id)
                ON UPDATE CASCADE ON DELETE CASCADE
                )
                """,
                """
                CREATE TABLE vendor_parts (
                    vendor_id INTEGER NOT NULL,
                    part_id INTEGER NOT NULL,
                    PRIMARY KEY (vendor_id, part_id),
                    FOREIGN KEY (vendor_id)
                        REFERENCES vendors (vendor_id)
                        ON UPDATE CASCADE ON DELETE CASCADE,
                    FOREIGN KEY (part_id)
                        REFERENCES parts (part_id)
                        ON UPDATE CASCADE ON DELETE CASCADE
                )
                """)
        conn = None
        try:
                # read the connection parameters
                params = PostgreSQL_Tutorial.config()
                # connect to the PostgreSQL server
                conn = psycopg2.connect(**params)
                cur = conn.cursor()
                # create table one by one
                for command in commands:
                    cur.execute(command)
                # close communication with the PostgreSQL database server 
                cur.close()
                # commit the changes
                conn.commit()
        except (Exception, psycopg2.DatabaseError) as error:
                print(error)
        finally:
                if conn is not None:
                    conn.close()
    
    @staticmethod
    def add_part(part_name, vendor_list):
        # statement for inserting a new row into the parts table
        insert_part = "INSERT INTO parts(part_name) VALUES(%s) RETURNING part_id;"
        #statement for inserting a new row into the vendor_parts table
        assign_vendor = "INSERT INTO vendor_parts(vendor_id,part_id) VALUES(%s, %s)"

        conn = None
        try:
            params = PostgreSQL_Tutorial.config()
            conn = psycopg2.connect(**params)
            cur = conn.cursor()
            # insert a new part
            cur.execute(insert_part, (part_name,))
            # get the part id
            part_id = cur.fetchone()[0]
            # assign parts provided by vendors
            for vendor_id in vendor_list:
                cur.execute(assign_vendor,  (vendor_id, part_id))

            # commit changes
            conn.commit()
        except (psycopg2.DatabaseError) as error:
            print(error)
        finally:
            if conn is not None:
                conn.close()

if __name__ == "__main__":
    PostgreSQL_Tutorial.add_part('SIM TRAY', (1,2))
    
