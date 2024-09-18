import express, { NextFunction, Request, Response } from 'express';

const app = express();
app.use(express.json());

app.get('/postagem', (req: Request, res: Response) => {
    res.send("GET executado")
});

const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta ${PORT}`);
});