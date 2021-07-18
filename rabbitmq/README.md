# rabbitmq

We will use **docker** to start **rabbitmq** as a container. In order to create applications that create and consume messages, it is important that they run in the same network:

```bash
docker network create rabbits
```

In order to start **rabbitmq** as a docker container use the following command:

/var/lib/rabbitmq/mnesia/rabbit@rabbit-bus

```bash
docker run -d --rm --network rabbits --hostname rabbit-bus -p 5672:5672 -p 15672:15672 -v /tmp/rabbit-bus:/var/lib/rabbitmq/mnesia/ --name rabbit-bus rabbitmq:3.8.19-management
```

NOTE:
- port **5672** is used to accept connections
- port **15672** is used by the **management UI plugin**

In order to activate the **management UI plugin** (in case it is not active) run:

```bash
docker exec -it rabbit-bus bash # connects to the container
rabbitmq-plugins # lists all to plugin options
rabbitmq-plugins list # lists all the plugins
rabbitmq-plugins enable rabbitmq_management # to enable the management plugin
```

In order to use the management UI plugin:
- go to: http://localhost:15672/
- use the default user **guest** with password **guest**

