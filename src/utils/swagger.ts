import {Express, Request, Response} from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {version} from '../../package.json';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "BYTE and BITE REST API DOCUMENTATIONS",
            version,
            description: "This is the API application made with Express, TypeScript and documented with Swagger",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: [],
            }
        ]
    },
    apis: ['./src/routes/*.ts', './src/models/*.ts']
}

const swaggerSpec = swaggerJSDoc(options)


export default swaggerSpec;