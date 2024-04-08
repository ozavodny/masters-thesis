import { type AppState } from "~/state/app.state";

export const sortTemplateObjects = (texts: AppState["texts"], images: AppState["images"]) => {
    const mappedTexts = Object.entries(texts).map(([id, object]) => ({id, object, type: 'text' as const}))
    const mappedImages = Object.entries(images).map(([id, object]) => ({id, object, type: 'image' as const}))
    const allObjects = [...mappedTexts, ...mappedImages]

    return allObjects.sort((a, b) => {
        return a.object.zIndex - b.object.zIndex
    })
}