import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Museo API",
      version: "1.0.0",
      description: "Documentación de la API del Museo Arqueológico",
    },
    servers: [
      {
        url: "http://localhost:8000/api",
        description: "Servidor local",
      },
    ],
  },
  apis: ["./routes/*.mjs"],
};

const swaggerSpec = swaggerJsdoc(options);

export default (app) => {
  app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
