import { ProductoBase } from '../../../models/producto-base.model';
export interface CartItem {
  cartId: string;
  productoBaseId: number,
  ingredientesIds: number[],
  nombre: string;
  imagen: string;
  bizcocho?: string;
  relleno?: string;
  cobertura?: string;
  tamano?: number;
  pisos: number;
  extras: string[];
  mensaje?: string;
  alergias?: string;
  comentarios?: string;
  precioUnitario: number;
  cantidad: number;
}
