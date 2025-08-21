// This file is just for random testing, ignore for now

import { getSecret} from "./src/libraries/secrets-raw";

Bun.write("new.env", `DATABASE_URL="${Bun.env.DATABASE_URL}"\nDISCORD_TOKEN="${getSecret("DISCORD_TOKEN")}"\nPUBLIC_KEY="${getSecret("PUBLIC_KEY")}"\nDISCORD_GUILDID="${getSecret("DISCORD_GUILDID")}"\nDISCORD_OWNERID="${getSecret("DISCORD_OWNERID")}"\nPASTEBIN_KEY="${getSecret("PASTEBIN_KEY")}"`);

// const linguist = require("@sourcebin/linguist");
// const query = "txt";
// const res = Object.keys(linguist.linguist).find((v, i) =>
//   linguist.linguist[v].name.toLowerCase() == query.toLowerCase() ||
//   linguist.linguist[v].aliases?.map((a) => a.toLowerCase())?.includes(
//     query.toLowerCase(),
//   ) || linguist.linguist[v].extension?.toLowerCase() == query.toLowerCase()
// );
// console.log(linguist.linguist[res || 0]);
// console.log(res);
// const data = {
//   title: "Test",
//   description: "This is a test bin",
//   files: [{
//     languageId: res,
//     name: "file1.py",
//     content: 'print("Hello World")',
//   }],
// };

// const response = await fetch("https://sourceb.in/api/bins", {
//   method: "POST",
//   body: JSON.stringify(data),
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// const content = await response.json();

// console.log(content);
// console.log(`https://sourceb.in/${content.key}`);
