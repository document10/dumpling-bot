# Dumpling-bot

![Dumpling Bot Icon](/assets/dumplingbot.svg)

Discord bot implemented using the [Bun runtime](https://bun.com/) and [Discord JS](https://discord.js.org/), using Typescript for type safety. The bot was written long ago, going under the nickname "Suno" (sus noodle), so I'm migrating much of that code using modern tools and releasing it as FOSS for others to use and learn from it. Yes, the logo is the Bun logo, modified to look like Discord.

**Currently the bot is a work in progress.**

## Installation

1. Follow the instructions from https://discordjs.guide/preparations/setting-up-a-bot-application.html and https://discordjs.guide/preparations/adding-your-bot-to-servers.html to create the basic bot.

2. Clone the repo and install dependencies:

[Make sure Bun is installed and at its latest version.](https://bun.com/docs/installation)

```bash
bun install
```

3. Rename `example.env` to `.env` and edit it with your credentials according to the instructions.

4. Register the commands to the Discord API using:

```bash
bun deploy-global
```

or just to the development guild using:

```bash
bun deploy-local
```

It's recommended to use the local deployment during development to avoid rate limits.

5. Start the bot:

```bash
bun start
```

or in dev mode for restarting on changes:

```bash
bun dev
```

## Database setup

Currently, connecting a database is optional, and is only used for storing secrets (like `DISCORD_TOKEN`) in the database when `DATABASE_SECRETS` is set to `yes`.  
In the future, the database will be required for storing info related to servers like staff roles, welcome/leave messages and so on.

First make sure you have the `.env` file configured with all the appropriate variables.

### Using the "raw" driver

This driver uses the native [Bun SQL](https://bun.com/docs/api/sql) implementation and is much faster. Its current limitation is that it only supports PostgresSQL, but this should change in the future.  
Setup the database table using:

```bash
bun sql-setup
```

This command also loads the secrets into the database. To load them manually when they change:

```bash
bun sql-secrets
```

This driver is used by default, so no futher changes are needed.

### The Prisma driver

This driver uses [Prisma](https://www.prisma.io/) and supports a wide range of databases. It is slower then the "raw" driver, and it will likely be removed once Bun's SQL support is good enough, to avoid having to maintain two separate drivers.  
Update `prisma/schema.prisma` according to your database settings. To configure the database and client and load the secrets into the database run:

```bash
bun prisma-setup
```

You can also manually create the client when the database settings change:

```bash
bun prisma-client
```

To update the secrets to the database run:

```bash
bun prisma-secrets
```

To use this driver in the project edit `src/index.ts`,`src/deploy-commands.ts` and all the files from `src/commands/owner` replacing:

```typescript
import { getSecret } from "../../libraries/secrets-raw";
```

with:

```typescript
import { getSecret } from "../../libraries/secrets-prisma";
```

This line should be at the top of the files.
