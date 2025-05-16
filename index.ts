import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { encryptPassword } from "./crypt";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.post("/api/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const response = await fetch(`${process.env.API_URL}/login`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
        "Application-Token": `${process.env.API_SECRET_TOKEN}`,
      },
    });

    const data = await response.json();
    res.status(response.status).send(data);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/me/profile", async (req: Request, res: Response) => {
  const { authorization } = req.headers;

  try {
    const response = await fetch(`${process.env.API_URL}/me/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization ?? "",
        "Application-Token": `${process.env.API_SECRET_TOKEN}`,
      },
    });

    const data = await response.json();
    res.status(response.status).send(data);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/users", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const response = await fetch(`${process.env.API_URL}/users`, {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
        "Application-Token": `${process.env.API_SECRET_TOKEN}`,
      },
    });

    const data = await response.json();
    res.status(response.status).send(data);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/me/feed", async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const { page, only_parents } = req.query;

  try {
    const response = await fetch(
      `${process.env.API_URL}/me/feed?page=${page}&only_parents=${only_parents}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization ?? "",
          "Application-Token": `${process.env.API_SECRET_TOKEN}`,
        },
      }
    );

    const data = await response.json();
    res.status(response.status).send(data);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/me/tuits/:id/likes", async (req: Request, res: Response) => {
  try {
    const { authorization } = req.headers;
    const response = await fetch(
      `${process.env.API_URL}/me/tuits/${req.params.id}/likes`,
      {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
          "Application-Token": `${process.env.API_SECRET_TOKEN}`,
          Authorization: authorization ?? "",
        },
      }
    );
    const data = await response.json();

    res.status(response.status).send(data);
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/me/tuits/:id/likes", async (req: Request, res: Response) => {
  try {
    const { authorization } = req.headers;
    const response = await fetch(
      `${process.env.API_URL}/me/tuits/${req.params.id}/likes`,
      {
        method: "DELETE",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
          "Application-Token": `${process.env.API_SECRET_TOKEN}`,
          Authorization: authorization ?? "",
        },
      }
    );
    const data = await response.json();

    res.status(response.status).send(data);
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/me/tuits", async (req: Request, res: Response) => {
  try {
    const { authorization } = req.headers;
    const { message } = req.body;
    const response = await fetch(`${process.env.API_URL}/me/tuits`, {
      method: "POST",
      body: JSON.stringify({
        message,
      }),
      headers: {
        "Content-Type": "application/json",
        "Application-Token": `${process.env.API_SECRET_TOKEN}`,
        Authorization: authorization ?? "",
      },
    });
    const data = await response.json();

    res.status(response.status).send(data);
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/api/me/profile", async (req: Request, res: Response) => {
  try {
    const { authorization } = req.headers;
    const { name, avatar_url, password } = req.body;
    let passwordHash = "";

    if (password) passwordHash = await encryptPassword(password);

    const response = await fetch(`${process.env.API_URL}/me/profile`, {
      method: "PUT",
      body: JSON.stringify({
        name,
        avatar_url,
        ...(password && { password: passwordHash }),
      }),
      headers: {
        "Content-Type": "application/json",
        "Application-Token": `${process.env.API_SECRET_TOKEN}`,
        Authorization: authorization ?? "",
      },
    });
    const data = await response.json();

    res.status(response.status).send(data);
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/me/tuits/:id", async (req: Request, res: Response) => {
  try {
    const { authorization } = req.headers;
    const response = await fetch(
      `${process.env.API_URL}/me/tuits/${req.params.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Application-Token": `${process.env.API_SECRET_TOKEN}`,
          Authorization: authorization ?? "",
        },
      }
    );
    const data = await response.json();
    res.status(response.status).send(data);
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/me/tuits/:id/replies", async (req: Request, res: Response) => {
  try {
    const { authorization } = req.headers;
    const response = await fetch(
      `${process.env.API_URL}/me/tuits/${req.params.id}/replies`,
      {
        headers: {
          "Content-Type": "application/json",
          "Application-Token": `${process.env.API_SECRET_TOKEN}`,
          Authorization: authorization ?? "",
        },
      }
    );
    const data = await response.json();
    res.status(response.status).send(data);
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/me/tuits/:id/replies", async (req: Request, res: Response) => {
  try {
    const { authorization } = req.headers;
    const { message } = req.body;
    const response = await fetch(
      `${process.env.API_URL}/me/tuits/${req.params.id}/replies`,
      {
        method: "POST",
        body: JSON.stringify({ message }),
        headers: {
          "Content-Type": "application/json",
          "Application-Token": `${process.env.API_SECRET_TOKEN}`,
          Authorization: authorization ?? "",
        },
      }
    );
    const data = await response.json();
    res.status(response.status).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
