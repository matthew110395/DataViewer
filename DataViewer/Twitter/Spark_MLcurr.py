
# -*- coding: utf-8 -*-
from __future__ import print_function
from pyspark import SparkContext
from pyspark.sql.types import *
from pyspark.sql import Row, SQLContext
from pyspark.mllib.linalg import Vectors
from pyspark.ml.feature import HashingTF, IDF, Tokenizer
from pyspark.mllib.classification import NaiveBayes
from pyspark.mllib.classification import NaiveBayesModel
from pyspark.mllib.regression import LabeledPoint
from pyspark.mllib import linalg as mllib_linalg
from pyspark.ml import linalg as ml_linalg
import time
import json
import sys
import pandas as pd
import tweepy
import MySQLdb


class MyStreamListener(tweepy.StreamListener):

    def on_status(self, status):
        print(status.text)
        try:
          stat = status.text.replace(',', '')
          stat = stat.replace('\n',' ')
        except:
          print('No Characters to Strip')
          with open("log.txt", "a") as myfile:
            myfile.write("NO CHARS to Stri[\n")
          
        try:
          blog = hash(stat)
        except:
          print('CannotPredict')
          with open("log.txt", "a") as myfile:
            myfile.write("Machine Learning Failed\n")

        else:
          try:
            x.execute("""INSERT INTO tweets (tid,created,time_zone,tweet,user,blog) VALUES (%s,%s,%s,%s,%s,%s)""",(status.id,status.created_at,status.user.time_zone,status.text,status.user.name,blog))
          except:
            print('cannot insert to DB')
            with open("log.txt", "a") as myfile:
              myfile.write("Cannot Insert to DB\n")

          else:
            conn.commit()


def as_old(v):
    if isinstance(v, ml_linalg.SparseVector):
        return mllib_linalg.SparseVector(v.size, v.indices, v.values)
    if isinstance(v, ml_linalg.DenseVector):
        return mllib_linalg.DenseVector(v.values)
    raise ValueError("Unsupported type {0}".format(type(v)))

def hash(s):
    line = { 'tweet': [s] }
  
    df = pd.DataFrame(data=[s],index = range(1),columns = ['tweet'])
    #print(df.head())
    line = Row(tweet = [s])
   # print(line)
    df = sqlContext.createDataFrame(df)
  #  print(df.take(1))
    #tokenizer = Tokenizer(inputCol="tweet", outputCol="words")
    wordsData= tokenizer.transform(df)
    #hashingTF = HashingTF(inputCol="words", outputCol="rawFeatures", numFeatures=2000000)
    featurizedData = hashingTF.transform(wordsData)
    #idf = IDF(inputCol="rawFeatures", outputCol="features")
    #idfModel = idf.fit(featurizedData)
    rescaledData = idfModel.transform(featurizedData)
   # print(rescaledData.take(100)) 
    temp = rescaledData.rdd.map(lambda line:LabeledPoint(0,as_old(line[3])))
    #print(temp.take(100))
    pred= temp.map(lambda point: (model.predict(point.features)))
    #print(pred.take(100))
    arr = str(pred.take(100))
    val = arr[1]
    print(val)
    return val

arr=[]
#for line in sys.stdin:
#    print(line)
#    arr.push(line)    
#input  = sys.stdin.readline()
inp = sys.stdin.read()
inp = json.loads(inp)
print(inp)
    
sc = SparkContext("local[*]", "naivebayes")
sqlContext = SQLContext(sc)
try:
    rdd = sc.textFile('Twitter/mlData1.csv')

    
#tr,ts = rdd.randomSplit([0.7, 0.3])
    rdd = rdd.map(lambda line: line.split(","))
    df = rdd.map(lambda line: Row(tweet = line[0], label = line[1]))
    df=sqlContext.createDataFrame(df)
    tokenizer = Tokenizer(inputCol="tweet", outputCol="words")
    wordsData= tokenizer.transform(df)
    hashingTF = HashingTF(inputCol="words", outputCol="rawFeatures", numFeatures=2000000)
    featurizedData = hashingTF.transform(wordsData)
    idf = IDF(inputCol="rawFeatures", outputCol="features")
    idfModel = idf.fit(featurizedData)
    rescaledData = idfModel.transform(featurizedData)

    temp = rescaledData.rdd.map(lambda line:LabeledPoint(line[0],as_old(line[4])))
    print(temp.take(200))
    training, test = temp.randomSplit([0.9, 0.1])
    try:
      model = NaiveBayes.train(training)
    except java.lang.OutOfMemoryError:
      print('ERRRR')
except:
    print('Cannot train spark model')
    exit()
try:    

    pre= test.map(lambda point: (point.label,model.predict(point.features)))
    test_accuracy = pre.filter(lambda (v, p): v == p).count() / float(test.count())

#print(pre.take(100))

#print(test_accuracy)
except:
    print('Cannot test spark model')
    exit()

print('****************************Spark model Trained************************')
time.sleep(1)
conn = MySQLdb.connect(host= inp[0],
                  user=inp[1],
                  passwd=inp[2],
                  db=inp[3],
                  charset="utf8mb4")
x = conn.cursor()
auth = tweepy.OAuthHandler(inp[4], inp[5])
auth.set_access_token(inp[6],inp[7])


# Construct the API instance
api = tweepy.API(auth)
#myStreamListener = MyStreamListener()
myStream = tweepy.Stream(auth = api.auth, listener=MyStreamListener())

myStream.filter(track=['whisky'])
with open("log.txt", "a") as myfile:
  myfile.write("Cannot create Twitter Stream\n")


hash('Medicinal whisky!')
hash('Today and tomorrow are the last days for APERITIVO TIME! From 6-8pm order Whisky fresh Jagerfresh Raspberry mojitâ€¦ https://t.co/1pE76mbYeC')