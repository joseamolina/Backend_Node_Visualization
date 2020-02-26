const fs = require('fs');
const path = require('path');



const Videos = require('../database/videos_database_conn');

function isDirectory(path) {
  return fs.statSync(path).isDirectory();
}

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return isDirectory(path + '/' + file);
  });
}



let dias = getDirectories('../videos/');
console.log("DIAS", dias);

if (dias) {
  dias.forEach(dia => {
    let pedidos = getDirectories('../videos/' + dia);
    console.log("\tDIA", dia);

    if (pedidos) {
      pedidos.forEach(pedido => {
        let videos = fs.readdirSync('../videos/' + dia + '/' + pedido + '/');
        console.log("\t\tPEDIDO: ", pedido);
        if (videos) {
          videos.forEach(video => {
            console.log("\t\t\tVIDEO: ", video);
            //Falta saber cliente, carretilla y los hitos

          });
        }

      });
    }
  });
}


module.exports = {


};
