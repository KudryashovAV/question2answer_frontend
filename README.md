First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.


## Clerk

For using authentication you have to add follow variables yo `.env` file:

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_***************************************************
CLERK_SECRET_KEY=sk_test_******************************************

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
CLERK_WEBHOOK_SECRET=whsec_********************************

Webhook functionality can't wotk with `localhost` you have to use `ngrok` service for generating normal URL.

For installing `ngrok` you have to:
1) run `brew install ngrok/ngrok/ngrok` in terminal for Mac;
2) login on the https://ngrok.com/;
3) run `ngrok config add-authtoken ************************************************` (copy token from your account);
4) run `npm run dev` in another tad of terminal;
5) run `ngrok http 3001` in terminal (since we run on the 30001 port);
6) copy your URL. Something like this: https://de64-172-98-32-141.ngrok-free.app - NOT THIS!!! From your terminal.
7) go to https://dashboard.clerk.com/apps/
8) go to `Webhooks` section
9) click `+ Add Edpoint` button
10) follow instruction.
