import { useEffect, useState } from 'react'
import { type Size } from '~/types/common.types'
import { htmlImageFromFileOrUrl } from '~/utils/image.utils'

export type HtmlImage = {
    el: HTMLImageElement
    size: Size
}
export function useHtmlImage(image: File | string | null) {
    const [img, setImg] = useState<HtmlImage | null>(null)

    useEffect(() => {
        if (image === null) return

        htmlImageFromFileOrUrl(image)
            .then((img) => {
                setImg(img)
            })
            .catch(() => setImg(null))
    }, [image])

    return img
}
