from base64 import encode
from cProfile import label
from time import strptime
from flask import Flask, jsonify
from flask_cors import CORS
from sklearn.metrics import consensus_score
import model
import scrapConcursosRevisado
import os
from dotenv import load_dotenv
import psycopg2
import pandas as pd
from datetime import datetime, date
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

columnsName = ["tender_id", "id", "description", "publication_date", "opening_date", "status", "deleted", "institution_id", "close_date", "budget", "regions", "procedure_type", "institution_name" ]


@app.route('/getData/<string:keywords_list>', methods=["GET"])
def getData(keywords_list):
    
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute('SELECT * FROM get_tender();')
    result = cur.fetchall()

    cur.close()
    conn.close()

    dt = pd.DataFrame(result)
    dt.columns = columnsName
    
    dfToModel = dt[['id','institution_name','description']]
    dfToModel.columns = ["NumProc",'Institucion', "Descripcion"]
    dfFromModel = model.executeModel(keywords_list, dfToModel)
    
    result = setLabel(dfFromModel, dt)
    result = result.to_json(orient= "records", force_ascii=False, date_format="iso")
    return { "code": 1, "msg": '', "data": result }



@app.route('/updateTender', methods=["GET"])
def update():   

    tenderList = pd.read_json('file1.json')
    # toDate = formatDate(str(date.today()))
    
    # conn = get_db_connection()
    # cur = conn.cursor()

    # cur.execute('SELECT publication_date FROM "Tender" ORDER BY "Tender".publication_date DESC LIMIT 1;')
    # result = cur.fetchone()
    # cur.close()
    # conn.close()
    # if (result == None):
    #     fromDate = toDate
    # else:
    #     fromDate = formatDate(str(result[0]))
    # tenderList = scrapConcursosRevisado.main(fromDate, toDate)

    conn = get_db_connection()
    cur = conn.cursor()

    for index, row in tenderList.iterrows():
        cur.execute('CALL insert_tender(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);', 
                                        (row['Número de procedimiento'].strip(),
                                        row['Descripción del procedimiento'].strip(),
                                        getDate(row['Fecha/hora de publicación']),
                                        getDate(row['Fecha/hora de apertura de ofertas']),
                                        getDate(row['Cierre de recepción de ofertas']),
                                        row['Presupuesto total estimado'].strip(),
                                        row['Estado del concurso'].strip(),
                                        row['Nombre de la institución'].strip(),
                                        row['Tipo de procedimiento'].strip(),
                                        row['Regiones'],
        ))
    conn.commit()

    cur.execute('SELECT * FROM get_tender();')
    result = cur.fetchall()

    cur.close()
    conn.close()
    
    if len(result) != 0:
        dt = pd.DataFrame(result)
        dt.columns = columnsName
        result = dt.to_json(orient= "records", force_ascii=False, date_format="iso")
    else:
        result= []

    return { "code": 1, "msg": '', "data": json.loads(result) }

@app.route('/getAllTenders', methods=["GET"])
def getAllTenders():
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute('SELECT * FROM get_tender();')
    result = cur.fetchall()

    cur.close()
    conn.close()
    dt = pd.DataFrame(result)
    dt.columns = columnsName
    result = dt.to_json(orient= "records", force_ascii=False, date_format="iso")
    return { "code": 1, "msg": '', "data": result }

def get_db_connection():
    conn = psycopg2.connect(
        host= str(os.getenv('HOST')), 
        dbname= str(os.getenv('Database')) , 
        user= str(os.getenv('User')),
        password= str(os.getenv('Password')), 
        port= str(os.getenv('Port')) 
    )
    return conn

def getDate(date_time_str):
    date_time_obj = datetime.strptime(date_time_str.strip(), '%d/%m/%Y %H:%M')
    return date_time_obj.date()

def formatDate(date:str):
    (y,m,d) = date.split('-')
    return d+m+y

def main():
    app.run(debug=True)
    
def setLabel(dfFromModel, dt):
    dt["label"] = ""
    for index in dfFromModel.index:
        row = dt.loc[dt['id'] == dfFromModel["id_contratacion"][index]]
        dt['label'][index] = dfFromModel["label"][index]
    return dt
  
if __name__ == '__main__':
    main()

