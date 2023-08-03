const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'});

const doc = {
  info: {
    title: "MyFlix Express API with Swagger",
    version: "2.0.0",
    description: "This is a simple CRUD API application that serves movie data, made with Express and documented with Swagger",
  },
  host: 'localhost:8080',
  schemes: ['http'],
  components:{
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    }
  }
};

const outputFile = 'swagger-output.json';
const endpointsFiles = ['index.js', 'auth.js'];

swaggerAutogen(outputFile, endpointsFiles, doc)