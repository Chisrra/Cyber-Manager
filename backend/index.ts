import { Server, ic } from 'azle';
import cors from "cors";
import express from 'express';

type Computer = {
    id: number;
    status: boolean;
}

let computers: Computer[] = [
    { id: 1, status: true },
    { id: 2, status: true },
    { id: 3, status: true },
];

export default Server(() => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    // app.use((req, res, next) => {
    //     if (ic.caller().isAnonymous()) {
    //         res.status(401);
    //         res.send();
    //     } else {
    //         next();
    //     }
    // });

    app.post('/test', (req, res) => {
        res.json(req.body);
    });

    app.get('/whoami', (req, res) => {
        res.statusCode = 200;
        res.send(ic.caller());
    });

    app.get('/health', (req, res) => {
        res.send().statusCode = 204;
    });

    app.put('/computers/:id', (req, res) => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid ID' });
            return;
        }

        const existingComputerIndex = computers.findIndex((computer) => computer.id === id);
        if (existingComputerIndex === -1) {
            res.status(404).json({ error: 'Computer not found' });
            return;
        }

        const existingComputer = computers[existingComputerIndex];
        if (existingComputer.status) {
            computers[existingComputerIndex].status = false;
            res.json({ id, status: true });
        } else {
            res.json({ id, status: false });
        }
    });

    app.get('/status/computers', (req, res) => {
        res.json(computers);
    });

    return app.listen();
});
