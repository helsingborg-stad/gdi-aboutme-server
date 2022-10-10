# AMQP for change notifications

This project is tested against RabbitMQ with the following assumptions:

- AMQP notifications are enbaled only if both `AMQP_URI` and `AMQP_EXCHANGE` are defined
- The exchange `AMQP_EXCHANGE` is created if missing type `type='topic'` 
- Mail change notifications are sent with `topic` set to `AMQP_TOPIC_NOTIFY_EMAIL`
  - content type is 'application/json'
  - payload is `{address: [email], verificationCode: [code]}`


## Enable notifications over AMQP
To enable change notifications over AMQP, our environment should contain

```sh
AMQP_URI=amqp://...
AMQP_EXCHANGE=...

# optional with defaults
# AMQP_TOPIC_NOTIFY_EMAIL=notify.email
# AMQP_TOPIC_NOTIFY_PHONE=notify.email
```

## Local environment with docker

Start a dpockerized RabitMQ with
``` sh
$ docker run -d --hostname my-rabbit --name some-rabbit -p 5672:5672 -p 888:15672 -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=password rabbitmq:3-management
```
 Ensure `.env` contains
 ```env
 AMQP_URI=amqp://user:password@localhost:5672
AMQP_EXCHANGE=gdi-about-me-person-changed
 ``` 

 When mutating a person (through GraphQL), events should be published to the exchange `gdi-about-me-person-changed`.
