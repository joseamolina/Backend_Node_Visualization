# BackEnd Visualizador Grabaciones
Using NodeJS, creating an streaming videos platform for visualization (Industrial forklifts)

## Requisitos

* NodeJS
* MongoDB
* ffmpeg



## Instalación

### NodeJS
```
curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install nodejs
```
### MongoDB

```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

Configurar como servicio
```
sudo nano /etc/systemd/system/mongodb.service
```

```
[Unit]
Description=High-performance, schema-free document-oriented database
After=network.target

[Service]
User=mongodb
ExecStart=/usr/bin/mongod --quiet --config /etc/mongod.conf

[Install]
WantedBy=multi-user.target
```

Habilitar el servicio
```
sudo systemctl enable mongodb
```
Arrancar el servicio
```
sudo systemctl start mongodb
```

### ffmpeg
```
sudo apt-get install ffmpeg
```

### backend
```
git clone <url repo>
npm install
node app.js
```

### Opcionales

Opcionamiente se puede utilizar pm2 para gestionar la aplicación más facilmente.

Instalamos el modulo pm2 de manera global
```
npm i -g pm2
```
Indicar que el pm2 hade arrancar automáticamente con la máquina.
```
pm2 startup
```
Arrancar la aplicación
```
pm2 start app.js
```
Guardar el estado del pm2 para arranque siempre en este estado.
```
pm2 save
```



## Configuración