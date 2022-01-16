const express = require('express');
const mongoose = require('mongoose');

const ShortUrl = require('./models/shortUrl');

const app = express();

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', async (_, res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls });
});

app.get('/:shortUrl', async (req, res) => {
    const url = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (url === null) return res.sendStatus(404);

    url.clicks++;
    url.save();

    res.redirect(url.full);
});

app.post('/short-url', async ({ body: { fullUrl: full } }, res) => {
    await ShortUrl.create({ full });

    res.redirect('/');
});

app.listen(process.env.PORT || 5000, () => {
    console.log('Servidor rodando na porta ' + (process.env.PORT || 5000));
});