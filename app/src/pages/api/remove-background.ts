import multer from 'multer'
import nextConnect from 'next-connect'
import sharp from 'sharp'
import { Rembg } from 'rembg-node'

export const config = {
    api: {
        bodyParser: false,
    },
}

const upload = multer({
    storage: multer.memoryStorage(),
})

const apiRoute = nextConnect()

apiRoute.post(
    '/api/remove-background',
    upload.single('file'),
    (req, res) => {
        if (!req.file) {
            res.status(400).json({ message: 'no file' })
            return
        }
        const input = sharp(req.file?.buffer)
        const rembg = new Rembg({
            logging: true,
            
        })

        rembg.remove(input).then(async output => {
            const outputFile = await output.trim().png().toBuffer()
            res.status(200).send(outputFile)
        }).catch(err => {
            res.status(500).json(err)
        })
    }
)

export default apiRoute
