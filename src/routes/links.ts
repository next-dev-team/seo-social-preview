import express from "express";
import {
  createLink,
  getAllLinks,
  deleteLink,
  getLinkById,
} from "../services/link.service";
import { isValidUrl } from "../utils/validators";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { originalUrl, title, description, imageUrl } = req.body;

    if (!originalUrl || !isValidUrl(originalUrl)) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    const link = await createLink(originalUrl, {
      title,
      description,
      imageUrl,
    });
    res.json(link);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const links = await getAllLinks();
    res.json(links);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const link = await getLinkById(req.params.id);
    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }
    res.json(link);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await deleteLink(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete link" });
  }
});

export default router;
