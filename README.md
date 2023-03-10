# Clodbunker

At the moment we aim to be a cutting-edge service that provides anonymous and secure cloud storage, with a strong focus on end-to-end encryption and user privacy. We also want to run on the Tor network to ensures that your identity stays anonymous and your data is protected from prying eyes and potential hackers.

- [ ] The app has a satisfactory design.
- [ ] The user experience is seamless, contemporary, and pleasant.
- [ ] The file browser component is both functional and stylish.
- [ ] The app supports cryptocurrency payments.
- [ ] The shared links are fully operational on both clearnet and darknet.
- [ ] The backend and settings are integrated.

## Installation

1. Clone the repo to your machine.
2. Add .env file with the following variable:

```
DATABASE_URL=""
SECRET=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_END_POINT=""
AUTH0_DOMAIN=""
AUTH0_CLIENT_ID=""
```

3. pnpm install
4. Go into ./apps/express-backend and run:

```
pnpm prisma generate
```

5. Go into the root of the repository and run:

```
pnpm run dev
```

That will start the frontend and the backend at the same time.

[Click for starter guide](https://github.com/cloudbunker-net/cloudbunker/blob/master/docs/starter.md)
