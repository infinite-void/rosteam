const QuickEncrypt = require('quick-encrypt');
const fs = require('fs');

let keys = QuickEncrypt.generate(2048);

try {
    if (!fs.existsSync('../controllers/keys')) {
        fs.mkdirSync('../controllers/keys')
    }
    fs.writeFileSync('../controllers/keys/public.pem', keys.public, "utf-8")
    fs.writeFileSync('../controllers/keys/private.pem', keys.private, "utf-8")
} catch (err) {
    console.error(err)
}