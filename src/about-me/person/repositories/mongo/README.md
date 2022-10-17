# MongoDB as persistence layer

This project is tested against MongoDB with the following assumptions:

- `MONGODB_URI` should be set to `mongodb://[host]:[port]/[db]` as in `mongodb://127.0.0.1:27017/aboutme`

## Enabling MongoDB
Your environment should contain

```sh
MONGODB_URI=mongodb://...

# optional with defaults
# MONGODB_COLLECTION=persons
```

## Local environment with docker

Start a dockerized MongoDB with
```sh
docker run --name mongodb -p 21017:21017 -d mongo

```
 Ensure `.env` contains
 ```env
 MONGODB_URI=mongodb://127.0.0.1:27017/aboutme
 ``` 
