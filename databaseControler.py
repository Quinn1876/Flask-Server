import psycopg2
from configparser import ConfigParser
import traceback

"""
# databaseControler
## Quinn Hodges
------------
The database controller contains the api for interfacing with the PostgreSQL server
------------
### Index
#### Tutorial Code from cite(1)
config()
connect()
add_part()
--------------
##### Personal Code
create_tables()
add_score()
get_scores
"""


"""
see this link for inforation on setting up a datatbase.ini file:
@cite(1): http://www.postgresqltutorial.com/postgresql-python/connect/
"""
SUPPLIERS = "static/config/databaseExample.ini"
HIGHSCORES = "static/config/highscores.ini"

################################## TUTORIAL CODE #####################################
# config is important
# the rest are for reference
def config(filename='static/config/databaseExample.ini', section='postgresql'):
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

def connect():
    """ Connect to the PostgreSQL database server"""
    conn = None
    try:
        # read connection parameters
        params = config()

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

def add_part(part_name, vendor_list):
    # statement for inserting a new row into the parts table
    insert_part = "INSERT INTO parts (part_name) VALUES(%s) RETURNING part_id;"
    # statement for inserting a new row into the vendor_parts table
    assign_vendor = "INSERT INTO vendor_parts (vendor_id,part_id) VALUES (%s,%s);"

    conn = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        # insert a new part
        cur.execute(insert_part, (part_name,))
        # get the part id
        part_id = cur.fetchone()[0]
        # assign parts provided by vendors
        for vendor_id in vendor_list:
            cur.execute(assign_vendor, (vendor_id, part_id))

        # commit changes
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
######################################################################################

def create_tables():
    """ create tables in the PostgreSQL database"""
    commands = (
        """
        CREATE TABLE players(
            id integer,
            name text,
            CONSTRAINT pkey PRIMARY KEY (id),
            CONSTRAINT integrity CHECK (name IS NOT NULL AND id IS NOT NULL)
        )
        """,
        """
        CREATE TABLE scores(
            player_id integer,
            score integer,
            CONSTRAINT integrety CHECK (player_id is not NULL),
            CONSTRAINT player_exists FOREIGN KEY (player_id)
                REFERENCES players (id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );
        """
        )
    conn = None
    try:
        # read the connection parameters
        params = config(filename="static/config/highscores.ini")
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


def add_score(score, name):
    # FETCH THE player id
    # INSERT
    # CLOSE

    select_name = "SELECT id FROM players WHERE name = %s"
    insert_player = "INSERT INTO players (name) Values  (%s)"
    insert_score = "INSERT INTO scores Values (%s, %s)"

    conn = None
    try:
        params=config(HIGHSCORES)
        conn = psycopg2.connect(**params)
        cur = conn.cursor()

        cur.execute(select_name, (name,))
        player_id = cur.fetchone()
        player_id = player_id[0] if player_id is not None else None
        if player_id is None:
            cur.execute(insert_player, (name,))

        cur.execute(select_name, (name,))
        player_id = cur.fetchone()[0]

        cur.execute(insert_score, (player_id, score))

        conn.commit()
        print("Inserted %s's score of: %d into the database." % (name, score))
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        traceback.print_exc()
    finally:
        if conn is not None:
            conn.close()

def get_scores(numScores=5)->list:
    select_scores = """
        SELECT players.name, scores.score
        FROM players, scores
        Where players.id = scores.player_id
        ORDER BY scores.score DESC
        LIMIT %s
    """

    conn = None
    scores = []
    try:
        params = config(HIGHSCORES)
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        # execute 1st statement
        cur.execute(select_scores, (numScores,))
        # print highscores for now -- TODO: Return the highscores
        print("Highscores Found ...")
        for result in cur:
            scores.append(result)
            print(result)
        # commit the transaction
        conn.commit()
        # close the database communication
        cur.close()
    except psycopg2.DatabaseError as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            return scores

if __name__ == "__main__":
    get_scores()

