// Load gRPC and proto-loader
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

// Load the protobuf definition
var PROTO_PATH = __dirname + "/protos/movies.proto";
var packageDefinition = protoLoader.loadSync(PROTO_PATH);
var movies_proto = grpc.loadPackageDefinition(packageDefinition).movies;

// data array containing movie types and their favourite movies
var data = [
  {
    movieType: "comedy",
    favouriteMovie: 40,
  },
  {
    movieType: "action",
    favouriteMovie: 50,
  },
  {
    movieType: "romance",
    favouriteMovie: 60,
  },
  {
    movieType: "drama",
    favouriteMovie: 10,
  },
  {
    movieType: "sciFi",
    favouriteMovie: 40,
  },
];

//function to handle getFavoriteMovies request
function getFavoriteMovies(call, callback) {
  console.log("Received getFavoriteMovies request");
  for (var i = 0; i < data.length; i++) {
    call.write({
      movieType: data[i].movieType,
      favouriteMovie: data[i].favouriteMovie,
    });
  }
  call.end();
  console.log("Server stream ended");
}

// Create a gRPC server
var server = new grpc.Server();

// Add the MovieService service to the server
server.addService(movies_proto.MovieService.service, {
  getFavoriteMovies: getFavoriteMovies,
});

// Bind the server to a port and start it
server.bindAsync(
  "0.0.0.0:40000",
  grpc.ServerCredentials.createInsecure(),
  function () {
    server.start();
  }
);
