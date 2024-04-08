import { v4 } from 'uuid'
import nextConnect from 'next-connect'
import multer from 'multer'
import mime from 'mime-types'
import { env } from '~/env.mjs'

// Instruct Next.js to not parse the body into json, because body is multipart/formdata
export const config = {
    api: {
        bodyParser: false,
    },
}

const getFilename = (file: Express.Multer.File) => {
    return `${v4()}.${mime.extension(file.mimetype) || 'png'}`
}

const localStorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, env.IMAGE_UPLOAD_DIR)
    },
    filename: (req, file, cb) => {
        const newName = getFilename(file)
        cb(null, newName)
    },
})

const multerOptions: multer.Options = {
    storage: localStorageEngine,
}

const upload = multer(multerOptions)

const apiRoute = nextConnect()

apiRoute.post('/api/image-upload', upload.single('file'), (req, res) => {
    if (req.file?.filename) {
        res.status(200).json({ path: `/api/image/${req.file.filename}` })
    } else {
        res.status(500).json(req.errored)
    }
})

export default apiRoute
