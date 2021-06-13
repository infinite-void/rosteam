CTF Team Task.<br> "yeah we might have our own commitments. so heed to this only in your free time. feel free to copy from your previous works"<br>

1. your have to create a .env file in main directory. <br>
2. create a database in the name "rosteam"(don't mind the name).<br>
3. run the command "npm i" at the beginning and after every pull you make,<br>
4. run the command "npx sequelize-cli db:migrate" to setup the user table<br>
<br>
use command "npm start" to run <br>

contents of .env(update when you add env variables to your code.)<br>
PORT = 3000<br>
devurl = http://localhost:4000/<br>
produrl = http://localhost:4000/<br>
GOOGLE_CLIENT_ID = 275671672798-he61gabb7v3oikav843gl37h56nqubu1.apps.googleusercontent.com<br>
GOOGLE_CLIENT_SECRET = JjwJshwmMsp2J_4E_g8w9O2U<br>
JWTENCRYPTION = encryptionstring<br>
HASHALGO = sha256<br>
PUBLICKEY = /../keys/public.pem<br>
PRIVATEKEY = /../keys/private.pem<br>
emailuser = --email--<br>
emailpass = --app password--<br>
EMAILVERIFIEDLINK = http://localhost:3000/account-verified
<br>

add folder keys to root and files public.pem and private.pem with a RSA key pair.<br>
the user table is normal user table. see models/user.js for schema. Score denotes the score of user and the lastanswer is the timestamp of user's last answer.
<br>
<br>
each of us has other contacts so ping in case of need<br>
