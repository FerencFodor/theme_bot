# Theme Bot
A Discord bot designed to submit, randomly select and remove themes.
The bot was created for the JameGam server, a beginner friendly game jam.

## Features
- **Theme Management:** Users can submit their own themes and view already submitted.
- **Admin Controls:** Admins can view a range of randomly selected themes to choose from and remove themes.
- **Persistent Storage:** Uses a simple relational database to store themes (used PostgreSQL that is not part of the repository).
- **Easy Setup:** Simple configuration via `config.ts` and minimal dependecies.

## Requirements
- **Node.js:** 18.2.0 or higher
- **npm:** 9.4.2 or higher

## Instalation
1. **Clone the repository:**
```
git clone https://github.com/FerencFodor/theme_bot.git
cd theme_bot
```
2. **Install dependencies:**
```
npm install
```
3. **Configure the bot:**
- in `config.ts` change the id for the **host**, **moderator** and the **bot** role respectively
- create a **.env** file if run locally, or create enviromental variables for **TOKEN** and **DATABASE_URL** (DEBUG_URL is only needed if you are locally doing changes for testing)

4. **Run the bot:**
```
nom run start
```

## Usage
- Users interact with the bot via Discord slash commands `/add` to submit new theme and `/list` show a formatted list of all the themes.
- Admins and moderators can additionally use `/remove` to remove submission and `/select` to randomly select a number of themes.

## Code structure

- `main.ts`: Main bot script handling initialization and Discord events.
- `source_data.ts`: handling DataSource for connecting to a database.
- `themecommands.ts`: logic for the Discord commands.
- `admin_only.ts`: Guard to allow admin/moderator only commands.
- `util.ts`: collection of functions to handle parsing or button behaviours.
- `config.ts`: collection of IDs for admin/moderator/bot role.
- `entity`: folder containing representation of database table structure. 

## Dependencies
- `discordx`: Discord API interaction using TypeScript
- `dotenv`: loading values from .env files to enviroment
- `pg`: PostgreSQL client
- `typeorm`: Data mapper for TypeScript
- `reflect-metadata`: Metadata Reflection API
