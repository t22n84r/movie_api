const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    openapi: "3.1.0",
    title: "MyFlix Express API with Swagger",
    version: "1.0.0",
    description: "This is a simple CRUD API application that serves movie data, made with Express and documented with Swagger",
  },
  host: 'localhost:8080',
  schemes: ['http'],
};

const outputFile = 'swagger-output.json';
const endpointsFiles = ['index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc)