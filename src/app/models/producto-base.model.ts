export interface ProductoBase {
  id: number;
  nombre: string;
  descripcion: string;
  precioBase: number;
  imgPaso1: string;
  imgPaso2: string;
  imgPaso3: string;
  imgPaso4?: string;
  imgPaso5?: string;
  ingredientesCompatibles?: any[];
}
