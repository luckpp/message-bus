# rabbitmq

We will use **docker** to start **rabbitmq** as a container. In order to create applications that create and consume messages, it is important that they run in the same network:

```bash
docker network create rabbits
```

In order to start **rabbitmq** as a docker container use the following command:

```bash
docker run -d --rm --network rabbits --hostname rabbitmq-bus -p 5672:5672 -p 15672:15672 -v /tmp/rabbitmq-bus:/var/lib/rabbitmq/mnesia/ --name rabbitmq-bus rabbitmq:3.8.19-management
```

NOTE:
- port **5672** is used to accept connections
- port **15672** is used by the **management UI plugin**
- volume **/tmp/rabbitmq-bus** is mounted in order to gain message persistence between docker container restarts

## Management plugin

In order to activate the **management UI plugin** (in case it is not active) do the following:

### Linux

```bash
docker exec -it rabbit-bus bash # connects to the container
rabbitmq-plugins # lists all to plugin options
rabbitmq-plugins list # lists all the plugins
rabbitmq-plugins enable rabbitmq_management # to enable the management plugin
```

### Windows

```cmd
cd  C:\Program Files\RabbitMQ Server\rabbitmq_server-3.8.19\sbin
rabbitmq-plugins enable rabbitmq_management
# restart the rabbitmq service
```

In order to use the management UI plugin:
- go to: http://localhost:15672/
- use the default user **guest** with password **guest**
