const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'})

const outputFile = './swagger_output.json'
const endpointsFiles = ['./server.js']  

const doc = {
    host: 'vodmasterdata.herokuapp.com/',
    schemes: ['https'],
    securityDefinitions: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        }
    },
    definitions: {
        Hero: {
            id: 1,
            $name: 'Spiderman',
            $strength: 3
        },
        Book: {
            $isbn: '978-3-16-148410-0',
            $title: 'Frankenstein',
            $author: 'Mary Shelley',
            cover: 'http://free-books.org/File:Frankenstein_1818_cover.jpg',
            $available: true,
        },
        Product: {
            id: '634095f0ea85138ff2010b65',
            $name: 'Coca-Cola',
            $category: 'drinks',
            price:1.14,
        },
        Video: {
            id: '634095f0ea85138ff2010b65',
            $title:"The Lord of the Rings: The Fellowship of the Ring",
            $synopsis:"A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
            $director:"Peter Jackson",
            $cast:["Elijah Wood", "Ian McKellen", "Orlando Bloom"],
            $category:"6350106165ef3bb9384e0afe",
            $poster:"https://m.media-amazon.com/images/I/71TZ8BmoZqL._AC_SY879_.jpg",
            $streamURL:"https://www.youtube.com/watch?v=V75dMMIW2B4",
            rate: [1,3,5]
        },
        Category: {
            id: '6350106165ef3bb9384e0afe',
            $name: 'Romance'
        }
    }
}

swaggerAutogen(outputFile, endpointsFiles, doc)