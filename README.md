# Dumpling-bot

![Dumpling Bot Icon](/assets/dumplingbot.svg)

Discord bot implemented using the [Bun runtime](https://bun.com/) and [Discord JS](https://discord.js.org/), using Typescript for type safety. The bot is made to have as little external dependencies as possible, so a lot of things are manually implemented.
The bot was written long ago, going under the nickname "Suno" (sus noodle), so I'm migrating much of that code using modern tools and releasing it as FOSS for others to use and learn from it. Yes, the logo is the Bun logo, modified to look like Discord.

**Currently the bot is a work in progress.**

## Installation

1. Follow the instructions from https://discordjs.guide/preparations/setting-up-a-bot-application.html and https://discordjs.guide/preparations/adding-your-bot-to-servers.html to create the basic bot.

2. Clone the repo and install dependencies:

[Make sure Bun is installed and at its latest version.](https://bun.com/docs/installation)

```bash
git clone https://github.com/document10/dumpling-bot
cd dumpling-bot
bun install
```

3. Setup environment variables (`.env`) according to the instructions from `example.env`.

4. Register the commands to the Discord API using:

```bash
bun deploy-global
```

or just to the development guild using:

```bash
bun deploy-local
```

It's recommended to use the local deployment during development to avoid rate limits.

5. Setup the database

Using databases other than `PostgresSQL` requires [v1.2.21](https://bun.com/blog/bun-v1.2.21) or newer.

```bash
bun db-setup
```

Optionally set `DATABASE_SECRETS` to `YES` so that all sensitive info (like API keys) are stored and loaded from the database instead of `.env`. Then load them from the `.env` file:

```bash
bun db-secrets
```

6. Start the bot:

```bash
bun start
```

or in dev mode for restarting on changes:

```bash
bun dev
```

Optionally, you can update the following fields in `package.json` to reflect the current state of the bot (when using the `/about` command):
```
author
author_website
source_host
homepage
keywords
version
```

## Other useful commands

- `bun dev`: Start the bot in development mode, automatically restarting on changes.
- `bun db-export`: Backs up the database contents to a file.
- `bun db-purge`: Removes all tables related to the bot from the database. (**VERY DANGEROUS**)
- `bun db-help`: Displays help information for the database commands.
- `bun format`: Formats the codebase using [Deno](https://deno.com/).
