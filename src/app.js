const path = require('path')
const express = require('express')
const hbs = require('hbs')
// const request = require('postman-request')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'David'
    })
})

app.get('/about', (req, res) => {
    res.render('about',{
        title: 'About me',
        name: 'David'
    } )
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        message: 'This is some helpful text.',
        name: 'David'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Please provide an address'
        })
    }
 
        geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
            if (error) {
                return res.send({ error})
            } 

                forecast(latitude, longitude, (error, forecastData) => {
                    if (error) {
                        return res.send({error})
                    } 
                        res.send({
                        address: req.query.address,
                        location: location,
                        forecast: forecastData
                         })

                })

        })
    
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search);
    res.send({
        product: {}
    })
})

app.get('/help/*',(req, res) => {
    res.render('404', {
        title: ' 404',
        message: 'Help article not found.',
        name: 'David'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        message: 'Page not found',
        name: 'David'
    })
})


// app.com
// app.com/help
// app.com/about

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})