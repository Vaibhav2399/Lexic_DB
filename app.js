import express from 'express'
import { getTermDetails, getAllWords, getRelatedTerms } from './database.js';

const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  
app.get("/terms", async (req,res) => {
    const terms = await getAllWords()
    res.send(terms)
})

app.get("/terms/:term", async (req,res) => {
    const term = req.params.term
    const result = await getTermDetails(term) 
    res.send(result)
})

app.get("/relatedterms/:term", async (req,res) => {
  const term = req.params.term
  const result = await getRelatedTerms(term) 
  res.send(result)
})

// app.use(express.static(path.join(__dirname, '/Lexic')));

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

app.listen(8088, () => {
    console.log("App listening on port 8088");
})
