import { createStore, useStore } from 'zustand'
import {
    type Template,
    type TemplateText,
    type TemplateImage,
} from 'prisma/generated/client'
import { api } from '~/utils/query-api.utils'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import {
    getImageFromUrl,
    htmlImageFromFileOrUrl,
    imageFitContainer,
    uploadImageHelper
} from '~/utils/image.utils'
import { POPUP_TIMEOUT } from '~/const/common.const'
import { FRACTION_MULTIPLIER } from '~/const/canvas.const'
import { createContext, useContext, useRef } from 'react'

type BackgroundState = {
    background: File | null
}

export type PopupType = {
    id: number
    type: 'info' | 'warning' | 'success' | 'error'
    message: string
}

type PopupState = {
    popupCounter: number
    popups: PopupType[]
    addPopup: (popup: Omit<PopupType, 'id'>) => void
    removePopup: (id: number) => void
}

type DialogType = 'addImage' | 'save' | 'exportMeme'

type DialogState = {
    dialogs: {
        [key in DialogType]: boolean
    }
    setDialog: (dialog: DialogType, open: boolean) => void
}

type FTemplateText = Partial<TemplateText> &
    Omit<TemplateText, 'id' | 'templateId'>

type TextState = {
    texts: {
        [key: string]: FTemplateText
    }
    addText: () => void
    deleteText: (key: string) => void
    updateText: (key: string, text: FTemplateText) => void
}

type FTemplateImage = Omit<TemplateImage, 'id' | 'templateId' | 'imageId'> &
    Partial<Pick<TemplateImage, 'id' | 'templateId' | 'imageId'>> &
    (
        | { imageFile: File; imageUrl?: never }
        | { imageUrl: string; imageFile?: never }
    )

type ImageState = {
    images: {
        [key: string]: FTemplateImage
    }
    addImage: () => void
    updateImage: (key: string, image: FTemplateImage) => void
    deleteImage: (key: string) => void
}

type TemplateState = {
    template: Pick<Template, 'isPublic' | 'name'> & Partial<Template>
    currentZIndex: number
    switchZIndexes: (
        obj1: { type: 'text' | 'image'; id: string },
        obj2: { type: 'text' | 'image'; id: string }
    ) => void
    updateTemplate: (updates: Partial<Template>) => void
    saveTemplate: (overwrite: boolean) => void
    useTemplate: (id: string) => Promise<void>
}

type MemeState = {
    exportedMeme: null | string
    setExportedMeme: (exportedMeme: null | string) => void
    exportMeme: (meme: Blob, authenticated?: boolean) => void
}

export type ImageImportStep = 'import' | 'crop' | 'remove-bg'

type ImageImportState = {
    isImportingBackground: boolean
    importCurrentStep: ImageImportStep
    importedImage: File | null
    importNextStep: (image: File) => void
    openImport: (isImportingBackground?: boolean) => void
}

export type AppState = BackgroundState &
    PopupState &
    DialogState &
    TextState &
    ImageState &
    TemplateState &
    MemeState &
    ImageImportState

