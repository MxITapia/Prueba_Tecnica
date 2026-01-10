export interface Product {
  id: number;
  nombre: string;
  precio: number;
  id_categoria?: number;
  categoria?: string; // Nombre de categoría (si viene del join)
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  nombre: string;
  precio: number;
  id_categoria?: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface Category {
  id: number;
  nombre: string;
  createdAt?: string;
  updatedAt?: string;
}
