require 'mongo'
require 'JSON'
Mongo::Logger.logger.level = ::Logger::FATAL
puts Gem.loaded_specs["mongo"].version

mongo_uri = 'mongodb://heroku_m453sjsn:6nt254c0jct9l0h1gmh02bq45u@ds251804.mlab.com:51804/heroku_m453sjsn'
client = Mongo::Client.new(mongo_uri);
db = client.database

articles = db.collection("articles")

json = JSON.pretty_generate(articles.find.to_a)

File.open("./temp.json","w") do |f|
  f.write(json)
end

# db[:blogposts].find.each { |doc| puts doc }


client.close
