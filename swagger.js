const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'})

const outputFile = './swagger_output.json'
const endpointsFiles = ['./server.js']  

const doc = {
    host: 'vodsystem.onrender.com',
    schemes: ['https'],
    securityDefinitions: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        }
    },
    definitions: {
        User: {
            $name: 'John Smith',
            $email: 'jsmith@fake-mail.com',
            $password: 'thisisastrongpassword'
        },
        Video1: {
            $title:"The Lord of the Rings: The Fellowship of the Ring",
            $synopsis:"A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
            $director:"Peter Jackson",
            $cast:["Elijah Wood", "Ian McKellen", "Orlando Bloom"],
            $category:"Sci-fi & Fantasy",
            $poster:"https://m.media-amazon.com/images/I/71TZ8BmoZqL._AC_SY879_.jpg",
            $streamURL:"https://www.youtube.com/watch?v=V75dMMIW2B4"
        },
        Video2: {
            id: '634095f0ea85138ff2010b65',
            $title:"The Lord of the Rings: The Fellowship of the Ring",
            $synopsis:"A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
            $director:"Peter Jackson",
            $cast:["Elijah Wood", "Ian McKellen", "Orlando Bloom"],
            $category:"Sci-fi & Fantasy",
            $poster:"https://m.media-amazon.com/images/I/71TZ8BmoZqL._AC_SY879_.jpg",
            $streamURL:"https://www.youtube.com/watch?v=V75dMMIW2B4",
            rate: []
        },        
        Video3: {
            id: '634095f0ea85138ff2010b65',
            $title:"The Lord of the Rings: The Fellowship of the Ring",
            $synopsis:"A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
            $director:"Peter Jackson",
            $cast:["Elijah Wood", "Ian McKellen", "Orlando Bloom"],
            $category:"Sci-fi & Fantasy",
            $poster:"https://m.media-amazon.com/images/I/71TZ8BmoZqL._AC_SY879_.jpg",
            $streamURL:"https://www.youtube.com/watch?v=V75dMMIW2B4",
            rate: [1,3,5,3]
        },
        Category: {
            $name: 'Romance'
        }
    }
}

swaggerAutogen(outputFile, endpointsFiles, doc)