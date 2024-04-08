# MemeBro application

An application for managing and sharing meme templates and creating memes.

## `src` folder structure
```
├───components - all the application components
│   ├───common - common components
│   ├───create - create page components
│   │   ├───import-image
│   │   │   ├───step-crop
│   │   │   ├───step-import
│   │   │   └───step-remove-bg
│   │   └───template
│   ├───layout - layout components
│   ├───memes - meme components
│   └───templates - template components
├───const - defined application constants
├───hooks - react hooks
├───pages - all the pages of the application
│   └───api - api endpoints
│       ├───auth - NextAuth endpoints
│       ├───image - image serving
│       └───trpc - tRPC endpoints
├───server - code that runs server side
|   |      - authentication code
|   |      - database code
│   └───api - tRPC setup
│       └───routers - tRPC endpoints
├───state - application state logic
├───styles - global styles
├───test-utils - utilities for component testst
├───types - global type definitions
└───utils - various utilities
```

## Developing locally
1. Copy the `.env.development` file to `.env.local` and change the values according to your development environment
2. Install dependencies using `npm install`
3. Create the database using `npm run db:push`
4. Seed the database using `npm run db:seed`
5. Run the development server using `npm run dev`

## Testing
1. Complete steps from previous point, you need to have the application running for e2e testing
2. Run `npm run cypress`, which opens a cypress window for testing

## Running in production
1. Copy the `docker-compose.yml` file. 
2. Configure the container using environment variables, as outlined in the file.
3. Deploy using `docker-compose`
