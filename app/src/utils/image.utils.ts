import { ACCEPTED_IMAGE_TYPES } from '~/const/image.const'
import { type Size } from '~/types/common.types'
import mime from 'mime-types'

export function imageFitContainer(imageSize: Size, containerSize: Size): Size {
    const ratio = imageSize.height / imageSize.width || 0
    const ratioContainer = containerSize.height / containerSize.width || 0
    const width =
        ratio < ratioContainer
            ? containerSize.width
            : containerSize.height / ratio || 0
    const height = width * ratio

    return { width, height }
}

export function imageFitWidth(imageSize: Size, containerWidth: number): Size {
    const ratio = imageSize.height / imageSize.width || 0
    const width = containerWidth
    const height = width * ratio

    return { width, height }
}

export const fileIsImage = (file: File): boolean => {
    return ACCEPTED_IMAGE_TYPES.includes(file['type'])
}

export const responseIsImage = (res: Response): boolean => {
    const contentType = res.headers.get('Content-Type')
    return !!contentType && ACCEPTED_IMAGE_TYPES.includes(contentType)
}

export const getImageFromUrl = async (
    url: string,
    checkImage = true
): Promise<File> => {
    try {
        const res = await fetch(url)

        if (res.ok && (!checkImage || responseIsImage(res))) {
            return new File([await res.blob()], url, {
                type: mime.lookup(url) || 'image/png',
            })
        }
    } catch (e) {}

    throw 'Unable to get image from url'
}

export type HtmlImage = {
    el: HTMLImageElement
    size: Size
}

export const htmlImageFromFileOrUrl = (image: File | string): Promise<HtmlImage> => {
    return new Promise((resolve) => {
        const el = document.createElement('img')
        el.onload = () =>
            resolve({
                el,
                size: {
                    width: el.width,
                    height: el.height,
                },
            })
        if(typeof image === 'string') {
            el.src = image
        } else {
            el.src = URL.createObjectURL(image)
        }
    })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasPath(object: any): object is { path: any } {
    return 'path' in object
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasStringPath(object: any): object is { path: string } {
    return hasPath(object) && typeof object['path'] === 'string'
}

export const uploadImageHelper = (image: Blob): Promise<string> => {
    return new Promise((res, rej) => {
        const data = new FormData()
        data.append('file', image)

        fetch('/api/image-upload', {
            method: 'POST',
            body: data,
        })
            .then((response) => {
                response.json().then((jsonResponse) => {
                    if (!hasStringPath(jsonResponse)) {
                        rej()
                        return
                    }
    
                    res(jsonResponse.path)
                }).catch(rej)
            })
            .catch(rej)
    })
}