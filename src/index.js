const Router = require('@tsndr/cloudflare-worker-router')
const { createHash } = require('crypto')
const router = new Router()

router.cors()

router.get('/', (req, res) => {
    const hasIP = req.headers.has('CF-Connecting-IP')
    // Send an error if the request has no IP
    if (!hasIP) {
        res.status(400).send('No IP found in request')
        return
    }

    // Get the IP from the request
    const ip = req.headers.get('CF-Connecting-IP')

    res.headers.set('content-type', 'text/html;charset=UTF-8')

    const desc = `Generate an IP hash instantly`

    res.body = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Hasher</title>
        <meta property="og:title" content="Hasher" />
        <meta property="og:description" content="${desc}" />
        <meta name="description" content="${desc}" />
        <meta name="theme-color" content="#ad6edd">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@200&display=swap" rel="stylesheet"> 
    </head>
    <body>
    <style>
        body {
            /*background-color: black;*/
            background-color: #323232;
        }
        h3 {
            /*color: white;*/
            color: #ad6edd;
            margin-left: 0.5rem;
            background: #292828;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow:  -5px 5px 13px -6px rgba(0,0,0,.75);
            width: fit-content;
            font-family: 'Work Sans', sans-serif;
        }
    </style>
        <h3 class="hehe">  ${createHash('sha256')
            .update(ip)
            .digest('hex')}</h3>
    </body>
</html>
`
})

addEventListener('fetch', event => {
    event.respondWith(router.handle(event))
})
