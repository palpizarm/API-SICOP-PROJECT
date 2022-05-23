import pandas as pd
import nltk
from nltk import SnowballStemmer
nltk.download('stopwords')
nltk.download('punkt')
import re
from nltk.tokenize import word_tokenize
from unidecode import unidecode
from sklearn.feature_extraction.text import TfidfVectorizer
# K-Means
from sklearn import cluster
import json


# def getData():
#     df = pd.read_csv('E9.csv')
#     df.drop(['Solicitud', 'ID Institucion', 'Fecha'], axis = 'columns', inplace=True) # Se eliminan las columnas que no se necesitan
#     df['texto'] = df[['Institucion', 'Descripcion']].agg(' '.join, axis=1)            # Se concatena el texto de la columna Institución y Descripción
#     df.drop(['Institucion', 'Descripcion'], axis = 'columns', inplace=True)           # Como se eliminan esas columnas
#     df = df.rename(columns={'NumProc':'id_contratacion'})                             # Cambio de nombre en la columna del id
#     df = df.assign(id_provvedor = None)                                               # Se agrega la columna id_provvedor
#     df = df[['id_contratacion', 'id_provvedor', 'texto']]                             # Cambia el orden de las columnas 

#     return df

def getData(df):
    df['texto'] = df[['Institucion', 'Descripcion']].agg(' '.join, axis=1)            # Se concatena el texto de la columna Institución y Descripción
    df.drop(['Institucion', 'Descripcion'], axis = 'columns', inplace=True)           # Como se eliminan esas columnas
    df = df.rename(columns={'NumProc':'id_contratacion'})                             # Cambio de nombre en la columna del id
    df = df.assign(id_provvedor = None)                                               # Se agrega la columna id_provvedor
    df = df[['id_contratacion', 'id_provvedor', 'texto']]                             # Cambia el orden de las columnas 
    return df

#---------------------------------------------------------------------------------------------------
# removes a list of words (ie. stopwords) from a tokenized list.
def removeWords(listOfTokens, listOfWords):
    return [token for token in listOfTokens if token not in listOfWords]

# applies stemming to a list of tokenized words
def applyStemming(listOfTokens, stemmer):
    return [stemmer.stem(token) for token in listOfTokens]

# removes any words composed of less than 2 or more than 21 letters
def twoLetters(listOfTokens):
    twoLetterWord = []
    for token in listOfTokens:
        if len(token) <= 2 or len(token) >= 21:
            twoLetterWord.append(token)
    return twoLetterWord

#---------------------------------------------------------------------------------------------------

def processCorpus(corpus, language):   
    stopwords = nltk.corpus.stopwords.words(language)
    param_stemmer = SnowballStemmer(language)
    
    for document in corpus:
        index = corpus.index(document)
        corpus[index] = corpus[index].replace(u'\ufffd', '8')   # Replaces the ASCII '�' symbol with '8'
        corpus[index] = corpus[index].replace(',', '')          # Removes commas
        corpus[index] = corpus[index].rstrip('\n')              # Removes line breaks
        corpus[index] = corpus[index].casefold()                # Makes all letters lowercase
        
        corpus[index] = re.sub('\W_',' ', corpus[index])        # removes specials characters and leaves only words
        corpus[index] = re.sub("\S*\d\S*"," ", corpus[index])   # removes numbers and words concatenated with numbers IE h4ck3r. Removes road names such as BR-381.
        corpus[index] = re.sub("\S*@\S*\s?"," ", corpus[index]) # removes emails and mentions (words with @)
        corpus[index] = re.sub(r'http\S+', '', corpus[index])   # removes URLs with http
        corpus[index] = re.sub(r'www\S+', '', corpus[index])    # removes URLs with www

        listOfTokens = word_tokenize(corpus[index])
        twoLetterWord = twoLetters(listOfTokens)

        listOfTokens = removeWords(listOfTokens, stopwords)
        listOfTokens = removeWords(listOfTokens, twoLetterWord)
        
        listOfTokens = applyStemming(listOfTokens, param_stemmer)

        corpus[index]   = " ".join(listOfTokens)
        corpus[index] = unidecode(corpus[index])

    return corpus

#---------------------------------------------------------------------------------------------------

def trainModel(keywords, df):
  dataX = getData(df)
  litsData=[]
  

  for word in keywords:
    litsData.append({'id_contratacion':None,'id_provvedor':None,'texto':word})
    print(word)

  dataX2=pd.DataFrame(litsData)
  dataX.append(dataX2, ignore_index = True)


  corpus = dataX['texto'].tolist()
  language = 'spanish'
  corpus = processCorpus(corpus, language)
  vectorizer = TfidfVectorizer()
  X = vectorizer.fit_transform(corpus)
  tf_idf = pd.DataFrame(data = X.toarray(), columns=vectorizer.get_feature_names())

  final_df = tf_idf

  print("{} rows".format(final_df.shape[0]))
  final_df.T.nlargest(100, 0)



  kmeans_results = dict()
  kmeans = cluster.KMeans(n_clusters = len(keywords)
                               , init = 'k-means++'
                               , n_init = 10
                               , tol = 0.0001
                               #, n_jobs = -1
                               , random_state = 1
                               , algorithm = 'full')
  
  kmeans.fit(final_df)

  labels = kmeans.labels_ 
  dataX['label'] = labels

  return dataX

def executeModel(keywordsList, df):
    data = trainModel(keywordsList, df)
    # result = data.to_json(orient="records")    # Se convierte el dataframe en un archivo json
    # parsed = json.loads(result)
    # return json.dumps(parsed)
    return data