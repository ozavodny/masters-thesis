import { PrismaClient, type TemplateText } from './generated/client'
const prisma = new PrismaClient()

async function main() {
    const developerUser = await prisma.user.upsert({
        where: { email: 'developer@zavodny.net' },
        update: {},
        create: {
            id: 'development-user-id',
            email: 'developer@zavodny.net',
            name: 'Developer',
            image: 'stock-image/developer-profile.jpg',
        },
    })

    await prisma.account.upsert({
        where: {
            provider_providerAccountId: {
                provider: 'development-provider',
                providerAccountId: 'development-user-id',
            },
        },
        update: {},
        create: {
            provider: 'development-provider',
            type: 'oauth',
            providerAccountId: 'development-user-id',
            access_token: 'development-access-token',
            expires_at: Date.now() + 365 * 100,
            token_type: 'Bearer',
            userId: developerUser.id,
        },
    })

    const templates: {
        name: string
        image: string
        texts: Omit<TemplateText, 'id' | 'templateId'>[]
    }[] = [
        {
            name: 'Drake Hotline Bling',
            image: 'stock-image/example-background-1.png',
            texts: [
                {
                    x: 51.31384663691028,
                    y: 6.875317134779,
                    fontSize: 35,
                    color: '#000',
                    strokeColor: '#fff',
                    width: 46.89561984576056,
                    height: 31.00321534247503,
                    text: 'sleep',
                    rotation: 0,
                    scale: 1,
                    zIndex: 0,
                },
                {
                    x: 50.97836854045649,
                    y: 60.53621864243169,
                    fontSize: 32,
                    color: '#000',
                    strokeColor: '#fff',
                    width: 47.79248002096161,
                    height: 30.15756522585857,
                    text: 'coffee',
                    scale: 1,
                    rotation: 0,
                    zIndex: 1,
                },
            ],
        },
        {
            name: 'Two Buttons',
            image: 'stock-image/example-background-2.png',
            texts: [
                {
                    x: 7.559546998109012,
                    y: 13.01415328575151,
                    fontSize: 28,
                    color: '#000',
                    strokeColor: '#fff',
                    width: 32.86781082143326,
                    height: 9.388013869270766,
                    text: 'left',
                    scale: 1,
                    rotation: -14.12947054748353,
                    zIndex: 0,
                },
                {
                    x: 44.22702446520401,
                    y: 7.895544066111788,
                    fontSize: 25,
                    color: '#000',
                    strokeColor: '#fff',
                    width: 28.5077951002227,
                    height: 8.983548876120606,
                    text: 'right',
                    scale: 1,
                    rotation: -11.58221192557961,
                    zIndex: 1,
                },
                {
                    x: -0.5028019218268496,
                    y: 79.33083473890585,
                    fontSize: 44,
                    color: '#000',
                    strokeColor: '#fff',
                    width: 100,
                    height: 20,
                    text: 'dilemma',
                    scale: 1,
                    rotation: 0,
                    zIndex: 2,
                },
            ],
        },
        {
            name: 'Distracted Boyfriend',
            image: 'stock-image/example-background-3.png',
            texts: [
                {
                    x: 68.25055396945373,
                    y: 61.10485730134389,
                    fontSize: 18,
                    color: '#000',
                    strokeColor: '#fff',
                    width: 28.5077951002227,
                    height: 17.64337331826042,
                    text: 'friends',
                    scale: 1,
                    rotation: 0,
                    zIndex: 0,
                },
                {
                    x: 8.049259793004047,
                    y: 73.13230513422593,
                    fontSize: 24,
                    color: '#000',
                    strokeColor: '#fff',
                    width: 38.06629110441502,
                    height: 22.52260659485883,
                    text: 'gaming',
                    scale: 1,
                    rotation: 0,
                    zIndex: 1,
                },
            ],
        },
        {
            name: 'UNO Draw 25 Cards',
            image: 'stock-image/example-background-4.png',
            texts: [
                {
                    x: 6.036114399045328,
                    y: 24.31851510630835,
                    fontSize: 23,
                    color: '#000',
                    strokeColor: '#fff',
                    width: 44.00227172646812,
                    height: 26.69934875307978,
                    text: 'go to sleep',
                    scale: 1,
                    rotation: 0,
                    zIndex: 0,
                },
            ],
        },
        {
            name: 'Running Away Balloon',
            image: 'stock-image/example-background-5.png',
            texts: [
                {
                    x: 0.5051087154593923,
                    y: 75.35973596634554,
                    fontSize: 10,
                    color: '#000',
                    strokeColor: '#fff',
                    width: 33.370889558496,
                    height: 11.81225666017792,
                    text: 'procrastination',
                    scale: 1,
                    rotation: 0,
                    zIndex: 0,
                },
                {
                    x: 75.1168284731932,
                    y: 54.83548424713644,
                    fontSize: 21,
                    color: '#000',
                    strokeColor: '#fff',
                    width: 41.58784226385432,
                    height: 24.70816174071849,
                    text: 'good grades',
                    scale: 1,
                    rotation: 0,
                    zIndex: 1,
                },
                {
                    x: 57.1840212867621,
                    y: 3.119499433895999,
                    fontSize: 25,
                    color: '#000',
                    strokeColor: '#fff',
                    width: 45.94785798506483,
                    height: 32.37270909990772,
                    text: 'good grades',
                    scale: 1,
                    rotation: 0,
                    zIndex: 2,
                },
            ],
        },
        {
            name: 'Left Exit 12 Off Ramp',
            image: 'stock-image/example-background-6.png',
            texts: [
                {
                    x: 10.23111308851537,
                    y: 2.111891956325386,
                    fontSize: 15,
                    color: '#000',
                    strokeColor: '#fff',
                    width: 62.04637757107297,
                    height: 16.0497318912962,
                    text: 'work-life balance',
                    scale: 1,
                    rotation: 0,
                    zIndex: 0
                },
                {
                    x: 51.98507964505378,
                    y: 12.32594631208756,
                    fontSize: 20,
                    color: '#000',
                    strokeColor: '#fff',
                    width: 39.24014149089476,
                    height: 27.63998092868157,
                    text: 'one last fix',
                    scale: 1,
                    rotation: 0,
                    zIndex: 1
                },
            ],
        },
        {
            name: 'Change My Mind',
            image: 'stock-image/example-background-7.png',
            texts: [
                {
                    x: 36.89216390269937,
                    y: 64.05579975474691,
                    fontSize: 17,
                    color: '#000',
                    strokeColor: '#fff',
                    width: 56.00943272631991,
                    height: 21.96282048693008,
                    text: 'react > angular',
                    scale: 1,
                    rotation: -8.054727653606408,
                    zIndex: 0
                },
            ],
        },
        {
            name: 'Bernie I Am Once Again Asking For Your Support',
            image: 'stock-image/example-background-8.png',
            texts: [
                {
                    x: -4.84058984141559e-16,
                    y: 86.51003588872521,
                    fontSize: 17,
                    color: '#000',
                    strokeColor: '#fff',
                    width: 99.94497576313373,
                    height: 13.28629248939627,
                    text: 'noone',
                    scale: 1,
                    rotation: 0,
                    zIndex: 1
                },
            ],
        },
    ]

    const persistedTemplates = await Promise.all(
        templates.map(({ name, texts, image }) => {
            return prisma.template.create({
                data: {
                    user: {
                        connect: {
                            id: developerUser.id,
                        },
                    },
                    name,
                    isPublic: true,
                    image: {
                        create: {
                            fileName: image,
                        },
                    },
                    texts: {
                        create: texts,
                    },
                },
            })
        })
    )

    console.log({ developerUser, persistedTemplates })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
