import { type GetServerSideProps, type InferGetServerSidePropsType } from 'next'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { DragDropFile } from '~/components/common/drag-drop'
import { getServerAuthSession } from '~/server/auth'
import { prisma } from '~/server/db'
import { uploadImageHelper } from '~/utils/image.utils'
import { queryApi } from '~/utils/query-api.utils'

export const getServerSideProps = (async (context) => {
    const session = await getServerAuthSession(context)
    // count meme templates created
    const memeTemplatesCreated =
        (await prisma.template.count({
            where: {
                userId: session?.user?.id,
            },
        })) || 0

    const memesCreated =
        (await prisma.meme.count({
            where: {
                userId: session?.user?.id,
            },
        })) || 0

    // Pass data to the page via props
    return { props: { memeTemplatesCreated, memesCreated } }
}) satisfies GetServerSideProps<{
    memeTemplatesCreated: number
    memesCreated: number
}>

const Profile = ({
    memeTemplatesCreated,
    memesCreated,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const { data: sessionData, update } = useSession()
    const updateUserName = queryApi.user.updateUserName.useMutation()
    const updateProfilePicture = queryApi.user.updateProfileImage.useMutation()
    const [userName, setUserName] = useState(sessionData?.user?.name || '')
    const [imageState, setImageState] = useState<{
        modal: boolean
        image: File | null
        error: string | null
    }>({ modal: false, image: null, error: null })

    const saveUserName = () => {
        updateUserName
            .mutateAsync(userName)
            .then(() => update())
            .catch(() => undefined)
    }

    const openDialog = () => {
        setImageState({
            modal: true,
            image: null,
            error: null,
        })
    }

    const closeDialog = () => {
        setImageState((state) => ({ ...state, modal: false }))
    }

    const uploadImageActions = {
        setError: (error: string) =>
            setImageState((state) => ({ ...state, error, image: null })),
        setImage: (image: File) =>
            setImageState((state) => ({ ...state, image, error: null })),
        setLoading: () => undefined,
    }

    const confirmDialog = () => {
        if (!imageState.image) return

        uploadImageHelper(imageState.image)
            .then((fileName) => {
                updateProfilePicture
                    .mutateAsync(fileName)
                    .then(() => update())
                    .then(() => closeDialog())
                    .catch(() => undefined)
                closeDialog()
            })
            .catch(() => {
                uploadImageActions.setError('Error uploading image to server.')
            })
    }

    return (
        <>
            <dialog
                className={
                    'modal items-start' +
                    (imageState.modal ? ' modal-open' : '')
                }
            >
                <div className="modal-box mt-12 flex flex-col">
                    <DragDropFile
                        loading={false}
                        actions={uploadImageActions}
                    ></DragDropFile>
                    {imageState.image ? (
                        <img
                            alt="uploaded profile picture"
                            className="mx-auto  mt-3 w-64"
                            data-cy="profile-picture-preview"
                            src={URL.createObjectURL(imageState.image)}
                        ></img>
                    ) : (
                        <></>
                    )}
                    <div className="mt-5 flex w-full justify-between">
                        <button
                            className="btn btn-neutral"
                            onClick={closeDialog}
                        >
                            Cancel
                        </button>
                        <button
                            disabled={imageState.image === null}
                            className="btn btn-primary"
                            data-cy="save-profile-picture"
                            onClick={confirmDialog}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </dialog>
            <div className="flex flex-col">
                <div className="mx-auto flex w-11/12 2xl:w-3/4">
                    <div className="my-auto">
                        <div className="stat-figure flex text-accent">
                            <div className="avatar relative">
                                <div className="w-16 rounded-full">
                                    <img
                                        alt="profile-picture"
                                        src={
                                            sessionData?.user?.image ||
                                            '/profile.webp'
                                        }
                                    />
                                </div>
                                <button
                                    className="absolute -left-2 -top-2 text-primary" data-cy="edit-profile-picture"
                                    onClick={openDialog}
                                >
                                    <FaEdit size={30}></FaEdit>
                                </button>
                            </div>
                            <div className="my-auto ml-5 mr-5">
                                {sessionData?.user?.name ? (
                                    <div data-cy="username">{sessionData.user.name}</div>
                                ) : (
                                    <></>
                                )}
                                <div>
                                    {sessionData?.user?.email ||
                                        'No email found'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="stats w-full shadow">
                        <div className="stat">
                            <div className="stat-title">
                                Meme Templates Created
                            </div>
                            <div className="stat-value text-primary">
                                {memeTemplatesCreated}
                            </div>
                        </div>

                        <div className="stat">
                            <div className="stat-title">Memes Created</div>
                            <div className="stat-value text-secondary">
                                {memesCreated}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mx-auto mt-4">
                    <p className="text-center">Change username</p>
                    <input
                        className="input input-bordered mr-2 mt-2"
                        data-cy="username-input"
                        type="text"
                        placeholder="Name"
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={saveUserName} data-cy="save-username">
                        Save
                    </button>
                </div>
            </div>
        </>
    )
}

export default Profile
