#Imports
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

#Class to listen for tweets using Tweepy
class MyStreamListener(tweepy.StreamListener):
    #When Tweet is recived
    def on_status(self, status):
        
        try:
          #Clean tweet
          stat = status.text.replace(',', '')
          stat = stat.replace('\n',' ')
        except:
          with open("log.txt", "a") as myfile:
            myfile.write("ERR\tNo Characters to Strip\n")
          
        try:
          #Carry out prediction using hash function
          blog = hash(stat)
          # Write result to log
          with open("log.txt", "a") as myfile:
              myfile.write("OK\t" + str(stat.encode('utf-8')) + "," + str(blog) + "\n")
        except:
          with open("log.txt", "a") as myfile:
            myfile.write("ERR\tMachine Learning Failed,"+str(stat.encode('utf-8'))+" \n")
        else:
          try:
            # Insert to DB
            x.execute("""INSERT INTO tweets (tid,created,time_zone,tweet,user,blog) VALUES (%s,%s,%s,%s,%s,%s)""",(status.id,status.created_at,status.user.time_zone,status.text,status.user.name,blog))
          except:
            
            with open("log.txt", "a") as myfile:
              myfile.write("ERR\tCannot Insert to DB\n")

          else:
            conn.commit()

# FUnction to change sparse vector to dense vector
def as_old(v):
    if isinstance(v, ml_linalg.SparseVector):
        return mllib_linalg.SparseVector(v.size, v.indices, v.values)
    if isinstance(v, ml_linalg.DenseVector):
        return mllib_linalg.DenseVector(v.values)
    raise ValueError("Unsupported type {0}".format(type(v)))

# Carry out prediction
def hash(s):
    line = { 'tweet': [s] }
    #Create a dataframe
    df = pd.DataFrame(data=[s],index = range(1),columns = ['tweet'])
    line = Row(tweet = [s])
    df = sqlContext.createDataFrame(df)
    #Tokenize tweet into words
    wordsData= tokenizer.transform(df)
    #Hash Tweet
    featurizedData = hashingTF.transform(wordsData)
    #Create IDF Model
    rescaledData = idfModel.transform(featurizedData)
    #Create labeled point by converting idf data to dense vector
    temp = rescaledData.rdd.map(lambda line:LabeledPoint(0,as_old(line[3])))
    #Carry out prediction
    pred= temp.map(lambda point: (model.predict(point.features)))
    arr = str(pred.take(100))
    val = arr[1]
    #Return prediction
    return val

arr=[]

inp = sys.stdin.read()
inp = json.loads(inp)

#Create spark instance    
sc = SparkContext("local[*]", "naivebayes")
sqlContext = SQLContext(sc)
try:
    #Read  training data
    rdd = sc.textFile('Twitter/mlData1.csv')
    rdd = rdd.map(lambda line: line.split(","))
    #Split labels and tweets
    df = rdd.map(lambda line: Row(tweet = line[0], label = line[1]))
    df=sqlContext.createDataFrame(df)
    #tokenize tweets
    tokenizer = Tokenizer(inputCol="tweet", outputCol="words")
    wordsData= tokenizer.transform(df)
    #hash tweets
    hashingTF = HashingTF(inputCol="words", outputCol="rawFeatures", numFeatures=2000000)
    featurizedData = hashingTF.transform(wordsData)
    #Fit hashed data to idf model
    idf = IDF(inputCol="rawFeatures", outputCol="features")
    idfModel = idf.fit(featurizedData)
    rescaledData = idfModel.transform(featurizedData)
    #convert sparse vecor to dense vector
    temp = rescaledData.rdd.map(lambda line:LabeledPoint(line[0],as_old(line[4])))
    #split trainging and test data
    training, test = temp.randomSplit([0.9, 0.1])
    try:
      #Train ML model
      model = NaiveBayes.train(training)
    except java.lang.OutOfMemoryError:
		with open("log.txt", "a") as myfile:
			myfile.write("ERR\tCannot train spark model\n")
		exit()

except:
	with open("log.txt", "a") as myfile:
		myfile.write("ERR\tCannot train spark model\n")
	exit()
try:
    #Test ML model    
    pre= test.map(lambda point: (point.label,model.predict(point.features)))
    test_accuracy = pre.filter(lambda (v, p): v == p).count() / float(test.count())
except:
    with open("log.txt", "a") as myfile:
	    myfile.write("ERR\tCannot test spark model\n")
    exit()

print('****************************Spark model Trained************************')
time.sleep(1)
#Connect to MySQL DB
conn = MySQLdb.connect(host= inp[0],
                  user=inp[1],
                  passwd=inp[2],
                  db=inp[3],
                  charset="utf8mb4")

x = conn.cursor()
#Connect to Twitter using tweepy
auth = tweepy.OAuthHandler(inp[4], inp[5])
auth.set_access_token(inp[6],inp[7])
# Construct the API instance
api = tweepy.API(auth)
myStream = tweepy.Stream(auth = api.auth, listener=MyStreamListener())
#Term to search for
myStream.filter(track=['whisky'])
with open("log.txt", "a") as myfile:
  myfile.write("ERR\tCannot create Twitter Stream\n")
