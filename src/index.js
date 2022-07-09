const Router = require('@tsndr/cloudflare-worker-router')
const {createHash} = require("crypto");
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
    res.body = createHash('sha256').update(ip).digest('hex')
})

addEventListener('fetch', event => {
    event.respondWith(router.handle(event))
})