const appStore = createStore<AppState>()(
    devtools(
        persist(
            immer((set, get) => ({
                // Background
                background: null,
                popupCounter: 0,
                popups: [],
                addPopup: (popup) => {
                    set((state) => {
                        const id = state.popupCounter
                        state.popups.push({ id, ...popup })
                        state.popupCounter++

                        setTimeout(() => {
                            get().removePopup(id)
                        }, POPUP_TIMEOUT)
                    })
                },
                removePopup: (id: number) => {
                    set((state) => {
                        if (state.popups.length === 1) {
                            state.popups = []
                        } else {
                            state.popups = state.popups.filter(
                                (popup) => popup.id == id
                            )
                        }
                    })
                },
                texts: {},
                addText: () => {
                    set((state) => {
                        const key = uuidv4()
                        state.texts[key] = {
                            x: 0,
                            y: 0,
                            color: '#000',
                            strokeColor: '#fff',
                            width: 100,
                            height: 20,
                            text: '',
                            scale: 1,
                            rotation: 0,
                            fontSize: 50,
                            zIndex: state.currentZIndex++,
                        }
                    })
                },
                updateText: (id, text) =>
                    set((state) => {
                        state.texts[id] = text
                    }),
                deleteText: (id) =>
                    set((state) => {
                        delete state.texts[id]
                    }),
                images: {},
                addImage: () => {
                    set((state) => {
                        state.openImport()
                    })
                },
                updateImage: (id, image) =>
                    set((state) => {
                        state.images[id] = image
                    }),
                deleteImage: (id) =>
                    set((state) => {
                        delete state.images[id]
                    }),
                // Templates
                currentZIndex: 0,
                switchZIndexes: (obj1, obj2) => {
                    set((state) => {
                        const stateObj1 =
                            obj1.type === 'text'
                                ? state.texts[obj1.id]
                                : state.images[obj1.id]
                        const stateObj2 =
                            obj2.type === 'text'
                                ? state.texts[obj2.id]
                                : state.images[obj2.id]
                        if (stateObj1 && stateObj2) {
                            const tmpZIndex = stateObj1.zIndex
                            stateObj1.zIndex = stateObj2.zIndex
                            stateObj2.zIndex = tmpZIndex
                        }
                    })
                },
                template: {
                    name: '',
                    isPublic: false,
                },
                updateTemplate: (updates) => {
                    set((state) => {
                        state.template = { ...state.template, ...updates }
                    })
                },
                useTemplate: async (id) => {
                    const template = await api.template.getTemplate.query(id)

                    if (!template) return

                    const image = await getImageFromUrl(
                        template.image.fileName,
                        false
                    )

                    set((state) => {
                        state.template = template
                        state.texts = {}
                        state.currentZIndex = 0
                        template.texts.forEach((text) => {
                            state.texts[text.id] = { ...text }
                            if (state.currentZIndex <= text.zIndex)
                                state.currentZIndex = text.zIndex + 1
                        })
                        state.images = {}
                        template.images.forEach((image) => {
                            state.images[image.id] = {
                                ...image,
                                imageUrl: image.image.fileName,
                            }
                            if (state.currentZIndex <= image.zIndex)
                                state.currentZIndex = image.zIndex + 1
                        })
                        if (image) state.background = image
                    })
                },
                saveTemplate: (overwrite) => {
                    const state = get()

                    if (state.background === null) {
                        get().addPopup({
                            type: 'error',
                            message:
                                'Cannot save template without a background!',
                        })
                        return
                    }

                    if (state.template.id && overwrite) {
                        const imagePromises = Object.values(state.images).map(
                            (image) => {
                                if (image.imageFile) {
                                    return uploadImageHelper(
                                        image.imageFile
                                    ).then((imageFileName) => ({
                                        ...image,
                                        imageFileName,
                                    }))
                                } else {
                                    return Promise.resolve({
                                        ...image,
                                        imageFileName: image.imageUrl,
                                    })
                                }
                            }
                        )

                        Promise.all(imagePromises)
                            .then(async (imagePaths) => {
                                if (!state.template.id) {
                                    throw 'Template id is missing.'
                                }
                                const updatedTemplate =
                                    await api.template.updateTemplate.query({
                                        texts: Object.values(state.texts),
                                        images: imagePaths,
                                        template: {
                                            ...state.template,
                                            id: state.template.id,
                                        },
                                    })

                                set((state) => {
                                    state.images = {}
                                    updatedTemplate.images.forEach((image) => {
                                        state.images[image.id] = {
                                            ...image,
                                            imageUrl: image.image.fileName,
                                        }
                                    })
                                })
                            })
                            .then(() => {
                                get().addPopup({
                                    type: 'success',
                                    message: 'Meme template updated.',
                                })
                            })
                            .catch((err) => {
                                console.error(err)
                                get().addPopup({
                                    type: 'error',
                                    message: "Couldn't update meme template.",
                                })
                            })
                    } else {
                        const imagePromises = [
                            uploadImageHelper(state.background),
                            ...Object.values(state.images).map((image) =>
                                (image.imageFile
                                    ? Promise.resolve(image.imageFile)
                                    : getImageFromUrl(image.imageUrl)
                                ).then((imageFile) =>
                                    uploadImageHelper(imageFile).then(
                                        (imageFileName) => ({
                                            ...image,
                                            imageFileName,
                                        })
                                    )
                                )
                            ),
                        ] as const
                        Promise.all(imagePromises)
                            .then(async ([backgroundPath, ...imagePaths]) => {
                                const template =
                                    await api.template.createTemplate.query({
                                        fileName: backgroundPath,
                                        texts: Object.values(state.texts),
                                        images: imagePaths,
                                        name: state.template.name,
                                        isPublic: state.template.isPublic,
                                    })

                                set((state) => {
                                    state.template = template
                                    state.images = {}
                                    template.images.forEach((image) => {
                                        state.images[image.id] = {
                                            ...image,
                                            imageUrl: image.image.fileName,
                                        }
                                    })
                                })
                            })
                            .then(() => {
                                get().addPopup({
                                    type: 'success',
                                    message: 'Meme template saved.',
                                })
                            })
                            .catch(() =>
                                get().addPopup({
                                    type: 'error',
                                    message: "Couldn't save meme template.",
                                })
                            )
                    }
                },
                exportedMeme: null,
                setExportedMeme: (exportedMeme) => {
                    set((state) => {
                        state.exportedMeme = exportedMeme
                    })
                },
                exportMeme: (memeFile, authenticated = false) => {
                    const state = get()

                    if (state.background === null) {
                        get().addPopup({
                            type: 'error',
                            message:
                                'Cannot create a meme without a background!',
                        })
                        return
                    }

                    if (authenticated) {
                        uploadImageHelper(memeFile)
                            .then((path) => {
                                api.meme.createMeme
                                    .query({
                                        fileName: path,
                                    })
                                    .then((meme) => {
                                        set((state) => {
                                            state.exportedMeme = meme.imagePath
                                        })
                                    })
                                    .catch(() =>
                                        get().addPopup({
                                            type: 'error',
                                            message:
                                                "Meme couldn't be created.",
                                        })
                                    )
                            })
                            .catch(() =>
                                get().addPopup({
                                    type: 'error',
                                    message: 'Image upload failed.',
                                })
                            )
                    } else {
                        set((state) => {
                            state.exportedMeme = URL.createObjectURL(memeFile)
                        })
                    }
                },
                dialogs: {
                    save: false,
                    exportMeme: false,
                    addImage: false,
                },
                setDialog: (dialog, open) => {
                    set((state) => {
                        state.dialogs[dialog] = open
                    })
                },
                isImportingBackground: false,
                importedImage: null,
                importCurrentStep: 'import',
                importNextStep: (image) => {
                    const currentState = get()
                    if (
                        currentState.importCurrentStep === 'remove-bg' &&
                        !currentState.isImportingBackground &&
                        currentState.background
                    ) {
                        Promise.all([
                            htmlImageFromFileOrUrl(image),
                            htmlImageFromFileOrUrl(currentState.background),
                        ])
                            .then(([{ size: imageSize }, { size: bgSize }]) =>
                                set((state) => {
                                    state.dialogs.addImage = false
                                    const key = uuidv4()
                                    const size = imageFitContainer(
                                        imageSize,
                                        bgSize
                                    )
                                    state.images[key] = {
                                        x: 0,
                                        y: 0,
                                        width:
                                            (size.width * FRACTION_MULTIPLIER) /
                                            bgSize.width,
                                        height:
                                            (size.height *
                                                FRACTION_MULTIPLIER) /
                                            bgSize.height,
                                        scale: 1,
                                        rotation: 0,
                                        imageFile: image,
                                        zIndex: state.currentZIndex++,
                                    }
                                })
                            )
                            .catch(() => undefined)
                        return
                    }
                    set((state) => {
                        state.importedImage = image

                        if (state.importCurrentStep === 'import') {
                            state.importCurrentStep = 'crop'
                        } else if (state.importCurrentStep === 'crop') {
                            state.importCurrentStep = 'remove-bg'
                        } else if (state.importCurrentStep === 'remove-bg') {
                            state.dialogs.addImage = false

                            state.template = { name: '', isPublic: false }
                            state.background = image
                            state.texts = {}
                            state.images = {}
                        }
                    })
                },
                openImport: (isImportingBackground = false) =>
                    set((state) => {
                        state.isImportingBackground = isImportingBackground
                        state.importedImage = null
                        state.importCurrentStep = 'import'
                        state.dialogs.addImage = true
                    }),
            })),
            {
                name: 'meme-state',
                storage: createJSONStorage(() => sessionStorage),
                partialize: (state) =>
                    Object.fromEntries(
                        Object.entries(state).filter(
                            ([key]) =>
                                ![
                                    'background',
                                    'popups',
                                    'popupCounter',
                                    'images',
                                    'importCurrentStep',
                                    'importedImage',
                                ].includes(key)
                        )
                    ),
            }
        )
    )
)

export const AppStoreContext = createContext<typeof appStore | null>(null)

export const AppStoreProvider = ({ children }: { children: JSX.Element }) => {
    const storeRef = useRef<typeof appStore>()
    if (!storeRef.current) {
        storeRef.current = appStore
    }

    return (
        <AppStoreContext.Provider value={storeRef.current}>
            {children}
        </AppStoreContext.Provider>
    )
}

export const useAppStateInContext = <T,>(selector: (_: AppState) => T) => {
    const store = useContext(AppStoreContext)
    if (!store) {
        throw new Error('Missing StoreProvider')
    }
    return useStore(store, selector)
}
