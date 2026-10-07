import { Request, Response } from "express";
import * as categoryService from "../services/category.service";

export async function list(_req: Request, res: Response) {
  const categories = await categoryService.listCategories();
  res.status(200).json(categories);
}

export async function findById(req: Request, res: Response) {
  const category = await categoryService.findCategoryById(req.validated.params.id);
  res.status(200).json(category);
}

export async function create(req: Request, res: Response) {
  const category = await categoryService.createCategory(req.validated.body);
  res.status(201).json(category);
}
