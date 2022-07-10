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
    </head>
    <body>
    <style>
        body {
            background-color: black;
        }
        h3 {
            color: white;
            margin-left: 0.5rem;
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
