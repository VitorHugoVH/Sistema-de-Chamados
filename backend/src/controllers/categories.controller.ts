import { Request, Response } from "express";
import * as categoriesService from "../services/categories.service";

export async function listar(_req: Request, res: Response) {
  const categorias = await categoriesService.listar();
  res.status(200).json(categorias);
}

export async function buscarPorId(req: Request, res: Response) {
  const categoria = await categoriesService.buscarPorId(req.validated.params.id);
  res.status(200).json(categoria);
}

export async function criar(req: Request, res: Response) {
  const categoria = await categoriesService.criar(req.validated.body);
  res.status(201).json(categoria);
}
