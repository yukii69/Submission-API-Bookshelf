const Hapi = require("@hapi/hapi");
const routes = require("./routes");

const init = async () => {
 const server = Hapi.server({
  port: 9000,
  host: "localhost",
  //   digunakan untuk memperbolehkan data dikonsumsi oleh seluruh origin.
  routes: {
   cors: {
    origin: ["*"],
   },
  },
 });

 server.route(routes);

 await server.start();
 console.log(`Server berjalan pada ${server.info.uri}`);
};
init();
