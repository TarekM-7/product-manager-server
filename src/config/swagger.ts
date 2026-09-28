import swaggerJSDoc from 'swagger-jsdoc'
import { SwaggerUiOptions } from 'swagger-ui-express'

const options: swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [
            {
                name: 'Products',
                description: 'API operations related to products'
            }
        ],
        info: {
            title: 'REST API Node.js / Express / Typescript',
            version: '1.0.0',
            description: 'API Docs for Products'
        }
    },
    apis: ['./src/router.ts']
}

const swaggerSpec = swaggerJSDoc(options)

const swaggerUiOptions : SwaggerUiOptions = {
    customCss : `
        .swagger-ui .topbar-wrapper .link {
            content: url('https://www.clipartmax.com/png/middle/75-756149_big-image-generic-logo-png-transparent.png');
            height: 40px;
            width: auto;
            flex: none;
        }
        .swagger-ui .topbar {
                background-color: #2b3bb4;
        }
    `,
    customSiteTitle: 'Documentación REST API Express/Typescript'
}

export default swaggerSpec
export {
    swaggerUiOptions
}